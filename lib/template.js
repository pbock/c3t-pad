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
	return function template(eventsByLanguage) {
		const { day } = eventsByLanguage[0].events[0];
		const events = _(eventsByLanguage).map(eventsByLanguageTemplate).join('\n<br><br><br>');
		const header = `<strong>Translations for ${o.acronym}</strong> ·
			<strong>Day ${day}</strong><br>
			Version ${o.version}<br><br>`;
		return header + events;
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
			<br>
			${events.map(eventTemplate).join('\n')}
			`;
	}

	// Level three
	// Generates the listing for each individual event
	function eventTemplate(event) {
		const { title, room, start, duration, id, language } = event;
		const speakers = event.persons.map(p => p.name).join(', ');
		const type = o.ignoreEventTypes.includes(event.type) ? '' : ` (${_.upperFirst(event.type)})`;

		// Yes, this is awful HTML, but its only job is to be parsed by EtherPad,
		// so I won't even bother cleaning up the indentation.
		return `
			<strong>${start}</strong> +${duration}, ${room} [${language}]<br>
			<strong>${title}</strong>${type}<br>
			${speakers}<br>
			https://fahrplan.events.ccc.de/congress/2016/Fahrplan/events/${id}.html<br>
			<br>
			<br>
			<br>
			`;
	}
}
