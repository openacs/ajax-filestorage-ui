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
if(this.config.create_url&&this.config.create_url==0){
this.create_url_p=false;
}
if(this.config.share_folders&&this.config.share_folders==0){
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
Ext.Msg.alert(acs_lang_text.error||"Error",_2f+"<br>"+_30);
},params:{folder_target_id:_2c,file_ids:_2d}});
return true;
}.createDelegate(this)}});
this.enableTreeFolderRename(_21);
_1f.on("expand",this.selectInitFolder,this,{single:true});
_21.on("click",this.loadFoldercontents,this);
return _21;
},enableTreeFolderRename:function(_3a){
this.te=new Ext.tree.TreeEditor(_3a,{allowBlank:false,blankText:acs_lang_text.folder_name_required||"A folder name is required",editDelay:20,ignoreNoChange:true});
this.te.on("beforestartedit",function(_3b,el,_3d){
if(_3b.editNode.attributes.attributes.write_p=="t"){
return true;
}else{
Ext.Msg.alert(acs_lang_text.permission_denied||"Permission Denied",acs_lang_text.permission_denied||"Sorry, you do not have permission to rename this folder");
return false;
}
},this,true);
this.te.on("beforecomplete",function(_3e,_3f,_40){
var _41=_3e.editNode.parentNode;
if(_41){
var _42=_41.childNodes;
for(x=0;x<_42.length;x++){
if(_42[x].text==_3f&&_42[x].id!=_3e.editNode.id){
Ext.Msg.alert(acs_lang_text.duplicate_name||"Duplicate Name",acs_lang_text.duplicate_name_error||"Please enter a different name. The name you entered is already being used.");
return false;
}
}
}
return true;
},this,true);
this.te.on("complete",function(_43,_44,_45){
var _46=acs_lang_text.an_error_occurred||"An error occurred";
var _47=acs_lang_text.reverted||"Your changes have been reverted";
Ext.Ajax.request({url:this.xmlhttpurl+"rename-fsitem",success:function(_48){
var _49=Ext.decode(_48.responseText);
if(!_49.success){
Ext.Msg.alert(acs_lang_text.error||"Error",_46+": <br><br><font color='red'>"+_49.error+"</font><br><br>"+_47);
_43.editNode.setText(_45);
}
},failure:function(){
Ext.Msg.alert(acs_lang_text.error||"Error",_46+"<br>"+_47);
_43.editNode.setText(_45);
},params:{newname:_44,object_id:_43.editNode.id,type:"folder"}});
},this,true);
},createTagPanel:function(){
var _4a=new Ext.Panel({id:"tagcloudpanel",title:"Tags",frame:false,loadMask:true,autoScroll:true,autoLoad:{url:this.xmlhttpurl+"get-tagcloud",params:{package_id:this.config.package_id}}});
var _4b=function(){
var _4c=this;
var _4d=_4c.currenttag;
_4a.body.on("click",function(obj,el){
if(el.tagName=="A"){
if(_4d!=null){
Ext.get(_4d).setStyle("font-weight","normal");
}
Ext.get(el).setStyle("font-weight","bold");
_4d=el.id;
this.loadTaggedFiles(el.id);
}
},this);
};
_4a.on("render",_4b,this);
return _4a;
},loadTaggedFiles:function(_50){
this.layout.findById("treepanel").getSelectionModel().clearSelections();
var id=_50.substring(3,_50.length);
this.layout.findById("filepanel").store.baseParams["tag_id"]=id;
this.layout.findById("filepanel").store.load();
this.layout.findById("filepanel").store.baseParams["tag_id"]="";
},createRight:function(){
var _52=[{header:"",width:30,sortable:true,dataIndex:"icon"},{header:acs_lang_text.filename||"Filename",id:"filename",sortable:true,dataIndex:"title"},{header:acs_lang_text.size||"Size",sortable:true,dataIndex:"size"},{header:acs_lang_text.lastmodified||"Last Modified",sortable:true,dataIndex:"lastmodified"}];
var _53=new Ext.data.JsonReader({totalProperty:"total",root:"foldercontents",id:"id"},[{name:"id",type:"int"},{name:"icon"},{name:"title"},{name:"filename"},{name:"type"},{name:"tags"},{name:"url"},{name:"linkurl"},{name:"write_p"},{name:"symlink_id"},{name:"size"},{name:"lastmodified"}]);
var _54=new Ext.data.HttpProxy({url:this.xmlhttpurl+"get-foldercontents"});
var _55=new Ext.grid.ColumnModel(_52);
var _56=new Ext.data.Store({proxy:_54,reader:_53,remoteSort:true});
var _57=new Ext.grid.GridPanel({store:_56,cm:_55,id:"filepanel",ddGroup:"fileDD",region:"center",split:true,autoScroll:true,autoExpandColumn:"filename",collapsible:true,enableDragDrop:true,width:250,loadMask:true,frame:false,viewConfig:{forceFit:false,enableRowBody:true,showPreview:true,getRowClass:function(_58,_59,p,ds){
var xf=Ext.util.Format;
if(_58.data.tags!=""){
p.body="<div id='tagscontainer"+_58.data.id+"' style='padding-left:35px;color:blue'>Tags: "+xf.ellipsis(xf.stripTags(_58.data.tags),200)+"</div>";
}else{
p.body="<div id='tagscontainer"+_58.data.id+"' style='padding-left:35px;color:blue'></div>";
}
return "x-grid3-row-expanded";
}}});
_57.on("rowdblclick",this.openItem,this,true);
_57.on("rowcontextmenu",this.showRowContext,this,true);
return _57;
},showRowContext:function(_5d,i,e){
e.stopEvent();
var _60=this.layout.findById("treepanel");
var dm=_5d.store;
var _62=dm.getAt(i);
var _63=_62.get("type");
var _64=_62.get("id");
if(_63=="folder"){
var _65="Open";
}else{
var _65="Download";
}
this.contextmenu=new Ext.menu.Menu({id:"rightclickmenu",items:[new Ext.menu.Item({text:_65,icon:"/resources/ajaxhelper/icons/page_white.png",handler:this.openItem.createDelegate(this,[_5d,i,e],false)}),new Ext.menu.Item({text:"Tag",icon:"/resources/ajaxhelper/icons/tag_blue.png",handler:this.tagFsitem.createDelegate(this,[_5d,i,e],false)}),new Ext.menu.Item({text:"Views",icon:"/resources/ajaxhelper/icons/camera.png",handler:this.redirectViews.createDelegate(this,[_5d,i,e],false)}),new Ext.menu.Item({text:acs_lang_text.deletefs||"Delete",icon:"/resources/ajaxhelper/icons/delete.png",handler:this.delItem.createDelegate(this,[_5d,i,e],false)}),new Ext.menu.Item({text:acs_lang_text.rename||"Rename",icon:"/resources/ajaxhelper/icons/page_edit.png",handler:this.renameItem.createDelegate(this,[_5d,i,e],false)}),new Ext.menu.Item({text:acs_lang_text.linkaddress||"Copy Link Address",icon:"/resources/ajaxhelper/icons/page_copy.png",handler:this.copyLink.createDelegate(this,[_5d,i,e],false)}),new Ext.menu.Item({text:acs_lang_text.permissions||"Permissions",icon:"/resources/ajaxhelper/icons/group_key.png",handler:this.redirectPerms.createDelegate(this,[_5d,i,e],false)}),new Ext.menu.Item({text:acs_lang_text.properties||"Properties",icon:"/resources/ajaxhelper/icons/page_edit.png",handler:this.redirectProperties.createDelegate(this,[_5d,i,e],false)}),new Ext.menu.Item({text:acs_lang_text.download_archive||"Download archive",icon:"/resources/ajaxhelper/icons/arrow_down.png",handler:this.downloadArchive.createDelegate(this,[_64],false)}),new Ext.menu.Item({text:acs_lang_text.sharefolder||"Share Folder",icon:"/resources/ajaxhelper/icons/group_link.png",handler:this.showShareOptions.createDelegate(this,[_5d,i,e],false)})]});
if(_5d.getSelectionModel().getCount()>1){
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
if(_63=="folder"){
this.contextmenu.items.items[1].hide();
this.contextmenu.items.items[7].hide();
this.contextmenu.items.items[8].show();
if(_60.getNodeById(_64).attributes.attributes.type=="symlink"){
this.contextmenu.items.items[9].hide();
}else{
this.contextmenu.items.items[9].show();
}
}else{
if(_63=="symlink"){
this.contextmenu.items.items[4].hide();
this.contextmenu.items.items[9].hide();
}else{
this.contextmenu.items.items[1].show();
this.contextmenu.items.items[7].show();
this.contextmenu.items.items[8].hide();
this.contextmenu.items.items[9].hide();
}
}
}
if(!this.share_folders_p){
this.contextmenu.items.items[9].hide();
}
var _66=e.getXY();
this.contextmenu.rowid=i;
this.contextmenu.showAt([_66[0],_66[1]]);
},loadFoldercontents:function(_67,e){
this.currentfolder=_67.id;
var _69=this.layout.findById("filepanel");
_69.store.baseParams["folder_id"]=_67.id;
_69.store.baseParams["package_id"]=this.config.package_id;
if(_67.loading){
_67.on("expand",function(){
this.store.load();
},_69,{single:true});
}else{
_69.store.load();
}
},openItem:function(_6a,i,e){
var _6d=this.layout.findById("treepanel");
var dm=_6a.store;
var _6f=dm.getAt(i);
if(_6f.get("type")=="folder"||_6f.get("type")=="symlink"){
var _70=_6d.getNodeById(_6f.get("id"));
if(!_70.parentNode.isExpanded()){
_70.parentNode.expand();
}
_70.fireEvent("click",_70);
_70.expand();
}else{
window.open(_6f.get("url"));
window.focus();
}
},delItem:function(_71,i,e){
var _74=acs_lang_text.confirm_delete||"Are you sure you want to delete ";
var _75=acs_lang_text.foldercontains||"This folder contains";
var _76=this.layout.findById("treepanel");
if(_71.id=="filepanel"){
var _77=_71;
if(_77.getSelectionModel().getCount()<=1){
_77.getSelectionModel().selectRow(i);
}
}else{
var _77=this.layout.findById("filepanel");
}
var _78=_77.getSelectionModel().getSelections();
var _79=true;
if(_78.length>0){
_79=false;
if(_78.length==1){
var _7a=_78[0].get("title");
if(_78[0].get("type")==="folder"){
var msg=_75+" <b>"+_78[0].get("size")+"</b>.<br>";
}else{
var msg="";
}
var msg=msg+_74+" <b>"+_7a+"</b> ?";
if(_78[0].get("type")==="symlink"){
var _7c=_78[0].get("symlink_id");
}else{
var _7c=_78[0].get("id");
}
}else{
var msg=_74+": <br><br>";
var _7c=[];
for(var x=0;x<_78.length;x++){
msg=msg+"<b>"+_78[x].get("title")+"</b> ";
if(_78[x].get("type")==="folder"){
msg=msg+"("+_78[x].get("size")+")";
}
msg=msg+"<br>";
if(_78[x].get("type")==="symlink"){
_7c[x]=_78[x].get("symlink_id");
}else{
_7c[x]=_78[x].get("id");
}
}
}
}else{
_79=true;
var _7e=_76.getSelectionModel().getSelectedNode();
var _7c=_7e.attributes["id"];
var _7f=_7e.attributes.attributes["type"];
var _80=_7e.attributes.attributes["symlink_id"];
var _81=_76.getRootNode();
if(_7f=="symlink"){
var _82={object_id:_80};
}else{
var _82={object_id:_7c};
}
if(_7e.attributes["id"]==_81.attributes["id"]){
Ext.Msg.alert(acs_lang_text.alert||"Alert",acs_lang_text.cant_del_root||"The root folder can not be deleted.");
return;
}else{
var msg=_74+" <b>"+_7e.attributes["text"]+"</b>?";
}
}
var _83=function(_84){
if(_84==="yes"){
Ext.Ajax.request({url:this.xmlhttpurl+"delete-fsitem",success:function(_85){
var _86=Ext.decode(_85.responseText);
if(_86.success){
if(_79){
var _87=_76.getSelectionModel().getSelectedNode();
var _88=_87.parentNode;
_88.fireEvent("click",_88);
_88.removeChild(_87);
}else{
for(var x=0;x<_78.length;x++){
_77.store.remove(_78[x]);
var _8a=_78[x].get("id");
var _87=_76.getNodeById(_8a);
if(_87){
_87.parentNode.fireEvent("click",_87.parentNode);
_87.parentNode.removeChild(_87);
}
}
}
}else{
Ext.Msg.alert(acs_lang_text.error||"Error","Sorry, we encountered an error.");
}
},failure:function(){
Ext.Msg.alert(acs_lang_text.error||"Error",error_msg_txt+"<br><br><font color='red'>"+resultObj.error+"</font>");
},params:_82});
}
};
Ext.MessageBox.confirm(acs_lang_text.confirm||"Confirm",msg,_83,this);
},addFolder:function(){
var te=this.te;
var _8c=this.layout.findById("treepanel");
var _8d=_8c.getSelectionModel().getSelectedNode();
_8d.expand();
var _8e=acs_lang_text.new_folder_error||"Sorry, there was an error trying to create your new folder.";
Ext.Ajax.request({url:this.xmlhttpurl+"add-blankfolder",success:function(_8f){
var _90=Ext.decode(_8f.responseText);
if(_90.success){
var _91=_8d.appendChild(new Ext.tree.TreeNode({text:_90.pretty_folder_name,id:_90.id,iconCls:"folder",singleClickExpand:true,attributes:{write_p:"t"}}));
_8c.getSelectionModel().select(_91);
_91.loaded=true;
_91.fireEvent("click",_91);
setTimeout(function(){
te.editNode=_91;
te.startEdit(_91.ui.textNode);
},10);
}else{
Ext.Msg.alert(acs_lang_text.error||"Error",_8e+"<br><br><font color='red'>"+_90.error+"</font>");
}
},failure:function(_92){
var _93=Ext.decode(_92.responseText);
Ext.Msg.alert(acs_lang_text.error||"Error",_8e+"<br><br><font color='red'>"+_93.error+"</font>");
},params:{folder_id:_8d.attributes["id"]}});
},createSwfObj:function(){
var _94=this;
var _95=_94.layout.findById("treepanel");
var _96=_94.currentfolder;
if(this.swfu==null){
var _97=String(this.config.package_id);
var _98=String(this.config.user_id);
var _99=String(this.currentfolder);
var _9a=String(this.config.max_file_size);
var _9b=function(_9c,_9d){
try{
var _9e=Math.ceil((_9d/_9c.size)*100);
var _9f=new FileProgress(_9c,this.getSetting("progress_target"));
_9f.SetProgress(_9e);
_9f.SetStatus(acs_lang_text.uploading||"Uploading...");
}
catch(ex){
this.debugMessage(ex);
}
};
var _a0=function(_a1){
try{
var _a2=new FileProgress(_a1,this.getSetting("progress_target"));
_a2.SetCancelled();
_a2.SetStatus(acs_lang_text.uploadcancel||"Cancelled (This item will be removed shortly)");
_a2.ToggleCancel(false);
}
catch(ex){
this.debugMessage(ex);
}
};
var _a3=function(_a4){
try{
var _a5=new FileProgress(_a4,this.getSetting("progress_target"));
_a5.SetComplete();
_a5.SetStatus(acs_lang_text.complete||"Complete.");
_a5.ToggleCancel(false);
}
catch(ex){
this.debugMessage(ex);
}
};
var _a6=function(_a7){
var _a8=_95.getNodeById(_94.currentfolder);
_a8.fireEvent("click",_a8);
};
var _a9=function(_aa,_ab,_ac){
try{
if(_aa==SWFUpload.ERROR_CODE_QUEUE_LIMIT_EXCEEDED){
Ext.Msg.alert(acs_lang_text.alert||"Alert","You have attempted to queue too many files.\n"+(_ac==0?"You have reached the upload limit.":"You may select "+(_ac>1?"up to "+_ac+" files.":"one file.")));
return;
}
var _ad=new FileProgress(_ab,this.getSetting("progress_target"));
_ad.SetError();
_ad.ToggleCancel(false);
switch(_aa){
case SWFUpload.ERROR_CODE_HTTP_ERROR:
_ad.SetStatus("Upload Error");
this.debugMessage("Error Code: HTTP Error, File name: "+file.name+", Message: "+_ac);
break;
case SWFUpload.ERROR_CODE_MISSING_UPLOAD_TARGET:
_ad.SetStatus("Configuration Error");
this.debugMessage("Error Code: No backend file, File name: "+file.name+", Message: "+_ac);
break;
case SWFUpload.ERROR_CODE_UPLOAD_FAILED:
_ad.SetStatus("Upload Failed.");
this.debugMessage("Error Code: Upload Failed, File name: "+file.name+", File size: "+file.size+", Message: "+_ac);
break;
case SWFUpload.ERROR_CODE_IO_ERROR:
_ad.SetStatus("Server (IO) Error");
this.debugMessage("Error Code: IO Error, File name: "+file.name+", Message: "+_ac);
break;
case SWFUpload.ERROR_CODE_SECURITY_ERROR:
_ad.SetStatus("Security Error");
this.debugMessage("Error Code: Security Error, File name: "+file.name+", Message: "+_ac);
break;
case SWFUpload.ERROR_CODE_FILE_EXCEEDS_SIZE_LIMIT:
_ad.SetStatus("File is too big.");
this.debugMessage("Error Code: File too big, File name: "+file.name+", File size: "+file.size+", Message: "+_ac);
break;
case SWFUpload.ERROR_CODE_ZERO_BYTE_FILE:
_ad.SetStatus("Cannot upload Zero Byte files.");
this.debugMessage("Error Code: Zero byte file, File name: "+file.name+", File size: "+file.size+", Message: "+_ac);
break;
case SWFUpload.ERROR_CODE_UPLOAD_LIMIT_EXCEEDED:
_ad.SetStatus("Upload limit exceeded.");
this.debugMessage("Error Code: Upload Limit Exceeded, File name: "+file.name+", File size: "+file.size+", Message: "+_ac);
break;
default:
_ad.SetStatus("Unhandled Error");
this.debugMessage("Error Code: "+_aa+", File name: "+file.name+", File size: "+file.size+", Message: "+_ac);
break;
}
}
catch(ex){
this.debugMessage(ex);
}
};
var _ae=function(_af){
var _b0=acs_lang_text.for_upload_to||"for upload to";
var _b1=acs_lang_text.zip_extracted||"Zip File (Will be extracted after upload)";
try{
var _b2=_94.currentfolder;
var _b3=_95.getNodeById(_b2).text;
var _b4=new FileProgress(_af,this.getSetting("progress_target"));
_b4.SetStatus(_b0+" <b>"+_b3+"</b><br>Title: <input type='text' onblur=\"fsInstance.swfu.removeFileParam('"+_af.id+"','filetitle');fsInstance.swfu.addFileParam('"+_af.id+"','filetitle',this.value)\">(optional)<br><input type='checkbox' id='zip"+_af.id+"' onclick=\"if(document.getElementById('zip"+_af.id+"').checked) { fsInstance.swfu.addFileParam('"+_af.id+"','unpack_p','1') } else { fsInstance.swfu.removeFileParam('"+_af.id+"','unpack_p') }\"> "+_b1);
_b4.ToggleCancel(true,this);
this.addFileParam(_af.id,"folder_id",_b2);
}
catch(ex){
this.debugMessage(ex);
}
};
this.swfu=new SWFUpload({debug:false,upload_target_url:this.xmlhttpurl+"add-file-flash",upload_params:{user_id:_98,package_id:_97},file_types:"*.*",file_size_limit:_9a,file_queue_limit:0,file_upload_limit:10,begin_upload_on_queue:false,file_queued_handler:_ae,file_progress_handler:_9b,file_cancelled_handler:_a0,file_complete_handler:_a3,queue_complete_handler:_a6,error_handler:_a9,flash_url:"/resources/ajax-filestorage-ui/swfupload/swfupload.swf"});
}
},addFile:function(){
if(this.upldWindow==null){
if(!this.config.multi_file_upload||checkFlashVersion()<9||Ext.isLinux){
var _b5=acs_lang_text.file_to_upload||"File to upload";
var _b6=acs_lang_text.file_title||"Title";
var _b7=acs_lang_text.file_description||"Description";
var _b8=acs_lang_text.multiple_files||"Multiple Files";
var _b9=acs_lang_text.multiple_files_msg||"This is a ZIPfile containing multiple files.";
var _ba=true;
var _bb="Upload a File";
var _bc=new Ext.Panel({id:"form_addfile",align:"left",frame:true,html:"<form id=\"newfileform\" method=\"post\" enctype=\"multipart/form-data\"><input type=\"hidden\" name=\"package_id\" value=\""+this.config.package_id+"\"><input type=\"hidden\" name=\"folder_id\" value=\""+this.currentfolder+"\"><p>"+_b5+"<br /><input type=\"file\" name=\"upload_file\" id=\"upload_file\"></p><br><p>"+_b6+"<br /><input type=\"text\" name=\"filetitle\" id=\"filetitle\"></p><br><p>"+_b7+" :<br /><textarea name=\"filedescription\" id=\"filedescription\"></textarea></p><p>"+_b8+" :<br /><br /><input type=\"checkbox\" name=\"unpack_p\" value=\"t\" id=\"unpack_p\" /> "+_b9+"</p></form>"});
var _bd=[{text:"Upload",handler:this.uploadOneFile.createDelegate(this),icon:"/resources/ajaxhelper/icons/arrow_up.png",cls:"x-btn-text-icon"},{text:"Close",handler:function(){
this.upldWindow.hide();
}.createDelegate(this),icon:"/resources/ajaxhelper/icons/cross.png",cls:"x-btn-text-icon"}];
}else{
this.createSwfObj();
var _be=acs_lang_text.upload_intro||"Click <b>Browse</b> to select a file to upload to the selected folder on the tree.";
var _ba=false;
var _bb="Upload Files";
var _bc=new Ext.Panel({id:"form_multi_addfile",autoScroll:true,frame:true,html:"<div id=\"upldMsg\">"+_be+"<hr></div><div class=\"flash\" id=\"fsuploadprogress\"></div>"});
_bc.on("render",function(){
this.swfu.addSetting("progress_target","fsuploadprogress");
},this);
var _bd=[{text:"Browse",handler:this.swfu.browse.createDelegate(this.swfu),icon:"/resources/ajaxhelper/icons/page_add.png",cls:"x-btn-text-icon"},{text:"Upload",handler:this.swfu.startUpload.createDelegate(this.swfu,[null,this],false),icon:"/resources/ajaxhelper/icons/arrow_up.png",cls:"x-btn-text-icon"},{text:"Hide",handler:function(){
this.upldWindow.hide();
}.createDelegate(this),icon:"/resources/ajaxhelper/icons/cross.png",cls:"x-btn-text-icon"}];
}
this.upldWindow=new Ext.Window({id:"upload-win",layout:"fit",width:400,height:300,title:_bb,closeAction:"hide",modal:_ba,plain:true,resizable:false,items:_bc,buttons:_bd});
}
this.upldWindow.show();
},uploadOneFile:function(){
if(Ext.get("upload_file").getValue()!=""&&Ext.get("filetitle").getValue()!=""){
var _bf=this.layout.findById("treepanel");
var _c0={success:function(){
},upload:function(){
_bf.getSelectionModel().getSelectedNode().loaded=false;
_bf.getSelectionModel().getSelectedNode().fireEvent("click",_bf.getSelectionModel().getSelectedNode());
this.upldWindow.body.unmask();
this.upldWindow.hide();
},failure:function(){
Ext.Msg.alert(acs_lang_text.error||"Error",acs_lang_text.upload_failed||"Upload failed, please try again later.");
},scope:this};
var _c1=acs_lang_text.loading||"One moment. This may take a while depending on how large your upload is.";
this.upldWindow.body.mask("<img src='/resources/ajaxhelper/images/indicator.gif'><br>"+_c1);
YAHOO.util.Connect.setForm("newfileform",true,true);
var _c2=YAHOO.util.Connect.asyncRequest("POST",this.xmlhttpurl+"add-file",_c0);
}else{
Ext.Msg.alert(acs_lang_text.alert||"Alert",acs_lang_text.file_required||"<b>Title</b> and <b>File to upload</b> are required.");
}
},addUrl:function(){
if(this.createurlWindow==null){
this.createurlWindow=new Ext.Window({id:"createurl-win",layout:"fit",width:400,height:180,title:"Create URL",closeAction:"hide",modal:true,plain:true,resizable:false,items:new Ext.FormPanel({id:"form_create_url",align:"left",autoScroll:true,closable:true,layout:"form",defaults:{width:230},frame:true,buttonAlign:"left",items:[{xtype:"textfield",fieldLabel:"Title",allowBlank:false,name:"fstitle",tabIndex:1},{xtype:"textfield",fieldLabel:"URL",allowBlank:false,name:"fsurl",tabIndex:2},{xtype:"textfield",fieldLabel:"Description",name:"fsdescription",tabIndex:3}]}),buttons:[{text:"Submit",handler:function(){
this.createurlWindow.findById("form_create_url").getForm().submit({url:this.xmlhttpurl+"add-url",waitMsg:"One moment ....",params:{package_id:this.config.package_id,folder_id:this.currentfolder},reset:true,scope:this,success:function(_c3,_c4){
if(_c4.result){
this.createurlWindow.hide();
}else{
Ext.MessageBox.alert("Error","Sorry an error occured.<br>"+_c4.result.error);
}
},failure:function(_c5,_c6){
if(_c6.result){
Ext.MessageBox.alert("Error",_c6.result.error);
}
}});
}.createDelegate(this),icon:"/resources/ajaxhelper/icons/disk.png",cls:"x-btn-text-icon"},{text:"Close",handler:function(){
this.createurlWindow.hide();
}.createDelegate(this),icon:"/resources/ajaxhelper/icons/cross.png",cls:"x-btn-text-icon"}]});
}
this.createurlWindow.show();
},renameItem:function(_c7,i,e){
var _ca=_c7;
var _cb=this.layout.findById("treepanel");
var _cc=_ca.store.getAt(i);
var _cd=_cc.get("url");
var _ce=_cc.get("type");
var _cf=_cc.get("id");
var _d0=_cc.get("filename");
var _d1=function(_d2){
var _d3=acs_lang_text.an_error_occurred||"An error occurred";
var _d4=acs_lang_text.reverted||"Your changes have been reverted";
var _d5=Ext.decode(_d2.responseText);
if(!_d5.success){
Ext.Msg.alert(acs_lang_text.error||"Error",_d3+": <br><br><font color='red'>"+_d5.error+"</font><br><br>"+_d4);
}else{
if(_ce=="folder"){
_cb.getNodeById(_cf).setText(_d5.newname);
}
if(_ce!="folder"&&_d0===" "){
_d0=_cc.get("title");
_cc.set("filename",_d0);
}
_cc.set("title",_d5.newname);
_cc.commit();
}
};
var _d6=function(btn,_d8){
if(btn=="ok"){
if(_d8!=""){
if(_d8.length>100){
Ext.Msg.alert(acs_lang_text.alert||"Alert",acs_lang_text.limitto100||"Please limit your name to 100 characters or less.");
return false;
}else{
Ext.Ajax.request({url:this.xmlhttpurl+"edit-name",success:_d1,failure:function(_d9){
var _da=Ext.decode(_d9.responseText);
Ext.Msg.alert(acs_lang_text.error||"Error",error_msg_txt+"<br><br><font color='red'>"+_da.error+"</font>");
},params:{newname:_d8,object_id:_cf,type:_ce,url:_cd}});
}
}else{
Ext.Msg.alert(acs_lang_text.alert||"Alert",acs_lang_text.enter_new_name||"Please enter a new name.");
return false;
}
}
};
Ext.Msg.show({title:acs_lang_text.rename||"Rename",prompt:true,msg:acs_lang_text.enter_new_name||"Please enter a new name for ... ",value:_cc.get("title"),buttons:Ext.Msg.OKCANCEL,fn:_d6.createDelegate(this)});
var _db=YAHOO.util.Dom.getElementsByClassName("ext-mb-input","input");
_db[0].select();
},tagFsitem:function(_dc,i,e){
var _df=_dc;
var _e0=_df.store.getAt(i);
var _e1=_e0.get("id");
var _e2=_e0.get("tags");
var _e3=this.config.package_id;
var _e4=this.layout.findById("tagcloudpanel");
var _e5=this.xmlhttpurl;
var _e6=this.tagWindow;
var _e7=function(){
Ext.Ajax.request({url:this.xmlhttpurl+"add-tag",success:function(){
_e0.data.tags=Ext.get("fstags").getValue();
_e0.commit();
_e4.load({url:_e5+"get-tagcloud",params:{package_id:_e3}});
_e6.hide();
},failure:function(_e8){
Ext.Msg.alert(acs_lang_text.error||"Error","Sorry, we encountered an error.");
},params:{object_id:_e0.id,package_id:_e3,tags:Ext.get("fstags").getValue()}});
};
if(_e6==null){
var _e9=new Ext.Panel({id:"form_addtag",autoScroll:true,frame:true,html:"<div style='text-align:left' class='yui-skin-sam'><p>Enter or edit one or more tags. Use commas (,) to separate the tags:<br ><br><div class='yui-ac'><input type='text' name='fstags' id='fstags' size='60' autocomplete='off' value='"+_e2+"'><div id='oAutoCompContainer1' class='yui-ac-container'></div></div>"});
var _ea=[{text:"Ok",icon:"/resources/ajaxhelper/icons/disk.png",cls:"x-btn-text-icon",handler:_e7.createDelegate(this)},{text:"Cancel",icon:"/resources/ajaxhelper/icons/cross.png",cls:"x-btn-text-icon",handler:function(){
_e6.hide();
}.createDelegate(this)}];
_e6=new Ext.Window({id:"tag-win",layout:"fit",width:450,height:300,title:"Tags",closeAction:"hide",modal:true,plain:true,autoScroll:false,resizable:false,items:_e9,buttons:_ea});
}
_e6.show();
this.initTagAutoComplete();
},initTagAutoComplete:function(){
var _eb=new YAHOO.widget.DS_JSArray(oAutoCompArr);
if(document.getElementById("fstags")){
var _ec=new YAHOO.widget.AutoComplete("fstags","oAutoCompContainer1",_eb);
_ec.animHoriz=false;
_ec.animVert=false;
_ec.queryDelay=0;
_ec.maxResultsDisplayed=10;
_ec.useIFrame=true;
_ec.delimChar=",";
_ec.allowBrowserAutocomplete=false;
_ec.typeAhead=true;
_ec.formatResult=function(_ed,_ee){
var _ef=_ed[0];
return _ef;
};
}
},downloadArchive:function(_f0){
if(_f0){
top.location.href="download-archive/?object_id="+_f0;
}
},showShareOptions:function(_f1,i,e){
var _f4=_f1;
var _f5=_f4.store.getAt(i);
var _f6=_f5.get("id");
var _f7=_f5.get("title");
var _f8=this.layout.findById("treepanel");
var _f9=this.config.package_id;
var _fa=this.xmlhttpurl;
var _fb=this.sharefolderWindow;
var _fc=function(){
var _fd=_f8.getSelectionModel().getSelectedNode();
_fd.loaded=false;
_fd.collapse();
_fd.fireEvent("click",_fd);
_fd.expand();
_fb.hide();
};
var _fe=function(){
var _ff=this.communityCombo.getValue();
Ext.Ajax.request({url:this.xmlhttpurl+"share-folder",success:_fc,failure:function(_100){
Ext.Msg.alert("Error","Sorry, we encountered an error. Please try again later.");
},params:{target_folder_id:_ff,folder_id:_f6}});
};
if(_fb==null){
var _101=new Ext.Panel({id:"form_addtag",autoScroll:true,frame:true,html:"<div style='text-align:left'>Select the community where you wish to share the <b>"+_f7+"</b> folder with.<br><br><input type='text' size='30' id='communities_list' /></div></div>"});
var _102=[{text:"Ok",icon:"/resources/ajaxhelper/icons/disk.png",cls:"x-btn-text-icon",handler:_fe.createDelegate(this)},{text:"Cancel",icon:"/resources/ajaxhelper/icons/cross.png",cls:"x-btn-text-icon",handler:function(){
_fb.hide();
}.createDelegate(this)}];
_fb=new Ext.Window({id:"share-win",layout:"fit",width:380,height:200,title:"Share Folder",closeAction:"hide",modal:true,plain:true,autoScroll:false,resizable:false,items:_101,buttons:_102});
_fb.on("show",function(){
if(this.communityCombo==null){
var _103=new Ext.data.JsonStore({url:_fa+"list-communities",root:"communities",fields:["target_folder_id","instance_name"]});
this.communityCombo=new Ext.form.ComboBox({store:_103,displayField:"instance_name",typeAhead:true,triggerAction:"all",emptyText:"Select a community",hiddenName:"target_folder_id",valueField:"target_folder_id",forceSelection:true,handleHeight:80,selectOnFocus:true,applyTo:"communities_list"});
}
},this);
}else{
this.communityCombo.reset();
}
_fb.show();
},redirectViews:function(grid,i,e){
var _107=grid;
var node=_107.store.getAt(i);
var _109=node.get("id");
window.open(window.location.protocol+"//"+window.location.hostname+"/o/"+_109+"/info");
window.focus();
},redirectPerms:function(grid,i,e){
var _10d=grid;
var node=_10d.store.getAt(i);
var _10f=node.get("id");
var _110=window.open(window.location.protocol+"//"+window.location.hostname+":"+window.location.port+this.config.package_url+"permissions?object_id="+_10f+"&return_url="+window.location.pathname+"?package_id="+this.config.package_id+"&folder_id="+this.currentfolder);
_110.focus();
},redirectProperties:function(grid,i,e){
var _114=grid;
var node=_114.store.getAt(i);
var _116=node.get("id");
var _117=window.open(window.location.protocol+"//"+window.location.hostname+":"+window.location.port+this.config.package_url+"file?file_id="+_116);
_117.focus();
},copyLink:function(grid,i,e){
var _11b=grid;
var node=_11b.store.getAt(i);
var _11d=node.get("type");
if(_11d==="folder"){
var _11e=window.location.protocol+"//"+window.location.hostname+":"+window.location.port+this.config.package_url+"?package_id="+this.config.package_id+"&folder_id="+node.get("id");
}else{
if(_11d==="url"){
var _11e=node.get("url");
}else{
var _11e=window.location.protocol+"//"+window.location.hostname+node.get("linkurl");
}
}
if(Ext.isIE){
window.clipboardData.setData("text",_11e);
}else{
var _11f=Ext.Msg.show({title:acs_lang_text.linkaddress||"Copy Link Address",prompt:true,msg:acs_lang_text.copyhighlighted||"Copy the highlighted text to your clipboard.",value:_11e,buttons:Ext.Msg.OK});
var _120=YAHOO.util.Dom.getElementsByClassName("ext-mb-input","input");
_120[0].select();
}
}};
function readCookie(name){
var ca=document.cookie.split(";");
var _123=name+"=";
for(var i=0;i<ca.length;i++){
var c=ca[i];
while(c.charAt(0)==" "){
c=c.substring(1,c.length);
}
if(c.indexOf(_123)==0){
return c.substring(_123.length,c.length);
}
}
return null;
}
function createCookie(name,_127,days){
if(days){
var date=new Date();
date.setTime(date.getTime()+(days*24*60*60*1000));
var _12a="; expires="+date.toGMTString();
}else{
var _12a="";
}
document.cookie=name+"="+_127+_12a+"; path=/";
}
function readQs(q){
var _12c=window.location.search.substring(1);
var _12d=_12c.split("&");
for(var i=0;i<_12d.length;i++){
var pos=_12d[i].indexOf("=");
if(pos>0){
var key=_12d[i].substring(0,pos);
var val=_12d[i].substring(pos+1);
if(key==q){
return val;
}
}
}
return null;
}
function checkFlashVersion(){
var x;
var _133;
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
function isURL(_134){
if(_134.indexOf(" ")!=-1){
return false;
}else{
if(_134.indexOf("http://")==-1){
return false;
}else{
if(_134=="http://"){
return false;
}else{
if(_134.indexOf("http://")>0){
return false;
}
}
}
}
_134=_134.substring(7,_134.length);
if(_134.indexOf(".")==-1){
return false;
}else{
if(_134.indexOf(".")==0){
return false;
}else{
if(_134.charAt(_134.length-1)=="."){
return false;
}
}
}
if(_134.indexOf("/")!=-1){
_134=_134.substring(0,_134.indexOf("/"));
if(_134.charAt(_134.length-1)=="."){
return false;
}
}
if(_134.indexOf(":")!=-1){
if(_134.indexOf(":")==(_134.length-1)){
return false;
}else{
if(_134.charAt(_134.indexOf(":")+1)=="."){
return false;
}
}
_134=_134.substring(0,_134.indexOf(":"));
if(_134.charAt(_134.length-1)=="."){
return false;
}
}
return true;
}
function FileProgress(_135,_136){
this.file_progress_id=_135.id;
this.opacity=100;
this.height=0;
this.fileProgressWrapper=document.getElementById(this.file_progress_id);
if(!this.fileProgressWrapper){
this.fileProgressWrapper=document.createElement("div");
this.fileProgressWrapper.className="progressWrapper";
this.fileProgressWrapper.id=this.file_progress_id;
this.fileProgressElement=document.createElement("div");
this.fileProgressElement.className="progressContainer";
var _137=document.createElement("a");
_137.className="progressCancel";
_137.href="#";
_137.style.visibility="hidden";
_137.appendChild(document.createTextNode(" "));
var _138=document.createElement("div");
_138.className="progressName";
_138.appendChild(document.createTextNode(_135.name));
var _139=document.createElement("div");
_139.className="progressBarInProgress";
var _13a=document.createElement("div");
_13a.className="progressBarStatus";
_13a.innerHTML="&nbsp;";
this.fileProgressElement.appendChild(_137);
this.fileProgressElement.appendChild(_138);
this.fileProgressElement.appendChild(_13a);
this.fileProgressElement.appendChild(_139);
this.fileProgressWrapper.appendChild(this.fileProgressElement);
document.getElementById(_136).appendChild(this.fileProgressWrapper);
}else{
this.fileProgressElement=this.fileProgressWrapper.firstChild;
}
this.height=this.fileProgressWrapper.offsetHeight;
}
FileProgress.prototype.SetProgress=function(_13b){
this.fileProgressElement.className="progressContainer green";
this.fileProgressElement.childNodes[3].className="progressBarInProgress";
this.fileProgressElement.childNodes[3].style.width=_13b+"%";
};
FileProgress.prototype.SetComplete=function(){
this.fileProgressElement.className="progressContainer blue";
this.fileProgressElement.childNodes[3].className="progressBarComplete";
this.fileProgressElement.childNodes[3].style.width="";
var _13c=this;
setTimeout(function(){
_13c.Disappear();
},10000);
};
FileProgress.prototype.SetError=function(){
this.fileProgressElement.className="progressContainer red";
this.fileProgressElement.childNodes[3].className="progressBarError";
this.fileProgressElement.childNodes[3].style.width="";
var _13d=this;
setTimeout(function(){
_13d.Disappear();
},5000);
};
FileProgress.prototype.SetCancelled=function(){
this.fileProgressElement.className="progressContainer";
this.fileProgressElement.childNodes[3].className="progressBarError";
this.fileProgressElement.childNodes[3].style.width="";
var _13e=this;
setTimeout(function(){
_13e.Disappear();
},2000);
};
FileProgress.prototype.SetStatus=function(_13f){
this.fileProgressElement.childNodes[2].innerHTML=_13f;
};
FileProgress.prototype.ToggleCancel=function(show,_141){
this.fileProgressElement.childNodes[0].style.visibility=show?"visible":"hidden";
if(_141){
var _142=this.file_progress_id;
this.fileProgressElement.childNodes[0].onclick=function(){
_141.cancelUpload(_142);
return false;
};
}
};
FileProgress.prototype.Disappear=function(){
var _143=15;
var _144=4;
var rate=30;
if(this.opacity>0){
this.opacity-=_143;
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
this.height-=_144;
if(this.height<0){
this.height=0;
}
this.fileProgressWrapper.style.height=this.height+"px";
}
if(this.height>0||this.opacity>0){
var _146=this;
setTimeout(function(){
_146.Disappear();
},rate);
}else{
this.fileProgressWrapper.style.display="none";
}
};

