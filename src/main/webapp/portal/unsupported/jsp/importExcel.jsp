<%@page import="java.text.SimpleDateFormat"%>
<%@page import="java.util.Calendar"%>
<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%
	Calendar c = Calendar.getInstance();     
    c.add(Calendar.MONTH, 0);
	String currentMon = new SimpleDateFormat("yyyyMM").format(c.getTime());
%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>未支撑补贴审批导入</title>
<style type="text/css">
	.list_table tr td{
		border-bottom:1px solid #c0e2ef;
		padding: 0.5em 1em;
    	text-align: left;
	}
	.list_table tr td {
		border-left:1px solid #e7d4b3;
	}
	.list_table {
		border-right: 1px solid #e7d4b3;
		width: 525px;
		height: 225px;
	}

</style>
<link href="<%=request.getContextPath()%>/platform/theme/style/public.css" rel="stylesheet" type="text/css" />
<link rel="stylesheet" type="text/css" href="<%=request.getContextPath()%>/platform/theme/style/easyui.css">
<link href="<%=request.getContextPath()%>/js/artDialog4.1.7/skins/default.css" rel="stylesheet" type="text/css" />
<link href="<%=request.getContextPath()%>/js/My97DatePicker/skin/WdatePicker.css" rel="stylesheet" type="text/css" />
<link href="<%=request.getContextPath()%>/js/My97DatePicker/skin/WdatePicker.css" rel="stylesheet" type="text/css" />
<script type="text/javascript" src="<%=request.getContextPath()%>/js/jquery/jquery-1.8.0.min.js"></script>
<script type="text/javascript" type="text/javascript" src="<%=request.getContextPath()%>/platform/theme/js/jquery.easyui.min.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/js/artDialog4.1.7/artDialog.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/js/artDialog4.1.7/plugins/iframeTools.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/js/My97DatePicker/WdatePicker.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/portal/unsupported/js/importExcel.js"></script>
</head>
<body style="min-width:400px;">
<input type="hidden" id="ctx" value="<%=request.getContextPath()%>">
<div id="container" style="min-height: 210px;">
	<div style="width: 410px;">
		<form id="importForm" method="post" enctype="multipart/form-data">
			<table class="list_table">
				<tr>
					<td></td>
					<td>上传步骤：</td>
				</tr>
				<tr>
					<td></td>
					<td>(1)点击模板下载，下载对应的EXCEL模板文件。</td>
				</tr>
				<tr>
					<td></td>
					<td>(2)选择账期。</td>
				</tr>
				<tr>
					<td></td>
					<td>(3)点击浏览,并选择编辑好的EXCEL文件，提交既可。</td>
				</tr>
				<tr>
						<td style="width: 70px; text-align: right;">账期：</td>
						<td><input readonly="readonly" type="text" class="Wdate"
							id="deal_date" name="deal_date" value="<%=currentMon%>"
							onclick="WdatePicker({isShowClear:false,skin:'whyGreen',dateFmt:'yyyyMM',minDate:'%y-{%M-1}',maxDate:'%y-{%M}'})" />
						</td>
				</tr>
				<tr>
						<td style="width: 70px; text-align: right;">上传文件：</td>
						<td><input type="file" size='70' name="myFile" /></td>
				</tr>
				<tr>
					<td></td>
					<td><font style="color: red;">(注意：删除上传文件的一条记录时，必须整行删除，否则会上传失败)</font></td>
				</tr>
				<tr>
					<td></td>
					<td><font style="color: red;">(说明：上传的文件必需是下载的模板编辑后的EXCEL文件，并且文件大小不能超过5M)</font></td>
				</tr>
				<tr style="height: 35px">
					<td colspan="2">
						<a class="default-btn fLeft mr10" href="#" onclick="importExcel()" style="margin-left: 220px;">提交</a>
					</td>
				</tr>
			</table>
		</form>
	</div>
</div>
</body>
</html>