(function main(ctx) {
	let map;

	ctx.initMap = function initMap() {
		map = new google.maps.Map(document.getElementById('map'), {
		center: {lat: -25, lng: 135 },
		zoom: 4,
		mapTypeId: "roadmap",
		styles: [
			{
				"featureType": "poi",
				"stylers": [
					{ "visibility": "off" }
				]
			}
		],
		disableDefaultUI: true,
		restriction: {
            latLngBounds: {
			    north: -5,
			    south: -49,
			    west: 107,
			    east: 159
			},
            strictBounds: false
        }
		});
		fetch("./data/seaports.json").then(function(response) {
			return response.json();
		}).then(function(json) {
			for (const seaport of json.features) {
				let marker = new google.maps.Marker({
			        position: { lat: parseFloat(seaport.geometry.coordinates[1]), lng: parseFloat(seaport.geometry.coordinates[0]) },
			        map: map,
			        title: seaport.properties.Port,
			        icon: {
						path: google.maps.SymbolPath.CIRCLE,
						scale: 5,
						fillColor: "#00FF00",
						fillOpacity: 0.8,
						strokeWeight: 0
					}
			    });
			}
		});

		fetch("./data/intermodalports.json").then(function(response) {
			return response.json();
		}).then(function(json) {
			for (const intermodalport of json.features) {
				if (intermodalport.properties.Status != "Operational") continue;
				let marker = new google.maps.Marker({
			        position: { lat: parseFloat(intermodalport.geometry.coordinates[0][0][1]), lng: parseFloat(intermodalport.geometry.coordinates[0][0][0]) },
			        map: map,
			        title: intermodalport.properties.Name,
			        icon: {
						path: google.maps.SymbolPath.CIRCLE,
						scale: 5,
						fillColor: "#FF0000",
						fillOpacity: 0.8,
						strokeWeight: 0
					}
			    });
			}
		});
	}
    fetch("./.env").then(function(response) {
		return response.text();
	}).then(function(text) {
		let script = document.createElement('script');
	    script.type = 'text/javascript';
	    script.src = `https://maps.googleapis.com/maps/api/js?key=${text}&callback=initMap`;
	    script.async = true;
	    script.defer = true;
	    document.getElementsByTagName('head')[0].appendChild(script);
	});
})(this);