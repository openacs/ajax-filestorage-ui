# ajax-filestorage-ui/www/index.tcl

ad_page_contract {

	Ajax Based File Manager using OpenACS File Storage and Yahoo's Tree View Control.
	Optionally specify a the package_id of the file storage instance you wish to manage
	or optionally specify a folder_id in the query string to tell which folder to open
	
	@author Hamilton Chua (ham@solutiongrove.com)
	@creation-date 2006-02-04
} {
    {package_ids:integer,multiple,optional }
    {folder_id:integer,optional }
}

# declare some variables
set page_title "Ajax File Storage"

# load yahoo events sources
# this is needed for functions inside ajaxfs.js
set js_sources [ah::yui::js_sources -source "connection"]

# where is afs mounted
set afs_url [afs::get_url]

# who is viewing, used to check permissions
set viewing_user_id [auth::require_login]

# holds counter for number of folders
set count_folders 0

# variable name for the tree view control
set treevarname "tree"

# refine query
set exclude_sql ""
# did we get a package_id from querystring
if { [exists_and_not_null package_ids] } {
	set package_ids_list [join $package_ids ","]
	set exclude_sql "and package_id in ($package_ids_list)"
}

# create the nodes for our tree
set nodes [list]
db_foreach "get_fs_instances" "" {

	# verify if the folder has contents
	if { [db_string "countcontent" ""] > 0 } { 
		set dyn_load_script "loadDataForNode"
	} else {
		set dyn_load_script ""
	}

	# create the node
	lappend nodes [list "$root_folder" "$instance_name" "$treevarname" "javascript:showFolderContents('${root_folder}',$treevarname)" "" "${dyn_load_script}"]

	incr count_folders

}

set js_script [ah::yui::create_tree -element "folders" \
		-nodes $nodes \
		-varname "tree" \
		-css "/resources/ajax-filestorage-ui/tree.css" ]

set js_script [ah::enclose_in_script -script $js_script]