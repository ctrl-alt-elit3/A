function generateSvg(color) {
	return {
		path: google.maps.SymbolPath.CIRCLE,
		scale: 5,
		fillColor: color,
		fillOpacity: 0.8,
		strokeWeight: 0
	};
}

//todo start and finish buttons add to search

function addEventListener(marker)
{
	marker.addListener('click', function() {
    	app.infoWindow.close();

	    var contentString = `
	        <div>
	            <h2>${marker.title}</h2>
	            <button id="setStart">Set start</button>
	            <button id="setDestination">Set as dest</button>
	        </div>
	    `;

	    app.infowindow = new google.maps.InfoWindow({
	        content: contentString
	    });

	    app.infowindow.open(map, marker);

	    console.log("CLicked");

	    google.maps.event.addListener(app.infowindow, 'domready', function() {
	        var setStartBtn = document.getElementById('setStart');
	        var setDestinationBtn = document.getElementById('setDestination');

	        setStartBtn.addEventListener('click', function() {
	            document.getElementById('start').value = marker.title;
	            app.infowindow.close();
	        });

	        setDestinationBtn.addEventListener('click', function() {
	            document.getElementById('end').value = marker.title;
	            app.infowindow.close();
	        });
	    });
	});
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
	    	console.log(status);
	    	console.log(result);
	        if (status == 'OK') {
	            that.directionsRenderer.setDirections(result);
	        } else if (status == "NOT_FOUND")
	        {
	        	alert("Either the start or desitination was not set or our algorithms could not determine a feasible route between the 2 points");
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
				    north: -5,
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

		// Load map data
		fetch("./data/seaports.json").then(function(response) {
			return response.json();
		}).then(function(json) {
			for (const seaport of json.features) {
				let marker = new google.maps.Marker({
			        position: { lat: parseFloat(seaport.geometry.coordinates[1]), lng: parseFloat(seaport.geometry.coordinates[0]) },
			        map: that.map,
			        title: seaport.properties.Port,
			        icon: generateSvg("#00FF00")
			    });
			    addEventListener(marker, that);
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
			        title: intermodalport.properties.Name.replace("IMT", ""),
			        icon: generateSvg("#FF0000")
			    });
			    addEventListener(marker, that);
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
			    addEventListener(marker, that);
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

		fetch("./data/roads.geojson").then(function(response) {
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
					strokeColor: '#FFFF00',
					strokeOpacity: 1.0,
					strokeWeight: 3
				});
				line.setMap(that.map);
				google.maps.event.addListener(line, 'click', function(event) {
					if (that.infoWindow) that.infoWindow.close();

					that.infoWindow = new google.maps.InfoWindow({
						content: `${line.title} (Roads)`,
						position: event.latLng
					});

					that.infoWindow.open(that.map);
				});
			}
		});

		document.getElementById("form").addEventListener("submit", function()
		{
			event.preventDefault();
			that.calculateRoute(document.getElementById("start").value, document.getElementById("end").value);
		});
	}
}