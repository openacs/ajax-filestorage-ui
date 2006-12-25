/* loadJs
helper that executes anything that is between script tags
    in a responseText returned by an ajax call */

function loadJs(responseText) {
        var re=/(?:<script.*(?:src=[\"\'](.*)[\"\']).*>.*<\/script>)|(?:<script.*>([\S\s]*?)<\/script>)/ig;
        var match;
        while (match = re.exec(responseText)) {
                var s0 = document.createElement("script");
                if (match[1])
                s0.src = match[1];
                else if (match[2])
                s0.text = match[2];
                else
                continue;
                document.getElementsByTagName("head")[0].appendChild(s0);
        }
}

/* trimString
helper to remove trailing and leading spaces from a string */
function trimString (str) {
  str = this != window? this : str;
  return str.replace(/^\s+/g, '').replace(/\s+$/g, '');
}

/* editInPlace
dynamically make the properties_name element editable*/

function editInPlace (objid,namediv,controldiv,type) {
    this.objid = objid
    this.namediv = document.getElementById(namediv);
    this.controldiv = document.getElementById(controldiv);
    this.oldnamediv_value = this.namediv.innerHTML;
    this.oldcontroldiv_value = this.controldiv.innerHTML;
    this.form_textbox = 'edip_name';
    this.form_ok = 'edip_save';
    this.form_cancel = 'edip_cancel';
    this.type = type;
    this.setvalues = function (nameval,controlval) {
        this.namediv.innerHTML = nameval;
        this.controldiv.innerHTML = controlval;
    }
    this.addListeners = function() {
        thisobj =this;
        YAHOO.util.Event.addListener(this.form_ok, "click", this.saveedit,thisobj);
        YAHOO.util.Event.addListener(this.form_cancel, "click", this.canceledit,thisobj);
    }
    this.rmListeners = function() {
        thisobj =this;
        YAHOO.util.Event.removeListener(this.form_ok, "click", this.saveedit,thisobj);
        YAHOO.util.Event.removeListener(this.form_cancel, "click", this.canceledit,thisobj);
    }
    this.createform = function() {
        var editform = "<input id='"+this.form_textbox+"' type=\"text\" value=\""+trimString(this.oldnamediv_value)+"\">";
        editform = editform + "<input type='button' id='"+this.form_ok+"' value='Ok' onclick=''>&nbsp;";
        editform = editform + "<input type='button' id='"+this.form_cancel+"' value='Cancel' onclick=''>";
        this.setvalues(editform,'');
        document.getElementById('edip_name').select();
        this.addListeners();
    }
    this.canceledit = function(el,obj) {
        obj.rmListeners();
        obj.setvalues(obj.oldnamediv_value,obj.oldcontroldiv_value);
    }
    this.saveedit = function(el,obj) {
        // save the new name
        var postData ='type='+obj.type+'&object_id='+obj.objid+'&newname='+document.getElementById(obj.form_textbox).value;
        var callback = {
            success: function(o) {
                obj.namediv.innerHTML=o.responseText;
                obj.controldiv.innerHTML=obj.oldcontroldiv_value;

                // check if node exists in tree
                if ( tree != 'undefined') {
                    var node = tree.getNodeByProperty('id',obj.objid);
                    // update node name
                    if ( node != null) {
                        document.getElementById(node.getLabelEl().id).innerHTML=o.responseText;
                    }
                }

            }, argument: { thisobj:obj }
        }
        YAHOO.util.Connect.asyncRequest('POST', '/ajaxfs/xmlhttp/editname', callback, postData);
    }
    this.createform();
}

/* showFolderContents
Called when a folder is clicked, fetches all the files and folders in a node */

function showFolderContents(folder_id,tree,sort) {

	// show 'loading...'
	document.getElementById('files').innerHTML = '<br><br><br><div class="statusmsg">Loading . . . . .</div>';

	// expand the tree on click
	var thenode = tree.getNodeByProperty('id',folder_id);

	// remove highlight from the last folder
	if ( document.getElementById('lastfolder').value != "" ) {
		if (tree.getNodeByProperty('id',document.getElementById('lastfolder').value) != null ) {
			var oldnode = tree.getNodeByProperty('id',document.getElementById('lastfolder').value);
            YAHOO.util.Dom.removeClass(oldnode.getLabelEl().id,'folderselected');
		}
	}

	// open or close the node
	thenode.toggle();

	// write this node's id to the hidden field
	document.getElementById('lastfolder').value = folder_id;

    // let's highlight the new selected folder
    var newnode = tree.getNodeByProperty('id',document.getElementById('lastfolder').value);
    YAHOO.util.Dom.addClass(newnode.getLabelEl().id,'folderselected');

    // empty the items in the fsList object_id
    fileList.emptyItems();

	// fetch contents via ajax
	var postData ='folder_id='+folder_id+'&orderby='+sort;
	var callback = {
		success: function(o) {
			document.getElementById('files').innerHTML=o.responseText;
            loadJs(o.responseText);
		}
	}
	YAHOO.util.Connect.asyncRequest('POST', '/ajaxfs/xmlhttp/showfoldercontents', callback, postData);

    showProperties(folder_id,'folder');
}

/* showProperties
Populates the action and properties panel with more information and actions*/

function showProperties (object_id,type) {

    var southpanel = innerLayout.getRegion('south');
    southpanel.setActivePanel('properties');

    // fetch contents of properites
    var postData ='object_id='+object_id+'&type='+type;
    var callback = {
        success: function(o) {
            loadJs(o.responseText);
            document.getElementById('properties').innerHTML=o.responseText;
        }
    }
    YAHOO.util.Connect.asyncRequest('POST', '/ajaxfs/xmlhttp/showproperties', callback, postData);

    if (type === "folder" ) {
        southpanel.hidePanel('revisions');
    } else {
        southpanel.unhidePanel('revisions');
        // TODO : use ajax to fetch revisions table of the object
    }
}

/* loadDataForNode
Dynamically loads the child nodes of a given parent node*/

function loadDataForNode(node, onCompleteCallback) {

	var postData ='parentfolderid='+node.data.id;
	var callback = {
		success: function(o) {
			eval(o.responseText);
			onCompleteCallback();
		}, failure: function(o) {
			alert('Error ' + o.status + ' -- ' + o.statusText);
			onCompleteCallback();
		}
	}

	YAHOO.util.Connect.asyncRequest('POST', '/ajaxfs/xmlhttp/loadchildnodes', callback, postData);
}

/* openfolder
Opens a node in the folder tree */

function openfolder(object_id) {
	// get a reference to the node for the given object_id
	var thenode = tree.getNodeByProperty('id',object_id);
	thenode.parent.expand();
	showFolderContents(object_id,tree,'name');
}

/* ajaxFsLayout
Prototype Object to generate the layout */

var layout;
var innerLayout;

ajaxFsLayout = function() {
    return {
        init : function() {
            layout = new YAHOO.ext.BorderLayout(document.body, {
                hideOnLayout: true,
                north: {
                    split:false,
                    initialSize: 25,
                    titlebar: false
                },
                west: {
                    split:true,
                    initialSize: 300,
                    titlebar: true,
                    collapsible: true,
                    minSize: 100,
                    maxSize: 400
                },
                center: {
                    autoScroll: false
                }
            });
            layout.beginUpdate();
            layout.add('north', new YAHOO.ext.ContentPanel('header', ''));
            layout.add('west', new YAHOO.ext.ContentPanel('folders', {title: 'Folders', fitToFrame:true, closable:false}));
            innerLayout = new YAHOO.ext.BorderLayout('content', {
                south: {
                    split:true,
                    initialSize: 200,
                    minSize: 100,
                    maxSize: 400,
                    autoScroll:true,
                    collapsible:true,
                    titlebar: true
                },
                center: {
                    autoScroll:true
                }
            });
            innerLayout.add('south', new YAHOO.ext.ContentPanel('revisions', {title: 'Revisions', closable: false}));
            innerLayout.add('south', new YAHOO.ext.ContentPanel('properties', {title: 'Properties', closable: false}));
            innerLayout.add('center', new YAHOO.ext.ContentPanel('filepane'));
            layout.add('center', new YAHOO.ext.NestedLayoutPanel(innerLayout));
            layout.endUpdate();
        }
    }
}();
YAHOO.ext.EventManager.onDocumentReady(ajaxFsLayout.init, ajaxFsLayout, true);

/* fsList
object that manages fsItem objects*/

function fsList() {
    //properties
    // array of fsItems
    this.items = [];
    //methods
    // adds an fsItem to the array of items
    this.push = function(obj) {
        this.items.push(obj);
    }
    // retrieves an fsItem from array given the id
    this.getItem = function(id) {
        var x=0;
        for (x=0;x<this.items.length;x++) {
                if (this.items[x].itemid == id) {
                        return this.items[x];
                }
        }
        return null;
    }
    // empties the items array
    this.emptyItems = function () {
            var x=0;
            for (x=0;x<this.items.length;x++) {
                    this.items[x].rmrowClickListen();
                    delete this.items[x];
            }
            this.items = [];
    }
}

var fileList = new fsList();

/* fsItem
object for a file item */

function fsItem(id,type) {
    //properties
    this.itemid = id;
    this.icon = "icon_"+id;
    this.row = "row_"+id;
    this.type = type;
    //methods
    // should be executed when row is clicked
    this.rowClicked = function(e,obj) {
        showProperties(obj.itemid,obj.type);
        if ( obj.type === "folder" ) {
            showFolderContents(obj.itemid,tree,'name');
        }
    }
    // add listener
    this.addrowClickListen = function() {
        thisobj =this;
        YAHOO.util.Event.addListener(this.row, "click", this.rowClicked,thisobj);
    }
    // remove listener
    this.rmrowClickListen = function() {
        thisobj =this;
        YAHOO.util.Event.removeListener(this.row, "click", this.rowClicked,thisobj);
    }
    //init
    // automatically push this object into the fileList
    fileList.push(this);
    // add a listener for the row click event
    this.addrowClickListen();
}
