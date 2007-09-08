ad_page_contract {
   Accepts key value pairs and reorganizes files accordingly
} {
    object_ids:integer,multiple
}

if { [exists_and_not_null object_ids] } {
  set order_n 1
  foreach x $object_ids {
    if { [db_0or1row "exists" "select item_id from fs_objects_extension where item_id=:x"] } {
	   db_dml "sort_portlet" "update fs_objects_extension set order_n=:order_n where item_id=:x"
    } else {
        db_dml "insert_sort_portlet" "insert into fs_objects_extension (item_id,order_n) values (:x,:order_n)"
    }
    incr order_n
  }
}

ns_return 200 "text/html" "ok"