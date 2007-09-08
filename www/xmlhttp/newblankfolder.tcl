ad_page_contract {

    Creates a new folder in the given folder_id

    @author Hamilton Chua (ham@solutiongrove.com)
    @creation-date 2007-03-13
} {
    {folder_id:integer,notnull}
}

# make sure user is logged in
set user_id [ad_conn user_id]

# is this the root folder
set fslistinfo [fs::get_folder_package_and_root $folder_id]
if { $folder_id == [lindex $fslistinfo 1] } {
    set parent_id $folder_id
} else {
    # check permissions on parent folder
    # see if the user has write
    set parent_id [fs::get_parent -item_id $folder_id]
}

if { ![permission::permission_p -no_cache \
        -party_id $user_id \
        -object_id $parent_id \
        -privilege "write"] } {

    ns_return 500 "text/html" "You do not have permission to create a folder"
    ad_script_abort
}


set result 0
set folder_name "New Folder"
set description ""

db_transaction {

    set new_folder_id [fs::new_folder \
        -name [ns_rand] \
        -pretty_name $folder_name \
        -parent_id $folder_id \
        -creation_user $user_id \
        -creation_ip [ad_conn peeraddr] \
        -description $description]

    set result $new_folder_id

} on_error {

    ns_return 500 "text/html"  $errmsg
    ad_script_abort

}

