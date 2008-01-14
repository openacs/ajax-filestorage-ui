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
},createToolsMenu:function(){
var _10=new Ext.menu.Menu({id:"toolsmenu",items:[new Ext.menu.Item({id:"mnOpen",text:"Open",icon:"/resources/ajaxhelper/icons/page_white.png"}),new Ext.menu.Item({id:"mnTag",text:"Tag",icon:"/resources/ajaxhelper/icons/tag_blue.png"}),new Ext.menu.Item({id:"mnView",text:"Views",icon:"/resources/ajaxhelper/icons/camera.png"}),new Ext.menu.Item({id:"mnRename",text:acs_lang_text.rename||"Rename",icon:"/resources/ajaxhelper/icons/page_edit.png"}),new Ext.menu.Item({id:"mnCopyLink",text:acs_lang_text.linkaddress||"Copy Link Address",icon:"/resources/ajaxhelper/icons/page_copy.png"}),new Ext.menu.Item({id:"mnPerms",text:acs_lang_text.permissions||"Permissions",icon:"/resources/ajaxhelper/icons/group_key.png"}),new Ext.menu.Item({id:"mnProp",text:acs_lang_text.properties||"Properties",icon:"/resources/ajaxhelper/icons/page_edit.png"}),new Ext.menu.Item({id:"mnArch",text:acs_lang_text.download_archive||"Download archive",icon:"/resources/ajaxhelper/icons/arrow_down.png"}),new Ext.menu.Item({id:"mnShare",text:acs_lang_text.sharefolder||"Share Folder",icon:"/resources/ajaxhelper/icons/group_link.png"})]});
_10.on("beforeshow",function(){
var _11=this.layout.findById("filepanel");
if(_11.getSelectionModel().getCount()==1){
var _12=_11.getSelectionModel().getSelections();
for(var x=0;x<_10.items.items.length;x++){
_10.items.items[x].enable();
}
switch(_12[0].get("type")){
case "folder":
_10.items.items[0].setText("Open");
_10.items.items[1].disable();
_10.items.items[6].disable();
break;
case "symlink":
_10.items.items[0].setText("Open");
_10.items.items[1].disable();
_10.items.items[3].disable();
_10.items.items[6].disable();
break;
case "url":
_10.items.items[0].setText("Open");
_10.items.items[6].disable();
_10.items.items[7].disable();
_10.items.items[8].disable();
break;
default:
_10.items.items[0].setText("Download");
_10.items.items[7].disable();
_10.items.items[8].disable();
break;
}
if(!this.share_folders_p){
_10.items.items[8].disable();
}
}else{
for(var x=0;x<_10.items.items.length;x++){
_10.items.items[x].disable();
}
}
},this);
_10.on("itemclick",function(_14,e){
var _16=this.layout.findById("filepanel");
var _17=_16.getSelectionModel().getSelected();
var _18=_17.get("id");
for(var x=0;x<_16.store.data.items.length;x++){
if(_16.store.data.items[x].id==_18){
var i=x;
break;
}
}
switch(_14.getId()){
case "mnOpen":
this.openItem(_16,i);
break;
case "mnTag":
this.tagFsitem(_16,i);
break;
case "mnView":
this.redirectViews(_16,i);
break;
case "mnRename":
this.renameItem(_16,i);
break;
case "mnCopyLink":
this.copyLink(_16,i);
break;
case "mnPerms":
this.redirectPerms(_16,i);
break;
case "mnProp":
this.showRevisions(_16,i);
break;
case "mnArch":
this.downloadArchive(_18);
break;
case "mnShare":
this.showShareOptions(_16,i);
break;
}
},this);
var _1b={text:"Tools",iconCls:"toolsmenu",menu:_10};
return _1b;
},createToolbar:function(){
var _1c=this.config.treerootnode;
var _1d=[];
if(_1c.attributes["write_p"]=="t"){
var _1d=[" ",{text:acs_lang_text.newfolder||"New Folder",tooltip:acs_lang_text.newfolder||"New Folder",icon:"/resources/ajaxhelper/icons/folder_add.png",cls:"x-btn-text-icon",handler:this.addFolder.createDelegate(this)},{text:acs_lang_text.uploadfile||"Upload Files",tooltip:acs_lang_text.uploadfile||"Upload Files",icon:"/resources/ajaxhelper/icons/page_add.png",cls:"x-btn-text-icon",handler:this.addFile.createDelegate(this)}];
if(this.create_url_p){
_1d.push({text:acs_lang_text.createurl||"Create Url",tooltip:acs_lang_text.createurl||"Create Url",icon:"/resources/ajaxhelper/icons/page_link.png",cls:"x-btn-text-icon",handler:this.addUrl.createDelegate(this)});
}
_1d.push({text:acs_lang_text.deletefs||"Delete",tooltip:acs_lang_text.deletefs||"Delete",icon:"/resources/ajaxhelper/icons/delete.png",cls:"x-btn-text-icon",handler:this.delItem.createDelegate(this)});
_1d.push(this.createToolsMenu());
_1d.push("->");
}
_1d.push({tooltip:"This may take a few minutes if you have a lot of files",text:acs_lang_text.download_archive||"Download Archive",icon:"/resources/ajaxhelper/icons/arrow_down.png",cls:"x-btn-text-icon",handler:this.downloadArchive.createDelegate(this,[_1c.id],false)});
return _1d;
},createLeft:function(){
var _1e=new Ext.Panel({id:"leftpanel",region:"west",collapsible:true,titlebar:true,title:" ",layout:"accordion",split:true,width:300,items:[this.createTreePanel(),this.createTagPanel()]});
return _1e;
},createTreePanel:function(){
var _1f=new Ext.tree.AsyncTreeNode({text:this.config.treerootnode.text,draggable:false,id:this.config.treerootnode.id,singeClickExpand:true,expanded:true,attributes:this.config.treerootnode.attributes});
var _20=new Ext.tree.TreeLoader({dataUrl:this.xmlhttpurl+"load-treenodes",baseParams:{package_id:this.config.package_id}});
var _21=new Ext.tree.TreePanel({id:"treepanel",title:"Folders",autoScroll:true,animate:true,enableDrag:false,enableDrop:true,loadMask:true,loader:_20,root:_1f,ddAppendOnly:true,containerScroll:true,dropConfig:{dropAllowed:true,ddGroup:"fileDD",onNodeOver:function(_22,_23,e,_25){
if(_22.node.id==_22.node.ownerTree.getSelectionModel().getSelectedNode().id){
return false;
}
if(_23.dragData.selections){
for(var x=0;x<_23.dragData.selections.length;x++){
if(_22.node.id==_23.dragData.selections[x].data.id){
return false;
}
}
}
return true;
},onNodeDrop:function(_27,_28,e,_2a){
var _2b=this.layout.findById("filepanel");
var _2c=_27.node.id;
var _2d=[];
for(var x=0;x<_2a.selections.length;x++){
_2d[x]=_2a.selections[x].data.id;
}
var _2f=acs_lang_text.an_error_occurred||"An error occurred";
var _30=acs_lang_text.reverted||"Your changes have been reverted";
var _31=function(_32){
var _33=Ext.decode(_32.responseText);
if(_33.success){
var dm=_2b.store;
var _35=_2b.getSelectionModel().getSelections();
var _36=false;
for(var x=0;x<_35.length;x++){
dm.remove(_35[x]);
if(_35[x].data.type=="folder"){
_36=true;
if(_27.node.ownerTree.getNodeById(_35[x].data.id)){
var _38=_27.node.ownerTree.getNodeById(_35[x].data.id).parentNode;
_38.loaded=false;
_38.removeChild(_27.node.ownerTree.getNodeById(_35[x].data.id));
}
}
}
if(_36){
var _39=_27.node.ownerTree.getRootNode();
if(_39.id==_27.node.id){
_39.fireEvent("click",_39);
}
_27.node.loaded=false;
_27.node.expand();
}
}else{
Ext.Msg.alert(acs_lang_text.error||"Error",_2f+"<br>"+_30);
}
};
Ext.Ajax.request({url:this.xmlhttpurl+"move-fsitem",success:_31,failure:function(){
var _3a=Ext.decode(response.responseText);
var msg="";
if(_3a.error){
msg=_3a.error;
}
Ext.Msg.alert(acs_lang_text.error||"Error",_2f+"<br>"+msg+"<br>"+_30);
},params:{folder_target_id:_2c,file_ids:_2d}});
return true;
}.createDelegate(this)}});
this.enableTreeFolderRename(_21);
_1f.on("expand",this.selectInitFolder,this,{single:true});
_21.on("click",this.loadFoldercontents,this);
return _21;
},enableTreeFolderRename:function(_3c){
this.te=new Ext.tree.TreeEditor(_3c,{allowBlank:false,blankText:acs_lang_text.folder_name_required||"A folder name is required",ignoreNoChange:true});
this.te.on("beforestartedit",function(_3d,el,_3f){
if(_3d.editNode.attributes.attributes.write_p=="t"){
return true;
}else{
Ext.Msg.alert(acs_lang_text.permission_denied||"Permission Denied",acs_lang_text.permission_denied||"Sorry, you do not have permission to rename this folder");
return false;
}
},this,true);
this.te.on("beforecomplete",function(_40,_41,_42){
var _43=_40.editNode.parentNode;
if(_43){
var _44=_43.childNodes;
for(x=0;x<_44.length;x++){
if(_44[x].text==_41&&_44[x].id!=_40.editNode.id){
Ext.Msg.alert(acs_lang_text.duplicate_name||"Duplicate Name",acs_lang_text.duplicate_name_error||"Please enter a different name. The name you entered is already being used.");
return false;
}
}
}
return true;
},this,true);
this.te.on("complete",function(_45,_46,_47){
var _48=acs_lang_text.an_error_occurred||"An error occurred";
var _49=acs_lang_text.reverted||"Your changes have been reverted";
Ext.Ajax.request({url:this.xmlhttpurl+"rename-fsitem",success:function(_4a){
var _4b=Ext.decode(_4a.responseText);
if(!_4b.success){
Ext.Msg.alert(acs_lang_text.error||"Error",_48+": <br><br><font color='red'>"+_4b.error+"</font><br><br>"+_49);
_45.editNode.setText(_47);
}
},failure:function(){
Ext.Msg.alert(acs_lang_text.error||"Error",_48+"<br>"+_49);
_45.editNode.setText(_47);
},params:{newname:_46,object_id:_45.editNode.id,type:"folder"}});
},this,true);
},createTagPanel:function(){
var _4c=new Ext.Panel({id:"tagcloudpanel",title:"Tags",frame:false,loadMask:true,autoScroll:true,autoLoad:{url:this.xmlhttpurl+"get-tagcloud",params:{package_id:this.config.package_id}}});
var _4d=function(){
var _4e=this;
var _4f=_4e.currenttag;
_4c.body.on("click",function(obj,el){
if(el.tagName=="A"){
if(_4f!=null){
Ext.get(_4f).setStyle("font-weight","normal");
}
Ext.get(el).setStyle("font-weight","bold");
_4f=el.id;
this.loadTaggedFiles(el.id);
}
},this);
};
_4c.on("render",_4d,this);
return _4c;
},loadTaggedFiles:function(_52){
this.layout.findById("treepanel").getSelectionModel().clearSelections();
var id=_52.substring(3,_52.length);
this.layout.findById("filepanel").store.baseParams["tag_id"]=id;
this.layout.findById("filepanel").store.load();
this.layout.findById("filepanel").store.baseParams["tag_id"]="";
},createRight:function(){
var _54=function(_55,p,_57){
p.attr="ext:qtip='"+_57.get("qtip")+"'";
return _55;
};
var _58=[{header:"",width:30,sortable:true,dataIndex:"icon"},{header:acs_lang_text.filename||"Filename",id:"filename",sortable:true,dataIndex:"title",renderer:_54},{header:acs_lang_text.size||"Size",sortable:true,dataIndex:"size"},{header:acs_lang_text.lastmodified||"Last Modified",sortable:true,dataIndex:"lastmodified"}];
var _59=new Ext.data.JsonReader({totalProperty:"total",root:"foldercontents",id:"id"},[{name:"id",type:"int"},{name:"qtip"},{name:"icon"},{name:"title"},{name:"filename"},{name:"type"},{name:"tags"},{name:"url"},{name:"linkurl"},{name:"write_p"},{name:"symlink_id"},{name:"size"},{name:"lastmodified"}]);
var _5a=new Ext.data.HttpProxy({url:this.xmlhttpurl+"get-foldercontents"});
var _5b=new Ext.grid.ColumnModel(_58);
var _5c=new Ext.data.Store({proxy:_5a,reader:_59,remoteSort:true});
var _5d=new Ext.grid.GridPanel({store:_5c,cm:_5b,id:"filepanel",ddGroup:"fileDD",region:"center",split:true,autoScroll:true,autoExpandColumn:"filename",collapsible:true,enableDragDrop:true,width:250,loadMask:true,frame:false,viewConfig:{forceFit:false,enableRowBody:true,showPreview:true,getRowClass:function(_5e,_5f,p,ds){
var xf=Ext.util.Format;
if(_5e.data.tags!=""){
p.body="<div id='tagscontainer"+_5e.data.id+"' style='padding-left:35px;color:blue'>Tags: "+xf.ellipsis(xf.stripTags(_5e.data.tags),200)+"</div>";
}else{
p.body="<div id='tagscontainer"+_5e.data.id+"' style='padding-left:35px;color:blue'></div>";
}
return "x-grid3-row-expanded";
}}});
_5d.on("rowdblclick",this.openItem,this,true);
_5d.on("rowcontextmenu",this.showRowContext,this,true);
return _5d;
},showRowContext:function(_63,i,e){
e.stopEvent();
var _66=this.layout.findById("treepanel");
var _67=this.config.treerootnode;
var dm=_63.store;
var _69=dm.getAt(i);
var _6a=_69.get("type");
var _6b=_69.get("id");
var _6c;
switch(_6a){
case "folder":
_6c="Open";
break;
case "url":
_6c="Open";
break;
default:
_6c="Download";
break;
}
this.contextmenu=new Ext.menu.Menu({id:"rightclickmenu",items:[new Ext.menu.Item({text:_6c,icon:"/resources/ajaxhelper/icons/page_white.png",handler:this.openItem.createDelegate(this,[_63,i,e],false)}),new Ext.menu.Item({text:"Tag",icon:"/resources/ajaxhelper/icons/tag_blue.png",handler:this.tagFsitem.createDelegate(this,[_63,i,e],false)}),new Ext.menu.Item({text:"Views",icon:"/resources/ajaxhelper/icons/camera.png",handler:this.redirectViews.createDelegate(this,[_63,i,e],false)}),new Ext.menu.Item({text:acs_lang_text.deletefs||"Delete",icon:"/resources/ajaxhelper/icons/delete.png",handler:this.delItem.createDelegate(this,[_63,i,e],false)}),new Ext.menu.Item({text:acs_lang_text.rename||"Rename",icon:"/resources/ajaxhelper/icons/page_edit.png",handler:this.renameItem.createDelegate(this,[_63,i,e],false)}),new Ext.menu.Item({text:acs_lang_text.linkaddress||"Copy Link Address",icon:"/resources/ajaxhelper/icons/page_copy.png",handler:this.copyLink.createDelegate(this,[_63,i,e],false)}),new Ext.menu.Item({text:acs_lang_text.permissions||"Permissions",icon:"/resources/ajaxhelper/icons/group_key.png",handler:this.redirectPerms.createDelegate(this,[_63,i,e],false)}),new Ext.menu.Item({text:acs_lang_text.properties||"Properties",icon:"/resources/ajaxhelper/icons/page_edit.png",handler:this.showRevisions.createDelegate(this,[_63,i,e],false)}),new Ext.menu.Item({text:acs_lang_text.download_archive||"Download archive",icon:"/resources/ajaxhelper/icons/arrow_down.png",handler:this.downloadArchive.createDelegate(this,[_6b],false)}),new Ext.menu.Item({text:acs_lang_text.sharefolder||"Share Folder",icon:"/resources/ajaxhelper/icons/group_link.png",handler:this.showShareOptions.createDelegate(this,[_63,i,e],false)})]});
if(_63.getSelectionModel().getCount()>1){
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
switch(_6a){
case "folder":
this.contextmenu.items.items[1].hide();
this.contextmenu.items.items[7].hide();
this.contextmenu.items.items[8].show();
if(_66.getNodeById(_6b).attributes.attributes.type=="symlink"){
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
if(_67.attributes["write_p"]=="f"){
this.contextmenu.items.items[1].hide();
this.contextmenu.items.items[3].hide();
this.contextmenu.items.items[6].hide();
this.contextmenu.items.items[7].hide();
this.contextmenu.items.items[9].hide();
}
var _6d=e.getXY();
this.contextmenu.rowid=i;
this.contextmenu.showAt([_6d[0],_6d[1]]);
},loadFoldercontents:function(_6e,e){
this.currentfolder=_6e.id;
var _70=this.layout.findById("filepanel");
_70.store.baseParams["folder_id"]=_6e.id;
_70.store.baseParams["package_id"]=this.config.package_id;
if(_6e.loading){
_6e.on("expand",function(){
this.store.load();
},_70,{single:true});
}else{
_70.store.load();
}
},openItem:function(_71,i,e){
var _74=this.layout.findById("treepanel");
var dm=_71.store;
var _76=dm.getAt(i);
if(_76.get("type")=="folder"||_76.get("type")=="symlink"){
var _77=_74.getNodeById(_76.get("id"));
if(!_77.parentNode.isExpanded()){
_77.parentNode.expand();
}
_77.fireEvent("click",_77);
_77.expand();
}else{
window.open(_76.get("url"));
window.focus();
}
},delItem:function(_78,i,e){
var _7b=acs_lang_text.confirm_delete||"Are you sure you want to delete ";
var _7c=acs_lang_text.foldercontains||"This folder contains";
var _7d=this.layout.findById("treepanel");
if(_78.id=="filepanel"){
var _7e=_78;
if(_7e.getSelectionModel().getCount()<=1){
_7e.getSelectionModel().selectRow(i);
}
}else{
var _7e=this.layout.findById("filepanel");
}
var _7f=_7e.getSelectionModel().getSelections();
var _80=true;
if(_7f.length>0){
_80=false;
if(_7f.length==1){
var _81=_7f[0].get("title");
if(_7f[0].get("type")==="folder"){
var msg=_7c+" <b>"+_7f[0].get("size")+"</b>.<br>";
}else{
var msg="";
}
var msg=msg+_7b+" <b>"+_81+"</b> ?";
if(_7f[0].get("type")==="symlink"){
var _83=_7f[0].get("symlink_id");
}else{
var _83=_7f[0].get("id");
}
}else{
var msg=_7b+": <br><br>";
var _83=[];
for(var x=0;x<_7f.length;x++){
msg=msg+"<b>"+_7f[x].get("title")+"</b> ";
if(_7f[x].get("type")==="folder"){
msg=msg+"("+_7f[x].get("size")+")";
}
msg=msg+"<br>";
if(_7f[x].get("type")==="symlink"){
_83[x]=_7f[x].get("symlink_id");
}else{
_83[x]=_7f[x].get("id");
}
}
}
var _85={object_id:_83};
}else{
_80=true;
var _86=_7d.getSelectionModel().getSelectedNode();
var _83=_86.attributes["id"];
var _87=_86.attributes.attributes["type"];
var _88=_86.attributes.attributes["symlink_id"];
var _89=_7d.getRootNode();
if(_87=="symlink"){
var _85={object_id:_88};
}else{
var _85={object_id:_83};
}
if(_86.attributes["id"]==_89.attributes["id"]){
Ext.Msg.alert(acs_lang_text.alert||"Alert",acs_lang_text.cant_del_root||"The root folder can not be deleted.");
return;
}else{
var msg=_7c+" <b>"+_86.attributes.attributes["size"]+"</b>.<br>";
msg=msg+_7b+" <b>"+_86.attributes["text"]+"</b>?";
}
}
var _8a=function(_8b){
if(_8b==="yes"){
Ext.Ajax.request({url:this.xmlhttpurl+"delete-fsitem",success:function(_8c){
var _8d=Ext.decode(_8c.responseText);
if(_8d.success){
if(_80){
var _8e=_7d.getSelectionModel().getSelectedNode();
var _8f=_8e.parentNode;
_8f.fireEvent("click",_8f);
_8f.removeChild(_8e);
}else{
for(var x=0;x<_7f.length;x++){
_7e.store.remove(_7f[x]);
var _91=_7f[x].get("id");
var _8e=_7d.getNodeById(_91);
if(_8e){
_8e.parentNode.fireEvent("click",_8e.parentNode);
_8e.parentNode.removeChild(_8e);
}
}
}
}else{
Ext.Msg.alert(acs_lang_text.error||"Error","Sorry, we encountered an error.");
}
},failure:function(){
Ext.Msg.alert(acs_lang_text.error||"Error",error_msg_txt+"<br><br><font color='red'>"+resultObj.error+"</font>");
},params:_85});
}
};
Ext.MessageBox.confirm(acs_lang_text.confirm||"Confirm",msg,_8a,this);
},addFolder:function(){
var te=this.te;
var _93=this.layout.findById("treepanel");
var _94=_93.getSelectionModel().getSelectedNode();
_94.expand();
var _95=acs_lang_text.new_folder_error||"Sorry, there was an error trying to create your new folder.";
Ext.Ajax.request({url:this.xmlhttpurl+"add-blankfolder",success:function(_96){
var _97=Ext.decode(_96.responseText);
if(_97.success){
var _98=_94.appendChild(new Ext.tree.TreeNode({text:_97.pretty_folder_name,id:_97.id,iconCls:"folder",singleClickExpand:true,attributes:{write_p:"t"}}));
_93.getSelectionModel().select(_98);
_98.loaded=true;
_98.fireEvent("click",_98);
setTimeout(function(){
te.editNode=_98;
te.startEdit(_98.ui.textNode);
},10);
}else{
Ext.Msg.alert(acs_lang_text.error||"Error",_95+"<br><br><font color='red'>"+_97.error+"</font>");
}
},failure:function(_99){
var _9a=Ext.decode(_99.responseText);
Ext.Msg.alert(acs_lang_text.error||"Error",_95+"<br><br><font color='red'>"+_9a.error+"</font>");
},params:{folder_id:_94.attributes["id"]}});
},createSwfObj:function(){
var _9b=this;
var _9c=_9b.layout.findById("treepanel");
var _9d=_9b.currentfolder;
if(this.swfu==null){
var _9e=String(this.config.package_id);
var _9f=String(this.config.user_id);
var _a0=String(this.currentfolder);
var _a1=String(this.config.max_file_size);
var _a2=function(_a3,_a4){
try{
var _a5=Math.ceil((_a4/_a3.size)*100);
var _a6=new FileProgress(_a3,this.getSetting("progress_target"));
_a6.SetProgress(_a5);
_a6.SetStatus(acs_lang_text.uploading||"Uploading...");
}
catch(ex){
this.debugMessage(ex);
}
};
var _a7=function(_a8){
try{
var _a9=new FileProgress(_a8,this.getSetting("progress_target"));
_a9.SetCancelled();
_a9.SetStatus(acs_lang_text.uploadcancel||"Cancelled (This item will be removed shortly)");
_a9.ToggleCancel(false);
}
catch(ex){
this.debugMessage(ex);
}
};
var _aa=function(_ab){
try{
var _ac=new FileProgress(_ab,this.getSetting("progress_target"));
_ac.SetComplete();
_ac.SetStatus(acs_lang_text.complete||"Complete.");
_ac.ToggleCancel(false);
}
catch(ex){
this.debugMessage(ex);
}
};
var _ad=function(_ae){
var _af=_9c.getNodeById(_9b.currentfolder);
_af.fireEvent("click",_af);
};
var _b0=function(_b1,_b2,_b3){
try{
if(_b1==SWFUpload.ERROR_CODE_QUEUE_LIMIT_EXCEEDED){
Ext.Msg.alert(acs_lang_text.alert||"Alert","You have attempted to queue too many files.\n"+(_b3==0?"You have reached the upload limit.":"You may select "+(_b3>1?"up to "+_b3+" files.":"one file.")));
return;
}
var _b4=new FileProgress(_b2,this.getSetting("progress_target"));
_b4.SetError();
_b4.ToggleCancel(false);
switch(_b1){
case SWFUpload.ERROR_CODE_HTTP_ERROR:
_b4.SetStatus("Upload Error");
this.debugMessage("Error Code: HTTP Error, File name: "+file.name+", Message: "+_b3);
break;
case SWFUpload.ERROR_CODE_MISSING_UPLOAD_TARGET:
_b4.SetStatus("Configuration Error");
this.debugMessage("Error Code: No backend file, File name: "+file.name+", Message: "+_b3);
break;
case SWFUpload.ERROR_CODE_UPLOAD_FAILED:
_b4.SetStatus("Upload Failed.");
this.debugMessage("Error Code: Upload Failed, File name: "+file.name+", File size: "+file.size+", Message: "+_b3);
break;
case SWFUpload.ERROR_CODE_IO_ERROR:
_b4.SetStatus("Server (IO) Error");
this.debugMessage("Error Code: IO Error, File name: "+file.name+", Message: "+_b3);
break;
case SWFUpload.ERROR_CODE_SECURITY_ERROR:
_b4.SetStatus("Security Error");
this.debugMessage("Error Code: Security Error, File name: "+file.name+", Message: "+_b3);
break;
case SWFUpload.ERROR_CODE_FILE_EXCEEDS_SIZE_LIMIT:
_b4.SetStatus("File is too big.");
this.debugMessage("Error Code: File too big, File name: "+file.name+", File size: "+file.size+", Message: "+_b3);
break;
case SWFUpload.ERROR_CODE_ZERO_BYTE_FILE:
_b4.SetStatus("Cannot upload Zero Byte files.");
this.debugMessage("Error Code: Zero byte file, File name: "+file.name+", File size: "+file.size+", Message: "+_b3);
break;
case SWFUpload.ERROR_CODE_UPLOAD_LIMIT_EXCEEDED:
_b4.SetStatus("Upload limit exceeded.");
this.debugMessage("Error Code: Upload Limit Exceeded, File name: "+file.name+", File size: "+file.size+", Message: "+_b3);
break;
default:
_b4.SetStatus("Unhandled Error");
this.debugMessage("Error Code: "+_b1+", File name: "+file.name+", File size: "+file.size+", Message: "+_b3);
break;
}
}
catch(ex){
this.debugMessage(ex);
}
};
var _b5=function(_b6){
var _b7=acs_lang_text.for_upload_to||"for upload to";
var _b8=acs_lang_text.zip_extracted||"Zip File (Will be extracted after upload)";
try{
var _b9=_9b.currentfolder;
var _ba=_9c.getNodeById(_b9).text;
var _bb=new FileProgress(_b6,this.getSetting("progress_target"));
_bb.SetStatus(_b7+" <b>"+_ba+"</b><br>Title: <input type='text' onblur=\"fsInstance.swfu.removeFileParam('"+_b6.id+"','filetitle');fsInstance.swfu.addFileParam('"+_b6.id+"','filetitle',this.value)\">(optional)<br><input type='checkbox' id='zip"+_b6.id+"' onclick=\"if(document.getElementById('zip"+_b6.id+"').checked) { fsInstance.swfu.addFileParam('"+_b6.id+"','unpack_p','1') } else { fsInstance.swfu.removeFileParam('"+_b6.id+"','unpack_p') }\"> "+_b8);
_bb.ToggleCancel(true,this);
this.addFileParam(_b6.id,"folder_id",_b9);
}
catch(ex){
this.debugMessage(ex);
}
};
this.swfu=new SWFUpload({debug:false,upload_target_url:this.xmlhttpurl+"add-file-flash",upload_params:{user_id:_9f,package_id:_9e},file_types:"*.*",file_size_limit:_a1,file_queue_limit:0,file_upload_limit:10,begin_upload_on_queue:false,file_queued_handler:_b5,file_progress_handler:_a2,file_cancelled_handler:_a7,file_complete_handler:_aa,queue_complete_handler:_ad,error_handler:_b0,flash_url:"/resources/ajax-filestorage-ui/swfupload/swfupload.swf"});
}
},addFile:function(){
if(this.upldWindow==null){
if(!this.config.multi_file_upload||checkFlashVersion()<9||Ext.isLinux){
var _bc=acs_lang_text.file_to_upload||"File to upload";
var _bd=acs_lang_text.file_title||"Title";
var _be=acs_lang_text.file_description||"Description";
var _bf=acs_lang_text.multiple_files||"Multiple Files";
var _c0=acs_lang_text.multiple_files_msg||"This is a ZIPfile containing multiple files.";
var _c1=true;
var _c2="Upload a File";
var _c3=new Ext.Panel({id:"form_addfile",align:"left",frame:true,html:"<form id=\"newfileform\" method=\"post\" enctype=\"multipart/form-data\"><input type=\"hidden\" name=\"package_id\" value=\""+this.config.package_id+"\"><input type=\"hidden\" name=\"folder_id\" value=\""+this.currentfolder+"\"><p>"+_bc+"<br /><input type=\"file\" name=\"upload_file\" id=\"upload_file\"></p><br><p>"+_bd+"<br /><input type=\"text\" name=\"filetitle\" id=\"filetitle\"></p><br><p>"+_be+" :<br /><textarea name=\"filedescription\" id=\"filedescription\"></textarea></p><p>"+_bf+" :<br /><br /><input type=\"checkbox\" name=\"unpack_p\" value=\"t\" id=\"unpack_p\" /> "+_c0+"</p></form>"});
var _c4=[{text:"Upload",handler:this.uploadOneFile.createDelegate(this),icon:"/resources/ajaxhelper/icons/arrow_up.png",cls:"x-btn-text-icon"},{text:"Close",handler:function(){
this.upldWindow.hide();
}.createDelegate(this),icon:"/resources/ajaxhelper/icons/cross.png",cls:"x-btn-text-icon"}];
}else{
this.createSwfObj();
var _c5=acs_lang_text.upload_intro||"Click <b>Browse</b> to select a file to upload to the selected folder on the tree.";
var _c1=false;
var _c2="Upload Files";
var _c3=new Ext.Panel({id:"form_multi_addfile",autoScroll:true,frame:true,html:"<div id=\"upldMsg\">"+_c5+"<hr></div><div class=\"flash\" id=\"fsuploadprogress\"></div>"});
_c3.on("render",function(){
this.swfu.addSetting("progress_target","fsuploadprogress");
},this);
var _c4=[{text:"Browse",handler:this.swfu.browse.createDelegate(this.swfu),icon:"/resources/ajaxhelper/icons/page_add.png",cls:"x-btn-text-icon"},{text:"Upload",handler:this.swfu.startUpload.createDelegate(this.swfu,[null,this],false),icon:"/resources/ajaxhelper/icons/arrow_up.png",cls:"x-btn-text-icon"},{text:"Hide",handler:function(){
this.upldWindow.hide();
}.createDelegate(this),icon:"/resources/ajaxhelper/icons/cross.png",cls:"x-btn-text-icon"}];
}
this.upldWindow=new Ext.Window({id:"upload-win",layout:"fit",width:400,height:300,title:_c2,closeAction:"hide",modal:_c1,plain:true,resizable:false,items:_c3,buttons:_c4});
}
this.upldWindow.show();
},uploadOneFile:function(){
if(Ext.get("upload_file").getValue()!=""&&Ext.get("filetitle").getValue()!=""){
var _c6=this.layout.findById("treepanel");
var _c7={success:function(){
},upload:function(){
_c6.getSelectionModel().getSelectedNode().loaded=false;
_c6.getSelectionModel().getSelectedNode().fireEvent("click",_c6.getSelectionModel().getSelectedNode());
this.upldWindow.body.unmask();
this.upldWindow.hide();
},failure:function(){
Ext.Msg.alert(acs_lang_text.error||"Error",acs_lang_text.upload_failed||"Upload failed, please try again later.");
},scope:this};
var _c8=acs_lang_text.loading||"One moment. This may take a while depending on how large your upload is.";
this.upldWindow.body.mask("<img src='/resources/ajaxhelper/images/indicator.gif'><br>"+_c8);
YAHOO.util.Connect.setForm("newfileform",true,true);
var _c9=YAHOO.util.Connect.asyncRequest("POST",this.xmlhttpurl+"add-file",_c7);
}else{
Ext.Msg.alert(acs_lang_text.alert||"Alert",acs_lang_text.file_required||"<b>Title</b> and <b>File to upload</b> are required.");
}
},addUrl:function(){
if(this.createurlWindow==null){
this.createurlWindow=new Ext.Window({id:"createurl-win",layout:"fit",width:400,height:180,title:"Create URL",closeAction:"hide",modal:true,plain:true,resizable:false,items:new Ext.FormPanel({id:"form_create_url",align:"left",autoScroll:true,closable:true,layout:"form",defaults:{width:230},frame:true,buttonAlign:"left",items:[{xtype:"textfield",fieldLabel:"Title",allowBlank:false,name:"fstitle",tabIndex:1},{xtype:"textfield",fieldLabel:"URL",allowBlank:false,name:"fsurl",tabIndex:2,validator:isURL},{xtype:"textfield",fieldLabel:"Description",name:"fsdescription",tabIndex:3}]}),buttons:[{text:"Submit",handler:function(){
this.createurlWindow.findById("form_create_url").getForm().submit({url:this.xmlhttpurl+"add-url",waitMsg:"One moment ....",params:{package_id:this.config.package_id,folder_id:this.currentfolder},reset:true,scope:this,success:function(_ca,_cb){
if(_cb.result){
var _cc=this.layout.findById("treepanel");
_cc.getSelectionModel().getSelectedNode().fireEvent("click",_cc.getSelectionModel().getSelectedNode());
this.createurlWindow.hide();
}else{
Ext.MessageBox.alert("Error","Sorry an error occured.<br>"+_cb.result.error);
}
},failure:function(_cd,_ce){
if(_ce.result){
Ext.MessageBox.alert("Error",_ce.result.error);
}
}});
}.createDelegate(this),icon:"/resources/ajaxhelper/icons/disk.png",cls:"x-btn-text-icon"},{text:"Close",handler:function(){
this.createurlWindow.hide();
}.createDelegate(this),icon:"/resources/ajaxhelper/icons/cross.png",cls:"x-btn-text-icon"}]});
}
this.createurlWindow.show();
},renameItem:function(_cf,i,e){
var _d2=_cf;
var _d3=this.layout.findById("treepanel");
var _d4=_d2.store.getAt(i);
var _d5=_d4.get("url");
var _d6=_d4.get("type");
var _d7=_d4.get("id");
var _d8=_d4.get("filename");
var _d9=function(_da){
var _db=acs_lang_text.an_error_occurred||"An error occurred";
var _dc=acs_lang_text.reverted||"Your changes have been reverted";
var _dd=Ext.decode(_da.responseText);
if(!_dd.success){
Ext.Msg.alert(acs_lang_text.error||"Error",_db+": <br><br><font color='red'>"+_dd.error+"</font><br><br>"+_dc);
}else{
if(_d6=="folder"){
_d3.getNodeById(_d7).setText(_dd.newname);
}
if(_d6!="folder"&&_d8===" "){
_d8=_d4.get("title");
_d4.set("filename",_d8);
}
_d4.set("title",_dd.newname);
_d4.commit();
}
};
var _de=function(btn,_e0){
if(btn=="ok"){
if(_e0!=""){
if(_e0.length>100){
Ext.Msg.alert(acs_lang_text.alert||"Alert",acs_lang_text.limitto100||"Please limit your name to 100 characters or less.");
return false;
}else{
Ext.Ajax.request({url:this.xmlhttpurl+"edit-name",success:_d9,failure:function(_e1){
var _e2=Ext.decode(_e1.responseText);
Ext.Msg.alert(acs_lang_text.error||"Error",error_msg_txt+"<br><br><font color='red'>"+_e2.error+"</font>");
},params:{newname:_e0,object_id:_d7,type:_d6,url:_d5}});
}
}else{
Ext.Msg.alert(acs_lang_text.alert||"Alert",acs_lang_text.enter_new_name||"Please enter a new name.");
return false;
}
}
};
Ext.Msg.show({title:acs_lang_text.rename||"Rename",prompt:true,msg:acs_lang_text.enter_new_name||"Please enter a new name for ... ",value:_d4.get("title"),buttons:Ext.Msg.OKCANCEL,fn:_de.createDelegate(this)});
var _e3=YAHOO.util.Dom.getElementsByClassName("ext-mb-input","input");
_e3[0].select();
},tagFsitem:function(_e4,i,e){
var _e7=_e4;
var _e8=_e7.store.getAt(i);
var _e9=_e8.get("id");
var _ea=_e8.get("tags");
var _eb=this.config.package_id;
var _ec=this.layout.findById("tagcloudpanel");
var _ed=this.xmlhttpurl;
var _ee=this.tagWindow;
var _ef=function(){
Ext.Ajax.request({url:this.xmlhttpurl+"add-tag",success:function(){
_e8.data.tags=Ext.get("fstags").getValue();
_e8.commit();
_ec.load({url:_ed+"get-tagcloud",params:{package_id:_eb}});
_ee.hide();
},failure:function(_f0){
Ext.Msg.alert(acs_lang_text.error||"Error","Sorry, we encountered an error.");
},params:{object_id:_e8.id,package_id:_eb,tags:Ext.get("fstags").getValue()}});
};
if(_ee==null){
var _f1=new Ext.Panel({id:"form_addtag",autoScroll:true,frame:true,html:"<div style='text-align:left' class='yui-skin-sam'><p>Enter or edit one or more tags. Use commas (,) to separate the tags:<br ><br><div class='yui-ac'><input type='text' name='fstags' id='fstags' size='60' autocomplete='off' value='"+_ea+"'><div id='oAutoCompContainer1' class='yui-ac-container'></div></div>"});
var _f2=[{text:"Ok",icon:"/resources/ajaxhelper/icons/disk.png",cls:"x-btn-text-icon",handler:_ef.createDelegate(this)},{text:"Cancel",icon:"/resources/ajaxhelper/icons/cross.png",cls:"x-btn-text-icon",handler:function(){
_ee.hide();
}.createDelegate(this)}];
_ee=new Ext.Window({id:"tag-win",layout:"fit",width:450,height:300,title:"Tags",closeAction:"hide",modal:true,plain:true,autoScroll:false,resizable:false,items:_f1,buttons:_f2});
}
_ee.show();
this.initTagAutoComplete();
},initTagAutoComplete:function(){
var _f3=new YAHOO.widget.DS_JSArray(oAutoCompArr);
if(document.getElementById("fstags")){
var _f4=new YAHOO.widget.AutoComplete("fstags","oAutoCompContainer1",_f3);
_f4.animHoriz=false;
_f4.animVert=false;
_f4.queryDelay=0;
_f4.maxResultsDisplayed=10;
_f4.useIFrame=true;
_f4.delimChar=",";
_f4.allowBrowserAutocomplete=false;
_f4.typeAhead=true;
_f4.formatResult=function(_f5,_f6){
var _f7=_f5[0];
return _f7;
};
}
},downloadArchive:function(_f8){
if(_f8){
top.location.href=this.config.package_url+"download-archive/?object_id="+_f8;
}
},showShareOptions:function(_f9,i,e){
var _fc=_f9;
var _fd=_fc.store.getAt(i);
var _fe=_fd.get("id");
var _ff=_fd.get("title");
var _100=this.layout.findById("treepanel");
var _101=this.config.package_id;
var _102=this.xmlhttpurl;
var _103=this.sharefolderWindow;
var _104=function(){
var _105=_100.getSelectionModel().getSelectedNode();
_105.loaded=false;
_105.collapse();
_105.fireEvent("click",_105);
_105.expand();
_103.hide();
};
var _106=function(){
var _107=this.communityCombo.getValue();
Ext.Ajax.request({url:this.xmlhttpurl+"share-folder",success:_104,failure:function(_108){
Ext.Msg.alert("Error","Sorry, we encountered an error. Please try again later.");
},params:{target_folder_id:_107,folder_id:_fe}});
};
if(_103==null){
var _109=new Ext.data.JsonStore({url:_102+"list-communities",root:"communities",fields:["target_folder_id","instance_name"]});
this.communityCombo=new Ext.form.ComboBox({id:"communities_list",store:_109,displayField:"instance_name",typeAhead:true,fieldLabel:"Community",triggerAction:"all",emptyText:"Select a community",hiddenName:"target_folder_id",valueField:"target_folder_id",forceSelection:true,handleHeight:80,selectOnFocus:true});
var _10a=new Ext.form.FormPanel({id:"sharefolderform",title:"Select the community where you wish to share the <b>"+_ff+"</b> folder with.",frame:true,items:this.communityCombo});
var _10b=[{text:"Ok",icon:"/resources/ajaxhelper/icons/disk.png",cls:"x-btn-text-icon",handler:_106.createDelegate(this)},{text:"Cancel",icon:"/resources/ajaxhelper/icons/cross.png",cls:"x-btn-text-icon",handler:function(){
_103.hide();
}.createDelegate(this)}];
_103=new Ext.Window({id:"share-win",layout:"fit",width:380,height:200,title:"Share Folder",closeAction:"hide",modal:true,plain:true,autoScroll:false,resizable:false,items:_10a,buttons:_10b});
this.sharefolderWindow=_103;
}else{
this.sharefolderWindow.findById("sharefolderform").setTitle("Select the community where you wish to share the <b>"+_ff+"</b> folder with.");
this.communityCombo.reset();
}
_103.show();
},redirectViews:function(grid,i,e){
var _10f=grid;
var node=_10f.store.getAt(i);
var _111=node.get("id");
window.open(window.location.protocol+"//"+window.location.hostname+"/o/"+_111+"/info");
window.focus();
},redirectPerms:function(grid,i,e){
var _115=grid;
var node=_115.store.getAt(i);
var _117=node.get("id");
var _118=window.open(window.location.protocol+"//"+window.location.hostname+":"+window.location.port+this.config.package_url+"permissions?object_id="+_117+"&return_url="+window.location.pathname+"?package_id="+this.config.package_id+"&folder_id="+this.currentfolder);
_118.focus();
},redirectProperties:function(grid,i,e){
var _11c=grid;
var node=_11c.store.getAt(i);
var _11e=node.get("id");
var _11f=window.open(window.location.protocol+"//"+window.location.hostname+":"+window.location.port+this.config.package_url+"file?file_id="+_11e);
_11f.focus();
},showRevisions:function(grid,i,e){
var _123=grid;
var node=_123.store.getAt(i);
_123.getSelectionModel().selectRow(i);
var _125=node.get("id");
var _126=node.get("filename");
var _127=this.revisionsWindow;
if(_127==null){
_127=new Ext.Window({id:"rev-win",layout:"fit",width:550,height:300,closeAction:"hide",modal:true,plain:true,items:new Ext.TabPanel({id:"rev-tabs",items:[this.createRevGrid(),this.newRevForm()]})});
this.revisionsWindow=_127;
}
_127.setTitle(_126+" - "+acs_lang_text.properties||"Properties");
var _128=_127.findById("revisionspanel");
var _129=_127.findById("rev-tabs");
var _12a=_127.findById("rev-form");
var _12b=this.config.package_id;
_128.store.on("load",function(){
this.getSelectionModel().selectFirstRow();
},_128);
_128.on("activate",function(){
this.store.baseParams["file_id"]=_125;
this.store.baseParams["package_id"]=_12b;
this.store.load();
},_128);
_127.on("beforehide",function(){
this.activate(1);
},_129);
_127.on("show",function(){
this.activate(0);
},_129);
_127.show();
},createRevGrid:function(){
var cols=[{header:"",width:30,sortable:false,dataIndex:"icon"},{header:"Title",width:180,sortable:false,dataIndex:"title"},{header:"Author",sortable:false,dataIndex:"author"},{header:"Size",sortable:false,dataIndex:"size"},{header:"Last Modified",sortable:false,dataIndex:"lastmodified"}];
var _12d=new Ext.data.JsonReader({totalProperty:"total",root:"revisions",id:"revision_id"},[{name:"revision_id",type:"int"},{name:"icon"},{name:"title"},{name:"author"},{name:"type"},{name:"size"},{name:"url"},{name:"lastmodified"}]);
var _12e=new Ext.data.HttpProxy({url:this.xmlhttpurl+"get-filerevisions"});
var _12f=new Ext.grid.ColumnModel(cols);
var _130=new Ext.data.Store({proxy:_12e,reader:_12d});
var _131=[{text:"Download",tooltip:"Download this revision",icon:"/resources/ajaxhelper/icons/arrow_down.png",cls:"x-btn-text-icon",handler:function(){
var grid=this.revisionsWindow.findById("revisionspanel");
var _133=grid.getSelectionModel().getSelected();
window.open(_133.get("url"));
window.focus();
}.createDelegate(this)},{text:"Delete",tooltip:"Delete this revision",icon:"/resources/ajaxhelper/icons/delete.png",cls:"x-btn-text-icon",handler:function(){
var grid=this.revisionsWindow.findById("revisionspanel");
var sm=grid.getSelectionModel();
var _136=sm.getSelected();
var _137=_136.get("revision_id");
var _138=_136.get("title");
var _139=this.xmlhttpurl;
if(grid.store.getCount()==1){
Ext.Msg.alert("Warning","Sorry, you can not delete the only revision for this file. You can delete the file instead");
}else{
Ext.Msg.confirm("Delete","Are you sure you want to delete this version of "+_138+" ? This action can not be reversed.",function(btn){
if(btn=="yes"){
Ext.Ajax.request({url:_139+"delete-fileversion",params:{version_id:_137},success:function(o){
sm.selectPrevious();
grid.store.remove(_136);
},failure:function(){
Ext.Msg.alert("Delete Error","Sorry an error occurred. Please try again later.");
}});
}
});
}
}.createDelegate(this)}];
var _13c=new Ext.grid.GridPanel({store:_130,cm:_12f,sm:new Ext.grid.RowSelectionModel({singleSelect:true}),id:"revisionspanel",title:"Revisions",loadMask:true,tbar:_131});
return _13c;
},newRevForm:function(){
var msg1="Please choose a file to upload";
var _13e=new Ext.Panel({id:"rev-form",align:"left",frame:true,title:"New Revision",html:"<form id=\"newrevfileform\" name=\"newrevfileform\" method=\"post\" enctype=\"multipart/form-data\"><input type=\"hidden\" name=\"package_id\" value=\""+this.config.package_id+"\"><input type=\"hidden\" name=\"file_id\" id=\"rev_file_id\" value=\"\"><input type=\"hidden\" name=\"title\" id=\"rev_file_title\" value=\"\"><p>"+msg1+"<br /><br /><input type=\"file\" name=\"upload_file\" size='35' id=\"rev_upload_file\"></p></form>",buttons:[{text:"Upload New Revision",handler:function(_13f){
if(Ext.get("rev_upload_file").dom.value==""){
Ext.Msg.alert("Warning","Please choose a file to upload");
}else{
var grid=this.layout.findById("filepanel");
var _141=grid.getSelectionModel().getSelected();
Ext.get("rev_file_id").dom.value=_141.get("id");
Ext.get("rev_file_title").dom.value=_141.get("title");
var _142={success:function(){
},upload:function(){
this.revisionsWindow.findById("rev-tabs").activate(0);
Ext.get("newrevfileform").dom.reset();
this.revisionsWindow.findById("rev-form").body.unmask();
_13f.enable();
},failure:function(){
Ext.Msg.alert(acs_lang_text.error||"Error",acs_lang_text.upload_failed||"Upload failed, please try again later.");
this.revisionsWindow.findById("rev-form").body.unmask();
_13f.enable();
},scope:this};
this.revisionsWindow.findById("rev-form").body.mask("<center><img src='/resources/ajaxhelper/images/indicator.gif'><br>Uploading new revision. Please wait</center>");
_13f.disable();
YAHOO.util.Connect.setForm("newrevfileform",true,true);
var cObj=YAHOO.util.Connect.asyncRequest("POST",this.xmlhttpurl+"add-filerevision",_142);
}
}.createDelegate(this),icon:"/resources/ajaxhelper/icons/arrow_up.png",cls:"x-btn-text-icon"}]});
return _13e;
},copyLink:function(grid,i,e){
var _147=grid;
var node=_147.store.getAt(i);
var _149=node.get("type");
if(_149==="folder"){
var _14a=window.location.protocol+"//"+window.location.hostname+":"+window.location.port+this.config.package_url+"?package_id="+this.config.package_id+"&folder_id="+node.get("id");
}else{
if(_149==="url"){
var _14a=node.get("url");
}else{
var _14a=window.location.protocol+"//"+window.location.hostname+node.get("url");
}
}
if(Ext.isIE){
window.clipboardData.setData("text",_14a);
}else{
var _14b=Ext.Msg.show({title:acs_lang_text.linkaddress||"Copy Link Address",prompt:true,msg:acs_lang_text.copyhighlighted||"Copy the highlighted text to your clipboard.",value:_14a,buttons:Ext.Msg.OK});
var _14c=YAHOO.util.Dom.getElementsByClassName("ext-mb-input","input");
_14c[0].select();
}
}};
function readCookie(name){
var ca=document.cookie.split(";");
var _14f=name+"=";
for(var i=0;i<ca.length;i++){
var c=ca[i];
while(c.charAt(0)==" "){
c=c.substring(1,c.length);
}
if(c.indexOf(_14f)==0){
return c.substring(_14f.length,c.length);
}
}
return null;
}
function createCookie(name,_153,days){
if(days){
var date=new Date();
date.setTime(date.getTime()+(days*24*60*60*1000));
var _156="; expires="+date.toGMTString();
}else{
var _156="";
}
document.cookie=name+"="+_153+_156+"; path=/";
}
function readQs(q){
var _158=window.location.search.substring(1);
var _159=_158.split("&");
for(var i=0;i<_159.length;i++){
var pos=_159[i].indexOf("=");
if(pos>0){
var key=_159[i].substring(0,pos);
var val=_159[i].substring(pos+1);
if(key==q){
return val;
}
}
}
return null;
}
function checkFlashVersion(){
var x;
var _15f;
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
function isURL(_160){
if(_160.indexOf(" ")!=-1){
return false;
}else{
if(_160.indexOf("http://")==-1){
return false;
}else{
if(_160=="http://"){
return false;
}else{
if(_160.indexOf("http://")>0){
return false;
}
}
}
}
_160=_160.substring(7,_160.length);
if(_160.indexOf(".")==-1){
return false;
}else{
if(_160.indexOf(".")==0){
return false;
}else{
if(_160.charAt(_160.length-1)=="."){
return false;
}
}
}
if(_160.indexOf("/")!=-1){
_160=_160.substring(0,_160.indexOf("/"));
if(_160.charAt(_160.length-1)=="."){
return false;
}
}
if(_160.indexOf(":")!=-1){
if(_160.indexOf(":")==(_160.length-1)){
return false;
}else{
if(_160.charAt(_160.indexOf(":")+1)=="."){
return false;
}
}
_160=_160.substring(0,_160.indexOf(":"));
if(_160.charAt(_160.length-1)=="."){
return false;
}
}
return true;
}
function FileProgress(_161,_162){
this.file_progress_id=_161.id;
this.opacity=100;
this.height=0;
this.fileProgressWrapper=document.getElementById(this.file_progress_id);
if(!this.fileProgressWrapper){
this.fileProgressWrapper=document.createElement("div");
this.fileProgressWrapper.className="progressWrapper";
this.fileProgressWrapper.id=this.file_progress_id;
this.fileProgressElement=document.createElement("div");
this.fileProgressElement.className="progressContainer";
var _163=document.createElement("a");
_163.className="progressCancel";
_163.href="#";
_163.style.visibility="hidden";
_163.appendChild(document.createTextNode(" "));
var _164=document.createElement("div");
_164.className="progressName";
_164.appendChild(document.createTextNode(_161.name));
var _165=document.createElement("div");
_165.className="progressBarInProgress";
var _166=document.createElement("div");
_166.className="progressBarStatus";
_166.innerHTML="&nbsp;";
this.fileProgressElement.appendChild(_163);
this.fileProgressElement.appendChild(_164);
this.fileProgressElement.appendChild(_166);
this.fileProgressElement.appendChild(_165);
this.fileProgressWrapper.appendChild(this.fileProgressElement);
document.getElementById(_162).appendChild(this.fileProgressWrapper);
}else{
this.fileProgressElement=this.fileProgressWrapper.firstChild;
}
this.height=this.fileProgressWrapper.offsetHeight;
}
FileProgress.prototype.SetProgress=function(_167){
this.fileProgressElement.className="progressContainer green";
this.fileProgressElement.childNodes[3].className="progressBarInProgress";
this.fileProgressElement.childNodes[3].style.width=_167+"%";
};
FileProgress.prototype.SetComplete=function(){
this.fileProgressElement.className="progressContainer blue";
this.fileProgressElement.childNodes[3].className="progressBarComplete";
this.fileProgressElement.childNodes[3].style.width="";
var _168=this;
setTimeout(function(){
_168.Disappear();
},10000);
};
FileProgress.prototype.SetError=function(){
this.fileProgressElement.className="progressContainer red";
this.fileProgressElement.childNodes[3].className="progressBarError";
this.fileProgressElement.childNodes[3].style.width="";
var _169=this;
setTimeout(function(){
_169.Disappear();
},5000);
};
FileProgress.prototype.SetCancelled=function(){
this.fileProgressElement.className="progressContainer";
this.fileProgressElement.childNodes[3].className="progressBarError";
this.fileProgressElement.childNodes[3].style.width="";
var _16a=this;
setTimeout(function(){
_16a.Disappear();
},2000);
};
FileProgress.prototype.SetStatus=function(_16b){
this.fileProgressElement.childNodes[2].innerHTML=_16b;
};
FileProgress.prototype.ToggleCancel=function(show,_16d){
this.fileProgressElement.childNodes[0].style.visibility=show?"visible":"hidden";
if(_16d){
var _16e=this.file_progress_id;
this.fileProgressElement.childNodes[0].onclick=function(){
_16d.cancelUpload(_16e);
return false;
};
}
};
FileProgress.prototype.Disappear=function(){
var _16f=15;
var _170=4;
var rate=30;
if(this.opacity>0){
this.opacity-=_16f;
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
this.height-=_170;
if(this.height<0){
this.height=0;
}
this.fileProgressWrapper.style.height=this.height+"px";
}
if(this.height>0||this.opacity>0){
var _172=this;
setTimeout(function(){
_172.Disappear();
},rate);
}else{
this.fileProgressWrapper.style.display="none";
}
};

