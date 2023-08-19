function generateSvg(color) {
	return {
		path: google.maps.SymbolPath.CIRCLE,
		scale: 5,
		fillColor: color,
		fillOpacity: 0.8,
		strokeWeight: 0
	};
}

class Application
{
	// Grab API key from env file, provide an env file location
	constructor(envFile, globalCallbackName) {
		this.map = undefined;
		this.infoWindow = undefined;
		this.directionsService = undefined;
		this.directionsRenderer = undefined;
		// Load env file
		fetch("./.env").then(function(response) {
			return response.text();
		}).then(function(text) {
			let script = document.createElement('script');
		    script.type = 'text/javascript';
		    script.src = `https://maps.googleapis.com/maps/api/js?key=${text}&callback=${globalCallbackName}`;
		    script.async = true;
		    script.defer = true;
		    document.getElementsByTagName('head')[0].appendChild(script);
		});
		let that = this;
		window[globalCallbackName] = () => { that.initMap() };
	}
	calculateRoute(origin, destination) {
	    var request = {
	        origin: origin, 
	        destination: destination,
	        travelMode: 'DRIVING' // Other options include 'WALKING', 'BICYCLING', 'TRANSIT'
	    };
	    let that = this;
	    this.directionsService.route(request, function(result, status) {
	        if (status == 'OK') {
	            that.directionsRenderer.setDirections(result);
	        }
	    });
	}
	initMap() {
		const NTH_POINTS = 5;

		let that = this;
		this.infoWindow = new google.maps.InfoWindow();
		this.map = new google.maps.Map(document.getElementById('map'), {
			center: {lat: -15, lng: 135 },
			zoom: 4.6,
			mapTypeId: "satellite",
			styles: [
				{
					"featureType": "poi",
					"stylers": [
						{ "visibility": "off" }
					]
				}
			],
			zoomControl: false,
	        mapTypeControl: true,
	        scaleControl: false,
	        streetViewControl: false,
	        rotateControl: false,
	        fullscreenControl: false,
			restriction: {
	            latLngBounds: {
				    north: -10,
				    south: -45,
				    west: 107,
				    east: 159
				},
	            strictBounds: true
	        }
		});

		this.directionsService = new google.maps.DirectionsService();
		
		this.directionsRenderer = new google.maps.DirectionsRenderer();
    	this.directionsRenderer.setMap(this.map);

    	this.calculateRoute("Sydney, NSW", "Melbourn, VIC");

		// Load map data
		fetch("./data/seaports.json").then(function(response) {
			return response.json();
		}).then(function(json) {
			for (const seaport of json.features) {
				let marker = new google.maps.Marker({
			        position: { lat: parseFloat(seaport.geometry.coordinates[1]), lng: parseFloat(seaport.geometry.coordinates[0]) },
			        map: that.map,
			        title: seaport.properties.Port + " (Seaport)",
			        icon: generateSvg("#00FF00")
			    });
			    google.maps.event.addListener(marker, 'click', function() {
			        that.infoWindow.setContent(marker.title);
			        that.infoWindow.open(map, marker);
			    });
			}
		});
		fetch("./data/intermodalports.json").then(function(response) {
			return response.json();
		}).then(function(json) {
			for (const intermodalport of json.features) {
				// Only show operational ports
				if (intermodalport.properties.Status != "Operational") continue;
				let marker = new google.maps.Marker({
			        position: { lat: parseFloat(intermodalport.geometry.coordinates[0][0][1]), lng: parseFloat(intermodalport.geometry.coordinates[0][0][0]) },
			        map: that.map,
			        title: intermodalport.properties.Name.replace("IMT", "(Intermodal Terminal)"),
			        icon: generateSvg("#FF0000")
			    });
			    google.maps.event.addListener(marker, 'click', function() {
			        that.infoWindow.setContent(marker.title);
			        that.infoWindow.open(that.map, marker);
			    });
			}
		});
		fetch("./data/distribution-centres.json").then(function(response) {
			return response.json();
		}).then(function(json) {
			for (const dc of json) {
				let marker = new google.maps.Marker({
			        position: { lat: parseFloat(dc.lat), lng: parseFloat(dc.lng) },
			        map: that.map,
			        title: dc.name,
			        icon: generateSvg("#FFFF00")
			    });
			    google.maps.event.addListener(marker, 'click', function() {
			        that.infoWindow.setContent(marker.title);
			        that.infoWindow.open(that.map, marker);
			    });
			}
		});

		fetch("./data/rail_map.geojson").then(function(response) {
			return response.json();
		}).then(function(json) {
			for (const railLine of json.features) {
				let line = new google.maps.Polyline({
					title: railLine.properties.track_name,
					track_length: railLine.properties.length_km,
				    path: railLine.geometry.coordinates.filter(function(coord, i, array) {
					    return i % NTH_POINTS === 0 || i === array.length - 1;
					}).map(function(coord) {
					    return { lat: parseFloat(coord[1]), lng: parseFloat(coord[0]) };
					}),
				    geodesic: true,
				    strokeColor: '#000000',
				    strokeOpacity: 1.0,
				    strokeWeight: 3
				});
				line.setMap(that.map);
				google.maps.event.addListener(line, 'click', function(event) {
			        if (that.infoWindow) that.infoWindow.close();

	                that.infoWindow = new google.maps.InfoWindow({
	                    content: `${line.title} (${line.track_length.toFixed(2)}km)`,
	                    position: event.latLng
	                });

	                that.infoWindow.open(that.map);
			    });
			}
		});

		fetch("./data/congested_road_map.geojson").then(function(response) {
			return response.json();
		}).then(function(json) {
			console.log(json);
			for (const road of json.features) {
				let line = new google.maps.Polyline({
					title: road.properties.route_name,
					path: road.geometry.coordinates.filter(function(coord, i, array) {
					    return i % NTH_POINTS === 0 || i === array.length - 1;
					}).map(function(coord) {
					    return { lat: parseFloat(coord[1]), lng: parseFloat(coord[0]) };
					}),
				    geodesic: true,
				    strokeColor: '#FF0000',
				    strokeOpacity: 1.0,
				    strokeWeight: 3
				});
				line.setMap(that.map);
				google.maps.event.addListener(line, 'click', function(event) {
			        if (that.infoWindow) that.infoWindow.close();

	                that.infoWindow = new google.maps.InfoWindow({
	                    content: `${line.title} (High traffic road)`,
	                    position: event.latLng
	                });

	                that.infoWindow.open(that.map);
			    });
			}
		});
	}
}