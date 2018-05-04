$(document).ready(function(){
    var urlParams = (function(url)
    {
        var result = new Object();
        var idx = url.lastIndexOf('?');

        if (idx > 0)
        {
            var params = url.substring(idx + 1).split('&');
            
            for (var i = 0; i < params.length; i++)
            {
                idx = params[i].indexOf('=');
                
                if (idx > 0)
                {
                    result[params[i].substring(0, idx)] = params[i].substring(idx + 1);
                }
            }
        }
        
        return result;
    })(window.location.href);

    // Default resources are included in grapheditor resources
    mxLoadResources = false;




    var editorUiInit = EditorUi.prototype.init;

    EditorUi.prototype.init = function()
    {
        editorUiInit.apply(this, arguments);
        this.actions.get('export').setEnabled(false);
    };
    var url = window.location.href;
    idx = url.lastIndexOf('/');
    var id = url.substring(idx+1);
    var id_user = localStorage.getItem('IdUser');
    var xml = mxUtils.load("http://localhost:8080/api/"+id_user+"/diagrammes/contenu/"+id);
    var xmlDoc = xml.getXml();
    var node = xmlDoc.documentElement;
    var dec = new mxCodec(node.ownerDocument);
    // Adds required resources (disables loading of fallback properties, this can only
    // be used if we know that all keys are defined in the language specific file)
    mxResources.loadDefaultBundle = false;
    var bundle = mxResources.getDefaultBundle(RESOURCE_BASE, mxLanguage) ||
        mxResources.getSpecialBundle(RESOURCE_BASE, mxLanguage);



    if(xml.getText() === "Not Authorized")
    {
        window.location.href="/notAuthorized"
    }
    else{
    // Fixes possible asynchronous requests
    mxUtils.getAll([bundle, STYLE_PATH + '/default.xml'], function(xhr)
    {
        // Adds bundle text to resources

        mxResources.parse(xhr[0].getText());

        // Configures the default graph theme
        var themes = new Object();
        themes[Graph.prototype.defaultThemeName] = xhr[1].getDocumentElement();

        // Main
        var  editorUI = new EditorUi(new Editor(urlParams['chrome'] == '0', themes));
        dec.decode(node, editorUI.editor.graph.getModel());


        /*alert(Object.keys(editorUI));*/
    }, function()
    {
        document.body.innerHTML = '<center style="margin-top:10%;">Error loading resource files. Please check browser console.</center>';
    });
}
});