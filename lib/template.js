'use strict';

const _ = require('lodash');

module.exports = function Template(options) {
	const o = Object.assign({}, {
		ignoreEventTypes: [],
	}, options);

	return function template(eventsByLanguage) {
		return _(eventsByLanguage).map(eventsByLanguageTemplate).join('\n');
	}

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

	function eventTemplate(event) {
		const { title, room, start, duration, id, language } = event;
		const speakers = event.persons.map(p => p.name).join(', ');
		const type = o.ignoreEventTypes.includes(event.type) ? '' : ` (${_.upperFirst(event.type)})`;

		return `
			<strong>${start}</strong> +${duration}, ${room} [${language}]<br>
			<strong>${title}</strong>${type}<br>
			${speakers}<br>
			https://events.ccc.de/congress/2015/Fahrplan/events/${id}.html<br>
			<br>
			<br>
			<br>
			`;
	}
}
