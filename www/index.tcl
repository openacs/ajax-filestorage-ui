ad_page_contract {

    Sample page that loads ajax file storage
    @author Hamilton Chua (ham@solutiongrove.com)

} {
    {package_id:integer,optional}
    {root_folder_id:integer,optional}
    {folder_id:integer,optional }
}

set user_id [ad_conn user_id]
set page_title "Ajax File Storage UI"
set options ""

if { [exists_and_not_null root_folder_id] } {
    if {  ![db_0or1row "get_folder_name" "select name as instance_name from fs_folders where folder_id = :root_folder_id"] } {
        ad_return_complaint 1 "Root folder does not exist."
        ad_script_abort
    }
    set package_id [ajaxfs::get_root_folder -folder_id $root_folder_id]
}

if { [exists_and_not_null package_id] } {
    append options "package_id:$package_id"
    append options ",package_url:\"[apm_package_url_from_id $package_id]\""
    if { [exists_and_not_null root_folder_id] } {
        append options ",rootfolder:$root_folder_id"
    }
    if { [exists_and_not_null folder_id] } {
        append options ",initOpenFolder:$folder_id"
        append options ",pathToFolder: new Array([ajaxfs::generate_path -folder_id $folder_id])"
    }
    if { [exists_and_not_null public] } {
        append options ",public:$public"
    }
    if { [exists_and_not_null layoutdiv] } {
        append options ",layoutdiv:\"$layoutdiv\""
    } else {
        set layoutdiv "fscontainer"
    }
    set max_file_size [parameter::get -package_id $package_id -parameter "MaximumFileSize"]
    append options ",max_file_size:\"$max_file_size\""
    append options ",user_id:\"$user_id\""
} else {
    ad_return_complaint 1 "Package id is required."
    ad_script_abort
}