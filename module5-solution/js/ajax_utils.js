var $ajaxUtils = (function () {
    var module = {};
  
    // Returns an HTTP request object
    function getRequestObject() {
      if (window.XMLHttpRequest) {
        return (new XMLHttpRequest());
      } 
      else if (window.ActiveXObject) {
        // For very old IE browsers (optional)
        return (new ActiveXObject("Microsoft.XMLHTTP"));
      } 
      else {
        global.$dc.error("Ajax is not supported!");
        return (null); 
      }
    }
  
    // Makes an Ajax GET request to 'requestUrl'
    module.sendGetRequest = function (requestUrl, responseHandler, isJsonResponse) {
      var request = getRequestObject();
      request.onreadystatechange = 
        function () { 
          handleResponse(request, responseHandler, isJsonResponse); 
        };
      request.open("GET", requestUrl, true);
      request.send(null); // for POST only
    };
  
    // Only calls user provided 'responseHandler'
    // function if response is ready
    // and not an error
    function handleResponse(request, responseHandler, isJsonResponse) {
      if ((request.readyState == 4) &&
          (request.status == 200)) {
  
        // Default to isJsonResponse = true
        if (isJsonResponse == undefined) {
          isJsonResponse = true;
        }
  
        if (isJsonResponse) {
          responseHandler(JSON.parse(request.responseText));
        }
        else {
          responseHandler(request.responseText);
        }
      }
    }
  
    return module;
  })();