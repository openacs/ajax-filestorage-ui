<?xml version="1.0"?>

<queryset>
   <rdbms><type>postgresql</type><version>7.1</version></rdbms>
    <fullquery name="select_folder_contents">
        <querytext>
            select fs_objects.object_id, fs_objects.name, fs_objects.title
            from fs_objects 
            where fs_objects.type='folder' 
	    and fs_objects.parent_id = :parentfolderid 
	    and exists (select 1
				from acs_object_party_privilege_map m
				where m.object_id = fs_objects.object_id
				and m.party_id = :viewing_user_id
				and m.privilege = 'read')
        </querytext>
    </fullquery>

    <fullquery name="countcontent">
        <querytext>
		select count(*) from fs_objects where parent_id = :object_id and type='folder'
        </querytext>
    </fullquery>

</queryset>
