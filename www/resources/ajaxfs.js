/*
    Ajax File Storage 
    @author Hamilton Chua (ham@solutiongrove.com)
    @creation-date 2007-06-03
*/

/********** UTILS *********************/

/* readCookie
read value of a cookie */
function readCookie(name) {
  var ca = document.cookie.split(';');
  var nameEQ = name + "=";
  for(var i=0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0)==' ') c = c.substring(1, c.length); //delete spaces
    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
  return null;
}

/* createCookie
used to maintain state, e.g. when login expires */
function createCookie(name, value, days){
  if (days) {
    var date = new Date();
    date.setTime(date.getTime()+(days*24*60*60*1000));
    var expires = "; expires="+date.toGMTString();
    }
  else var expires = "";
  document.cookie = name+"="+value+expires+"; path=/";
}

/* read query string
read the value of a querystring */
function readQs(q) {
    var query = window.location.search.substring(1);
    var parms = query.split('&');
    for (var i=0; i<parms.length; i++) {
        var pos = parms[i].indexOf('=');
        if (pos > 0) {
            var key = parms[i].substring(0,pos);
            var val = parms[i].substring(pos+1);
            if (key == q) {
                return val;
            }
        }
    }
    return null;
}

/* check Flash Version */
function checkFlashVersion() {

    var x;
    var pluginversion;

    if(navigator.plugins && navigator.mimeTypes.length){
        x = navigator.plugins["Shockwave Flash"];
        if(x && x.description) x = x.description;
    } else if (Ext.isIE){
        try {
            x = new ActiveXObject("ShockwaveFlash.ShockwaveFlash");
            x = x.GetVariable("$version");
        } catch(e){}
    }

    pluginVersion = (typeof(x) == 'string') ? parseInt(x.match(/\d+/)[0]) : 0;

    return pluginVersion;
}

// check if the string argument is a url
function isURL(argvalue) {

  if (argvalue.indexOf(" ") != -1)
    return false;
  else if (argvalue.indexOf("http://") == -1)
    return false;
  else if (argvalue == "http://")
    return false;
  else if (argvalue.indexOf("http://") > 0)
    return false;

  argvalue = argvalue.substring(7, argvalue.length);
  if (argvalue.indexOf(".") == -1)
    return false;
  else if (argvalue.indexOf(".") == 0)
    return false;
  else if (argvalue.charAt(argvalue.length - 1) == ".")
    return false;

  if (argvalue.indexOf("/") != -1) {
    argvalue = argvalue.substring(0, argvalue.indexOf("/"));
    if (argvalue.charAt(argvalue.length - 1) == ".")
      return false;
  }

  if (argvalue.indexOf(":") != -1) {
    if (argvalue.indexOf(":") == (argvalue.length - 1))
      return false;
    else if (argvalue.charAt(argvalue.indexOf(":") + 1) == ".")
      return false;
    argvalue = argvalue.substring(0, argvalue.indexOf(":"));
    if (argvalue.charAt(argvalue.length - 1) == ".")
      return false;
  }

  return true;

}

/********** FLASH UPLOAD *********/


function FileProgress(fileObj, target_id) {
    this.file_progress_id = fileObj.id;

    this.opacity = 100;
    this.height = 0;

    this.fileProgressWrapper = document.getElementById(this.file_progress_id);
    if (!this.fileProgressWrapper) {
        this.fileProgressWrapper = document.createElement("div");
        this.fileProgressWrapper.className = "progressWrapper";
        this.fileProgressWrapper.id = this.file_progress_id;

        this.fileProgressElement = document.createElement("div");
        this.fileProgressElement.className = "progressContainer";

        var progressCancel = document.createElement("a");
        progressCancel.className = "progressCancel";
        progressCancel.href = "#";
        progressCancel.style.visibility = "hidden";
        progressCancel.appendChild(document.createTextNode(" "));

        var progressText = document.createElement("div");
        progressText.className = "progressName";
        progressText.appendChild(document.createTextNode(fileObj.name));

        var progressBar = document.createElement("div");
        progressBar.className = "progressBarInProgress";

        var progressStatus = document.createElement("div");
        progressStatus.className = "progressBarStatus";
        progressStatus.innerHTML = "&nbsp;";

        this.fileProgressElement.appendChild(progressCancel);
        this.fileProgressElement.appendChild(progressText);
        this.fileProgressElement.appendChild(progressStatus);
        this.fileProgressElement.appendChild(progressBar);

        this.fileProgressWrapper.appendChild(this.fileProgressElement);

        document.getElementById(target_id).appendChild(this.fileProgressWrapper);
    } else {
        this.fileProgressElement = this.fileProgressWrapper.firstChild;
    }

    this.height = this.fileProgressWrapper.offsetHeight;

}
FileProgress.prototype.SetProgress = function(percentage) {
    this.fileProgressElement.className = "progressContainer green";
    this.fileProgressElement.childNodes[3].className = "progressBarInProgress";
    this.fileProgressElement.childNodes[3].style.width = percentage + "%";
}
FileProgress.prototype.SetComplete = function() {
    this.fileProgressElement.className = "progressContainer blue";
    this.fileProgressElement.childNodes[3].className = "progressBarComplete";
    this.fileProgressElement.childNodes[3].style.width = "";

    var oSelf = this;
    setTimeout(function() { oSelf.Disappear(); }, 10000);
}
FileProgress.prototype.SetError = function() {
    this.fileProgressElement.className = "progressContainer red";
    this.fileProgressElement.childNodes[3].className = "progressBarError";
    this.fileProgressElement.childNodes[3].style.width = "";

    var oSelf = this;
    setTimeout(function() { oSelf.Disappear(); }, 5000);
}
FileProgress.prototype.SetCancelled = function() {
    this.fileProgressElement.className = "progressContainer";
    this.fileProgressElement.childNodes[3].className = "progressBarError";
    this.fileProgressElement.childNodes[3].style.width = "";

    var oSelf = this;
    setTimeout(function() { oSelf.Disappear(); }, 2000);
}
FileProgress.prototype.SetStatus = function(status) {
    this.fileProgressElement.childNodes[2].innerHTML = status;
}

FileProgress.prototype.ToggleCancel = function(show, upload_obj) {
    this.fileProgressElement.childNodes[0].style.visibility = show ? "visible" : "hidden";
    if (upload_obj) {
        var file_id = this.file_progress_id;
        this.fileProgressElement.childNodes[0].onclick = function() { upload_obj.cancelUpload(file_id); return false; };
    }
}

FileProgress.prototype.Disappear = function() {

    var reduce_opacity_by = 15;
    var reduce_height_by = 4;
    var rate = 30;  // 15 fps

    if (this.opacity > 0) {
        this.opacity -= reduce_opacity_by;
        if (this.opacity < 0) this.opacity = 0;

        if (this.fileProgressWrapper.filters) {
            try {
                this.fileProgressWrapper.filters.item("DXImageTransform.Microsoft.Alpha").opacity = this.opacity;
            } catch (e) {
                // If it is not set initially, the browser will throw an error.  This will set it if it is not set yet.
                this.fileProgressWrapper.style.filter = 'progid:DXImageTransform.Microsoft.Alpha(opacity=' + this.opacity + ')';
            }
        } else {
            this.fileProgressWrapper.style.opacity = this.opacity / 100;
        }
    }

    if (this.height > 0) {
        this.height -= reduce_height_by;
        if (this.height < 0) this.height = 0;

        this.fileProgressWrapper.style.height = this.height + "px";
    }

    if (this.height > 0 || this.opacity > 0) {
        var oSelf = this;
        setTimeout(function() { oSelf.Disappear(); }, rate);
    } else {
        this.fileProgressWrapper.style.display = "none";
    }
}

