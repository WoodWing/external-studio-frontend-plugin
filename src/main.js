'use strict';

(function () {
  const postMessageChannel = "ExternalIntegration";

  var _selection;
  var _dossier;
  var _serverURL;

  /**
   * Post message event listener
   */
  window.addEventListener("message", (event) => {
    if (event.data.command == postMessageChannel + "-Init") {
      init(event.data.selection, event.data.dossier, event.data.serverURL);
    }
  });

  /**
   * Init function called from loader.js via postmessage
   * @param {*} selection Selection of files in the Dossier
   * @param {*} dossier Dossier object
   * @param {*} serverURL URL of the Studio Server 
   */
  async function init(selection, dossier, serverURL) {
    _selection = selection;
    _dossier = dossier;
    _serverURL = serverURL;

    loadStudioStyles();
    document.getElementById("closeButton").onclick = closePanel;

    getDossierObject(dossier.ID);
  }

  /**
   * Example communication with the Studio Server
   * @param {Se} dossierID 
   */
  async function getDossierObject(dossierID) {
    var dossierObject = await getObjects(dossierID);
    console.log(dossierObject);

    document.getElementById('app').innerHTML = "The Dossier name is <b>" + dossierObject.MetaData.BasicMetaData.Name + "</b> to full information is logged in the console <br><br>";
  }

  /**
   * GetObjects request
   * @param {*} sourceId Object ID
   * @returns 
   */
  async function getObjects(sourceId) {

    var getObjectsRequest = {
      "method": "GetObjects",
      "id": "1",
      "params": [
        {
          "IDs": [],
          "Lock": false,
          "Rendition": "native",
          "RequestInfo": [
          ],
          "Areas": [
            "Workflow"
          ],
          "EditionId": null,
          "SupportedContentSources": null,
          "Ticket": ""
        }
      ],
      "jsonrpc": "2.0"
    };

    getObjectsRequest.params[0].IDs.push(sourceId);

    var getObjectsResult = await fetch(getServerURL(getObjectsRequest), {
      mode: 'cors',
      credentials: 'include', // include cookie with Studio server ticket!
      method: 'POST',
      body: JSON.stringify(getObjectsRequest)
    });
    let json = await getObjectsResult.json();

    return json.result.Objects[0];
  }

  /**
  * Returns the URL of the Studio Server
  * @param {} request Studio server JSON RPC request
  */
  function getServerURL(request) {
    return _serverURL + "?protocol=JSON&ww-app=Content+Station&method=" + request.method;
  }

  /**
   * Close the modal dialog
   */
  function closePanel() {

    var message = {
      "command": postMessageChannel + "-ClosePanel",
    }

    window.parent.postMessage(message, '*');
  }

  /**
   * Import the styles from the parent
   */
  function loadStudioStyles() {
    if (window.top && window.top.location.href != document.location.href) {
      // all parent's <link>s
      var linkrels = window.top.document.getElementsByTagName('link');
      // my head
      var small_head = document.getElementsByTagName('head').item(0);
      // loop through parent's links
      for (var i = 0, max = linkrels.length; i < max; i++) {
        // are they stylesheets
        if (linkrels[i].rel && linkrels[i].rel == 'stylesheet') {
          // create new element and copy all attributes
          var thestyle = document.createElement('link');
          var attrib = linkrels[i].attributes;
          for (var j = 0, attribmax = attrib.length; j < attribmax; j++) {
            thestyle.setAttribute(attrib[j].nodeName, attrib[j].nodeValue);
          }

          // add the newly created element to the head
          small_head.appendChild(thestyle);
        }
      }
    }
  }
})();  
