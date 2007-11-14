# ajax-filestorage-ui/lib/ajaxfs-include.tcl
# This include should be placed on a page
#  where you wish to have an ajaxfs instance
#  this include expects the following variables
# package_id : package_id of the file storage instance
# folder_id : the folder that will be opened on load, defaults to the root folder
# layoutdiv : the id of the div element where you want ajaxfs to be rendered
# theme : can be any of the following
# - default
# - aero
# - gray
# - vista

if { [exists_and_not_null theme] } {
    set theme "gray"
}

set compressjs [parameter::get -package_id [ajaxfs::get_package_id] -parameter "compressjs" -default 0]
set debug [parameter::get -package_id [ajaxfs::get_package_id] -parameter "debug" -default 1]

set user_id [ad_conn user_id]
set create_url_p [parameter::get -package_id $package_id -parameter "EnableCreateUrl" -default 1]

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
        append options ",ispublic:$public"
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