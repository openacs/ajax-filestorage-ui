Ext.namespace("ajaxfs");
Ext.BLANK_IMAGE_URL="/resources/ajaxhelper/ext2/resources/images/default/s.gif";
ajaxfs=function(_1){
this.xmlhttpurl="/ajaxfs/xmlhttp/";
this.create_url_p=true;
this.config=null;
this.layout=null;
this.te=null;
this.currentfolder=null;
this.currenttag=null;
this.asyncCon=new Ext.data.Connection();
this.msgbox=Ext.MessageBox;
this.upldWindow=null;
this.tagWindow=null;
this.createurlWindow=null;
this.contextmenu=null;
this.swfu=null;
this.initObj=function(){
if(typeof (Ext.DomHelper)!="undefined"){
if(_1){
this.config=_1;
if(this.config.xmlhttpurl){
this.xmlhttpurl=this.config.xmlhttpurl;
}
if(this.config.create_url&&this.config.create_url==0){
this.create_url_p=false;
}
if(!this.config.ispublic){
Ext.Ajax.on("requestcomplete",this.isSessionExpired,this);
}
}
Ext.QuickTips.init();
this.initLayout();
}
};
Ext.onReady(this.initObj,this,true);
};
ajaxfs.prototype={isSessionExpired:function(_2,_3,_4){
if(readCookie("ad_user_login")==null){
Ext.get(document.body).mask(acs_lang_text.sessionexpired||"Your session has expired. You need to login again. <br>You will be redirected to a login page shortly");
var _5="";
if(this.currentfolder!=null){
var _5="?folder_id="+this.currentfolder;
}
window.location="/register/?return_url="+this.config.package_url+_5;
}
},asyncExpand:function(x){
var _7=this.layout.findById("treepanel");
var _8=_7.getNodeById(this.config.initOpenFolder);
if(!_8){
var x=x+1;
var _9=this.config.pathToFolder[x];
var _a=_7.getNodeById(_9);
_a.on("expand",asyncExpand.createDelegate(this,[x]),this,{single:true});
_a.expand(true);
}else{
_8.select();
_8.fireEvent("click",_8);
}
},selectInitFolder:function(){
var _b=this.layout.findById("treepanel");
if(this.config.initOpenFolder){
var _c=_b.getNodeById(this.config.initOpenFolder);
if(_c){
_c.expand();
_c.fireEvent("click",_c);
}else{
var x=1;
var _e=_b.getNodeById(this.config.pathToFolder[x]);
_e.on("expand",this.asyncExpand.createDelegate(this,[x]),this,{single:true});
_e.expand(true);
}
}else{
_b.fireEvent("click",_b.getRootNode());
}
},initLayout:function(){
var _f=[this.createLeft(),this.createRight()];
if(this.config!=null&&this.config.layoutdiv){
this.layout=new Ext.Panel({id:"fs-ui",layout:"border",applyTo:this.config.layoutdiv,tbar:this.createToolbar(),items:_f});
}else{
this.layout=new Ext.Viewport({id:"fs-ui",layout:"border",tbar:this.createToolbar(),items:_f});
}
},createToolbar:function(){
var _10=this.config.treerootnode;
var _11=[];
if(_10.attributes["write_p"]=="t"){
var _11=[" ",{text:acs_lang_text.newfolder||"New Folder",tooltip:acs_lang_text.newfolder||"New Folder",icon:"/resources/ajaxhelper/icons/folder_add.png",cls:"x-btn-text-icon",handler:this.addFolder.createDelegate(this)},{text:acs_lang_text.uploadfile||"Upload Files",tooltip:acs_lang_text.uploadfile||"Upload Files",icon:"/resources/ajaxhelper/icons/page_add.png",cls:"x-btn-text-icon",handler:this.addFile.createDelegate(this)}];
if(this.create_url_p){
_11.push({text:acs_lang_text.createurl||"Create Url",tooltip:acs_lang_text.createurl||"Create Url",icon:"/resources/ajaxhelper/icons/page_link.png",cls:"x-btn-text-icon",handler:this.addUrl.createDelegate(this)});
}
_11.push({text:acs_lang_text.deletefs||"Delete",tooltip:acs_lang_text.deletefs||"Delete",icon:"/resources/ajaxhelper/icons/delete.png",cls:"x-btn-text-icon",handler:this.delItem.createDelegate(this)});
_11.push("->");
}
_11.push({tooltip:"This may take a few minutes if you have a lot of files",text:acs_lang_text.download_archive||"Download Archive",icon:"/resources/ajaxhelper/icons/arrow_down.png",cls:"x-btn-text-icon",handler:this.downloadArchive.createDelegate(this,[_10.id],false)});
return _11;
},createLeft:function(){
var _12=new Ext.Panel({id:"leftpanel",region:"west",collapsible:true,titlebar:true,title:" ",layout:"accordion",split:true,width:300,items:[this.createTreePanel(),this.createTagPanel()]});
return _12;
},createTreePanel:function(){
var _13=new Ext.tree.AsyncTreeNode({text:this.config.treerootnode.text,draggable:false,id:this.config.treerootnode.id,singeClickExpand:true,expanded:true,attributes:this.config.treerootnode.attributes});
var _14=new Ext.tree.TreeLoader({dataUrl:this.xmlhttpurl+"load-treenodes",baseParams:{package_id:this.config.package_id}});
var _15=new Ext.tree.TreePanel({id:"treepanel",title:"Folders",autoScroll:true,animate:true,enableDrag:false,enableDrop:true,loadMask:true,loader:_14,root:_13,ddAppendOnly:true,containerScroll:true,dropConfig:{dropAllowed:true,ddGroup:"fileDD",onNodeOver:function(_16,_17,e,_19){
if(_16.node.id==_16.node.ownerTree.getSelectionModel().getSelectedNode().id){
return false;
}
if(_17.dragData.selections){
for(var x=0;x<_17.dragData.selections.length;x++){
if(_16.node.id==_17.dragData.selections[x].data.id){
return false;
}
}
}
return true;
},onNodeDrop:function(_1b,_1c,e,_1e){
var _1f=this.layout.findById("filepanel");
var _20=_1b.node.id;
var _21=[];
for(var x=0;x<_1e.selections.length;x++){
_21[x]=_1e.selections[x].data.id;
}
var _23=acs_lang_text.an_error_occurred||"An error occurred";
var _24=acs_lang_text.reverted||"Your changes have been reverted";
var _25=function(_26){
var _27=Ext.decode(_26.responseText);
if(_27.success){
var dm=_1f.store;
var _29=_1f.getSelectionModel().getSelections();
var _2a=false;
for(var x=0;x<_29.length;x++){
dm.remove(_29[x]);
if(_29[x].data.type=="folder"){
_2a=true;
if(_1b.node.ownerTree.getNodeById(_29[x].data.id)){
var _2c=_1b.node.ownerTree.getNodeById(_29[x].data.id).parentNode;
_2c.loaded=false;
_2c.removeChild(_1b.node.ownerTree.getNodeById(_29[x].data.id));
}
}
}
if(_2a){
var _2d=_1b.node.ownerTree.getRootNode();
if(_2d.id==_1b.node.id){
_2d.fireEvent("click",_2d);
}
_1b.node.loaded=false;
_1b.node.expand();
}
}else{
Ext.Msg.alert(acs_lang_text.error||"Error",_23+"<br>"+_24);
}
};
Ext.Ajax.request({url:this.xmlhttpurl+"move-fsitem",success:_25,failure:function(){
Ext.Msg.alert(acs_lang_text.error||"Error",_23+"<br>"+_24);
},params:{folder_target_id:_20,file_ids:_21}});
return true;
}.createDelegate(this)}});
this.enableTreeFolderRename(_15);
_13.on("expand",this.selectInitFolder,this,{single:true});
_15.on("click",this.loadFoldercontents,this);
return _15;
},enableTreeFolderRename:function(_2e){
this.te=new Ext.tree.TreeEditor(_2e,{allowBlank:false,blankText:acs_lang_text.folder_name_required||"A folder name is required",editDelay:20,ignoreNoChange:true});
this.te.on("beforestartedit",function(_2f,el,_31){
if(_2f.editNode.attributes.attributes.write_p=="t"){
return true;
}else{
Ext.Msg.alert(acs_lang_text.permission_denied||"Permission Denied",acs_lang_text.permission_denied||"Sorry, you do not have permission to rename this folder");
return false;
}
},this,true);
this.te.on("beforecomplete",function(_32,_33,_34){
var _35=_32.editNode.parentNode;
if(_35){
var _36=_35.childNodes;
for(x=0;x<_36.length;x++){
if(_36[x].text==_33&&_36[x].id!=_32.editNode.id){
Ext.Msg.alert(acs_lang_text.duplicate_name||"Duplicate Name",acs_lang_text.duplicate_name_error||"Please enter a different name. The name you entered is already being used.");
return false;
}
}
}
return true;
},this,true);
this.te.on("complete",function(_37,_38,_39){
var _3a=acs_lang_text.an_error_occurred||"An error occurred";
var _3b=acs_lang_text.reverted||"Your changes have been reverted";
Ext.Ajax.request({url:this.xmlhttpurl+"rename-fsitem",success:function(_3c){
var _3d=Ext.decode(_3c.responseText);
if(!_3d.success){
Ext.Msg.alert(acs_lang_text.error||"Error",_3a+": <br><br><font color='red'>"+_3d.error+"</font><br><br>"+_3b);
_37.editNode.setText(_39);
}
},failure:function(){
Ext.Msg.alert(acs_lang_text.error||"Error",_3a+"<br>"+_3b);
_37.editNode.setText(_39);
},params:{newname:_38,object_id:_37.editNode.id,type:"folder"}});
},this,true);
},createTagPanel:function(){
var _3e=new Ext.Panel({id:"tagcloudpanel",title:"Tags",frame:false,loadMask:true,autoLoad:{url:this.xmlhttpurl+"get-tagcloud",params:{package_id:this.config.package_id}}});
var _3f=function(){
var _40=this;
var _41=_40.currenttag;
_3e.body.on("click",function(obj,el){
if(el.tagName=="A"){
if(_41!=null){
Ext.get(_41).setStyle("font-weight","normal");
}
Ext.get(el).setStyle("font-weight","bold");
_41=el.id;
this.loadTaggedFiles(el.id);
}
},this);
};
_3e.on("render",_3f,this);
return _3e;
},loadTaggedFiles:function(_44){
this.layout.findById("treepanel").getSelectionModel().clearSelections();
var id=_44.substring(3,_44.length);
this.layout.findById("filepanel").store.baseParams["tag_id"]=id;
this.layout.findById("filepanel").store.load();
this.layout.findById("filepanel").store.baseParams["tag_id"]="";
},createRight:function(){
var _46=[{header:"",width:30,sortable:true,dataIndex:"icon"},{header:acs_lang_text.filename||"Filename",id:"filename",sortable:true,dataIndex:"title"},{header:acs_lang_text.size||"Size",sortable:true,dataIndex:"size"},{header:acs_lang_text.lastmodified||"Last Modified",sortable:true,dataIndex:"lastmodified"}];
var _47=new Ext.data.JsonReader({totalProperty:"total",root:"foldercontents",id:"id"},[{name:"id",type:"int"},{name:"icon"},{name:"title"},{name:"filename"},{name:"type"},{name:"tags"},{name:"url"},{name:"write_p"},{name:"size"},{name:"lastmodified"}]);
var _48=new Ext.data.HttpProxy({url:this.xmlhttpurl+"get-foldercontents"});
var _49=new Ext.grid.ColumnModel(_46);
var _4a=new Ext.data.Store({proxy:_48,reader:_47,remoteSort:true});
var _4b=new Ext.grid.GridPanel({store:_4a,cm:_49,id:"filepanel",ddGroup:"fileDD",region:"center",split:true,autoScroll:true,autoExpandColumn:"filename",collapsible:true,enableDragDrop:true,width:250,loadMask:true,frame:false,viewConfig:{forceFit:false,enableRowBody:true,showPreview:true,getRowClass:function(_4c,_4d,p,ds){
var xf=Ext.util.Format;
if(_4c.data.tags!=""){
p.body="<div id='tagscontainer"+_4c.data.id+"' style='padding-left:35px;color:blue'>Tags: "+xf.ellipsis(xf.stripTags(_4c.data.tags),200)+"</div>";
}else{
p.body="<div id='tagscontainer"+_4c.data.id+"' style='padding-left:35px;color:blue'></div>";
}
return "x-grid3-row-expanded";
}}});
_4b.on("rowdblclick",this.openItem,this,true);
_4b.on("rowcontextmenu",this.showRowContext,this,true);
return _4b;
},showRowContext:function(_51,i,e){
e.stopEvent();
var dm=_51.store;
var _55=dm.getAt(i);
var _56=_55.get("type");
var _57=_55.get("id");
if(_56=="folder"){
var _58="Open";
}else{
var _58="Download";
}
this.contextmenu=new Ext.menu.Menu({id:"rightclickmenu",items:[new Ext.menu.Item({text:_58,icon:"/resources/ajaxhelper/icons/page_white.png",handler:this.openItem.createDelegate(this,[_51,i,e],false)}),new Ext.menu.Item({text:"Tag",icon:"/resources/ajaxhelper/icons/tag_blue.png",handler:this.tagFsitem.createDelegate(this,[_51,i,e],false)}),new Ext.menu.Item({text:"Views",icon:"/resources/ajaxhelper/icons/camera.png",handler:this.redirectViews.createDelegate(this,[_51,i,e],false)}),new Ext.menu.Item({text:acs_lang_text.deletefs||"Delete",icon:"/resources/ajaxhelper/icons/delete.png",handler:this.delItem.createDelegate(this,[_51,i,e],false)}),new Ext.menu.Item({text:acs_lang_text.rename||"Rename",icon:"/resources/ajaxhelper/icons/page_edit.png",handler:this.renameItem.createDelegate(this,[_51,i,e],false)}),new Ext.menu.Item({text:acs_lang_text.linkaddress||"Copy Link Address",icon:"/resources/ajaxhelper/icons/page_copy.png",handler:this.copyLink.createDelegate(this,[_51,i,e],false)}),new Ext.menu.Item({text:acs_lang_text.permissions||"Permissions",icon:"/resources/ajaxhelper/icons/group_key.png",handler:this.redirectPerms.createDelegate(this,[_51,i,e],false)}),new Ext.menu.Item({text:acs_lang_text.properties||"Properties",icon:"/resources/ajaxhelper/icons/page_edit.png",handler:this.redirectProperties.createDelegate(this,[_51,i,e],false)}),new Ext.menu.Item({text:acs_lang_text.download_archive||"Download archive",icon:"/resources/ajaxhelper/icons/arrow_down.png",handler:this.downloadArchive.createDelegate(this,[_57],false)})]});
if(_51.getSelectionModel().getCount()>1){
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
if(_56=="folder"){
this.contextmenu.items.items[1].hide();
this.contextmenu.items.items[7].hide();
this.contextmenu.items.items[8].show();
}else{
this.contextmenu.items.items[1].show();
this.contextmenu.items.items[7].show();
this.contextmenu.items.items[8].hide();
}
}
var _59=e.getXY();
this.contextmenu.rowid=i;
this.contextmenu.showAt([_59[0],_59[1]]);
},loadFoldercontents:function(_5a,e){
this.currentfolder=_5a.id;
var _5c=this.layout.findById("filepanel");
_5c.store.baseParams["folder_id"]=_5a.id;
if(_5a.loading){
_5a.on("expand",function(){
this.store.load();
},_5c,{single:true});
}else{
_5c.store.load();
}
},openItem:function(_5d,i,e){
var _60=this.layout.findById("treepanel");
var dm=_5d.store;
var _62=dm.getAt(i);
if(_62.get("type")=="folder"){
var _63=_60.getNodeById(_62.get("id"));
if(!_63.parentNode.isExpanded()){
_63.parentNode.expand();
}
_63.fireEvent("click",_63);
_63.expand();
}else{
window.open(_62.get("url"));
window.focus();
}
},delItem:function(_64,i,e){
var _67=acs_lang_text.confirm_delete||"Are you sure you want to delete ";
var _68=acs_lang_text.foldercontains||"This folder contains";
var _69=this.layout.findById("treepanel");
if(_64.id=="filepanel"){
var _6a=_64;
if(_6a.getSelectionModel().getCount()<=1){
_6a.getSelectionModel().selectRow(i);
}
}else{
var _6a=this.layout.findById("filepanel");
}
var _6b=_6a.getSelectionModel().getSelections();
var _6c=true;
if(_6b.length>0){
_6c=false;
if(_6b.length==1){
var _6d=_6b[0].get("title");
if(_6b[0].get("type")==="folder"){
var msg=_68+" <b>"+_6b[0].get("size")+"</b>.<br>";
}else{
var msg="";
}
var msg=msg+_67+" <b>"+_6d+"</b> ?";
var _6f=_6b[0].get("id");
}else{
var msg=_67+": <br><br>";
var _6f=[];
for(var x=0;x<_6b.length;x++){
msg=msg+"<b>"+_6b[x].get("title")+"</b> ";
if(_6b[x].get("type")==="folder"){
msg=msg+"("+_6b[x].get("size")+")";
}
msg=msg+"<br>";
_6f[x]=_6b[x].get("id");
}
}
}else{
_6c=true;
var _71=_69.getSelectionModel().getSelectedNode();
var _6f=_71.attributes["id"];
var _72=_69.getRootNode();
if(_71.attributes["id"]==_72.attributes["id"]){
Ext.Msg.alert(acs_lang_text.alert||"Alert",acs_lang_text.cant_del_root||"The root folder can not be deleted.");
return;
}else{
var msg=_67+" <b>"+_71.attributes["text"]+"</b>?";
}
}
var _73=function(_74){
if(_74==="yes"){
Ext.Ajax.request({url:this.xmlhttpurl+"delete-fsitem",success:function(_75){
var _76=Ext.decode(_75.responseText);
if(_76.success){
if(_6c){
var _77=_69.getSelectionModel().getSelectedNode();
var _78=_77.parentNode;
_78.fireEvent("click",_78);
_78.removeChild(_77);
}else{
for(var x=0;x<_6b.length;x++){
_6a.store.remove(_6b[x]);
var _7a=_6b[x].get("id");
var _77=_69.getNodeById(_7a);
if(_77){
_77.parentNode.fireEvent("click",_77.parentNode);
_77.parentNode.removeChild(_77);
}
}
}
}else{
Ext.Msg.alert(acs_lang_text.error||"Error","Sorry, we encountered an error.");
}
},failure:function(){
Ext.Msg.alert(acs_lang_text.error||"Error",error_msg_txt+"<br><br><font color='red'>"+resultObj.error+"</font>");
},params:{object_id:_6f}});
}
};
Ext.MessageBox.confirm(acs_lang_text.confirm||"Confirm",msg,_73,this);
},addFolder:function(){
var te=this.te;
var _7c=this.layout.findById("treepanel");
var _7d=_7c.getSelectionModel().getSelectedNode();
_7d.expand();
var _7e=acs_lang_text.new_folder_error||"Sorry, there was an error trying to create your new folder.";
Ext.Ajax.request({url:this.xmlhttpurl+"add-blankfolder",success:function(_7f){
var _80=Ext.decode(_7f.responseText);
if(_80.success){
var _81=_7d.appendChild(new Ext.tree.TreeNode({text:_80.pretty_folder_name,id:_80.id,iconCls:"folder",singleClickExpand:true,attributes:{write_p:"t"}}));
_7c.getSelectionModel().select(_81);
_81.loaded=true;
_81.fireEvent("click",_81);
setTimeout(function(){
te.editNode=_81;
te.startEdit(_81.ui.textNode);
},10);
}else{
Ext.Msg.alert(acs_lang_text.error||"Error",_7e+"<br><br><font color='red'>"+_80.error+"</font>");
}
},failure:function(_82){
var _83=Ext.decode(_82.responseText);
Ext.Msg.alert(acs_lang_text.error||"Error",_7e+"<br><br><font color='red'>"+_83.error+"</font>");
},params:{folder_id:_7d.attributes["id"]}});
},createSwfObj:function(){
var _84=this;
var _85=_84.layout.findById("treepanel");
var _86=_84.currentfolder;
if(this.swfu==null){
var _87=String(this.config.package_id);
var _88=String(this.config.user_id);
var _89=String(this.currentfolder);
var _8a=String(this.config.max_file_size);
var _8b=function(_8c,_8d){
try{
var _8e=Math.ceil((_8d/_8c.size)*100);
var _8f=new FileProgress(_8c,this.getSetting("progress_target"));
_8f.SetProgress(_8e);
_8f.SetStatus(acs_lang_text.uploading||"Uploading...");
}
catch(ex){
this.debugMessage(ex);
}
};
var _90=function(_91){
try{
var _92=new FileProgress(_91,this.getSetting("progress_target"));
_92.SetCancelled();
_92.SetStatus(acs_lang_text.uploadcancel||"Cancelled (This item will be removed shortly)");
_92.ToggleCancel(false);
}
catch(ex){
this.debugMessage(ex);
}
};
var _93=function(_94){
try{
var _95=new FileProgress(_94,this.getSetting("progress_target"));
_95.SetComplete();
_95.SetStatus(acs_lang_text.complete||"Complete.");
_95.ToggleCancel(false);
}
catch(ex){
this.debugMessage(ex);
}
};
var _96=function(_97){
var _98=_85.getNodeById(_84.currentfolder);
_98.fireEvent("click",_98);
};
var _99=function(_9a,_9b,_9c){
try{
if(_9a==SWFUpload.ERROR_CODE_QUEUE_LIMIT_EXCEEDED){
Ext.Msg.alert(acs_lang_text.alert||"Alert","You have attempted to queue too many files.\n"+(_9c==0?"You have reached the upload limit.":"You may select "+(_9c>1?"up to "+_9c+" files.":"one file.")));
return;
}
var _9d=new FileProgress(_9b,this.getSetting("progress_target"));
_9d.SetError();
_9d.ToggleCancel(false);
switch(_9a){
case SWFUpload.ERROR_CODE_HTTP_ERROR:
_9d.SetStatus("Upload Error");
this.debugMessage("Error Code: HTTP Error, File name: "+file.name+", Message: "+_9c);
break;
case SWFUpload.ERROR_CODE_MISSING_UPLOAD_TARGET:
_9d.SetStatus("Configuration Error");
this.debugMessage("Error Code: No backend file, File name: "+file.name+", Message: "+_9c);
break;
case SWFUpload.ERROR_CODE_UPLOAD_FAILED:
_9d.SetStatus("Upload Failed.");
this.debugMessage("Error Code: Upload Failed, File name: "+file.name+", File size: "+file.size+", Message: "+_9c);
break;
case SWFUpload.ERROR_CODE_IO_ERROR:
_9d.SetStatus("Server (IO) Error");
this.debugMessage("Error Code: IO Error, File name: "+file.name+", Message: "+_9c);
break;
case SWFUpload.ERROR_CODE_SECURITY_ERROR:
_9d.SetStatus("Security Error");
this.debugMessage("Error Code: Security Error, File name: "+file.name+", Message: "+_9c);
break;
case SWFUpload.ERROR_CODE_FILE_EXCEEDS_SIZE_LIMIT:
_9d.SetStatus("File is too big.");
this.debugMessage("Error Code: File too big, File name: "+file.name+", File size: "+file.size+", Message: "+_9c);
break;
case SWFUpload.ERROR_CODE_ZERO_BYTE_FILE:
_9d.SetStatus("Cannot upload Zero Byte files.");
this.debugMessage("Error Code: Zero byte file, File name: "+file.name+", File size: "+file.size+", Message: "+_9c);
break;
case SWFUpload.ERROR_CODE_UPLOAD_LIMIT_EXCEEDED:
_9d.SetStatus("Upload limit exceeded.");
this.debugMessage("Error Code: Upload Limit Exceeded, File name: "+file.name+", File size: "+file.size+", Message: "+_9c);
break;
default:
_9d.SetStatus("Unhandled Error");
this.debugMessage("Error Code: "+_9a+", File name: "+file.name+", File size: "+file.size+", Message: "+_9c);
break;
}
}
catch(ex){
this.debugMessage(ex);
}
};
var _9e=function(_9f){
var _a0=acs_lang_text.for_upload_to||"for upload to";
var _a1=acs_lang_text.zip_extracted||"Zip File (Will be extracted after upload)";
try{
var _a2=_84.currentfolder;
var _a3=_85.getNodeById(_a2).text;
var _a4=new FileProgress(_9f,this.getSetting("progress_target"));
_a4.SetStatus(_a0+" <b>"+_a3+"</b><br>Title: <input type='text' onblur=\"fsInstance.swfu.removeFileParam('"+_9f.id+"','filetitle');fsInstance.swfu.addFileParam('"+_9f.id+"','filetitle',this.value)\">(optional)<br><input type='checkbox' id='zip"+_9f.id+"' onclick=\"if(document.getElementById('zip"+_9f.id+"').checked) { fsInstance.swfu.addFileParam('"+_9f.id+"','unpack_p','1') } else { fsInstance.swfu.removeFileParam('"+_9f.id+"','unpack_p') }\"> "+_a1);
_a4.ToggleCancel(true,this);
this.addFileParam(_9f.id,"folder_id",_a2);
}
catch(ex){
this.debugMessage(ex);
}
};
this.swfu=new SWFUpload({debug:false,upload_target_url:this.xmlhttpurl+"add-file-flash",upload_params:{user_id:_88,package_id:_87},file_types:"*.*",file_size_limit:_8a,file_queue_limit:0,file_upload_limit:10,begin_upload_on_queue:false,file_queued_handler:_9e,file_progress_handler:_8b,file_cancelled_handler:_90,file_complete_handler:_93,queue_complete_handler:_96,error_handler:_99,flash_url:"/resources/ajax-filestorage-ui/swfupload/swfupload.swf"});
}
},addFile:function(){
if(this.upldWindow==null){
if(!this.config.multi_file_upload||checkFlashVersion()<9||Ext.isLinux){
var _a5=acs_lang_text.file_to_upload||"File to upload";
var _a6=acs_lang_text.file_title||"Title";
var _a7=acs_lang_text.file_description||"Description";
var _a8=acs_lang_text.multiple_files||"Multiple Files";
var _a9=acs_lang_text.multiple_files_msg||"This is a ZIPfile containing multiple files.";
var _aa=true;
var _ab="Upload a File";
var _ac=new Ext.Panel({id:"form_addfile",align:"left",frame:true,html:"<form id=\"newfileform\" method=\"post\" enctype=\"multipart/form-data\"><input type=\"hidden\" name=\"package_id\" value=\""+this.config.package_id+"\"><input type=\"hidden\" name=\"folder_id\" value=\""+this.currentfolder+"\"><p>"+_a5+"<br /><input type=\"file\" name=\"upload_file\" id=\"upload_file\"></p><br><p>"+_a6+"<br /><input type=\"text\" name=\"filetitle\" id=\"filetitle\"></p><br><p>"+_a7+" :<br /><textarea name=\"filedescription\" id=\"filedescription\"></textarea></p><p>"+_a8+" :<br /><br /><input type=\"checkbox\" name=\"unpack_p\" value=\"t\" id=\"unpack_p\" /> "+_a9+"</p></form>"});
var _ad=[{text:"Upload",handler:this.uploadOneFile.createDelegate(this),icon:"/resources/ajaxhelper/icons/arrow_up.png",cls:"x-btn-text-icon"},{text:"Close",handler:function(){
this.upldWindow.hide();
}.createDelegate(this),icon:"/resources/ajaxhelper/icons/cross.png",cls:"x-btn-text-icon"}];
}else{
this.createSwfObj();
var _ae=acs_lang_text.upload_intro||"Click <b>Browse</b> to select a file to upload to the selected folder on the tree.";
var _aa=false;
var _ab="Upload Files";
var _ac=new Ext.Panel({id:"form_multi_addfile",autoScroll:true,frame:true,html:"<div id=\"upldMsg\">"+_ae+"<hr></div><div class=\"flash\" id=\"fsuploadprogress\"></div>"});
_ac.on("render",function(){
this.swfu.addSetting("progress_target","fsuploadprogress");
},this);
var _ad=[{text:"Browse",handler:this.swfu.browse.createDelegate(this.swfu),icon:"/resources/ajaxhelper/icons/page_add.png",cls:"x-btn-text-icon"},{text:"Upload",handler:this.swfu.startUpload.createDelegate(this.swfu,[null,this],false),icon:"/resources/ajaxhelper/icons/arrow_up.png",cls:"x-btn-text-icon"},{text:"Hide",handler:function(){
this.upldWindow.hide();
}.createDelegate(this),icon:"/resources/ajaxhelper/icons/cross.png",cls:"x-btn-text-icon"}];
}
this.upldWindow=new Ext.Window({id:"upload-win",layout:"fit",width:400,height:300,title:_ab,closeAction:"hide",modal:_aa,plain:true,resizable:false,items:_ac,buttons:_ad});
}
this.upldWindow.show();
},uploadOneFile:function(){
if(Ext.get("upload_file").getValue()!=""&&Ext.get("filetitle").getValue()!=""){
var _af=this.layout.findById("treepanel");
var _b0={success:function(){
},upload:function(){
_af.getSelectionModel().getSelectedNode().loaded=false;
_af.getSelectionModel().getSelectedNode().fireEvent("click",_af.getSelectionModel().getSelectedNode());
this.upldWindow.body.unmask();
this.upldWindow.hide();
},failure:function(){
Ext.Msg.alert(acs_lang_text.error||"Error",acs_lang_text.upload_failed||"Upload failed, please try again later.");
},scope:this};
var _b1=acs_lang_text.loading||"One moment. This may take a while depending on how large your upload is.";
this.upldWindow.body.mask("<img src='/resources/ajaxhelper/images/indicator.gif'><br>"+_b1);
YAHOO.util.Connect.setForm("newfileform",true,true);
var _b2=YAHOO.util.Connect.asyncRequest("POST",this.xmlhttpurl+"add-file",_b0);
}else{
Ext.Msg.alert(acs_lang_text.alert||"Alert",acs_lang_text.file_required||"<b>Title</b> and <b>File to upload</b> are required.");
}
},addUrl:function(){
if(this.createurlWindow==null){
this.createurlWindow=new Ext.Window({id:"createurl-win",layout:"fit",width:400,height:180,title:"Create URL",closeAction:"hide",modal:true,plain:true,resizable:false,items:new Ext.FormPanel({id:"form_create_url",align:"left",autoScroll:true,closable:true,layout:"form",defaults:{width:230},frame:true,buttonAlign:"left",items:[{xtype:"textfield",fieldLabel:"Title",allowBlank:false,name:"fstitle",tabIndex:1},{xtype:"textfield",fieldLabel:"URL",allowBlank:false,name:"fsurl",tabIndex:2},{xtype:"textfield",fieldLabel:"Description",name:"fsdescription",tabIndex:3}]}),buttons:[{text:"Submit",handler:function(){
this.createurlWindow.findById("form_create_url").getForm().submit({url:this.xmlhttpurl+"add-url",waitMsg:"One moment ....",params:{package_id:this.config.package_id,folder_id:this.currentfolder},reset:true,scope:this,success:function(_b3,_b4){
if(_b4.result){
this.createurlWindow.hide();
}else{
Ext.MessageBox.alert("Error","Sorry an error occured.<br>"+_b4.result.error);
}
},failure:function(_b5,_b6){
if(_b6.result){
Ext.MessageBox.alert("Error",_b6.result.error);
}
}});
}.createDelegate(this),icon:"/resources/ajaxhelper/icons/disk.png",cls:"x-btn-text-icon"},{text:"Close",handler:function(){
this.createurlWindow.hide();
}.createDelegate(this),icon:"/resources/ajaxhelper/icons/cross.png",cls:"x-btn-text-icon"}]});
}
this.createurlWindow.show();
},renameItem:function(_b7,i,e){
var _ba=_b7;
var _bb=this.layout.findById("treepanel");
var _bc=_ba.store.getAt(i);
var _bd=_bc.get("url");
var _be=_bc.get("type");
var _bf=_bc.get("id");
var _c0=_bc.get("filename");
var _c1=function(_c2){
var _c3=acs_lang_text.an_error_occurred||"An error occurred";
var _c4=acs_lang_text.reverted||"Your changes have been reverted";
var _c5=Ext.decode(_c2.responseText);
if(!_c5.success){
Ext.Msg.alert(acs_lang_text.error||"Error",_c3+": <br><br><font color='red'>"+_c5.error+"</font><br><br>"+_c4);
}else{
if(_be=="folder"){
_bb.getNodeById(_bf).setText(_c5.newname);
}
if(_be!="folder"&&_c0===" "){
_c0=_bc.get("title");
_bc.set("filename",_c0);
}
_bc.set("title",_c5.newname);
_bc.commit();
}
};
var _c6=function(btn,_c8){
if(btn=="ok"){
if(_c8!=""){
if(_c8.length>100){
Ext.Msg.alert(acs_lang_text.alert||"Alert",acs_lang_text.limitto100||"Please limit your name to 100 characters or less.");
return false;
}else{
Ext.Ajax.request({url:this.xmlhttpurl+"edit-name",success:_c1,failure:function(_c9){
var _ca=Ext.decode(_c9.responseText);
Ext.Msg.alert(acs_lang_text.error||"Error",error_msg_txt+"<br><br><font color='red'>"+_ca.error+"</font>");
},params:{newname:_c8,object_id:_bf,type:_be,url:_bd}});
}
}else{
Ext.Msg.alert(acs_lang_text.alert||"Alert",acs_lang_text.enter_new_name||"Please enter a new name.");
return false;
}
}
};
Ext.Msg.show({title:acs_lang_text.rename||"Rename",prompt:true,msg:acs_lang_text.enter_new_name||"Please enter a new name for ... ",value:_bc.get("title"),buttons:Ext.Msg.OKCANCEL,fn:_c6.createDelegate(this)});
var _cb=YAHOO.util.Dom.getElementsByClassName("ext-mb-input","input");
_cb[0].select();
},tagFsitem:function(_cc,i,e){
var _cf=_cc;
var _d0=_cf.store.getAt(i);
var _d1=_d0.get("id");
var _d2=_d0.get("tags");
var _d3=this.config.package_id;
var _d4=this.layout.findById("tagcloudpanel");
var _d5=this.xmlhttpurl;
var _d6=this.tagWindow;
var _d7=function(){
Ext.Ajax.request({url:this.xmlhttpurl+"add-tag",success:function(){
_d0.data.tags=Ext.get("fstags").getValue();
_d0.commit();
_d4.load({url:_d5+"get-tagcloud",params:{package_id:_d3}});
_d6.hide();
},failure:function(_d8){
Ext.Msg.alert(acs_lang_text.error||"Error","Sorry, we encountered an error.");
},params:{object_id:_d0.id,package_id:_d3,tags:Ext.get("fstags").getValue()}});
};
if(_d6==null){
var _d9=new Ext.Panel({id:"form_addtag",autoScroll:true,frame:true,html:"<div style='text-align:left' class='yui-skin-sam'><p>Enter or edit one or more tags. Use commas (,) to separate the tags:<br ><br><div class='yui-ac'><input type='text' name='fstags' id='fstags' size='60' autocomplete='off' value='"+_d2+"'><div id='oAutoCompContainer1' class='yui-ac-container'></div></div>"});
var _da=[{text:"Ok",icon:"/resources/ajaxhelper/icons/disk.png",cls:"x-btn-text-icon",handler:_d7.createDelegate(this)},{text:"Cancel",icon:"/resources/ajaxhelper/icons/cross.png",cls:"x-btn-text-icon",handler:function(){
_d6.hide();
}.createDelegate(this)}];
_d6=new Ext.Window({id:"tag-win",layout:"fit",width:450,height:300,title:"Tags",closeAction:"hide",modal:true,plain:true,autoScroll:false,resizable:false,items:_d9,buttons:_da});
}else{
}
_d6.show();
this.initTagAutoComplete();
},initTagAutoComplete:function(){
var _db=new YAHOO.widget.DS_JSArray(oAutoCompArr);
if(document.getElementById("fstags")){
var _dc=new YAHOO.widget.AutoComplete("fstags","oAutoCompContainer1",_db);
_dc.animHoriz=false;
_dc.animVert=false;
_dc.queryDelay=0;
_dc.maxResultsDisplayed=10;
_dc.useIFrame=true;
_dc.delimChar=",";
_dc.allowBrowserAutocomplete=false;
_dc.typeAhead=true;
_dc.formatResult=function(_dd,_de){
var _df=_dd[0];
return _df;
};
}
},downloadArchive:function(_e0){
if(_e0){
top.location.href="download-archive/?object_id="+_e0;
}
},redirectViews:function(_e1,i,e){
var _e4=_e1;
var _e5=_e4.store.getAt(i);
var _e6=_e5.get("id");
window.open(window.location.protocol+"//"+window.location.hostname+"/o/"+_e6+"/info");
window.focus();
},redirectPerms:function(_e7,i,e){
var _ea=_e7;
var _eb=_ea.store.getAt(i);
var _ec=_eb.get("id");
var _ed=window.open(window.location.protocol+"//"+window.location.hostname+":"+window.location.port+this.config.package_url+"permissions?object_id="+_ec+"&return_url="+window.location.pathname+"?package_id="+this.config.package_id+"&folder_id="+this.currentfolder);
_ed.focus();
},redirectProperties:function(_ee,i,e){
var _f1=_ee;
var _f2=_f1.store.getAt(i);
var _f3=_f2.get("id");
var _f4=window.open(window.location.protocol+"//"+window.location.hostname+":"+window.location.port+this.config.package_url+"file?file_id="+_f3);
_f4.focus();
},copyLink:function(_f5,i,e){
var _f8=_f5;
var _f9=_f8.store.getAt(i);
var _fa=_f9.get("type");
if(_fa==="folder"){
var _fb=window.location.protocol+"//"+window.location.hostname+":"+window.location.port+this.config.package_url+"?package_id="+this.config.package_id+"&folder_id="+_f9.get("id");
}else{
if(_fa==="url"){
var _fb=_f9.get("url");
}else{
var _fb=window.location.protocol+"//"+window.location.hostname+_f9.get("url");
}
}
if(Ext.isIE){
window.clipboardData.setData("text",_fb);
}else{
var _fc=Ext.Msg.show({title:acs_lang_text.linkaddress||"Copy Link Address",prompt:true,msg:acs_lang_text.copyhighlighted||"Copy the highlighted text to your clipboard.",value:_fb,buttons:Ext.Msg.OK});
var _fd=YAHOO.util.Dom.getElementsByClassName("ext-mb-input","input");
_fd[0].select();
}
}};
function readCookie(_fe){
var ca=document.cookie.split(";");
var _100=_fe+"=";
for(var i=0;i<ca.length;i++){
var c=ca[i];
while(c.charAt(0)==" "){
c=c.substring(1,c.length);
}
if(c.indexOf(_100)==0){
return c.substring(_100.length,c.length);
}
}
return null;
}
function createCookie(name,_104,days){
if(days){
var date=new Date();
date.setTime(date.getTime()+(days*24*60*60*1000));
var _107="; expires="+date.toGMTString();
}else{
var _107="";
}
document.cookie=name+"="+_104+_107+"; path=/";
}
function readQs(q){
var _109=window.location.search.substring(1);
var _10a=_109.split("&");
for(var i=0;i<_10a.length;i++){
var pos=_10a[i].indexOf("=");
if(pos>0){
var key=_10a[i].substring(0,pos);
var val=_10a[i].substring(pos+1);
if(key==q){
return val;
}
}
}
return null;
}
function checkFlashVersion(){
var x;
var _110;
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
function isURL(_111){
if(_111.indexOf(" ")!=-1){
return false;
}else{
if(_111.indexOf("http://")==-1){
return false;
}else{
if(_111=="http://"){
return false;
}else{
if(_111.indexOf("http://")>0){
return false;
}
}
}
}
_111=_111.substring(7,_111.length);
if(_111.indexOf(".")==-1){
return false;
}else{
if(_111.indexOf(".")==0){
return false;
}else{
if(_111.charAt(_111.length-1)=="."){
return false;
}
}
}
if(_111.indexOf("/")!=-1){
_111=_111.substring(0,_111.indexOf("/"));
if(_111.charAt(_111.length-1)=="."){
return false;
}
}
if(_111.indexOf(":")!=-1){
if(_111.indexOf(":")==(_111.length-1)){
return false;
}else{
if(_111.charAt(_111.indexOf(":")+1)=="."){
return false;
}
}
_111=_111.substring(0,_111.indexOf(":"));
if(_111.charAt(_111.length-1)=="."){
return false;
}
}
return true;
}
function FileProgress(_112,_113){
this.file_progress_id=_112.id;
this.opacity=100;
this.height=0;
this.fileProgressWrapper=document.getElementById(this.file_progress_id);
if(!this.fileProgressWrapper){
this.fileProgressWrapper=document.createElement("div");
this.fileProgressWrapper.className="progressWrapper";
this.fileProgressWrapper.id=this.file_progress_id;
this.fileProgressElement=document.createElement("div");
this.fileProgressElement.className="progressContainer";
var _114=document.createElement("a");
_114.className="progressCancel";
_114.href="#";
_114.style.visibility="hidden";
_114.appendChild(document.createTextNode(" "));
var _115=document.createElement("div");
_115.className="progressName";
_115.appendChild(document.createTextNode(_112.name));
var _116=document.createElement("div");
_116.className="progressBarInProgress";
var _117=document.createElement("div");
_117.className="progressBarStatus";
_117.innerHTML="&nbsp;";
this.fileProgressElement.appendChild(_114);
this.fileProgressElement.appendChild(_115);
this.fileProgressElement.appendChild(_117);
this.fileProgressElement.appendChild(_116);
this.fileProgressWrapper.appendChild(this.fileProgressElement);
document.getElementById(_113).appendChild(this.fileProgressWrapper);
}else{
this.fileProgressElement=this.fileProgressWrapper.firstChild;
}
this.height=this.fileProgressWrapper.offsetHeight;
}
FileProgress.prototype.SetProgress=function(_118){
this.fileProgressElement.className="progressContainer green";
this.fileProgressElement.childNodes[3].className="progressBarInProgress";
this.fileProgressElement.childNodes[3].style.width=_118+"%";
};
FileProgress.prototype.SetComplete=function(){
this.fileProgressElement.className="progressContainer blue";
this.fileProgressElement.childNodes[3].className="progressBarComplete";
this.fileProgressElement.childNodes[3].style.width="";
var _119=this;
setTimeout(function(){
_119.Disappear();
},10000);
};
FileProgress.prototype.SetError=function(){
this.fileProgressElement.className="progressContainer red";
this.fileProgressElement.childNodes[3].className="progressBarError";
this.fileProgressElement.childNodes[3].style.width="";
var _11a=this;
setTimeout(function(){
_11a.Disappear();
},5000);
};
FileProgress.prototype.SetCancelled=function(){
this.fileProgressElement.className="progressContainer";
this.fileProgressElement.childNodes[3].className="progressBarError";
this.fileProgressElement.childNodes[3].style.width="";
var _11b=this;
setTimeout(function(){
_11b.Disappear();
},2000);
};
FileProgress.prototype.SetStatus=function(_11c){
this.fileProgressElement.childNodes[2].innerHTML=_11c;
};
FileProgress.prototype.ToggleCancel=function(show,_11e){
this.fileProgressElement.childNodes[0].style.visibility=show?"visible":"hidden";
if(_11e){
var _11f=this.file_progress_id;
this.fileProgressElement.childNodes[0].onclick=function(){
_11e.cancelUpload(_11f);
return false;
};
}
};
FileProgress.prototype.Disappear=function(){
var _120=15;
var _121=4;
var rate=30;
if(this.opacity>0){
this.opacity-=_120;
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
this.height-=_121;
if(this.height<0){
this.height=0;
}
this.fileProgressWrapper.style.height=this.height+"px";
}
if(this.height>0||this.opacity>0){
var _123=this;
setTimeout(function(){
_123.Disappear();
},rate);
}else{
this.fileProgressWrapper.style.display="none";
}
};

