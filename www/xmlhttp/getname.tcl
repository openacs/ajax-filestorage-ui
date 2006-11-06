ad_page_contract {

	Accepts the object_id and returns the name
	
	@author Hamilton Chua (ham@solutiongrove.com)
	@creation-date May 7, 2006
} {
	{object_id ""}
}

if { [exists_and_not_null object_id] } {

	db_1row "getname" "select trim(fs_objects.name) as name, trim(fs_objects.title) as title from fs_objects where object_id = :object_id"
	
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

}