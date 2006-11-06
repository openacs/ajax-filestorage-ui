<if @contents:rowcount@ eq 0>
	<br><br><br><div class="filemsg">This folder is empty.</div>
</if>
<else>
<br>
<multiple name="contents">
<div id="row_@contents.object_id@" class="onerow" onmouseover="this.style.backgroundColor='#EAF2FF';" onmouseout="this.style.backgroundColor='#FFFFFF';">
<table border=0 cellpadding=2 cellspacing=0 class="list">
<tr class="list-row">
	<td><div id="icon_@contents.object_id@" class="icon"><a href="@contents.file_url;noquote@" <if @contents.type@ ne "folder">target="blank"</if>><img src="@contents.icon@" border=0 /></a></if></div></td>
	<td width="50%">		
		<div id="name_of_file_@contents.object_id@">
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
		<div id="editcontrol_@contents.object_id@"><if @admin_p@ and @contents.type@ ne "folder">[ <a href="javascript:void(0);" onClick="editInPlace('name_of_file_@contents.object_id@','editcontrol_@contents.object_id@','@contents.object_id@');">Rename</a> ]</if></div>
	</td>
	<td align="center" width="25%">@contents.content_size_pretty@</td>
	<td align="center" width="25%">@contents.last_modified_pretty@</td>
</tr>
</table>
</div>
</multiple>
</else>