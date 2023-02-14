(function () {
  const integrationUrl = "http://localhost:8080/";
  const iFrameId = "ExternalIntegration";

  ContentStationSdk.addDossierToolbarButton({
    onInit: function (button, selection) {
      button.label = "External integration";
    },
    onAction: function (button, selection, dossier) {
      /**
       * Initialise the external plugin
       */
      function init() {
        getIframeWindow().init (selection, dossier, ContentStationSdk);
      }

      //Create the modal dialog
      dialogId = ContentStationSdk.openModalDialog({
        width: 480,
        title: 'External Studio Frontend plugin',
        content: `<iframe id=${iFrameId} frameborder="0" style="margin: 0; padding: 0; width: 100%"></iframe>`,
        contentNoPadding: true,
        buttons: [
          {
            label: 'Close',
            callback: () => {
              if (getIframeWindow().canClose ()) 
                ContentStationSdk.closeModalDialog(dialogId);
            },
          },
        ],
      });

      //Download the main html file of the integration and replace the relative URLS
      fetch(integrationUrl)
        .then(response => response.text())
        .then(data => {
          var html = absolutify(data, integrationUrl);
          var iFrame = document.getElementById(iFrameId);
          iFrame.onload = init;
          iFrame.srcdoc = html;                  
        });
    }
  });

  /**
   * Returns the contentWindow of the iFrame
   * 
   * @returns contentWindow
   */
  function getIframeWindow () {
    return document.getElementById(iFrameId).contentWindow;
  }

  /**
   * Convert relative paths to absolute paths
   * @author HaNdTriX
   * @param {string} html - HTML string
   * @param {string} baseUrl - base url to prepend to relative paths
   * @param  {string[]} [attributes] - attributes to convert
   * @returns {string}
   */
  function absolutify(
    html,
    baseUrl,
    attributes = [
      "href",
      "src",
      "srcset",
      "cite",
      "background",
      "action",
      "formaction",
      "icon",
      "manifest",
      "code",
      "codebase",
      "ws"
    ]
  ) {
    // Build the regex to match the attributes.
    const regExp = new RegExp(
      `(?<attribute>${attributes.join(
        "|"
      )})=(?<quote>['"])(?<path>.*?)\\k<quote>`,
      "gi"
    );

    return html.replaceAll(regExp, (...args) => {
      // Get the matched groupes
      const { attribute, quote, path } = args[args.length - 1];

      // srcset may have multiple paths `<url> <descriptor>, <url> <descriptor>`
      if (attribute.toLowerCase() === "srcset") {
        const srcSetParts = path.split(",").map((dirtyPart) => {
          const part = dirtyPart.trim();
          const [path, size] = part.split(" ");
          return `${new URL(path.trim(), baseUrl).toString()} ${size || ""}`;
        });

        return `${attribute}=${quote}${srcSetParts.join(", ")}${quote}`;
      }

      const absoluteURL = new URL(path, baseUrl).href;
      return `${attribute}=${quote}${absoluteURL}${quote}`;
    });
  }
})();  