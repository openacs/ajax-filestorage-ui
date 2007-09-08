ad_page_contract {

    Returns a JSON structure suitable for building the nodes of a tree
        for the ajax file storage ui.
    Requires the package_id


    @author Hamilton Chua (ham@solutiongrove.com)
    @creation-date 2007-06-03

} {
    package_id:integer,notnull
    {node ""}
}

# ns_log notice "ln called with package_id '$package_id' and node '$node'"

set viewing_user_id [ad_conn user_id]

if { ![exists_and_not_null node] } {
    # if node is empty, then get the rootfolder of the package_id
    set node [fs::get_root_folder -package_id $package_id]
}

db_multirow -extend { text id  href cls } "treenodes" "treenodes" { } {
    if { [exists_and_not_null title] } {
        set text $title
    } else {
        set text $name
    }
    set id "$object_id"
    set cls "folder"
}