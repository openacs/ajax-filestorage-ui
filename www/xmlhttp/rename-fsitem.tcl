ad_page_contract {

    Accepts the object_id and a new name for the object.
        Returns 1 if update is successful, should return an error message if not.

    @author Hamilton Chua (ham@solutiongrove.com)
    @creation-date 2006-05-07
} {
    newname
    object_id
    type
    url:optional
}

# make sure user is logged in
set user_id [auth::require_login]

# check permissions on parent folder
# see if the user has write
if { ![permission::permission_p -no_cache \
        -party_id $user_id \
        -object_id $object_id \
        -privilege "write"] } {

    ns_return 500 "text/html" "You do not have permission to rename."
    ad_script_abort
}

set result "{\"success\":true }"

# change the name of the give object_id
if { [exists_and_not_null newname] } {
    # determine if this is a folder or file
    db_transaction {
        if { $type == "folder" } {
            fs::rename_folder -folder_id $object_id -name $newname
        } elseif { $type == "url" } {
            content_extlink::edit -extlink_id $object_id -url $url -label $newname -description ""
        } else {
            set title $newname
            set file_id $object_id
            db_dml dbqd.file-storage.www.file-edit-2.edit_title {}
        }
    } on_error {
        ns_return 500 "text/html"  "{\"success\":false,\"error\":\"$errmsg\"}"
        ad_script_abort
    }
}