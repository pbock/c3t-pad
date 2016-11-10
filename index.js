'use strict';

const streamToPromise = require('stream-to-promise');
const fs = require('fs');
const _ = require('lodash');

const Template = require('./lib/template');
const parse = require('./lib/parse');

streamToPromise(process.stdin)
	.then(parse)
	.then((days) => {
		const mostCommonEventType = _(days)
			.map(d => d.events)
			.flatten()
			.countBy('type')
			.toPairs()
			.maxBy(1)[0];

		const template = Template({ ignoreEventTypes: [ mostCommonEventType ] });

		days.forEach((day) => {
			const eventsByLanguage = _(day.events)
				.sortBy('room')
				.sortBy('date')
				.groupBy('language')
				.map((events, language) => ({ events, language }))
				.sortBy('language')
				.value()

			fs.writeFileSync(`day${day.index}.html`, template(eventsByLanguage));
		})
	})
	.catch(e => console.error(e.stack))
