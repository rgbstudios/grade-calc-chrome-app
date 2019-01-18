chrome.app.runtime.onLaunched.addListener(function(launchData) {
  let screenWidth =  screen.availWidth;
  let screenHeight = screen.availHeight;
  let WIDTH = 1280;
  let HEIGHT = 800;
  chrome.app.window.create('index.html', {
      id: 'mainWindow',
	  frame: {color: "#6c6", inactiveColor: "#393"},
	  
      bounds: {
        width:  WIDTH,
        height: HEIGHT,
        left: (screenWidth - WIDTH) / 2,
        top:  (screenHeight - HEIGHT) / 2,
      }, 
	  innerBounds: {
        minWidth: 1280,
        minHeight: 800
      }
  });
});