function uploadStart(fileObj,ajaxfsobj) {
    var upload_txt = acs_lang_text.for_upload_to || "for upload to";
    var zip_txt = acs_lang_text.zip_extracted || "Zip File (Will be extracted after upload)";
    try {
        // You might include code here that prevents the form from being submitted while the upload is in
        // progress.  Then you'll want to put code in the Queue Complete handler to "unblock" the form
        var folderid = ajaxfsobj.currentfolder;
        var foldername = ajaxfsobj.treepanel.getNodeById(folderid).text;
        var progress = new FileProgress(fileObj, this.getSetting("progress_target"));
        progress.SetStatus( upload_txt + "<b>"+foldername+"</b><br>Title: <input type='text' onblur=\"fsInstance.swfu.removeFileParam('"+fileObj.id+"','filetitle');fsInstance.swfu.addFileParam('"+fileObj.id+"','filetitle',this.value)\">(optional)<br><input type='checkbox' id='zip"+fileObj.id+"' onclick=\"if(document.getElementById('zip"+fileObj.id+"').checked) { fsInstance.swfu.addFileParam('"+fileObj.id+"','unpack_p','1') } else { fsInstance.swfu.removeFileParam('"+fileObj.id+"','unpack_p') }\"> "+ zip_txt);
        progress.ToggleCancel(true, this);
        this.addFileParam(fileObj.id, "folder_id", folderid);
        ajaxfsobj.upldDialog.buttons[0].enable();
    } catch (ex) { this.debugMessage(ex); }
}

function uploadProgress(fileObj, bytesLoaded) {
    try {
        var percent = Math.ceil((bytesLoaded / fileObj.size) * 100)
        var progress = new FileProgress(fileObj, this.getSetting("progress_target"));
        progress.SetProgress(percent);
        progress.SetStatus(acs_lang_text.uploading || "Uploading...");
    } catch (ex) { this.debugMessage(ex); }
}

function uploadFileComplete(fileObj) {
    try {
        var progress = new FileProgress(fileObj, this.getSetting("progress_target"));
        progress.SetComplete();
        progress.SetStatus(acs_lang_text.complete || "Complete.");
        progress.ToggleCancel(false);

    } catch (ex) { this.debugMessage(ex); }
}

function uploadComplete(fileObj) {
    try {
        var progress = new FileProgress(fileObj, this.getSetting("progress_target"));
        progress.SetComplete();
        progress.SetStatus(acs_lang_text.complete || "Complete.");
        progress.ToggleCancel(false);

    } catch (ex) { this.debugMessage(ex); }
}

function uploadQueueComplete(fileidx,ajaxfsobj) {
    ajaxfsobj.upldDialog.buttons[0].disable();
    var currentTreeNode = ajaxfsobj.treepanel.getNodeById(ajaxfsobj.currentfolder);
    currentTreeNode.fireEvent("click",currentTreeNode);
}

function uploadError(error_code, fileObj, message) {
    try {
        if (error_code == SWFUpload.ERROR_CODE_QUEUE_LIMIT_EXCEEDED) {
            Ext.Msg.alert(acs_lang_text.alert || "Alert","You have attempted to queue too many files.\n" + (message == 0 ? "You have reached the upload limit." : "You may select " + (message > 1 ? "up to " + message + " files." : "one file.")));
            return;
        }

        var progress = new FileProgress(fileObj, this.getSetting("progress_target"));
        progress.SetError();
        progress.ToggleCancel(false);

        switch(error_code) {
            case SWFUpload.ERROR_CODE_HTTP_ERROR:
                progress.SetStatus("Upload Error");
                this.debugMessage("Error Code: HTTP Error, File name: " + file.name + ", Message: " + message);
                break;
            case SWFUpload.ERROR_CODE_MISSING_UPLOAD_TARGET:
                progress.SetStatus("Configuration Error");
                this.debugMessage("Error Code: No backend file, File name: " + file.name + ", Message: " + message);
                break;
            case SWFUpload.ERROR_CODE_UPLOAD_FAILED:
                progress.SetStatus("Upload Failed.");
                this.debugMessage("Error Code: Upload Failed, File name: " + file.name + ", File size: " + file.size + ", Message: " + message);
                break;
            case SWFUpload.ERROR_CODE_IO_ERROR:
                progress.SetStatus("Server (IO) Error");
                this.debugMessage("Error Code: IO Error, File name: " + file.name + ", Message: " + message);
                break;
            case SWFUpload.ERROR_CODE_SECURITY_ERROR:
                progress.SetStatus("Security Error");
                this.debugMessage("Error Code: Security Error, File name: " + file.name + ", Message: " + message);
                break;
            case SWFUpload.ERROR_CODE_FILE_EXCEEDS_SIZE_LIMIT:
                progress.SetStatus("File is too big.");
                this.debugMessage("Error Code: File too big, File name: " + file.name + ", File size: " + file.size + ", Message: " + message);
                break;
            case SWFUpload.ERROR_CODE_ZERO_BYTE_FILE:
                progress.SetStatus("Cannot upload Zero Byte files.");
                this.debugMessage("Error Code: Zero byte file, File name: " + file.name + ", File size: " + file.size + ", Message: " + message);
                break;
            case SWFUpload.ERROR_CODE_UPLOAD_LIMIT_EXCEEDED:
                progress.SetStatus("Upload limit exceeded.");
                this.debugMessage("Error Code: Upload Limit Exceeded, File name: " + file.name + ", File size: " + file.size + ", Message: " + message);
                break;
            default:
                progress.SetStatus("Unhandled Error");
                this.debugMessage("Error Code: " + error_code + ", File name: " + file.name + ", File size: " + file.size + ", Message: " + message);
                break;
        }
    } catch (ex) {
        this.debugMessage(ex);
    }
}

function uploadCancel(fileObj) {
    try {
        var progress = new FileProgress(fileObj, this.getSetting("progress_target"));
        progress.SetCancelled();
        progress.SetStatus(acs_lang_text.uploadcancel || "Cancelled (This item will be removed shortly)");
        progress.ToggleCancel(false);

    }
    catch (ex) {
        this.debugMessage(ex);
    }
}

/********** AjaxFS Objects ***********/

