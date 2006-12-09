ad_page_contract {

	Populates a parent node with its children. The folder id is passed to this via xmlhttp call.
	
	@author Hamilton Chua (ham@solutiongrove.com)
	@creation-date Feb 24, 2006
} {
	{parentfolderid:integer}
}

# what this page will return to the xmlhttp call
set content "var none = 1;"

# who's looking at this now
set viewing_user_id [ad_conn user_id]

# set a variable to store the script
set script ""

# check if we got a parentnode
if { [exists_and_not_null parentfolderid] } {

	db_foreach "select_folder_contents" "" {


		# verify if the folder has contents
		if { [db_string "countcontent" ""] > 0 } { 
			set dyn_load_script "loadDataForNode"
		} else {
			set dyn_load_script ""
		}

		# create the node
		append script [ah::yui::create_tree_node -varname $object_id \
				-label $name \
				-treevarname "tree" \
				-href "javascript:showFolderContents('${object_id}',tree)" \
				-attach_to_node "$parentfolderid" \
				-dynamic_load $dyn_load_script ]

	}

	set content $script
}