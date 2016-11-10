'use strict';

const streamToPromise = require('stream-to-promise');
const fs = require('fs');
const _ = require('lodash');

// Parses the XML into a JS structure that's easier to work with
const parse = require('./lib/parse');
// Takes a list of events grouped by language and turns it into awful HTML
const Template = require('./lib/template');

streamToPromise(process.stdin)
	.then(parse)
	.then((days) => {
		// Find the most common event type.
		// It will get ignored in the template (this is useful because
		// nearly all events at CCC are set to "lecture").
		const mostCommonEventType = _(days)
			.map(d => d.events)
			.flatten()
			.countBy('type')
			.toPairs()
			.maxBy(1)[0];

		// Initialise the template
		const dayTemplate = Template({ ignoreEventTypes: [ mostCommonEventType ] });

		days.forEach((day) => {
			// Events are grouped by language and sorted by time first, room second
			const eventsByLanguage = _(day.events)
				.sortBy('room')
				.sortBy('date')
				.groupBy('language')
				.map((events, language) => ({ events, language }))
				.sortBy('language')
				.value()

			fs.writeFileSync(`day${day.index}.html`, dayTemplate(eventsByLanguage));
		})

	})
	.catch(e => console.error(e.stack))
