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