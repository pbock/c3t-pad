'use strict';

const _ = require('lodash');

module.exports = function Template(options) {
	const o = Object.assign({}, {
		ignoreEventTypes: [],
		title: 'Unknown event',
		version: new Date().toString(),
		acronym: options.title || '?',
	}, options);

	// Level one
	return function template({ eventsByLanguage, eventsByTime }) {
		const { day } = eventsByTime[0];
		const events = _(eventsByTime).map(eventTemplate).join('\n');
		const header = `<strong>Translations for ${o.acronym}</strong> ·
			<strong>Day ${day}</strong><br>
			Version ${o.version}<br><br>`;
		const tableOfContents = `<strong>Overview by language</strong><br><br>` + _(eventsByLanguage).map(eventsByLanguageTemplate).join('<br>');
		return header + events + tableOfContents;
	}

	// Level two
	// Generates the heading for language groups and hands the events
	// down to the next level
	function eventsByLanguageTemplate({ events, language }) {
		const title = ({
			de: 'de → en',
			en: 'en → de',
		})[language] || language;

		return `
			<strong>${title}</strong><br>
			${events.map(tocTemplate).join('\n')}
			`;
	}

	// Level three a
	// Generates the listing for each individual event
	function eventTemplate(event) {
		const { title, room, start, duration, id, language, sequentialNumber, guid } = event;
		const speakers = event.persons.map(p => p.name).join(', ');
		const type = o.ignoreEventTypes.includes(event.type) ? '' : ` (${_.upperFirst(event.type)})`;

		const targetLanguages = ({
			en: '→ de ',
			de: '→ en ',
		})[language] || '→ ';

		// Yes, this is awful HTML, but its only job is to be parsed by EtherPad,
		// so I won't even bother cleaning up the indentation.
		return `
			#${sequentialNumber}<br>
			[${language}] <strong>${start}</strong> +${duration}, ${room}<br>
			<strong>${title}</strong>${type}<br>
			${speakers}<br>
			Fahrplan: ${options.baseUrl}events/${id}.html<br>
			Slides (if available): https://speakers.c3lingo.org/talks/${guid}/<br>
			${targetLanguages}<br>
			<br>
			<br>
			<br>
			`;
	}

	// Level three b
	// Generates the listing for the table of contents
	function tocTemplate(event) {
		const { start, duration, title, sequentialNumber } = event;
		return `<strong>${start}</strong>
		+${duration}
		#${sequentialNumber}
		${title}
		<br>`
	}
}
