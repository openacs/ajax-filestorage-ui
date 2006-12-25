<if @found_obj@ >
        <br />
        <table border=0 cellpadding="5" width="100%">
            <tr>
                <td width="10%" valign="top" align="center">
                    <img src="@icon;noquote@" border=0>
                </td>
                <td width="30%">
                    <table border=0 cellpadding=0 cellspacing=8>
                        <tr>
                            <td valign="top" colspan="2">
                                <div id="properties_name" style="font-weight:bold">
                                <if @title@ nil>
                                    @name@
                                </if>
                                <else>
                                    @title@
                                </else>
                                </div>
                                <if @write_p@>
                                    <span id="editcontrol_@object_id@">
                                            [ <a href="javascript:void(0);" onClick="new editInPlace(@object_id@,'properties_name','editcontrol_@object_id@','@type@')">Rename</a> ]
                                    </span>
                                </if>
                            </td>
                        </tr>
                        <tr><td valign="top">Type :</td><td>@pretty_type;noquote@</td></tr>
                        <tr><td valign="top">Size :</td><td>@content_size_pretty;noquote@</td></tr>
                        <tr><td valign="top">Last Modified :</td><td>@last_modified_pretty;noquote@</td></tr>
                    </table>
                </td>
                <td width="60%">
                    <if @write_p@>
                    <b>Actions</b>
                    <if @type@ eq "folder">
                        <li><a href="@download_url;noquote@">Download an Archive of this folder</a>
                        <li><a href="javascript:void(0)">Upload a new File to this folder</a>
                        <li><a href="javascript:void(0)">Create a new folder here</a>
                        <li><a href="javascript:void(0)">Delete this folder</a>
                    </if>
                    <else>
                        <li><a href="javascript:void(0)">Download this file</a>
                        <li><a href="javascript:void(0)">Upload a New Version of this file</a>
                        <li><a href="javascript:void(0)">Delete this file</a>
                    </else>
                    </if>
                </td>
            </tr>
        </table>
</if>