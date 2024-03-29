<%@page import="java.util.Calendar"%>
<%@page import="java.text.SimpleDateFormat"%>
<%@page import="java.util.Date"%>
<%@page import="org.apdplat.module.security.model.Org"%>
<%@page import="org.apdplat.module.security.service.UserHolder"%>
<%@page import="org.apdplat.module.security.model.User"%>
<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%
	User user = UserHolder.getCurrentLoginUser();
	Org org = user.getOrg();
	Calendar ca=Calendar.getInstance();
	ca.add(Calendar.MONTH, -1);
	String dealDate=new SimpleDateFormat("yyyyMM").format(ca.getTime());
%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<meta name="renderer" content="webkit">
<meta http-equiv="X-UA-Compatible" content="IE=Edge,chrome=1" >
<title>2I2C地推推广情况</title>
<link href="<%=request.getContextPath()%>/platform/theme/style/public.css" rel="stylesheet" type="text/css" />
<link href="<%=request.getContextPath()%>/report/devIncome/css/lch-report.css" rel="stylesheet" type="text/css" />
<link rel="stylesheet" type="text/css" href="<%=request.getContextPath()%>/css/jpagination.css" />
<link href="<%=request.getContextPath()%>/js/artDialog4.1.7/skins/default.css" rel="stylesheet" type="text/css" />
<link type="text/css" rel="stylesheet" href="<%=request.getContextPath()%>/page/js/date/skin/WdatePicker.css"> 
<script type="text/javascript" src="<%=request.getContextPath()%>/js/jquery/jquery-1.8.0.min.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/js/pagination/jpagination.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/page/js/date/WdatePicker.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/report/devIncome/js/lch-report.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/js/artDialog4.1.7/artDialog.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/js/artDialog4.1.7/plugins/iframeTools.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/report/reportNew/js/channel_network_caliber_dev.js?v=2"></script>
<style type="text/css">
  #lch_DataHead TR TH,#lch_DataBody TR TD{
   min-width: 10px;
}

</style>
</head>
<body class="" style="overflow-x:auto;">
	<input type="hidden" id="ctx" value="<%=request.getContextPath()%>">
	<input type="hidden" id="orgLevel" value="<%=org.getOrgLevel()%>">
	<input type="hidden" id="code" value="<%=org.getCode()%>">
	<input type="hidden" id="region" value="<%=org.getRegionCode()%>">
	<input type="hidden" id="hr_id" value="<%=user.getHrId()%>">
		<form id="searchForm" method="post" style="width:100%">
			<table style="width:100%;margin: 10px 0; border:none;">
				<tr height="35px">
				    <td width="3%" style="padding-left: 1px;" align="right">账期：</td>
                    <td width="8%">
                        <input type="text"  class="Wdate default-text-input wper80" 
                        onclick="WdatePicker({skin:'whyGreen',dateFmt:'yyyyMM'})" value="<%=dealDate %>" id="dealDate">
                    </td>
                    <td width="3%" style="text-align:right;">地市：</td>
                    <td width="8%">
                        <select name="regionCode" id="regionCode" class="default-text-input wper100">
                                <option value=''>请选择</option>
                        </select>
                    </td>
                    <td width="3%" align="right">增存量：</td>
                    <td width="8%">
                        <select name="isAll" id="isAll" class="default-text-input wper80">
                                <option selected="selected" value='1'>全部</option>
                                <option value='2'>增量</option>
                                <option value='3'>存量</option>
                        </select>
                    </td>
                    <!-- <td width="5%">
                        <a class="default-gree-btn" href="#" style="float: right;" id="exportDesc" onclick="showDesc();">说明</a>
                    </td> -->
                    <td width="5%">
                        <a class="default-btn" href="#" id="searchBtn"
                        style="float: right; margin-left: 10px; margin-right: 10px;">查询</a>
                    </td>
                    <td width="5%">
                        <a class="default-gree-btn" href="#" id="exportBtn" onclick="downsAll()">导出</a>
                    </td>
				</tr>
				
			</table>
		</form>
		
		<div id="lchcontent"></div>
		
</body>
</html>