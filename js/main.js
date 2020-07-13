var data = {
	"devices":[],
	"lines" :[]
},
	fname = document.querySelector("#fname"),
	nameL = document.querySelector("#nameL"),
	SubmitFormDev = document.querySelector('#submitFormDevice'),
	SubmitFormLin = document.querySelector('#submitFormLines'),
	btnClose = document.querySelectorAll('#close'),
	deviceModal = document.querySelector('#device'),
	x = 0,
	y = 0,
	x1 =[],
	y1 =[],
	x2 =[],
	yé =[],
	modalId = 0,
	map = L.map('map').setView([31.58831, -7.11138], 6);
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
	},
	rectangle :{

		allowIntersection: false,
		showArea: true,
		metric: true,
		repeatMode: true
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
		return [
			{
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
					repeatMode: true
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
map.addControl(drawControl);


SubmitFormDev.addEventListener('submit', function (e) {
	e.preventDefault();
    let result = data.devices.filter(marker => marker.id === modalId);
	if (result.length == 0) {
		data.devices.push({
			id: modalId,
			fname: fname.value,
			x: x,
			y: y
		});
		SubmitFormDev.reset();
		$('#device').modal('toggle');
	} else {
		result[0].fname = fname.value;
		SubmitFormDev.reset();
		$('#device').modal('toggle');
	}
})

SubmitFormLin.addEventListener('submit', function (e) {
	e.preventDefault();
    let result = data.lines.filter(lines => lines.id === modalId);
	if (result.length == 0) {
		data.lines.push({
			id: modalId,
			nameL: nameL.value,
			x1: x1,
			y1: y1,
			x2: x2,
			y2: y2,
		});
console.log(data)
		SubmitFormLin.reset();
		$('#lines').modal('toggle');
	} else {
		result[0].nameL = nameL.value;
		SubmitFormLin.reset();
		$('#lines').modal('toggle');
	}
})
map.on(L.Draw.Event.CREATED, function (event) {
	var  type = event.layerType,
				layer = event.layer;
			drawnItems.addLayer(layer);
			modalId = layer._leaflet_id
			if (type === 'marker') {
					SubmitFormDev.reset();
					x = layer._latlng.lat,
					y = layer._latlng.lng
					$("#device").modal();
					layer.addEventListener('click', function (e) {
					$('#device').modal('show');
					let result = data.devices.filter(marker => marker.id === e.target._leaflet_id);
					if (result.length != 0) {
						fname.value = result[0].fname;
					}
				})
			}
			if(type === 'rectangle'){
				$("#lines").modal();
				x1 = layer._latlngs[0][0],
				y1 = layer._latlngs[0][1],
				x2 = layer._latlngs[0][2],
				y2 = layer._latlngs[0][3]
				$("#lines").modal();
				layer.addEventListener('click', function (e) {
				$('#lines').modal('show');
				let result = data.lines.filter(lines => lines.id === e.target._leaflet_id);
				if (result.length != 0) {
					nameL.value = result[0].nameL;
				}
			})
			}
			//btnClose.addEventListener('click',function(e){if(event.layerType === "rectangle") {console.log('lines')}})
			for(var i=0;i<btnClose.length;i++){
				btnClose[i].addEventListener('click',function(e){
					if(type === 'marker') {
						map.eachLayer(function(layer){
							map.removeLayer(drawnItems._layers[modalId])
						})
					}else if(type === 'rectangle') {
						map.eachLayer(function(layer){
							map.removeLayer(drawnItems._layers[modalId])
						})
					}
			})
			}
		});

map.on(L.Draw.Event.EDITED, function(e) {
	var layers = e.layers;
	layers.eachLayer(function(layer) {
		var LineId = L.stamp(layer);
		if(layers.toGeoJSON().features[0].geometry.type === 'Polygon'){
			let coordinates =layers.toGeoJSON().features[0].geometry.coordinates
			console.log(coordinates)
			for (var i in data.lines) {
				if (LineId == data.lines[i].id) {
					data.lines[i].x1 = coordinates[0][0]
					data.lines[i].y1 = coordinates[0][1]
					data.lines[i].x2 = coordinates[0][2]
					data.lines[i].y2 = coordinates[0][3]
				}
				}
			console.log(data.lines)
	}
	})
		values = drawnItems._layers;
		for (var key in values) {
			for (var i in data.devices) {
				if (key == data.devices[i].id) {
					data.devices[i].x = values[key]._latlng.lat
					data.devices[i].y = values[key]._latlng.lng
				}
			}
			//console.log(data)
		}
});
//Get Data
document.querySelector('#data').addEventListener('click', function () {
	document.querySelector('.line').innerHTML = JSON.stringify(data)
})
