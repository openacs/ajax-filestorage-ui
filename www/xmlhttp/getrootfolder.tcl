ad_page_contract {

    Given the package_id, this page will return JSON with
        the details of the root folder

    @author Hamilton Chua (ham@solutiongrove.com)
    @creation-date 2007-06-03

} {
    package_id:integer,notnull
    root_folder_id:integer,optional
}

if { [exists_and_not_null root_folder_id] } {
    set rootfolder $root_folder_id
} else {
    set rootfolder [fs::get_root_folder -package_id $package_id]
}

set write_p [permission::permission_p -no_cache \
        -party_id [ad_conn user_id] \
        -object_id ${rootfolder} \
        -privilege "write"]

if { $write_p } { set write_p "t" } else { set write_p "f" }

db_0or1row "getfolderinfo" "select * from fs_objects where object_id = :rootfolder"