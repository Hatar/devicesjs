var data = {
	"devices":[]
},
	fname = document.querySelector("#fname"),
	SubmitForm = document.querySelector('#submitForm'),
	btnClose = document.querySelector('#close'),
	deviceModal = document.querySelector('#device'),
	x = 0,
	y = 0,
	modalId = 0;
var map = L.map('map').setView([31.58831, -7.11138], 6);

L.tileLayer('https://via.placeholder.com/{z}/{x}/{y}.png', {
	attribution: '© <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// FeatureGroup is to store editable layers

var drawnItems = new L.FeatureGroup();
map.addLayer(drawnItems);
var drawControl = new L.Control.Draw({
	edit: {
		featureGroup: drawnItems
	},
	circle: {
		shapeOptions: {
			color: '#662d91'
		}
	}
});


var customMarker = L.Icon.extend({
	options: {
		iconSize: new L.Point(70, 70),
		iconUrl: "https://img.icons8.com/dusk/64/000000/garage--v1.png"
	}
});

L.DrawToolbar.include({
	getModeHandlers: function (map) {
		return [{
				enabled: true,
				handler: new L.Draw.Polyline(map, {
					metric: true,
					repeatMode: true
				}),
				title: '...'
			},
			{
				enabled: true,
				handler: new L.Draw.Polygon(map, {
					allowIntersection: false,
					showArea: true,
					metric: true,
					repeatMode: false
				}),
				title: '...'
			},
			{
				enabled: true,
				handler: new L.Draw.Rectangle(map, {
					allowIntersection: false,
					showArea: true,
					metric: true,
					repeatMode: false
				}),
				title: 'Add Line ',
			},
			{
				enabled: true,
				handler: new L.Draw.Circle(map, {
					allowIntersection: false,
					showArea: true,
					metric: true,
					repeatMode: false
				}),
				title: 'Add Detecteur'
			},
			{
				enabled: true,
				handler: new L.Draw.Marker(map, {
					icon: new L.Icon.Default()
				}),
				title: 'Add Marker'
			},
			{
				enabled: true,
				handler: new L.Draw.Marker(map, {
					icon: new customMarker()
				}),
				title: 'Add Device',
			}
		];
	}
});

SubmitForm.addEventListener('submit', function (e) {
	e.preventDefault();
    let result = data.devices.filter(marker => marker.id === modalId);
	if (result.length == 0) {
		data.devices.push({
			id: modalId,
			fname: fname.value,
			x: x,
			y: y
		});
		console.log(data)
		SubmitForm.reset();
		$('#device').modal('toggle');
	} else {
		result[0].fname = fname.value;
		SubmitForm.reset();
		$('#device').modal('toggle');
	}
})
map.addControl(drawControl);
map.on('draw:created', function (event) {
	$("#device").modal();
	var layer = event.layer,
			type = event.layerType;
			x = layer._latlng.lat,
			y = layer._latlng.lng
			drawnItems.addLayer(layer);
			modalId = layer._leaflet_id
			SubmitForm.reset();
			//Click Button Close
			btnClose.addEventListener('click',function(e){
				if(fname.value === ''){
						map.eachLayer(function(layer){
						map.removeLayer(drawnItems._layers[modalId])
					})
				}
			})
			if (type === 'marker') {
					layer.addEventListener('click', function (e) {
					$('#device').modal('show');
					let result = data.devices.filter(marker => marker.id === e.target._leaflet_id);
					if (result.length != 0) {
						fname.value = result[0].fname;
					}
				})
			}
});


map.on(L.Draw.Event.EDITSTOP, function(e) {
	let values = drawnItems._layers
	for (var key in values) {
		for (var i in data.devices) {
			if (key == data.devices[i].id) {
				data.devices[i].x = values[key]._latlng.lat
				data.devices[i].y = values[key]._latlng.lng
			}
		}
		console.log(data)
	}
});

//Get Data
document.querySelector('#data').addEventListener('click', function () {
	document.querySelector('.line').innerHTML = JSON.stringify(data)
})
