function showFolderContents(folder_id,tree) {

	// show 'loading...'
	document.getElementById('files').innerHTML = '<br><br><br><div class="filemsg">Loading . . . . .</div>';

	// expand the tree on click
	var thenode = tree.getNodeByProperty('id',folder_id);

	// remove highlight from the last folder
	if ( document.getElementById('lastfolder').value != "" ) {
		if (tree.getNodeByProperty('id',document.getElementById('lastfolder').value) != null ) {
			var oldnode = tree.getNodeByProperty('id',document.getElementById('lastfolder').value);		
			oldlabel = oldnode.getLabelEl();
			document.getElementById(oldlabel.id).style.backgroundColor='white';
			document.getElementById(oldlabel.id).style.color='black';
		}
	}

	// open or close the node
	thenode.toggle();

	// write this node's id to the hidden field
	document.getElementById('lastfolder').value = folder_id;

	// fetch contents via ajax
	var postData ='folder_id='+folder_id;
	var callback = {
		success: function(o) { 
			document.getElementById('files').innerHTML=o.responseText;
		}
	}
	YAHOO.util.Connect.asyncRequest('POST', '/ajaxfs/xmlhttp/showfoldercontents', callback, postData); 
}

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

function openfolder(object_id) {
	// get a reference to the node for the given object_id
	var thenode = tree.getNodeByProperty('id',object_id);
	thenode.parent.expand();
	showFolderContents(object_id,tree);
}