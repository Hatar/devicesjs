//Variable
var socket = io.connect('http://localhost:5000'),
	data = {
		"devices": [],
		"lines": [],
		"capteurs": []
	},
	fname = document.querySelector("#fname"),
	nameL = document.querySelector("#nameL"),
	nameD = document.querySelector("#nameD"),
	SubmitFormDev = document.querySelector('#submitFormDevice'),
	SubmitFormLin = document.querySelector('#submitFormLines'),
	SubmitFormCap = document.querySelector('#submitFormCap'),
	save = document.querySelector('#savedevice'),
	deviceModal = document.querySelector('#device'),
	list_icones = document.querySelector('#icones'),
	colors = ['#1E90FF', '#FF1493'],
	selectedColor,
	customColor,
	colorButtons = {},
	polyline ="",
	x = 0,
	y = 0,
	x1 = [],
	y1 = [],
	x2 = [],
	y2 = [],
	modalId = 0,
	map = L.map('map').setView([31.58831, -7.11138], 6);
	L.tileLayer('https://via.placeholder.com/{z}/{x}/{y}.png').addTo(map);

	//change Image Device By Socket
	socket.on('data_devices', function (result) {
		clearBtn.onclick = (e) => {
			let res_device = result.filter(res => res.id === id_layer.value)
			let _id = res_device[0].id
			id_layer.value !== _id ? drawnItems._layers[id_layer.value]._icon.src : drawnItems._layers[id_layer.value]._icon.src = document.querySelector("#image_1").src
		};
		useBtn.onclick = (e) => {
			let res_device = result.filter(res => res.id === id_layer.value)
			let _id = res_device[0].id
			id_layer.value !== _id ? drawnItems._layers[id_layer.value]._icon.src : drawnItems._layers[id_layer.value]._icon.src = document.querySelector("#image_2").src
		};
		warBtn.onclick = (e) => {
			let res_device = result.filter(res => res.id === id_layer.value)
			let _id = res_device[0].id
			id_layer.value !== _id ? drawnItems._layers[id_layer.value]._icon.src : drawnItems._layers[id_layer.value]._icon.src = document.querySelector("#image_3").src
		};
	})

//Initial Map
var drawnItems = new L.FeatureGroup();
map.addLayer(drawnItems);
var drawControl = new L.Control.Draw({
	edit: {
		featureGroup: drawnItems,
		remove: false
	}
});//End Draw Control

var customMarker = L.Icon.extend({
	options: {
		iconSize: new L.Point(30, 30),
		iconUrl: "https://img.icons8.com/dusk/64/000000/garage--v1.png",
	}
});

L.Draw.Capteur = L.Draw.Marker.extend({
	statics : {
		TYPE :'capteur'
	},
	options: {
		icon: new customMarker(),
		repeatMode: false,
		zIndexOffset: 2000 // This should be > than the highest z-index any markers
	},
	initialize: function (map, options) {
		// Save the type so super can fire, need to do this as cannot do this.TYPE :(
		this.type = L.Draw.Capteur.TYPE;

		L.Draw.Feature.prototype.initialize.call(this, map, options);
	}
})//End Draw Capteur



//Custom Icon Toolbar
L.DrawToolbar.prototype.getModeHandlers = function(map){
	return [{
		enabled: true,
		handler: new L.Draw.Rectangle(map, {
			allowIntersection: false,
			showArea: true,
			metric: true,
			repeatMode: true,
			shapeOptions: {
				color: "#F2F2F2",
				weight: 5,
				fillOpacity: .5
			}
		}),
		title: 'Add Line ',
	},
	{
		enabled: true,
		handler: new L.Draw.Marker(map, { icon: new L.Icon.Default() }),
		title: 'Add Device'
	},
	{
		enabled: true,
		handler: new L.Draw.Capteur(map, this.options.capteur),
		title: 'Add Capteur',
	}
	];
};
map.addControl(drawControl);


