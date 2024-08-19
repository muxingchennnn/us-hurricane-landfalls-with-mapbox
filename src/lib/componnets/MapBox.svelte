<script>
	import mapboxgl from 'mapbox-gl';
	import * as d3 from 'd3';
	import StatBar from './StatBar.svelte';
	import { traceWidthScale, traceColorScale } from '../utils';

	let { usLandfallsLoc, uslandfallsGroupedByID } = $props();

	let width = $state();
	let height = $state();
	let map = $state();
	let mapParams = $state({
		zoom: 4.4,
		lng: -64.6293,
		lat: 36.4356,
		projection: { name: 'mercator' }
	});
	let projection = $state(() => [0, 0]); // Map the [lng, lat] date to the position on the Mapbox map
	let traceProjection = $derived(
		d3
			.line()
			.x((d) => projection([d.Longtitude, d.Latitude]).at(0))
			.y((d) => projection([d.Longtitude, d.Latitude]).at(1))
			.curve(d3.curveBasis)
	);
	let hoveredDot = $state();
	let hoveredPath = $state();

	function updateMapParams() {
		mapParams.zoom = map.getZoom();
		mapParams.lng = map.getCenter().lng;
		mapParams.lat = map.getCenter().lat;
	}

	function updateProj(mapboxObj) {
		return function (coordinates) {
			let [lon, lat] = coordinates;
			let point = mapboxObj.project(new mapboxgl.LngLat(lon, lat));
			return [point.x, point.y];
		};
	}

	function handleHover(e, dot) {
		if (e.type === 'mouseover') {
			hoveredDot = dot;
			hoveredPath = uslandfallsGroupedByID.get(`${dot.ID}`);
		} else if (e.type === 'mouseout') {
			hoveredDot = null;
			hoveredPath = null;
		}
	}

	$effect(() => {
		if (!map) {
			mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

			map = new mapboxgl.Map({
				container: document.querySelector('#map'), // Container ID
				projection: mapParams.projection,
				style: 'mapbox://styles/mapbox/dark-v11/', // Style URL
				// style: 'mapbox://styles/ikechannnn/clxmldfbn02ck01qj16le6x3n', // Style URL
				center: [mapParams.lng, mapParams.lat], // Starting position [lng, lat]
				zoom: mapParams.zoom, // Starting zoom
				minZoom: 4,
				maxZoom: 8,
				scrollZoom: false,
				hash: false,
				touchZoomRotate: false
			});

			map.on('load', () => {
				// Add navigation control
				map.addControl(new mapboxgl.NavigationControl(), 'top-right');
				// Update projection function when the map is loaded
				projection = updateProj(map);
			});

			// map.on('viewreset', updateDotsPos);
			map.on('move', () => {
				// Update projection function when the map is moved
				projection = updateProj(map);
				updateMapParams();
			});
			map.on('moveend', () => {});
		}

		return () => {};
	});
</script>

<StatBar {...mapParams} />
<div id="map" bind:clientWidth={width} bind:clientHeight={height}>
	<svg {width} {height}>
		<g class="hurricane-trace">
			{#if hoveredPath}
				{#each hoveredPath as _, i}
					<path
						class="interval"
						d={traceProjection(hoveredPath.slice(i, i + 2))}
						fill={'none'}
						stroke-linejoin={'round'}
						stroke-linecap={'round'}
						stroke={traceColorScale(hoveredPath.slice(i, i + 2).at(0).Category)}
						stroke-width={traceWidthScale(
							hoveredPath.slice(i, i + 2).at(0).Category
						)}
					/>
				{/each}
			{/if}
		</g>
		<g class="dots">
			{#each usLandfallsLoc as dot (crypto.randomUUID())}
				<circle
					cx={projection([+dot.Longtitude, +dot.Latitude])[0]}
					cy={projection([+dot.Longtitude, +dot.Latitude])[1]}
					fill={dot.Category >= 3 ? '#C5284D' : '#5185A1'}
					r={hoveredDot === dot ? 16 : 4}
					opacity={hoveredDot ? (hoveredDot === dot ? 1 : 0.2) : 0.6}
					onmouseover={(e) => handleHover(e, dot)}
					onmouseout={(e) => handleHover(e, dot)}
				/>
			{/each}
		</g>
	</svg>
</div>

<style>
	#map {
		position: relative;
		width: 100%;
		height: 100svh;
		/* overflow: hidden; */

		& svg {
			position: absolute;
			top: 0;
			left: 0;
			pointer-events: none;
			z-index: 99;

			& g {
				pointer-events: auto;

				& circle {
					transition:
						r 300ms ease,
						opacity 500ms ease;
					cursor: pointer;
				}
			}
		}
	}
</style>
