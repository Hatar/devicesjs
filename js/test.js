
                let devices = data.filter(dt => dt.deviceid !=modalId )
                devices.push({deviceid:modalId,fname:fname.value})
                console.log(devices)


            for(var i=0;i<=features.length;i++){
              x =drawnItems.toGeoJSON().features[i].geometry.coordinates[0],
              y =drawnItems.toGeoJSON().features[i].geometry.coordinates[1]
          }

          $('#device').on('hidden.bs.modal', function (e) {
            if(fname.value === ""){
                 map.eachLayer(function(layer){
                     console.log(drawnItems)
                    map.removeLayer(drawnItems._layers[modalId])
                 })
             }
         })