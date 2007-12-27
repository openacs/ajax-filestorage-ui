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
this.asyncCon=new Ext.data.Connection();
this.msgbox=Ext.MessageBox;
this.upldWindow=null;
this.tagWindow=null;
this.createurlWindow=null;
this.sharefolderWindow=null;
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
this.redirectProperties(_16,i);
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
var _54=[{header:"",width:30,sortable:true,dataIndex:"icon"},{header:acs_lang_text.filename||"Filename",id:"filename",sortable:true,dataIndex:"title"},{header:acs_lang_text.size||"Size",sortable:true,dataIndex:"size"},{header:acs_lang_text.lastmodified||"Last Modified",sortable:true,dataIndex:"lastmodified"}];
var _55=new Ext.data.JsonReader({totalProperty:"total",root:"foldercontents",id:"id"},[{name:"id",type:"int"},{name:"icon"},{name:"title"},{name:"filename"},{name:"type"},{name:"tags"},{name:"url"},{name:"linkurl"},{name:"write_p"},{name:"symlink_id"},{name:"size"},{name:"lastmodified"}]);
var _56=new Ext.data.HttpProxy({url:this.xmlhttpurl+"get-foldercontents"});
var _57=new Ext.grid.ColumnModel(_54);
var _58=new Ext.data.Store({proxy:_56,reader:_55,remoteSort:true});
var _59=new Ext.grid.GridPanel({store:_58,cm:_57,id:"filepanel",ddGroup:"fileDD",region:"center",split:true,autoScroll:true,autoExpandColumn:"filename",collapsible:true,enableDragDrop:true,width:250,loadMask:true,frame:false,viewConfig:{forceFit:false,enableRowBody:true,showPreview:true,getRowClass:function(_5a,_5b,p,ds){
var xf=Ext.util.Format;
if(_5a.data.tags!=""){
p.body="<div id='tagscontainer"+_5a.data.id+"' style='padding-left:35px;color:blue'>Tags: "+xf.ellipsis(xf.stripTags(_5a.data.tags),200)+"</div>";
}else{
p.body="<div id='tagscontainer"+_5a.data.id+"' style='padding-left:35px;color:blue'></div>";
}
return "x-grid3-row-expanded";
}}});
_59.on("rowdblclick",this.openItem,this,true);
_59.on("rowcontextmenu",this.showRowContext,this,true);
return _59;
},showRowContext:function(_5f,i,e){
e.stopEvent();
var _62=this.layout.findById("treepanel");
var _63=this.config.treerootnode;
var dm=_5f.store;
var _65=dm.getAt(i);
var _66=_65.get("type");
var _67=_65.get("id");
var _68;
switch(_66){
case "folder":
_68="Open";
break;
case "url":
_68="Open";
break;
default:
_68="Download";
break;
}
this.contextmenu=new Ext.menu.Menu({id:"rightclickmenu",items:[new Ext.menu.Item({text:_68,icon:"/resources/ajaxhelper/icons/page_white.png",handler:this.openItem.createDelegate(this,[_5f,i,e],false)}),new Ext.menu.Item({text:"Tag",icon:"/resources/ajaxhelper/icons/tag_blue.png",handler:this.tagFsitem.createDelegate(this,[_5f,i,e],false)}),new Ext.menu.Item({text:"Views",icon:"/resources/ajaxhelper/icons/camera.png",handler:this.redirectViews.createDelegate(this,[_5f,i,e],false)}),new Ext.menu.Item({text:acs_lang_text.deletefs||"Delete",icon:"/resources/ajaxhelper/icons/delete.png",handler:this.delItem.createDelegate(this,[_5f,i,e],false)}),new Ext.menu.Item({text:acs_lang_text.rename||"Rename",icon:"/resources/ajaxhelper/icons/page_edit.png",handler:this.renameItem.createDelegate(this,[_5f,i,e],false)}),new Ext.menu.Item({text:acs_lang_text.linkaddress||"Copy Link Address",icon:"/resources/ajaxhelper/icons/page_copy.png",handler:this.copyLink.createDelegate(this,[_5f,i,e],false)}),new Ext.menu.Item({text:acs_lang_text.permissions||"Permissions",icon:"/resources/ajaxhelper/icons/group_key.png",handler:this.redirectPerms.createDelegate(this,[_5f,i,e],false)}),new Ext.menu.Item({text:acs_lang_text.properties||"Properties",icon:"/resources/ajaxhelper/icons/page_edit.png",handler:this.redirectProperties.createDelegate(this,[_5f,i,e],false)}),new Ext.menu.Item({text:acs_lang_text.download_archive||"Download archive",icon:"/resources/ajaxhelper/icons/arrow_down.png",handler:this.downloadArchive.createDelegate(this,[_67],false)}),new Ext.menu.Item({text:acs_lang_text.sharefolder||"Share Folder",icon:"/resources/ajaxhelper/icons/group_link.png",handler:this.showShareOptions.createDelegate(this,[_5f,i,e],false)})]});
if(_5f.getSelectionModel().getCount()>1){
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
switch(_66){
case "folder":
this.contextmenu.items.items[1].hide();
this.contextmenu.items.items[7].hide();
this.contextmenu.items.items[8].show();
if(_62.getNodeById(_67).attributes.attributes.type=="symlink"){
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
if(_63.attributes["write_p"]=="f"){
this.contextmenu.items.items[1].hide();
this.contextmenu.items.items[3].hide();
this.contextmenu.items.items[6].hide();
this.contextmenu.items.items[7].hide();
this.contextmenu.items.items[9].hide();
}
var _69=e.getXY();
this.contextmenu.rowid=i;
this.contextmenu.showAt([_69[0],_69[1]]);
},loadFoldercontents:function(_6a,e){
this.currentfolder=_6a.id;
var _6c=this.layout.findById("filepanel");
_6c.store.baseParams["folder_id"]=_6a.id;
_6c.store.baseParams["package_id"]=this.config.package_id;
if(_6a.loading){
_6a.on("expand",function(){
this.store.load();
},_6c,{single:true});
}else{
_6c.store.load();
}
},openItem:function(_6d,i,e){
var _70=this.layout.findById("treepanel");
var dm=_6d.store;
var _72=dm.getAt(i);
if(_72.get("type")=="folder"||_72.get("type")=="symlink"){
var _73=_70.getNodeById(_72.get("id"));
if(!_73.parentNode.isExpanded()){
_73.parentNode.expand();
}
_73.fireEvent("click",_73);
_73.expand();
}else{
window.open(_72.get("url"));
window.focus();
}
},delItem:function(_74,i,e){
var _77=acs_lang_text.confirm_delete||"Are you sure you want to delete ";
var _78=acs_lang_text.foldercontains||"This folder contains";
var _79=this.layout.findById("treepanel");
if(_74.id=="filepanel"){
var _7a=_74;
if(_7a.getSelectionModel().getCount()<=1){
_7a.getSelectionModel().selectRow(i);
}
}else{
var _7a=this.layout.findById("filepanel");
}
var _7b=_7a.getSelectionModel().getSelections();
var _7c=true;
if(_7b.length>0){
_7c=false;
if(_7b.length==1){
var _7d=_7b[0].get("title");
if(_7b[0].get("type")==="folder"){
var msg=_78+" <b>"+_7b[0].get("size")+"</b>.<br>";
}else{
var msg="";
}
var msg=msg+_77+" <b>"+_7d+"</b> ?";
if(_7b[0].get("type")==="symlink"){
var _7f=_7b[0].get("symlink_id");
}else{
var _7f=_7b[0].get("id");
}
}else{
var msg=_77+": <br><br>";
var _7f=[];
for(var x=0;x<_7b.length;x++){
msg=msg+"<b>"+_7b[x].get("title")+"</b> ";
if(_7b[x].get("type")==="folder"){
msg=msg+"("+_7b[x].get("size")+")";
}
msg=msg+"<br>";
if(_7b[x].get("type")==="symlink"){
_7f[x]=_7b[x].get("symlink_id");
}else{
_7f[x]=_7b[x].get("id");
}
}
}
var _81={object_id:_7f};
}else{
_7c=true;
var _82=_79.getSelectionModel().getSelectedNode();
var _7f=_82.attributes["id"];
var _83=_82.attributes.attributes["type"];
var _84=_82.attributes.attributes["symlink_id"];
var _85=_79.getRootNode();
if(_83=="symlink"){
var _81={object_id:_84};
}else{
var _81={object_id:_7f};
}
if(_82.attributes["id"]==_85.attributes["id"]){
Ext.Msg.alert(acs_lang_text.alert||"Alert",acs_lang_text.cant_del_root||"The root folder can not be deleted.");
return;
}else{
var msg=_78+" <b>"+_82.attributes.attributes["size"]+"</b>.<br>";
msg=msg+_77+" <b>"+_82.attributes["text"]+"</b>?";
}
}
var _86=function(_87){
if(_87==="yes"){
Ext.Ajax.request({url:this.xmlhttpurl+"delete-fsitem",success:function(_88){
var _89=Ext.decode(_88.responseText);
if(_89.success){
if(_7c){
var _8a=_79.getSelectionModel().getSelectedNode();
var _8b=_8a.parentNode;
_8b.fireEvent("click",_8b);
_8b.removeChild(_8a);
}else{
for(var x=0;x<_7b.length;x++){
_7a.store.remove(_7b[x]);
var _8d=_7b[x].get("id");
var _8a=_79.getNodeById(_8d);
if(_8a){
_8a.parentNode.fireEvent("click",_8a.parentNode);
_8a.parentNode.removeChild(_8a);
}
}
}
}else{
Ext.Msg.alert(acs_lang_text.error||"Error","Sorry, we encountered an error.");
}
},failure:function(){
Ext.Msg.alert(acs_lang_text.error||"Error",error_msg_txt+"<br><br><font color='red'>"+resultObj.error+"</font>");
},params:_81});
}
};
Ext.MessageBox.confirm(acs_lang_text.confirm||"Confirm",msg,_86,this);
},addFolder:function(){
var te=this.te;
var _8f=this.layout.findById("treepanel");
var _90=_8f.getSelectionModel().getSelectedNode();
_90.expand();
var _91=acs_lang_text.new_folder_error||"Sorry, there was an error trying to create your new folder.";
Ext.Ajax.request({url:this.xmlhttpurl+"add-blankfolder",success:function(_92){
var _93=Ext.decode(_92.responseText);
if(_93.success){
var _94=_90.appendChild(new Ext.tree.TreeNode({text:_93.pretty_folder_name,id:_93.id,iconCls:"folder",singleClickExpand:true,attributes:{write_p:"t"}}));
_8f.getSelectionModel().select(_94);
_94.loaded=true;
_94.fireEvent("click",_94);
setTimeout(function(){
te.editNode=_94;
te.startEdit(_94.ui.textNode);
},10);
}else{
Ext.Msg.alert(acs_lang_text.error||"Error",_91+"<br><br><font color='red'>"+_93.error+"</font>");
}
},failure:function(_95){
var _96=Ext.decode(_95.responseText);
Ext.Msg.alert(acs_lang_text.error||"Error",_91+"<br><br><font color='red'>"+_96.error+"</font>");
},params:{folder_id:_90.attributes["id"]}});
},createSwfObj:function(){
var _97=this;
var _98=_97.layout.findById("treepanel");
var _99=_97.currentfolder;
if(this.swfu==null){
var _9a=String(this.config.package_id);
var _9b=String(this.config.user_id);
var _9c=String(this.currentfolder);
var _9d=String(this.config.max_file_size);
var _9e=function(_9f,_a0){
try{
var _a1=Math.ceil((_a0/_9f.size)*100);
var _a2=new FileProgress(_9f,this.getSetting("progress_target"));
_a2.SetProgress(_a1);
_a2.SetStatus(acs_lang_text.uploading||"Uploading...");
}
catch(ex){
this.debugMessage(ex);
}
};
var _a3=function(_a4){
try{
var _a5=new FileProgress(_a4,this.getSetting("progress_target"));
_a5.SetCancelled();
_a5.SetStatus(acs_lang_text.uploadcancel||"Cancelled (This item will be removed shortly)");
_a5.ToggleCancel(false);
}
catch(ex){
this.debugMessage(ex);
}
};
var _a6=function(_a7){
try{
var _a8=new FileProgress(_a7,this.getSetting("progress_target"));
_a8.SetComplete();
_a8.SetStatus(acs_lang_text.complete||"Complete.");
_a8.ToggleCancel(false);
}
catch(ex){
this.debugMessage(ex);
}
};
var _a9=function(_aa){
var _ab=_98.getNodeById(_97.currentfolder);
_ab.fireEvent("click",_ab);
};
var _ac=function(_ad,_ae,_af){
try{
if(_ad==SWFUpload.ERROR_CODE_QUEUE_LIMIT_EXCEEDED){
Ext.Msg.alert(acs_lang_text.alert||"Alert","You have attempted to queue too many files.\n"+(_af==0?"You have reached the upload limit.":"You may select "+(_af>1?"up to "+_af+" files.":"one file.")));
return;
}
var _b0=new FileProgress(_ae,this.getSetting("progress_target"));
_b0.SetError();
_b0.ToggleCancel(false);
switch(_ad){
case SWFUpload.ERROR_CODE_HTTP_ERROR:
_b0.SetStatus("Upload Error");
this.debugMessage("Error Code: HTTP Error, File name: "+file.name+", Message: "+_af);
break;
case SWFUpload.ERROR_CODE_MISSING_UPLOAD_TARGET:
_b0.SetStatus("Configuration Error");
this.debugMessage("Error Code: No backend file, File name: "+file.name+", Message: "+_af);
break;
case SWFUpload.ERROR_CODE_UPLOAD_FAILED:
_b0.SetStatus("Upload Failed.");
this.debugMessage("Error Code: Upload Failed, File name: "+file.name+", File size: "+file.size+", Message: "+_af);
break;
case SWFUpload.ERROR_CODE_IO_ERROR:
_b0.SetStatus("Server (IO) Error");
this.debugMessage("Error Code: IO Error, File name: "+file.name+", Message: "+_af);
break;
case SWFUpload.ERROR_CODE_SECURITY_ERROR:
_b0.SetStatus("Security Error");
this.debugMessage("Error Code: Security Error, File name: "+file.name+", Message: "+_af);
break;
case SWFUpload.ERROR_CODE_FILE_EXCEEDS_SIZE_LIMIT:
_b0.SetStatus("File is too big.");
this.debugMessage("Error Code: File too big, File name: "+file.name+", File size: "+file.size+", Message: "+_af);
break;
case SWFUpload.ERROR_CODE_ZERO_BYTE_FILE:
_b0.SetStatus("Cannot upload Zero Byte files.");
this.debugMessage("Error Code: Zero byte file, File name: "+file.name+", File size: "+file.size+", Message: "+_af);
break;
case SWFUpload.ERROR_CODE_UPLOAD_LIMIT_EXCEEDED:
_b0.SetStatus("Upload limit exceeded.");
this.debugMessage("Error Code: Upload Limit Exceeded, File name: "+file.name+", File size: "+file.size+", Message: "+_af);
break;
default:
_b0.SetStatus("Unhandled Error");
this.debugMessage("Error Code: "+_ad+", File name: "+file.name+", File size: "+file.size+", Message: "+_af);
break;
}
}
catch(ex){
this.debugMessage(ex);
}
};
var _b1=function(_b2){
var _b3=acs_lang_text.for_upload_to||"for upload to";
var _b4=acs_lang_text.zip_extracted||"Zip File (Will be extracted after upload)";
try{
var _b5=_97.currentfolder;
var _b6=_98.getNodeById(_b5).text;
var _b7=new FileProgress(_b2,this.getSetting("progress_target"));
_b7.SetStatus(_b3+" <b>"+_b6+"</b><br>Title: <input type='text' onblur=\"fsInstance.swfu.removeFileParam('"+_b2.id+"','filetitle');fsInstance.swfu.addFileParam('"+_b2.id+"','filetitle',this.value)\">(optional)<br><input type='checkbox' id='zip"+_b2.id+"' onclick=\"if(document.getElementById('zip"+_b2.id+"').checked) { fsInstance.swfu.addFileParam('"+_b2.id+"','unpack_p','1') } else { fsInstance.swfu.removeFileParam('"+_b2.id+"','unpack_p') }\"> "+_b4);
_b7.ToggleCancel(true,this);
this.addFileParam(_b2.id,"folder_id",_b5);
}
catch(ex){
this.debugMessage(ex);
}
};
this.swfu=new SWFUpload({debug:false,upload_target_url:this.xmlhttpurl+"add-file-flash",upload_params:{user_id:_9b,package_id:_9a},file_types:"*.*",file_size_limit:_9d,file_queue_limit:0,file_upload_limit:10,begin_upload_on_queue:false,file_queued_handler:_b1,file_progress_handler:_9e,file_cancelled_handler:_a3,file_complete_handler:_a6,queue_complete_handler:_a9,error_handler:_ac,flash_url:"/resources/ajax-filestorage-ui/swfupload/swfupload.swf"});
}
},addFile:function(){
if(this.upldWindow==null){
if(!this.config.multi_file_upload||checkFlashVersion()<9||Ext.isLinux){
var _b8=acs_lang_text.file_to_upload||"File to upload";
var _b9=acs_lang_text.file_title||"Title";
var _ba=acs_lang_text.file_description||"Description";
var _bb=acs_lang_text.multiple_files||"Multiple Files";
var _bc=acs_lang_text.multiple_files_msg||"This is a ZIPfile containing multiple files.";
var _bd=true;
var _be="Upload a File";
var _bf=new Ext.Panel({id:"form_addfile",align:"left",frame:true,html:"<form id=\"newfileform\" method=\"post\" enctype=\"multipart/form-data\"><input type=\"hidden\" name=\"package_id\" value=\""+this.config.package_id+"\"><input type=\"hidden\" name=\"folder_id\" value=\""+this.currentfolder+"\"><p>"+_b8+"<br /><input type=\"file\" name=\"upload_file\" id=\"upload_file\"></p><br><p>"+_b9+"<br /><input type=\"text\" name=\"filetitle\" id=\"filetitle\"></p><br><p>"+_ba+" :<br /><textarea name=\"filedescription\" id=\"filedescription\"></textarea></p><p>"+_bb+" :<br /><br /><input type=\"checkbox\" name=\"unpack_p\" value=\"t\" id=\"unpack_p\" /> "+_bc+"</p></form>"});
var _c0=[{text:"Upload",handler:this.uploadOneFile.createDelegate(this),icon:"/resources/ajaxhelper/icons/arrow_up.png",cls:"x-btn-text-icon"},{text:"Close",handler:function(){
this.upldWindow.hide();
}.createDelegate(this),icon:"/resources/ajaxhelper/icons/cross.png",cls:"x-btn-text-icon"}];
}else{
this.createSwfObj();
var _c1=acs_lang_text.upload_intro||"Click <b>Browse</b> to select a file to upload to the selected folder on the tree.";
var _bd=false;
var _be="Upload Files";
var _bf=new Ext.Panel({id:"form_multi_addfile",autoScroll:true,frame:true,html:"<div id=\"upldMsg\">"+_c1+"<hr></div><div class=\"flash\" id=\"fsuploadprogress\"></div>"});
_bf.on("render",function(){
this.swfu.addSetting("progress_target","fsuploadprogress");
},this);
var _c0=[{text:"Browse",handler:this.swfu.browse.createDelegate(this.swfu),icon:"/resources/ajaxhelper/icons/page_add.png",cls:"x-btn-text-icon"},{text:"Upload",handler:this.swfu.startUpload.createDelegate(this.swfu,[null,this],false),icon:"/resources/ajaxhelper/icons/arrow_up.png",cls:"x-btn-text-icon"},{text:"Hide",handler:function(){
this.upldWindow.hide();
}.createDelegate(this),icon:"/resources/ajaxhelper/icons/cross.png",cls:"x-btn-text-icon"}];
}
this.upldWindow=new Ext.Window({id:"upload-win",layout:"fit",width:400,height:300,title:_be,closeAction:"hide",modal:_bd,plain:true,resizable:false,items:_bf,buttons:_c0});
}
this.upldWindow.show();
},uploadOneFile:function(){
if(Ext.get("upload_file").getValue()!=""&&Ext.get("filetitle").getValue()!=""){
var _c2=this.layout.findById("treepanel");
var _c3={success:function(){
},upload:function(){
_c2.getSelectionModel().getSelectedNode().loaded=false;
_c2.getSelectionModel().getSelectedNode().fireEvent("click",_c2.getSelectionModel().getSelectedNode());
this.upldWindow.body.unmask();
this.upldWindow.hide();
},failure:function(){
Ext.Msg.alert(acs_lang_text.error||"Error",acs_lang_text.upload_failed||"Upload failed, please try again later.");
},scope:this};
var _c4=acs_lang_text.loading||"One moment. This may take a while depending on how large your upload is.";
this.upldWindow.body.mask("<img src='/resources/ajaxhelper/images/indicator.gif'><br>"+_c4);
YAHOO.util.Connect.setForm("newfileform",true,true);
var _c5=YAHOO.util.Connect.asyncRequest("POST",this.xmlhttpurl+"add-file",_c3);
}else{
Ext.Msg.alert(acs_lang_text.alert||"Alert",acs_lang_text.file_required||"<b>Title</b> and <b>File to upload</b> are required.");
}
},addUrl:function(){
if(this.createurlWindow==null){
this.createurlWindow=new Ext.Window({id:"createurl-win",layout:"fit",width:400,height:180,title:"Create URL",closeAction:"hide",modal:true,plain:true,resizable:false,items:new Ext.FormPanel({id:"form_create_url",align:"left",autoScroll:true,closable:true,layout:"form",defaults:{width:230},frame:true,buttonAlign:"left",items:[{xtype:"textfield",fieldLabel:"Title",allowBlank:false,name:"fstitle",tabIndex:1},{xtype:"textfield",fieldLabel:"URL",allowBlank:false,name:"fsurl",tabIndex:2,validator:isURL},{xtype:"textfield",fieldLabel:"Description",name:"fsdescription",tabIndex:3}]}),buttons:[{text:"Submit",handler:function(){
this.createurlWindow.findById("form_create_url").getForm().submit({url:this.xmlhttpurl+"add-url",waitMsg:"One moment ....",params:{package_id:this.config.package_id,folder_id:this.currentfolder},reset:true,scope:this,success:function(_c6,_c7){
if(_c7.result){
var _c8=this.layout.findById("treepanel");
_c8.getSelectionModel().getSelectedNode().fireEvent("click",_c8.getSelectionModel().getSelectedNode());
this.createurlWindow.hide();
}else{
Ext.MessageBox.alert("Error","Sorry an error occured.<br>"+_c7.result.error);
}
},failure:function(_c9,_ca){
if(_ca.result){
Ext.MessageBox.alert("Error",_ca.result.error);
}
}});
}.createDelegate(this),icon:"/resources/ajaxhelper/icons/disk.png",cls:"x-btn-text-icon"},{text:"Close",handler:function(){
this.createurlWindow.hide();
}.createDelegate(this),icon:"/resources/ajaxhelper/icons/cross.png",cls:"x-btn-text-icon"}]});
}
this.createurlWindow.show();
},renameItem:function(_cb,i,e){
var _ce=_cb;
var _cf=this.layout.findById("treepanel");
var _d0=_ce.store.getAt(i);
var _d1=_d0.get("url");
var _d2=_d0.get("type");
var _d3=_d0.get("id");
var _d4=_d0.get("filename");
var _d5=function(_d6){
var _d7=acs_lang_text.an_error_occurred||"An error occurred";
var _d8=acs_lang_text.reverted||"Your changes have been reverted";
var _d9=Ext.decode(_d6.responseText);
if(!_d9.success){
Ext.Msg.alert(acs_lang_text.error||"Error",_d7+": <br><br><font color='red'>"+_d9.error+"</font><br><br>"+_d8);
}else{
if(_d2=="folder"){
_cf.getNodeById(_d3).setText(_d9.newname);
}
if(_d2!="folder"&&_d4===" "){
_d4=_d0.get("title");
_d0.set("filename",_d4);
}
_d0.set("title",_d9.newname);
_d0.commit();
}
};
var _da=function(btn,_dc){
if(btn=="ok"){
if(_dc!=""){
if(_dc.length>100){
Ext.Msg.alert(acs_lang_text.alert||"Alert",acs_lang_text.limitto100||"Please limit your name to 100 characters or less.");
return false;
}else{
Ext.Ajax.request({url:this.xmlhttpurl+"edit-name",success:_d5,failure:function(_dd){
var _de=Ext.decode(_dd.responseText);
Ext.Msg.alert(acs_lang_text.error||"Error",error_msg_txt+"<br><br><font color='red'>"+_de.error+"</font>");
},params:{newname:_dc,object_id:_d3,type:_d2,url:_d1}});
}
}else{
Ext.Msg.alert(acs_lang_text.alert||"Alert",acs_lang_text.enter_new_name||"Please enter a new name.");
return false;
}
}
};
Ext.Msg.show({title:acs_lang_text.rename||"Rename",prompt:true,msg:acs_lang_text.enter_new_name||"Please enter a new name for ... ",value:_d0.get("title"),buttons:Ext.Msg.OKCANCEL,fn:_da.createDelegate(this)});
var _df=YAHOO.util.Dom.getElementsByClassName("ext-mb-input","input");
_df[0].select();
},tagFsitem:function(_e0,i,e){
var _e3=_e0;
var _e4=_e3.store.getAt(i);
var _e5=_e4.get("id");
var _e6=_e4.get("tags");
var _e7=this.config.package_id;
var _e8=this.layout.findById("tagcloudpanel");
var _e9=this.xmlhttpurl;
var _ea=this.tagWindow;
var _eb=function(){
Ext.Ajax.request({url:this.xmlhttpurl+"add-tag",success:function(){
_e4.data.tags=Ext.get("fstags").getValue();
_e4.commit();
_e8.load({url:_e9+"get-tagcloud",params:{package_id:_e7}});
_ea.hide();
},failure:function(_ec){
Ext.Msg.alert(acs_lang_text.error||"Error","Sorry, we encountered an error.");
},params:{object_id:_e4.id,package_id:_e7,tags:Ext.get("fstags").getValue()}});
};
if(_ea==null){
var _ed=new Ext.Panel({id:"form_addtag",autoScroll:true,frame:true,html:"<div style='text-align:left' class='yui-skin-sam'><p>Enter or edit one or more tags. Use commas (,) to separate the tags:<br ><br><div class='yui-ac'><input type='text' name='fstags' id='fstags' size='60' autocomplete='off' value='"+_e6+"'><div id='oAutoCompContainer1' class='yui-ac-container'></div></div>"});
var _ee=[{text:"Ok",icon:"/resources/ajaxhelper/icons/disk.png",cls:"x-btn-text-icon",handler:_eb.createDelegate(this)},{text:"Cancel",icon:"/resources/ajaxhelper/icons/cross.png",cls:"x-btn-text-icon",handler:function(){
_ea.hide();
}.createDelegate(this)}];
_ea=new Ext.Window({id:"tag-win",layout:"fit",width:450,height:300,title:"Tags",closeAction:"hide",modal:true,plain:true,autoScroll:false,resizable:false,items:_ed,buttons:_ee});
}
_ea.show();
this.initTagAutoComplete();
},initTagAutoComplete:function(){
var _ef=new YAHOO.widget.DS_JSArray(oAutoCompArr);
if(document.getElementById("fstags")){
var _f0=new YAHOO.widget.AutoComplete("fstags","oAutoCompContainer1",_ef);
_f0.animHoriz=false;
_f0.animVert=false;
_f0.queryDelay=0;
_f0.maxResultsDisplayed=10;
_f0.useIFrame=true;
_f0.delimChar=",";
_f0.allowBrowserAutocomplete=false;
_f0.typeAhead=true;
_f0.formatResult=function(_f1,_f2){
var _f3=_f1[0];
return _f3;
};
}
},downloadArchive:function(_f4){
if(_f4){
top.location.href="download-archive/?object_id="+_f4;
}
},showShareOptions:function(_f5,i,e){
var _f8=_f5;
var _f9=_f8.store.getAt(i);
var _fa=_f9.get("id");
var _fb=_f9.get("title");
var _fc=this.layout.findById("treepanel");
var _fd=this.config.package_id;
var _fe=this.xmlhttpurl;
var _ff=this.sharefolderWindow;
var _100=function(){
var _101=_fc.getSelectionModel().getSelectedNode();
_101.loaded=false;
_101.collapse();
_101.fireEvent("click",_101);
_101.expand();
_ff.hide();
};
var _102=function(){
var _103=this.communityCombo.getValue();
Ext.Ajax.request({url:this.xmlhttpurl+"share-folder",success:_100,failure:function(_104){
Ext.Msg.alert("Error","Sorry, we encountered an error. Please try again later.");
},params:{target_folder_id:_103,folder_id:_fa}});
};
if(_ff==null){
var _105=new Ext.Panel({id:"form_addtag",autoScroll:true,frame:true,html:"<div style='text-align:left'>Select the community where you wish to share the <b>"+_fb+"</b> folder with.<br><br><input type='text' size='30' id='communities_list' /></div></div>"});
var _106=[{text:"Ok",icon:"/resources/ajaxhelper/icons/disk.png",cls:"x-btn-text-icon",handler:_102.createDelegate(this)},{text:"Cancel",icon:"/resources/ajaxhelper/icons/cross.png",cls:"x-btn-text-icon",handler:function(){
_ff.hide();
}.createDelegate(this)}];
_ff=new Ext.Window({id:"share-win",layout:"fit",width:380,height:200,title:"Share Folder",closeAction:"hide",modal:true,plain:true,autoScroll:false,resizable:false,items:_105,buttons:_106});
_ff.on("show",function(){
if(this.communityCombo==null){
var _107=new Ext.data.JsonStore({url:_fe+"list-communities",root:"communities",fields:["target_folder_id","instance_name"]});
this.communityCombo=new Ext.form.ComboBox({store:_107,displayField:"instance_name",typeAhead:true,triggerAction:"all",emptyText:"Select a community",hiddenName:"target_folder_id",valueField:"target_folder_id",forceSelection:true,handleHeight:80,selectOnFocus:true,applyTo:"communities_list"});
}
},this);
}else{
this.communityCombo.reset();
}
_ff.show();
},redirectViews:function(grid,i,e){
var _10b=grid;
var node=_10b.store.getAt(i);
var _10d=node.get("id");
window.open(window.location.protocol+"//"+window.location.hostname+"/o/"+_10d+"/info");
window.focus();
},redirectPerms:function(grid,i,e){
var _111=grid;
var node=_111.store.getAt(i);
var _113=node.get("id");
var _114=window.open(window.location.protocol+"//"+window.location.hostname+":"+window.location.port+this.config.package_url+"permissions?object_id="+_113+"&return_url="+window.location.pathname+"?package_id="+this.config.package_id+"&folder_id="+this.currentfolder);
_114.focus();
},redirectProperties:function(grid,i,e){
var _118=grid;
var node=_118.store.getAt(i);
var _11a=node.get("id");
var _11b=window.open(window.location.protocol+"//"+window.location.hostname+":"+window.location.port+this.config.package_url+"file?file_id="+_11a);
_11b.focus();
},copyLink:function(grid,i,e){
var _11f=grid;
var node=_11f.store.getAt(i);
var _121=node.get("type");
if(_121==="folder"){
var _122=window.location.protocol+"//"+window.location.hostname+":"+window.location.port+this.config.package_url+"?package_id="+this.config.package_id+"&folder_id="+node.get("id");
}else{
if(_121==="url"){
var _122=node.get("url");
}else{
var _122=window.location.protocol+"//"+window.location.hostname+node.get("url");
}
}
if(Ext.isIE){
window.clipboardData.setData("text",_122);
}else{
var _123=Ext.Msg.show({title:acs_lang_text.linkaddress||"Copy Link Address",prompt:true,msg:acs_lang_text.copyhighlighted||"Copy the highlighted text to your clipboard.",value:_122,buttons:Ext.Msg.OK});
var _124=YAHOO.util.Dom.getElementsByClassName("ext-mb-input","input");
_124[0].select();
}
}};
function readCookie(name){
var ca=document.cookie.split(";");
var _127=name+"=";
for(var i=0;i<ca.length;i++){
var c=ca[i];
while(c.charAt(0)==" "){
c=c.substring(1,c.length);
}
if(c.indexOf(_127)==0){
return c.substring(_127.length,c.length);
}
}
return null;
}
function createCookie(name,_12b,days){
if(days){
var date=new Date();
date.setTime(date.getTime()+(days*24*60*60*1000));
var _12e="; expires="+date.toGMTString();
}else{
var _12e="";
}
document.cookie=name+"="+_12b+_12e+"; path=/";
}
function readQs(q){
var _130=window.location.search.substring(1);
var _131=_130.split("&");
for(var i=0;i<_131.length;i++){
var pos=_131[i].indexOf("=");
if(pos>0){
var key=_131[i].substring(0,pos);
var val=_131[i].substring(pos+1);
if(key==q){
return val;
}
}
}
return null;
}
function checkFlashVersion(){
var x;
var _137;
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
function isURL(_138){
if(_138.indexOf(" ")!=-1){
return false;
}else{
if(_138.indexOf("http://")==-1){
return false;
}else{
if(_138=="http://"){
return false;
}else{
if(_138.indexOf("http://")>0){
return false;
}
}
}
}
_138=_138.substring(7,_138.length);
if(_138.indexOf(".")==-1){
return false;
}else{
if(_138.indexOf(".")==0){
return false;
}else{
if(_138.charAt(_138.length-1)=="."){
return false;
}
}
}
if(_138.indexOf("/")!=-1){
_138=_138.substring(0,_138.indexOf("/"));
if(_138.charAt(_138.length-1)=="."){
return false;
}
}
if(_138.indexOf(":")!=-1){
if(_138.indexOf(":")==(_138.length-1)){
return false;
}else{
if(_138.charAt(_138.indexOf(":")+1)=="."){
return false;
}
}
_138=_138.substring(0,_138.indexOf(":"));
if(_138.charAt(_138.length-1)=="."){
return false;
}
}
return true;
}
function FileProgress(_139,_13a){
this.file_progress_id=_139.id;
this.opacity=100;
this.height=0;
this.fileProgressWrapper=document.getElementById(this.file_progress_id);
if(!this.fileProgressWrapper){
this.fileProgressWrapper=document.createElement("div");
this.fileProgressWrapper.className="progressWrapper";
this.fileProgressWrapper.id=this.file_progress_id;
this.fileProgressElement=document.createElement("div");
this.fileProgressElement.className="progressContainer";
var _13b=document.createElement("a");
_13b.className="progressCancel";
_13b.href="#";
_13b.style.visibility="hidden";
_13b.appendChild(document.createTextNode(" "));
var _13c=document.createElement("div");
_13c.className="progressName";
_13c.appendChild(document.createTextNode(_139.name));
var _13d=document.createElement("div");
_13d.className="progressBarInProgress";
var _13e=document.createElement("div");
_13e.className="progressBarStatus";
_13e.innerHTML="&nbsp;";
this.fileProgressElement.appendChild(_13b);
this.fileProgressElement.appendChild(_13c);
this.fileProgressElement.appendChild(_13e);
this.fileProgressElement.appendChild(_13d);
this.fileProgressWrapper.appendChild(this.fileProgressElement);
document.getElementById(_13a).appendChild(this.fileProgressWrapper);
}else{
this.fileProgressElement=this.fileProgressWrapper.firstChild;
}
this.height=this.fileProgressWrapper.offsetHeight;
}
FileProgress.prototype.SetProgress=function(_13f){
this.fileProgressElement.className="progressContainer green";
this.fileProgressElement.childNodes[3].className="progressBarInProgress";
this.fileProgressElement.childNodes[3].style.width=_13f+"%";
};
FileProgress.prototype.SetComplete=function(){
this.fileProgressElement.className="progressContainer blue";
this.fileProgressElement.childNodes[3].className="progressBarComplete";
this.fileProgressElement.childNodes[3].style.width="";
var _140=this;
setTimeout(function(){
_140.Disappear();
},10000);
};
FileProgress.prototype.SetError=function(){
this.fileProgressElement.className="progressContainer red";
this.fileProgressElement.childNodes[3].className="progressBarError";
this.fileProgressElement.childNodes[3].style.width="";
var _141=this;
setTimeout(function(){
_141.Disappear();
},5000);
};
FileProgress.prototype.SetCancelled=function(){
this.fileProgressElement.className="progressContainer";
this.fileProgressElement.childNodes[3].className="progressBarError";
this.fileProgressElement.childNodes[3].style.width="";
var _142=this;
setTimeout(function(){
_142.Disappear();
},2000);
};
FileProgress.prototype.SetStatus=function(_143){
this.fileProgressElement.childNodes[2].innerHTML=_143;
};
FileProgress.prototype.ToggleCancel=function(show,_145){
this.fileProgressElement.childNodes[0].style.visibility=show?"visible":"hidden";
if(_145){
var _146=this.file_progress_id;
this.fileProgressElement.childNodes[0].onclick=function(){
_145.cancelUpload(_146);
return false;
};
}
};
FileProgress.prototype.Disappear=function(){
var _147=15;
var _148=4;
var rate=30;
if(this.opacity>0){
this.opacity-=_147;
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
this.height-=_148;
if(this.height<0){
this.height=0;
}
this.fileProgressWrapper.style.height=this.height+"px";
}
if(this.height>0||this.opacity>0){
var _14a=this;
setTimeout(function(){
_14a.Disappear();
},rate);
}else{
this.fileProgressWrapper.style.display="none";
}
};

