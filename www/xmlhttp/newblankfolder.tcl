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
set description ""
set pretty_folder_name "New Folder"
set folder_name [string tolower [util_text_to_url -text $pretty_folder_name]]
set file_exists [db_string "count_existing" "select count(*) from cr_items where name like '$folder_name%' and parent_id=:folder_id"]
if { $file_exists != 0 } {
    append folder_name "_$file_exists"
    append pretty_folder_name " ($file_exists)"
}   


db_transaction {

    set new_folder_id [fs::new_folder \
        -name $folder_name \
        -pretty_name $pretty_folder_name \
        -parent_id $folder_id \
        -creation_user $user_id \
        -creation_ip [ad_conn peeraddr] \
        -description $description]

    set result "\[{\"id\":\"$new_folder_id\",\"pretty_folder_name\":\"$pretty_folder_name\"}\]"

} on_error {

    ns_return 500 "text/html"  $errmsg
    ad_script_abort

}

