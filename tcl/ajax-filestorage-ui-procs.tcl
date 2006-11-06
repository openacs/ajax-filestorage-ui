ad_library {

	Library for Ajax File Storage UI
 	uses Ajax Helper package with the Yahoo User Interface Library.
	http://developer.yahoo.net/yui/index.html

    @author Hamilton Chua (ham@solutiongrove.com)
    @creation-date 2006-02-24
}

namespace eval afs { }

ad_proc -private afs::get_package_id  {

} {
	Return the package_id of the installed and mounted ajax file storage ui

	@author Hamilton Chua (ham@solutiongrove.com)	
	@creation-date 2006-02-24
	@return 

	@error 

} {
	return [apm_package_id_from_key "ajax-file-storage-ui"]
}

ad_proc -private afs::get_url  {

} {
	Return the URL to the mounted ajax file storage ui instance

	@author Hamilton Chua (ham@solutiongrove.com)	
	@creation-date 2006-02-24
	@return 

	@error 

} {
	return [apm_package_url_from_id [afs::get_package_id]]
}

ad_proc -private afs::root_folder_p  {
	-folder_id:required
} {
	Determine if the given folder id is a root folder
	if it is, this proc returns the package id of the root folder.
	if not, this proc returns an empty string.

	@author Hamilton Chua (ham@solutiongrove.com)	
	@creation-date 2006-02-24
	@return 

	@error 

} {
	if { [db_0or1row "isroot" "select package_id from fs_root_folders where folder_id=:folder_id"] } {
		return $package_id
	} else  {
		return ""
	}
}

ad_proc -private afs::get_root_folder {
	-folder_id:required
} {
	Check if the given folder is a root folder, if not then get the parent. Continue to get the parent until 
	the root folder is retrieved. Then return the package_id of the root folder.

	@author Hamilton Chua (ham@solutiongrove.com)	
	@creation-date 2006-02-24
	@return 

	@error 
} {
	set root_found 0
	while {$root_found == 0} {
		set root_package_id [afs::root_folder_p -folder_id $folder_id]
		if { $root_package_id != "" } {
			set root_found 1			
		} else {
			set folder_id  [db_string "getfolderparent" "select parent_id from cr_items where item_id=:folder_id"]
		}
	}
	return $root_package_id
}