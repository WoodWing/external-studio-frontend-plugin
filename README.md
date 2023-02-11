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
