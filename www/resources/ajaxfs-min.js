Ext.namespace("ajaxfs");
Ext.BLANK_IMAGE_URL="/resources/ajaxhelper/ext2/resources/images/default/s.gif";
ajaxfs=function(_1){
this.xmlhttpurl="/ajaxfs/xmlhttp/";
this.create_url_p=true;
this.share_folders_p=true;
this.config=null;
this.layout=null;
this.te=null;
this.currentfolder=null;
this.currenttag=null;
this.msgbox=Ext.MessageBox;
this.upldWindow=null;
this.tagWindow=null;
this.createurlWindow=null;
this.sharefolderWindow=null;
this.revisionsWindow=null;
this.contextmenu=null;
this.swfu=null;
this.target_folder_id=null;
this.communityCombo=null;
this.initObj=function(){
if(typeof (Ext.DomHelper)!="undefined"){
if(_1){
this.config=_1;
if(this.config.xmlhttpurl){
this.xmlhttpurl=this.config.xmlhttpurl;
}
if(this.config.create_url==0){
this.create_url_p=false;
}
if(this.config.share_folders==0){
this.share_folders_p=false;
}
if(this.config.views_p==0){
this.views_p=false;
}else{
this.views_p=true;
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
_a.on("expand",this.asyncExpand.createDelegate(this,[x]),this,{single:true});
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
},createToolsMenu:function(){
var _10=new Ext.menu.Menu({id:"toolsmenu",shadow:false,items:[new Ext.menu.Item({id:"mnOpen",text:acs_lang_text.open||"Open",icon:"/resources/ajaxhelper/icons/page_white.png"}),new Ext.menu.Item({id:"mnTag",text:acs_lang_text.tag||"Tag",icon:"/resources/ajaxhelper/icons/tag_blue.png"}),new Ext.menu.Item({id:"mnView",text:acs_lang_text.views||"Views",icon:"/resources/ajaxhelper/icons/camera.png"}),new Ext.menu.Item({id:"mnRename",text:acs_lang_text.rename||"Rename",icon:"/resources/ajaxhelper/icons/page_edit.png"}),new Ext.menu.Item({id:"mnCopyLink",text:acs_lang_text.linkaddress||"Copy Link Address",icon:"/resources/ajaxhelper/icons/page_copy.png"}),new Ext.menu.Item({id:"mnPerms",text:acs_lang_text.permissions||"Permissions",icon:"/resources/ajaxhelper/icons/group_key.png"}),new Ext.menu.Item({id:"mnProp",text:acs_lang_text.properties||"Properties",icon:"/resources/ajaxhelper/icons/page_edit.png"}),new Ext.menu.Item({id:"mnArch",text:acs_lang_text.download_archive||"Download archive",icon:"/resources/ajaxhelper/icons/arrow_down.png"}),new Ext.menu.Item({id:"mnShare",text:acs_lang_text.sharefolder||"Share Folder",icon:"/resources/ajaxhelper/icons/group_link.png"}),new Ext.menu.Item({id:"mnNotif",text:acs_lang_text.request_notification||"Request Notification",icon:"/resources/ajaxhelper/icons/email.png"})]});
_10.on("beforeshow",function(){
var _11=this.layout.findById("filepanel");
var _12=this.layout.findById("treepanel");
if(_11.getSelectionModel().getCount()==0){
for(var x=0;x<_10.items.items.length;x++){
_10.items.items[x].enable();
}
_10.items.items[0].setText(acs_lang_text.open||"Open");
_10.items.items[0].disable();
_10.items.items[1].disable();
_10.items.items[6].disable();
_10.items.items[8].disable();
Ext.Ajax.request({url:this.xmlhttpurl+"notif_p",success:function(o){
if(parseInt(o.responseText)){
_10.items.items[9].setText(acs_lang_text.unsubscribe_notification||"Unsubscribe");
}else{
_10.items.items[9].setText(acs_lang_text.request_notification||"Request Notification");
}
},failure:function(_15){
_10.items.items[9].setText(acs_lang_text.request_notification||"Request Notification");
},params:{object_id:_12.getSelectionModel().getSelectedNode().attributes["id"]}});
_10.items.items[9].enable();
if(!this.views_p){
_10.items.items[2].disable();
}
}else{
if(_11.getSelectionModel().getCount()==1){
var _16=_11.getSelectionModel().getSelections();
for(var x=0;x<_10.items.items.length;x++){
_10.items.items[x].enable();
}
_10.items.items[9].setText(acs_lang_text.request_notification||"Request Notification");
switch(_16[0].get("type")){
case "folder":
_10.items.items[0].setText(acs_lang_text.open||"Open");
_10.items.items[1].disable();
_10.items.items[6].disable();
Ext.Ajax.request({url:this.xmlhttpurl+"notif_p",success:function(o){
if(parseInt(o.responseText)){
_10.items.items[9].setText(acs_lang_text.unsubscribe_notification||"Unsubscribe");
}else{
_10.items.items[9].setText(acs_lang_text.request_notification||"Request Notification");
}
},failure:function(_18){
_10.items.items[9].setText(acs_lang_text.request_notification||"Request Notification");
},params:{object_id:_12.getSelectionModel().getSelectedNode().attributes["id"]}});
_10.items.items[9].enable();
break;
case "symlink":
_10.items.items[0].setText(acs_lang_text.open||"Open");
_10.items.items[1].disable();
_10.items.items[3].disable();
_10.items.items[6].disable();
_10.items.items[9].disable();
break;
case "url":
_10.items.items[0].setText(acs_lang_text.open||"Open");
_10.items.items[6].disable();
_10.items.items[7].disable();
_10.items.items[8].disable();
_10.items.items[9].disable();
break;
default:
_10.items.items[0].setText(acs_lang_text.download||"Download");
_10.items.items[7].disable();
_10.items.items[8].disable();
_10.items.items[9].disable();
break;
}
if(!this.share_folders_p){
_10.items.items[8].disable();
}
if(!this.views_p){
_10.items.items[2].disable();
}
}else{
for(var x=0;x<_10.items.items.length;x++){
_10.items.items[x].disable();
}
}
}
},this);
_10.on("itemclick",function(_19,e){
var _1b=this.layout.findById("filepanel");
if(_1b.getSelectionModel().getCount()==1){
var _1c=_1b;
var _1d=_1c.getSelectionModel().getSelected().get("id");
for(var x=0;x<_1c.store.data.items.length;x++){
if(_1c.store.data.items[x].id==_1d){
var i=x;
break;
}
}
}else{
var _1c=this.layout.findById("treepanel");
var _1d=_1c.getSelectionModel().getSelectedNode().attributes["id"];
var i=_1d;
}
switch(_19.getId()){
case "mnOpen":
this.openItem(_1c,i);
break;
case "mnTag":
this.tagFsitem(_1c,i);
break;
case "mnView":
this.redirectViews(_1c,i);
break;
case "mnRename":
this.renameItem(_1c,i);
break;
case "mnCopyLink":
this.copyLink(_1c,i);
break;
case "mnPerms":
this.redirectPerms(_1c,i);
break;
case "mnProp":
this.showRevisions(_1c,i);
break;
case "mnArch":
this.downloadArchive(_1d);
break;
case "mnShare":
this.showShareOptions(_1c,i);
break;
case "mnNotif":
this.redirectNotifs(_1c,i);
break;
}
},this);
var _20={text:"Tools",iconCls:"toolsmenu",menu:_10};
return _20;
},createToolbar:function(){
var _21=this.config.treerootnode;
var _22=[];
if(_21.attributes["write_p"]=="t"){
var _22=[" ",{text:acs_lang_text.newfolder||"New Folder",tooltip:acs_lang_text.newfolder||"New Folder",icon:"/resources/ajaxhelper/icons/folder_add.png",cls:"x-btn-text-icon",handler:this.addFolder.createDelegate(this)},{text:acs_lang_text.uploadfile||"Upload Files",tooltip:acs_lang_text.uploadfile||"Upload Files",icon:"/resources/ajaxhelper/icons/page_add.png",cls:"x-btn-text-icon",handler:this.addFile.createDelegate(this)}];
if(this.create_url_p){
_22.push({text:acs_lang_text.createurl||"Create Url",tooltip:acs_lang_text.createurl||"Create Url",icon:"/resources/ajaxhelper/icons/page_link.png",cls:"x-btn-text-icon",handler:this.addUrl.createDelegate(this)});
}
_22.push({text:acs_lang_text.deletefs||"Delete",tooltip:acs_lang_text.deletefs||"Delete",icon:"/resources/ajaxhelper/icons/delete.png",cls:"x-btn-text-icon",handler:this.delItem.createDelegate(this)});
_22.push(this.createToolsMenu());
_22.push("->");
}
_22.push({tooltip:"This may take a few minutes if you have a lot of files",text:acs_lang_text.download_archive||"Download Archive",icon:"/resources/ajaxhelper/icons/arrow_down.png",cls:"x-btn-text-icon",handler:this.downloadArchive.createDelegate(this,[_21.id],false)});
return _22;
},createLeft:function(){
var _23=new Ext.Panel({id:"leftpanel",region:"west",collapsible:true,titlebar:true,title:" ",layout:"accordion",split:true,width:300,items:[this.createTreePanel(),this.createTagPanel()]});
return _23;
},createTreePanel:function(){
var _24=new Ext.tree.AsyncTreeNode({text:this.config.treerootnode.text,draggable:false,id:this.config.treerootnode.id,singeClickExpand:true,expanded:true,attributes:this.config.treerootnode.attributes});
var _25=new Ext.tree.TreeLoader({dataUrl:this.xmlhttpurl+"load-treenodes",baseParams:{package_id:this.config.package_id}});
var _26=new Ext.tree.TreePanel({id:"treepanel",title:"Folders",autoScroll:true,animate:true,enableDrag:false,enableDrop:true,loadMask:true,loader:_25,root:_24,ddAppendOnly:true,containerScroll:true,dropConfig:{dropAllowed:true,ddGroup:"fileDD",onNodeOver:function(_27,_28,e,_2a){
if(_27.node.id==_27.node.ownerTree.getSelectionModel().getSelectedNode().id){
return false;
}
if(_28.dragData.selections){
for(var x=0;x<_28.dragData.selections.length;x++){
if(_27.node.id==_28.dragData.selections[x].data.id){
return false;
}
}
}
return true;
},onNodeDrop:function(_2c,_2d,e,_2f){
var _30=this.layout.findById("filepanel");
var _31=_2c.node.id;
var _32=[];
for(var x=0;x<_2f.selections.length;x++){
_32[x]=_2f.selections[x].data.id;
}
var _34=acs_lang_text.an_error_occurred||"An error occurred";
var _35=acs_lang_text.reverted||"Your changes have been reverted";
var _36=function(_37){
var _38=Ext.decode(_37.responseText);
if(_38.success){
var dm=_30.store;
var _3a=_30.getSelectionModel().getSelections();
var _3b=false;
for(var x=0;x<_3a.length;x++){
dm.remove(_3a[x]);
if(_3a[x].data.type=="folder"){
_3b=true;
if(_2c.node.ownerTree.getNodeById(_3a[x].data.id)){
var _3d=_2c.node.ownerTree.getNodeById(_3a[x].data.id).parentNode;
_3d.loaded=false;
_3d.removeChild(_2c.node.ownerTree.getNodeById(_3a[x].data.id));
}
}
}
if(_3b){
var _3e=_2c.node.ownerTree.getRootNode();
if(_3e.id==_2c.node.id){
_3e.fireEvent("click",_3e);
}
_2c.node.loaded=false;
_2c.node.expand();
}
}else{
Ext.Msg.alert(acs_lang_text.error||"Error",_34+"<br>"+_35);
}
};
Ext.Ajax.request({url:this.xmlhttpurl+"move-fsitem",success:_36,failure:function(_3f){
var _40=Ext.decode(_3f.responseText);
var msg="";
if(_40.error){
msg=_40.error;
}
Ext.Msg.alert(acs_lang_text.error||"Error",_34+"<br>"+msg+"<br>"+_35);
},params:{folder_target_id:_31,file_ids:_32}});
return true;
}.createDelegate(this)}});
this.enableTreeFolderRename(_26);
_24.on("expand",this.selectInitFolder,this,{single:true});
_26.on("click",this.loadFoldercontents,this);
return _26;
},enableTreeFolderRename:function(_42){
this.te=new Ext.tree.TreeEditor(_42,{allowBlank:false,blankText:acs_lang_text.folder_name_required||"A folder name is required",ignoreNoChange:true});
this.te.on("beforestartedit",function(_43,el,_45){
if(_43.editNode.attributes.attributes.write_p=="t"){
return true;
}else{
Ext.Msg.alert(acs_lang_text.permission_denied||"Permission Denied",acs_lang_text.permission_denied||"Sorry, you do not have permission to rename this folder");
return false;
}
},this,true);
this.te.on("beforecomplete",function(_46,_47,_48){
var _49=_46.editNode.parentNode;
if(_49){
var _4a=_49.childNodes;
for(x=0;x<_4a.length;x++){
if(_4a[x].text==_47&&_4a[x].id!=_46.editNode.id){
Ext.Msg.alert(acs_lang_text.duplicate_name||"Duplicate Name",acs_lang_text.duplicate_name_error||"Please enter a different name. The name you entered is already being used.");
return false;
}
}
}
return true;
},this,true);
this.te.on("complete",function(_4b,_4c,_4d){
var _4e=acs_lang_text.an_error_occurred||"An error occurred";
var _4f=acs_lang_text.reverted||"Your changes have been reverted";
Ext.Ajax.request({url:this.xmlhttpurl+"rename-fsitem",success:function(_50){
var _51=Ext.decode(_50.responseText);
if(!_51.success){
Ext.Msg.alert(acs_lang_text.error||"Error",_4e+": <br><br><font color='red'>"+_51.error+"</font><br><br>"+_4f);
_4b.editNode.setText(_4d);
}
},failure:function(){
Ext.Msg.alert(acs_lang_text.error||"Error",_4e+"<br>"+_4f);
_4b.editNode.setText(_4d);
},params:{newname:_4c,object_id:_4b.editNode.id,type:"folder"}});
},this,true);
},createTagPanel:function(){
var _52=new Ext.Panel({id:"tagcloudpanel",title:"Tags",frame:false,loadMask:true,autoScroll:true,autoLoad:{url:this.xmlhttpurl+"get-tagcloud",params:{package_id:this.config.package_id}}});
var _53=function(){
var _54=this;
var _55=_54.currenttag;
_52.body.on("click",function(obj,el){
if(el.tagName=="A"){
if(_55!=null){
Ext.get(_55).setStyle("font-weight","normal");
}
Ext.get(el).setStyle("font-weight","bold");
_55=el.id;
this.loadTaggedFiles(el.id);
}
},this);
};
_52.on("render",_53,this);
return _52;
},loadTaggedFiles:function(_58){
this.layout.findById("treepanel").getSelectionModel().clearSelections();
var id=_58.substring(3,_58.length);
this.layout.findById("filepanel").store.baseParams["tag_id"]=id;
this.layout.findById("filepanel").store.load();
this.layout.findById("filepanel").store.baseParams["tag_id"]="";
},createRight:function(){
var _5a=function(_5b,p,_5d){
p.attr="ext:qtip='"+_5d.get("qtip")+"'";
return _5b;
};
var _5e=[{header:"",width:30,sortable:true,dataIndex:"icon"},{header:acs_lang_text.filename||"Filename",id:"filename",sortable:true,dataIndex:"title",renderer:_5a},{header:acs_lang_text.size||"Size",sortable:true,dataIndex:"size"},{header:acs_lang_text.lastmodified||"Last Modified",sortable:true,dataIndex:"lastmodified"}];
var _5f=new Ext.data.JsonReader({totalProperty:"total",root:"foldercontents",id:"id"},[{name:"id",type:"int"},{name:"qtip"},{name:"icon"},{name:"title"},{name:"filename"},{name:"type"},{name:"tags"},{name:"url"},{name:"linkurl"},{name:"write_p"},{name:"symlink_id"},{name:"size"},{name:"lastmodified"}]);
var _60=new Ext.data.HttpProxy({url:this.xmlhttpurl+"get-foldercontents"});
var _61=new Ext.grid.ColumnModel(_5e);
var _62=new Ext.data.Store({proxy:_60,reader:_5f,remoteSort:true});
var _63=new Ext.grid.GridPanel({store:_62,cm:_61,id:"filepanel",ddGroup:"fileDD",region:"center",split:true,autoScroll:true,autoExpandColumn:"filename",collapsible:true,enableDragDrop:true,width:250,loadMask:true,frame:false,viewConfig:{forceFit:false,enableRowBody:true,showPreview:true,getRowClass:function(_64,_65,p,ds){
var xf=Ext.util.Format;
if(_64.data.tags!=""){
p.body="<div id='tagscontainer"+_64.data.id+"' style='padding-left:35px;color:blue'>Tags: "+xf.ellipsis(xf.stripTags(_64.data.tags),200)+"</div>";
}else{
p.body="<div id='tagscontainer"+_64.data.id+"' style='padding-left:35px;color:blue'></div>";
}
return "x-grid3-row-expanded";
}}});
_63.on("rowdblclick",this.openItem,this,true);
_63.on("rowcontextmenu",this.showRowContext,this,true);
return _63;
},showRowContext:function(_69,i,e){
e.stopEvent();
var _6c=this.layout.findById("treepanel");
var _6d=this.config.treerootnode;
var dm=_69.store;
var _6f=dm.getAt(i);
var _70=_6f.get("type");
var _71=_6f.get("id");
var _72;
switch(_70){
case "folder":
_72="Open";
break;
case "url":
_72="Open";
break;
default:
_72="Download";
break;
}
this.contextmenu=new Ext.menu.Menu({id:"rightclickmenu",items:[new Ext.menu.Item({text:_72,icon:"/resources/ajaxhelper/icons/page_white.png",handler:this.openItem.createDelegate(this,[_69,i,e],false)}),new Ext.menu.Item({text:"Tag",icon:"/resources/ajaxhelper/icons/tag_blue.png",handler:this.tagFsitem.createDelegate(this,[_69,i,e],false)}),new Ext.menu.Item({text:"Views",icon:"/resources/ajaxhelper/icons/camera.png",handler:this.redirectViews.createDelegate(this,[_69,i,e],false)}),new Ext.menu.Item({text:acs_lang_text.deletefs||"Delete",icon:"/resources/ajaxhelper/icons/delete.png",handler:this.delItem.createDelegate(this,[_69,i,e],false)}),new Ext.menu.Item({text:acs_lang_text.rename||"Rename",icon:"/resources/ajaxhelper/icons/page_edit.png",handler:this.renameItem.createDelegate(this,[_69,i,e],false)}),new Ext.menu.Item({text:acs_lang_text.linkaddress||"Copy Link Address",icon:"/resources/ajaxhelper/icons/page_copy.png",handler:this.copyLink.createDelegate(this,[_69,i,e],false)}),new Ext.menu.Item({text:acs_lang_text.permissions||"Permissions",icon:"/resources/ajaxhelper/icons/group_key.png",handler:this.redirectPerms.createDelegate(this,[_69,i,e],false)}),new Ext.menu.Item({text:acs_lang_text.properties||"Properties",icon:"/resources/ajaxhelper/icons/page_edit.png",handler:this.showRevisions.createDelegate(this,[_69,i,e],false)}),new Ext.menu.Item({text:acs_lang_text.download_archive||"Download archive",icon:"/resources/ajaxhelper/icons/arrow_down.png",handler:this.downloadArchive.createDelegate(this,[_71],false)}),new Ext.menu.Item({text:acs_lang_text.sharefolder||"Share Folder",icon:"/resources/ajaxhelper/icons/group_link.png",handler:this.showShareOptions.createDelegate(this,[_69,i,e],false)})]});
if(_69.getSelectionModel().getCount()>1){
this.contextmenu.items.items[0].hide();
this.contextmenu.items.items[1].hide();
this.contextmenu.items.items[2].hide();
this.contextmenu.items.items[3].show();
this.contextmenu.items.items[4].hide();
this.contextmenu.items.items[5].hide();
this.contextmenu.items.items[6].hide();
this.contextmenu.items.items[7].hide();
this.contextmenu.items.items[8].hide();
this.contextmenu.items.items[9].hide();
}else{
this.contextmenu.items.items[0].show();
this.contextmenu.items.items[2].show();
this.contextmenu.items.items[3].show();
this.contextmenu.items.items[4].show();
this.contextmenu.items.items[5].show();
this.contextmenu.items.items[6].show();
switch(_70){
case "folder":
this.contextmenu.items.items[1].hide();
this.contextmenu.items.items[7].hide();
this.contextmenu.items.items[8].show();
if(_6c.getNodeById(_71).attributes.attributes.type=="symlink"){
this.contextmenu.items.items[9].hide();
}else{
this.contextmenu.items.items[9].show();
}
break;
case "url":
this.contextmenu.items.items[1].show();
this.contextmenu.items.items[7].hide();
this.contextmenu.items.items[8].hide();
this.contextmenu.items.items[9].hide();
break;
case "symlink":
this.contextmenu.items.items[4].hide();
this.contextmenu.items.items[9].hide();
break;
default:
this.contextmenu.items.items[1].show();
this.contextmenu.items.items[7].show();
this.contextmenu.items.items[8].hide();
this.contextmenu.items.items[9].hide();
}
}
if(!this.share_folders_p){
this.contextmenu.items.items[9].hide();
}
if(!this.views_p){
this.contextmenu.items.items[2].hide();
}
if(_6d.attributes["write_p"]=="f"){
this.contextmenu.items.items[1].hide();
this.contextmenu.items.items[3].hide();
this.contextmenu.items.items[6].hide();
this.contextmenu.items.items[7].hide();
this.contextmenu.items.items[9].hide();
}
var _73=e.getXY();
this.contextmenu.rowid=i;
this.contextmenu.showAt([_73[0],_73[1]]);
},loadFoldercontents:function(_74,e){
this.currentfolder=_74.id;
var _76=this.layout.findById("filepanel");
_76.store.baseParams["folder_id"]=_74.id;
_76.store.baseParams["package_id"]=this.config.package_id;
if(_74.loading){
_74.on("expand",function(){
this.store.load();
},_76,{single:true});
}else{
_76.store.load();
}
},openItem:function(_77,i,e){
var _7a=this.layout.findById("treepanel");
var dm=_77.store;
var _7c=dm.getAt(i);
if(_7c.get("type")=="folder"||_7c.get("type")=="symlink"){
var _7d=_7a.getNodeById(_7c.get("id"));
if(!_7d.parentNode.isExpanded()){
_7d.parentNode.expand();
}
_7d.fireEvent("click",_7d);
_7d.expand();
}else{
window.open(_7c.get("url"));
window.focus();
}
},delItem:function(_7e,i,e){
var _81=acs_lang_text.confirm_delete||"Are you sure you want to delete ";
var _82=acs_lang_text.foldercontains||"This folder contains";
var _83=this.layout.findById("treepanel");
if(_7e.id=="filepanel"){
var _84=_7e;
if(_84.getSelectionModel().getCount()<=1){
_84.getSelectionModel().selectRow(i);
}
}else{
var _84=this.layout.findById("filepanel");
}
var _85=_84.getSelectionModel().getSelections();
var _86=true;
if(_85.length>0){
_86=false;
if(_85.length==1){
var _87=_85[0].get("title");
if(_85[0].get("type")==="folder"){
var msg=_82+" <b>"+_85[0].get("size")+"</b>.<br>";
}else{
var msg="";
}
var msg=msg+_81+" <b>"+_87+"</b> ?";
if(_85[0].get("type")==="symlink"){
var _89=_85[0].get("symlink_id");
}else{
var _89=_85[0].get("id");
}
}else{
var msg=_81+": <br><br>";
var _89=[];
for(var x=0;x<_85.length;x++){
msg=msg+"<b>"+_85[x].get("title")+"</b> ";
if(_85[x].get("type")==="folder"){
msg=msg+"("+_85[x].get("size")+")";
}
msg=msg+"<br>";
if(_85[x].get("type")==="symlink"){
_89[x]=_85[x].get("symlink_id");
}else{
_89[x]=_85[x].get("id");
}
}
}
var _8b={object_id:_89};
}else{
_86=true;
var _8c=_83.getSelectionModel().getSelectedNode();
var _89=_8c.attributes["id"];
var _8d=_8c.attributes.attributes["type"];
var _8e=_8c.attributes.attributes["symlink_id"];
var _8f=_83.getRootNode();
if(_8d=="symlink"){
var _8b={object_id:_8e};
}else{
var _8b={object_id:_89};
}
if(_8c.attributes["id"]==_8f.attributes["id"]){
Ext.Msg.alert(acs_lang_text.alert||"Alert",acs_lang_text.cant_del_root||"The root folder can not be deleted.");
return;
}else{
if(typeof (_8c.attributes.attributes["size"])=="undefined"){
var msg="";
}else{
var msg=_82+" <b>"+_8c.attributes.attributes["size"]+"</b>.<br>";
}
msg=msg+_81+" <b>"+_8c.attributes["text"]+"</b>?";
}
}
var _90=function(_91){
if(_91==="yes"){
Ext.Ajax.request({url:this.xmlhttpurl+"delete-fsitem",success:function(_92){
var _93=Ext.decode(_92.responseText);
if(_93.success){
if(_86){
var _94=_83.getSelectionModel().getSelectedNode();
var _95=_94.parentNode;
_95.fireEvent("click",_95);
_95.removeChild(_94);
}else{
for(var x=0;x<_85.length;x++){
_84.store.remove(_85[x]);
var _97=_85[x].get("id");
var _94=_83.getNodeById(_97);
if(_94){
_94.parentNode.fireEvent("click",_94.parentNode);
_94.parentNode.removeChild(_94);
}
}
}
}else{
Ext.Msg.alert(acs_lang_text.error||"Error","Sorry, we encountered an error.");
}
},failure:function(){
Ext.Msg.alert(acs_lang_text.error||"Error",error_msg_txt+"<br><br><font color='red'>"+resultObj.error+"</font>");
},params:_8b});
}
};
Ext.MessageBox.confirm(acs_lang_text.confirm||"Confirm",msg,_90,this);
},addFolder:function(){
var te=this.te;
var _99=this.layout.findById("treepanel");
var _9a=_99.getSelectionModel().getSelectedNode();
_9a.expand();
var _9b=acs_lang_text.new_folder_error||"Sorry, there was an error trying to create your new folder.";
Ext.Ajax.request({url:this.xmlhttpurl+"add-blankfolder",success:function(_9c){
var _9d=Ext.decode(_9c.responseText);
if(_9d.success){
var _9e=_9a.appendChild(new Ext.tree.TreeNode({text:_9d.pretty_folder_name,id:_9d.id,iconCls:"folder",singleClickExpand:true,attributes:{write_p:"t"}}));
_99.getSelectionModel().select(_9e);
_9e.loaded=true;
_9e.fireEvent("click",_9e);
setTimeout(function(){
te.editNode=_9e;
te.startEdit(_9e.ui.textNode);
},10);
}else{
Ext.Msg.alert(acs_lang_text.error||"Error",_9b+"<br><br><font color='red'>"+_9d.error+"</font>");
}
},failure:function(_9f){
var _a0=Ext.decode(_9f.responseText);
Ext.Msg.alert(acs_lang_text.error||"Error",_9b+"<br><br><font color='red'>"+_a0.error+"</font>");
},params:{folder_id:_9a.attributes["id"]}});
},createSwfObj:function(){
var _a1=this;
var _a2=_a1.layout.findById("treepanel");
var _a3=_a1.currentfolder;
if(this.swfu==null){
var _a4=String(this.config.package_id);
var _a5=String(this.config.user_id);
var _a6=String(this.currentfolder);
var _a7=String(this.config.max_file_size);
var _a8=function(_a9,_aa){
try{
var _ab=Math.ceil((_aa/_a9.size)*100);
var _ac=new FileProgress(_a9,this.getSetting("progress_target"));
_ac.SetProgress(_ab);
_ac.SetStatus(acs_lang_text.uploading||"Uploading...");
}
catch(ex){
this.debugMessage(ex);
}
};
var _ad=function(_ae){
try{
var _af=new FileProgress(_ae,this.getSetting("progress_target"));
_af.SetCancelled();
_af.SetStatus(acs_lang_text.uploadcancel||"Cancelled (This item will be removed shortly)");
_af.ToggleCancel(false);
}
catch(ex){
this.debugMessage(ex);
}
};
var _b0=function(_b1){
try{
var _b2=new FileProgress(_b1,this.getSetting("progress_target"));
_b2.SetComplete();
_b2.SetStatus(acs_lang_text.complete||"Complete.");
_b2.ToggleCancel(false);
}
catch(ex){
this.debugMessage(ex);
}
};
var _b3=function(_b4){
var _b5=_a2.getNodeById(_a1.currentfolder);
_b5.fireEvent("click",_b5);
};
var _b6=function(_b7,_b8,_b9){
try{
if(_b7==SWFUpload.ERROR_CODE_QUEUE_LIMIT_EXCEEDED){
Ext.Msg.alert(acs_lang_text.alert||"Alert","You have attempted to queue too many files.\n"+(_b9==0?"You have reached the upload limit.":"You may select "+(_b9>1?"up to "+_b9+" files.":"one file.")));
return;
}
var _ba=new FileProgress(_b8,this.getSetting("progress_target"));
_ba.SetError();
_ba.ToggleCancel(false);
switch(_b7){
case SWFUpload.ERROR_CODE_HTTP_ERROR:
_ba.SetStatus("Upload Error");
this.debugMessage("Error Code: HTTP Error, File name: "+file.name+", Message: "+_b9);
break;
case SWFUpload.ERROR_CODE_MISSING_UPLOAD_TARGET:
_ba.SetStatus("Configuration Error");
this.debugMessage("Error Code: No backend file, File name: "+file.name+", Message: "+_b9);
break;
case SWFUpload.ERROR_CODE_UPLOAD_FAILED:
_ba.SetStatus("Upload Failed.");
this.debugMessage("Error Code: Upload Failed, File name: "+file.name+", File size: "+file.size+", Message: "+_b9);
break;
case SWFUpload.ERROR_CODE_IO_ERROR:
_ba.SetStatus("Server (IO) Error");
this.debugMessage("Error Code: IO Error, File name: "+file.name+", Message: "+_b9);
break;
case SWFUpload.ERROR_CODE_SECURITY_ERROR:
_ba.SetStatus("Security Error");
this.debugMessage("Error Code: Security Error, File name: "+file.name+", Message: "+_b9);
break;
case SWFUpload.ERROR_CODE_FILE_EXCEEDS_SIZE_LIMIT:
_ba.SetStatus("File is too big.");
this.debugMessage("Error Code: File too big, File name: "+file.name+", File size: "+file.size+", Message: "+_b9);
break;
case SWFUpload.ERROR_CODE_ZERO_BYTE_FILE:
_ba.SetStatus("Cannot upload Zero Byte files.");
this.debugMessage("Error Code: Zero byte file, File name: "+file.name+", File size: "+file.size+", Message: "+_b9);
break;
case SWFUpload.ERROR_CODE_UPLOAD_LIMIT_EXCEEDED:
_ba.SetStatus("Upload limit exceeded.");
this.debugMessage("Error Code: Upload Limit Exceeded, File name: "+file.name+", File size: "+file.size+", Message: "+_b9);
break;
default:
_ba.SetStatus("Unhandled Error");
this.debugMessage("Error Code: "+_b7+", File name: "+file.name+", File size: "+file.size+", Message: "+_b9);
break;
}
}
catch(ex){
this.debugMessage(ex);
}
};
var _bb=function(_bc){
var _bd=acs_lang_text.for_upload_to||"for upload to";
var _be=acs_lang_text.zip_extracted||"Zip File (Will be extracted after upload)";
try{
var _bf=_a1.currentfolder;
var _c0=_a2.getNodeById(_bf).text;
var _c1=new FileProgress(_bc,this.getSetting("progress_target"));
_c1.SetStatus(_bd+" <b>"+_c0+"</b><br>Title: <input type='text' onblur=\"fsInstance.swfu.removeFileParam('"+_bc.id+"','filetitle');fsInstance.swfu.addFileParam('"+_bc.id+"','filetitle',this.value)\">(optional)<br><input type='checkbox' id='zip"+_bc.id+"' onclick=\"if(document.getElementById('zip"+_bc.id+"').checked) { fsInstance.swfu.addFileParam('"+_bc.id+"','unpack_p','1') } else { fsInstance.swfu.removeFileParam('"+_bc.id+"','unpack_p') }\"> "+_be);
_c1.ToggleCancel(true,this);
this.addFileParam(_bc.id,"folder_id",_bf);
}
catch(ex){
this.debugMessage(ex);
}
};
this.swfu=new SWFUpload({debug:false,upload_target_url:this.xmlhttpurl+"add-file-flash",upload_params:{user_id:_a5,package_id:_a4},file_types:"*.*",file_size_limit:_a7,file_queue_limit:0,file_upload_limit:10,begin_upload_on_queue:false,file_queued_handler:_bb,file_progress_handler:_a8,file_cancelled_handler:_ad,file_complete_handler:_b0,queue_complete_handler:_b3,error_handler:_b6,flash_url:"/resources/ajax-filestorage-ui/swfupload/swfupload.swf"});
}
},addFile:function(){
if(this.upldWindow==null){
if(!this.config.multi_file_upload||checkFlashVersion()<9||checkFlashVersion()==10||Ext.isLinux){
var _c2=acs_lang_text.file_to_upload||"File to upload";
var _c3=acs_lang_text.file_title||"Title";
var _c4=acs_lang_text.file_description||"Description";
var _c5=acs_lang_text.multiple_files||"Multiple Files";
var _c6=acs_lang_text.multiple_files_msg||"This is a ZIPfile containing multiple files.";
var _c7=true;
var _c8=acs_lang_text.uploadfile||"Upload a File";
var _c9=new Ext.Panel({id:"form_addfile",align:"left",frame:true,html:"<form id=\"newfileform\" method=\"post\" enctype=\"multipart/form-data\"><input type=\"hidden\" name=\"package_id\" value=\""+this.config.package_id+"\"><input type=\"hidden\" name=\"folder_id\" value=\""+this.currentfolder+"\"><p>"+_c2+"<br /><input type=\"file\" name=\"upload_file\" id=\"upload_file\"></p><br><p>"+_c3+"<br /><input type=\"text\" name=\"filetitle\" id=\"filetitle\"></p><br><p>"+_c4+" :<br /><textarea name=\"filedescription\" id=\"filedescription\"></textarea></p><p>"+_c5+" :<br /><br /><input type=\"checkbox\" name=\"unpack_p\" value=\"t\" id=\"unpack_p\" /> "+_c6+"</p></form>"});
var _ca=[{text:acs_lang_text.upload||"Upload",handler:this.uploadOneFile.createDelegate(this),icon:"/resources/ajaxhelper/icons/arrow_up.png",cls:"x-btn-text-icon"},{text:acs_lang_text.close||"Close",handler:function(){
this.upldWindow.hide();
}.createDelegate(this),icon:"/resources/ajaxhelper/icons/cross.png",cls:"x-btn-text-icon"}];
}else{
this.createSwfObj();
var _cb=acs_lang_text.upload_intro||"Click <b>Browse</b> to select a file to upload to the selected folder on the tree.";
var _c7=false;
var _c8="Upload Files";
var _c9=new Ext.Panel({id:"form_multi_addfile",autoScroll:true,frame:true,html:"<div id=\"upldMsg\">"+_cb+"<hr></div><div class=\"flash\" id=\"fsuploadprogress\"></div>"});
_c9.on("render",function(){
this.swfu.addSetting("progress_target","fsuploadprogress");
},this);
var _ca=[{text:"Browse",handler:this.swfu.browse.createDelegate(this.swfu),icon:"/resources/ajaxhelper/icons/page_add.png",cls:"x-btn-text-icon"},{text:"Upload",handler:this.swfu.startUpload.createDelegate(this.swfu,[null,this],false),icon:"/resources/ajaxhelper/icons/arrow_up.png",cls:"x-btn-text-icon"},{text:"Hide",handler:function(){
this.upldWindow.hide();
}.createDelegate(this),icon:"/resources/ajaxhelper/icons/cross.png",cls:"x-btn-text-icon"}];
}
this.upldWindow=new Ext.Window({id:"upload-win",layout:"fit",width:400,height:300,title:_c8,closeAction:"hide",modal:_c7,plain:true,resizable:false,items:_c9,buttons:_ca});
}else{
if(!this.config.multi_file_upload||checkFlashVersion()<9||checkFlashVersion()==10||Ext.isLinux){
document.getElementById("newfileform").folder_id.value=this.currentfolder;
}
}
this.upldWindow.show();
},uploadOneFile:function(){
if(Ext.get("upload_file").getValue()!=""&&Ext.get("filetitle").getValue()!=""){
var _cc=this.layout.findById("treepanel");
var _cd={success:function(){
},upload:function(){
_cc.getSelectionModel().getSelectedNode().loaded=false;
_cc.getSelectionModel().getSelectedNode().fireEvent("click",_cc.getSelectionModel().getSelectedNode());
this.upldWindow.body.unmask();
this.upldWindow.hide();
},failure:function(){
Ext.Msg.alert(acs_lang_text.error||"Error",acs_lang_text.upload_failed||"Upload failed, please try again later.");
},scope:this};
var _ce=acs_lang_text.loading||"One moment. This may take a while depending on how large your upload is.";
this.upldWindow.body.mask("<img src='/resources/ajaxhelper/images/indicator.gif'><br>"+_ce);
YAHOO.util.Connect.setForm("newfileform",true,true);
var _cf=YAHOO.util.Connect.asyncRequest("POST",this.xmlhttpurl+"add-file",_cd);
}else{
Ext.Msg.alert(acs_lang_text.alert||"Alert",acs_lang_text.file_required||"<b>Title</b> and <b>File to upload</b> are required.");
}
},addUrl:function(){
if(this.createurlWindow==null){
this.createurlWindow=new Ext.Window({id:"createurl-win",layout:"fit",width:400,height:180,title:"Create URL",closeAction:"hide",modal:true,plain:true,resizable:false,items:new Ext.FormPanel({id:"form_create_url",align:"left",autoScroll:true,closable:true,layout:"form",defaults:{width:230},frame:true,buttonAlign:"left",items:[{xtype:"textfield",fieldLabel:"Title",allowBlank:false,name:"fstitle",tabIndex:1},{xtype:"textfield",fieldLabel:"URL",allowBlank:false,name:"fsurl",tabIndex:2,validator:isURL},{xtype:"textfield",fieldLabel:"Description",name:"fsdescription",tabIndex:3}]}),buttons:[{text:"Submit",handler:function(){
this.createurlWindow.findById("form_create_url").getForm().submit({url:this.xmlhttpurl+"add-url",waitMsg:"One moment ....",params:{package_id:this.config.package_id,folder_id:this.currentfolder},reset:true,scope:this,success:function(_d0,_d1){
if(_d1.result){
var _d2=this.layout.findById("treepanel");
_d2.getSelectionModel().getSelectedNode().fireEvent("click",_d2.getSelectionModel().getSelectedNode());
this.createurlWindow.hide();
}else{
Ext.MessageBox.alert("Error","Sorry an error occured.<br>"+_d1.result.error);
}
},failure:function(_d3,_d4){
if(_d4.result){
Ext.MessageBox.alert("Error",_d4.result.error);
}
}});
}.createDelegate(this),icon:"/resources/ajaxhelper/icons/disk.png",cls:"x-btn-text-icon"},{text:"Close",handler:function(){
this.createurlWindow.hide();
}.createDelegate(this),icon:"/resources/ajaxhelper/icons/cross.png",cls:"x-btn-text-icon"}]});
}
this.createurlWindow.show();
},renameItem:function(_d5,i,e){
if(_d5.id=="treepanel"){
var _d8=_d5.getSelectionModel().getSelectedNode();
this.te.triggerEdit(_d8);
}else{
var _d9=_d5;
var _da=this.layout.findById("treepanel");
var _d8=_d9.store.getAt(i);
var _db=_d8.get("url");
var _dc=_d8.get("type");
var _dd=_d8.get("id");
var _de=_d8.get("filename");
var _df=function(_e0){
var _e1=acs_lang_text.an_error_occurred||"An error occurred";
var _e2=acs_lang_text.reverted||"Your changes have been reverted";
var _e3=Ext.decode(_e0.responseText);
if(!_e3.success){
Ext.Msg.alert(acs_lang_text.error||"Error",_e1+": <br><br><font color='red'>"+_e3.error+"</font><br><br>"+_e2);
}else{
if(_dc=="folder"){
_da.getNodeById(_dd).setText(_e3.newname);
}
if(_dc!="folder"&&_de===" "){
_de=_d8.get("title");
_d8.set("filename",_de);
}
_d8.set("title",_e3.newname);
_d8.commit();
}
};
var _e4=function(btn,_e6){
if(btn=="ok"){
if(_e6!=""){
if(_e6.length>100){
Ext.Msg.alert(acs_lang_text.alert||"Alert",acs_lang_text.limitto100||"Please limit your name to 100 characters or less.");
return false;
}else{
Ext.Ajax.request({url:this.xmlhttpurl+"edit-name",success:_df,failure:function(_e7){
var _e8=Ext.decode(_e7.responseText);
Ext.Msg.alert(acs_lang_text.error||"Error",error_msg_txt+"<br><br><font color='red'>"+_e8.error+"</font>");
},params:{newname:_e6,object_id:_dd,type:_dc,url:_db}});
}
}else{
Ext.Msg.alert(acs_lang_text.alert||"Alert",acs_lang_text.enter_new_name||"Please enter a new name.");
return false;
}
}
};
Ext.Msg.show({title:acs_lang_text.rename||"Rename",prompt:true,msg:acs_lang_text.enter_new_name||"Please enter a new name for ... ",value:_d8.get("title"),buttons:Ext.Msg.OKCANCEL,fn:_e4.createDelegate(this)});
var _e9=YAHOO.util.Dom.getElementsByClassName("ext-mb-input","input");
_e9[0].select();
}
},tagFsitem:function(_ea,i,e){
var _ed=_ea;
var _ee=_ed.store.getAt(i);
var _ef=_ee.get("id");
var _f0=_ee.get("tags");
var _f1=this.config.package_id;
var _f2=this.layout.findById("tagcloudpanel");
var _f3=this.xmlhttpurl;
var _f4=this.tagWindow;
var _f5=function(){
Ext.Ajax.request({url:this.xmlhttpurl+"add-tag",success:function(){
_ee.data.tags=Ext.get("fstags").getValue();
_ee.commit();
_f2.load({url:_f3+"get-tagcloud",params:{package_id:_f1}});
_f4.hide();
},failure:function(_f6){
Ext.Msg.alert(acs_lang_text.error||"Error","Sorry, we encountered an error.");
},params:{object_id:_ee.id,package_id:_f1,tags:Ext.get("fstags").getValue()}});
};
if(_f4==null){
var _f7=new Ext.Panel({id:"form_addtag",autoScroll:true,frame:true,html:"<div style='text-align:left' class='yui-skin-sam'><p>Enter or edit one or more tags. Use commas (,) to separate the tags:<br ><br><div class='yui-ac'><input type='text' name='fstags' id='fstags' size='60' autocomplete='off' value='"+_f0+"'><div id='oAutoCompContainer1' class='yui-ac-container'></div></div>"});
var _f8=[{text:"Ok",icon:"/resources/ajaxhelper/icons/disk.png",cls:"x-btn-text-icon",handler:_f5.createDelegate(this)},{text:"Cancel",icon:"/resources/ajaxhelper/icons/cross.png",cls:"x-btn-text-icon",handler:function(){
_f4.hide();
}.createDelegate(this)}];
_f4=new Ext.Window({id:"tag-win",layout:"fit",width:450,height:300,title:"Tags",closeAction:"hide",modal:true,plain:true,autoScroll:false,resizable:false,items:_f7,buttons:_f8});
}
_f4.show();
this.initTagAutoComplete();
},initTagAutoComplete:function(){
var _f9=new YAHOO.widget.DS_JSArray(oAutoCompArr);
if(document.getElementById("fstags")){
var _fa=new YAHOO.widget.AutoComplete("fstags","oAutoCompContainer1",_f9);
_fa.animHoriz=false;
_fa.animVert=false;
_fa.queryDelay=0;
_fa.maxResultsDisplayed=10;
_fa.useIFrame=true;
_fa.delimChar=",";
_fa.allowBrowserAutocomplete=false;
_fa.typeAhead=true;
_fa.formatResult=function(_fb,_fc){
var _fd=_fb[0];
return _fd;
};
}
},downloadArchive:function(_fe){
if(_fe){
top.location.href=this.config.package_url+"download-archive/?object_id="+_fe;
}
},showShareOptions:function(_ff,i,e){
var _102=_ff;
var node=_102.store.getAt(i);
var _104=node.get("id");
var _105=node.get("title");
var _106=this.layout.findById("treepanel");
var _107=this.config.package_id;
var _108=this.xmlhttpurl;
var _109=this.sharefolderWindow;
var _10a=function(){
var _10b=_106.getSelectionModel().getSelectedNode();
_10b.loaded=false;
_10b.collapse();
_10b.fireEvent("click",_10b);
_10b.expand();
_109.hide();
};
var _10c=function(){
var _10d=this.communityCombo.getValue();
Ext.Ajax.request({url:this.xmlhttpurl+"share-folder",success:_10a,failure:function(_10e){
Ext.Msg.alert("Error","Sorry, we encountered an error. Please try again later.");
},params:{target_folder_id:_10d,folder_id:_104}});
};
if(_109==null){
var _10f=new Ext.data.JsonStore({url:_108+"list-communities",root:"communities",fields:["target_folder_id","instance_name"]});
this.communityCombo=new Ext.form.ComboBox({id:"communities_list",store:_10f,displayField:"instance_name",typeAhead:true,fieldLabel:"Community",triggerAction:"all",emptyText:"Select a community",hiddenName:"target_folder_id",valueField:"target_folder_id",forceSelection:true,handleHeight:80,selectOnFocus:true});
var _110=new Ext.form.FormPanel({id:"sharefolderform",title:"Select the community where you wish to share the <b>"+_105+"</b> folder with.",frame:true,items:this.communityCombo});
var _111=[{text:"Ok",icon:"/resources/ajaxhelper/icons/disk.png",cls:"x-btn-text-icon",handler:_10c.createDelegate(this)},{text:"Cancel",icon:"/resources/ajaxhelper/icons/cross.png",cls:"x-btn-text-icon",handler:function(){
_109.hide();
}.createDelegate(this)}];
_109=new Ext.Window({id:"share-win",layout:"fit",width:380,height:200,title:"Share Folder",closeAction:"hide",modal:true,plain:true,autoScroll:false,resizable:false,items:_110,buttons:_111});
this.sharefolderWindow=_109;
}else{
this.sharefolderWindow.findById("sharefolderform").setTitle("Select the community where you wish to share the <b>"+_105+"</b> folder with.");
this.communityCombo.reset();
}
_109.show();
},redirectViews:function(_112,i,e){
if(_112.id=="filepanel"){
var _115=_112;
var node=_115.store.getAt(i);
var _117=node.get("id");
}else{
var _117=i;
}
window.open(window.location.protocol+"//"+window.location.hostname+"/o/"+_117+"/info");
window.focus();
},redirectPerms:function(_118,i,e){
if(_118.id=="filepanel"){
var _11b=_118;
var node=_11b.store.getAt(i);
var _11d=node.get("id");
}else{
var _11d=i;
}
var _11e=window.open(window.location.protocol+"//"+window.location.hostname+":"+window.location.port+this.config.package_url+"permissions?object_id="+_11d+"&return_url="+window.location.pathname+"?package_id="+this.config.package_id+"&folder_id="+this.currentfolder);
_11e.focus();
},redirectNotifs:function(_11f,i,e){
if(_11f.id=="filepanel"){
var _122=_11f;
var node=_122.store.getAt(i);
var _124=node.get("id");
var _125=node.get("title");
}else{
var _126=_11f;
var node=_126.getSelectionModel().getSelectedNode();
var _124=node.attributes["id"];
var _125=node.text;
}
window.location.href=this.xmlhttpurl+"notif-toggle?pretty_name="+_125+"&object_id="+_124+"&return_url="+this.config.package_url+"?folder_id="+this.currentfolder;
},redirectProperties:function(grid,i,e){
var _12a=grid;
var node=_12a.store.getAt(i);
var _12c=node.get("id");
var _12d=window.open(window.location.protocol+"//"+window.location.hostname+":"+window.location.port+this.config.package_url+"file?file_id="+_12c);
_12d.focus();
},showRevisions:function(grid,i,e){
var _131=grid;
var node=_131.store.getAt(i);
_131.getSelectionModel().selectRow(i);
var _133=node.get("id");
var _134=node.get("filename");
var _135=this.revisionsWindow;
if(_135==null){
_135=new Ext.Window({id:"rev-win",layout:"fit",width:550,height:300,closeAction:"hide",modal:true,plain:true,items:new Ext.TabPanel({id:"rev-tabs",items:[this.createRevGrid(),this.newRevForm()]})});
this.revisionsWindow=_135;
}
_135.setTitle(_134+" - "+acs_lang_text.properties||"Properties");
var _136=_135.findById("revisionspanel");
var _137=_135.findById("rev-tabs");
var _138=_135.findById("rev-form");
var _139=this.config.package_id;
_136.store.on("load",function(){
this.getSelectionModel().selectFirstRow();
},_136);
_136.on("activate",function(){
this.store.baseParams["file_id"]=_133;
this.store.baseParams["package_id"]=_139;
this.store.load();
},_136);
_135.on("beforehide",function(){
this.activate(1);
},_137);
_135.on("show",function(){
this.activate(0);
},_137);
_135.show();
},createRevGrid:function(){
var cols=[{header:"",width:30,sortable:false,dataIndex:"icon"},{header:"Title",width:180,sortable:false,dataIndex:"title"},{header:"Author",sortable:false,dataIndex:"author"},{header:"Size",sortable:false,dataIndex:"size"},{header:"Last Modified",sortable:false,dataIndex:"lastmodified"}];
var _13b=new Ext.data.JsonReader({totalProperty:"total",root:"revisions",id:"revision_id"},[{name:"revision_id",type:"int"},{name:"icon"},{name:"title"},{name:"author"},{name:"type"},{name:"size"},{name:"url"},{name:"lastmodified"}]);
var _13c=new Ext.data.HttpProxy({url:this.xmlhttpurl+"get-filerevisions"});
var _13d=new Ext.grid.ColumnModel(cols);
var _13e=new Ext.data.Store({proxy:_13c,reader:_13b});
var _13f=[{text:"Download",tooltip:"Download this revision",icon:"/resources/ajaxhelper/icons/arrow_down.png",cls:"x-btn-text-icon",handler:function(){
var grid=this.revisionsWindow.findById("revisionspanel");
var _141=grid.getSelectionModel().getSelected();
window.open(_141.get("url"));
window.focus();
}.createDelegate(this)},{text:"Delete",tooltip:"Delete this revision",icon:"/resources/ajaxhelper/icons/delete.png",cls:"x-btn-text-icon",handler:function(){
var grid=this.revisionsWindow.findById("revisionspanel");
var sm=grid.getSelectionModel();
var _144=sm.getSelected();
var _145=_144.get("revision_id");
var _146=_144.get("title");
var _147=this.xmlhttpurl;
if(grid.store.getCount()==1){
Ext.Msg.alert("Warning","Sorry, you can not delete the only revision for this file. You can delete the file instead");
}else{
Ext.Msg.confirm("Delete","Are you sure you want to delete this version of "+_146+" ? This action can not be reversed.",function(btn){
if(btn=="yes"){
Ext.Ajax.request({url:_147+"delete-fileversion",params:{version_id:_145},success:function(o){
sm.selectPrevious();
grid.store.remove(_144);
},failure:function(){
Ext.Msg.alert("Delete Error","Sorry an error occurred. Please try again later.");
}});
}
});
}
}.createDelegate(this)}];
var _14a=new Ext.grid.GridPanel({store:_13e,cm:_13d,sm:new Ext.grid.RowSelectionModel({singleSelect:true}),id:"revisionspanel",title:"Revisions",loadMask:true,tbar:_13f});
return _14a;
},newRevForm:function(){
var msg1="Please choose a file to upload";
var _14c=new Ext.Panel({id:"rev-form",align:"left",frame:true,title:"New Revision",html:"<form id=\"newrevfileform\" name=\"newrevfileform\" method=\"post\" enctype=\"multipart/form-data\"><input type=\"hidden\" name=\"package_id\" value=\""+this.config.package_id+"\"><input type=\"hidden\" name=\"file_id\" id=\"rev_file_id\" value=\"\"><input type=\"hidden\" name=\"title\" id=\"rev_file_title\" value=\"\"><p>"+msg1+"<br /><br /><input type=\"file\" name=\"upload_file\" size='35' id=\"rev_upload_file\"></p></form>",buttons:[{text:"Upload New Revision",handler:function(_14d){
if(Ext.get("rev_upload_file").dom.value==""){
Ext.Msg.alert("Warning","Please choose a file to upload");
}else{
var grid=this.layout.findById("filepanel");
var _14f=grid.getSelectionModel().getSelected();
Ext.get("rev_file_id").dom.value=_14f.get("id");
Ext.get("rev_file_title").dom.value=_14f.get("title");
var _150={success:function(){
},upload:function(){
this.revisionsWindow.findById("rev-tabs").activate(0);
Ext.get("newrevfileform").dom.reset();
this.revisionsWindow.findById("rev-form").body.unmask();
_14d.enable();
},failure:function(){
Ext.Msg.alert(acs_lang_text.error||"Error",acs_lang_text.upload_failed||"Upload failed, please try again later.");
this.revisionsWindow.findById("rev-form").body.unmask();
_14d.enable();
},scope:this};
this.revisionsWindow.findById("rev-form").body.mask("<center><img src='/resources/ajaxhelper/images/indicator.gif'><br>Uploading new revision. Please wait</center>");
_14d.disable();
YAHOO.util.Connect.setForm("newrevfileform",true,true);
var cObj=YAHOO.util.Connect.asyncRequest("POST",this.xmlhttpurl+"add-filerevision",_150);
}
}.createDelegate(this),icon:"/resources/ajaxhelper/icons/arrow_up.png",cls:"x-btn-text-icon"}]});
return _14c;
},copyLink:function(_152,i,e){
if(_152.id=="treepanel"){
var _155=window.location.protocol+"//"+window.location.hostname+":"+window.location.port+this.config.package_url+"?package_id="+this.config.package_id+"&folder_id="+i;
}else{
var _156=_152;
var node=_156.store.getAt(i);
var _158=node.get("type");
if(_158==="folder"){
var _155=window.location.protocol+"//"+window.location.hostname+":"+window.location.port+this.config.package_url+"?package_id="+this.config.package_id+"&folder_id="+node.get("id");
}else{
if(_158==="url"){
var _155=node.get("url");
}else{
var _155=window.location.protocol+"//"+window.location.hostname+node.get("url");
}
}
}
if(Ext.isIE){
window.clipboardData.setData("text",_155);
}else{
var _159=Ext.Msg.show({title:acs_lang_text.linkaddress||"Copy Link Address",prompt:true,msg:acs_lang_text.copyhighlighted||"Copy the highlighted text to your clipboard.",value:_155,buttons:Ext.Msg.OK});
var _15a=YAHOO.util.Dom.getElementsByClassName("ext-mb-input","input");
_15a[0].select();
}
}};
function readCookie(name){
var ca=document.cookie.split(";");
var _15d=name+"=";
for(var i=0;i<ca.length;i++){
var c=ca[i];
while(c.charAt(0)==" "){
c=c.substring(1,c.length);
}
if(c.indexOf(_15d)==0){
return c.substring(_15d.length,c.length);
}
}
return null;
}
function createCookie(name,_161,days){
if(days){
var date=new Date();
date.setTime(date.getTime()+(days*24*60*60*1000));
var _164="; expires="+date.toGMTString();
}else{
var _164="";
}
document.cookie=name+"="+_161+_164+"; path=/";
}
function readQs(q){
var _166=window.location.search.substring(1);
var _167=_166.split("&");
for(var i=0;i<_167.length;i++){
var pos=_167[i].indexOf("=");
if(pos>0){
var key=_167[i].substring(0,pos);
var val=_167[i].substring(pos+1);
if(key==q){
return val;
}
}
}
return null;
}
function checkFlashVersion(){
var x;
var _16d;
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
function isURL(_16e){
if(_16e.indexOf(" ")!=-1){
return false;
}else{
if(_16e.indexOf("http://")==-1){
return false;
}else{
if(_16e=="http://"){
return false;
}else{
if(_16e.indexOf("http://")>0){
return false;
}
}
}
}
_16e=_16e.substring(7,_16e.length);
if(_16e.indexOf(".")==-1){
return false;
}else{
if(_16e.indexOf(".")==0){
return false;
}else{
if(_16e.charAt(_16e.length-1)=="."){
return false;
}
}
}
if(_16e.indexOf("/")!=-1){
_16e=_16e.substring(0,_16e.indexOf("/"));
if(_16e.charAt(_16e.length-1)=="."){
return false;
}
}
if(_16e.indexOf(":")!=-1){
if(_16e.indexOf(":")==(_16e.length-1)){
return false;
}else{
if(_16e.charAt(_16e.indexOf(":")+1)=="."){
return false;
}
}
_16e=_16e.substring(0,_16e.indexOf(":"));
if(_16e.charAt(_16e.length-1)=="."){
return false;
}
}
return true;
}
function FileProgress(_16f,_170){
this.file_progress_id=_16f.id;
this.opacity=100;
this.height=0;
this.fileProgressWrapper=document.getElementById(this.file_progress_id);
if(!this.fileProgressWrapper){
this.fileProgressWrapper=document.createElement("div");
this.fileProgressWrapper.className="progressWrapper";
this.fileProgressWrapper.id=this.file_progress_id;
this.fileProgressElement=document.createElement("div");
this.fileProgressElement.className="progressContainer";
var _171=document.createElement("a");
_171.className="progressCancel";
_171.href="#";
_171.style.visibility="hidden";
_171.appendChild(document.createTextNode(" "));
var _172=document.createElement("div");
_172.className="progressName";
_172.appendChild(document.createTextNode(_16f.name));
var _173=document.createElement("div");
_173.className="progressBarInProgress";
var _174=document.createElement("div");
_174.className="progressBarStatus";
_174.innerHTML="&nbsp;";
this.fileProgressElement.appendChild(_171);
this.fileProgressElement.appendChild(_172);
this.fileProgressElement.appendChild(_174);
this.fileProgressElement.appendChild(_173);
this.fileProgressWrapper.appendChild(this.fileProgressElement);
document.getElementById(_170).appendChild(this.fileProgressWrapper);
}else{
this.fileProgressElement=this.fileProgressWrapper.firstChild;
}
this.height=this.fileProgressWrapper.offsetHeight;
}
FileProgress.prototype.SetProgress=function(_175){
this.fileProgressElement.className="progressContainer green";
this.fileProgressElement.childNodes[3].className="progressBarInProgress";
this.fileProgressElement.childNodes[3].style.width=_175+"%";
};
FileProgress.prototype.SetComplete=function(){
this.fileProgressElement.className="progressContainer blue";
this.fileProgressElement.childNodes[3].className="progressBarComplete";
this.fileProgressElement.childNodes[3].style.width="";
var _176=this;
setTimeout(function(){
_176.Disappear();
},10000);
};
FileProgress.prototype.SetError=function(){
this.fileProgressElement.className="progressContainer red";
this.fileProgressElement.childNodes[3].className="progressBarError";
this.fileProgressElement.childNodes[3].style.width="";
var _177=this;
setTimeout(function(){
_177.Disappear();
},5000);
};
FileProgress.prototype.SetCancelled=function(){
this.fileProgressElement.className="progressContainer";
this.fileProgressElement.childNodes[3].className="progressBarError";
this.fileProgressElement.childNodes[3].style.width="";
var _178=this;
setTimeout(function(){
_178.Disappear();
},2000);
};
FileProgress.prototype.SetStatus=function(_179){
this.fileProgressElement.childNodes[2].innerHTML=_179;
};
FileProgress.prototype.ToggleCancel=function(show,_17b){
this.fileProgressElement.childNodes[0].style.visibility=show?"visible":"hidden";
if(_17b){
var _17c=this.file_progress_id;
this.fileProgressElement.childNodes[0].onclick=function(){
_17b.cancelUpload(_17c);
return false;
};
}
};
FileProgress.prototype.Disappear=function(){
var _17d=15;
var _17e=4;
var rate=30;
if(this.opacity>0){
this.opacity-=_17d;
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
this.height-=_17e;
if(this.height<0){
this.height=0;
}
this.fileProgressWrapper.style.height=this.height+"px";
}
if(this.height>0||this.opacity>0){
var _180=this;
setTimeout(function(){
_180.Disappear();
},rate);
}else{
this.fileProgressWrapper.style.display="none";
}
};