//Submit Form [Device,Line,Detecteur]
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
		socket.emit('device', data.devices)
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
		socket.emit('line', data.lines)
		SubmitFormLin.reset();
		$('#lines').modal('toggle');
	} else {
		result[0].nameL = nameL.value;
		SubmitFormLin.reset();
		$('#lines').modal('toggle');
	}
})
SubmitFormCap.addEventListener('submit', function (e) {
	e.preventDefault();
	let result = data.capteurs.filter(capteur => capteur.id === modalId);
	if (result.length == 0) {
		data.capteurs.push({
			id: modalId,
			nameC: nameC.value,
			x: x,
			y: y
		});
		socket.emit('capteur', data.capteurs)
		SubmitFormCap.reset();
		$('#capteur').modal('toggle');
	} else {
		result[0].nameC = nameC.value;
		SubmitFormCap.reset();
		$('#capteur').modal('toggle');
	}
})
map.on(L.Draw.Event.CREATED, function (event) {
	var thisLayer,
			getIdClick;
	var type = event.layerType,
			layer = event.layer;
			drawnItems.addLayer(layer),
			modalId = layer._leaflet_id
			if (type === 'rectangle') {
				$("#lines").modal();
				$('#color-palette').css('display', 'none')
					x1 = layer._latlngs[0][0],
					y1 = layer._latlngs[0][1],
					x2 = layer._latlngs[0][2],
					y2 = layer._latlngs[0][3],
					socket.on('data_lines',function(resLines){
						layer.addEventListener('click', function (e) {
							getIdClick =e.target._leaflet_id
							let result = resLines.filter(resL => resL.id == getIdClick);
							if (result.length != 0) {
								nameL.value = result[0].nameL;
							}
						})//End Layer Clicked
						$(document).on("click","path.leaflet-interactive", function(e){
							thisLayer = $(this);
							$('#color-palette').css('display', 'block')
							$('#lines').modal('show');
						})
						$(document).on('click','#color-palette .color-button',function(){
							var colorSelected = $(this).css("backgroundColor");
							changeColor(thisLayer, colorSelected)
						})
					})
					closeL.addEventListener('click', function (e) {
						if (nameL.value === '') {
							map.eachLayer(function (layer) {
								map.removeLayer(drawnItems._layers[modalId])
							})
						}
					})
			}
			if (type === 'marker') {
				SubmitFormDev.reset();
					id_layer.value = layer._leaflet_id
					x = layer._latlng.lat,
					y = layer._latlng.lng
				$("#device").modal();
				layer.addEventListener('click', function (e) {
					id_layer.value = modalId = e.target._leaflet_id
					$('#device').modal('show');
					let result = data.devices.filter(device => device.id == e.target._leaflet_id);
					if (result.length !== 0) {
						fname.value = result[0].fname;
					}
					$('#device').modal('toggle');
				})
				closeD.addEventListener('click', function (e) {
					if (fname.value === '') {
						map.eachLayer(function (layer) {
							map.removeLayer(drawnItems._layers[modalId])
						})
					}
				})
			}
			if (type === 'capteur') {
					SubmitFormCap.reset()
					id_layer.value = layer._leaflet_id
					x = layer._latlng.lat,
					y = layer._latlng.lng
				$("#capteur").modal();
				layer.addEventListener('click', function (e) {
					id_layer.value = modalId = e.target._leaflet_id
					$('#capteur').modal('show');
					let result = data.capteurs.filter(capteur => capteur.id == e.target._leaflet_id);
					if (result.length !== 0) {
						nameC.value = result[0].nameC;
					}
					$('#capteur').modal('toggle');
				})
				closeC.addEventListener('click', function (e) {
					if (nameC.value === '') {
						map.eachLayer(function (layer) {
							map.removeLayer(drawnItems._layers[modalId])
						})
					}
				})
			}
});

map.on(L.Draw.Event.EDITED, function (e) {
	var layers = e.layers;

	layers.eachLayer(function (layer) {
		var LineId = L.stamp(layer);
		if (layers.toGeoJSON().features[0].geometry.type === 'Polygon') {
			let coordinates = layers.toGeoJSON().features[0].geometry.coordinates
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
	for (var key in values) {
		for (var i in data.capteurs) {
			if (key == data.capteurs[i].id) {
				data.capteurs[i].x = values[key]._latlng.lat
				data.capteurs[i].y = values[key]._latlng.lng
			}
		}
	}
});

//Get Data & Print if from html
document.querySelector('#data').addEventListener('click', function () {
	document.querySelector('.line').innerHTML = JSON.stringify(data)
})

//Show Icon from Marker Created
function ShowIcon(input, selector) {
	if (input.files && input.files[0]) {
		var reader = new FileReader();
		reader.onload = function (e) {
			$('#' + selector).attr('src', e.target.result)
		};
		reader.readAsDataURL(input.files[0]);
	}
}

function selectColor(color) {
	selectedColor = color;
	for (var i = 0; i < colors.length; i++) {
		let currentColor = colors[i]
		colorButtons[currentColor].style.border = currentColor == color ? '2px solid #333' : '2px solid #fff';
	}
}

buildColorPalette();

function buildColorPalette() {
	var colorPalette = document.getElementById('color-palette');
	for (var i = 0; i < colors.length; ++i) {
		var currColor = colors[i];
		var colorButton = makeColorButton(currColor);
		//Lines
		colorPalette.appendChild(colorButton);
		colorButtons[currColor] = colorButton;
	}
	selectColor(colors);
}

function makeColorButton(color) {
	var button = document.createElement('span');
	button.className = 'color-button';
	button.style.backgroundColor = color;

	L.DomEvent.addListener(button, 'click', function (e) {
		selectColor(color);
	});
	return button;
}

function changeColor(element, colorSelected) {
	element.attr({
		fill: colorSelected,
		stroke: colorSelected
	})
}