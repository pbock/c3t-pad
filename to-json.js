'use strict';

const streamToPromise = require('stream-to-promise');
const fs = require('fs');
const _ = require('lodash');

// Parses the XML into a JS structure that's easier to work with
const parse = require('./lib/parse');

streamToPromise(process.stdin)
	.then(parse)
	.then(({ days }) => {
		const events = _(days).map('events').flatten().value();
		fs.writeFileSync('events.json', JSON.stringify(events));
	})
