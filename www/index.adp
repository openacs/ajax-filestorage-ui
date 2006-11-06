<master>
<property name="title">@page_title@</property>
<property name="header_stuff">

	<link rel="stylesheet" type="text/css" href="/resources/acs-templating/lists.css" media="all">
	<link rel="stylesheet" type="text/css" href="/resources/acs-templating/afs.css" media="all">
	<link rel="stylesheet" type="text/css" href="/resources/ajax-filestorage-ui/ajaxfs.css">

	<script type="text/javascript" src="/resources/ajax-filestorage-ui/ajaxfs.js"></script>

	@js_sources;noquote@

</property>

<if @admin_button_url@ not nil><a href="@admin_button_url;noquote@" style="padding:5px; color:#ffffff; background-color:#3a26b1; border:1px solid #cccccc; width:100px;">Classic View</a></if>

<div id="page">
	<div id="foldercontainer">
		<div class="subheader"><table border=0 cellpadding=0 cellspacing=0 width="100%"><tr><td>Folders</td><td align="right"><a href="javascript:tree.collapseAll();" style="font-size:10px;">Collapse All&nbsp;</a></td></tr></table></div>
		<div id="folders"><br /><br /><br /><div class="filemsg">No folders found.</div></div>
	</div>
	<div id="filecontainer">
		<div class="subheader"><table border=0 cellpadding=0 cellspacing=0 width="100%"><tr><td width="55%" align="center">File/Folder</td><td width="20%" align="center">Size</td><td width="25%" align="center">Last Modified</td></tr></table></div>
		<div id="files"><br /><br /><br /><div class="filemsg">Click on an item in the file tree to view its contents here.</div></div>
	</div>
</div>

<form><input type="hidden" id="lastfolder" name="lastfolder" value="" /></form>
<iframe id='talk' name='target_upload' src='' style='width:1px;height:1px;border:0;clear:both;'></iframe>

@js_script;noquote@