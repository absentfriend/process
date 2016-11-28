<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
    <%@page import="org.apdplat.module.security.model.Org"%>
<%@page import="org.apdplat.module.security.service.UserHolder"%>
<%@page import="org.apdplat.module.security.model.User"%>

<%
	User user = UserHolder.getCurrentLoginUser();
	Org org = user.getOrg();
%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<meta name="renderer" content="webkit">
<meta http-equiv="X-UA-Compatible" content="IE=Edge,chrome=1" >
<link href="<%=request.getContextPath()%>/js/artDialog4.1.7/skins/default.css" rel="stylesheet" type="text/css" />
<link href="<%=request.getContextPath()%>/platform/theme/style/public.css" rel="stylesheet" type="text/css" />
<link href="<%=request.getContextPath()%>/js/jquery-easyui-1.3.0/themes/gray/easyui.css" rel="stylesheet" type="text/css" />
<script type="text/javascript" src="<%=request.getContextPath()%>/js/jquery/jquery-1.8.0.min.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/js/artDialog4.1.7/artDialog.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/js/artDialog4.1.7/plugins/iframeTools.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/js/jquery-easyui-1.3.0/jquery.easyui.min.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/report/devIncome/js/lch-report.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/portal/channelManagement/js/channel_resource_details.js"></script>
<title>渠道明细</title>
<style type="text/css">
	table {
		margin-top: 10px;
		margin-bottom: 20px;
	}
	table tr th{
		width: 120px;
		padding: 8px 10px;
		text-align: right;
	}
	table tr td {
		width: 250px;
	}
</style>
</head>
<body>
	<input type="hidden" id="ctx" value="<%=request.getContextPath()%>">
	<input type="hidden" id="group_id_4" name="group_id_4" value="${group_id_4}">
	<input type="hidden" id="chnl_id" name="chnl_id" value="${chnl_id}">
	<input type="hidden" id="orgLevel" value="<%=org.getOrgLevel()%>">
	<input type="hidden" id="code" value="<%=org.getCode()%>">
	<div id="smartForm">
    	<div id="container">
            <div id="content">
                <div id="main" class="clearfix">
                    <div class="main-block">
                        <div class="title" style="border-bottom: 2px solid #e7d4b3;"><i></i><span>渠道基础信息</span></div>
                        <table class="chanlInfoForom">
                            <tr>
                                <th>渠道编码:</th>
                                <td id="hq_chan_code"></td>
                                <th>渠道名称:</th>
                                <td id="group_id_4_name"></td>
                            </tr>
                            <tr>
                                <th>地市名称:</th>
                                <td id="group_id_1_name"></td>
                                <th>营服中心:</th>
                                <td id="unit_name"></td>
                            </tr>
                            <tr>
                                <th>渠道属性1:</th>
                                <td id="chn_cde_1_name"></td>
                                <th>渠道属性2:</th>
                                <td id="chn_cde_2_name"></td>
                            </tr>
                            <tr>
                                <th>渠道属性3:</th>
                                <td id="chn_cde_3_name"></td>
                                <th>渠道属性4:</th>
                                <td id="chn_cde_4_name"></td>
                            </tr>
                             <tr colspan="4">
                                <th>渠道类型:</th>
                                <td>
                                  <select id="chnl_type" name="chnl_type">
                                   
                                  </select>
                                </td>
                                <td colspan="2">
                                  <a class="default-btn fLeft mr10" href="#" id="addBtn">更多</a>
                                  <a class="default-btn fLeft mr10" href="#" id="updateBtn">保存</a>
                                </td>
                             </tr>
                             
                        </table>
                        <div class="title" style="border-bottom: 2px solid #e7d4b3;"><i></i>渠道联系方式</div>
                        <table class="chanlInfoForom">
                            <tr>
                                <th>联系人姓名:</th>
                                <td id="contact_name"></td>
                                <th>联系人电话:</th>
                                <td id="contact_phone"></td>
                                <th>联系人办公室电话:</th>
                                <td id="con_office_phone"></td>
                            </tr>
                            <tr>
                                <th>经度:</th>
                                <td id="log_no"></td>
                                <th>纬度:</th>
                                <td id="lat_no"></td>
                                <th>地图:</th>
                                <td ><a href="#" onClick="showMap()">显示</a></td>
                            </tr>
                            <tr>
                            	<th>渠道地址:</th>
                                <td colspan="5" id="chnl_addr"></td>
                            </tr>
                        </table>
                        <div class="title" style="border-bottom: 2px solid #e7d4b3;"><i></i>其他管理信息</div>
                        <table class="chanlInfoForom">
                            <tr>
                                <th>渠道经理姓名:</th>
                                <td id="name"></td>
                                <th>渠道经理帐号:</th>
                                <td id="account"></td>
                                <th>渠道经理电话:</th>
                                <td id="phone"></td>
                            </tr>
                            <tr>
                                <th>渠道状态:</th>
                                <td id="status"></td>
                                <th>是否迷你厅:</th>
                                <td id="is_mini_hall"></td>
                                <th>创建时间:</th>
                                <td id="create_time"></td>
                            </tr>
                            <tr>
                                <th>销售面积:</th>
                                <td id="hall_area_size"></td>
                                <th>是否连锁渠道:</th>
                                <td id="chain_flag"></td>
                                <th>业务受理面积:</th>
                                <td id="bus_area_size"></td>
                            </tr>
                        </table>
                        <div class="title" style="border-bottom: 2px solid #e7d4b3;"><i></i>门店照片</div>
                        <table class="chanlInfoForom">
                        	<tr>
                        		<td height="50">
                        			<img id="imgfornt" title="点击查看大图" alt="店前照片" src="" height="180" width="150">
                        		</td>
                        		<td>
                        			<img id="imgmiddle" title="点击查看大图" alt="店中照片" src="" height="180" width="150">
                        		</td>
                        		<td>
                        			<img id="imglater" title="点击查看大图" alt="店后照片" src="" height="180" width="150">
                        		</td>
                        	</tr>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="sticky-wrap" id="addFormDiv" style="display:none;">
		<form id="addForm" method="POST">
			<table class="default-table sticky-enabled">
				<tr>
					<td style="padding-left: 60px;">类型名称:</td>
					<td><input type="text" required="true" class="easyui-validatebox" missingMessage="类型名称不能为空" name="type_name" id="type_name"></td>
				</tr>
				<tr></tr>
				<tr>
	                <td colspan="2" style="padding-left: 120px;">
		                <a href="#" class="default-btn fLeft mr10" id="saveBtn">保存</a>
		                <a href="#" class="default-btn fLeft ml10" id="cancleBtn" onclick="cancel();">取消</a>
	                </td>
				</tr>
			</table>
		</form>
    </div>		
</body>
<style>
	.aui_w,.aui_e{
		width:0px;
	}
	.aui_c{
		width:530px;
	}
</style>
</html>