<script>

    // Create globals so leaflet can load
    const window = {};
    const document = {
        documentElement: { style: {} },
        getElementsByTagName: () => [],
        createElement: () => {}
    };
    const navigator = {
        userAgent: 'nodejs'
    };

    // Dependencies
    import { onMount } from 'svelte';
    import 'leaflet'; // https://docs.mapbox.com/mapbox-gl-js/api/

    // Main Process
    // onMount(() => {
    //     import L from 'leaflet';
    //     navigator.geolocation.getCurrentPosition(position => {
    //         const map = L.map("map").setView([33.802841, -117.973333], 12);
    //         var marker = L.marker([33.802841, -117.973333]).addTo(map);
    //     });
    // });

</script>

<div id="map"></div>