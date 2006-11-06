<a href="@file_url@"  <if @type@ ne "folder">target="blank"</if> title="@title@">
<if @title@ nil>
	@shortened_name@</a>
</if>
<else>
	@shortened_title@</a><br/>
	<if @name@ ne @title@>
	<span style="color: #999;">@file_upload_name@</span>
	</if>
</else>