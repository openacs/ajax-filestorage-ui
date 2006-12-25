@doc_type;noquote@
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<title>@page_title@</title>
<script type="text/javascript" src="/resources/ajaxhelper/yui/utilities/utilities.js"></script>
<script type="text/javascript" src="/resources/ajaxhelper/yui/treeview/treeview.js"></script>
<script type="text/javascript" src="/resources/ajaxhelper/yui-ext/yui-ext.js"></script>
<link rel="stylesheet" type="text/css" href="/resources/ajax-filestorage-ui/tree.css" />
<link rel="stylesheet" type="text/css" href="/resources/ajaxhelper/yui-ext/resources/css/reset-min.css">
<link rel="stylesheet" type="text/css" href="/resources/ajaxhelper/yui-ext/resources/css/tabs.css">
<link rel="stylesheet" type="text/css" href="/resources/ajaxhelper/yui-ext/resources/css/layout.css">
<link rel="stylesheet" type="text/css" href="/resources/ajax-filestorage-ui/ajaxfs.css">
<script type="text/javascript" src="/resources/ajax-filestorage-ui/ajaxfs.js"></script>

</head>
<body class="ytheme-gray">

<div id ="container">
  <div id="header" class="ylayout-inactive-content">
    <h2>@page_title@</h2>
  </div>
  <div id="folders" class="ylayout-inactive-content"><br /><br /><br /><div class="filemsg">No folders found.</div></div>
  <div id="content" class="ylayout-inactive-content"></div>
    <div id="properties" class="ylayout-inactive-content">
        <br /><div class="statusmsg">Click a file to get more information</div>
    </div>
    <div id="revisions" class="ylayout-inactive-content">
        <br /><div class="statusmsg">This item does not have any revisions</div>
    </div>
    <div id="filepane" class="ylayout-inactive-content">
            <div id="fileheader" class="ylayout-panel-hd">
                <table border=0 cellpadding=2 cellspacing=0 width="100%">
                <tr>
                    <td align="center" width="40%"><a href="javascript:void(0)" onclick="showFolderContents(document.getElementById('lastfolder').value,tree,'name')">Filename</a></td>
                    <td align="center" width="20%"><a href="javascript:void(0)" onclick="showFolderContents(document.getElementById('lastfolder').value,tree,'content_size')">Size</a></td>
                    <td align="center" width="20%"><a href="javascript:void(0)" onclick="showFolderContents(document.getElementById('lastfolder').value,tree,'type')">Type</a></td>
                    <td align="center" width="20%"><a href="javascript:void(0)" onclick="showFolderContents(document.getElementById('lastfolder').value,tree,'last_modified_ansi')">Last Modified</a></td>
                </tr>
                </table>
            </div>
            <div id="files"><br /><div class="statusmsg">Click on an item in the file tree to view its contents here.</div></div>
    </div>
</div>

<form><input type="hidden" id="lastfolder" name="lastfolder" value="" /></form>
@js_script;noquote@
</body>
</html>