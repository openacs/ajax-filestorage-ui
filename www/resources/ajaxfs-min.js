function readCookie(_1){
var ca=document.cookie.split(";");
var _3=_1+"=";
for(var i=0;i<ca.length;i++){
var c=ca[i];
while(c.charAt(0)==" "){
c=c.substring(1,c.length);
}
if(c.indexOf(_3)==0){
return c.substring(_3.length,c.length);
}
}
return null;
}
function createCookie(_6,_7,_8){
if(_8){
var _9=new Date();
_9.setTime(_9.getTime()+(_8*24*60*60*1000));
var _a="; expires="+_9.toGMTString();
}else{
var _a="";
}
document.cookie=_6+"="+_7+_a+"; path=/";
}
function readQs(q){
var _c=window.location.search.substring(1);
var _d=_c.split("&");
for(var i=0;i<_d.length;i++){
var _f=_d[i].indexOf("=");
if(_f>0){
var key=_d[i].substring(0,_f);
var val=_d[i].substring(_f+1);
if(key==q){
return val;
}
}
}
return null;
}
function checkFlashVersion(){
var x;
var _13;
if(navigator.plugins&&navigator.mimeTypes.length){
x=navigator.plugins["Shockwave Flash"];
if(x&&x.description){
x=x.description;
}
}else{
if(Ext.isIE){
try{
x=new ActiveXObject("ShockwaveFlash.ShockwaveFlash");
x=x.GetVariable("$version");
}
catch(e){
}
}
}
pluginVersion=(typeof (x)=="string")?parseInt(x.match(/\d+/)[0]):0;
return pluginVersion;
}
function isURL(_14){
if(_14.indexOf(" ")!=-1){
return false;
}else{
if(_14.indexOf("http://")==-1){
return false;
}else{
if(_14=="http://"){
return false;
}else{
if(_14.indexOf("http://")>0){
return false;
}
}
}
}
_14=_14.substring(7,_14.length);
if(_14.indexOf(".")==-1){
return false;
}else{
if(_14.indexOf(".")==0){
return false;
}else{
if(_14.charAt(_14.length-1)=="."){
return false;
}
}
}
if(_14.indexOf("/")!=-1){
_14=_14.substring(0,_14.indexOf("/"));
if(_14.charAt(_14.length-1)=="."){
return false;
}
}
if(_14.indexOf(":")!=-1){
if(_14.indexOf(":")==(_14.length-1)){
return false;
}else{
if(_14.charAt(_14.indexOf(":")+1)=="."){
return false;
}
}
_14=_14.substring(0,_14.indexOf(":"));
if(_14.charAt(_14.length-1)=="."){
return false;
}
}
return true;
}
function FileProgress(_15,_16){
this.file_progress_id=_15.id;
this.opacity=100;
this.height=0;
this.fileProgressWrapper=document.getElementById(this.file_progress_id);
if(!this.fileProgressWrapper){
this.fileProgressWrapper=document.createElement("div");
this.fileProgressWrapper.className="progressWrapper";
this.fileProgressWrapper.id=this.file_progress_id;
this.fileProgressElement=document.createElement("div");
this.fileProgressElement.className="progressContainer";
var _17=document.createElement("a");
_17.className="progressCancel";
_17.href="#";
_17.style.visibility="hidden";
_17.appendChild(document.createTextNode(" "));
var _18=document.createElement("div");
_18.className="progressName";
_18.appendChild(document.createTextNode(_15.name));
var _19=document.createElement("div");
_19.className="progressBarInProgress";
var _1a=document.createElement("div");
_1a.className="progressBarStatus";
_1a.innerHTML="&nbsp;";
this.fileProgressElement.appendChild(_17);
this.fileProgressElement.appendChild(_18);
this.fileProgressElement.appendChild(_1a);
this.fileProgressElement.appendChild(_19);
this.fileProgressWrapper.appendChild(this.fileProgressElement);
document.getElementById(_16).appendChild(this.fileProgressWrapper);
}else{
this.fileProgressElement=this.fileProgressWrapper.firstChild;
}
this.height=this.fileProgressWrapper.offsetHeight;
}
FileProgress.prototype.SetProgress=function(_1b){
this.fileProgressElement.className="progressContainer green";
this.fileProgressElement.childNodes[3].className="progressBarInProgress";
this.fileProgressElement.childNodes[3].style.width=_1b+"%";
};
FileProgress.prototype.SetComplete=function(){
this.fileProgressElement.className="progressContainer blue";
this.fileProgressElement.childNodes[3].className="progressBarComplete";
this.fileProgressElement.childNodes[3].style.width="";
var _1c=this;
setTimeout(function(){
_1c.Disappear();
},10000);
};
FileProgress.prototype.SetError=function(){
this.fileProgressElement.className="progressContainer red";
this.fileProgressElement.childNodes[3].className="progressBarError";
this.fileProgressElement.childNodes[3].style.width="";
var _1d=this;
setTimeout(function(){
_1d.Disappear();
},5000);
};
FileProgress.prototype.SetCancelled=function(){
this.fileProgressElement.className="progressContainer";
this.fileProgressElement.childNodes[3].className="progressBarError";
this.fileProgressElement.childNodes[3].style.width="";
var _1e=this;
setTimeout(function(){
_1e.Disappear();
},2000);
};
FileProgress.prototype.SetStatus=function(_1f){
this.fileProgressElement.childNodes[2].innerHTML=_1f;
};
FileProgress.prototype.ToggleCancel=function(_20,_21){
this.fileProgressElement.childNodes[0].style.visibility=_20?"visible":"hidden";
if(_21){
var _22=this.file_progress_id;
this.fileProgressElement.childNodes[0].onclick=function(){
_21.cancelUpload(_22);
return false;
};
}
};
FileProgress.prototype.Disappear=function(){
var _23=15;
var _24=4;
var _25=30;
if(this.opacity>0){
this.opacity-=_23;
if(this.opacity<0){
this.opacity=0;
}
if(this.fileProgressWrapper.filters){
try{
this.fileProgressWrapper.filters.item("DXImageTransform.Microsoft.Alpha").opacity=this.opacity;
}
catch(e){
this.fileProgressWrapper.style.filter="progid:DXImageTransform.Microsoft.Alpha(opacity="+this.opacity+")";
}
}else{
this.fileProgressWrapper.style.opacity=this.opacity/100;
}
}
if(this.height>0){
this.height-=_24;
if(this.height<0){
this.height=0;
}
this.fileProgressWrapper.style.height=this.height+"px";
}
if(this.height>0||this.opacity>0){
var _26=this;
setTimeout(function(){
_26.Disappear();
},_25);
}else{
this.fileProgressWrapper.style.display="none";
}
};
function uploadStart(_27,_28){
var _29=acs_lang_text.for_upload_to||"for upload to";
var _2a=acs_lang_text.zip_extracted||"Zip File (Will be extracted after upload)";
try{
var _2b=_28.currentfolder;
var _2c=_28.treepanel.getNodeById(_2b).text;
var _2d=new FileProgress(_27,this.getSetting("progress_target"));
_2d.SetStatus(_29+"<b>"+_2c+"</b><br>Title: <input type='text' onblur=\"fsInstance.swfu.removeFileParam('"+_27.id+"','filetitle');fsInstance.swfu.addFileParam('"+_27.id+"','filetitle',this.value)\">(optional)<br><input type='checkbox' id='zip"+_27.id+"' onclick=\"if(document.getElementById('zip"+_27.id+"').checked) { fsInstance.swfu.addFileParam('"+_27.id+"','unpack_p','1') } else { fsInstance.swfu.removeFileParam('"+_27.id+"','unpack_p') }\"> "+_2a);
_2d.ToggleCancel(true,this);
this.addFileParam(_27.id,"folder_id",_2b);
_28.upldDialog.buttons[0].enable();
}
catch(ex){
this.debugMessage(ex);
}
}
function uploadProgress(_2e,_2f){
try{
var _30=Math.ceil((_2f/_2e.size)*100);
var _31=new FileProgress(_2e,this.getSetting("progress_target"));
_31.SetProgress(_30);
_31.SetStatus(acs_lang_text.uploading||"Uploading...");
}
catch(ex){
this.debugMessage(ex);
}
}
function uploadFileComplete(_32){
try{
var _33=new FileProgress(_32,this.getSetting("progress_target"));
_33.SetComplete();
_33.SetStatus(acs_lang_text.complete||"Complete.");
_33.ToggleCancel(false);
}
catch(ex){
this.debugMessage(ex);
}
}
function uploadComplete(_34){
try{
var _35=new FileProgress(_34,this.getSetting("progress_target"));
_35.SetComplete();
_35.SetStatus(acs_lang_text.complete||"Complete.");
_35.ToggleCancel(false);
}
catch(ex){
this.debugMessage(ex);
}
}
function uploadQueueComplete(_36,_37){
_37.upldDialog.buttons[0].disable();
var _38=_37.treepanel.getNodeById(_37.currentfolder);
_38.fireEvent("click",_38);
}
function uploadError(_39,_3a,_3b){
try{
if(_39==SWFUpload.ERROR_CODE_QUEUE_LIMIT_EXCEEDED){
Ext.Msg.alert(acs_lang_text.alert||"Alert","You have attempted to queue too many files.\n"+(_3b==0?"You have reached the upload limit.":"You may select "+(_3b>1?"up to "+_3b+" files.":"one file.")));
return;
}
var _3c=new FileProgress(_3a,this.getSetting("progress_target"));
_3c.SetError();
_3c.ToggleCancel(false);
switch(_39){
case SWFUpload.ERROR_CODE_HTTP_ERROR:
_3c.SetStatus("Upload Error");
this.debugMessage("Error Code: HTTP Error, File name: "+file.name+", Message: "+_3b);
break;
case SWFUpload.ERROR_CODE_MISSING_UPLOAD_TARGET:
_3c.SetStatus("Configuration Error");
this.debugMessage("Error Code: No backend file, File name: "+file.name+", Message: "+_3b);
break;
case SWFUpload.ERROR_CODE_UPLOAD_FAILED:
_3c.SetStatus("Upload Failed.");
this.debugMessage("Error Code: Upload Failed, File name: "+file.name+", File size: "+file.size+", Message: "+_3b);
break;
case SWFUpload.ERROR_CODE_IO_ERROR:
_3c.SetStatus("Server (IO) Error");
this.debugMessage("Error Code: IO Error, File name: "+file.name+", Message: "+_3b);
break;
case SWFUpload.ERROR_CODE_SECURITY_ERROR:
_3c.SetStatus("Security Error");
this.debugMessage("Error Code: Security Error, File name: "+file.name+", Message: "+_3b);
break;
case SWFUpload.ERROR_CODE_FILE_EXCEEDS_SIZE_LIMIT:
_3c.SetStatus("File is too big.");
this.debugMessage("Error Code: File too big, File name: "+file.name+", File size: "+file.size+", Message: "+_3b);
break;
case SWFUpload.ERROR_CODE_ZERO_BYTE_FILE:
_3c.SetStatus("Cannot upload Zero Byte files.");
this.debugMessage("Error Code: Zero byte file, File name: "+file.name+", File size: "+file.size+", Message: "+_3b);
break;
case SWFUpload.ERROR_CODE_UPLOAD_LIMIT_EXCEEDED:
_3c.SetStatus("Upload limit exceeded.");
this.debugMessage("Error Code: Upload Limit Exceeded, File name: "+file.name+", File size: "+file.size+", Message: "+_3b);
break;
default:
_3c.SetStatus("Unhandled Error");
this.debugMessage("Error Code: "+_39+", File name: "+file.name+", File size: "+file.size+", Message: "+_3b);
break;
}
}
catch(ex){
this.debugMessage(ex);
}
}
function uploadCancel(_3d){
try{
var _3e=new FileProgress(_3d,this.getSetting("progress_target"));
_3e.SetCancelled();
_3e.SetStatus(acs_lang_text.uploadcancel||"Cancelled (This item will be removed shortly)");
_3e.ToggleCancel(false);
}
catch(ex){
this.debugMessage(ex);
}
}
function ajaxfs(_3f){
this.xmlhttpurl="/ajaxfs2/xmlhttp/";
this.config=null;
this.layout=null;
this.treepanel=null;
this.tagcloudpanel=null;
this.te=null;
this.rootfolder=null;
this.filegrid=null;
this.toolbar=null;
this.currentfolder=null;
this.currenttag=null;
this.asyncCon=new Ext.data.Connection();
this.msgbox=Ext.MessageBox;
this.upldDialog=null;
this.createurlDialog=null;
this.permsDialog=null;
this.revisionsDialog=null;
this.contextmenu=null;
this.swfu=null;
this.isSessionExpired=function(){
if(readCookie("ad_user_login")==null){
Ext.get(document.body).mask(acs_lang_text.sessionexpired||"Your session has expired. You need to login again. <br>You will be redirected to a login page shortly");
var _40="package_id="+this.config.package_id;
if(this.currentfolder!=null){
_40=_40+"&folder_id="+this.currentfolder;
}
window.location="/register/?return_url="+window.location;
return 1;
}
return 0;
};
this.isPermitted=function(_41,_42){
var _43=function(_44,_45,_46){
if(_45){
return _46.responseText;
}else{
return 0;
}
};
this.asyncCon.request({url:this.xmlhttpurl+"checkperms",params:"object_id="+_41+"&perm="+_42,method:"POST",callback:_43,scope:this});
};
this.createGridPanel=function(_47,_48,_49){
gridPanel=new Ext.GridPanel(_47,_49);
this.layout.add(_48,gridPanel);
};
this.linkCopy=function(){
var _4a=this.filegrid.getSelectionModel().getSelected();
var _4b=_4a.get("type");
if(_4b==="folder"){
var _4c=window.location.protocol+"//"+window.location.hostname+":"+window.location.port+this.config.package_url+"?package_id="+this.config.package_id+"&folder_id="+_4a.get("id");
}else{
if(_4b==="url"){
var _4c=_4a.get("url");
}else{
var _4c=window.location.protocol+"//"+window.location.hostname+_4a.get("url");
}
}
if(Ext.isIE){
window.clipboardData.setData("text",_4c);
}else{
var _4d=Ext.Msg.show({title:acs_lang_text.linkaddress||"Copy Link Address",prompt:true,msg:acs_lang_text.copyhighlighted||"Copy the highlighted text to your clipboard.",value:_4c,buttons:Ext.Msg.OK});
var _4e=YAHOO.util.Dom.getElementsByClassName("ext-mb-input","input","x-msg-box");
_4e[0].select();
}
};
this.fileRename=function(){
var _4f=this.filegrid.getSelectionModel().getSelected();
var _50=_4f.get("url");
var _51=_4f.get("type");
var _52=_4f.get("id");
var _53=_4f.get("filename");
var _54=function(btn,_56){
if(btn=="ok"){
if(_56!=""){
if(_56.length>100){
Ext.Msg.alert(acs_lang_text.alert||"Alert",acs_lang_text.limitto100||"Please limit your name to 100 characters or less.");
return false;
}else{
var _57=function(_58,_59,_5a){
var _5b=acs_lang_text.an_error_occurred||"An error occurred";
var _5c=acs_lang_text.reverted||"Your changes have been reverted";
if(_59){
if(_5a.responseText!=1){
Ext.Msg.alert(acs_lang_text.error||"Error",_5b+": <br><br><font color='red'>"+_5a.responseText+"</font><br><br>"+_5c);
}else{
if(_51!="folder"&&_53===" "){
_53=_4f.get("title");
_4f.set("filename",_53);
}
if(_51=="folder"){
this.treepanel.getNodeById(_52).setText(_56);
}
nodetags=_4f.get("tags");
if(nodetags!=""){
var _5d="<div id='tagscontainer_"+_52+"' style='color:blue'><div style='float:left'>Tags:</div><span id='tagslist_"+_52+"' style='float:left'>"+nodetags+"</span></div>";
}else{
var _5d="<div id='tagscontainer_"+_52+"' style='color:blue'></div>";
}
_4f.set("title",_56);
_4f.set("title_and_name","<span id='title"+_52+"'>"+_56+"</span><br><font style='font-size:10px;color:#666666'><span id='subtitle"+_52+"'>"+_53+"</span></font>"+_5d);
_4f.commit();
}
}else{
Ext.Msg.alert(acs_lang_text.error||"Error",_5b+":<br><br><font color='red'>"+_5a.responseText+"</font><br><br>"+_5c);
}
};
this.asyncCon.request({url:this.xmlhttpurl+"editname",params:"newname="+_56+"&object_id="+_52+"&type="+_51+"&url="+_50,method:"POST",callback:_57,scope:this});
}
}else{
Ext.Msg.alert(acs_lang_text.alert||"Alert",acs_lang_text.enter_new_name||"Please enter a new name.");
return false;
}
}
};
Ext.Msg.show({title:acs_lang_text.rename||"Rename",prompt:true,msg:acs_lang_text.enter_new_name||"Please enter a new name for ... ",value:_4f.get("title"),buttons:Ext.Msg.OKCANCEL,fn:_54.createDelegate(this)});
var _5e=YAHOO.util.Dom.getElementsByClassName("ext-mb-input","input","x-msg-box");
_5e[0].select();
};
this.permsRedirect=function(){
var _5f=this.filegrid.getSelectionModel().getSelected();
var _60=_5f.get("id");
var _61=window.open(window.location.protocol+"//"+window.location.hostname+":"+window.location.port+this.config.package_url+"permissions?object_id="+_60+"&return_url="+window.location.pathname+"?package_id="+this.config.package_id+"&folder_id="+this.currentfolder);
_61.focus();
};
this.propertiesRedirect=function(){
var _62=this.filegrid.getSelectionModel().getSelected();
var _63=_62.get("id");
var _64=window.open(window.location.protocol+"//"+window.location.hostname+":"+window.location.port+this.config.package_url+"file?file_id="+_63);
_64.focus();
};
this.viewsRedirect=function(){
var _65=this.filegrid.getSelectionModel().getSelected();
var _66=_65.get("id");
window.open(window.location.protocol+"//"+window.location.hostname+"/o/"+_66+"/info");
window.focus();
};
this.promptTag=function(){
var _67=this;
var _68=_67.filegrid.getSelectionModel().getSelected();
var _69=_68.get("id");
Ext.Msg.prompt("Tag","Enter or edit one or more tags. Seperate tags with commas (,):",function(btn,_6b){
if(btn=="ok"){
var _6c=function(_6d,_6e,_6f){
if(_6e){
_68.set("tags",_6b);
Ext.get("tagscontainer_"+_69).update("Tag:<span id='tagslist_"+_6b+"'>"+_6b+"</span>");
this.tagcloudpanel.load("/ajaxfs2/xmlhttp/tagcloud?package_id="+this.config.package_id);
}
};
_67.asyncCon.request({url:_67.xmlhttpurl+"addtag",params:"object_id="+_69+"&tags="+_6b+"&package_id="+_67.config.package_id,method:"POST",callback:_6c,scope:_67});
}
});
if(document.getElementById("tagslist_"+_69)){
var _70=YAHOO.util.Dom.getElementsByClassName("ext-mb-input","input","x-msg-box");
_70[0].value=document.getElementById("tagslist_"+_69).innerHTML;
_70[0].select();
}
};
this.downloadArchive=function(){
var _71=this.filegrid.getSelectionModel().getSelected();
var _72=_71.get("id");
top.location.href="download-archive/?object_id="+_72;
};
this.showContext=function(_73,i,e){
e.stopEvent();
var dm=_73.getDataSource();
var _77=dm.getAt(i);
var _78=_77.get("type");
var _79=_77.get("id");
if(_78=="folder"){
var _7a="Open";
}else{
var _7a="Download";
}
if(this.contextmenu==null){
this.contextmenu=new Ext.menu.Menu({id:"rightclickmenu",items:[new Ext.menu.Item({text:_7a,icon:"/resources/ajax-filestorage-ui/icons/page_white.png",handler:this.itemDblClick.createDelegate(this,[_73,i,e],false)}),new Ext.menu.Item({text:"Tag",icon:"/resources/ajax-filestorage-ui/icons/tag_blue.png",handler:this.promptTag.createDelegate(this)}),new Ext.menu.Item({text:"Views",icon:"/resources/ajax-filestorage-ui/icons/camera.png",handler:this.viewsRedirect.createDelegate(this)}),new Ext.menu.Item({text:acs_lang_text.deletefs||"Delete",icon:"/resources/ajax-filestorage-ui/icons/delete.png",handler:this.confirmDel.createDelegate(this)}),new Ext.menu.Item({text:acs_lang_text.rename||"Rename",icon:"/resources/ajax-filestorage-ui/icons/page_edit.png",handler:this.fileRename.createDelegate(this)}),new Ext.menu.Item({text:acs_lang_text.linkaddress||"Copy Link Address",icon:"/resources/ajax-filestorage-ui/icons/page_copy.png",handler:this.linkCopy.createDelegate(this)}),new Ext.menu.Item({text:acs_lang_text.permissions||"Permissions",icon:"/resources/ajax-filestorage-ui/icons/group_key.png",handler:this.permsRedirect.createDelegate(this)}),new Ext.menu.Item({text:acs_lang_text.properties||"Properties",icon:"/resources/ajax-filestorage-ui/icons/page_edit.png",handler:this.propertiesRedirect.createDelegate(this)}),new Ext.menu.Item({text:acs_lang_text.download_archive||"Download archive",icon:"/resources/ajax-filestorage-ui/icons/arrow_down.png",handler:this.downloadArchive.createDelegate(this)})]});
}else{
this.contextmenu.items.items[0].setText(_7a);
}
if(_73.getSelectionModel().getCount()>1){
this.contextmenu.items.items[0].hide();
this.contextmenu.items.items[1].hide();
this.contextmenu.items.items[2].hide();
this.contextmenu.items.items[3].show();
this.contextmenu.items.items[4].hide();
this.contextmenu.items.items[5].hide();
this.contextmenu.items.items[6].hide();
this.contextmenu.items.items[7].hide();
this.contextmenu.items.items[8].hide();
}else{
this.contextmenu.items.items[0].show();
this.contextmenu.items.items[2].show();
this.contextmenu.items.items[3].show();
this.contextmenu.items.items[4].show();
this.contextmenu.items.items[5].show();
this.contextmenu.items.items[6].show();
if(_78=="folder"){
this.contextmenu.items.items[1].hide();
this.contextmenu.items.items[7].hide();
this.contextmenu.items.items[8].show();
}else{
this.contextmenu.items.items[1].show();
this.contextmenu.items.items[7].show();
this.contextmenu.items.items[8].hide();
}
}
var _7b=e.getXY();
this.contextmenu.rowid=i;
this.contextmenu.showAt([_7b[0],_7b[1]]);
};
this.uploadFile=function(e){
if(document.getElementById("upload_file").value!=""&&document.getElementById("filetitle").value!=""){
var _7d={success:function(){
},upload:function(){
this.treepanel.getSelectionModel().getSelectedNode().loaded=false;
this.treepanel.getSelectionModel().getSelectedNode().fireEvent("click",this.treepanel.getSelectionModel().getSelectedNode());
this.upldDialog.getEl().unmask();
this.upldDialog.hide();
},failure:function(){
Ext.Msg.alert(acs_lang_text.error||"Error",acs_lang_text.upload_failed||"Upload failed, please try again later.");
},scope:this};
var _7e=acs_lang_text.loading||"One moment. This may take a while depending on how large your upload is.";
this.upldDialog.getEl().mask("<img src='/resources/ajaxhelper/images/indicator.gif'>&nbsp;"+_7e);
YAHOO.util.Connect.setForm("newfileform",true,true);
var _7f=YAHOO.util.Connect.asyncRequest("POST",this.xmlhttpurl+"file-add",_7d);
}else{
Ext.Msg.alert(acs_lang_text.alert||"Alert",acs_lang_text.file_required||"<b>Title</b> and <b>File to upload</b> are required.");
}
};
this.createUrl=function(e){
if(document.getElementById("fsurl").value!=""&&document.getElementById("fstitle").value!=""){
if(isURL(document.getElementById("fsurl").value)){
var _81={success:function(){
this.treepanel.getSelectionModel().getSelectedNode().loaded=false;
this.treepanel.getSelectionModel().getSelectedNode().fireEvent("click",this.treepanel.getSelectionModel().getSelectedNode());
this.createurlDialog.getEl().unmask();
this.createurlDialog.hide();
},failure:function(){
this.createurlDialog.getEl().unmask();
Ext.Msg.alert(acs_lang_text.error||"Error",acs_lang_text.createurl_failed||"Create URL failed, please try again later.");
},scope:this};
this.createurlDialog.getEl().mask("<img src='/resources/ajaxhelper/images/indicator.gif'>&nbsp;One moment.");
YAHOO.util.Connect.setForm("simple-add");
var _82=YAHOO.util.Connect.asyncRequest("POST",this.xmlhttpurl+"url-add",_81);
}else{
Ext.Msg.alert(acs_lang_text.alert||"Alert",acs_lang_text.invalid_url||"<b>URL</b> is not a valid url.");
}
}else{
Ext.Msg.alert(acs_lang_text.alert||"Alert",acs_lang_text.invalid_url||"<b>Title</b> and <b>URL</b> are required.");
}
};
this.showCreateUrldialog=function(){
if(!this.createurlDialog.buttons){
this.createurlDialog.addButton({text:acs_lang_text.ok||"Ok",icon:"/resources/ajax-filestorage-ui/icons/page_add.png",cls:"x-btn-text-icon"},this.createUrl,this);
this.createurlDialog.addButton({text:acs_lang_text.cancel||"Cancel",icon:"/resources/ajax-filestorage-ui/icons/cancel.png",cls:"x-btn-text-icon"},this.createurlDialog.hide,this.createurlDialog);
}
this.createurlDialog.setTitle(acs_lang_text.createurl||"Create URL");
this.createurlDialog.body.update("<form id=\"simple-add\" method=\"post\" enctype=\"multipart/form-data\"><input type=\"hidden\" name=\"package_id\" value=\""+this.config.package_id+"\"><input type=\"hidden\" name=\"folder_id\" value=\""+this.currentfolder+"\"><p>Title<br /><input type=\"text\" name=\"fstitle\" id=\"fstitle\"></p><br><p>URL<br /><input type=\"text\" name=\"fsurl\" id=\"fsurl\" value=\"http://\"></p><br><p>Description :<br /><textarea name=\"fsdescription\" id=\"fsdescription\"></textarea></p></form>");
this.createurlDialog.body.setStyle("font","normal 12px tahoma, arial, helvetica, sans-serif");
this.createurlDialog.body.setStyle("background-color","#ffffff");
this.createurlDialog.body.setStyle("border","1px solid #e2e2e2");
this.createurlDialog.body.setStyle("padding","3px");
this.createurlDialog.show();
};
this.showUplddialog=function(){
this.upldDialog.setTitle(acs_lang_text.uploadfile||"Upload Files");
if(checkFlashVersion()<8){
var _83=acs_lang_text.file_to_upload||"File to upload";
var _84=acs_lang_text.file_title||"Title";
var _85=acs_lang_text.file_description||"Description";
var _86=acs_lang_text.multiple_files||"Multiple Files";
var _87=acs_lang_text.multiple_files_msg||"This is a ZIPfile containing multiple files.";
this.upldDialog.body.update("<form id=\"newfileform\" method=\"post\" enctype=\"multipart/form-data\"><input type=\"hidden\" name=\"package_id\" value=\""+this.config.package_id+"\"><input type=\"hidden\" name=\"folder_id\" value=\""+this.currentfolder+"\"><p>"+_83+"<br /><input type=\"file\" name=\"upload_file\" id=\"upload_file\"></p><br><p>"+_84+"<br /><input type=\"text\" name=\"filetitle\" id=\"filetitle\"></p><br><p>"+_85+" :<br /><textarea name=\"filedescription\" id=\"filedescription\"></textarea></p><p>"+_86+" :<br /><br /><input type=\"checkbox\" name=\"unpack_p\" value=\"t\" id=\"unpack_p\" /> "+_87+"</p></form>");
if(!this.upldDialog.buttons){
this.upldDialog.addButton({text:acs_lang_text.upload||"Upload",icon:"/resources/ajax-filestorage-ui/icons/page_add.png",cls:"x-btn-text-icon"},this.uploadFile,this);
this.upldDialog.addButton({text:acs_lang_text.cancel||"Cancel",icon:"/resources/ajax-filestorage-ui/icons/cancel.png",cls:"x-btn-text-icon"},this.upldDialog.hide,this.upldDialog);
}
}else{
if(this.swfu==null){
var _88=acs_lang_text.upload_intro||"Click <b>Browse</b> to select a file to upload to the selected folder.";
this.upldDialog.body.update("<div id=\"upldMsg\">"+_88+"<hr></div><div class=\"flash\" id=\"fsuploadprogress\"></div>");
var _89=String(this.config.package_id);
var _8a=String(this.config.user_id);
var _8b=String(this.currentfolder);
var _8c=String(this.config.max_file_size)||5000000;
this.swfu=new SWFUpload({debug:false,upload_target_url:"/ajaxfs2/xmlhttp/file-add-flash",upload_params:{user_id:_8a,package_id:_89},file_types:"*.*",file_size_limit:_8c,file_queue_limit:3,begin_upload_on_queue:false,file_progress_handler:uploadProgress,file_cancelled_handler:uploadCancel,file_complete_handler:uploadComplete,queue_complete_handler:uploadQueueComplete,error_handler:uploadError,flash_url:"/resources/ajax-filestorage-ui/swfupload/swfupload.swf"});
this.swfu.fileQueued=uploadStart.createDelegate(this.swfu,[this],true);
this.swfu.fileProgress=uploadProgress.createDelegate(this.swfu,[this],true);
this.swfu.fileComplete=uploadComplete.createDelegate(this.swfu,[this],true);
this.swfu.fileCancelled=uploadCancel.createDelegate(this.swfu,[this],true);
this.swfu.queueComplete=uploadQueueComplete.createDelegate(this.swfu,[this],true);
this.swfu.addSetting("progress_target","fsuploadprogress");
this.upldDialog.addButton({text:acs_lang_text.upload||"Upload",disabled:true,icon:"/resources/ajax-filestorage-ui/icons/arrow_up.png",cls:"x-btn-text-icon"},this.swfu.startUpload.createDelegate(this.swfu,[null,this],false),this);
this.upldDialog.addButton({text:acs_lang_text.browse||"Browse",icon:"/resources/ajax-filestorage-ui/icons/page_add.png",cls:"x-btn-text-icon"},this.swfu.browse,this.swfu);
this.upldDialog.addButton({text:acs_lang_text.close||"Close",icon:"/resources/ajax-filestorage-ui/icons/cross.png",cls:"x-btn-text-icon"},this.upldDialog.hide,this.upldDialog);
}
}
this.upldDialog.body.setStyle("font","normal 12px tahoma, arial, helvetica, sans-serif");
this.upldDialog.body.setStyle("background-color","#ffffff");
this.upldDialog.body.setStyle("border","1px solid #e2e2e2");
this.upldDialog.body.setStyle("padding","3px");
this.upldDialog.show();
};
this.confirmDel=function(){
var _8d=acs_lang_text.confirm_delete||"Are you sure you want to delete";
var _8e=acs_lang_text.foldercontains||"This folder contains";
var _8f=this.filegrid.getSelectionModel().getSelections();
if(_8f.length>0){
if(_8f.length==1){
var _90=_8f[0].get("title");
if(_8f[0].get("type")==="folder"){
var msg=_8e+" <b>"+_8f[0].get("size")+"</b>.<br>";
}else{
var msg="";
}
var msg=msg+_8d+" <b>"+_90+"</b> ?";
}else{
var msg=_8d+": <br><br>";
for(var x=0;x<_8f.length;x++){
msg=msg+"<b>"+_8f[x].get("title")+"</b> ";
if(_8f[x].get("type")==="folder"){
msg=msg+"("+_8f[x].get("size")+")";
}
msg=msg+"<br>";
}
}
this.msgbox.confirm(acs_lang_text.confirm||"Confirm",msg,this.delFsitems,this);
}else{
var _93=this.treepanel.getSelectionModel().getSelectedNode();
var _94=this.treepanel.getRootNode();
if(_93.attributes["id"]==_94.attributes["id"]){
Ext.Msg.alert(acs_lang_text.alert||"Alert",acs_lang_text.cant_del_root||"The root folder can not be deleted.");
}else{
this.msgbox.confirm(acs_lang_text.confirm||"Confirm",_8d+" <b>"+_93.attributes["text"]+"</b>?",this.delFolder,this);
}
}
};
this.delFsitems=function(_95){
var _96=this.filegrid.getSelectionModel().getSelections();
var _97=[];
for(var x=0;x<_96.length;x++){
_97[x]=_96[x].get("id");
}
var _99=function(_9a,_9b,_9c){
var _9d=acs_lang_text.delete_error||"Sorry, there was an error trying to delete this item.";
if(_9b&&_9c.responseText==1){
for(var x=0;x<_96.length;x++){
this.filegrid.getDataSource().remove(_96[x]);
var _9f=_96[x].get("id");
var _a0=this.treepanel.getNodeById(_9f);
if(_a0){
_a0.parentNode.fireEvent("click",_a0.parentNode);
_a0.parentNode.removeChild(_a0);
}
}
this.filegrid.getSelectionModel().clearSelections();
}else{
Ext.Msg.alert(acs_lang_text.error||"Error",_9d+"<br><br><font color='red'>"+_9c.responseText+"</font>");
}
this.filegrid.container.unmask();
};
var _a1="object_id="+_97;
var url=this.xmlhttpurl+"delete";
if(_95==="yes"){
this.filegrid.container.mask("Deleting");
this.asyncCon.request({url:url,params:_a1,method:"POST",callback:_99,scope:this});
}
};
this.delFolder=function(_a3){
var _a4=this.treepanel.getSelectionModel().getSelectedNode();
var _a5=_a4.parentNode;
var id=_a4.attributes["id"];
var _a7=function(_a8,_a9,_aa){
var _ab=acs_lang_text.delete_error||"Sorry, there was an error trying to delete this item.";
if(_a9){
if(_aa.responseText!="1"){
Ext.Msg.alert(acs_lang_text.error||"Error",_ab+"<br><br><font color='red'>"+_aa.responseText+"</font>");
}else{
_a5.fireEvent("click",_a5);
_a5.removeChild(_a4);
}
}else{
Ext.Msg.alert(acs_lang_text.error||"Error",_ab+"<br><br><font color='red'>"+_aa.responseText+"</font>");
}
};
if(_a3==="yes"){
this.asyncCon.request({url:this.xmlhttpurl+"delete",params:"object_id="+id,method:"POST",callback:_a7,scope:this});
}
};
this.newFolder=function(){
var te=this.te;
var _ad=this.treepanel;
var _ae=_ad.getSelectionModel().getSelectedNode();
_ae.expand();
var _af=function(_b0,_b1,_b2){
var _b3=acs_lang_text.new_folder_error||"Sorry, there was an error trying to create your new folder.";
if(_b1){
if(_b2.responseText){
var _b4=eval(_b2.responseText);
if(parseInt(_b4[0].id)!=0){
var _b5=_ae.appendChild(new Ext.tree.TreeNode({text:_b4[0].pretty_folder_name,id:_b4[0].id,iconCls:"folder",singleClickExpand:true,attributes:{write_p:"t"}}));
_ad.getSelectionModel().select(_b5);
_b5.loaded=true;
_b5.fireEvent("click",_b5);
setTimeout(function(){
te.editNode=_b5;
te.startEdit(_b5.ui.textNode);
},10);
}else{
Ext.Msg.alert(acs_lang_text.error||"Error",_b3+"<br><br><font color='red'>"+_b2.responseText+"</font>");
}
}
}else{
Ext.Msg.alert(acs_lang_text.error||"Error",_b3+"<br><br><font color='red'>"+_b2.responseText+"</font>");
}
};
this.asyncCon.request({url:this.xmlhttpurl+"newblankfolder",params:"folder_id="+_ae.attributes["id"],method:"POST",callback:_af,scope:this});
};
this.itemDblClick=function(_b6,i,e){
var dm=_b6.getDataSource();
var _ba=dm.getAt(i);
if(_ba.get("type")=="folder"){
var _bb=this.treepanel.getNodeById(_ba.get("id"));
if(!_bb.parentNode.isExpanded()){
_bb.parentNode.expand();
}
_bb.fireEvent("click",_bb);
_bb.expand();
}else{
window.open(_ba.get("url"));
window.focus();
}
};
this.createFileGrid=function(){
var _bc=[{header:"",width:50,sortable:true,dataIndex:"icon"},{header:acs_lang_text.filename||"Filename",id:"filename",width:200,sortable:true,dataIndex:"title_and_name"},{header:acs_lang_text.size||"Size",sortable:true,dataIndex:"size"},{header:acs_lang_text.lastmodified||"Last Modified",sortable:true,dataIndex:"lastmodified"}];
var _bd=new Ext.grid.ColumnModel(_bc);
_bd.defaultSortable=true;
var _be=new Ext.data.JsonReader({totalProperty:"total",root:"foldercontents",id:"id"},[{name:"id",type:"int"},{name:"icon"},{name:"title"},{name:"filename"},{name:"type"},{name:"tags"},{name:"url"},{name:"write_p"},{name:"title_and_name"},{name:"size"},{name:"lastmodified"}]);
var _bf=new Ext.data.HttpProxy({url:this.xmlhttpurl+"foldercontents"});
var _c0=new Ext.data.Store({proxy:_bf,reader:_be,remoteSort:true});
this.filegrid=new Ext.grid.Grid("files",{ds:_c0,cm:_bd,autoHeight:false,autoWidth:true,autoSizeColumns:false,trackMouseOver:true,autoExpandColumn:"filename",enableColumnMove:false,enableColLock:false,enableColumnHide:false,loadMask:true,monitorWindowResize:true,enableDragDrop:true,ddGroup:"fileDD"});
this.filegrid.on("rowclick",function(){
this.treepanel.getSelectionModel().getSelectedNode().getUI().removeClass("x-tree-selected");
this.treepanel.getSelectionModel().getSelectedNode().getUI().addClass("x-tree-grayselected");
},this,true);
this.filegrid.on("rowdblclick",this.itemDblClick,this,true);
this.filegrid.on("rowcontextmenu",this.showContext,this,true);
var _c1=this.filegrid;
var _c2=this;
var _c3=new Ext.dd.DropTarget(_c1.container,{ddGroup:"fileDD",copy:false,notifyDrop:function(dd,e,_c6){
var ds=_c1.getDataSource();
var sm=_c1.getSelectionModel();
var _c9=sm.getSelections();
if(dd.getDragData(e)){
var _ca=dd.getDragData(e).rowIndex;
if(typeof (_ca)!="undefined"){
if(!this.copy){
for(i=0;i<_c9.length;i++){
ds.remove(ds.getById(_c9[i].id));
}
}
ds.insert(_ca,_c6.selections);
sm.clearSelections();
}
}
}});
this.filegrid.render();
this.createGridPanel(this.filegrid,"center",{title:acs_lang_text.file_list||"File List",closable:false});
};
this.loadTagObjects=function(_cb){
if(this.filegrid==null){
this.createFileGrid();
}
this.treepanel.getSelectionModel().clearSelections();
var id=_cb.substring(3,_cb.length);
this.filegrid.getDataSource().baseParams["tag_id"]=id;
this.filegrid.getDataSource().load();
};
this.loadFoldercontents=function(_cd,e){
if(this.currentfolder!=null){
this.treepanel.getNodeById(this.currentfolder).getUI().removeClass("x-tree-grayselected");
}
if(this.currenttag!=null){
Ext.get(this.currenttag).setStyle("font-weight","normal");
}
this.currentfolder=_cd.id;
if(this.filegrid==null){
this.createFileGrid();
}
this.filegrid.getDataSource().baseParams["folder_id"]=_cd.id;
this.filegrid.getDataSource().baseParams["tag_id"]="";
if(_cd.loading){
_cd.on("expand",function(){
this.filegrid.getDataSource().load();
}.createDelegate(this),true,{single:true});
}else{
this.filegrid.getDataSource().load();
}
};
this.renderTree=function(){
var _cf=function(_d0,_d1,_d2){
if(_d1){
rootfolderobj=eval("("+_d2.responseText+")");
this.rootfolder=new Ext.tree.AsyncTreeNode({text:rootfolderobj.text,draggable:false,id:rootfolderobj.id,singeClickExpand:true,attributes:rootfolderobj.attributes});
if(rootfolderobj.attributes["write_p"]=="t"){
this.toolbar=new Ext.Toolbar("headerpanel");
this.toolbar.addButton({text:acs_lang_text.newfolder||"New Folder",icon:"/resources/ajax-filestorage-ui/icons/folder_add.png",cls:"x-btn-text-icon",handler:this.newFolder.createDelegate(this),scope:this});
this.toolbar.addButton({text:acs_lang_text.uploadfile||"Upload Files",icon:"/resources/ajax-filestorage-ui/icons/add.png",cls:"x-btn-text-icon",handler:this.showUplddialog.createDelegate(this),scope:this});
if(create_url_p){
this.toolbar.addButton({text:acs_lang_text.createurl||"Create Url",icon:"/resources/ajax-filestorage-ui/icons/page_link.png",cls:"x-btn-text-icon",handler:this.showCreateUrldialog.createDelegate(this),scope:this});
}
this.toolbar.addButton({text:acs_lang_text.deletefs||"Delete",icon:"/resources/ajax-filestorage-ui/icons/delete.png",cls:"x-btn-text-icon",handler:this.confirmDel.createDelegate(this),scope:this});
}
this.toolbar.addButton({text:acs_lang_text.download_archive||"Download Archive",icon:"/resources/ajax-filestorage-ui/icons/arrow_down.png",cls:"x-btn-text-icon",handler:function(){
top.location.href="download-archive/index?object_id="+rootfolderobj.id;
}.createDelegate(this),scrope:this});
this.treepanel.setRootNode(this.rootfolder);
this.treepanel.render();
var _d3=function(x){
var _d5=this.treepanel.getNodeById(this.config.initOpenFolder);
if(!_d5){
var x=x+1;
var _d6=this.config.pathToFolder[x];
var _d7=this.treepanel.getNodeById(_d6);
_d7.on("expand",_d3.createDelegate(this,[x]),this,{single:true});
_d7.expand(true);
}else{
_d5.select();
_d5.fireEvent("click",_d5);
}
};
var _d8=function(){
if(this.config.initOpenFolder){
var _d9=this.treepanel.getNodeById(this.config.initOpenFolder);
if(_d9){
_d9.expand();
_d9.fireEvent("click",_d9);
}else{
var x=1;
var _db=this.treepanel.getNodeById(this.config.pathToFolder[x]);
_db.on("expand",_d3.createDelegate(this,[x]),this,{single:true});
_db.expand(true);
}
}else{
this.treepanel.fireEvent("click",this.rootfolder);
}
};
this.rootfolder.on("expand",_d8,this,{single:true});
this.rootfolder.expand();
}else{
Ext.Msg.alert(acs_lang_text.error||"Error",acs_lang_text.tree_render_error||"Sorry, we encountered an error rendering the tree panel");
}
};
var _dc="package_id="+this.config.package_id;
if(this.config.rootfolder){
_dc=_dc+"&root_folder_id="+this.config.rootfolder;
}
this.asyncCon.request({url:this.xmlhttpurl+"getrootfolder",params:_dc,method:"POST",callback:_cf,scope:this});
};
this.loadTreepanel=function(){
var _dd=Ext.get("folderpanel").createChild({tag:"div",id:"folders"});
this.treepanel=new Ext.tree.TreePanel("folders",{animate:true,loader:new Ext.tree.TreeLoader({dataUrl:this.xmlhttpurl+"loadnodes",baseParams:{package_id:this.config.package_id}}),enableDD:true,ddGroup:"fileDD",ddAppendOnly:true,containerScroll:true,rootVisible:true});
this.te=new Ext.tree.TreeEditor(this.treepanel,{allowBlank:false,blankText:acs_lang_text.folder_name_required||"A folder name is required",selectOnFocus:true});
this.te.on("beforestartedit",function(_de,el,_e0){
if(_de.editNode.attributes.attributes.write_p=="t"){
return true;
}else{
Ext.Msg.alert(acs_lang_text.permission_denied||"Permission Denied",acs_lang_text.permission_denied||"Sorry, you do not have permission to rename this folder");
return false;
}
},this,true);
this.te.on("beforecomplete",function(_e1,_e2,_e3){
var _e4=_e1.editNode.parentNode;
var _e5=_e4.childNodes;
for(x=0;x<_e5.length;x++){
if(_e5[x].text==_e2&&_e5[x].id!=_e1.editNode.id){
Ext.Msg.alert(acs_lang_text.duplicate_name||"Duplicate Name",acs_lang_text.duplicate_name_error||"Please enter a different name. The name you entered is already being used.");
return false;
}
}
return true;
},this,true);
this.te.on("complete",function(_e6,_e7,_e8){
var _e9=function(_ea,_eb,_ec){
var _ed=acs_lang_text.an_error_occurred||"An error occurred";
var _ee=acs_lang_text.reverted||"Your changes have been reverted";
if(_eb){
if(_ec.responseText!=1){
Ext.Msg.alert(acs_lang_text.error||"Error",_ed+": <br><br><font color='red'>"+_ec.responseText+"</font><br><br>"+_ee);
_e6.editNode.setText(_e8);
}
}else{
Ext.Msg.alert(acs_lang_text.error||"Error",_ed+":<br><br><font color='red'>"+_ec.responseText+"</font><br><br>"+_ee);
_e6.editNode.setText(_e8);
}
};
this.asyncCon.request({url:this.xmlhttpurl+"editname",params:"newname="+_e7+"&object_id="+_e6.editNode.id+"&type=folder",method:"POST",callback:_e9,scope:this});
},this,true);
this.treepanel.on("click",this.loadFoldercontents,this,true);
this.treepanel.on("nodedragover",function(e){
if(e.target.id==this.treepanel.getSelectionModel().getSelectedNode().id){
return false;
}
if(e.source.dragData.selections){
for(var x=0;x<e.source.dragData.selections.length;x++){
if(e.target.id==e.source.dragData.selections[x].data.id){
return false;
}
}
}
},this,true);
this.treepanel.on("beforenodedrop",function(_f1){
var t=_f1.target;
if(_f1.data.node){
var n=_f1.dropNode;
var p=n.parentNode;
var _f5=_f1.data.node.id;
var _f6=_f1.target.id;
var _f7=function(_f8,_f9,_fa){
var _fb=false;
var _fc=acs_lang_text.an_error_occurred||"An error occurred";
var _fd=acs_lang_text.reverted||"Your changes have been reverted";
if(_f9){
if(_fa.responseText!=1){
Ext.Msg.alert(acs_lang_text.error||"Error",_fc+": <br><br><font color='read'>"+_fa.responseText+"</font><br><br>"+_fd);
_fb=true;
}
}else{
Ext.Msg.alert(acs_lang_text.error||"Error",acs_lang_text.error_and_reverted||"An error occurred. Your changes have been reverted");
_fb=true;
}
if(_fb){
_f8.target.removeChild(_f8.thenode);
_f8.parent.appendChild(_f8.thenode);
_f8.parent.loaded=false;
_f8.parent.expand();
}else{
_f8.target.loaded=false;
_f8.target.fireEvent("click",_f8.target);
_f8.target.expand();
}
};
var _fe="file_ids="+_f5+"&folder_target_id="+_f6;
var url=this.xmlhttpurl+"move";
this.asyncCon.request({url:url,params:_fe,method:"POST",callback:_f7,scope:this,target:t,parent:p,thenode:n});
}else{
var _100=_f1.target.id;
var _101=[];
for(var x=0;x<_f1.data.selections.length;x++){
_101[x]=_f1.data.selections[x].data.id;
if(_f1.data.selections[x].data.type=="folder"){
if(this.treepanel.getNodeById(_f1.data.selections[x].data.id)){
var _103=this.treepanel.getNodeById(_f1.data.selections[x].data.id).parentNode;
_103.loaded=false;
_103.removeChild(this.treepanel.getNodeById(_f1.data.selections[x].data.id));
}
}
}
var _f7=function(_104,_105,_106){
if(_105&&_106.responseText==1){
var dm=this.filegrid.getDataSource();
var _108=this.filegrid.getSelectionModel().getSelections();
for(var x=0;x<_108.length;x++){
dm.remove(_108[x]);
}
_104.target.loaded=false;
}else{
Ext.Msg.alert(acs_lang_text.error||"Error",acs_lang_text.error_move||"Sorry, an error occurred moving this item. A file with the same name may already exist in the target folder.");
}
};
var _fe="folder_target_id="+_100+"&file_ids="+_101;
var url=this.xmlhttpurl+"move";
var _10a=new Ext.data.Connection();
_10a.request({url:url,params:_fe,method:"POST",callback:_f7,scope:this,target:t});
}
},this,true);
this.renderTree();
};
this.initLayout=function(){
var _10b=document.body;
if(this.config!=null&&this.config.layoutdiv){
_10b=this.config.layoutdiv;
}
this.layout=new Ext.BorderLayout(_10b,{north:{split:false,titlebar:false,autoScroll:false,initialSize:25},west:{autoScroll:true,split:true,initialSize:350,titlebar:true,collapsible:true,minSize:200,maxSize:500},center:{autoScroll:true}});
this.innerlayout=new Ext.BorderLayout("leftpanel",{center:{split:true,titlebar:false,autoScroll:true},south:{split:true,titlebar:true,title:"Tags",autoScroll:true,initialSize:130}});
this.layout.beginUpdate();
this.layout.add("north",new Ext.ContentPanel("headerpanel",{autoCreate:true}));
this.layout.add("west",new Ext.NestedLayoutPanel(this.innerlayout));
this.innerlayout.add("center",new Ext.ContentPanel("folderpanel",{autoCreate:true,autoScroll:true,fitToFrame:true,fitContainer:true}));
this.tagcloudpanel=new Ext.ContentPanel("tagpanel",{autoCreate:true,autoScroll:true,fitToFrame:true,fitContainer:true});
this.innerlayout.add("south",this.tagcloudpanel);
this.tagcloudpanel.load("/ajaxfs2/xmlhttp/tagcloud?package_id="+this.config.package_id);
this.tagcloudpanel.getEl().on("click",function(obj,el){
if(el.tagName=="A"){
if(this.currenttag!=null){
Ext.get(this.currenttag).setStyle("font-weight","normal");
}
Ext.get(el).setStyle("font-weight","bold");
this.currenttag=el.id;
this.loadTagObjects(el.id);
}
},this);
this.layout.endUpdate();
var _10e={autoCreate:true,autoScroll:true,modal:false,autoTabs:true,width:300,height:300,shadow:false,shim:false,minWidth:300,minHeight:300,proxyDrag:true,fixedcenter:true};
this.upldDialog=new Ext.BasicDialog("uploadDlg",_10e);
this.createurlDialog=new Ext.BasicDialog("urlDlg",_10e);
Ext.get(document.body).createChild({tag:"div",id:"files"});
};
this.initObj=function(){
if(typeof (Ext.DomHelper)!="undefined"){
if(_3f){
this.config=_3f;
if(!this.config.ispublic){
this.asyncCon.on("requestcomplete",this.isSessionExpired,this);
}
}
this.initLayout();
this.loadTreepanel();
}
};
Ext.EventManager.onDocumentReady(this.initObj,this,true);
}

