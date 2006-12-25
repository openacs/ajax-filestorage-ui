<?xml version="1.0"?>

<queryset>
   <rdbms><type>postgresql</type><version>7.1</version></rdbms>
    <fullquery name="select_one_file_object">
        <querytext>

            select fs_objects.object_id,
                   fs_objects.mime_type,
                   trim(fs_objects.name) as name,
                   fs_objects.live_revision,
                   fs_objects.type,
                   fs_objects.pretty_type,
                   fs_objects.parent_id,
                   to_char(fs_objects.last_modified, 'YYYY-MM-DD HH24:MI:SS') as last_modified_ansi,
                   fs_objects.content_size,
                   fs_objects.url,
                   fs_objects.sort_key,
                   fs_objects.file_upload_name,
                   trim(fs_objects.title) as title,
                   case
                     when fs_objects.type = 'url'
                     then ( select acs_permission__permission_p(fs_objects.object_id, :viewing_user_id, 'write') from dual)
                     else 't'
                   end as write_p
            from fs_objects
            where fs_objects.object_id = $object_id

        </querytext>
    </fullquery>

</queryset>

