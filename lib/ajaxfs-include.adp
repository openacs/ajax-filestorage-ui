    <link rel="stylesheet" type="text/css" href="/resources/ajaxhelper/ext/resources/css/ext-all.css">
    <if @theme@ not nil>
        <link rel="stylesheet" type="text/css" href="/resources/ajaxhelper/ext/resources/css/ytheme-@theme@.css">
    </if>
    <link rel="stylesheet" type="text/css" href="/resources/ajax-filestorage-ui/ajaxfs.css">
    <script type="text/javascript" src="http://yui.yahooapis.com/2.3.0/build/utilities/utilities.js"></script> 
    <script type="text/javascript" src="/resources/ajaxhelper/ext/adapter/yui/ext-yui-adapter.js"></script>
    <script type="text/javascript" src="/resources/ajaxhelper/ext/ext-all.js"></script>
    <script type="text/javascript" src="/resources/ajax-filestorage-ui/swfupload/swfupload.js"></script>
    <if @debug@ eq 1>
        <script type="text/javascript" src="/resources/ajax-filestorage-ui/ajaxfs.js"></script>
    </if>
    <else>
        <if @compressjs@ eq 1>
            <script type="text/javascript" src="/resources/ajax-filestorage-ui/ajaxfs.js.gz"></script>
        </if>
        <else>
            <script type="text/javascript" src="/resources/ajax-filestorage-ui/ajaxfs-min.js"></script>
        </else>
    </else>
    <if @options@ defined>
    <script type="text/javascript">
    // enable or disable create_url
    var create_url_p = @create_url_p@;
    // acs-lang
    var acs_lang_text = {
            newfolder:"#file-storage.Create_a_new_folder#",
            uploadfile:"#file-storage.Add_File#",
            createurl:"#file-storage.Create_a_URL#",
            deletefs:"#file-storage.Delete#",
            filename:"#ajax-filestorage-ui.File#",
            size:"#file-storage.Size#",
            lastmodified:"#file-storage.Last_Modified#",
            rename:"#file-storage.Rename#",
            permissions:"#file-storage.Permissions#",
            linkaddress:"#ajax-filestorage-ui.CopyLink#",
            upload: "#file-storage.Upload#",
            cancel: "#ajax-filestorage-ui.Cancel#",
            close: "#ajax-filestorage-ui.Close#",
            browse: "#ajax-filestorage-ui.Browse#",
            properties: "#ajax-filestorage-ui.Properties#",
            for_upload_to: "#ajax-filestorage-ui.for_upload_to#",
            zip_extracted: "#ajax-filestorage-ui.Zip_file#",
            uploading : "#ajax-filestorage-ui.Uploading#",
            complete : "#ajax-filestorage-ui.Complete#",
            alert : "#ajax-filestorage-ui.Alert#",
            uploadcancel : "#ajax-filestorage-ui.Cancelled#",
            sessionexpired : "#ajax-filestorage-ui.SessionExpired#",
            copyhighlighted : "#ajax-filestorage-ui.CopyHighlight#",
            limitto100 : "#ajax-filestorage-ui.Limit100#",
            error : "#ajax-filestorage-ui.Error#",
            an_error_occured : "#ajax-filestorage-ui.ErrorOccured#",
            reverted : "#ajax-filestorage-ui.ChangesReverted#",
            error_and_reverted: "#ajax-filestorage-ui.ErrorRevert#",
            enter_new_name: "#file-storage.lt_Please_enter_the_new_#",
            upload_failed: "#ajax-filestorage-ui.UploadFailed#",
            loading: "#ajax-filestorage-ui.OneMomentUploading#",
            file_required: "#ajax-filestorage-ui.TitleAndFileRequired#",
            createurl_failed: "#ajax-filestorage-ui.CreateUrlFailed#",
            invalid_url: "#ajax-filestorage-ui.InvalidUrl#",
            ok: "#ajax-filestorage-ui.Ok#",
            error_move : "#ajax-filestorage-ui.ErrorMove#",
            duplicate_name : "#ajax-filestorage-ui.DuplicateName#",
            duplicate_name_error : "#ajax-filestorage-ui.EnterDifferentName#",
            permission_denied : "#ajax-filestorage-ui.PermissionDenied#",
            permission_denied_error : "#ajax-filestorage-ui.NoPermissionToRename#",
            folder_name_required : "#ajax-filestorage-ui.FolderNameRequired#",
            tree_render_error : "#ajax-filestorage-ui.ErrorRenderTreePanel#",
            file_list : "#ajax-filestorage-ui.File List#",
            new_folder_error : "#ajax-filestorage-ui.CreateFolderError#",
            new_folder_label : "#file-storage.New_Folder#",
            delete_error : "#ajax-filestorage-ui.DeleteItemError#",
            confirm: "#ajax-filestorage-ui.Confirm#",
            confirm_delete : "#ajax-filestorage-ui.ConfirmDelete#",
            cant_del_root: "#ajax-filestorage-ui.CanNotDeleteRoot#",
            foldercontains: "#ajax-filestorage-ui.FolderContains#",
            upload_intro: "#ajax-filestorage-ui.UploadFileIntro#",
            file_to_upload: "#ajax-filestorage-ui.FileToUpload#",
            file_title: "#ajax-filestorage-ui.Title#",
            file_description: "#ajax-filestorage-ui.Description#",
            multiple_files: "#ajax-filestorage-ui.MultipleFiles#",
            multiple_files_msg: "#ajax-filestorage-ui.ThisIsAZip#",
            download_archive: "#ajax-filestorage-ui.DownloadArchive#"
    }
    Ext.onReady(function() { 
        Ext.get("fscontainer").setHeight(400,false);
        Ext.get("fscontainer").update(" ");
    });
    var fsInstance = new ajaxfs({@options;noquote@});
    </script>
    </if>

<div id="leftpanel"></div>