function ajaxfs(configObj) {

    //  ** configObj **
    // ajaxFs expects a config object that may have the following properites
    // configObj.package_ids : the package_id or a comma separated list of package_ids of the current ajaxFs Instance
    // configObj.initOpenFolder : if this value is not null, it should contain the folder id to open when object is instantiated
    // configOjb.layoutdiv : the div container where we put the layout, if none is provided then document.body is used

    // ** properties **

    // where to get

    // url of xmlhttp files from ajaxfs
    this.xmlhttpurl = '/ajaxfs2/xmlhttp/';

    // holds an object with configruation settings for this instance
    //  of ajaxfs, this variable is set only if configObj exists and is passed
    this.config = null;

    // holds a reference to the layout for the center page
    this.layout = null;

    // holds a reference to the tree panel
    this.treepanel = null;

    // hold reference to tagcloud panel
    this.tagcloudpanel = null;

    // holds a reference to the tree editor
    this.te = null;

    // holds a reference to the root of the tree
    this.rootfolder = null;

    // the grid that lists the files
    this.filegrid = null;

    // holds a reference to the toolbar
    this.toolbar = null;

    // holds the id of the currently selected node in the tree
    this.currentfolder = null;

    // currently selected tag
    this.currenttag = null;

    // reusable aync data connection
    this.asyncCon = new Ext.data.Connection();

    // reference to messagebox
    this.msgbox = Ext.MessageBox;

    // create upload dialog
    this.upldDialog = null;

    // create ur dialog
    this.createurlDialog = null;

    // permissions dialog
    this.permsDialog = null;

    /// revisions dialog
    this.revisionsDialog = null;

    // reference to contextmenu
    this.contextmenu = null;

    // reference to an instance of the swfuploader
    //  used for ajaxfs
    this.swfu = null;

    // ** methods **

    // check if the string has the login form
    //  redirects to login form if true, does nothing if not
    this.isSessionExpired = function() {
        // check if the string has method="post" name="login"
        if ( readCookie("ad_user_login") == null ) {
            Ext.get(document.body).mask(acs_lang_text.sessionexpired || "Your session has expired. You need to login again. <br>You will be redirected to a login page shortly");
            var params = "package_id="+this.config.package_id;
            if(this.currentfolder != null) {
                params = params + "&folder_id="+this.currentfolder;
            }
            window.location="/register/?return_url="+window.location;
            return 1
        }
        return 0
    }

    // check the permissions, returns either true or false
    this.isPermitted = function(objid,perm) {

        var callback = function(option,success,response) {
            if(success) {
                return response.responseText;
            } else {
                return 0;
            }
        }

        this.asyncCon.request({url:this.xmlhttpurl+"checkperms",
            params: "object_id="+objid+"&perm="+perm,
            method:"POST",
            callback: callback,
            scope: this
        });

    }

    // creates a gridpanel
    this.createGridPanel = function(grid,region,configObj) {
        // create the grid panel
        gridPanel = new Ext.GridPanel(grid, configObj)
        this.layout.add(region, gridPanel);
     }

    // generates a url to the currently selected file storage item
    // if it's a file : download
    // if it's a folder : append folder_id to the current url
    this.linkCopy = function() {
        var node = this.filegrid.getSelectionModel().getSelected();
        var nodetype = node.get("type");
        if (nodetype === "folder") {
            // generate the url to a folder
            var copytext = window.location.protocol+"//"+window.location.hostname+":"+window.location.port+this.config.package_url+"?package_id="+this.config.package_id+"&folder_id="+node.get("id");
        } else if (nodetype === "url") {
            var copytext = node.get("url");
        } else {
            var copytext = window.location.protocol+"//"+window.location.hostname+node.get("url");
        }
        if(Ext.isIE) {
            window.clipboardData.setData("text",copytext);
        } else {
            var copyprompt = Ext.Msg.show({
                title: acs_lang_text.linkaddress || 'Copy Link Address',
                prompt: true,
                msg: acs_lang_text.copyhighlighted || 'Copy the highlighted text to your clipboard.',
                value: copytext,
                buttons: Ext.Msg.OK
            });
            var prompt_text_el = YAHOO.util.Dom.getElementsByClassName('ext-mb-input', 'input','x-msg-box'); 
            prompt_text_el[0].select();
        }
    }

    // rename a file or folder in the right panel
    this.fileRename = function() {

        var node =  this.filegrid.getSelectionModel().getSelected();
        var nodeurl = node.get("url");
        var nodetype = node.get("type");
        var nodeid = node.get("id");
        var nodesubtitle = node.get("filename");

        var handleRename = function(btn, text) {
           if(btn=='ok') {
                if(text != '') {
                    if(text.length > 100) {
                        Ext.Msg.alert(acs_lang_text.alert || "Alert",acs_lang_text.limitto100 || "Please limit your name to 100 characters or less.");
                        return false;
                    } else {
                        var callback = function(option,success,response) {
                            var err_msg_txt = acs_lang_text.an_error_occurred || "An error occurred";
                            var err_msg_txt2 = acs_lang_text.reverted || "Your changes have been reverted";
                            if (success) {
                                if (response.responseText != 1) {
                                    Ext.Msg.alert(acs_lang_text.error || "Error",err_msg_txt + ": <br><br><font color='red'>"+response.responseText+"</font><br><br>"+err_msg_txt2);
                                } else {
                                    if(nodetype!="folder"&&nodesubtitle===" ") { 
                                        nodesubtitle = node.get("title");
                                        node.set("filename",nodesubtitle);
                                    }
                                    if(nodetype=="folder") { this.treepanel.getNodeById(nodeid).setText(text) }
                                    nodetags = node.get("tags");
                                    if(nodetags != "") {
                                        var taghtml = "<div id='tagscontainer_"+nodeid+"' style='color:blue'><div style='float:left'>Tags:</div><span id='tagslist_"+nodeid+"' style='float:left'>"+nodetags+"</span></div>";
                                    } else {
                                        var taghtml = "<div id='tagscontainer_"+nodeid+"' style='color:blue'></div>";;
                                    }
                                    node.set("title",text);
                                    node.set("title_and_name","<span id='title"+nodeid+"'>"+text+"</span><br><font style='font-size:10px;color:#666666'><span id='subtitle"+nodeid+"'>"+nodesubtitle+"</span></font>"+taghtml)
                                    node.commit();
                                }
                            } else {
                                Ext.Msg.alert(acs_lang_text.error || "Error",err_msg_txt+":<br><br><font color='red'>"+response.responseText+"</font><br><br>"+err_msg_txt2);
                            }
                        }
        
                        this.asyncCon.request({url:this.xmlhttpurl+"editname",
                            params: "newname="+text+"&object_id="+nodeid+"&type="+nodetype+"&url="+nodeurl,
                            method:"POST",
                            callback: callback,
                            scope: this
                        });
                    }
                } else {
                    Ext.Msg.alert(acs_lang_text.alert || "Alert",acs_lang_text.enter_new_name || "Please enter a new name.");
                    return false;
                }
            }
        }

        // Ext.MessageBox.prompt('Rename', 'Please enter a new name for <br><b>'+view.jsonData[node.nodeIndex].title+'</b>:', handleRename.createDelegate(this));
        Ext.Msg.show({
                title: acs_lang_text.rename || 'Rename',
                prompt: true,
                msg: acs_lang_text.enter_new_name || 'Please enter a new name for ... ',
                value: node.get("title"),
                buttons: Ext.Msg.OKCANCEL,
                fn: handleRename.createDelegate(this)
        });
        var prompt_text_el = YAHOO.util.Dom.getElementsByClassName('ext-mb-input', 'input','x-msg-box'); 
        prompt_text_el[0].select();
    }

    // permissions dialog
    this.permsRedirect = function() {
        var node =  this.filegrid.getSelectionModel().getSelected();
        var object_id = node.get("id");
        var newwindow = window.open(window.location.protocol+"//"+window.location.hostname+":"+window.location.port+this.config.package_url+"permissions?object_id="+object_id+"&return_url="+window.location.pathname+"?package_id="+this.config.package_id+"&folder_id="+this.currentfolder);
        newwindow.focus();
    }

    // redirect to file properties
    this.propertiesRedirect = function() {
        var node =  this.filegrid.getSelectionModel().getSelected();
        var object_id = node.get("id");
        var newwindow = window.open(window.location.protocol+"//"+window.location.hostname+":"+window.location.port+this.config.package_url+"file?file_id="+object_id);
        newwindow.focus();
    }

    // redirect to object views for a file
    this.viewsRedirect = function() {
        var node =  this.filegrid.getSelectionModel().getSelected();
        var object_id = node.get("id");
        window.open(window.location.protocol+"//"+window.location.hostname+"/o/"+object_id+"/info");
        window.focus();
    }


    // prompt to enter a tag for the selected fs element
    this.promptTag = function() {

        var ajaxfsobj = this;
        var node =  ajaxfsobj.filegrid.getSelectionModel().getSelected();
        var object_id = node.get("id");


        Ext.Msg.prompt('Tag', 'Enter or edit one or more tags. Seperate tags with commas (,):', function(btn, text) {
            if (btn == 'ok') {
                // process text value ...
                var callback = function(option,success,response) {
                    if(success) {
                        node.set('tags',text);
                        Ext.get("tagscontainer_"+object_id).update("Tag:<span id='tagslist_"+text+"'>"+text+"</span>");
                        this.tagcloudpanel.load("/ajaxfs2/xmlhttp/tagcloud?package_id="+this.config.package_id);
                    }
                }
                ajaxfsobj.asyncCon.request({url:ajaxfsobj.xmlhttpurl+"addtag",
                    params: "object_id="+object_id+"&tags="+text+"&package_id="+ajaxfsobj.config.package_id,
                    method:"POST",
                    callback: callback,
                    scope: ajaxfsobj
                });
            }
        });

        if (document.getElementById("tagslist_"+object_id)) {
            var prompt_text_el = YAHOO.util.Dom.getElementsByClassName('ext-mb-input', 'input','x-msg-box'); 
            prompt_text_el[0].value=document.getElementById("tagslist_"+object_id).innerHTML;
            prompt_text_el[0].select();
        }

    }

    // download archive function
    this.downloadArchive = function() {
        var node =  this.filegrid.getSelectionModel().getSelected();
        var object_id = node.get("id");
        top.location.href="download-archive/?object_id="+object_id;
    }

    // generate a context bar
    this.showContext = function(grid,i,e) {
        e.stopEvent();

        var dm = grid.getDataSource();
        var record = dm.getAt(i);
        var object_type = record.get("type");
        var recordid = record.get("id");
        
        if( object_type == "folder") {
            var openitem_txt = "Open";
        } else {
            var openitem_txt = "Download";
        }

        // create the menus
        this.contextmenu = new Ext.menu.Menu({
            id: 'rightclickmenu',
            items: [
            new Ext.menu.Item({
                text: openitem_txt,
                icon: "/resources/ajax-filestorage-ui/icons/page_white.png",
                handler: this.itemDblClick.createDelegate(this,[grid, i, e],false)
            }),
            new Ext.menu.Item({
                text: 'Tag',
                icon: '/resources/ajax-filestorage-ui/icons/tag_blue.png',
                handler: this.promptTag.createDelegate(this)
            }),
            new Ext.menu.Item({
                text: 'Views',
                icon: '/resources/ajax-filestorage-ui/icons/camera.png',
                handler: this.viewsRedirect.createDelegate(this)
            }),
            new Ext.menu.Item({
                text: acs_lang_text.deletefs || 'Delete',
                icon: '/resources/ajax-filestorage-ui/icons/delete.png',
                handler: this.confirmDel.createDelegate(this)
            }),
            new Ext.menu.Item({
                text: acs_lang_text.rename || 'Rename',
                icon: '/resources/ajax-filestorage-ui/icons/page_edit.png',
                handler: this.fileRename.createDelegate(this)
            }),
            new Ext.menu.Item({
                text: acs_lang_text.linkaddress || 'Copy Link Address',
                icon: '/resources/ajax-filestorage-ui/icons/page_copy.png',
                handler: this.linkCopy.createDelegate(this)
            }), 
            new Ext.menu.Item({
                text: acs_lang_text.permissions || 'Permissions',
                icon: '/resources/ajax-filestorage-ui/icons/group_key.png',
                handler: this.permsRedirect.createDelegate(this)
            }), 
            new Ext.menu.Item({
                text: acs_lang_text.properties || 'Properties',
                icon: '/resources/ajax-filestorage-ui/icons/page_edit.png',
                handler: this.propertiesRedirect.createDelegate(this)
            }), 
            new Ext.menu.Item({
                text: acs_lang_text.download_archive || 'Download archive',
                icon: '/resources/ajax-filestorage-ui/icons/arrow_down.png',
                handler: this.downloadArchive.createDelegate(this)
            })  ]
        });

        // disable open/download, rename, copy link, permissions and revisions if more than one node item from the view is selected
        if (grid.getSelectionModel().getCount() > 1) {
            this.contextmenu.items.items[0].hide();
            this.contextmenu.items.items[1].hide();
            this.contextmenu.items.items[2].hide();
            this.contextmenu.items.items[3].show();
            this.contextmenu.items.items[4].hide();
            this.contextmenu.items.items[5].hide();
            this.contextmenu.items.items[6].hide();
            this.contextmenu.items.items[7].hide();
            this.contextmenu.items.items[8].hide();
        } else {
            this.contextmenu.items.items[0].show();
            this.contextmenu.items.items[2].show();
            this.contextmenu.items.items[3].show();
            this.contextmenu.items.items[4].show();
            this.contextmenu.items.items[5].show();
            this.contextmenu.items.items[6].show();
            if (object_type == "folder") {
                this.contextmenu.items.items[1].hide();
                this.contextmenu.items.items[7].hide();
                this.contextmenu.items.items[8].show();
            } else {
                this.contextmenu.items.items[1].show();
                this.contextmenu.items.items[7].show();
                this.contextmenu.items.items[8].hide();
            }
        }
        
        var coords = e.getXY();
        this.contextmenu.rowid = i;
        this.contextmenu.showAt([coords[0], coords[1]]);
    }

    // handle file upload
    this.uploadFile = function(e) {

        if(document.getElementById("upload_file").value != "" && document.getElementById("filetitle").value != "") {

            var callback = {
                success: function() {
                }, upload: function() {
                    this.treepanel.getSelectionModel().getSelectedNode().loaded=false;
                    this.treepanel.getSelectionModel().getSelectedNode().fireEvent("click",this.treepanel.getSelectionModel().getSelectedNode());
                    this.upldDialog.getEl().unmask();
                    this.upldDialog.hide();
                }, failure: function() {
                    Ext.Msg.alert(acs_lang_text.error || "Error", acs_lang_text.upload_failed || "Upload failed, please try again later.");
                }, scope: this
            }

            var loading_msg = acs_lang_text.loading || "One moment. This may take a while depending on how large your upload is."
            this.upldDialog.getEl().mask("<img src='/resources/ajaxhelper/images/indicator.gif'>&nbsp;"+loading_msg);

            YAHOO.util.Connect.setForm("newfileform", true, true);

            var cObj = YAHOO.util.Connect.asyncRequest("POST", this.xmlhttpurl+"file-add", callback);
            
        } else {

            Ext.Msg.alert(acs_lang_text.alert || "Alert", acs_lang_text.file_required || "<b>Title</b> and <b>File to upload</b> are required.");

        }
    }

    // create the url
    this.createUrl = function(e) {
        if(document.getElementById("fsurl").value != "" && document.getElementById("fstitle").value != "") {
            if (isURL(document.getElementById("fsurl").value)) {
                var callback = {
                    success: function() {
                        this.treepanel.getSelectionModel().getSelectedNode().loaded=false;
                        this.treepanel.getSelectionModel().getSelectedNode().fireEvent("click",this.treepanel.getSelectionModel().getSelectedNode());
                        this.createurlDialog.getEl().unmask();
                        this.createurlDialog.hide();
                    },failure: function() {
                        this.createurlDialog.getEl().unmask();
                        Ext.Msg.alert(acs_lang_text.error || "Error",acs_lang_text.createurl_failed || "Create URL failed, please try again later.");
                    }, scope: this
                }
    
                this.createurlDialog.getEl().mask("<img src='/resources/ajaxhelper/images/indicator.gif'>&nbsp;One moment.");
    
                YAHOO.util.Connect.setForm("simple-add");
    
                var cObj = YAHOO.util.Connect.asyncRequest("POST", this.xmlhttpurl+"url-add", callback);
            } else {
                Ext.Msg.alert(acs_lang_text.alert || "Alert", acs_lang_text.invalid_url || "<b>URL</b> is not a valid url.");
            }
        } else {

            Ext.Msg.alert(acs_lang_text.alert || "Alert", acs_lang_text.invalid_url || "<b>Title</b> and <b>URL</b> are required.");

        }
    }

    // shows the create url dialog
    this.showCreateUrldialog = function() {
        if(!this.createurlDialog.buttons) {
            this.createurlDialog.addButton({text:acs_lang_text.ok || 'Ok',icon:"/resources/ajax-filestorage-ui/icons/page_add.png",cls:"x-btn-text-icon"}, this.createUrl, this);
            this.createurlDialog.addButton({text:acs_lang_text.cancel ||'Cancel',icon:"/resources/ajax-filestorage-ui/icons/cancel.png",cls:"x-btn-text-icon"}, this.createurlDialog.hide, this.createurlDialog);
        }
        this.createurlDialog.setTitle(acs_lang_text.createurl || "Create URL");
        this.createurlDialog.body.update("<form id=\"simple-add\" method=\"post\" enctype=\"multipart/form-data\"><input type=\"hidden\" name=\"package_id\" value=\""+this.config.package_id+"\"><input type=\"hidden\" name=\"folder_id\" value=\""+this.currentfolder+"\"><p>Title<br /><input type=\"text\" name=\"fstitle\" id=\"fstitle\"></p><br><p>URL<br /><input type=\"text\" name=\"fsurl\" id=\"fsurl\" value=\"http://\"></p><br><p>Description :<br /><textarea name=\"fsdescription\" id=\"fsdescription\"></textarea></p></form>");
        this.createurlDialog.body.setStyle("font","normal 12px tahoma, arial, helvetica, sans-serif");
        this.createurlDialog.body.setStyle("background-color","#ffffff");
        this.createurlDialog.body.setStyle("border","1px solid #e2e2e2");
        this.createurlDialog.body.setStyle("padding","3px");
        this.createurlDialog.show();
    }

    // shows the upload dialog, 
    // check if user has flash 8 or higher
    // creates the upload form or
    // shows the flash upload dialog
    this.showUplddialog = function() {
        this.upldDialog.setTitle(acs_lang_text.uploadfile || "Upload Files");
        if(checkFlashVersion() < 8) {
            var msg1=acs_lang_text.file_to_upload || "File to upload";
            var msg2=acs_lang_text.file_title || "Title";
            var msg3=acs_lang_text.file_description || "Description";
            var msg4=acs_lang_text.multiple_files || "Multiple Files";
            var msg5=acs_lang_text.multiple_files_msg || "This is a ZIPfile containing multiple files.";
            this.upldDialog.body.update("<form id=\"newfileform\" method=\"post\" enctype=\"multipart/form-data\"><input type=\"hidden\" name=\"package_id\" value=\""+this.config.package_id+"\"><input type=\"hidden\" name=\"folder_id\" value=\""+this.currentfolder+"\"><p>"+msg1+"<br /><input type=\"file\" name=\"upload_file\" id=\"upload_file\"></p><br><p>"+msg2+"<br /><input type=\"text\" name=\"filetitle\" id=\"filetitle\"></p><br><p>"+msg3+" :<br /><textarea name=\"filedescription\" id=\"filedescription\"></textarea></p><p>"+msg4+" :<br /><br /><input type=\"checkbox\" name=\"unpack_p\" value=\"t\" id=\"unpack_p\" /> "+msg5+"</p></form>");
            if(!this.upldDialog.buttons) {
                this.upldDialog.addButton({text:acs_lang_text.upload || 'Upload',icon:"/resources/ajax-filestorage-ui/icons/page_add.png",cls:"x-btn-text-icon"}, this.uploadFile, this);
                this.upldDialog.addButton({text:acs_lang_text.cancel || 'Cancel',icon:"/resources/ajax-filestorage-ui/icons/cancel.png",cls:"x-btn-text-icon"}, this.upldDialog.hide, this.upldDialog);
            }
        } else {
            if(this.swfu == null) {
                var err_msg_txt = acs_lang_text.upload_intro || "Click <b>Browse</b> to select a file to upload to the selected folder.";
                this.upldDialog.body.update("<div id=\"upldMsg\">"+err_msg_txt+"<hr></div><div class=\"flash\" id=\"fsuploadprogress\"></div>");
                var package_id = String(this.config.package_id);
                var user_id = String(this.config.user_id);
                var folder_id = String(this.currentfolder);
                var max_file_size = String(this.config.max_file_size) || 5000000;
                this.swfu = new SWFUpload({
                    debug: false,
                    upload_target_url: "/ajaxfs2/xmlhttp/file-add-flash",
                    upload_params: {user_id:user_id,package_id:package_id},
                    file_types : "*.*",
                    file_size_limit : max_file_size,
                    file_queue_limit : 3,
                    begin_upload_on_queue: false,
                    file_progress_handler : uploadProgress,
                    file_cancelled_handler : uploadCancel,
                    file_complete_handler : uploadComplete,
                    queue_complete_handler : uploadQueueComplete,
                    error_handler : uploadError,
                    flash_url : "/resources/ajax-filestorage-ui/swfupload/swfupload.swf"
                });
                this.swfu.fileQueued = uploadStart.createDelegate(this.swfu,[this],true);
                this.swfu.fileProgress = uploadProgress.createDelegate(this.swfu,[this],true);
                this.swfu.fileComplete = uploadComplete.createDelegate(this.swfu,[this],true);
                this.swfu.fileCancelled = uploadCancel.createDelegate(this.swfu,[this],true);
                this.swfu.queueComplete = uploadQueueComplete.createDelegate(this.swfu,[this],true);
                this.swfu.addSetting("progress_target", "fsuploadprogress");
                this.upldDialog.addButton({text:acs_lang_text.upload || 'Upload',disabled:true,icon:"/resources/ajax-filestorage-ui/icons/arrow_up.png",cls:"x-btn-text-icon"}, this.swfu.startUpload.createDelegate(this.swfu,[null,this],false), this);
                this.upldDialog.addButton({text:acs_lang_text.browse || 'Browse',icon:"/resources/ajax-filestorage-ui/icons/page_add.png",cls:"x-btn-text-icon"}, this.swfu.browse, this.swfu);
                this.upldDialog.addButton({text:acs_lang_text.close || 'Close',icon:"/resources/ajax-filestorage-ui/icons/cross.png",cls:"x-btn-text-icon"}, this.upldDialog.hide, this.upldDialog);
            }
        }
        this.upldDialog.body.setStyle("font","normal 12px tahoma, arial, helvetica, sans-serif");
        this.upldDialog.body.setStyle("background-color","#ffffff");
        this.upldDialog.body.setStyle("border","1px solid #e2e2e2");
        this.upldDialog.body.setStyle("padding","3px");
        this.upldDialog.show();
    }

    // determine whether to delete from the jsonview or from the tree
    this.confirmDel = function() {
        var err_msg_txt = acs_lang_text.confirm_delete || "Are you sure you want to delete"
        var err_msg_txt2 = acs_lang_text.foldercontains || "This folder contains"
        // check if there is a selected file in the jsonview
        var selectedRows = this.filegrid.getSelectionModel().getSelections();
        if (selectedRows.length > 0) {
            // ** delete from grid **
            if (selectedRows.length == 1) {
                var filetodel = selectedRows[0].get("title");
                if(selectedRows[0].get("type") === "folder") {
                    var msg = err_msg_txt2 + " <b>"+selectedRows[0].get("size")+"</b>.<br>"
                } else {
                    var msg = "";
                }
                var msg = msg + err_msg_txt+" <b>"+filetodel+"</b> ?";
            } else {
                var msg = err_msg_txt + ": <br><br>"
                for(var x=0; x<selectedRows.length; x++) {
                    msg = msg + "<b>" + selectedRows[x].get("title") + "</b> ";
                    if(selectedRows[x].get("type") === "folder") {
                        msg=msg+"("+selectedRows[x].get("size")+")";
                    }
                    msg=msg+"<br>";
                }
            }
            this.msgbox.confirm(acs_lang_text.confirm || 'Confirm', msg, this.delFsitems,this);
        } else {
            // ** delete from tree **
            // we can't delete the root node
            var selectednode = this.treepanel.getSelectionModel().getSelectedNode();
            var rootnode = this.treepanel.getRootNode();
            if(selectednode.attributes["id"] == rootnode.attributes["id"]) {
                Ext.Msg.alert(acs_lang_text.alert || "Alert",acs_lang_text.cant_del_root || "The root folder can not be deleted.");
            } else {
                // return a confirmation message
                this.msgbox.confirm(acs_lang_text.confirm || 'Confirm', err_msg_txt+' <b>'+selectednode.attributes["text"]+'</b>?', this.delFolder,this);
            }
        }
    }
    
    // delete one or more folder or files
    this.delFsitems = function(choice) {

        // get the rows to delete
        var selectedRows = this.filegrid.getSelectionModel().getSelections();

        // arrays for use later
        var object_id = [];

        // get all node id's from json view into array
        for(var x=0; x<selectedRows.length; x++) {
            object_id[x] = selectedRows[x].get("id");
        }

        var callback = function(option,success,response) {
            var err_msg_txt = acs_lang_text.delete_error || "Sorry, there was an error trying to delete this item."
            if(success && response.responseText == 1) {
                for(var x=0; x<selectedRows.length; x++) {
                    // hide the node from the json view
                    this.filegrid.getDataSource().remove(selectedRows[x]);
                    // if it's a node on the tree, remove it
                    var treenodeid = selectedRows[x].get("id");
                    // in the json node id is rowxxx where xxx is the id of the object
                    // whereas in the tree the id of the node is the object_id itself
                    var selectednode = this.treepanel.getNodeById(treenodeid);
                    if (selectednode) {
                        selectednode.parentNode.fireEvent("click",selectednode.parentNode);
                        selectednode.parentNode.removeChild(selectednode);
                    }
                }
                // clear selections after delete
                this.filegrid.getSelectionModel().clearSelections();
            } else {
                Ext.Msg.alert(acs_lang_text.error || "Error",err_msg_txt+"<br><br><font color='red'>"+response.responseText+"</font>");
            }
            this.filegrid.container.unmask();
        }

        var params = "object_id="+object_id
        var url = this.xmlhttpurl+"delete";

        if (choice === "yes") {
            this.filegrid.container.mask('Deleting');
            this.asyncCon.request({url:url,
                params: params,
                method:"POST",
                callback: callback,
                scope: this
            });
        }
    }

    // deletes a folder 
    this.delFolder = function(choice) {

        var selectednode = this.treepanel.getSelectionModel().getSelectedNode();
        var parentnode = selectednode.parentNode;
        var id = selectednode.attributes["id"];

        var callback = function(option,success,response) {
            var err_msg_txt = acs_lang_text.delete_error || "Sorry, there was an error trying to delete this item."
            if(success) {
                if (response.responseText != "1") {
                    Ext.Msg.alert(acs_lang_text.error || "Error",err_msg_txt + "<br><br><font color='red'>"+response.responseText+"</font>");
                } else {
                    parentnode.fireEvent("click",parentnode);
                    parentnode.removeChild(selectednode);
                }
            } else {
                // delete didn't work, return error
                Ext.Msg.alert(acs_lang_text.error || "Error",err_msg_txt+"<br><br><font color='red'>"+response.responseText+"</font>");
            }
        }

        if (choice === "yes") {
            this.asyncCon.request({url:this.xmlhttpurl+"delete",
                params: "object_id="+id,
                method:"POST",
                callback: callback,
                scope: this
            });
        }

    }

    // creates a new folder in the db
    //  inserts a blank folder in the ui ready for user to enter name
    this.newFolder = function() {

        // get currently selected folder
        var te = this.te;
        var tree = this.treepanel;
        var currentTreeNode = tree.getSelectionModel().getSelectedNode();
        currentTreeNode.expand();

        var callback = function(option,success,response) {
            var error_msg_txt = acs_lang_text.new_folder_error || "Sorry, there was an error trying to create your new folder.";
            if(success) {
                if (response.responseText) {
                    var result_obj = eval(response.responseText);
                    if(parseInt(result_obj[0].id) != 0) {
                        // create a new blank node on the currently selected one
                        var newnode = currentTreeNode.appendChild(new Ext.tree.TreeNode({text:result_obj[0].pretty_folder_name,id:result_obj[0].id,iconCls:'folder',singleClickExpand:true,attributes:{write_p:'t'}}));
                        tree.getSelectionModel().select(newnode);
                        newnode.loaded=true;
                        newnode.fireEvent("click",newnode);
                        setTimeout(function(){
                            te.editNode = newnode;
                            te.startEdit(newnode.ui.textNode);
                        }, 10);
                    } else {
                        Ext.Msg.alert(acs_lang_text.error || "Error",error_msg_txt + "<br><br><font color='red'>"+response.responseText+"</font>");
                    }
                }
            } else {
                Ext.Msg.alert(acs_lang_text.error || "Error",error_msg_txt + "<br><br><font color='red'>"+response.responseText+"</font>");
            }
        }

        this.asyncCon.request({url:this.xmlhttpurl+"newblankfolder",
            params: "folder_id="+currentTreeNode.attributes["id"],
            method:"POST",
            callback: callback,
            scope: this
        });
    }

    // when a node item is double clicked
    this.itemDblClick= function(grid,i,e) {
        var dm = grid.getDataSource();
        var record = dm.getAt(i);
        if(record.get("type") == "folder") {
            var node = this.treepanel.getNodeById(record.get("id"));
            if(!node.parentNode.isExpanded()) { node.parentNode.expand() }
            node.fireEvent("click",node);
            node.expand();
        } else {
            // this is a file, let the user download
            window.open(record.get("url"));
            window.focus();
        }
    }

    // creates the file grid, if it's not yet created
    this.createFileGrid = function() {
        var cols = [{header: "", width: 50,sortable: true, dataIndex: 'icon'},
                    {header: acs_lang_text.filename || "Filename", id:'filename', width: 200, sortable: true, dataIndex: 'title_and_name'},
                    {header: acs_lang_text.size || "Size", sortable: true, dataIndex: 'size'},
                    {header: acs_lang_text.lastmodified || "Last Modified", sortable: true, dataIndex: 'lastmodified'}];

        var colModel = new Ext.grid.ColumnModel(cols);
        colModel.defaultSortable=true;

        var reader = new Ext.data.JsonReader({totalProperty: 'total', root: 'foldercontents', id: 'id'}, [ 
                                                    {name:'id', type: 'int'},
                                                    {name:'icon'},
                                                    {name:'title'},
                                                    {name:'filename'},
                                                    {name:'type'},
                                                    {name:'tags'},
                                                    {name:'url'},
                                                    {name:'write_p'},
                                                    {name:'title_and_name'},
                                                    {name:'size'},
                                                    {name:'lastmodified'}] );


        var proxy = new Ext.data.HttpProxy( {
                        url : this.xmlhttpurl+ 'foldercontents'
                    } );

        var dataModel = new Ext.data.Store({proxy: proxy, reader: reader, remoteSort: true});

        this.filegrid = new Ext.grid.Grid('files',{ 
                    ds: dataModel,
                    cm: colModel,
                    autoHeight: false,
                    autoWidth: true,
                    autoSizeColumns: false,
                    trackMouseOver: true,
                    autoExpandColumn: 'filename',
                    enableColumnMove: false,
                    enableColLock: false,
                    enableColumnHide: false,
                    loadMask: true,
                    monitorWindowResize: true,
                    enableDragDrop: true,
                    ddGroup:'fileDD'
            });

        // grid listeners

        // Row Click
        // when a grid row is clicked, change the highlight on the currently selected folder
        //  this is similar to windows explorer behavior
        this.filegrid.on("rowclick",function() {
            this.treepanel.getSelectionModel().getSelectedNode().getUI().removeClass("x-tree-selected");
            this.treepanel.getSelectionModel().getSelectedNode().getUI().addClass("x-tree-grayselected");
        }, this,true);

        // Row Double Click
        this.filegrid.on("rowdblclick",this.itemDblClick,this,true);

        // Row Right Click
        this.filegrid.on("rowcontextmenu",this.showContext,this,true);

        // Sort Rows via Drag & Drop
        var thegrid = this.filegrid;
        var ajaxfsobj = this;
        var ddrow = new Ext.dd.DropTarget(thegrid.container, {
            ddGroup : 'fileDD',
            copy:false,
            notifyDrop : function(dd, e, data){
                var ds=thegrid.getDataSource();
                var sm=thegrid.getSelectionModel();
                var rows=sm.getSelections();
                if(dd.getDragData(e)) {
                    var cindex=dd.getDragData(e).rowIndex;
                    if(typeof(cindex) != "undefined") {
                        if (!this.copy){
                            for(i = 0; i < rows.length; i++) {
                                ds.remove(ds.getById(rows[i].id));
                            }
                        }
                        ds.insert(cindex,data.selections);
                        sm.clearSelections();
                    }

                    // ** CSM SPECIFIC **
                    // send an xmlhttp request to update the order_n of fs_objects
                    /*
                    var params = "";
                    var dm = thegrid.getDataSource();
                    for(var i = 0;i<dm.getCount(); i++) {
                        var el_id = dm.getAt(i);
                        params = params + "&object_ids="+el_id.get('id');
                    }
        
                    var callback = function(option,success,response) {
                        if(!success) {
                            // fail
                            // TODO :return a warning message here
                        }
                    }
            
                    ajaxfsobj.asyncCon.request({url:ajaxfsobj.xmlhttpurl+"sort-files",
                        params: params,
                        method:"POST",
                        callback: callback,
                        scope: ajaxfsobj
                    });
                    */
                }
            }
        });

        // render and put grid into the center panel
        this.filegrid.render();
        this.createGridPanel(this.filegrid,'center',{title:acs_lang_text.file_list || 'File List',closable:false});
    }

    // loads the objects associted with a tag
    this.loadTagObjects = function (tagid) {

        // create the filegrid object
        if(this.filegrid == null) {
            this.createFileGrid();
        }

        this.treepanel.getSelectionModel().clearSelections();
        var id = tagid.substring(3,tagid.length);
        this.filegrid.getDataSource().baseParams['tag_id'] = id;
        this.filegrid.getDataSource().load();
    }

     // loads the content of the given folder
    this.loadFoldercontents = function(node,e) {
        // remove the gray class from last selected tree
        if (this.currentfolder != null) {
            this.treepanel.getNodeById(this.currentfolder).getUI().removeClass("x-tree-grayselected");
        }

        if (this.currenttag != null) { Ext.get(this.currenttag).setStyle('font-weight','normal') }

        // currently selected folder
        this.currentfolder = node.id;

        // create the filegrid object
        if(this.filegrid == null) {
            this.createFileGrid();
        }

        // fetch the folder contents

        this.filegrid.getDataSource().baseParams['folder_id'] = node.id;
        this.filegrid.getDataSource().baseParams['tag_id'] = '';

        // if the tree node is still loading, wait for it to expand before loading the grid
        if(node.loading) {
            node.on("expand", function(){this.filegrid.getDataSource().load()}.createDelegate(this), true, {single:true});
        } else{
            this.filegrid.getDataSource().load();
        }
    }

    // get the root folder of this file storage instance
    //  and creates a root node for the Ext tree
    this.renderTree = function() {

        var callback = function(option,success,response) {
            if(success) {
                rootfolderobj = eval('('+response.responseText+')');

                // set the root node
                this.rootfolder = new Ext.tree.AsyncTreeNode({
                    text: rootfolderobj.text,
                    draggable:false,
                    id: rootfolderobj.id,
                    singeClickExpand: true,
                    attributes: rootfolderobj.attributes
                });

                // ********** TOOLBAR *****************


                // if the current user has write, then we create the toolbar that allows
                //  uploading files, creating new folders and deleting
                if (rootfolderobj.attributes["write_p"] == "t") {
                    // setup the toolbar on the header
                    this.toolbar = new Ext.Toolbar ("headerpanel");
                    this.toolbar.addButton({text: acs_lang_text.newfolder || 'New Folder', icon: '/resources/ajax-filestorage-ui/icons/folder_add.png', cls : 'x-btn-text-icon', handler: this.newFolder.createDelegate(this), scope: this});
                    this.toolbar.addButton({text: acs_lang_text.uploadfile || 'Upload Files', icon: '/resources/ajax-filestorage-ui/icons/add.png', cls : 'x-btn-text-icon', handler: this.showUplddialog.createDelegate(this), scope: this});
                    if (create_url_p) {
                        this.toolbar.addButton({text: acs_lang_text.createurl || 'Create Url', icon: '/resources/ajax-filestorage-ui/icons/page_link.png', cls : 'x-btn-text-icon', handler: this.showCreateUrldialog.createDelegate(this), scope: this});
                    }
                    this.toolbar.addButton({text: acs_lang_text.deletefs || 'Delete', icon: '/resources/ajax-filestorage-ui/icons/delete.png', cls : 'x-btn-text-icon', handler: this.confirmDel.createDelegate(this), scope: this});
                }
                this.toolbar.addButton({text: acs_lang_text.download_archive || 'Download Archive', icon: '/resources/ajax-filestorage-ui/icons/arrow_down.png', cls : 'x-btn-text-icon', handler: function(){top.location.href="download-archive/index?object_id="+rootfolderobj.id}.createDelegate(this),scrope:this});
        
                // render the tree
                this.treepanel.setRootNode(this.rootfolder);
                this.treepanel.render();


                // ********** OPEN INITIAL FOLDER *****************

                // recursive expand in case folder id is not on the first level
                var asyncExpand = function(x) {
                    var node = this.treepanel.getNodeById(this.config.initOpenFolder);
                    if(!node) {
                        var x = x+1;
                        var nextnodeid = this.config.pathToFolder[x];
                        var nextnode = this.treepanel.getNodeById(nextnodeid);
                        nextnode.on("expand",asyncExpand.createDelegate(this,[x]), this, {single:true});
                        nextnode.expand(true);
                    } else {
                        node.select()
                        node.fireEvent("click",node);
                    }
                }

                // if we get an initOpenFolder config,
                //  expand the provided initOpenFolder id
                var selectInitFolder = function() {
                    if(this.config.initOpenFolder) {
                        var initNode = this.treepanel.getNodeById(this.config.initOpenFolder);
                        if(initNode) { 
                            initNode.expand();
                            initNode.fireEvent("click",initNode) 
                        } else {
                            // recursively expand based on the list of folder_ids in pathToFolder
                            var x = 1;
                            var nextnode = this.treepanel.getNodeById(this.config.pathToFolder[x]);
                            nextnode.on("expand",asyncExpand.createDelegate(this,[x]), this, {single:true});
                            nextnode.expand(true);
                        }
                    } else {
                        this.treepanel.fireEvent("click",this.rootfolder);
                    }
                }

                this.rootfolder.on("expand", selectInitFolder, this, {single:true})

                // expand and select the root folder
                this.rootfolder.expand();

            } else {
                Ext.Msg.alert(acs_lang_text.error || "Error", acs_lang_text.tree_render_error || "Sorry, we encountered an error rendering the tree panel");
            }
        }

        // check if we are passed a root folder_id
        var params = "package_id="+this.config.package_id;
        if (this.config.rootfolder) {
            params = params + "&root_folder_id="+ this.config.rootfolder;
        }

        this.asyncCon.request({url:this.xmlhttpurl+"getrootfolder",
            params: params,
            method:"POST",
            callback: callback,
            scope: this
        });

    }

    // create and load the treepanel
    this.loadTreepanel = function() {

        // create a div inside the left panel to create a tree
        var folderEl = Ext.get('folderpanel').createChild({tag:'div',id:'folders'});

        // ******** create the tree **************
        this.treepanel = new Ext.tree.TreePanel('folders', {
                animate: true,
                loader: new Ext.tree.TreeLoader({ dataUrl:this.xmlhttpurl+'loadnodes',
                                                  baseParams: { package_id:this.config.package_id}
                                                }),
                enableDD:true,
                ddGroup:'fileDD',
                ddAppendOnly: true,
                containerScroll: true,
                rootVisible:true
            });

        // ******** folder rename *****************
        this.te = new Ext.tree.TreeEditor(this.treepanel, {
            allowBlank:false,
            blankText: acs_lang_text.folder_name_required || 'A folder name is required',
            selectOnFocus:true
        });

        // check if user has premission to rename
        this.te.on("beforestartedit", function(node,el,oldname) {
            if (node.editNode.attributes.attributes.write_p == "t") {
                return true;
            } else {
                Ext.Msg.alert(acs_lang_text.permission_denied || "Permission Denied", acs_lang_text.permission_denied || "Sorry, you do not have permission to rename this folder");
                return false;
            }
        }, this, true);

        // reject if the folder name is already taken
        this.te.on("beforecomplete",function(node,newval,oldval) {
            var parent = node.editNode.parentNode;
            var children = parent.childNodes;
            for(x=0;x<children.length;x++) {
                if (children[x].text == newval && children[x].id != node.editNode.id) {
                    Ext.Msg.alert(acs_lang_text.duplicate_name || "Duplicate Name", acs_lang_text.duplicate_name_error || "Please enter a different name. The name you entered is already being used.");
                    return false;
                }
            }
            return true;
        }, this, true);

        // send the update to server and validate
        this.te.on("complete", function(node,newval,oldval) {
            var callback = function(option,success,response) {
                var err_msg_txt = acs_lang_text.an_error_occurred || "An error occurred";
                var err_msg_txt2 = acs_lang_text.reverted || "Your changes have been reverted";
                if (success) {
                    if (response.responseText != 1) {
                        Ext.Msg.alert(acs_lang_text.error || "Error",err_msg_txt+": <br><br><font color='red'>"+response.responseText+"</font><br><br>"+err_msg_txt2);
                        node.editNode.setText(oldval);
                    }
                } else {
                    // ajax failed, revert value
                    Ext.Msg.alert(acs_lang_text.error || "Error",err_msg_txt+":<br><br><font color='red'>"+response.responseText+"</font><br><br>"+err_msg_txt2);
                    node.editNode.setText(oldval);
                }
            }
            this.asyncCon.request({url:this.xmlhttpurl+"editname",
                params: "newname="+newval+"&object_id="+node.editNode.id+"&type=folder",
                method:"POST",
                callback: callback,
                scope: this
            });
        }, this, true);

        // ********** CLICK *****************

        // assign a listener to listen for node clicks
        // this will fire the proc to load the right panel
        //  to fetch the fs items in that folder
        this.treepanel.on("click",this.loadFoldercontents,this,true)

        // ********** Grid Row DRAGDROP ****************

        // check if the file/folder can be dropped on a node

        this.treepanel.on("nodedragover",function(e){
            // DO NOT ALLOW DROP TO CURRENT FOLDER
            // check if the id of target node to be dropped
            //  is the same as the currently selected tree node
            if (e.target.id == this.treepanel.getSelectionModel().getSelectedNode().id) {
                return false;
            }
            // DO NOT ALLOW TO DROP A NODE TO ITSELF
            // check if the id of any of the nodes to be dropped
            // is the same as the id on the tree
            if(e.source.dragData.selections) {
                for (var x=0; x<e.source.dragData.selections.length; x++) {
                    if (e.target.id == e.source.dragData.selections[x].data.id) {
                        return false;
                    }
                }
            }
        },this,true);

        // ********* TREE NODE DRAGDROP ****************

        // handle dragging and dropping of nodes within the tree
        this.treepanel.on("beforenodedrop",function(ddobj) {

            var t = ddobj.target; // node being dropped on

            if (ddobj.data.node) {

                // we dropped a node from the tree
    
                var n = ddobj.dropNode; // node being dropped
                var p = n.parentNode; // parent node of node being dropped

                var draggedObj = ddobj.data.node.id;
                var target = ddobj.target.id;
    
                var callback = function(option,success,response) {
                    var error = false;
                    var err_msg_txt = acs_lang_text.an_error_occurred || "An error occurred";
                    var err_msg_txt2 = acs_lang_text.reverted || "Your changes have been reverted";
                    if (success) {
                        if (response.responseText != 1) {
                            Ext.Msg.alert(acs_lang_text.error || "Error",err_msg_txt + ": <br><br><font color='read'>"+response.responseText+"</font><br><br>"+err_msg_txt2);
                            error  = true;
                        } 
                    } else {
                        // ajax failed, revert value
                        Ext.Msg.alert(acs_lang_text.error || "Error", acs_lang_text.error_and_reverted || "An error occurred. Your changes have been reverted");
                        error = true;
                    }
                    // if move encountered an error, revert the change
                    if (error) {
                        option.target.removeChild(option.thenode);
                        option.parent.appendChild(option.thenode);
                        option.parent.loaded=false;
                        option.parent.expand();
                    } else {
                        option.target.loaded=false;
                        option.target.fireEvent("click",option.target);
                        option.target.expand();
                    }
                }
    
                var params = "file_ids="+draggedObj+"&folder_target_id="+target;
                var url = this.xmlhttpurl+"move";

                this.asyncCon.request({url:url,
                    params: params,
                    method:"POST",
                    callback: callback,
                    scope: this,
                    target: t,
                    parent: p,
                    thenode: n
                });

            } else {
            
                // we dropped a row from the grid
                var folder_target_id = ddobj.target.id;
                var file_ids = [];
                for(var x=0;x<ddobj.data.selections.length;x++) {
                    file_ids[x] = ddobj.data.selections[x].data.id;
                    //  and set the current parent's loaded property to false and collapse
                    if (ddobj.data.selections[x].data.type == "folder") {
                        if(this.treepanel.getNodeById(ddobj.data.selections[x].data.id)) {
                            var oldparent = this.treepanel.getNodeById(ddobj.data.selections[x].data.id).parentNode;
                            oldparent.loaded = false;
                            oldparent.removeChild(this.treepanel.getNodeById(ddobj.data.selections[x].data.id));
                        }
                    }
                }

                var callback = function(option,success,response) {
                    if(success && response.responseText == 1) {
                        var dm = this.filegrid.getDataSource();
                        var selectedRows = this.filegrid.getSelectionModel().getSelections();
                        for(var x=0; x<selectedRows.length; x++) {
                            dm.remove(selectedRows[x]);
                        }
                        option.target.loaded=false;
                    } else {
                        Ext.Msg.alert(acs_lang_text.error || "Error", acs_lang_text.error_move || "Sorry, an error occurred moving this item. A file with the same name may already exist in the target folder.");
                    }
                }

                var params = "folder_target_id="+folder_target_id+"&file_ids="+file_ids
                var url = this.xmlhttpurl+"move";
        
                var asyncCon = new Ext.data.Connection();
                asyncCon.request({url:url,
                    params: params,
                    method:"POST",
                    callback: callback,
                    scope: this,
                    target: t
                });
            }

        },this,true);

        // ******** render the tree ****************

        this.renderTree();

    }

    // create the layout for use with ajaxfs
    this.initLayout = function() {

        var fscontainer = document.body;
        if (this.config != null && this.config.layoutdiv) { fscontainer = this.config.layoutdiv; }

        // create the layout
        this.layout = new Ext.BorderLayout(fscontainer, {
                north: {
                    split:false,
                    titlebar: false,
                    autoScroll: false,
                    initialSize: 25
                }, west: {
                    autoScroll: true,
                    split:true,
                    initialSize: 350,
                    titlebar: true,
                    collapsible: true,
                    minSize: 200,
                    maxSize: 500
                }, center: {
                    autoScroll: true
                }
            });

        this.innerlayout = new Ext.BorderLayout("leftpanel", {
                center: {
                    split:true,
                    titlebar: false,
                    autoScroll: true
                }, south: {
                    split:true,
                    titlebar: true,
                    title:"Tags",
                    autoScroll: true,
                    initialSize: 130
                }
            });

        // create the panels in the regions
        this.layout.beginUpdate();
        // header panel
        this.layout.add('north', new Ext.ContentPanel('headerpanel', {autoCreate:true}));
        // folder (tree) panel
        // this.layout.add('west', new Ext.ContentPanel('folderpanel', {autoCreate:true,autoScroll:true,fitToFrame:true,fitContainer:true}));
        this.layout.add('west', new Ext.NestedLayoutPanel(this.innerlayout));
        this.innerlayout.add('center', new Ext.ContentPanel('folderpanel', {autoCreate:true,autoScroll:true,fitToFrame:true,fitContainer:true}));

        // tags
        this.tagcloudpanel = new Ext.ContentPanel('tagpanel', {autoCreate:true,autoScroll:true,fitToFrame:true,fitContainer:true});
        this.innerlayout.add('south', this.tagcloudpanel);
        this.tagcloudpanel.load("/ajaxfs2/xmlhttp/tagcloud?package_id="+this.config.package_id);
        this.tagcloudpanel.getEl().on("click", function(obj,el) { 
            if(el.tagName == "A") {
                if (this.currenttag != null) { Ext.get(this.currenttag).setStyle('font-weight','normal') }
                Ext.get(el).setStyle('font-weight','bold');
                this.currenttag = el.id;
                this.loadTagObjects(el.id);
            }
        },this);

        this.layout.endUpdate();

        var dialogConfig = {
                autoCreate:true,
                autoScroll:true,
                modal:false,
                autoTabs:true,
                width:300,
                height:300,
                shadow:false,
                shim:false,
                minWidth:300,
                minHeight:300,
                proxyDrag:true,
                fixedcenter:true
            };

        // create the upload dialog
        this.upldDialog = new Ext.BasicDialog("uploadDlg", dialogConfig);
        // create url dialog
        this.createurlDialog = new Ext.BasicDialog("urlDlg", dialogConfig);
        // create a div to hold the data grid
        Ext.get(document.body).createChild({tag:'div',id:'files'});

    }

    // initialization of the ajaxFs class
    this.initObj = function() {

        // check if ExtJs is loaded before anything else
        // ExtJs is loaded
        if (typeof(Ext.DomHelper) != "undefined") {

            // check for config
            if (configObj) { 

                this.config = configObj;

                // generic listener to check if 
                // the connection has returned a login form
                // in which case we need to redirect the user 
                //  to a login form
                // this listener is activated only if the fs instance
                //  is not a public instance
                if(!this.config.ispublic) {
                    this.asyncCon.on("requestcomplete", this.isSessionExpired, this);
                }
            }

            // setup the layout and panels
            this.initLayout();

            // create and load the tree
            this.loadTreepanel();

        }
        // ExtJs has not been loaded, do nothing
    }

    // ** initialize **

    Ext.EventManager.onDocumentReady(this.initObj,this,true);
}