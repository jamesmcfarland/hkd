document.body.onload = () => {

    var map = new atlas.Map('map', {

        center: [-5.9301, 54.5973],
        zoom: 11,
        pitch: 45,
        language: 'en-GB',
        view: "Auto",
        style: "satellite",
        authOptions: {
            authType: 'subscriptionKey',
            subscriptionKey: 'dH7oPHVM8Yv7ZUNZECRQ_ARkTRdixwyUOj09Cy4YGUk'
        }
    });

    map.events.add('ready', async () => {
        map.controls.add(new atlas.control.StyleControl({
            mapStyles: ['road', 'grayscale_dark', 'night', 'road_shaded_relief', 'satellite', 'satellite_road_labels']
        }), {
            position: 'top-right'
        });

        var source = new atlas.source.DataSource();
        source.importDataFromUrl("trees_full.geojson")
        map.sources.add(source)
        map.layers.add(new atlas.layer.PolygonExtrusionLayer(source, null, {
            base: 0,
            fillColor: "#02fae1",
            fillOpacity: 0.7,
            height: 50
        }));

        // var source2 = new atlas.source.DataSource();
        // source2.importDataFromUrl("heatmap.geojson")
        // map.sources.add(source2)
        // map.layers.add(new atlas.layer.HeatMapLayer(source2, null, {
        //     radius:100,
        //     fillOpacity: 0.5,
        //     weight:10,
        // }, "label"));

        fetch("http://localhost:5500/heatmap.geojson")
            .then(res => res.json())
            .then(out =>
                {
                    const feats = out.features;
                    for(let i=0; i < feats.length; i++){
                        let geoJson = new atlas.data.Feature(new atlas.data.Point([feats[i].geometry.coordinates[0], feats[i].geometry.coordinates[1]]), {
                            
                        }); 
                        let src = new atlas.source.DataSource()
                        console.log(feats[i].properties["nitrogen dioxide"]);
                        src.add(geoJson)
                        map.sources.add(src)
                        map.layers.add(new atlas.layer.HeatMapLayer(src, null, {
                            radius: feats[i].properties["nitrogen dioxide"]*11,
                            opacity: 0.25,
                        }))
                        document.getElementById("btn").addEventListener("click", ()=>{
                           src.clear()
                        })
                      
                    }
                }   )             
            .catch(err => { throw err });






        console.log("fin")
    });



}