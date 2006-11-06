<?xml version="1.0"?>

<queryset>
   <rdbms><type>postgresql</type><version>7.1</version></rdbms>
    <fullquery name="select_folder_contents">
        <querytext>

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
                   trim(fs_objects.title) as title,
                   case
                     when :folder_path is null
                     then fs_objects.file_upload_name
                     else :folder_path || '/' || fs_objects.file_upload_name
                   end as file_url,
                   case
                     when fs_objects.last_modified >= (now() - cast('$n_past_days days' as interval))
                     then 1
                     else 0
                   end as new_p,
		   case
                     when fs_objects.type = 'url'
                     then ( select acs_permission__permission_p(fs_objects.object_id, :viewing_user_id, 'write') from dual)
                     else 't'
                   end as write_p
            from fs_objects
            where fs_objects.parent_id = :folder_id and exists (select 1
				from acs_object_party_privilege_map m
				where m.object_id = fs_objects.object_id
				and m.party_id = :viewing_user_id
				and m.privilege = 'read')
		order by type
        </querytext>
    </fullquery>

    <fullquery name="get_folder_path">
        <querytext>

            select content_item__get_path(:folder_id, :root_folder_id);

        </querytext>
    </fullquery>

</queryset>
 
