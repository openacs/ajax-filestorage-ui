<if @contents:rowcount@ eq 0>
	<br><br><br><div class="statusmsg">This folder is empty.</div>
</if>
<else>
<br>
<multiple name="contents">
<div id="row_@contents.object_id@" class="onerow" onmouseover="this.style.backgroundColor='#EAF2FF';" onmouseout="this.style.backgroundColor='#FFFFFF';">
<table border=0 cellpadding=5 cellspacing=0 class="list" width="100%">
<tr class="list-row" id="row_@contents.object_id@">
	<td><div id="icon_@contents.object_id@" class="icon"><a href="@contents.file_url;noquote@" <if @contents.type@ ne "folder">target="blank"</if>><img src="@contents.icon@" border=0 /></a></if></div></td>
	<td width="40%">
		<div id="filename_@contents.object_id@">
		<a href="@contents.file_url@" <if @contents.type@ ne "folder">target="blank"</if> title="<if @contents.title@ nil>@contents.name@</if><else>@contents.title@</else>">
		<if @contents.title@ nil>
			@contents.shortened_name@</a>
		</if>
		<else>
			@contents.shortened_title@</a><br/>
			<if @contents.name@ ne @contents.title@>
			<span style="color: \#999;">@contents.file_upload_name@</span>
			</if>
		</else>
		</div>
	</td>
	<td align="center" width="20%">@contents.content_size_pretty@</td>
    <td align="center" width="20%">@contents.pretty_type@</td>
	<td align="center" width="20%">@contents.last_modified_pretty@</td>
</tr>
</table>
</div>
</multiple>

<script type="text/javascript">
<multiple name="contents">
<if @contents.type@ eq "folder">
new fsItem(@contents.object_id@,'folder');
</if>
<else>
new fsItem(@contents.object_id@,'file');
</else>
</multiple>
</script>

</else>