import * as d3 from 'd3';
import * as turf from '@turf/turf';
import * as topojson from 'topojson-client';

export async function load() {
	// load data
	const landfallData = await d3.csv(
		'/hurricane-landfalls.csv',
		parseLandfallData
	);
	const stateData = await d3.json('/states-10m.json');

	// Use point in polygon function to filter us landfalls
	const states = topojson.feature(stateData, stateData.objects.nation);
	const usPolygon = turf.multiPolygon(states.features[0].geometry.coordinates);
	const usLandfallsLoc = landfallData
		.filter((d) => d.Event === 'L') // First filter out all the landfalls
		.filter((d) => {
			const point = turf.point([d.Longtitude, d.Latitude]);
			return turf.booleanPointInPolygon(point, usPolygon);
		}); // Then filter out landfalls within the States

	const uslandfallsGroupedByID = d3.group(landfallData, (d) => d.ID);
	return {
		usLandfallsLoc,
		uslandfallsGroupedByID
	};
}

function parseLandfallData(d) {
	return {
		ID: d.ID,
		Name: d.Name,
		Year: +d.Year,
		Time: d.Time,
		Date: convertDate(d.Date),
		Event: d.Event,
		Status: d.Status,
		Latitude: +d.Latitude,
		Longtitude: +d.Longtitude,
		MPH: +d.MPH,
		Knots: +d.Knots,
		Category: d.Category
	};
}

function convertDate(dateStr) {
	const parts = dateStr.split('/');
	let year = parseInt(parts[2], 10);

	// Adjust for two-digit year (assuming 20th century)
	if (year < 100) {
		year += 1900;
	}

	const month = parts[0].padStart(2, '0');
	const day = parts[1].padStart(2, '0');

	return `${month}/${day}/${year}`;
}

export const ssr = false;
