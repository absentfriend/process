<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>

<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<meta name="renderer" content="webkit">
<meta http-equiv="X-UA-Compatible" content="IE=Edge,chrome=1" >
<title>绑定小区代理商人员</title>
<link href="<%=request.getContextPath()%>/platform/theme/style/public.css" rel="stylesheet" type="text/css" />
<link href="<%=request.getContextPath()%>/js/artDialog4.1.7/skins/default.css" rel="stylesheet" type="text/css" />
<link href="<%=request.getContextPath()%>/js/jquery-easyui-1.3.0/themes/gray/easyui.css" rel="stylesheet" type="text/css" />
<script type="text/javascript" src="<%=request.getContextPath()%>/js/jquery/jquery-1.8.0.min.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/js/jquery-easyui-1.3.0/jquery.easyui.min.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/js/artDialog4.1.7/artDialog.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/js/artDialog4.1.7/plugins/iframeTools.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/report/devIncome/js/lch-report.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/portal/channelManagement/js/chnl_person_update.js?v=2"></script>
</head>
<body style="min-width: 400px;">
    <input type="hidden" id="ctx" value="<%=request.getContextPath()%>"/>
<div id="container" style="min-height: 150px;">
	<div class="default-dt">
		<div class="sticky-wrap">
			<form id="bind" method="POST">
			    <input type="hidden" id="id" name="id"/>
				<table class="default-table sticky-enabled">
				<tr>
					<td>渠道编码:</td>
					<td><input type="text" required="true" class="easyui-validatebox" missingMessage="渠道编码不能为空" name="hq_chan_code" id="hq_chan_code" value=""/></td>
				    <td>渠道名称:</td>
				    <td><input type="text" readonly="true" required="true" class="easyui-validatebox" missingMessage="渠道名称不能为空" name="hq_chan_name" id="hq_chan_name" value=""/></td>
				</tr>
				<tr>
				    <td>渠道经理ID:</td>
					<td><input type="text" readonly="true" required="true" class="easyui-validatebox" missingMessage="渠道经理ID不能为空" name="userId" id="userId" value=""></td>
				    <td>渠道经理:</td>
					<td><input type="text" readonly="true" required="true" readonly="true" class="easyui-validatebox" missingMessage="渠道经理不能为空" name="name" id="name" value=""></td>
				</tr>
				<tr>
				    <td>账号:</td>
					<td><input type="text" readonly="true" required="true" class="easyui-validatebox" missingMessage="账号不能为空" name="accout" id="accout" value=""></td>
				    <td>电话:</td>
					<td><input type="text" readonly="true" required="true" readonly="true" class="easyui-validatebox" missingMessage="电话不能为空" name="phone" id="phone" value=""></td>
				</tr>
				<tr>
	                <td colspan="4" style="padding-left: 120px;text-algin:center;">
		                <a href="#" class="default-btn fLeft mr10" id="saveBtn">保存</a>
		                <a href="#" class="default-btn fLeft ml10" id="cancleBtn">取消</a>
	                </td>
				</tr>
			</table>
		</form>
		</div>
	</div>
</div>
</body>
</html>