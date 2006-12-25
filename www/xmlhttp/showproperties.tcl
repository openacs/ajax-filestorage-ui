ad_page_contract {

    Retrieves the properties of a file or folder.
    Shows actions that a user can perform for the given item
    This page is meant to be called via xmlhttp

    @author Hamilton Chua (ham@solutiongrove.com)
    @creation-date 2006-12-25
} {
    {object_id:integer}
    {type "file"}
}

set viewing_user_id [ad_conn user_id]
set found_obj [db_0or1row "select_one_file_object" {}]

#  ** try to get the path to this object_id **

# get the root folder from the parent of this object
set root_package_id [afs::get_root_folder -folder_id $parent_id]
set fs_url [apm_package_url_from_id $root_package_id]

# ** properly format the values for display **

# last modified
set last_modified_ansi [lc_time_system_to_conn $last_modified_ansi]
set last_modified_pretty [lc_time_fmt $last_modified_ansi "%x %X"]

# content size
if {[string equal $type "folder"]} {
    set content_size_pretty [lc_numeric $content_size]
    append content_size_pretty " [_ file-storage.items]"
    set pretty_type "Folder"
} else {
    if {$content_size < 1024} {
        set content_size_pretty "[lc_numeric $content_size] [_ file-storage.bytes]"
    } else {
        set content_size_pretty "[lc_numeric [expr $content_size / 1024 ]] [_ file-storage.kb]"
    }
}

# customize icon
switch -- $type {
    folder {
        set icon "/resources/ajax-filestorage-ui/icons/folder.gif"
        set download_url "${fs_url}/download-archive/index?object_id=${object_id}"
    }
    url {
        set icon "/resources/acs-subsite/url-button.gif"
    }
    "application/pdf" {
        set icon "/resources/ajax-filestorage-ui/icons/pdf.gif"
    }
    "application/vnd.ms-excel" {
        set icon "/resources/ajax-filestorage-ui/icons/excel.gif"
    }
    "application/zip" {
        set icon "/resources/ajax-filestorage-ui/icons/zip.gif"
    }
    "application/msword" {
        set icon "/resources/ajax-filestorage-ui/icons/word.gif"
    }
    "video/x-flv" {
        set icon "/resources/ajax-filestorage-ui/icons/flv.jpg"
    }
    default {
        set icon "/resources/ajax-filestorage-ui/icons/icon_html.gif"
    }
}