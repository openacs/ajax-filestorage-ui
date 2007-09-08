ad_page_contract {

    Delete an fs item.

    @author Hamilton Chua (ham@solutiongrove.com)
    @creation-date 2007-06-03

} {
    object_id
}

set user_id [ad_conn user_id]

set result 1
set fs_object_ids [split $object_id ","]
set viewing_user_id [ad_conn user_id]

db_transaction {

    foreach fs_object_id $fs_object_ids {

        if { ![fs::object_p -object_id $fs_object_id]} {
            set result "Sorry, this object is not a File Storage Object."
            db_abort_transaction
            break;
        } else {
            # check if user has permission to delete the file/folder
            if { [permission::permission_p -party_id $viewing_user_id -object_id $fs_object_id -privilege "delete"] } {
                if { [fs::folder_p -object_id $fs_object_id] } {
                    fs::delete_folder -folder_id $fs_object_id -parent_id [fs::get_parent -item_id $fs_object_id]
                } else {
                    fs::delete_file -item_id $fs_object_id
                }
            } else {
                set result "You do not have permission to delete this file."
                db_abort_transaction
                break;
            }
        }

    }

} on_error {

    ns_return 500 "text/html" $errmsg
    ad_script_abort

}

