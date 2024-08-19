<script>
	let { zoom, lng, lat } = $props();
</script>

<div class="sidebar">
	Longitude: {lng.toFixed(4)} | Latitude: {lat.toFixed(4)} | Zoom:
	{zoom.toFixed(2)}
</div>

<style>
	.sidebar {
		background-color: rgb(35 55 75 / 90%);
		color: #fff;
		padding: 6px 12px;
		font-family: monospace;
		z-index: 1;
		position: absolute;
		top: 0;
		left: 0;
		margin: 12px;
		border-radius: 4px;
	}
</style>
