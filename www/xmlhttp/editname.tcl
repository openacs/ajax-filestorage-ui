ad_page_contract {

	Accepts the object_id and changes it to newname

	@author Hamilton Chua (ham@solutiongrove.com)
	@creation-date May 7, 2006
} {
	newname
	object_id
    type
}

# change the name of the give object_id
if { [exists_and_not_null newname] } {
    # determine if this is a folder or file
    if { $type == "folder" } {
        db_dml "rename_folder" "update cr_folders set label = :newname where folder_id = :object_id"
    } else {
        db_dml "rename_file" "update cr_revisions set title=:newname where revision_id=(select live_revision from cr_items where item_id=:object_id)"
    }
}