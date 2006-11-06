ad_page_contract {

    Copy a file to a folder. This page is called via XMLHTTP.
	The xmlhttp call should pass the id of the dropped element
	this dropped element should have the file_id to be copied and
	the folder_id where the file will be copied to .

    @author Hamilton Chua (ham@solutiongrove.com)
    
} {
	file_element
	folder_id:integer
}

# ns_log Notice "HAM: Folder - $folder_id : File to Copy - $file_element "

# the file_element should be in the format
#   row_${object_id},
# use string range
set fs_object_id [string range $file_element 4 [string length $file_element]]
set viewing_user_id [ad_conn user_id]

# ns_log Notice "HAM: FS Object : $fs_object_id"

set error 0

# verify if the folder_id is an existing folder
if { ![fs::folder_p -object_id $folder_id] } {
	set message "Sorry, the object you are dropping the file into is not a folder. File Copy Failed."
	set error 1
} else {
	#it's a folder
	# verify if the file_id is 
	# - an fs object
	# - at least for now, not a folder**
	# ** will add folder copying later if file storage supports it
	if { ![fs::object_p -object_id $fs_object_id] } {
		set message "Sorry, this object is not a File Storage object that you can copy. File Copy Failed."
		set error 1
	} else {
		# at this point both folder_id and fs object id are valid
		# check now if user has permission to write to the folder
		if { [permission::permission_p -party_id $viewing_user_id -object_id $fs_object_id -privilege "write"] } {
			# the file can't be copied into it's current location so let's check for that		
			if { [db_0or1row "copy_to_current_folder" "select item_id from cr_items where item_id=:fs_object_id and parent_id=:folder_id"] } {
				set message "A copy of the file already exists in that folder. File Copy Failed."
				set error 1
			} else {
	
				set file_id $fs_object_id
				set parent_id $folder_id
				set ip_address [ad_conn peeraddr]
				set user_id [ad_conn user_id]
				set message "Success !! File has been copied."
				# ns_log "HAM : Before Transaction"
				# it all checks out, lets create a copy
				db_transaction {
			
					db_exec_plsql file_copy "select file_storage__copy_file(:file_id,:parent_id,:user_id,:ip_address);"
					
				
				} on_error {
				
					# set folder_name "[_ file-storage.folder]"
					# set folder_link "<a href=\"index?folder_id=$parent_id\">$folder_name</a>"
					# ad_return_complaint 1 "[_ file-storage.lt_The_folder_link_you_s]"
					set message "File copy failed. A copy of the file may already exist on that folder."
					set error 1
				}
				# ns_log Notice "HAM : $message"
			}
		} else {
			set message "You do not have permission to copy the file to this folder."
			set error 1
		}
	}
}

# DEDS: for export
set fs_package_id [lindex [fs::get_folder_package_and_root $folder_id] 0]
fs::export::export_one_instance -package_id $fs_package_id
