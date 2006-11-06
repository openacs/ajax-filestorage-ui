ad_page_contract {

	Accepts the object_id and changes it to newname
	
	@author Hamilton Chua (ham@solutiongrove.com)
	@creation-date May 7, 2006
} {
	newname
	object_id
}

# get the folder_id from the object_id
set folder_id [db_string "getfolder" "select parent_id from fs_objects where object_id=:object_id"]

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
    set folder_path [db_exec_plsql get_folder_path "select content_item__get_path(:folder_id, :root_folder_id)"]
} else {
    set folder_path ""
}

ns_log Notice "HAM : $folder_id : $root_folder_id, $folder_path, $fs_url"

# change the name of the give object_id
if { $newname != "Type New Name" } {
 db_dml "rename_file" "update cr_revisions set title=:newname where revision_id=(select live_revision from cr_items where item_id=:object_id)"
}

# get the info of the object
db_0or1row "getinfo" "
            select fs_objects.object_id,
                   fs_objects.mime_type,
                   trim(fs_objects.name) as name,
                   fs_objects.live_revision,
                   fs_objects.type,
                   fs_objects.pretty_type,
                   to_char(fs_objects.last_modified, 'YYYY-MM-DD HH24:MI:SS') as last_modified_ansi,
                   fs_objects.content_size,
                   fs_objects.url,
                   fs_objects.sort_key,
                   fs_objects.file_upload_name,
                   case
                     when :folder_path is null
                     then fs_objects.file_upload_name
                     else :folder_path || '/' || fs_objects.file_upload_name
                   end as file_url,
                   trim(fs_objects.title) as title
            from fs_objects where object_id = :object_id"

switch -- $type {
	folder {
		set file_url "javascript:openfolder('${object_id}')"
	}
	url {
		set file_url ${url}
	}
	"application/pdf" {
		set file_url "${fs_url}view/${file_url}"
	}
	"application/vnd.ms-excel" {
		set file_url "${fs_url}view/${file_url}"
	}
	"application/zip" {
		set file_url "${fs_url}view/${file_url}"
	}
	"application/msword" {
		set file_url "${fs_url}view/${file_url}"
	}
	"video/flv" {
		set file_url "${fs_url}view/${file_url}"
	}
	default {
		set file_url "${fs_url}view/${file_url}"
	}
}

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
