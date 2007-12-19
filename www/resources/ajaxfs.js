/*
    Ajax File Storage 1.0
    @author Hamilton Chua (ham@solutiongrove.com)
    @creation-date 2007-11-18

*/

/********** AJAXFS Class ***********/

Ext.namespace('ajaxfs');
Ext.BLANK_IMAGE_URL = '/resources/ajaxhelper/ext2/resources/images/default/s.gif';

ajaxfs = function(configObj) {

    // ******** properties *********

    //  ** configObj **
    // ajaxFs expects a config object that may have the following properites
    // - configObj.package_id : the package_id of the current ajaxFs Instance
    // - configObj.initOpenFolder : if this value is not null, it should contain the folder id to open when object is instantiated
    // - configObj.layoutdiv : the div container where we put the layout, if none is provided then document.body is used
    // - configObj.xmlhttpurl : just in case ajaxfs is mounted elsewhere other than /ajaxfs
    // - configObj.createUrl : do we show the createurl button in the toolbar

    // ** properties **

    // url of xmlhttp files from ajaxfs, defaults to /ajaxfs/xmlhttp
    this.xmlhttpurl = '/ajaxfs/xmlhttp/';

    // do we or do we not allow creating url's in fs, defaults to true
    this.create_url_p = true;

    // do we support folder sharing
    this.share_folders_p = true;

    // holds an object with configruation settings for this instance
    //  of ajaxfs, this variable is set only if configObj exists and is passed
    this.config = null;

    // holds a reference to the layout for the center page
    this.layout = null;
    
    // reference to the tree edito for the treepanel
    this.te = null;

    // holds the id of the currently selected node in the tree
    this.currentfolder = null;

    // currently selected tag
    this.currenttag = null;

    // reusable aync data connection
    this.asyncCon = new Ext.data.Connection();

    // reference to messagebox
    this.msgbox = Ext.MessageBox;

    // create upload dialog
    this.upldWindow = null;

    // tagdialog
    this.tagWindow = null;

    // create ur dialog
    this.createurlWindow = null;

    // share folder window
    this.sharefolderWindow = null;

    // reference to contextmenu
    this.contextmenu = null;

    // reference to an instance of the swfuploader
    //  used for ajaxfs
    this.swfu = null;

    // variable to store target folder when it is being shared
    this.target_folder_id = null;

    // variable to store combo
    this.communityCombo = null;


    //********* initialize *********

    this.initObj = function() {

        // check if ExtJs is loaded before anything else

        if (typeof(Ext.DomHelper) != "undefined") {

            // ExtJs is loaded
            // check for config
            if (configObj) { 

                this.config = configObj;
                if(this.config.xmlhttpurl) { this.xmlhttpurl = this.config.xmlhttpurl }
                if(this.config.create_url == 0) { this.create_url_p = false }
                if(this.config.share_folders == 0) { this.share_folders_p = false }

                // generic listener to check if 
                // the connection has returned a login form
                // in which case we need to redirect the user 
                //  to a login form
                // this listener is activated only if the fs instance
                //  is not a public instance

                if(!this.config.ispublic) {
                    Ext.Ajax.on("requestcomplete", this.isSessionExpired, this);
                }
                
            }

            // initialize tooltips
            Ext.QuickTips.init();

            // setup the layout and panels
            this.initLayout();

        }

    }

    Ext.onReady(this.initObj,this,true);

}

