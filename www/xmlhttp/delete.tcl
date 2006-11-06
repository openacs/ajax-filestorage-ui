ad_page_contract {

    Delete a file from a folder. This page is called via XMLHTTP.
	The xmlhttp call should pass the id of the element dropped to the trash icon.
	This dropped element should have the file_id to be deleted.

    @author Hamilton Chua (ham@solutiongrove.com)
    
} {
	file_element
}

set fs_object_id [string range $file_element 4 [string length $file_element]]
set viewing_user_id [ad_conn user_id]

# ns_log Notice "HAM : fs_object_id : $fs_object_id"

set action ""
set error 0

if { ![fs::object_p -object_id $fs_object_id] || [fs::folder_p -object_id $fs_object_id]} {
	set message "Sorry, this object is not a File Storage Object. Delete Failed."
	set error 1
} else {
    # DEDS: for export
    set fs_package_id [lindex [fs::get_folder_package_and_root $fs_object_id] 0]
	# check if user has permission to delete the file
	if { [permission::permission_p -party_id $viewing_user_id -object_id $fs_object_id -privilege "delete"] } {
		set message "Success !! File has been deleted."
		set action "\$('row_${fs_object_id}').style.display='none';"
	
		db_transaction {
			db_exec_plsql file_delete "select file_storage__delete_file(:fs_object_id);"
			# fs::delete_file -item_id $fs_object_id -parent_id [fs::get_parent -item_id $fs_object_id]
		} on_error {
			set message "Delete Failed."
			set action ""
			set error 1
		}	
	} else {
		set message "You do not have permission to delete this file."
		set error 1
	}
}

if {[info exists fs_package_id]} {
    fs::export::export_one_instance -package_id $fs_package_id
}
