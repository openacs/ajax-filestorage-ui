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
_2d.SetStatus(_29+"<b>"+_2c+"</b><br><input type='checkbox' id='zip"+_27.id+"' onclick=\"if(document.getElementById('zip"+_27.id+"').checked) { fsInstance.swfu.addFileParam('"+_27.id+"','unpack_p','1') } else { fsInstance.swfu.removeFileParam('"+_27.id+"','unpack_p') }\"> "+_2a);
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
this.te=null;
this.rootfolder=null;
this.filegrid=null;
this.toolbar=null;
this.currentfolder=null;
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
}
if(_51=="folder"){
this.treepanel.getNodeById(_52).setText(_56);
}
_4f.set("title",_56);
_4f.set("title_and_name","<span id='title"+_52+"'>"+_56+"</span><br><font style='font-size:10px;color:#666666'><span id='subtitle"+_52+"'>"+_53+"</span></font>");
_4f.commit();
}
}else{
Ext.Msg.alert(acs_lang_text.error||"Error",err_msg_text+":<br><br><font color='red'>"+_5a.responseText+"</font><br><br>"+_5c);
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
var _5d=YAHOO.util.Dom.getElementsByClassName("ext-mb-input","input","x-msg-box");
_5d[0].select();
};
this.permsRedirect=function(){
var _5e=this.filegrid.getSelectionModel().getSelected();
var _5f=_5e.get("id");
var _60=window.open(window.location.protocol+"//"+window.location.hostname+":"+window.location.port+this.config.package_url+"permissions?object_id="+_5f+"&return_url="+window.location.pathname+"?package_id="+this.config.package_id+"&folder_id="+this.currentfolder);
_60.focus();
};
this.propertiesRedirect=function(){
var _61=this.filegrid.getSelectionModel().getSelected();
var _62=_61.get("id");
var _63=window.open(window.location.protocol+"//"+window.location.hostname+":"+window.location.port+this.config.package_url+"file?file_id="+_62);
_63.focus();
};
this.showContext=function(_64,i,e){
e.stopEvent();
if(this.contextmenu==null){
this.contextmenu=new Ext.menu.Menu({id:"rightclickmenu",items:[new Ext.menu.Item({text:acs_lang_text.deletefs||"Delete",icon:"/resources/ajax-filestorage-ui/icons/delete.png",handler:this.confirmDel.createDelegate(this)}),new Ext.menu.Item({text:acs_lang_text.rename||"Rename",icon:"/resources/ajax-filestorage-ui/icons/page_edit.png",handler:this.fileRename.createDelegate(this)}),new Ext.menu.Item({text:acs_lang_text.linkaddress||"Copy Link Address",icon:"/resources/ajax-filestorage-ui/icons/page_copy.png",handler:this.linkCopy.createDelegate(this)}),new Ext.menu.Item({text:acs_lang_text.permissions||"Permissions",icon:"/resources/ajax-filestorage-ui/icons/group_key.png",handler:this.permsRedirect.createDelegate(this)}),new Ext.menu.Item({text:acs_lang_text.properties||"Properties",icon:"/resources/ajax-filestorage-ui/icons/page_edit.png",handler:this.propertiesRedirect.createDelegate(this)})]});
}
if(_64.getSelectionModel().getCount()>1){
this.contextmenu.items.items[1].disable();
this.contextmenu.items.items[2].disable();
this.contextmenu.items.items[3].disable();
this.contextmenu.items.items[4].disable();
}else{
this.contextmenu.items.items[1].enable();
this.contextmenu.items.items[2].enable();
this.contextmenu.items.items[3].enable();
var _67=this.filegrid.getSelectionModel().getSelected();
var _68=_67.get("type");
if(_68=="folder"||_68=="url"){
this.contextmenu.items.items[4].disable();
}else{
this.contextmenu.items.items[4].enable();
}
}
var _69=e.getXY();
this.contextmenu.rowid=i;
this.contextmenu.showAt([_69[0],_69[1]]);
};
this.uploadFile=function(e){
if(document.getElementById("upload_file").value!=""&&document.getElementById("filetitle").value!=""){
var _6b={success:function(){
},upload:function(){
this.treepanel.getSelectionModel().getSelectedNode().loaded=false;
this.treepanel.getSelectionModel().getSelectedNode().fireEvent("click",this.treepanel.getSelectionModel().getSelectedNode());
this.upldDialog.getEl().unmask();
this.upldDialog.hide();
},failure:function(){
Ext.Msg.alert(acs_lang_text.error||"Error",acs_lang_text.upload_failed||"Upload failed, please try again later.");
},scope:this};
var _6c=acs_lang_text.loading||"One moment. This may take a while depending on how large your upload is.";
this.upldDialog.getEl().mask("<img src='/resources/ajaxhelper/images/indicator.gif'>&nbsp;"+_6c);
YAHOO.util.Connect.setForm("newfileform",true,true);
var _6d=YAHOO.util.Connect.asyncRequest("POST",this.xmlhttpurl+"file-add",_6b);
}else{
Ext.Msg.alert(acs_lang_text.alert||"Alert",acs_lang_text.file_required||"<b>Title</b> and <b>File to upload</b> are required.");
}
};
this.createUrl=function(e){
if(document.getElementById("fsurl").value!=""&&document.getElementById("fstitle").value!=""){
if(isURL(document.getElementById("fsurl").value)){
var _6f={success:function(){
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
var _70=YAHOO.util.Connect.asyncRequest("POST",this.xmlhttpurl+"url-add",_6f);
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
var _71=acs_lang_text.file_to_upload||"File to upload";
var _72=acs_lang_text.file_title||"Title";
var _73=acs_lang_text.file_description||"Description";
var _74=acs_lang_text.multiple_files||"Multiple Files";
var _75=acs_lang_text.multiple_files_msg||"This is a ZIPfile containing multiple files.";
this.upldDialog.body.update("<form id=\"newfileform\" method=\"post\" enctype=\"multipart/form-data\"><input type=\"hidden\" name=\"package_id\" value=\""+this.config.package_id+"\"><input type=\"hidden\" name=\"folder_id\" value=\""+this.currentfolder+"\"><p>"+_71+"<br /><input type=\"file\" name=\"upload_file\" id=\"upload_file\"></p><br><p>"+_72+"<br /><input type=\"text\" name=\"filetitle\" id=\"filetitle\"></p><br><p>"+_73+" :<br /><textarea name=\"filedescription\" id=\"filedescription\"></textarea></p><p>"+_74+" :<br /><br /><input type=\"checkbox\" name=\"unpack_p\" value=\"t\" id=\"unpack_p\" /> "+_75+"</p></form>");
if(!this.upldDialog.buttons){
this.upldDialog.addButton({text:acs_lang_text.upload||"Upload",icon:"/resources/ajax-filestorage-ui/icons/page_add.png",cls:"x-btn-text-icon"},this.uploadFile,this);
this.upldDialog.addButton({text:acs_lang_text.cancel||"Cancel",icon:"/resources/ajax-filestorage-ui/icons/cancel.png",cls:"x-btn-text-icon"},this.upldDialog.hide,this.upldDialog);
}
}else{
if(this.swfu==null){
var _76=acs_lang_text.upload_intro||"Click <b>Browse</b> to select a file to upload to the selected folder.";
this.upldDialog.body.update("<div id=\"upldMsg\">"+_76+"<hr></div><div class=\"flash\" id=\"fsuploadprogress\"></div>");
var _77=String(this.config.package_id);
var _78=String(this.config.user_id);
var _79=String(this.currentfolder);
var _7a=String(this.config.max_file_size)||5000000;
this.swfu=new SWFUpload({debug:false,upload_target_url:"/ajaxfs2/xmlhttp/file-add-flash",upload_params:{user_id:_78,package_id:_77},file_types:"*.*",file_size_limit:_7a,file_queue_limit:3,begin_upload_on_queue:false,file_progress_handler:uploadProgress,file_cancelled_handler:uploadCancel,file_complete_handler:uploadComplete,queue_complete_handler:uploadQueueComplete,error_handler:uploadError,flash_url:"/resources/ajax-filestorage-ui/swfupload/swfupload.swf"});
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
var _7b=acs_lang_text.confirm_delete||"Are you sure you want to delete";
var _7c=acs_lang_text.foldercontains||"This folder contains";
var _7d=this.filegrid.getSelectionModel().getSelections();
if(_7d.length>0){
if(_7d.length==1){
var _7e=_7d[0].get("title");
if(_7d[0].get("type")==="folder"){
var msg=_7c+" <b>"+_7d[0].get("size")+"</b>.<br>";
}else{
var msg="";
}
var msg=msg+_7b+" <b>"+_7e+"</b> ?";
}else{
var msg=_7b+": <br><br>";
for(var x=0;x<_7d.length;x++){
msg=msg+"<b>"+_7d[x].get("title")+"</b> ";
if(_7d[x].get("type")==="folder"){
msg=msg+"("+_7d[x].get("size")+")";
}
msg=msg+"<br>";
}
}
this.msgbox.confirm(acs_lang_text.confirm||"Confirm",msg,this.delFsitems,this);
}else{
var _81=this.treepanel.getSelectionModel().getSelectedNode();
var _82=this.treepanel.getRootNode();
if(_81.attributes["id"]==_82.attributes["id"]){
Ext.Msg.alert(acs_lang_text.alert||"Alert",acs_lang_text.cant_del_root||"The root folder can not be deleted.");
}else{
this.msgbox.confirm(acs_lang_text.confirm||"Confirm",_7b+" <b>"+_81.attributes["text"]+"</b>?",this.delFolder,this);
}
}
};
this.delFsitems=function(_83){
var _84=this.filegrid.getSelectionModel().getSelections();
var _85=[];
for(var x=0;x<_84.length;x++){
_85[x]=_84[x].get("id");
}
var _87=function(_88,_89,_8a){
var _8b=acs_lang_text.delete_error||"Sorry, there was an error trying to delete this item.";
if(_89&&_8a.responseText==1){
for(var x=0;x<_84.length;x++){
this.filegrid.getDataSource().remove(_84[x]);
var _8d=_84[x].get("id");
var _8e=this.treepanel.getNodeById(_8d);
if(_8e){
_8e.parentNode.fireEvent("click",_8e.parentNode);
_8e.parentNode.removeChild(_8e);
}
}
this.filegrid.getSelectionModel().clearSelections();
}else{
Ext.Msg.alert(acs_lang_text.error||"Error",_8b+"<br><br><font color='red'>"+_8a.responseText+"</font>");
}
this.filegrid.container.unmask();
};
var _8f="object_id="+_85;
var url=this.xmlhttpurl+"delete";
if(_83==="yes"){
this.filegrid.container.mask("Deleting");
this.asyncCon.request({url:url,params:_8f,method:"POST",callback:_87,scope:this});
}
};
this.delFolder=function(_91){
var _92=this.treepanel.getSelectionModel().getSelectedNode();
var _93=_92.parentNode;
var id=_92.attributes["id"];
var _95=function(_96,_97,_98){
var _99=acs_lang_text.delete_error||"Sorry, there was an error trying to delete this item.";
if(_97){
if(_98.responseText!="1"){
Ext.Msg.alert(acs_lang_text.error||"Error",_99+"<br><br><font color='red'>"+_98.responseText+"</font>");
}else{
_93.fireEvent("click",_93);
_93.removeChild(_92);
}
}else{
Ext.Msg.alert(acs_lang_text.error||"Error",_99+"<br><br><font color='red'>"+_98.responseText+"</font>");
}
};
if(_91==="yes"){
this.asyncCon.request({url:this.xmlhttpurl+"delete",params:"object_id="+id,method:"POST",callback:_95,scope:this});
}
};
this.newFolder=function(){
var te=this.te;
var _9b=this.treepanel;
var _9c=_9b.getSelectionModel().getSelectedNode();
_9c.expand();
var _9d=function(_9e,_9f,_a0){
var _a1=acs_lang_text.new_folder_error||"Sorry, there was an error trying to create your new folder.";
if(_9f){
if(!isNaN(parseInt(_a0.responseText))){
if(parseInt(_a0.responseText)!=0){
var _a2=_9c.appendChild(new Ext.tree.TreeNode({text:acs_lang_text.new_folder_label||"New Folder",id:_a0.responseText,iconCls:"folder",singleClickExpand:true,attributes:{write_p:"t"}}));
_9b.getSelectionModel().select(_a2);
_a2.loaded=true;
_a2.fireEvent("click",_a2);
setTimeout(function(){
te.editNode=_a2;
te.startEdit(_a2.ui.textNode);
},10);
}else{
Ext.Msg.alert(acs_lang_text.error||"Error",_a1+"<br><br><font color='red'>"+_a0.responseText+"</font>");
}
}
}else{
Ext.Msg.alert(acs_lang_text.error||"Error",_a1+"<br><br><font color='red'>"+_a0.responseText+"</font>");
}
};
this.asyncCon.request({url:this.xmlhttpurl+"newblankfolder",params:"folder_id="+_9c.attributes["id"],method:"POST",callback:_9d,scope:this});
};
this.itemDblClick=function(_a3,i,e){
var dm=_a3.getDataSource();
var _a7=dm.getAt(i);
if(_a7.get("type")=="folder"){
var _a8=this.treepanel.getNodeById(_a7.get("id"));
if(!_a8.parentNode.isExpanded()){
_a8.parentNode.expand();
}
_a8.fireEvent("click",_a8);
_a8.expand();
}else{
window.open(_a7.get("url"));
window.focus();
}
};
this.loadFoldercontents=function(_a9,e){
if(this.currentfolder!=null){
this.treepanel.getNodeById(this.currentfolder).getUI().removeClass("x-tree-grayselected");
}
this.currentfolder=_a9.id;
if(this.filegrid==null){
var _ab=[{header:"",width:50,sortable:true,dataIndex:"icon"},{header:acs_lang_text.filename||"Filename",id:"filename",width:200,sortable:true,dataIndex:"title_and_name"},{header:acs_lang_text.size||"Size",sortable:true,dataIndex:"size"},{header:acs_lang_text.lastmodified||"Last Modified",sortable:true,dataIndex:"lastmodified"}];
var _ac=new Ext.grid.ColumnModel(_ab);
_ac.defaultSortable=true;
var _ad=new Ext.data.JsonReader({totalProperty:"total",root:"foldercontents",id:"id"},[{name:"id",type:"int"},{name:"icon"},{name:"title"},{name:"filename"},{name:"type"},{name:"url"},{name:"write_p"},{name:"title_and_name"},{name:"size"},{name:"lastmodified"}]);
var _ae=new Ext.data.HttpProxy({url:this.xmlhttpurl+"foldercontents"});
var _af=new Ext.data.Store({proxy:_ae,reader:_ad,remoteSort:true});
this.filegrid=new Ext.grid.Grid("files",{ds:_af,cm:_ac,autoHeight:false,autoWidth:true,autoSizeColumns:false,trackMouseOver:true,autoExpandColumn:"filename",enableColumnMove:false,enableColLock:false,enableColumnHide:false,loadMask:true,monitorWindowResize:true,enableDragDrop:true,ddGroup:"fileDD"});
this.filegrid.on("rowclick",function(){
this.treepanel.getSelectionModel().getSelectedNode().getUI().removeClass("x-tree-selected");
this.treepanel.getSelectionModel().getSelectedNode().getUI().addClass("x-tree-grayselected");
},this,true);
this.filegrid.on("rowdblclick",this.itemDblClick,this,true);
this.filegrid.on("rowcontextmenu",this.showContext,this,true);
var _b0=this.filegrid;
var _b1=this;
var _b2=new Ext.dd.DropTarget(_b0.container,{ddGroup:"fileDD",copy:false,notifyDrop:function(dd,e,_b5){
var ds=_b0.getDataSource();
var sm=_b0.getSelectionModel();
var _b8=sm.getSelections();
if(dd.getDragData(e)){
var _b9=dd.getDragData(e).rowIndex;
if(typeof (_b9)!="undefined"){
if(!this.copy){
for(i=0;i<_b8.length;i++){
ds.remove(ds.getById(_b8[i].id));
}
}
ds.insert(_b9,_b5.selections);
sm.clearSelections();
}
}
}});
this.filegrid.render();
this.createGridPanel(this.filegrid,"center",{title:acs_lang_text.file_list||"File List",closable:false});
}
this.filegrid.getDataSource().baseParams["folder_id"]=_a9.id;
if(_a9.loading){
_a9.on("expand",function(){
this.filegrid.getDataSource().load();
}.createDelegate(this),true,{single:true});
}else{
this.filegrid.getDataSource().load();
}
};
this.renderTree=function(){
var _ba=function(_bb,_bc,_bd){
if(_bc){
rootfolderobj=eval("("+_bd.responseText+")");
this.rootfolder=new Ext.tree.AsyncTreeNode({text:rootfolderobj.text,draggable:false,id:rootfolderobj.id,singeClickExpand:true,attributes:rootfolderobj.attributes});
if(rootfolderobj.attributes["write_p"]=="t"){
this.toolbar=new Ext.Toolbar("headerpanel");
this.toolbar.addButton({text:acs_lang_text.newfolder||"New Folder",icon:"/resources/ajax-filestorage-ui/icons/folder_add.png",cls:"x-btn-text-icon",handler:this.newFolder.createDelegate(this),scope:this});
this.toolbar.addButton({text:acs_lang_text.uploadfile||"Upload Files",icon:"/resources/ajax-filestorage-ui/icons/add.png",cls:"x-btn-text-icon",handler:this.showUplddialog.createDelegate(this),scope:this});
this.toolbar.addButton({text:acs_lang_text.createurl||"Create Url",icon:"/resources/ajax-filestorage-ui/icons/page_link.png",cls:"x-btn-text-icon",handler:this.showCreateUrldialog.createDelegate(this),scope:this});
this.toolbar.addButton({text:acs_lang_text.deletefs||"Delete",icon:"/resources/ajax-filestorage-ui/icons/delete.png",cls:"x-btn-text-icon",handler:this.confirmDel.createDelegate(this),scope:this});
}else{
this.layout.getRegion("north").hide();
}
this.treepanel.setRootNode(this.rootfolder);
this.treepanel.render();
var _be=function(x){
var _c0=this.treepanel.getNodeById(this.config.initOpenFolder);
if(!_c0){
var x=x+1;
var _c1=this.config.pathToFolder[x];
var _c2=this.treepanel.getNodeById(_c1);
_c2.on("expand",_be.createDelegate(this,[x]),this,{single:true});
_c2.expand(true);
}else{
_c0.select();
_c0.fireEvent("click",_c0);
}
};
var _c3=function(){
if(this.config.initOpenFolder){
var _c4=this.treepanel.getNodeById(this.config.initOpenFolder);
if(_c4){
_c4.expand();
_c4.fireEvent("click",_c4);
}else{
var x=1;
var _c6=this.treepanel.getNodeById(this.config.pathToFolder[x]);
_c6.on("expand",_be.createDelegate(this,[x]),this,{single:true});
_c6.expand(true);
}
}else{
this.treepanel.fireEvent("click",this.rootfolder);
}
};
this.rootfolder.on("expand",_c3,this,{single:true});
this.rootfolder.expand();
}else{
Ext.Msg.alert(acs_lang_text.error||"Error",acs_lang_text.tree_render_error||"Sorry, we encountered an error rendering the tree panel");
}
};
var _c7="package_id="+this.config.package_id;
if(this.config.rootfolder){
_c7=_c7+"&root_folder_id="+this.config.rootfolder;
}
this.asyncCon.request({url:this.xmlhttpurl+"getrootfolder",params:_c7,method:"POST",callback:_ba,scope:this});
};
this.loadTreepanel=function(){
var _c8=Ext.get("folderpanel").createChild({tag:"div",id:"folders"});
this.treepanel=new Ext.tree.TreePanel("folders",{animate:true,loader:new Ext.tree.TreeLoader({dataUrl:this.xmlhttpurl+"loadnodes",baseParams:{package_id:this.config.package_id}}),enableDD:true,ddGroup:"fileDD",ddAppendOnly:true,containerScroll:true,rootVisible:true});
this.te=new Ext.tree.TreeEditor(this.treepanel,{allowBlank:false,blankText:acs_lang_text.folder_name_required||"A folder name is required",selectOnFocus:true});
this.te.on("beforestartedit",function(_c9,el,_cb){
if(_c9.editNode.attributes.attributes.write_p=="t"){
return true;
}else{
Ext.Msg.alert(acs_lang_text.permission_denied||"Permission Denied",acs_lang_text.permission_denied||"Sorry, you do not have permission to rename this folder");
return false;
}
},this,true);
this.te.on("beforecomplete",function(_cc,_cd,_ce){
var _cf=_cc.editNode.parentNode;
var _d0=_cf.childNodes;
for(x=0;x<_d0.length;x++){
if(_d0[x].text==_cd&&_d0[x].id!=_cc.editNode.id){
Ext.Msg.alert(acs_lang_text.duplicate_name||"Duplicate Name",acs_lang_text.duplicate_name_error||"Please enter a different name. The name you entered is already being used.");
return false;
}
}
return true;
},this,true);
this.te.on("complete",function(_d1,_d2,_d3){
var _d4=function(_d5,_d6,_d7){
var _d8=acs_lang_text.an_error_occurred||"An error occurred";
var _d9=acs_lang_text.reverted||"Your changes have been reverted";
if(_d6){
if(_d7.responseText!=1){
Ext.Msg.alert(acs_lang_text.error||"Error",_d8+": <br><br><font color='red'>"+_d7.responseText+"</font><br><br>"+_d9);
_d1.editNode.setText(_d3);
}
}else{
Ext.Msg.alert(acs_lang_text.error||"Error",_d8+":<br><br><font color='red'>"+_d7.responseText+"</font><br><br>"+_d9);
_d1.editNode.setText(_d3);
}
};
this.asyncCon.request({url:this.xmlhttpurl+"editname",params:"newname="+_d2+"&object_id="+_d1.editNode.id+"&type=folder",method:"POST",callback:_d4,scope:this});
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
this.treepanel.on("beforenodedrop",function(_dc){
var t=_dc.target;
if(_dc.data.node){
var n=_dc.dropNode;
var p=n.parentNode;
var _e0=_dc.data.node.id;
var _e1=_dc.target.id;
var _e2=function(_e3,_e4,_e5){
var _e6=false;
var _e7=acs_lang_text.an_error_occurred||"An error occurred";
var _e8=acs_lang_text.reverted||"Your changes have been reverted";
if(_e4){
if(_e5.responseText!=1){
Ext.Msg.alert(acs_lang_text.error||"Error",_e7+": <br><br><font color='read'>"+_e5.responseText+"</font><br><br>"+_e8);
_e6=true;
}
}else{
Ext.Msg.alert(acs_lang_text.error||"Error",acs_lang_text.error_and_reverted||"An error occurred. Your changes have been reverted");
_e6=true;
}
if(_e6){
_e3.target.removeChild(_e3.thenode);
_e3.parent.appendChild(_e3.thenode);
_e3.parent.loaded=false;
_e3.parent.expand();
}else{
_e3.target.loaded=false;
_e3.target.fireEvent("click",_e3.target);
_e3.target.expand();
}
};
var _e9="file_ids="+_e0+"&folder_target_id="+_e1;
var url=this.xmlhttpurl+"move";
this.asyncCon.request({url:url,params:_e9,method:"POST",callback:_e2,scope:this,target:t,parent:p,thenode:n});
}else{
var _eb=_dc.target.id;
var _ec=[];
for(var x=0;x<_dc.data.selections.length;x++){
_ec[x]=_dc.data.selections[x].data.id;
if(_dc.data.selections[x].data.type=="folder"){
if(this.treepanel.getNodeById(_dc.data.selections[x].data.id)){
var _ee=this.treepanel.getNodeById(_dc.data.selections[x].data.id).parentNode;
_ee.loaded=false;
_ee.removeChild(this.treepanel.getNodeById(_dc.data.selections[x].data.id));
}
}
}
var _e2=function(_ef,_f0,_f1){
if(_f0&&_f1.responseText==1){
var dm=this.filegrid.getDataSource();
var _f3=this.filegrid.getSelectionModel().getSelections();
for(var x=0;x<_f3.length;x++){
dm.remove(_f3[x]);
}
_ef.target.loaded=false;
}else{
Ext.Msg.alert(acs_lang_text.error||"Error",acs_lang_text.error_move||"Sorry, an error occurred moving this item. A file with the same name may already exist in the target folder.");
}
};
var _e9="folder_target_id="+_eb+"&file_ids="+_ec;
var url=this.xmlhttpurl+"move";
var _f5=new Ext.data.Connection();
_f5.request({url:url,params:_e9,method:"POST",callback:_e2,scope:this,target:t});
}
},this,true);
this.renderTree();
};
this.initLayout=function(){
var _f6=document.body;
if(this.config!=null&&this.config.layoutdiv){
_f6=this.config.layoutdiv;
}
this.layout=new Ext.BorderLayout(_f6,{north:{split:false,titlebar:false,autoScroll:false,initialSize:25},west:{autoScroll:true,split:true,initialSize:350,titlebar:true,collapsible:true,minSize:200,maxSize:500},center:{autoScroll:true}});
this.layout.beginUpdate();
this.layout.add("north",new Ext.ContentPanel("headerpanel",{autoCreate:true}));
this.layout.add("west",new Ext.ContentPanel("folderpanel",{autoCreate:true,autoScroll:true,fitToFrame:true,fitContainer:true}));
this.layout.endUpdate();
var _f7={autoCreate:true,autoScroll:true,modal:false,autoTabs:true,width:300,height:300,shadow:false,shim:false,minWidth:300,minHeight:300,proxyDrag:true,fixedcenter:true};
this.upldDialog=new Ext.BasicDialog("uploadDlg",_f7);
this.createurlDialog=new Ext.BasicDialog("urlDlg",_f7);
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

