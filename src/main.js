'use strict';

(function () {
  var _selection;
  var _dossier;
  var _ContentStationSdk;

  /**
   * Init function called from loader.js via postmessage
   * @param {*} selection Selection of files in the Dossier
   * @param {*} dossier Dossier object
   * @param {*} serverURL URL of the Studio Server 
   */
  async function init(selection, dossier, ContentStationSdk) {
    _selection = selection;
    _dossier = dossier;
    _ContentStationSdk = ContentStationSdk;

    getDossierObject(dossier.ID);
  }

  /**
   * Example communication with the Studio Server
   * @param {dossierID} dossierID 
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
    return _ContentStationSdk.getInfo().ServerInfo.URL + "?protocol=JSON&ww-app=Content+Station&method=" + request.method;
  }

  /**
 * Check if we can close the modal dialog
 */
  function canClose() {
    return true;
  }

  window.canClose = canClose;
  window.init = init;  
})();

