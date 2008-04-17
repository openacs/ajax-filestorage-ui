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
var _10=new Ext.menu.Menu({id:"toolsmenu",items:[new Ext.menu.Item({id:"mnOpen",text:"Open",icon:"/resources/ajaxhelper/icons/page_white.png"}),new Ext.menu.Item({id:"mnTag",text:"Tag",icon:"/resources/ajaxhelper/icons/tag_blue.png"}),new Ext.menu.Item({id:"mnView",text:"Views",icon:"/resources/ajaxhelper/icons/camera.png"}),new Ext.menu.Item({id:"mnRename",text:acs_lang_text.rename||"Rename",icon:"/resources/ajaxhelper/icons/page_edit.png"}),new Ext.menu.Item({id:"mnCopyLink",text:acs_lang_text.linkaddress||"Copy Link Address",icon:"/resources/ajaxhelper/icons/page_copy.png"}),new Ext.menu.Item({id:"mnPerms",text:acs_lang_text.permissions||"Permissions",icon:"/resources/ajaxhelper/icons/group_key.png"}),new Ext.menu.Item({id:"mnProp",text:acs_lang_text.properties||"Properties",icon:"/resources/ajaxhelper/icons/page_edit.png"}),new Ext.menu.Item({id:"mnArch",text:acs_lang_text.download_archive||"Download archive",icon:"/resources/ajaxhelper/icons/arrow_down.png"}),new Ext.menu.Item({id:"mnShare",text:acs_lang_text.sharefolder||"Share Folder",icon:"/resources/ajaxhelper/icons/group_link.png"})]});
_10.on("beforeshow",function(){
var _11=this.layout.findById("filepanel");
var _12=this.layout.findById("treepanel");
if(_11.getSelectionModel().getCount()==0){
for(var x=0;x<_10.items.items.length;x++){
_10.items.items[x].enable();
}
_10.items.items[0].setText("Open");
_10.items.items[0].disable();
_10.items.items[1].disable();
_10.items.items[6].disable();
_10.items.items[8].disable();
if(!this.views_p){
_10.items.items[2].disable();
}
}else{
if(_11.getSelectionModel().getCount()==1){
var _14=_11.getSelectionModel().getSelections();
for(var x=0;x<_10.items.items.length;x++){
_10.items.items[x].enable();
}
switch(_14[0].get("type")){
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
_10.on("itemclick",function(_15,e){
var _17=this.layout.findById("filepanel");
if(_17.getSelectionModel().getCount()==1){
var _18=_17;
var _19=_18.getSelectionModel().getSelected().get("id");
for(var x=0;x<_18.store.data.items.length;x++){
if(_18.store.data.items[x].id==_19){
var i=x;
break;
}
}
}else{
var _18=this.layout.findById("treepanel");
var _19=_18.getSelectionModel().getSelectedNode().attributes["id"];
var i=_19;
}
switch(_15.getId()){
case "mnOpen":
this.openItem(_18,i);
break;
case "mnTag":
this.tagFsitem(_18,i);
break;
case "mnView":
this.redirectViews(_18,i);
break;
case "mnRename":
this.renameItem(_18,i);
break;
case "mnCopyLink":
this.copyLink(_18,i);
break;
case "mnPerms":
this.redirectPerms(_18,i);
break;
case "mnProp":
this.showRevisions(_18,i);
break;
case "mnArch":
this.downloadArchive(_19);
break;
case "mnShare":
this.showShareOptions(_18,i);
break;
}
},this);
var _1c={text:"Tools",iconCls:"toolsmenu",menu:_10};
return _1c;
},createToolbar:function(){
var _1d=this.config.treerootnode;
var _1e=[];
if(_1d.attributes["write_p"]=="t"){
var _1e=[" ",{text:acs_lang_text.newfolder||"New Folder",tooltip:acs_lang_text.newfolder||"New Folder",icon:"/resources/ajaxhelper/icons/folder_add.png",cls:"x-btn-text-icon",handler:this.addFolder.createDelegate(this)},{text:acs_lang_text.uploadfile||"Upload Files",tooltip:acs_lang_text.uploadfile||"Upload Files",icon:"/resources/ajaxhelper/icons/page_add.png",cls:"x-btn-text-icon",handler:this.addFile.createDelegate(this)}];
if(this.create_url_p){
_1e.push({text:acs_lang_text.createurl||"Create Url",tooltip:acs_lang_text.createurl||"Create Url",icon:"/resources/ajaxhelper/icons/page_link.png",cls:"x-btn-text-icon",handler:this.addUrl.createDelegate(this)});
}
_1e.push({text:acs_lang_text.deletefs||"Delete",tooltip:acs_lang_text.deletefs||"Delete",icon:"/resources/ajaxhelper/icons/delete.png",cls:"x-btn-text-icon",handler:this.delItem.createDelegate(this)});
_1e.push(this.createToolsMenu());
_1e.push("->");
}
_1e.push({tooltip:"This may take a few minutes if you have a lot of files",text:acs_lang_text.download_archive||"Download Archive",icon:"/resources/ajaxhelper/icons/arrow_down.png",cls:"x-btn-text-icon",handler:this.downloadArchive.createDelegate(this,[_1d.id],false)});
return _1e;
},createLeft:function(){
var _1f=new Ext.Panel({id:"leftpanel",region:"west",collapsible:true,titlebar:true,title:" ",layout:"accordion",split:true,width:300,items:[this.createTreePanel(),this.createTagPanel()]});
return _1f;
},createTreePanel:function(){
var _20=new Ext.tree.AsyncTreeNode({text:this.config.treerootnode.text,draggable:false,id:this.config.treerootnode.id,singeClickExpand:true,expanded:true,attributes:this.config.treerootnode.attributes});
var _21=new Ext.tree.TreeLoader({dataUrl:this.xmlhttpurl+"load-treenodes",baseParams:{package_id:this.config.package_id}});
var _22=new Ext.tree.TreePanel({id:"treepanel",title:"Folders",autoScroll:true,animate:true,enableDrag:false,enableDrop:true,loadMask:true,loader:_21,root:_20,ddAppendOnly:true,containerScroll:true,dropConfig:{dropAllowed:true,ddGroup:"fileDD",onNodeOver:function(_23,_24,e,_26){
if(_23.node.id==_23.node.ownerTree.getSelectionModel().getSelectedNode().id){
return false;
}
if(_24.dragData.selections){
for(var x=0;x<_24.dragData.selections.length;x++){
if(_23.node.id==_24.dragData.selections[x].data.id){
return false;
}
}
}
return true;
},onNodeDrop:function(_28,_29,e,_2b){
var _2c=this.layout.findById("filepanel");
var _2d=_28.node.id;
var _2e=[];
for(var x=0;x<_2b.selections.length;x++){
_2e[x]=_2b.selections[x].data.id;
}
var _30=acs_lang_text.an_error_occurred||"An error occurred";
var _31=acs_lang_text.reverted||"Your changes have been reverted";
var _32=function(_33){
var _34=Ext.decode(_33.responseText);
if(_34.success){
var dm=_2c.store;
var _36=_2c.getSelectionModel().getSelections();
var _37=false;
for(var x=0;x<_36.length;x++){
dm.remove(_36[x]);
if(_36[x].data.type=="folder"){
_37=true;
if(_28.node.ownerTree.getNodeById(_36[x].data.id)){
var _39=_28.node.ownerTree.getNodeById(_36[x].data.id).parentNode;
_39.loaded=false;
_39.removeChild(_28.node.ownerTree.getNodeById(_36[x].data.id));
}
}
}
if(_37){
var _3a=_28.node.ownerTree.getRootNode();
if(_3a.id==_28.node.id){
_3a.fireEvent("click",_3a);
}
_28.node.loaded=false;
_28.node.expand();
}
}else{
Ext.Msg.alert(acs_lang_text.error||"Error",_30+"<br>"+_31);
}
};
Ext.Ajax.request({url:this.xmlhttpurl+"move-fsitem",success:_32,failure:function(){
var _3b=Ext.decode(response.responseText);
var msg="";
if(_3b.error){
msg=_3b.error;
}
Ext.Msg.alert(acs_lang_text.error||"Error",_30+"<br>"+msg+"<br>"+_31);
},params:{folder_target_id:_2d,file_ids:_2e}});
return true;
}.createDelegate(this)}});
this.enableTreeFolderRename(_22);
_20.on("expand",this.selectInitFolder,this,{single:true});
_22.on("click",this.loadFoldercontents,this);
return _22;
},enableTreeFolderRename:function(_3d){
this.te=new Ext.tree.TreeEditor(_3d,{allowBlank:false,blankText:acs_lang_text.folder_name_required||"A folder name is required",ignoreNoChange:true});
this.te.on("beforestartedit",function(_3e,el,_40){
if(_3e.editNode.attributes.attributes.write_p=="t"){
return true;
}else{
Ext.Msg.alert(acs_lang_text.permission_denied||"Permission Denied",acs_lang_text.permission_denied||"Sorry, you do not have permission to rename this folder");
return false;
}
},this,true);
this.te.on("beforecomplete",function(_41,_42,_43){
var _44=_41.editNode.parentNode;
if(_44){
var _45=_44.childNodes;
for(x=0;x<_45.length;x++){
if(_45[x].text==_42&&_45[x].id!=_41.editNode.id){
Ext.Msg.alert(acs_lang_text.duplicate_name||"Duplicate Name",acs_lang_text.duplicate_name_error||"Please enter a different name. The name you entered is already being used.");
return false;
}
}
}
return true;
},this,true);
this.te.on("complete",function(_46,_47,_48){
var _49=acs_lang_text.an_error_occurred||"An error occurred";
var _4a=acs_lang_text.reverted||"Your changes have been reverted";
Ext.Ajax.request({url:this.xmlhttpurl+"rename-fsitem",success:function(_4b){
var _4c=Ext.decode(_4b.responseText);
if(!_4c.success){
Ext.Msg.alert(acs_lang_text.error||"Error",_49+": <br><br><font color='red'>"+_4c.error+"</font><br><br>"+_4a);
_46.editNode.setText(_48);
}
},failure:function(){
Ext.Msg.alert(acs_lang_text.error||"Error",_49+"<br>"+_4a);
_46.editNode.setText(_48);
},params:{newname:_47,object_id:_46.editNode.id,type:"folder"}});
},this,true);
},createTagPanel:function(){
var _4d=new Ext.Panel({id:"tagcloudpanel",title:"Tags",frame:false,loadMask:true,autoScroll:true,autoLoad:{url:this.xmlhttpurl+"get-tagcloud",params:{package_id:this.config.package_id}}});
var _4e=function(){
var _4f=this;
var _50=_4f.currenttag;
_4d.body.on("click",function(obj,el){
if(el.tagName=="A"){
if(_50!=null){
Ext.get(_50).setStyle("font-weight","normal");
}
Ext.get(el).setStyle("font-weight","bold");
_50=el.id;
this.loadTaggedFiles(el.id);
}
},this);
};
_4d.on("render",_4e,this);
return _4d;
},loadTaggedFiles:function(_53){
this.layout.findById("treepanel").getSelectionModel().clearSelections();
var id=_53.substring(3,_53.length);
this.layout.findById("filepanel").store.baseParams["tag_id"]=id;
this.layout.findById("filepanel").store.load();
this.layout.findById("filepanel").store.baseParams["tag_id"]="";
},createRight:function(){
var _55=function(_56,p,_58){
p.attr="ext:qtip='"+_58.get("qtip")+"'";
return _56;
};
var _59=[{header:"",width:30,sortable:true,dataIndex:"icon"},{header:acs_lang_text.filename||"Filename",id:"filename",sortable:true,dataIndex:"title",renderer:_55},{header:acs_lang_text.size||"Size",sortable:true,dataIndex:"size"},{header:acs_lang_text.lastmodified||"Last Modified",sortable:true,dataIndex:"lastmodified"}];
var _5a=new Ext.data.JsonReader({totalProperty:"total",root:"foldercontents",id:"id"},[{name:"id",type:"int"},{name:"qtip"},{name:"icon"},{name:"title"},{name:"filename"},{name:"type"},{name:"tags"},{name:"url"},{name:"linkurl"},{name:"write_p"},{name:"symlink_id"},{name:"size"},{name:"lastmodified"}]);
var _5b=new Ext.data.HttpProxy({url:this.xmlhttpurl+"get-foldercontents"});
var _5c=new Ext.grid.ColumnModel(_59);
var _5d=new Ext.data.Store({proxy:_5b,reader:_5a,remoteSort:true});
var _5e=new Ext.grid.GridPanel({store:_5d,cm:_5c,id:"filepanel",ddGroup:"fileDD",region:"center",split:true,autoScroll:true,autoExpandColumn:"filename",collapsible:true,enableDragDrop:true,width:250,loadMask:true,frame:false,viewConfig:{forceFit:false,enableRowBody:true,showPreview:true,getRowClass:function(_5f,_60,p,ds){
var xf=Ext.util.Format;
if(_5f.data.tags!=""){
p.body="<div id='tagscontainer"+_5f.data.id+"' style='padding-left:35px;color:blue'>Tags: "+xf.ellipsis(xf.stripTags(_5f.data.tags),200)+"</div>";
}else{
p.body="<div id='tagscontainer"+_5f.data.id+"' style='padding-left:35px;color:blue'></div>";
}
return "x-grid3-row-expanded";
}}});
_5e.on("rowdblclick",this.openItem,this,true);
_5e.on("rowcontextmenu",this.showRowContext,this,true);
return _5e;
},showRowContext:function(_64,i,e){
e.stopEvent();
var _67=this.layout.findById("treepanel");
var _68=this.config.treerootnode;
var dm=_64.store;
var _6a=dm.getAt(i);
var _6b=_6a.get("type");
var _6c=_6a.get("id");
var _6d;
switch(_6b){
case "folder":
_6d="Open";
break;
case "url":
_6d="Open";
break;
default:
_6d="Download";
break;
}
this.contextmenu=new Ext.menu.Menu({id:"rightclickmenu",items:[new Ext.menu.Item({text:_6d,icon:"/resources/ajaxhelper/icons/page_white.png",handler:this.openItem.createDelegate(this,[_64,i,e],false)}),new Ext.menu.Item({text:"Tag",icon:"/resources/ajaxhelper/icons/tag_blue.png",handler:this.tagFsitem.createDelegate(this,[_64,i,e],false)}),new Ext.menu.Item({text:"Views",icon:"/resources/ajaxhelper/icons/camera.png",handler:this.redirectViews.createDelegate(this,[_64,i,e],false)}),new Ext.menu.Item({text:acs_lang_text.deletefs||"Delete",icon:"/resources/ajaxhelper/icons/delete.png",handler:this.delItem.createDelegate(this,[_64,i,e],false)}),new Ext.menu.Item({text:acs_lang_text.rename||"Rename",icon:"/resources/ajaxhelper/icons/page_edit.png",handler:this.renameItem.createDelegate(this,[_64,i,e],false)}),new Ext.menu.Item({text:acs_lang_text.linkaddress||"Copy Link Address",icon:"/resources/ajaxhelper/icons/page_copy.png",handler:this.copyLink.createDelegate(this,[_64,i,e],false)}),new Ext.menu.Item({text:acs_lang_text.permissions||"Permissions",icon:"/resources/ajaxhelper/icons/group_key.png",handler:this.redirectPerms.createDelegate(this,[_64,i,e],false)}),new Ext.menu.Item({text:acs_lang_text.properties||"Properties",icon:"/resources/ajaxhelper/icons/page_edit.png",handler:this.showRevisions.createDelegate(this,[_64,i,e],false)}),new Ext.menu.Item({text:acs_lang_text.download_archive||"Download archive",icon:"/resources/ajaxhelper/icons/arrow_down.png",handler:this.downloadArchive.createDelegate(this,[_6c],false)}),new Ext.menu.Item({text:acs_lang_text.sharefolder||"Share Folder",icon:"/resources/ajaxhelper/icons/group_link.png",handler:this.showShareOptions.createDelegate(this,[_64,i,e],false)})]});
if(_64.getSelectionModel().getCount()>1){
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
switch(_6b){
case "folder":
this.contextmenu.items.items[1].hide();
this.contextmenu.items.items[7].hide();
this.contextmenu.items.items[8].show();
if(_67.getNodeById(_6c).attributes.attributes.type=="symlink"){
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
if(_68.attributes["write_p"]=="f"){
this.contextmenu.items.items[1].hide();
this.contextmenu.items.items[3].hide();
this.contextmenu.items.items[6].hide();
this.contextmenu.items.items[7].hide();
this.contextmenu.items.items[9].hide();
}
var _6e=e.getXY();
this.contextmenu.rowid=i;
this.contextmenu.showAt([_6e[0],_6e[1]]);
},loadFoldercontents:function(_6f,e){
this.currentfolder=_6f.id;
var _71=this.layout.findById("filepanel");
_71.store.baseParams["folder_id"]=_6f.id;
_71.store.baseParams["package_id"]=this.config.package_id;
if(_6f.loading){
_6f.on("expand",function(){
this.store.load();
},_71,{single:true});
}else{
_71.store.load();
}
},openItem:function(_72,i,e){
var _75=this.layout.findById("treepanel");
var dm=_72.store;
var _77=dm.getAt(i);
if(_77.get("type")=="folder"||_77.get("type")=="symlink"){
var _78=_75.getNodeById(_77.get("id"));
if(!_78.parentNode.isExpanded()){
_78.parentNode.expand();
}
_78.fireEvent("click",_78);
_78.expand();
}else{
window.open(_77.get("url"));
window.focus();
}
},delItem:function(_79,i,e){
var _7c=acs_lang_text.confirm_delete||"Are you sure you want to delete ";
var _7d=acs_lang_text.foldercontains||"This folder contains";
var _7e=this.layout.findById("treepanel");
if(_79.id=="filepanel"){
var _7f=_79;
if(_7f.getSelectionModel().getCount()<=1){
_7f.getSelectionModel().selectRow(i);
}
}else{
var _7f=this.layout.findById("filepanel");
}
var _80=_7f.getSelectionModel().getSelections();
var _81=true;
if(_80.length>0){
_81=false;
if(_80.length==1){
var _82=_80[0].get("title");
if(_80[0].get("type")==="folder"){
var msg=_7d+" <b>"+_80[0].get("size")+"</b>.<br>";
}else{
var msg="";
}
var msg=msg+_7c+" <b>"+_82+"</b> ?";
if(_80[0].get("type")==="symlink"){
var _84=_80[0].get("symlink_id");
}else{
var _84=_80[0].get("id");
}
}else{
var msg=_7c+": <br><br>";
var _84=[];
for(var x=0;x<_80.length;x++){
msg=msg+"<b>"+_80[x].get("title")+"</b> ";
if(_80[x].get("type")==="folder"){
msg=msg+"("+_80[x].get("size")+")";
}
msg=msg+"<br>";
if(_80[x].get("type")==="symlink"){
_84[x]=_80[x].get("symlink_id");
}else{
_84[x]=_80[x].get("id");
}
}
}
var _86={object_id:_84};
}else{
_81=true;
var _87=_7e.getSelectionModel().getSelectedNode();
var _84=_87.attributes["id"];
var _88=_87.attributes.attributes["type"];
var _89=_87.attributes.attributes["symlink_id"];
var _8a=_7e.getRootNode();
if(_88=="symlink"){
var _86={object_id:_89};
}else{
var _86={object_id:_84};
}
if(_87.attributes["id"]==_8a.attributes["id"]){
Ext.Msg.alert(acs_lang_text.alert||"Alert",acs_lang_text.cant_del_root||"The root folder can not be deleted.");
return;
}else{
var msg=_7d+" <b>"+_87.attributes.attributes["size"]+"</b>.<br>";
msg=msg+_7c+" <b>"+_87.attributes["text"]+"</b>?";
}
}
var _8b=function(_8c){
if(_8c==="yes"){
Ext.Ajax.request({url:this.xmlhttpurl+"delete-fsitem",success:function(_8d){
var _8e=Ext.decode(_8d.responseText);
if(_8e.success){
if(_81){
var _8f=_7e.getSelectionModel().getSelectedNode();
var _90=_8f.parentNode;
_90.fireEvent("click",_90);
_90.removeChild(_8f);
}else{
for(var x=0;x<_80.length;x++){
_7f.store.remove(_80[x]);
var _92=_80[x].get("id");
var _8f=_7e.getNodeById(_92);
if(_8f){
_8f.parentNode.fireEvent("click",_8f.parentNode);
_8f.parentNode.removeChild(_8f);
}
}
}
}else{
Ext.Msg.alert(acs_lang_text.error||"Error","Sorry, we encountered an error.");
}
},failure:function(){
Ext.Msg.alert(acs_lang_text.error||"Error",error_msg_txt+"<br><br><font color='red'>"+resultObj.error+"</font>");
},params:_86});
}
};
Ext.MessageBox.confirm(acs_lang_text.confirm||"Confirm",msg,_8b,this);
},addFolder:function(){
var te=this.te;
var _94=this.layout.findById("treepanel");
var _95=_94.getSelectionModel().getSelectedNode();
_95.expand();
var _96=acs_lang_text.new_folder_error||"Sorry, there was an error trying to create your new folder.";
Ext.Ajax.request({url:this.xmlhttpurl+"add-blankfolder",success:function(_97){
var _98=Ext.decode(_97.responseText);
if(_98.success){
var _99=_95.appendChild(new Ext.tree.TreeNode({text:_98.pretty_folder_name,id:_98.id,iconCls:"folder",singleClickExpand:true,attributes:{write_p:"t"}}));
_94.getSelectionModel().select(_99);
_99.loaded=true;
_99.fireEvent("click",_99);
setTimeout(function(){
te.editNode=_99;
te.startEdit(_99.ui.textNode);
},10);
}else{
Ext.Msg.alert(acs_lang_text.error||"Error",_96+"<br><br><font color='red'>"+_98.error+"</font>");
}
},failure:function(_9a){
var _9b=Ext.decode(_9a.responseText);
Ext.Msg.alert(acs_lang_text.error||"Error",_96+"<br><br><font color='red'>"+_9b.error+"</font>");
},params:{folder_id:_95.attributes["id"]}});
},createSwfObj:function(){
var _9c=this;
var _9d=_9c.layout.findById("treepanel");
var _9e=_9c.currentfolder;
if(this.swfu==null){
var _9f=String(this.config.package_id);
var _a0=String(this.config.user_id);
var _a1=String(this.currentfolder);
var _a2=String(this.config.max_file_size);
var _a3=function(_a4,_a5){
try{
var _a6=Math.ceil((_a5/_a4.size)*100);
var _a7=new FileProgress(_a4,this.getSetting("progress_target"));
_a7.SetProgress(_a6);
_a7.SetStatus(acs_lang_text.uploading||"Uploading...");
}
catch(ex){
this.debugMessage(ex);
}
};
var _a8=function(_a9){
try{
var _aa=new FileProgress(_a9,this.getSetting("progress_target"));
_aa.SetCancelled();
_aa.SetStatus(acs_lang_text.uploadcancel||"Cancelled (This item will be removed shortly)");
_aa.ToggleCancel(false);
}
catch(ex){
this.debugMessage(ex);
}
};
var _ab=function(_ac){
try{
var _ad=new FileProgress(_ac,this.getSetting("progress_target"));
_ad.SetComplete();
_ad.SetStatus(acs_lang_text.complete||"Complete.");
_ad.ToggleCancel(false);
}
catch(ex){
this.debugMessage(ex);
}
};
var _ae=function(_af){
var _b0=_9d.getNodeById(_9c.currentfolder);
_b0.fireEvent("click",_b0);
};
var _b1=function(_b2,_b3,_b4){
try{
if(_b2==SWFUpload.ERROR_CODE_QUEUE_LIMIT_EXCEEDED){
Ext.Msg.alert(acs_lang_text.alert||"Alert","You have attempted to queue too many files.\n"+(_b4==0?"You have reached the upload limit.":"You may select "+(_b4>1?"up to "+_b4+" files.":"one file.")));
return;
}
var _b5=new FileProgress(_b3,this.getSetting("progress_target"));
_b5.SetError();
_b5.ToggleCancel(false);
switch(_b2){
case SWFUpload.ERROR_CODE_HTTP_ERROR:
_b5.SetStatus("Upload Error");
this.debugMessage("Error Code: HTTP Error, File name: "+file.name+", Message: "+_b4);
break;
case SWFUpload.ERROR_CODE_MISSING_UPLOAD_TARGET:
_b5.SetStatus("Configuration Error");
this.debugMessage("Error Code: No backend file, File name: "+file.name+", Message: "+_b4);
break;
case SWFUpload.ERROR_CODE_UPLOAD_FAILED:
_b5.SetStatus("Upload Failed.");
this.debugMessage("Error Code: Upload Failed, File name: "+file.name+", File size: "+file.size+", Message: "+_b4);
break;
case SWFUpload.ERROR_CODE_IO_ERROR:
_b5.SetStatus("Server (IO) Error");
this.debugMessage("Error Code: IO Error, File name: "+file.name+", Message: "+_b4);
break;
case SWFUpload.ERROR_CODE_SECURITY_ERROR:
_b5.SetStatus("Security Error");
this.debugMessage("Error Code: Security Error, File name: "+file.name+", Message: "+_b4);
break;
case SWFUpload.ERROR_CODE_FILE_EXCEEDS_SIZE_LIMIT:
_b5.SetStatus("File is too big.");
this.debugMessage("Error Code: File too big, File name: "+file.name+", File size: "+file.size+", Message: "+_b4);
break;
case SWFUpload.ERROR_CODE_ZERO_BYTE_FILE:
_b5.SetStatus("Cannot upload Zero Byte files.");
this.debugMessage("Error Code: Zero byte file, File name: "+file.name+", File size: "+file.size+", Message: "+_b4);
break;
case SWFUpload.ERROR_CODE_UPLOAD_LIMIT_EXCEEDED:
_b5.SetStatus("Upload limit exceeded.");
this.debugMessage("Error Code: Upload Limit Exceeded, File name: "+file.name+", File size: "+file.size+", Message: "+_b4);
break;
default:
_b5.SetStatus("Unhandled Error");
this.debugMessage("Error Code: "+_b2+", File name: "+file.name+", File size: "+file.size+", Message: "+_b4);
break;
}
}
catch(ex){
this.debugMessage(ex);
}
};
var _b6=function(_b7){
var _b8=acs_lang_text.for_upload_to||"for upload to";
var _b9=acs_lang_text.zip_extracted||"Zip File (Will be extracted after upload)";
try{
var _ba=_9c.currentfolder;
var _bb=_9d.getNodeById(_ba).text;
var _bc=new FileProgress(_b7,this.getSetting("progress_target"));
_bc.SetStatus(_b8+" <b>"+_bb+"</b><br>Title: <input type='text' onblur=\"fsInstance.swfu.removeFileParam('"+_b7.id+"','filetitle');fsInstance.swfu.addFileParam('"+_b7.id+"','filetitle',this.value)\">(optional)<br><input type='checkbox' id='zip"+_b7.id+"' onclick=\"if(document.getElementById('zip"+_b7.id+"').checked) { fsInstance.swfu.addFileParam('"+_b7.id+"','unpack_p','1') } else { fsInstance.swfu.removeFileParam('"+_b7.id+"','unpack_p') }\"> "+_b9);
_bc.ToggleCancel(true,this);
this.addFileParam(_b7.id,"folder_id",_ba);
}
catch(ex){
this.debugMessage(ex);
}
};
this.swfu=new SWFUpload({debug:false,upload_target_url:this.xmlhttpurl+"add-file-flash",upload_params:{user_id:_a0,package_id:_9f},file_types:"*.*",file_size_limit:_a2,file_queue_limit:0,file_upload_limit:10,begin_upload_on_queue:false,file_queued_handler:_b6,file_progress_handler:_a3,file_cancelled_handler:_a8,file_complete_handler:_ab,queue_complete_handler:_ae,error_handler:_b1,flash_url:"/resources/ajax-filestorage-ui/swfupload/swfupload.swf"});
}
},addFile:function(){
if(this.upldWindow==null){
if(!this.config.multi_file_upload||checkFlashVersion()<9||Ext.isLinux){
var _bd=acs_lang_text.file_to_upload||"File to upload";
var _be=acs_lang_text.file_title||"Title";
var _bf=acs_lang_text.file_description||"Description";
var _c0=acs_lang_text.multiple_files||"Multiple Files";
var _c1=acs_lang_text.multiple_files_msg||"This is a ZIPfile containing multiple files.";
var _c2=true;
var _c3="Upload a File";
var _c4=new Ext.Panel({id:"form_addfile",align:"left",frame:true,html:"<form id=\"newfileform\" method=\"post\" enctype=\"multipart/form-data\"><input type=\"hidden\" name=\"package_id\" value=\""+this.config.package_id+"\"><input type=\"hidden\" name=\"folder_id\" value=\""+this.currentfolder+"\"><p>"+_bd+"<br /><input type=\"file\" name=\"upload_file\" id=\"upload_file\"></p><br><p>"+_be+"<br /><input type=\"text\" name=\"filetitle\" id=\"filetitle\"></p><br><p>"+_bf+" :<br /><textarea name=\"filedescription\" id=\"filedescription\"></textarea></p><p>"+_c0+" :<br /><br /><input type=\"checkbox\" name=\"unpack_p\" value=\"t\" id=\"unpack_p\" /> "+_c1+"</p></form>"});
var _c5=[{text:"Upload",handler:this.uploadOneFile.createDelegate(this),icon:"/resources/ajaxhelper/icons/arrow_up.png",cls:"x-btn-text-icon"},{text:"Close",handler:function(){
this.upldWindow.hide();
}.createDelegate(this),icon:"/resources/ajaxhelper/icons/cross.png",cls:"x-btn-text-icon"}];
}else{
this.createSwfObj();
var _c6=acs_lang_text.upload_intro||"Click <b>Browse</b> to select a file to upload to the selected folder on the tree.";
var _c2=false;
var _c3="Upload Files";
var _c4=new Ext.Panel({id:"form_multi_addfile",autoScroll:true,frame:true,html:"<div id=\"upldMsg\">"+_c6+"<hr></div><div class=\"flash\" id=\"fsuploadprogress\"></div>"});
_c4.on("render",function(){
this.swfu.addSetting("progress_target","fsuploadprogress");
},this);
var _c5=[{text:"Browse",handler:this.swfu.browse.createDelegate(this.swfu),icon:"/resources/ajaxhelper/icons/page_add.png",cls:"x-btn-text-icon"},{text:"Upload",handler:this.swfu.startUpload.createDelegate(this.swfu,[null,this],false),icon:"/resources/ajaxhelper/icons/arrow_up.png",cls:"x-btn-text-icon"},{text:"Hide",handler:function(){
this.upldWindow.hide();
}.createDelegate(this),icon:"/resources/ajaxhelper/icons/cross.png",cls:"x-btn-text-icon"}];
}
this.upldWindow=new Ext.Window({id:"upload-win",layout:"fit",width:400,height:300,title:_c3,closeAction:"hide",modal:_c2,plain:true,resizable:false,items:_c4,buttons:_c5});
}else{
if(!this.config.multi_file_upload||checkFlashVersion()<9||Ext.isLinux){
document.getElementById("newfileform").folder_id.value=this.currentfolder;
}
}
this.upldWindow.show();
},uploadOneFile:function(){
if(Ext.get("upload_file").getValue()!=""&&Ext.get("filetitle").getValue()!=""){
var _c7=this.layout.findById("treepanel");
var _c8={success:function(){
},upload:function(){
_c7.getSelectionModel().getSelectedNode().loaded=false;
_c7.getSelectionModel().getSelectedNode().fireEvent("click",_c7.getSelectionModel().getSelectedNode());
this.upldWindow.body.unmask();
this.upldWindow.hide();
},failure:function(){
Ext.Msg.alert(acs_lang_text.error||"Error",acs_lang_text.upload_failed||"Upload failed, please try again later.");
},scope:this};
var _c9=acs_lang_text.loading||"One moment. This may take a while depending on how large your upload is.";
this.upldWindow.body.mask("<img src='/resources/ajaxhelper/images/indicator.gif'><br>"+_c9);
YAHOO.util.Connect.setForm("newfileform",true,true);
var _ca=YAHOO.util.Connect.asyncRequest("POST",this.xmlhttpurl+"add-file",_c8);
}else{
Ext.Msg.alert(acs_lang_text.alert||"Alert",acs_lang_text.file_required||"<b>Title</b> and <b>File to upload</b> are required.");
}
},addUrl:function(){
if(this.createurlWindow==null){
this.createurlWindow=new Ext.Window({id:"createurl-win",layout:"fit",width:400,height:180,title:"Create URL",closeAction:"hide",modal:true,plain:true,resizable:false,items:new Ext.FormPanel({id:"form_create_url",align:"left",autoScroll:true,closable:true,layout:"form",defaults:{width:230},frame:true,buttonAlign:"left",items:[{xtype:"textfield",fieldLabel:"Title",allowBlank:false,name:"fstitle",tabIndex:1},{xtype:"textfield",fieldLabel:"URL",allowBlank:false,name:"fsurl",tabIndex:2,validator:isURL},{xtype:"textfield",fieldLabel:"Description",name:"fsdescription",tabIndex:3}]}),buttons:[{text:"Submit",handler:function(){
this.createurlWindow.findById("form_create_url").getForm().submit({url:this.xmlhttpurl+"add-url",waitMsg:"One moment ....",params:{package_id:this.config.package_id,folder_id:this.currentfolder},reset:true,scope:this,success:function(_cb,_cc){
if(_cc.result){
var _cd=this.layout.findById("treepanel");
_cd.getSelectionModel().getSelectedNode().fireEvent("click",_cd.getSelectionModel().getSelectedNode());
this.createurlWindow.hide();
}else{
Ext.MessageBox.alert("Error","Sorry an error occured.<br>"+_cc.result.error);
}
},failure:function(_ce,_cf){
if(_cf.result){
Ext.MessageBox.alert("Error",_cf.result.error);
}
}});
}.createDelegate(this),icon:"/resources/ajaxhelper/icons/disk.png",cls:"x-btn-text-icon"},{text:"Close",handler:function(){
this.createurlWindow.hide();
}.createDelegate(this),icon:"/resources/ajaxhelper/icons/cross.png",cls:"x-btn-text-icon"}]});
}
this.createurlWindow.show();
},renameItem:function(_d0,i,e){
if(_d0.id=="treepanel"){
var _d3=_d0.getSelectionModel().getSelectedNode();
this.te.triggerEdit(_d3);
}else{
var _d4=_d0;
var _d5=this.layout.findById("treepanel");
var _d3=_d4.store.getAt(i);
var _d6=_d3.get("url");
var _d7=_d3.get("type");
var _d8=_d3.get("id");
var _d9=_d3.get("filename");
var _da=function(_db){
var _dc=acs_lang_text.an_error_occurred||"An error occurred";
var _dd=acs_lang_text.reverted||"Your changes have been reverted";
var _de=Ext.decode(_db.responseText);
if(!_de.success){
Ext.Msg.alert(acs_lang_text.error||"Error",_dc+": <br><br><font color='red'>"+_de.error+"</font><br><br>"+_dd);
}else{
if(_d7=="folder"){
_d5.getNodeById(_d8).setText(_de.newname);
}
if(_d7!="folder"&&_d9===" "){
_d9=_d3.get("title");
_d3.set("filename",_d9);
}
_d3.set("title",_de.newname);
_d3.commit();
}
};
var _df=function(btn,_e1){
if(btn=="ok"){
if(_e1!=""){
if(_e1.length>100){
Ext.Msg.alert(acs_lang_text.alert||"Alert",acs_lang_text.limitto100||"Please limit your name to 100 characters or less.");
return false;
}else{
Ext.Ajax.request({url:this.xmlhttpurl+"edit-name",success:_da,failure:function(_e2){
var _e3=Ext.decode(_e2.responseText);
Ext.Msg.alert(acs_lang_text.error||"Error",error_msg_txt+"<br><br><font color='red'>"+_e3.error+"</font>");
},params:{newname:_e1,object_id:_d8,type:_d7,url:_d6}});
}
}else{
Ext.Msg.alert(acs_lang_text.alert||"Alert",acs_lang_text.enter_new_name||"Please enter a new name.");
return false;
}
}
};
Ext.Msg.show({title:acs_lang_text.rename||"Rename",prompt:true,msg:acs_lang_text.enter_new_name||"Please enter a new name for ... ",value:_d3.get("title"),buttons:Ext.Msg.OKCANCEL,fn:_df.createDelegate(this)});
var _e4=YAHOO.util.Dom.getElementsByClassName("ext-mb-input","input");
_e4[0].select();
}
},tagFsitem:function(_e5,i,e){
var _e8=_e5;
var _e9=_e8.store.getAt(i);
var _ea=_e9.get("id");
var _eb=_e9.get("tags");
var _ec=this.config.package_id;
var _ed=this.layout.findById("tagcloudpanel");
var _ee=this.xmlhttpurl;
var _ef=this.tagWindow;
var _f0=function(){
Ext.Ajax.request({url:this.xmlhttpurl+"add-tag",success:function(){
_e9.data.tags=Ext.get("fstags").getValue();
_e9.commit();
_ed.load({url:_ee+"get-tagcloud",params:{package_id:_ec}});
_ef.hide();
},failure:function(_f1){
Ext.Msg.alert(acs_lang_text.error||"Error","Sorry, we encountered an error.");
},params:{object_id:_e9.id,package_id:_ec,tags:Ext.get("fstags").getValue()}});
};
if(_ef==null){
var _f2=new Ext.Panel({id:"form_addtag",autoScroll:true,frame:true,html:"<div style='text-align:left' class='yui-skin-sam'><p>Enter or edit one or more tags. Use commas (,) to separate the tags:<br ><br><div class='yui-ac'><input type='text' name='fstags' id='fstags' size='60' autocomplete='off' value='"+_eb+"'><div id='oAutoCompContainer1' class='yui-ac-container'></div></div>"});
var _f3=[{text:"Ok",icon:"/resources/ajaxhelper/icons/disk.png",cls:"x-btn-text-icon",handler:_f0.createDelegate(this)},{text:"Cancel",icon:"/resources/ajaxhelper/icons/cross.png",cls:"x-btn-text-icon",handler:function(){
_ef.hide();
}.createDelegate(this)}];
_ef=new Ext.Window({id:"tag-win",layout:"fit",width:450,height:300,title:"Tags",closeAction:"hide",modal:true,plain:true,autoScroll:false,resizable:false,items:_f2,buttons:_f3});
}
_ef.show();
this.initTagAutoComplete();
},initTagAutoComplete:function(){
var _f4=new YAHOO.widget.DS_JSArray(oAutoCompArr);
if(document.getElementById("fstags")){
var _f5=new YAHOO.widget.AutoComplete("fstags","oAutoCompContainer1",_f4);
_f5.animHoriz=false;
_f5.animVert=false;
_f5.queryDelay=0;
_f5.maxResultsDisplayed=10;
_f5.useIFrame=true;
_f5.delimChar=",";
_f5.allowBrowserAutocomplete=false;
_f5.typeAhead=true;
_f5.formatResult=function(_f6,_f7){
var _f8=_f6[0];
return _f8;
};
}
},downloadArchive:function(_f9){
if(_f9){
top.location.href=this.config.package_url+"download-archive/?object_id="+_f9;
}
},showShareOptions:function(_fa,i,e){
var _fd=_fa;
var _fe=_fd.store.getAt(i);
var _ff=_fe.get("id");
var _100=_fe.get("title");
var _101=this.layout.findById("treepanel");
var _102=this.config.package_id;
var _103=this.xmlhttpurl;
var _104=this.sharefolderWindow;
var _105=function(){
var _106=_101.getSelectionModel().getSelectedNode();
_106.loaded=false;
_106.collapse();
_106.fireEvent("click",_106);
_106.expand();
_104.hide();
};
var _107=function(){
var _108=this.communityCombo.getValue();
Ext.Ajax.request({url:this.xmlhttpurl+"share-folder",success:_105,failure:function(_109){
Ext.Msg.alert("Error","Sorry, we encountered an error. Please try again later.");
},params:{target_folder_id:_108,folder_id:_ff}});
};
if(_104==null){
var _10a=new Ext.data.JsonStore({url:_103+"list-communities",root:"communities",fields:["target_folder_id","instance_name"]});
this.communityCombo=new Ext.form.ComboBox({id:"communities_list",store:_10a,displayField:"instance_name",typeAhead:true,fieldLabel:"Community",triggerAction:"all",emptyText:"Select a community",hiddenName:"target_folder_id",valueField:"target_folder_id",forceSelection:true,handleHeight:80,selectOnFocus:true});
var _10b=new Ext.form.FormPanel({id:"sharefolderform",title:"Select the community where you wish to share the <b>"+_100+"</b> folder with.",frame:true,items:this.communityCombo});
var _10c=[{text:"Ok",icon:"/resources/ajaxhelper/icons/disk.png",cls:"x-btn-text-icon",handler:_107.createDelegate(this)},{text:"Cancel",icon:"/resources/ajaxhelper/icons/cross.png",cls:"x-btn-text-icon",handler:function(){
_104.hide();
}.createDelegate(this)}];
_104=new Ext.Window({id:"share-win",layout:"fit",width:380,height:200,title:"Share Folder",closeAction:"hide",modal:true,plain:true,autoScroll:false,resizable:false,items:_10b,buttons:_10c});
this.sharefolderWindow=_104;
}else{
this.sharefolderWindow.findById("sharefolderform").setTitle("Select the community where you wish to share the <b>"+_100+"</b> folder with.");
this.communityCombo.reset();
}
_104.show();
},redirectViews:function(_10d,i,e){
if(_10d.id=="filepanel"){
var _110=_10d;
var node=_110.store.getAt(i);
var _112=node.get("id");
}else{
var _112=i;
}
window.open(window.location.protocol+"//"+window.location.hostname+"/o/"+_112+"/info");
window.focus();
},redirectPerms:function(_113,i,e){
if(_113.id=="filepanel"){
var _116=grid;
var node=_116.store.getAt(i);
var _118=node.get("id");
}else{
var _118=i;
}
var _119=window.open(window.location.protocol+"//"+window.location.hostname+":"+window.location.port+this.config.package_url+"permissions?object_id="+_118+"&return_url="+window.location.pathname+"?package_id="+this.config.package_id+"&folder_id="+this.currentfolder);
_119.focus();
},redirectProperties:function(grid,i,e){
var _11d=grid;
var node=_11d.store.getAt(i);
var _11f=node.get("id");
var _120=window.open(window.location.protocol+"//"+window.location.hostname+":"+window.location.port+this.config.package_url+"file?file_id="+_11f);
_120.focus();
},showRevisions:function(grid,i,e){
var _124=grid;
var node=_124.store.getAt(i);
_124.getSelectionModel().selectRow(i);
var _126=node.get("id");
var _127=node.get("filename");
var _128=this.revisionsWindow;
if(_128==null){
_128=new Ext.Window({id:"rev-win",layout:"fit",width:550,height:300,closeAction:"hide",modal:true,plain:true,items:new Ext.TabPanel({id:"rev-tabs",items:[this.createRevGrid(),this.newRevForm()]})});
this.revisionsWindow=_128;
}
_128.setTitle(_127+" - "+acs_lang_text.properties||"Properties");
var _129=_128.findById("revisionspanel");
var _12a=_128.findById("rev-tabs");
var _12b=_128.findById("rev-form");
var _12c=this.config.package_id;
_129.store.on("load",function(){
this.getSelectionModel().selectFirstRow();
},_129);
_129.on("activate",function(){
this.store.baseParams["file_id"]=_126;
this.store.baseParams["package_id"]=_12c;
this.store.load();
},_129);
_128.on("beforehide",function(){
this.activate(1);
},_12a);
_128.on("show",function(){
this.activate(0);
},_12a);
_128.show();
},createRevGrid:function(){
var cols=[{header:"",width:30,sortable:false,dataIndex:"icon"},{header:"Title",width:180,sortable:false,dataIndex:"title"},{header:"Author",sortable:false,dataIndex:"author"},{header:"Size",sortable:false,dataIndex:"size"},{header:"Last Modified",sortable:false,dataIndex:"lastmodified"}];
var _12e=new Ext.data.JsonReader({totalProperty:"total",root:"revisions",id:"revision_id"},[{name:"revision_id",type:"int"},{name:"icon"},{name:"title"},{name:"author"},{name:"type"},{name:"size"},{name:"url"},{name:"lastmodified"}]);
var _12f=new Ext.data.HttpProxy({url:this.xmlhttpurl+"get-filerevisions"});
var _130=new Ext.grid.ColumnModel(cols);
var _131=new Ext.data.Store({proxy:_12f,reader:_12e});
var _132=[{text:"Download",tooltip:"Download this revision",icon:"/resources/ajaxhelper/icons/arrow_down.png",cls:"x-btn-text-icon",handler:function(){
var grid=this.revisionsWindow.findById("revisionspanel");
var _134=grid.getSelectionModel().getSelected();
window.open(_134.get("url"));
window.focus();
}.createDelegate(this)},{text:"Delete",tooltip:"Delete this revision",icon:"/resources/ajaxhelper/icons/delete.png",cls:"x-btn-text-icon",handler:function(){
var grid=this.revisionsWindow.findById("revisionspanel");
var sm=grid.getSelectionModel();
var _137=sm.getSelected();
var _138=_137.get("revision_id");
var _139=_137.get("title");
var _13a=this.xmlhttpurl;
if(grid.store.getCount()==1){
Ext.Msg.alert("Warning","Sorry, you can not delete the only revision for this file. You can delete the file instead");
}else{
Ext.Msg.confirm("Delete","Are you sure you want to delete this version of "+_139+" ? This action can not be reversed.",function(btn){
if(btn=="yes"){
Ext.Ajax.request({url:_13a+"delete-fileversion",params:{version_id:_138},success:function(o){
sm.selectPrevious();
grid.store.remove(_137);
},failure:function(){
Ext.Msg.alert("Delete Error","Sorry an error occurred. Please try again later.");
}});
}
});
}
}.createDelegate(this)}];
var _13d=new Ext.grid.GridPanel({store:_131,cm:_130,sm:new Ext.grid.RowSelectionModel({singleSelect:true}),id:"revisionspanel",title:"Revisions",loadMask:true,tbar:_132});
return _13d;
},newRevForm:function(){
var msg1="Please choose a file to upload";
var _13f=new Ext.Panel({id:"rev-form",align:"left",frame:true,title:"New Revision",html:"<form id=\"newrevfileform\" name=\"newrevfileform\" method=\"post\" enctype=\"multipart/form-data\"><input type=\"hidden\" name=\"package_id\" value=\""+this.config.package_id+"\"><input type=\"hidden\" name=\"file_id\" id=\"rev_file_id\" value=\"\"><input type=\"hidden\" name=\"title\" id=\"rev_file_title\" value=\"\"><p>"+msg1+"<br /><br /><input type=\"file\" name=\"upload_file\" size='35' id=\"rev_upload_file\"></p></form>",buttons:[{text:"Upload New Revision",handler:function(_140){
if(Ext.get("rev_upload_file").dom.value==""){
Ext.Msg.alert("Warning","Please choose a file to upload");
}else{
var grid=this.layout.findById("filepanel");
var _142=grid.getSelectionModel().getSelected();
Ext.get("rev_file_id").dom.value=_142.get("id");
Ext.get("rev_file_title").dom.value=_142.get("title");
var _143={success:function(){
},upload:function(){
this.revisionsWindow.findById("rev-tabs").activate(0);
Ext.get("newrevfileform").dom.reset();
this.revisionsWindow.findById("rev-form").body.unmask();
_140.enable();
},failure:function(){
Ext.Msg.alert(acs_lang_text.error||"Error",acs_lang_text.upload_failed||"Upload failed, please try again later.");
this.revisionsWindow.findById("rev-form").body.unmask();
_140.enable();
},scope:this};
this.revisionsWindow.findById("rev-form").body.mask("<center><img src='/resources/ajaxhelper/images/indicator.gif'><br>Uploading new revision. Please wait</center>");
_140.disable();
YAHOO.util.Connect.setForm("newrevfileform",true,true);
var cObj=YAHOO.util.Connect.asyncRequest("POST",this.xmlhttpurl+"add-filerevision",_143);
}
}.createDelegate(this),icon:"/resources/ajaxhelper/icons/arrow_up.png",cls:"x-btn-text-icon"}]});
return _13f;
},copyLink:function(_145,i,e){
if(_145.id=="treepanel"){
var _148=window.location.protocol+"//"+window.location.hostname+":"+window.location.port+this.config.package_url+"?package_id="+this.config.package_id+"&folder_id="+i;
}else{
var _149=_145;
var node=_149.store.getAt(i);
var _14b=node.get("type");
if(_14b==="folder"){
var _148=window.location.protocol+"//"+window.location.hostname+":"+window.location.port+this.config.package_url+"?package_id="+this.config.package_id+"&folder_id="+node.get("id");
}else{
if(_14b==="url"){
var _148=node.get("url");
}else{
var _148=window.location.protocol+"//"+window.location.hostname+node.get("url");
}
}
}
if(Ext.isIE){
window.clipboardData.setData("text",_148);
}else{
var _14c=Ext.Msg.show({title:acs_lang_text.linkaddress||"Copy Link Address",prompt:true,msg:acs_lang_text.copyhighlighted||"Copy the highlighted text to your clipboard.",value:_148,buttons:Ext.Msg.OK});
var _14d=YAHOO.util.Dom.getElementsByClassName("ext-mb-input","input");
_14d[0].select();
}
}};
function readCookie(name){
var ca=document.cookie.split(";");
var _150=name+"=";
for(var i=0;i<ca.length;i++){
var c=ca[i];
while(c.charAt(0)==" "){
c=c.substring(1,c.length);
}
if(c.indexOf(_150)==0){
return c.substring(_150.length,c.length);
}
}
return null;
}
function createCookie(name,_154,days){
if(days){
var date=new Date();
date.setTime(date.getTime()+(days*24*60*60*1000));
var _157="; expires="+date.toGMTString();
}else{
var _157="";
}
document.cookie=name+"="+_154+_157+"; path=/";
}
function readQs(q){
var _159=window.location.search.substring(1);
var _15a=_159.split("&");
for(var i=0;i<_15a.length;i++){
var pos=_15a[i].indexOf("=");
if(pos>0){
var key=_15a[i].substring(0,pos);
var val=_15a[i].substring(pos+1);
if(key==q){
return val;
}
}
}
return null;
}
function checkFlashVersion(){
var x;
var _160;
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
function isURL(_161){
if(_161.indexOf(" ")!=-1){
return false;
}else{
if(_161.indexOf("http://")==-1){
return false;
}else{
if(_161=="http://"){
return false;
}else{
if(_161.indexOf("http://")>0){
return false;
}
}
}
}
_161=_161.substring(7,_161.length);
if(_161.indexOf(".")==-1){
return false;
}else{
if(_161.indexOf(".")==0){
return false;
}else{
if(_161.charAt(_161.length-1)=="."){
return false;
}
}
}
if(_161.indexOf("/")!=-1){
_161=_161.substring(0,_161.indexOf("/"));
if(_161.charAt(_161.length-1)=="."){
return false;
}
}
if(_161.indexOf(":")!=-1){
if(_161.indexOf(":")==(_161.length-1)){
return false;
}else{
if(_161.charAt(_161.indexOf(":")+1)=="."){
return false;
}
}
_161=_161.substring(0,_161.indexOf(":"));
if(_161.charAt(_161.length-1)=="."){
return false;
}
}
return true;
}
function FileProgress(_162,_163){
this.file_progress_id=_162.id;
this.opacity=100;
this.height=0;
this.fileProgressWrapper=document.getElementById(this.file_progress_id);
if(!this.fileProgressWrapper){
this.fileProgressWrapper=document.createElement("div");
this.fileProgressWrapper.className="progressWrapper";
this.fileProgressWrapper.id=this.file_progress_id;
this.fileProgressElement=document.createElement("div");
this.fileProgressElement.className="progressContainer";
var _164=document.createElement("a");
_164.className="progressCancel";
_164.href="#";
_164.style.visibility="hidden";
_164.appendChild(document.createTextNode(" "));
var _165=document.createElement("div");
_165.className="progressName";
_165.appendChild(document.createTextNode(_162.name));
var _166=document.createElement("div");
_166.className="progressBarInProgress";
var _167=document.createElement("div");
_167.className="progressBarStatus";
_167.innerHTML="&nbsp;";
this.fileProgressElement.appendChild(_164);
this.fileProgressElement.appendChild(_165);
this.fileProgressElement.appendChild(_167);
this.fileProgressElement.appendChild(_166);
this.fileProgressWrapper.appendChild(this.fileProgressElement);
document.getElementById(_163).appendChild(this.fileProgressWrapper);
}else{
this.fileProgressElement=this.fileProgressWrapper.firstChild;
}
this.height=this.fileProgressWrapper.offsetHeight;
}
FileProgress.prototype.SetProgress=function(_168){
this.fileProgressElement.className="progressContainer green";
this.fileProgressElement.childNodes[3].className="progressBarInProgress";
this.fileProgressElement.childNodes[3].style.width=_168+"%";
};
FileProgress.prototype.SetComplete=function(){
this.fileProgressElement.className="progressContainer blue";
this.fileProgressElement.childNodes[3].className="progressBarComplete";
this.fileProgressElement.childNodes[3].style.width="";
var _169=this;
setTimeout(function(){
_169.Disappear();
},10000);
};
FileProgress.prototype.SetError=function(){
this.fileProgressElement.className="progressContainer red";
this.fileProgressElement.childNodes[3].className="progressBarError";
this.fileProgressElement.childNodes[3].style.width="";
var _16a=this;
setTimeout(function(){
_16a.Disappear();
},5000);
};
FileProgress.prototype.SetCancelled=function(){
this.fileProgressElement.className="progressContainer";
this.fileProgressElement.childNodes[3].className="progressBarError";
this.fileProgressElement.childNodes[3].style.width="";
var _16b=this;
setTimeout(function(){
_16b.Disappear();
},2000);
};
FileProgress.prototype.SetStatus=function(_16c){
this.fileProgressElement.childNodes[2].innerHTML=_16c;
};
FileProgress.prototype.ToggleCancel=function(show,_16e){
this.fileProgressElement.childNodes[0].style.visibility=show?"visible":"hidden";
if(_16e){
var _16f=this.file_progress_id;
this.fileProgressElement.childNodes[0].onclick=function(){
_16e.cancelUpload(_16f);
return false;
};
}
};
FileProgress.prototype.Disappear=function(){
var _170=15;
var _171=4;
var rate=30;
if(this.opacity>0){
this.opacity-=_170;
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
this.height-=_171;
if(this.height<0){
this.height=0;
}
this.fileProgressWrapper.style.height=this.height+"px";
}
if(this.height>0||this.opacity>0){
var _173=this;
setTimeout(function(){
_173.Disappear();
},rate);
}else{
this.fileProgressWrapper.style.display="none";
}
};

