require([
  "esri/Map",
  "esri/views/MapView",
  "esri/Graphic",
  "esri/layers/GraphicsLayer",
  // "esri/symbols/SimpleMarkerSymbol",
  "esri/symbols/PictureMarkerSymbol" // Make sure to include the PictureMarkerSymbol module
], function(Map, MapView, Graphic, GraphicsLayer, PictureMarkerSymbol) {

  var map = new Map({
      basemap: "dark-gray" // A dark basemap provides a night-like appearance
  });

  var view = new MapView({
      container: "viewDiv",
      map: map,
      center: [0, 0], // The center of the map view when the page loads
      //zoom: 4 // A zoom level that shows many of the points
      //center: [-98.5795, 39.8283],
      zoom: 1
  });

  var graphicsLayer = new GraphicsLayer();  
  map.add(graphicsLayer);   

  // Function to fetch and create points
  function createPointsFromCoordinates() {
    fetch('data/coordinates.txt')
    //fetch('data/us_points.txt')
      .then(response => response.text())
      .then(text => {
          var lines = text.trim().split("\n");
          lines.forEach(function(line) {
              var parts = line.split(',');
              if (parts.length === 2) {
                  var lat = parseFloat(parts[0].trim());
                  var lon = parseFloat(parts[1].trim());
                  // Create a new PictureMarkerSymbol with your blurred image
                  var pointGraphic = new Graphic({
                    geometry: {
                      type: "point",
                      longitude: lon,
                      latitude: lat
                    },
                    symbol: new PictureMarkerSymbol({
                      url: 'data/blurred_circle_marker_1.png', // The path to the blurred image
                      width: '1.5px',  
                      height: '1.5px'  
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