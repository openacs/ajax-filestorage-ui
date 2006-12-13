<?xml version="1.0"?>

<queryset>
   <rdbms><type>postgresql</type><version>7.1</version></rdbms>
    <fullquery name="get_fs_instances">
        <querytext>
		select package_id, instance_name, 
			(select file_storage__get_root_folder(package_id)) as root_folder
		from apm_packages where package_key='file-storage' 
		and exists (select 1
			from acs_object_party_privilege_map m
			where m.object_id = fs_objects.object_id
			and m.party_id = :viewing_user_id
			and m.privilege = 'read')
		${exclude_sql}
		order by instance_name
        </querytext>
    </fullquery>

    <fullquery name="countcontent">
        <querytext>
		select count(*) from fs_objects 
		where parent_id = :root_folder and type='folder' 
		and exists (select 1
			from acs_object_party_privilege_map m
			where m.object_id = fs_objects.object_id
			and m.party_id = :viewing_user_id
			and m.privilege = 'read')
        </querytext>
    </fullquery>

</queryset>