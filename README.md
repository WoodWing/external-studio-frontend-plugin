# external-studio-frontend-plugin
The project show how a Studio frontend plugin hosted on an external server can securely communicate with the Studio Server

# Dev 
* Initialise project: npm update
* Run project locally: npm run start
* Release project: npm run build 

# Installation
Assuming the project is running locally configure the following URL in the Studio management console in the Plugins->Studio section

http://localhost:8080/loader.js

Please update the integrationUrl in loader.js if the integration is hosted somewhere else  

The loader will add a button / link to the Dossier interface called "External integration" to open the projects modal dialog

# Deployment
This sample is deployed via GitHub actions to GitHub pages, this is for illustration purposes. For production purposes deploy to a location like AWS or Azure. 

https://woodwing.github.io/external-studio-frontend-plugin/loader.js

In the case of Same Origin Policy errors please verify the Access-Control-Allow-Origin and Access-Control-Allow-Method settings on the service hosting the loader.js. 

* The Access-Control-Allow-Origin should be set to the domain of the Studio webclient or be set to * 
* The Access-Control-Allow-Methods should be set to "GET,POST,OPTIONS,DELETE,PUT"



