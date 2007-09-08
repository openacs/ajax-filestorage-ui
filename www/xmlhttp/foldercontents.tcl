ad_page_contract {

    Given the folder_id, this page will return JSON with
        data of the contents of that folder

    @author Hamilton Chua (ham@solutiongrove.com)
    @creation-date 2007-06-03

} {
    folder_id:integer,notnull
    {sort "fs_objects.title"}
    {dir "DESC"}
}

# who's looking
set viewing_user_id [ad_conn user_id]

# find out which file storage instance we are at
#  so that we can get a path to prefix to the files

set root_package_id [ajaxfs::get_root_folder -folder_id $folder_id]
set fs_url [apm_package_url_from_id $root_package_id]

set folder_name [lang::util::localize [fs::get_object_name -object_id  $folder_id]]
set folder_path ""

if {![exists_and_not_null fs_url]} {  set fs_url "" }
if {![exists_and_not_null root_folder_id]} {  set root_folder_id [fs::get_root_folder -package_id $root_package_id] }

if {![string equal $root_folder_id $folder_id]} {
    set folder_path [db_exec_plsql dbqd.file-storage.www.folder-chunk.get_folder_path {}]
} else {
    set folder_path ""
}

set content_size_total 0
set counter 0
set n_past_days 99999

# sorting **********
set orderby ""
if { [exists_and_not_null sort] } {
    if {$sort == "title_and_name"} { set sort "fs_objects.title" }
    if {$sort == "size"} { set sort "fs_objects.content_size" }
    if {$sort == "lastmodified"} { set sort "fs_objects.last_modified" }
    set orderby "order by $sort $dir"
}

db_multirow -extend { filename icon last_modified_pretty content_size_pretty download_url object_counter file_list_start file_list_end write_p} contents dbqd.file-storage.www.folder-chunk.select_folder_contents { } {

    if { ![exists_and_not_null title] } { set title $name }

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

    set last_modified_pretty [lc_time_fmt $last_modified_ansi "%x %X"]

    # icon
    switch -- $type {
        folder {
            set icon "<img src='/resources/ajax-filestorage-ui/icons/folder.gif'>"
        }
        url {
            set icon "<img src='/resources/acs-subsite/url-button.gif'>"
            set download_url $url
            set content_size_pretty ""
        }
        "application/pdf" {
            set icon "<img src='/resources/ajax-filestorage-ui/icons/pdf.gif'>"
        }
        "application/vnd.ms-excel" {
            set icon "<img src='/resources/ajax-filestorage-ui/icons/excel.gif'>"
        }
        "application/zip" {
            set icon "<img src='/resources/ajax-filestorage-ui/icons/zip.gif'>"
        }
        "application/msword" {
            set icon "<img src='/resources/ajax-filestorage-ui/icons/word.gif'>"
        }
        "video/x-flv" {
            set icon "<img src='/resources/ajax-filestorage-ui/icons/flv.jpg'>"
        }
        default {
            set icon "<img src='/resources/ajax-filestorage-ui/icons/icon_html.gif'>"
        }
    }

    if { $type != "folder"} {
        if { ![exists_and_not_null download_url] } {
        set download_url "${fs_url}download/${name}?[export_vars {{file_id $object_id}}]"
        }
        set filename $name
        if { $title == $name } { set filename " "}
    } else {
        set download_url "javascript:void(0)"
        set filename " "
    }

    if { [permission::permission_p -party_id $viewing_user_id -object_id $object_id -privilege "write"] == "t" } { set write_p "true" } else { set write_p "false" }

    incr counter

}