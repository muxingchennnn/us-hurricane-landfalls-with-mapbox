<script>
	import MapBox from '../lib/componnets/MapBox.svelte';
	let { data } = $props();
	const { usLandfallsLoc, uslandfallsGroupedByID } = data;
</script>

<MapBox {usLandfallsLoc} {uslandfallsGroupedByID} />
