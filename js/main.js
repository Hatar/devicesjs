	var data = {
	"devices":[],
	"lines" :[]
},
	DataFile =[]
	fname = document.querySelector("#fname"),
	nameL = document.querySelector("#nameL"),
	SubmitFormDev = document.querySelector('#submitFormDevice'),
	SubmitFormLin = document.querySelector('#submitFormLines'),
	btnClose = document.querySelectorAll('#close'),
	deviceModal = document.querySelector('#device'),
	list_icones = document.querySelector('#icones'),
	x = 0,
	y = 0,
	x1 =[],
	y1 =[],
	x2 =[],
	yé =[],
	modalId = 0,
	files = [],
	map = L.map('map').setView([31.58831, -7.11138], 6);
	L.tileLayer('https://via.placeholder.com/{z}/{x}/{y}.png').addTo(map);

// FeatureGroup is to store editable layers

var drawnItems = new L.FeatureGroup();
map.addLayer(drawnItems);
var drawControl = new L.Control.Draw({
	edit: {
		featureGroup: drawnItems,
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
	},
	draw:{
		polygon: {
      shapeOptions: {
        editing: {
          className: ""
	}}}}
});


var customMarker = L.Icon.extend({
	options: {
		iconSize: new L.Point(30, 30),
		iconUrl: "../image/redMarker.png"
	}
})

var markrConfig = L.Icon.extend({
	option:{
		iconSize: new L.Point(30, 30),
		iconUrl: document.querySelector('#image_3').src
	}
})

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
						modalId = e.target._leaflet_id
						$('#device').modal('show');
						let result = data.devices.filter(device => device.id == e.target._leaflet_id);
						if (result.length !== 0) {
							fname.value = result[0].fname;
						}
						$('#device').modal('toggle');
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
				modalId = e.target._leaflet_id
				$('#lines').modal('show');
				let result = data.lines.filter(lines => lines.id === e.target._leaflet_id);
				if (result.length != 0) {
					nameL.value = result[0].nameL;
				}
			})
			}
			for(var i=0;i<btnClose.length;i++){
				btnClose[i].addEventListener('click',function(e){
					if(type === 'marker' && fname.value === '') {
						map.eachLayer(function(layer){
							map.removeLayer(drawnItems._layers[modalId])
						})
					}else if(type === 'rectangle' && nameL.value === '') {
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
			for (var i in data.lines) {
				if (LineId == data.lines[i].id) {
					data.lines[i].x1 = coordinates[0][0]
					data.lines[i].y1 = coordinates[0][1]
					data.lines[i].x2 = coordinates[0][2]
					data.lines[i].y2 = coordinates[0][3]
				}
				}
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
		}
});

//Get Data
document.querySelector('#data').addEventListener('click', function () {
	document.querySelector('.line').innerHTML = JSON.stringify(data)
})

function ShowIcon(input, selector){
	if (input.files && input.files[0])
	{
		var reader = new FileReader();
		reader.onload = function (e) {
		$('#'+selector).attr('src', e.target.result)
		 };
		reader.readAsDataURL(input.files[0]);
	}
}

function saveData() {
  var data = new FormData(document.getElementById("myForm"));
	var inputs = document.querySelectorAll('input[type=file]');
	Array.prototype.forEach.call(inputs[0].files, function(index){
		data.append('files', index);
	});
	DataFile.push(data.getAll("myFile[]"))
};
