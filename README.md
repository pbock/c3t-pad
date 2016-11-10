# c3t-pad

A tool that takes a Chaos Communication Congress schedule in XML format and spits it out in a format that's ready to be pasted into EtherPad.

## Usage

First, clone this repository and run `yarn install` (or `npm install`).

Then:

```sh
$ curl https://events.ccc.de/congress/2015/Fahrplan/schedule.xml | node index.js
```

Of course, the XML doesn't have to come from curl; you can just as well pipe in a local file.

This will spit out sequentially numbered files in your current working directory; one for each day of the conference (`day1.html`, `day2.html`, …).

Open each of them in a web browser, copy everything and paste it into an appropriate EtherPad.

## Licence

[The MIT License; see the LICENSE file.](LICENSE)