ajaxfs.prototype = {

    // check if login has expired

    isSessionExpired : function(conn,response,options) {

        // check if we are still logged in
        if ( readCookie("ad_user_login") == null ) {
            Ext.get(document.body).mask(acs_lang_text.sessionexpired || "Your session has expired. You need to login again. <br>You will be redirected to a login page shortly");
            var params = '';
            if(this.currentfolder != null) {
                var params = "?folder_id="+this.currentfolder;
            }
            window.location="/register/?return_url="+this.config.package_url+params;
        }

    },

    // recursive expand in case folder id is not on the first level
    asyncExpand : function(x) {
        var treepanel = this.layout.findById('treepanel');
        var node = treepanel.getNodeById(this.config.initOpenFolder);
        if(!node) {
            var x = x+1;
            var nextnodeid = this.config.pathToFolder[x];
            var nextnode = treepanel.getNodeById(nextnodeid);
            nextnode.on("expand",asyncExpand.createDelegate(this,[x]), this, {single:true});
            nextnode.expand(true);
        } else {
            node.select()
            node.fireEvent("click",node);
        }
    },

    // if we get an initOpenFolder config,
    //  expand the provided initOpenFolder id
    selectInitFolder : function() {
        var treepanel = this.layout.findById('treepanel');
        if(this.config.initOpenFolder) {
            var initNode = treepanel.getNodeById(this.config.initOpenFolder);
            if(initNode) { 
                initNode.expand();
                initNode.fireEvent("click",initNode) 
            } else {
                // recursively expand based on the list of folder_ids in pathToFolder
                var x = 1;
                var nextnode = treepanel.getNodeById(this.config.pathToFolder[x]);
                nextnode.on("expand",this.asyncExpand.createDelegate(this,[x]), this, {single:true});
                nextnode.expand(true);
            }
         } else {
            treepanel.fireEvent("click",treepanel.getRootNode());
         }
    },

    // creates the main layout for ajaxfs

    initLayout : function() {

        /*  Load the UI in document.body if a layoutdiv is not provided */

        var layoutitems = [this.createLeft(),this.createRight()]

        if (this.config != null && this.config.layoutdiv) { 

            this.layout = new Ext.Panel({
                id:"fs-ui",
                layout:'border',
                applyTo:this.config.layoutdiv,
                tbar:this.createToolbar(),
                items: layoutitems
            })

        } else {

            this.layout = new Ext.Viewport({
                id:"fs-ui",
                layout:'border',
                tbar:this.createToolbar(),
                items: layoutitems
            });

        }

    },

    // create a tools menu that has the same items as the context menu
    createToolsMenu : function() {

        var menu = new Ext.menu.Menu({
            id: 'toolsmenu',
            items: [
            new Ext.menu.Item({
                id:'mnOpen',
                text: 'Open',
                icon: '/resources/ajaxhelper/icons/page_white.png'
            }),
            new Ext.menu.Item({
                id:'mnTag',
                text: 'Tag',
                icon: '/resources/ajaxhelper/icons/tag_blue.png'
            }),
            new Ext.menu.Item({
                id:'mnView',
                text: 'Views',
                icon: '/resources/ajaxhelper/icons/camera.png'
            }),
            new Ext.menu.Item({
                id:'mnRename',
                text: acs_lang_text.rename || 'Rename',
                icon: '/resources/ajaxhelper/icons/page_edit.png'
            }),
            new Ext.menu.Item({
                id:'mnCopyLink',
                text: acs_lang_text.linkaddress || 'Copy Link Address',
                icon: '/resources/ajaxhelper/icons/page_copy.png'
            }), 
            new Ext.menu.Item({
                id:'mnPerms',
                text: acs_lang_text.permissions || 'Permissions',
                icon: '/resources/ajaxhelper/icons/group_key.png'
            }), 
            new Ext.menu.Item({
                id:'mnProp',
                text: acs_lang_text.properties || 'Properties',
                icon: '/resources/ajaxhelper/icons/page_edit.png'
            }), 
            new Ext.menu.Item({
                id:'mnArch',
                text: acs_lang_text.download_archive || 'Download archive',
                icon: '/resources/ajaxhelper/icons/arrow_down.png'
            }),
            new Ext.menu.Item({
                id:'mnShare',
                text: acs_lang_text.sharefolder || 'Share Folder',
                icon: '/resources/ajaxhelper/icons/group_link.png'
            }) ]
        });

        menu.on("beforeshow",function() {

            var gridpanel = this.layout.findById('filepanel');

            if (gridpanel.getSelectionModel().getCount() == 1) {
                var selectedRow = gridpanel.getSelectionModel().getSelections();
                for(var x=0; x<menu.items.items.length;x++) {
                    menu.items.items[x].enable();
                }
                switch (selectedRow[0].get("type"))  {
                    case "folder":
                        menu.items.items[0].setText("Open");
                        menu.items.items[1].disable();
                        menu.items.items[6].disable();
                        break;
                    case "symlink":
                        menu.items.items[0].setText("Open");
                        menu.items.items[1].disable();
                        menu.items.items[3].disable();
                        menu.items.items[6].disable();
                        break
                    default :
                        menu.items.items[0].setText("Download");
                        menu.items.items[7].disable();
                        menu.items.items[8].disable();
                        break;
                }
                // always disable if shared folders are not supported
                if(!this.share_folders_p) {
                    menu.items.items[8].disable();
                }
            } else {
                for(var x=0; x<menu.items.items.length;x++) {
                    menu.items.items[x].disable();
                }
            }
        },this);

        menu.on("itemclick",function(item,e) {
            var grid = this.layout.findById('filepanel');
            var selectedRow = grid.getSelectionModel().getSelected();
            var recordid = selectedRow.get("id");
            for (var x=0; x<grid.store.data.items.length; x++) {
                if (grid.store.data.items[x].id == recordid) { var i = x; break }
            }
            switch (item.getId())  {
                case "mnOpen":
                    this.openItem(grid, i);
                    break;
                case "mnTag":
                    this.tagFsitem(grid, i);
                    break;
                case "mnView":
                    this.redirectViews(grid, i);
                    break;
                case "mnRename":
                    this.renameItem(grid,i);
                    break;
                case "mnCopyLink":
                    this.copyLink(grid,i);
                    break;
                case "mnPerms":
                    this.redirectPerms(grid, i);
                    break;
                case "mnProp":
                    this.redirectProperties(grid, i);
                    break;
                case "mnArch":
                    this.downloadArchive(recordid);
                    break;
                case "mnShare":
                    this.showShareOptions(grid, i);
                    break;
            }
        },this);

        var tbutton = {
            text:'Tools',
            iconCls:'toolsmenu',
            menu: menu
        }
        return tbutton;
    },

    // create the toolbar for this instance of ajaxfs

    createToolbar : function() {
        var rootnode = this.config.treerootnode;
        var toolbar = [];
        if(rootnode.attributes["write_p"] == 't') {
            var toolbar = [
                ' ',
                {text: acs_lang_text.newfolder || 'New Folder', tooltip: acs_lang_text.newfolder || 'New Folder', icon: '/resources/ajaxhelper/icons/folder_add.png', cls : 'x-btn-text-icon', handler: this.addFolder.createDelegate(this)},
                {text: acs_lang_text.uploadfile || 'Upload Files', tooltip: acs_lang_text.uploadfile || 'Upload Files', icon: '/resources/ajaxhelper/icons/page_add.png', cls : 'x-btn-text-icon', handler: this.addFile.createDelegate(this)}
            ];
            if(this.create_url_p) {
                toolbar.push({text: acs_lang_text.createurl || 'Create Url',tooltip: acs_lang_text.createurl || 'Create Url', icon: '/resources/ajaxhelper/icons/page_link.png', cls : 'x-btn-text-icon', handler: this.addUrl.createDelegate(this)});
            }
            toolbar.push({text: acs_lang_text.deletefs || 'Delete', tooltip: acs_lang_text.deletefs || 'Delete', icon: '/resources/ajaxhelper/icons/delete.png', cls : 'x-btn-text-icon', handler: this.delItem.createDelegate(this)});
            toolbar.push(this.createToolsMenu());
            toolbar.push('->');
        }
        toolbar.push({tooltip: 'This may take a few minutes if you have a lot of files', text: acs_lang_text.download_archive || 'Download Archive', icon: '/resources/ajaxhelper/icons/arrow_down.png', cls : 'x-btn-text-icon', handler: this.downloadArchive.createDelegate(this,[rootnode.id],false)});
        return toolbar;
    },

    // creates the left panel as an accordion, top panel has the folders, bottom panel has the tags

    createLeft : function() {
        var panel = new Ext.Panel ({
            id:'leftpanel',
            region:'west',
            collapsible:true,
            titlebar:true,
            title:' ',
            layout:'accordion',
            split:true,
            width:300,
            items:[this.createTreePanel(),this.createTagPanel()]
        });
        return  panel;
    },

    // creates the right panel which lists the files inside a folder

    createTreePanel : function() {

        // build the tree

        var rootnode = new Ext.tree.AsyncTreeNode({
            text: this.config.treerootnode.text,
            draggable:false,
            id:this.config.treerootnode.id,
            singeClickExpand: true,
            expanded:true,
            attributes: this.config.treerootnode.attributes
        });

        var loader = new Ext.tree.TreeLoader({ 
            dataUrl:this.xmlhttpurl+'load-treenodes',
            baseParams: { package_id:this.config.package_id }
        });

        var treepanel = new Ext.tree.TreePanel({
            id:'treepanel',
            title:'Folders',
            autoScroll:true,
            animate:true,
            enableDrag:false,
            enableDrop:true,
            loadMask:true,
            loader: loader,
            root: rootnode,
            ddAppendOnly: true,
            containerScroll: true,
            dropConfig: {
                dropAllowed: true,
                ddGroup:'fileDD',
                onNodeOver : function(treenode,source,e,data) {

                    // DO NOT ALLOW DROP TO CURRENT FOLDER
                    // check if the id of target node to be dropped
                    //  is the same as the currently selected tree node
                    if (treenode.node.id == treenode.node.ownerTree.getSelectionModel().getSelectedNode().id) {
                        return false;
                    }

                    // DO NOT ALLOW TO DROP A FOLDER TO ITSELF IN THE TREE
                    // check if the id of any of the nodes to be dropped
                    // is the same as the id on the tree
                    if(source.dragData.selections) {
                        for (var x=0; x<source.dragData.selections.length; x++) {
                            if (treenode.node.id == source.dragData.selections[x].data.id) {
                                return false;
                            }
                        }
                    }
                    return true;

                }, onNodeDrop : function(treenode,source,e,data) {

                    // we dropped a row from the grid
                    var filepanel=this.layout.findById("filepanel");
                    var folder_target_id = treenode.node.id;

                    var file_ids = [];
                    for(var x=0;x<data.selections.length;x++) {
                        file_ids[x] = data.selections[x].data.id;
                    }

                    var err_msg_txt = acs_lang_text.an_error_occurred || "An error occurred";
                    var err_msg_txt2 = acs_lang_text.reverted || "Your changes have been reverted";

                    var moveSuccess = function(response) {
                        var resultObj = Ext.decode(response.responseText);
                        if (resultObj.success) {
                            var dm = filepanel.store;
                            var selectedRows = filepanel.getSelectionModel().getSelections();
                            var hasfolder = false;
                            // remove folder/file from right panel
                            //  remove folder if it exists on the tree
                            for(var x=0; x<selectedRows.length; x++) {
                                dm.remove(selectedRows[x]);
                                //  and set the current parent's loaded property to false
                                if (selectedRows[x].data.type == "folder") {
                                    hasfolder = true;
                                    if(treenode.node.ownerTree.getNodeById(selectedRows[x].data.id)) {
                                        var oldparent = treenode.node.ownerTree.getNodeById(selectedRows[x].data.id).parentNode;
                                        oldparent.loaded = false;
                                        oldparent.removeChild(treenode.node.ownerTree.getNodeById(selectedRows[x].data.id));
                                    }
                                }
                            }

                            // if a folder is moved to the root, we need to select it
                            //  because the entire tree needs to be reloaded
                            if (hasfolder) {
                                var treeroot = treenode.node.ownerTree.getRootNode();
                                if (treeroot.id == treenode.node.id) {
                                    treeroot.fireEvent("click",treeroot)
                                }
                                treenode.node.loaded=false;
                                treenode.node.expand();
                            }

                        } else {
                            Ext.Msg.alert(acs_lang_text.error || "Error",err_msg_txt+"<br>"+err_msg_txt2);
                        }
                    }
            
                    Ext.Ajax.request({
                        url:this.xmlhttpurl+"move-fsitem",
                        success: moveSuccess, failure: function() {
                            var resultObj = Ext.decode(response.responseText);
                            var msg = "";
                            if(resultObj.error) { msg = resultObj.error }
                            // ajax failed, revert value
                            Ext.Msg.alert(acs_lang_text.error || "Error",err_msg_txt+"<br>"+msg+"<br>"+err_msg_txt2);
                        }, params: { folder_target_id:folder_target_id,file_ids:file_ids }
                    });

                    return true;

                }.createDelegate(this)
            }
        });

        // ** allow renaming folders on tree **

        this.enableTreeFolderRename(treepanel);

        // ** listeners **

        rootnode.on("expand",this.selectInitFolder,this,{single:true});

        treepanel.on("click",this.loadFoldercontents,this);

        return treepanel;
    },

    // enable renaming of tree folder
    enableTreeFolderRename : function(treepanel) {

        // ** create editor ***

        this.te = new Ext.tree.TreeEditor(treepanel, {
            allowBlank:false,
            blankText: acs_lang_text.folder_name_required || 'A folder name is required',
            editDelay:20,
            ignoreNoChange:true
        });

        // ** listeners **
        
        // check if user has premission to rename
        // permissions are checked again on the server when request is submitted
        this.te.on("beforestartedit", function(node,el,oldname) {
            if (node.editNode.attributes.attributes.write_p == "t") {
                return true;
            } else {
                Ext.Msg.alert(acs_lang_text.permission_denied || "Permission Denied", acs_lang_text.permission_denied || "Sorry, you do not have permission to rename this folder");
                return false;
            }
        }, this, true);

        // reject if the folder name is already being used by a sibling 
        this.te.on("beforecomplete",function(node,newval,oldval) {
            var parent = node.editNode.parentNode;
            if(parent) {
                var children = parent.childNodes;
                for(x=0;x<children.length;x++) {
                    if (children[x].text == newval && children[x].id != node.editNode.id) {
                        Ext.Msg.alert(acs_lang_text.duplicate_name || "Duplicate Name", acs_lang_text.duplicate_name_error || "Please enter a different name. The name you entered is already being used.");
                        return false;
                    }
                }
            }
            return true;
        }, this, true);

        // send the update to server and validate
        this.te.on("complete", function(node,newval,oldval) {
        
            var err_msg_txt = acs_lang_text.an_error_occurred || "An error occurred";
            var err_msg_txt2 = acs_lang_text.reverted || "Your changes have been reverted";

            Ext.Ajax.request({
                url:this.xmlhttpurl+"rename-fsitem",
                success: function(response) {
                    var resultObj = Ext.decode(response.responseText);
                    if (!resultObj.success) {
                        Ext.Msg.alert(acs_lang_text.error || "Error",err_msg_txt+": <br><br><font color='red'>"+resultObj.error+"</font><br><br>"+err_msg_txt2);
                        node.editNode.setText(oldval);
                    }
                }, failure: function() {
                    // ajax failed, revert value
                    Ext.Msg.alert(acs_lang_text.error || "Error",err_msg_txt+"<br>"+err_msg_txt2);
                    node.editNode.setText(oldval);
                }, params: { newname:newval, object_id:node.editNode.id, type:"folder" }
            });
                
        }, this, true);

    },

    // creates the right panel which lists the files inside a folder

    createTagPanel : function() {

        var panel = new Ext.Panel({
            id:'tagcloudpanel',
            title:'Tags',
            frame:false,
            loadMask:true,
            autoScroll:true,
            autoLoad:{url:this.xmlhttpurl+'get-tagcloud',params:{package_id:this.config.package_id}}
        });

        var listenTagClick = function() {

            var ajaxfsObj = this;
            var currenttag = ajaxfsObj.currenttag;

            panel.body.on("click",function(obj,el) {
                if(el.tagName == "A") {
                    if (currenttag != null) { Ext.get(currenttag).setStyle('font-weight','normal') }
                    Ext.get(el).setStyle('font-weight','bold');
                    currenttag = el.id;
                    this.loadTaggedFiles(el.id);
                }
            },this);

        }

        panel.on("render", listenTagClick,this);

        return  panel;
    },

    // loads the objects associated with a tag
    loadTaggedFiles : function (tagid) {

        this.layout.findById("treepanel").getSelectionModel().clearSelections();
        var id = tagid.substring(3,tagid.length);
        this.layout.findById("filepanel").store.baseParams['tag_id'] = id;
        this.layout.findById("filepanel").store.load();
        this.layout.findById("filepanel").store.baseParams['tag_id'] = '';

    },


    // creates the right panel which lists the files inside a folder

    createRight : function() {

        var cols = [{header: "", width: 30,sortable: true, dataIndex: 'icon'},
                    {header: acs_lang_text.filename || "Filename", id:'filename', sortable: true, dataIndex: 'title'},
                    {header: acs_lang_text.size || "Size", sortable: true, dataIndex: 'size'},
                    {header: acs_lang_text.lastmodified || "Last Modified", sortable: true, dataIndex: 'lastmodified'}];

        var reader = new Ext.data.JsonReader(
                    {totalProperty: 'total', root: 'foldercontents', id: 'id'}, [
                    {name:'id', type: 'int'},
                    {name:'icon'},
                    {name:'title'},
                    {name:'filename'},
                    {name:'type'},
                    {name:'tags'},
                    {name:'url'},
                    {name:'linkurl'},
                    {name:'write_p'},
                    {name:'symlink_id'},
                    {name:'size'},
                    {name:'lastmodified'}] );


        var proxy = new Ext.data.HttpProxy( {
                        url : this.xmlhttpurl+ 'get-foldercontents'
                    } );


        var colModel = new Ext.grid.ColumnModel(cols);

        var dataModel = new Ext.data.Store({proxy: proxy, reader: reader, remoteSort: true});

        var gridpanel = new Ext.grid.GridPanel( {
            store: dataModel,
            cm: colModel,
            id:'filepanel',
            ddGroup:'fileDD',
            region:'center',
            split:true,
            autoScroll:true,
            autoExpandColumn:'filename',
            collapsible:true,
            enableDragDrop:true,
            width:250,
            loadMask:true,
            frame:false,
            viewConfig: { 
                forceFit: false,
                enableRowBody:true,
                showPreview:true,
                getRowClass: function(record,rowIndex,p,ds) {
                    var xf = Ext.util.Format;
                    if (record.data.tags!= "") {
                        p.body = "<div id='tagscontainer"+record.data.id+"' style='padding-left:35px;color:blue'>Tags: " + xf.ellipsis(xf.stripTags(record.data.tags), 200) + "</div>";
                    } else {
                        p.body = "<div id='tagscontainer"+record.data.id+"' style='padding-left:35px;color:blue'></div>";
                    }
                    return 'x-grid3-row-expanded';
                }
            }
        });

        // listeners

        gridpanel.on("rowdblclick",this.openItem,this,true);

        gridpanel.on("rowcontextmenu",this.showRowContext,this,true);

        return  gridpanel;
    },

    // generate the contextbar for the file panel
    showRowContext : function(grid,i,e) {

        e.stopEvent();

        var treepanel = this.layout.findById('treepanel');
        var rootnode = this.config.treerootnode;
        var dm = grid.store;
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
                icon: '/resources/ajaxhelper/icons/page_white.png',
                handler: this.openItem.createDelegate(this,[grid, i, e],false)
            }),
            new Ext.menu.Item({
                text: 'Tag',
                icon: '/resources/ajaxhelper/icons/tag_blue.png',
                handler: this.tagFsitem.createDelegate(this,[grid, i, e],false)
            }),
            new Ext.menu.Item({
                text: 'Views',
                icon: '/resources/ajaxhelper/icons/camera.png',
                handler: this.redirectViews.createDelegate(this,[grid, i, e],false)
            }),
            new Ext.menu.Item({
                text: acs_lang_text.deletefs || 'Delete',
                icon: '/resources/ajaxhelper/icons/delete.png',
                handler: this.delItem.createDelegate(this,[grid,i,e],false)
            }),
            new Ext.menu.Item({
                text: acs_lang_text.rename || 'Rename',
                icon: '/resources/ajaxhelper/icons/page_edit.png',
                handler: this.renameItem.createDelegate(this,[grid,i,e],false)
            }),
            new Ext.menu.Item({
                text: acs_lang_text.linkaddress || 'Copy Link Address',
                icon: '/resources/ajaxhelper/icons/page_copy.png',
                handler: this.copyLink.createDelegate(this,[grid,i,e],false)
            }), 
            new Ext.menu.Item({
                text: acs_lang_text.permissions || 'Permissions',
                icon: '/resources/ajaxhelper/icons/group_key.png',
                handler: this.redirectPerms.createDelegate(this,[grid, i, e],false)
            }), 
            new Ext.menu.Item({
                text: acs_lang_text.properties || 'Properties',
                icon: '/resources/ajaxhelper/icons/page_edit.png',
                handler: this.redirectProperties.createDelegate(this,[grid, i, e],false)
            }), 
            new Ext.menu.Item({
                text: acs_lang_text.download_archive || 'Download archive',
                icon: '/resources/ajaxhelper/icons/arrow_down.png',
                handler: this.downloadArchive.createDelegate(this,[recordid],false)
            }),
            new Ext.menu.Item({
                text: acs_lang_text.sharefolder || 'Share Folder',
                icon: '/resources/ajaxhelper/icons/group_link.png',
                handler: this.showShareOptions.createDelegate(this,[grid, i, e],false)
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
            this.contextmenu.items.items[9].hide();
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
                if (treepanel.getNodeById(recordid).attributes.attributes.type == "symlink") {
                    this.contextmenu.items.items[9].hide();
                } else {
                    this.contextmenu.items.items[9].show();
                }
            } else {
                if (object_type == "symlink") {
                    this.contextmenu.items.items[4].hide();
                    this.contextmenu.items.items[9].hide();
                } else {
                    this.contextmenu.items.items[1].show();
                    this.contextmenu.items.items[7].show();
                    this.contextmenu.items.items[8].hide();
                    this.contextmenu.items.items[9].hide();
                }
            }
        }

        // always disable if shared folders are not supported
        if(!this.share_folders_p) {
            this.contextmenu.items.items[9].hide();
        }

        if(rootnode.attributes["write_p"] == 'f') {
            this.contextmenu.items.items[1].hide();
            this.contextmenu.items.items[3].hide();
            this.contextmenu.items.items[6].hide();
            this.contextmenu.items.items[7].hide();
            this.contextmenu.items.items[9].hide();
        }

        var coords = e.getXY();
        this.contextmenu.rowid = i;
        this.contextmenu.showAt([coords[0], coords[1]]);

    },

    // load content of folder in file pane
    // called from treepanel listener

    loadFoldercontents : function(node, e) {

        // currently selected folder
        this.currentfolder = node.id;

        // get filepanel
        var gridpanel = this.layout.findById('filepanel');

        // fetch the folder contents

        gridpanel.store.baseParams['folder_id'] = node.id;
        gridpanel.store.baseParams['package_id'] = this.config.package_id;
        // gridpanel.store.baseParams['tag_id'] = '';

        // if the tree node is still loading, wait for it to expand before loading the grid
        if(node.loading) {
            node.on("expand", function() { this.store.load() }, gridpanel, {single:true});
        } else{
            gridpanel.store.load();
        }
    },

    // executes an action depending on the type of fs item
    // - folders : open the folder in the tree
    // - file : download the file
    // - url : open the url in a new window
    openItem : function(grid,i,e) {

        var treepanel = this.layout.findById('treepanel');
        var dm = grid.store;
        var record = dm.getAt(i);
        if(record.get("type") == "folder"|| record.get("type") == "symlink") {
            var node = treepanel.getNodeById(record.get("id"));
            if(!node.parentNode.isExpanded()) { node.parentNode.expand() }
            node.fireEvent("click",node);
            node.expand();
        } else {
            // this is a file, let the user download
            window.open(record.get("url"));
            window.focus();
        }

    },

    // deletes an fs item (folder, file or url)
    delItem : function(grid,i,e) {

        var err_msg_txt = acs_lang_text.confirm_delete || "Are you sure you want to delete ";
        var err_msg_txt2 = acs_lang_text.foldercontains || "This folder contains";
        var treepanel = this.layout.findById('treepanel');
        if(grid.id=="filepanel") { 
            var filepanel = grid;
            if(filepanel.getSelectionModel().getCount()<=1) {
                filepanel.getSelectionModel().selectRow(i);
            }
        } else { 
            var filepanel = this.layout.findById('filepanel');
        }
        var selectedRows = filepanel.getSelectionModel().getSelections();
        var delfromtree = true;

        // build the warning message, we want the delete to be intuitive
        // determine if we're deleting from  tree panel or from file panel

        if (selectedRows.length > 0) {

            delfromtree = false;

            // ** delete item from grid **
            if (selectedRows.length == 1) {
                var filetodel = selectedRows[0].get("title");
                if(selectedRows[0].get("type") === "folder") {
                    var msg = err_msg_txt2 + " <b>"+selectedRows[0].get("size")+"</b>.<br>"
                } else {
                    var msg = "";
                }
                var msg = msg + err_msg_txt+" <b>"+filetodel+"</b> ?";
                if(selectedRows[0].get("type") === "symlink") {
                    var object_id = selectedRows[0].get("symlink_id");
                } else {
                    var object_id = selectedRows[0].get("id");
                }
            } else {
                var msg = err_msg_txt + ": <br><br>";
                var object_id = [];
                for(var x=0; x<selectedRows.length; x++) {
                    msg = msg + "<b>" + selectedRows[x].get("title") + "</b> ";
                    if(selectedRows[x].get("type") === "folder") {
                        msg=msg+"("+selectedRows[x].get("size")+")";
                    }
                    msg=msg+"<br>";
                    if(selectedRows[x].get("type") === "symlink") {
                        object_id[x] = selectedRows[x].get("symlink_id");
                    } else {
                        object_id[x] = selectedRows[x].get("id");
                    }
                }
            }

            var params = {object_id : object_id }

        } else {

            delfromtree = true;

            // ** delete item from tree (tree only shows folders) **
            // we can't delete the root node
            var selectednode = treepanel.getSelectionModel().getSelectedNode();
            var object_id = selectednode.attributes["id"];
            var type = selectednode.attributes.attributes["type"];
            var symlink_id = selectednode.attributes.attributes["symlink_id"];
            var rootnode = treepanel.getRootNode();
            if(type == "symlink" ) {
                var params = {object_id : symlink_id }
            } else {
                var params = {object_id : object_id }
            }
            if(selectednode.attributes["id"] == rootnode.attributes["id"]) {
                Ext.Msg.alert(acs_lang_text.alert || "Alert",acs_lang_text.cant_del_root || "The root folder can not be deleted.");
                return;
            } else {
                // confirmation message
                var msg =  err_msg_txt+' <b>'+selectednode.attributes["text"]+'</b>?';
            }

        }
    
        var doDelete = function(choice) {
            if (choice === "yes") {
                Ext.Ajax.request({
                    url:this.xmlhttpurl+"delete-fsitem",
                    success: function(response) {
                        var resultObj = Ext.decode(response.responseText);
                        if(resultObj.success) {
                            if(delfromtree) {
                                var selectednode = treepanel.getSelectionModel().getSelectedNode();
                                var parentnode = selectednode.parentNode;
                                parentnode.fireEvent("click",parentnode);
                                parentnode.removeChild(selectednode);
                            } else {
                                for(var x=0; x<selectedRows.length; x++) {
                                    // hide the node from the json view
                                    filepanel.store.remove(selectedRows[x]);
                                    // if it's a node on the tree, remove it
                                    var treenodeid = selectedRows[x].get("id");
                                    var selectednode = treepanel.getNodeById(treenodeid);
                                    if (selectednode) {
                                        selectednode.parentNode.fireEvent("click",selectednode.parentNode);
                                        selectednode.parentNode.removeChild(selectednode);
                                    }
                                }
                            }
                        } else {
                            Ext.Msg.alert(acs_lang_text.error || "Error","Sorry, we encountered an error.");
                        }
                    }, failure: function() {
                        Ext.Msg.alert(acs_lang_text.error || "Error",error_msg_txt + "<br><br><font color='red'>"+resultObj.error+"</font>");
                    }, params: params
                });
            }
        }

        Ext.MessageBox.confirm(acs_lang_text.confirm || 'Confirm',msg,doDelete,this);

    },

    // creates a new folder in the db
    //  inserts a blank folder in the ui ready for user to enter name
    addFolder : function() {

        // get currently selected folder
        var te = this.te;
        var tree = this.layout.findById('treepanel');
        var currentTreeNode = tree.getSelectionModel().getSelectedNode();
        currentTreeNode.expand();
        var error_msg_txt = acs_lang_text.new_folder_error || "Sorry, there was an error trying to create your new folder.";
        
        Ext.Ajax.request({
            url:this.xmlhttpurl+"add-blankfolder",
            success: function(response) {
                var resultObj = Ext.decode(response.responseText);
                if (resultObj.success) {
                    // create a new blank node on the currently selected one
                    var newnode = currentTreeNode.appendChild(new Ext.tree.TreeNode({text:resultObj.pretty_folder_name,id:resultObj.id,iconCls:"folder",singleClickExpand:true,attributes:{write_p:'t'}}));
                    tree.getSelectionModel().select(newnode);
                    newnode.loaded=true;
                    newnode.fireEvent("click",newnode);
                    setTimeout(function(){
                        te.editNode = newnode;
                        te.startEdit(newnode.ui.textNode);
                    }, 10);
                } else {
                    Ext.Msg.alert(acs_lang_text.error || "Error",error_msg_txt + "<br><br><font color='red'>"+resultObj.error+"</font>");
                }
            }, failure: function(response) {
                var resultObj = Ext.decode(response.responseText);
                Ext.Msg.alert(acs_lang_text.error || "Error",error_msg_txt + "<br><br><font color='red'>"+resultObj.error+"</font>");
            }, params: { folder_id: currentTreeNode.attributes["id"] }
        });

    },

    createSwfObj : function() {

        var ajaxfsobj = this;
        var treepanel = ajaxfsobj.layout.findById('treepanel');
        var currentfolder = ajaxfsobj.currentfolder;

        if(this.swfu == null) {

            var package_id = String(this.config.package_id);
            var user_id = String(this.config.user_id);
            var folder_id = String(this.currentfolder);
            var max_file_size = String(this.config.max_file_size);

            var uploadProgress = function (fileObj, bytesLoaded) {
                try {
                    var percent = Math.ceil((bytesLoaded / fileObj.size) * 100)
                    var progress = new FileProgress(fileObj, this.getSetting("progress_target"));
                    progress.SetProgress(percent);
                    progress.SetStatus(acs_lang_text.uploading || "Uploading...");
                } catch (ex) { this.debugMessage(ex); }
            }

            var uploadCancel = function(fileObj) {
                try {
                    var progress = new FileProgress(fileObj, this.getSetting("progress_target"));
                    progress.SetCancelled();
                    progress.SetStatus(acs_lang_text.uploadcancel || "Cancelled (This item will be removed shortly)");
                    progress.ToggleCancel(false);
            
                }
                catch (ex) { this.debugMessage(ex) }
            }

            var uploadComplete = function(fileObj) {
                try {
                    var progress = new FileProgress(fileObj, this.getSetting("progress_target"));
                    progress.SetComplete();
                    progress.SetStatus(acs_lang_text.complete || "Complete.");
                    progress.ToggleCancel(false);
            
                } catch (ex) { this.debugMessage(ex); }
            }

            var uploadQueueComplete = function(fileidx) {
                var currentTreeNode = treepanel.getNodeById(ajaxfsobj.currentfolder);
                currentTreeNode.fireEvent("click",currentTreeNode);
            }

            var uploadError = function(error_code, fileObj, message) {
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

            var uploadStart = function (fileObj) {
                var upload_txt = acs_lang_text.for_upload_to || "for upload to";
                var zip_txt = acs_lang_text.zip_extracted || "Zip File (Will be extracted after upload)";
                try {
                    var folderid = ajaxfsobj.currentfolder;
                    var foldername = treepanel.getNodeById(folderid).text;
                    var progress = new FileProgress(fileObj, this.getSetting("progress_target"));
                    progress.SetStatus( upload_txt + " <b>"+foldername+"</b><br>Title: <input type='text' onblur=\"fsInstance.swfu.removeFileParam('"+fileObj.id+"','filetitle');fsInstance.swfu.addFileParam('"+fileObj.id+"','filetitle',this.value)\">(optional)<br><input type='checkbox' id='zip"+fileObj.id+"' onclick=\"if(document.getElementById('zip"+fileObj.id+"').checked) { fsInstance.swfu.addFileParam('"+fileObj.id+"','unpack_p','1') } else { fsInstance.swfu.removeFileParam('"+fileObj.id+"','unpack_p') }\"> "+ zip_txt);
                    progress.ToggleCancel(true, this);
                    this.addFileParam(fileObj.id, "folder_id", folderid);
                } catch (ex) { this.debugMessage(ex); }
            }

            // FIXME (SECURITY): we are getting the user_id from the config,
            //  since we're using flash there's the current session is not used when the upload is done
            //  we can't trust the config because malicious javascript might try to insert a different user_id
            this.swfu = new SWFUpload({
                debug: false,
                upload_target_url: this.xmlhttpurl + "add-file-flash",
                upload_params: {user_id:user_id,package_id:package_id},
                file_types : "*.*",
                file_size_limit : max_file_size,
                file_queue_limit : 0,
                file_upload_limit : 10,
                begin_upload_on_queue: false,
                file_queued_handler : uploadStart,
                file_progress_handler : uploadProgress,
                file_cancelled_handler : uploadCancel,
                file_complete_handler : uploadComplete,
                queue_complete_handler : uploadQueueComplete,
                error_handler : uploadError,
                flash_url : "/resources/ajax-filestorage-ui/swfupload/swfupload.swf"
            });

        }
    },

    addFile : function() {

        if(this.upldWindow == null) {

            if (!this.config.multi_file_upload || checkFlashVersion() < 9 || Ext.isLinux) {

                /*** Single File Upload *******/

                var msg1=acs_lang_text.file_to_upload || "File to upload";
                var msg2=acs_lang_text.file_title || "Title";
                var msg3=acs_lang_text.file_description || "Description";
                var msg4=acs_lang_text.multiple_files || "Multiple Files";
                var msg5=acs_lang_text.multiple_files_msg || "This is a ZIPfile containing multiple files.";
                var modal = true;
                var title = "Upload a File";

                var uploadBody = new Ext.Panel({
                    id:'form_addfile',
                    align:'left',
                    frame:true,
                    html: "<form id=\"newfileform\" method=\"post\" enctype=\"multipart/form-data\"><input type=\"hidden\" name=\"package_id\" value=\""+this.config.package_id+"\"><input type=\"hidden\" name=\"folder_id\" value=\""+this.currentfolder+"\"><p>"+msg1+"<br /><input type=\"file\" name=\"upload_file\" id=\"upload_file\"></p><br><p>"+msg2+"<br /><input type=\"text\" name=\"filetitle\" id=\"filetitle\"></p><br><p>"+msg3+" :<br /><textarea name=\"filedescription\" id=\"filedescription\"></textarea></p><p>"+msg4+" :<br /><br /><input type=\"checkbox\" name=\"unpack_p\" value=\"t\" id=\"unpack_p\" /> "+msg5+"</p></form>"
                });
                var uploadBtns = [{
                        text: 'Upload',
                        handler: this.uploadOneFile.createDelegate(this),
                        icon:"/resources/ajaxhelper/icons/arrow_up.png",
                        cls:"x-btn-text-icon"
                    },{
                        text: 'Close',
                        handler: function(){
                            this.upldWindow.hide();
                        }.createDelegate(this),
                        icon:"/resources/ajaxhelper/icons/cross.png",
                        cls:"x-btn-text-icon"
                }]

            } else {

                /*** Multi File Upload *******/

                this.createSwfObj();

                var msg_txt = acs_lang_text.upload_intro || "Click <b>Browse</b> to select a file to upload to the selected folder on the tree.";
                var modal = false;
                var title = "Upload Files";

                var uploadBody = new Ext.Panel({
                    id:'form_multi_addfile',
                    autoScroll:true,
                    frame:true,
                    html: "<div id=\"upldMsg\">"+msg_txt+"<hr></div><div class=\"flash\" id=\"fsuploadprogress\"></div>"
                });

                uploadBody.on("render",function() {
                    this.swfu.addSetting("progress_target", "fsuploadprogress");
                },this);

                var uploadBtns = [{
                        text:'Browse',
                        handler:this.swfu.browse.createDelegate(this.swfu),
                        icon:"/resources/ajaxhelper/icons/page_add.png",
                        cls:"x-btn-text-icon"
                    },{
                        text: 'Upload',
                        handler:this.swfu.startUpload.createDelegate(this.swfu,[null,this],false),
                        icon:"/resources/ajaxhelper/icons/arrow_up.png",
                        cls:"x-btn-text-icon"
                    },{
                        text: 'Hide',
                        handler: function(){
                            this.upldWindow.hide();
                        }.createDelegate(this),
                        icon:"/resources/ajaxhelper/icons/cross.png",
                        cls:"x-btn-text-icon"
                }]
            }

            this.upldWindow = new Ext.Window({
                id:'upload-win',
                layout:'fit',
                width:400,
                height:300,
                title:title,
                closeAction:'hide',
                modal:modal,
                plain:true,
                resizable:false,
                items: uploadBody,
                buttons: uploadBtns
            });

        }

        this.upldWindow.show();
    },

    uploadOneFile : function() {

        if(Ext.get("upload_file").getValue() != "" && Ext.get("filetitle").getValue() != "") {

            var treepanel = this.layout.findById('treepanel');

            var callback = {
                success: function() {
                }, upload: function() {
                    treepanel.getSelectionModel().getSelectedNode().loaded=false;
                    treepanel.getSelectionModel().getSelectedNode().fireEvent("click",treepanel.getSelectionModel().getSelectedNode());
                    this.upldWindow.body.unmask();
                    this.upldWindow.hide();
                }, failure: function() {
                    Ext.Msg.alert(acs_lang_text.error || "Error", acs_lang_text.upload_failed || "Upload failed, please try again later.");
                }, scope: this
            }

            var loading_msg = acs_lang_text.loading || "One moment. This may take a while depending on how large your upload is."
            this.upldWindow.body.mask("<img src='/resources/ajaxhelper/images/indicator.gif'><br>"+loading_msg);

            YAHOO.util.Connect.setForm("newfileform", true, true);

            var cObj = YAHOO.util.Connect.asyncRequest("POST", this.xmlhttpurl+"add-file", callback);
            
        } else {

            Ext.Msg.alert(acs_lang_text.alert || "Alert", acs_lang_text.file_required || "<b>Title</b> and <b>File to upload</b> are required.");

        }
    },

    // create add url dialog
    addUrl : function() {

        if (this.createurlWindow == null) {

            this.createurlWindow = new Ext.Window({
                id:'createurl-win',
                layout:'fit',
                width:400,
                height:180,
                title:'Create URL',
                closeAction:'hide',
                modal:true,
                plain:true,
                resizable:false,
                items: new Ext.FormPanel({
                    id:'form_create_url',
                    align:'left',
                    autoScroll:true,
                    closable:true,
                    layout:'form',
                    defaults: {width: 230},
                    frame:true,
                    buttonAlign:'left',
                    items: [
                        {xtype:'textfield',fieldLabel: 'Title',allowBlank:false,name:'fstitle',tabIndex:1},
                        {xtype:'textfield',fieldLabel: 'URL',allowBlank:false,name:'fsurl',tabIndex:2},
                        {xtype:'textfield',fieldLabel: 'Description',name:'fsdescription',tabIndex:3}
                    ]
                }), buttons:  [{
                        text:'Submit',
                        handler: function() {
                            this.createurlWindow.findById('form_create_url').getForm().submit( {
                                url:this.xmlhttpurl+"add-url",
                                waitMsg:'One moment ....',
                                params: {package_id:this.config.package_id,folder_id:this.currentfolder},
                                reset: true,
                                scope: this,
                                success: function(form,action) {
                                    if(action.result) {
                                        this.createurlWindow.hide();
                                    } else {
                                        Ext.MessageBox.alert('Error','Sorry an error occured.<br>'+action.result.error);
                                    }
                                }, failure: function(form,action) {
                                    if(action.result) {
                                        Ext.MessageBox.alert('Error',action.result.error);
                                    }
                                }
                            } )
                        }.createDelegate(this),
                        icon:"/resources/ajaxhelper/icons/disk.png",
                        cls:"x-btn-text-icon"
                    },{
                        text: 'Close',
                        handler: function(){
                            this.createurlWindow.hide();
                        }.createDelegate(this),
                        icon:"/resources/ajaxhelper/icons/cross.png",
                        cls:"x-btn-text-icon"
                }]
            });

        }

        this.createurlWindow.show();

    },

    // rename a file or folder in the right panel
    renameItem : function(grid,i,e) {

        var filepanel = grid;
        var treepanel = this.layout.findById('treepanel');
        var node =  filepanel.store.getAt(i);
        var nodeurl = node.get("url");
        var nodetype = node.get("type");
        var nodeid = node.get("id");
        var nodesubtitle = node.get("filename");

        var successRename = function(response) {
            var err_msg_txt = acs_lang_text.an_error_occurred || "An error occurred";
            var err_msg_txt2 = acs_lang_text.reverted || "Your changes have been reverted";
            var resultObj = Ext.decode(response.responseText);
            if (!resultObj.success) {
                Ext.Msg.alert(acs_lang_text.error || "Error",err_msg_txt + ": <br><br><font color='red'>"+resultObj.error+"</font><br><br>"+err_msg_txt2);
            } else {

                if(nodetype=="folder") { treepanel.getNodeById(nodeid).setText(resultObj.newname) }

                if(nodetype!="folder"&&nodesubtitle===" ") { 
                    nodesubtitle = node.get("title");
                    node.set("filename",nodesubtitle);
                }

                node.set("title",resultObj.newname);
                node.commit();
            }
        };

        var handleRename = function(btn, text) {
           if(btn=='ok') {

                if(text != '') {

                    if(text.length > 100) {

                        Ext.Msg.alert(acs_lang_text.alert || "Alert",acs_lang_text.limitto100 || "Please limit your name to 100 characters or less.");
                        return false;

                    } else {

                        Ext.Ajax.request({
                            url:this.xmlhttpurl+"edit-name",
                            success: successRename,
                            failure: function(response) {
                                var resultObj = Ext.decode(response.responseText);
                                Ext.Msg.alert(acs_lang_text.error || "Error",error_msg_txt + "<br><br><font color='red'>"+resultObj.error+"</font>");
                            }, params: { newname:text,object_id:nodeid,type:nodetype,url:nodeurl}
                        });

                    }

                } else {

                    Ext.Msg.alert(acs_lang_text.alert || "Alert",acs_lang_text.enter_new_name || "Please enter a new name.");
                    return false;

                }

            }
        };

        Ext.Msg.show({
            title: acs_lang_text.rename || 'Rename',
            prompt: true,
            msg: acs_lang_text.enter_new_name || 'Please enter a new name for ... ',
            value: node.get("title"),
            buttons: Ext.Msg.OKCANCEL,
            fn: handleRename.createDelegate(this)
        });

        var prompt_text_el = YAHOO.util.Dom.getElementsByClassName('ext-mb-input', 'input'); 
        prompt_text_el[0].select();

    },

    // tag a file

    tagFsitem : function(grid,i,e) {

        var filepanel = grid;
        var node =  filepanel.store.getAt(i);
        var object_id = node.get("id");
        var taglist = node.get("tags");
        var package_id = this.config.package_id;
        var tagcloudpanel = this.layout.findById("tagcloudpanel");
        var xmlhttpurl = this.xmlhttpurl;
        var tagWindow = this.tagWindow;

        var savetags = function() {

            Ext.Ajax.request({
                url:this.xmlhttpurl+"add-tag",
                success: function() {
                    node.data.tags = Ext.get('fstags').getValue();
                    node.commit();
                    tagcloudpanel.load({url:xmlhttpurl+'get-tagcloud',params:{package_id:package_id}});
                    tagWindow.hide();
                }, failure: function(response) {
                    Ext.Msg.alert(acs_lang_text.error || "Error","Sorry, we encountered an error.");
                }, params: { object_id:node.id,package_id:package_id,tags:Ext.get('fstags').getValue()}
            });

         };

        if(tagWindow == null) {

            var tagformBody = new Ext.Panel({
                id:'form_addtag',
                autoScroll:true,
                frame:true,
                html: "<div style='text-align:left' class='yui-skin-sam'><p>Enter or edit one or more tags. Use commas (,) to separate the tags:<br ><br><div class='yui-ac'><input type='text' name='fstags' id='fstags' size='60' autocomplete='off' value='"+taglist+"'><div id='oAutoCompContainer1' class='yui-ac-container'></div></div>"
            });
    
            var tagBtns = [{
                    text: 'Ok',
                    icon:"/resources/ajaxhelper/icons/disk.png",
                    cls:"x-btn-text-icon",
                    handler:savetags.createDelegate(this)
                },{
                    text: 'Cancel',
                    icon:"/resources/ajaxhelper/icons/cross.png",
                    cls:"x-btn-text-icon",
                    handler: function(){
                        tagWindow.hide();
                    }.createDelegate(this)
            }];

            tagWindow = new Ext.Window({
                id:'tag-win',
                layout:'fit',
                width:450,
                height:300,
                title:"Tags",
                closeAction:'hide',
                modal:true,
                plain:true,
                autoScroll:false,
                resizable:false,
                items: tagformBody,
                buttons: tagBtns
            });

        }

        tagWindow.show();
        this.initTagAutoComplete();
    },

    initTagAutoComplete : function() {
        var oAutoComp1DS = new YAHOO.widget.DS_JSArray(oAutoCompArr);
        if(document.getElementById("fstags")) {
            var oAutoComp1 = new YAHOO.widget.AutoComplete('fstags','oAutoCompContainer1', oAutoComp1DS);
            oAutoComp1.animHoriz=false;
            oAutoComp1.animVert=false;
            oAutoComp1.queryDelay=0;
            oAutoComp1.maxResultsDisplayed=10;
            oAutoComp1.useIFrame=true;
            oAutoComp1.delimChar=",";
            oAutoComp1.allowBrowserAutocomplete=false;
            oAutoComp1.typeAhead=true;
            oAutoComp1.formatResult=function(oResultItem, sQuery) { 
                var sMarkup=oResultItem[0]; 
                return sMarkup;
            }
        }
    },

    // download archive function
    downloadArchive : function(object_id) {
        if(object_id) {
            top.location.href="download-archive/?object_id="+object_id;
        }
    },

    showShareOptions : function(grid,i,e) {

        var filepanel = grid;
        var node =  filepanel.store.getAt(i);
        var object_id = node.get("id");
        var foldertitle = node.get("title");
        var treepanel = this.layout.findById('treepanel');
        var package_id = this.config.package_id;
        var xmlhttpurl = this.xmlhttpurl;
        var shareWindow = this.sharefolderWindow;

        var sharesuccess = function() {
            var selectednode = treepanel.getSelectionModel().getSelectedNode();
            selectednode.loaded = false;
            selectednode.collapse();
            selectednode.fireEvent("click",selectednode);
            selectednode.expand();
            shareWindow.hide();
        }

        var sharefolder = function() {
            var target_folder_id = this.communityCombo.getValue();

            Ext.Ajax.request({
                url:this.xmlhttpurl+"share-folder",
                success: sharesuccess,
                failure: function(response) {
                    Ext.Msg.alert("Error","Sorry, we encountered an error. Please try again later.");
                }, params: {target_folder_id:target_folder_id,folder_id:object_id}
            });

        }

        if(shareWindow == null) {

            var shareFormBody = new Ext.Panel({
                id:'form_addtag',
                autoScroll:true,
                frame:true,
                html: "<div style='text-align:left'>Select the community where you wish to share the <b>"+foldertitle+"</b> folder with.<br><br><input type='text' size='30' id='communities_list' /></div></div>"
            });
    
            var shareBtns = [{
                    text: 'Ok',
                    icon:"/resources/ajaxhelper/icons/disk.png",
                    cls:"x-btn-text-icon",
                    handler:sharefolder.createDelegate(this)
                },{
                    text: 'Cancel',
                    icon:"/resources/ajaxhelper/icons/cross.png",
                    cls:"x-btn-text-icon",
                    handler: function(){
                        shareWindow.hide();
                    }.createDelegate(this)
            }];

            shareWindow = new Ext.Window({
                id:'share-win',
                layout:'fit',
                width:380,
                height:200,
                title:"Share Folder",
                closeAction:'hide',
                modal:true,
                plain:true,
                autoScroll:false,
                resizable:false,
                items: shareFormBody,
                buttons: shareBtns
            });

            shareWindow.on("show",function() {

                if(this.communityCombo == null) {

                    var communities = new Ext.data.JsonStore({
                        url: xmlhttpurl+'list-communities',
                        root: 'communities',
                        fields: ['target_folder_id', 'instance_name']
                    });

                    this.communityCombo = new Ext.form.ComboBox({
                        store: communities,
                        displayField:'instance_name',
                        typeAhead: true,
                        triggerAction: 'all',
                        emptyText:'Select a community',
                        hiddenName:'target_folder_id',
                        valueField:'target_folder_id',
                        forceSelection:true,
                        handleHeight: 80,
                        selectOnFocus:true,
                        applyTo:'communities_list'
                    });

                }

            },this);

        } else {

            this.communityCombo.reset();

        }

        shareWindow.show();

    },

    // redirect to object views for a file
    redirectViews : function(grid,i,e) {
        var filepanel = grid;
        var node =  filepanel.store.getAt(i);
        var object_id = node.get("id");
        window.open(window.location.protocol+"//"+window.location.hostname+"/o/"+object_id+"/info");
        window.focus();
    },


    // redirect to permissions
    redirectPerms : function(grid,i,e) {
        var filepanel = grid;
        var node =  filepanel.store.getAt(i);
        var object_id = node.get("id");
        var newwindow = window.open(window.location.protocol+"//"+window.location.hostname+":"+window.location.port+this.config.package_url+"permissions?object_id="+object_id+"&return_url="+window.location.pathname+"?package_id="+this.config.package_id+"&folder_id="+this.currentfolder);
        newwindow.focus();
    },


    // redirect to file properties
    redirectProperties : function(grid,i,e) {
        var filepanel = grid;
        var node =  filepanel.store.getAt(i);
        var object_id = node.get("id");
        var newwindow = window.open(window.location.protocol+"//"+window.location.hostname+":"+window.location.port+this.config.package_url+"file?file_id="+object_id);
        newwindow.focus();
    },

    // generates a url to the currently selected file storage item
    // if it's a file : download
    // if it's a folder : append folder_id to the current url
    copyLink : function(grid,i,e) {
        var filepanel = grid;
        var node = filepanel.store.getAt(i);
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
            var prompt_text_el = YAHOO.util.Dom.getElementsByClassName('ext-mb-input', 'input');
            prompt_text_el[0].select();
        }
    }

}

/********** UTILS *********************/

/* readCookie
read value of a cookie */
function readCookie(name) {
    var ca = document.cookie.split(';');
    var nameEQ = name + "=";
    for(var i=0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') { c = c.substring(1, c.length) }
        if (c.indexOf(nameEQ) == 0) { return c.substring(nameEQ.length, c.length) }
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
    } else { var expires = "" }
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