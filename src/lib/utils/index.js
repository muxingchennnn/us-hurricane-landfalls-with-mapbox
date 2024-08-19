import * as d3 from 'd3';
import { categoryMapping } from '../constants';

// scale for width of the paths
const traceWidthScale = d3
	.scaleOrdinal()
	.domain(categoryMapping.map((d) => d.category))
	.range(categoryMapping.map((d) => d.width));

// scale for color of the paths
const traceColorScale = d3
	.scaleOrdinal()
	.domain(categoryMapping.map((d) => d.category))
	.range(categoryMapping.map((d) => d.color));

export { traceWidthScale, traceColorScale };
