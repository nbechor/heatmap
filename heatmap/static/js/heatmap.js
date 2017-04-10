
/**
 * Create a map.
 *
 * @param {string} apiPath API path
 * @param {string} containerId container ID that the map will be attached to
 * @param {{lat: float, lng: float}} initialRegion initial coordinates that the map is centered on
 * @param {bool} isPolitical renders a political map if this is set to true and a geographical map otherwise
 * @param {bool} showHeatmap renders the heatmap if set to true
 * @param {bool} showMarkers renders markers if set to true
 */
function generateMap(apiPath,
                   containerId,
                   initialRegion={lat: 39.50, lng: -98.35},
                   isPolitical=true,
                   showHeatmap=true,
                   showMarkers=true) {

    /**
     * A class representing Marker data.
     *
     * Not to be confused with google.maps.Marker
     *
     * @class Marker
     */
    class Marker {
        constructor(address, title, id, zip) {
            this.address = address;
            this.title = title;
            this.id = id;
            this.zip = zip;
        }
    }

    /**
     * Create interface
     */
    function createUI() {
        let mapContainer = document.getElementById(containerId);

        // Set container height
        mapContainer.style.height = '100%';

        function initMap() {

            let style = [];

            if (isPolitical) {
                style = [{
                        "elementType": "geometry",
                        "stylers": [{
                            "color": "#f5f5f5"
                        }]
                    },
                    {
                        "elementType": "labels.icon",
                        "stylers": [{
                            "visibility": "off"
                        }]
                    },
                    {
                        "elementType": "labels.text.fill",
                        "stylers": [{
                            "color": "#616161"
                        }]
                    },
                    {
                        "elementType": "labels.text.stroke",
                        "stylers": [{
                            "color": "#f5f5f5"
                        }]
                    }, {
                        "featureType": "administrative.neighborhood",
                        "elementType": "labels",
                        "stylers": [{
                            "visibility": "on"
                        }]
                    }, {
                        "featureType": "administrative.land_parcel",
                        "elementType": "labels",
                        "stylers": [{
                            "visibility": "on"
                        }]
                    }, {
                        "featureType": "administrative.locality",
                        "elementType": "labels",
                        "stylers": [{
                            "visibility": "on"
                        }]
                    },
                    {
                        "featureType": "administrative",
                        "elementType": "geometry",
                        "stylers": [{
                            "visibility": "on"
                        }]
                    },
                    {
                        "featureType": "administrative.country",
                        "elementType": "geometry.fill",
                        "stylers": [{
                            "visibility": "on"
                        }]
                    },
                    {
                        "featureType": "administrative.land_parcel",
                        "elementType": "labels.text.fill",
                        "stylers": [{
                            "color": "#bdbdbd"
                        }]
                    },
                    {
                        "featureType": "administrative.province",
                        "elementType": "geometry.stroke",
                        "stylers": [{
                                "color": "#8d8d8d"
                            },
                            {
                                "visibility": "on"
                            },
                            {
                                "weight": 1.5
                            }
                        ]
                    },
                    {
                        "featureType": "poi",
                        "stylers": [{
                            "visibility": "off"
                        }]
                    },
                    {
                        "featureType": "poi",
                        "elementType": "geometry",
                        "stylers": [{
                            "color": "#eeeeee"
                        }]
                    },
                    {
                        "featureType": "poi",
                        "elementType": "labels.text.fill",
                        "stylers": [{
                            "color": "#757575"
                        }]
                    },
                    {
                        "featureType": "poi.park",
                        "elementType": "geometry",
                        "stylers": [{
                            "color": "#e5e5e5"
                        }]
                    },
                    {
                        "featureType": "poi.park",
                        "elementType": "labels.text.fill",
                        "stylers": [{
                            "color": "#9e9e9e"
                        }]
                    },
                    {
                        "featureType": "road",
                        "elementType": "geometry",
                        "stylers": [{
                            "color": "#ffffff"
                        }]
                    },
                    {
                        "featureType": "road",
                        "elementType": "labels.icon",
                        "stylers": [{
                            "visibility": "off"
                        }]
                    },
                    {
                        "featureType": "road.arterial",
                        "elementType": "labels.text.fill",
                        "stylers": [{
                            "color": "#757575"
                        }]
                    },
                    {
                        "featureType": "road.highway",
                        "elementType": "geometry",
                        "stylers": [{
                            "color": "#dadada"
                        }]
                    },
                    {
                        "featureType": "road.highway",
                        "elementType": "labels.text.fill",
                        "stylers": [{
                            "color": "#616161"
                        }]
                    },
                    {
                        "featureType": "road.local",
                        "elementType": "labels.text.fill",
                        "stylers": [{
                            "color": "#9e9e9e"
                        }]
                    },
                    {
                        "featureType": "transit",
                        "stylers": [{
                            "visibility": "off"
                        }]
                    },
                    {
                        "featureType": "transit.line",
                        "elementType": "geometry",
                        "stylers": [{
                            "color": "#e5e5e5"
                        }]
                    },
                    {
                        "featureType": "transit.station",
                        "elementType": "geometry",
                        "stylers": [{
                            "color": "#eeeeee"
                        }]
                    },
                    {
                        "featureType": "water",
                        "elementType": "geometry",
                        "stylers": [{
                            "color": "#c9c9c9"
                        }]
                    },
                    {
                        "featureType": "water",
                        "elementType": "labels.text.fill",
                        "stylers": [{
                            "color": "#9e9e9e"
                        }]
                    }
                ]
            } else {
                style = '';
            }

            return new google.maps.Map(mapContainer, {
                center: initialRegion,
                scrollwheel: true,
                zoom: 5,
                styles: style
            });
        }

        return initMap();
    }

    function fetch(path, callback) {
        $.ajax({
            type: "GET",
            url: path,
            success: callback
        });
    }

    function collectMarkers(data) {
        let markers = [];

        data.events.forEach((event) => {
            let pureLocations = dataSentinel(event.locations);

            pureLocations.forEach((location) => {
                markers.push(new Marker(
                    event.address,
                    event.title,
                    event.id,
                    location));
            });
        });

        return markers;
    }

    function renderMarkers(markers) {
        markers.forEach((marker) => {
            let m = new google.maps.Marker({
                // Performance issue on a big dataset
                // animation: google.maps.Animation.DROP,
                map: map,
                position: marker.zip,
                title: marker.title
            });

            google.maps.event.addListener(m, 'click', function () {
                let info = new google.maps.InfoWindow();
                info.setContent(
                    '<b>Address:</b> ' + marker.address + '<br>' +
                    '<b>Title:</b> ' + marker.title + '<br>' +
                    '<b>ID:</b> ' + marker.id + '<br>');
                info.open(map, this);
            });
        });
    }

    function renderHeatmap(markers) {
        let coord = [];

        markers.forEach((marker) => {
            coord.push(
                new google.maps.LatLng(marker.zip)
            );
        });

        let heatmap = new google.maps.visualization.HeatmapLayer({
            data: coord,
            map: map,
            radius: 45,
            maxIntensity: 10
        });
    }

    /**
     * Data sentinel ensures data consistency by filtering out points that are not located in the US.
     *
     * Source: http://answers.google.com/answers/threadview?id=149284
     */
    function dataSentinel(data) {
        let north_lat = 49.3457868; // top
        let west_lng = -124.7844079; // left
        let east_lng = -66.9513812; // right
        let south_lat = 24.7433195; // bottom

        let clean = data.filter(point =>
            south_lat <= point.lat &&
            point.lat <= north_lat &&
            west_lng <= point.lng &&
            point.lng <= east_lng);

        return clean;
    }

    function renderUI() {
        if (showHeatmap && showMarkers) {
            fetch(apiPath, data => {
                let parsedData = JSON.parse(data);
                let markers = collectMarkers(parsedData);
                renderHeatmap(markers);
                renderMarkers(markers);
            });

        } else if (showHeatmap) {
            fetch(apiPath, data => {
                let parsedData = JSON.parse(data);
                let markers = collectMarkers(parsedData);
                renderHeatmap(markers);
            });
            
        } else if (showMarkers) {
            fetch(apiPath, data => {
                let parsedData = JSON.parse(data);
                let markers = collectMarkers(parsedData);
                renderMarkers(markers);
            });
        }
    }

    const map = createUI();
    renderUI();
}