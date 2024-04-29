require([
  "esri/Map",
  "esri/views/MapView",
  "esri/Graphic",
  "esri/layers/GraphicsLayer",
  "esri/symbols/SimpleMarkerSymbol"
], function(Map, MapView, Graphic, GraphicsLayer, SimpleMarkerSymbol) {

  var map = new Map({
      basemap: "dark-gray" // A dark basemap provides a night-like appearance
  });

  var view = new MapView({
      container: "viewDiv",
      map: map,
      center: [0, 0], // The center of the map view when the page loads
      //zoom: 4 // A zoom level that shows many of the points
      center: [-98.5795, 39.8283],
      zoom: 4
  });

  var graphicsLayer = new GraphicsLayer();  
  map.add(graphicsLayer);   

  // Function to fetch and create points
  function createPointsFromCoordinates() {
    // fetch('data/coordinates.txt')
    fetch('data/output_usa.txt')
      .then(response => response.text())
      .then(text => {
          var lines = text.trim().split("\n");
          lines.forEach(function(line) {
              var parts = line.split(',');
              if (parts.length === 2) {
                  var lat = parseFloat(parts[0].trim());
                  var lon = parseFloat(parts[1].trim());
                  var pointGraphic = new Graphic({
                      geometry: {
                      type: "point",
                      longitude: lon,
                      latitude: lat
                  },
                  symbol: new SimpleMarkerSymbol({
                      color: "white", // White center
                      size: "1.15px", // Size of the marker
                      outline: {
                        color: [218,121,220,0.6],
                        width: 0.9
                    }
                  })
                });
                graphicsLayer.add(pointGraphic);
              }
          });
          view.goTo(graphicsLayer.graphics.extent);
      })
      .catch(function(error){
          console.error("Error fetching coordinates:", error);
      });
  }

  view.when(function() {
    // Wait for the view to load to ensure map is ready
    createPointsFromCoordinates();
  });
  
});