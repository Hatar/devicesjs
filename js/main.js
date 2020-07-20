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
	list_icones = document.querySelector('#icones'),
	colors = ['#1E90FF', '#FF1493', '#32CD32', '#FF8C00', '#4B0082'],
	drawingManager,
	selectedColor,
	selectedShape,
	colorButtons = {},
	x = 0,
	y = 0,
	x1 =[],
	y1 =[],
	x2 =[],
	y2 =[],
	modalId = 0,
	map = L.map('map').setView([31.58831, -7.11138], 6);
	L.tileLayer('https://via.placeholder.com/{z}/{x}/{y}.png').addTo(map);
	clearBtn.onclick = (e)=>{
		if(id_layer.value) drawnItems._layers[id_layer.value]._icon.src = document.querySelector("#image_1").src
	};

	useBtn.onclick =  (e)=>{
		if(id_layer.value) drawnItems._layers[id_layer.value]._icon.src = document.querySelector("#image_2").src
	};

	warBtn.onclick =  (e)=>{
		if(id_layer.value) drawnItems._layers[id_layer.value]._icon.src = document.querySelector("#image_3").src
	};

	var drawnItems = new L.FeatureGroup();
	map.addLayer(drawnItems);

	var drawControl = new L.Control.Draw({
		edit: {
			featureGroup: drawnItems,
		},
		rectangle :{
			allowIntersection: false,
			showArea: true,
			metric: true,
			repeatMode: true,
		}
	});

	var customMarker = L.Icon.extend({
		options: {
			iconSize: new L.polygon(30, 30),
			iconUrl: "../image/detecteur.png"
		}
	})


L.DrawToolbar.include({
	getModeHandlers: function (map) {
		return [
			{
				enabled: true,
				handler: new L.Draw.Rectangle(map, {
					allowIntersection: false,
					showArea: true,
					metric: true,
					repeatMode: true,
					shapeOptions: {
						color: '#F2F2F2',
						weight: 5,
						fillOpacity: .5
					}
				}),
				title: 'Add Line ',
			},
			{
				enabled: true,
				handler: new L.Draw.Marker(map, {
				//icon: new L.Icon.Default()
				//	icon:new configMarker()
				}),
				title: 'Add Device'
			},
			{
				enabled: true,
				handler: new L.Draw.Marker(map, {
					icon: new customMarker()
				}),
				title: 'Add Detecteur',
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
				//layer._icon.src = document.querySelector('#image_3').src
				SubmitFormDev.reset();
				  id_layer.value = layer._leaflet_id
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
				console.log(layer)
				btnColor.addEventListener('click',function(e){
					var r = Math.floor(Math.random() * 256);
					var g = Math.floor(Math.random() * 256);
					var b = Math.floor(Math.random() * 256);
					//var color = "rgb" + "(" + r + "," + g + "," + b + ")";
					var color="#FFF"
					//console.log(drawnItems._layers[layer._leaflet_id].options)
					drawnItems._layers[layer._leaflet_id].options.color = color
				})

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


function selectColor(color){
	selectedColor=color;
	for(var i=0;i<colors.length;i++){
		let currentColor = colors[i]
		colorButtons[currentColor].style.border =currentColor == color ? '2px solid #333' : '2px solid #fff';
	}
}
buildColorPalette();
function buildColorPalette() {
	var colorPalette = document.getElementById('color-palette');
	for (var i = 0; i < colors.length; ++i) {
		var currColor = colors[i];
		var colorButton = makeColorButton(currColor);
		colorPalette.appendChild(colorButton);
		colorButtons[currColor] = colorButton;
	}
	selectColor(colors[0]);
}

function makeColorButton(color) {
	var button = document.createElement('span');
	button.className = 'color-button';
	button.style.backgroundColor = color;
	L.DomEvent.addListener(button, 'click', function() {
		selectColor(color);
	});
	return button;
}




