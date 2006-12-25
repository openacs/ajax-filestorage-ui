ad_page_contract {

	Populates the file container div with the contents of the passed folder id.
	This page is meant to be called via xmlhttp

	@author Hamilton Chua (ham@solutiongrove.com)
	@creation-date Feb 24, 2006
} {
	{folder_id:integer}
	{element ""}
 	{orderby "type"}
}

 #ns_log Notice "HAM : fetching $folder_id : $element"

# TODO :refine permissions
set viewing_user_id [ad_conn user_id]

# get the root folder
set root_package_id [afs::get_root_folder -folder_id $folder_id]
set fs_url [apm_package_url_from_id $root_package_id]

if {![exists_and_not_null fs_url]} {
    set fs_url ""
}

set folder_name [lang::util::localize [fs::get_object_name -object_id  $folder_id]]
set folder_path ""

if {![exists_and_not_null root_folder_id]} {
    set root_folder_id [fs::get_root_folder -package_id $root_package_id]
}

if {![string equal $root_folder_id $folder_id]} {
    set folder_path [db_exec_plsql get_folder_path {}]
} else {
    set folder_path ""
}

set content_size_total 0
set counter 0

# ns_log Notice "HAM : File Storage URL : $fs_url : $folder_path"

if {![exists_and_not_null n_past_days]} {
    set n_past_days 99999
}

db_multirow -extend { shortened_name shortened_title icon last_modified_pretty content_size_pretty download_url object_counter file_list_start file_list_end} contents select_folder_contents {} {

# HAM : make names shorter
# *************
     set name [string trim $name]
    if { [string length $name] > 29 } {
	set shortened_name [string range $name 0 29]
	append shortened_name "..."
    } else {
	set shortened_name $name
    }
     set title [string trim $title]
    if { [string length $title] > 29 } {
	set shortened_title [string range $title 0 29]
	append shortened_title "..."
    } else {
	set shortened_title $title
    }
     set file_upload_name [string trim $file_upload_name]
# **************

    set last_modified_ansi [lc_time_system_to_conn $last_modified_ansi]

    set last_modified_pretty [lc_time_fmt $last_modified_ansi "%x %X"]
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

    set file_upload_name [fs::remove_special_file_system_characters -string $file_upload_name]

    if { ![empty_string_p $content_size] } {
        incr content_size_total $content_size
    }

    set name [lang::util::localize $name]
    switch -- $type {
	folder {
	    # set file_url "${fs_url}index?[export_vars {{folder_id $object_id}}]"
	    set file_url "javascript:openfolder('${object_id}')"
        set download_url $file_url
	    set icon "/resources/ajax-filestorage-ui/icons/folder.gif"
	}
	url {
	    set icon "/resources/acs-subsite/url-button.gif"
	    set file_url ${url}
        set download_url $file_url
	}
	"application/pdf" {
	    set file_url "${fs_url}view/${file_url}"
            set download_url "${fs_url}download/?[export_vars {{file_id $object_id}}]"
	    set icon "/resources/ajax-filestorage-ui/icons/pdf.gif"
	}
	"application/vnd.ms-excel" {
	    set file_url "${fs_url}view/${file_url}"
            set download_url "${fs_url}download/?[export_vars {{file_id $object_id}}]"
	    set icon "/resources/ajax-filestorage-ui/icons/excel.gif"
	}
	"application/zip" {
	    set file_url "${fs_url}view/${file_url}"
            set download_url "${fs_url}download/?[export_vars {{file_id $object_id}}]"
	    set icon "/resources/ajax-filestorage-ui/icons/zip.gif"
	}
	"application/msword" {
	    set file_url "${fs_url}view/${file_url}"
        set download_url "${fs_url}download/?[export_vars {{file_id $object_id}}]"
	    set icon "/resources/ajax-filestorage-ui/icons/word.gif"
	}
    "video/x-flv" {
        set file_url "${fs_url}view/${file_url}"
        set download_url "${fs_url}download/?[export_vars {{file_id $object_id}}]"
        set icon "/resources/ajax-filestorage-ui/icons/flv.jpg"
    }
	default {
	    set icon "/resources/ajax-filestorage-ui/icons/icon_html.gif"
	    set file_url "${fs_url}view/${file_url}"
        set download_url "${fs_url}download/?[export_vars {{file_id $object_id}}]"
	}

    }

    # We need to encode the hashes in any i18n message keys (.LRN plays this trick on some of its folders).
    # If we don't, the hashes will cause the path to be chopped off (by ns_conn url) at the leftmost hash.
    regsub -all {#} $file_url {%23} file_url

    set object_counter [incr counter]

    set categories [join [category::get_names [category::get_mapped_categories $object_id]] ", "]


}
