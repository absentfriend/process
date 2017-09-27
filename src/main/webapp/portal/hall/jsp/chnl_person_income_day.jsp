<%@page import="java.text.SimpleDateFormat"%>
<%@page import="java.util.Calendar"%>
<%@page import="org.apdplat.module.security.model.Org"%>
<%@page import="org.apdplat.module.security.service.UserHolder"%>
<%@page import="org.apdplat.module.security.model.User"%>
<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%
	User user = UserHolder.getCurrentLoginUser();
	Org org = user.getOrg();
	Calendar ca=Calendar.getInstance();
	ca.add(Calendar.DATE, -1);
	String dealDate=new SimpleDateFormat("yyyyMMdd").format(ca.getTime());
%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<meta name="renderer" content="webkit">
<meta http-equiv="X-UA-Compatible" content="IE=Edge,chrome=1" >
<title>用户收入日报</title>
<link href="<%=request.getContextPath()%>/platform/theme/style/public.css" rel="stylesheet" type="text/css" />
<link href="<%=request.getContextPath()%>/report/devIncome/css/lch-report.css" rel="stylesheet" type="text/css" />
<link type="text/css" rel="stylesheet" href="<%=request.getContextPath()%>/page/js/date/skin/WdatePicker.css"> 
<script type="text/javascript" src="<%=request.getContextPath()%>/js/jquery/jquery-1.8.0.min.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/report/devIncome/js/lch-report.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/page/js/date/WdatePicker.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/portal/hall/js/chnl_person_income_day.js?v=5"></script>
</head>
<body style="overflow-x:auto;">
	<input type="hidden" id="ctx" value="<%=request.getContextPath()%>">
	<input type="hidden" id="orgLevel" value="<%=org.getOrgLevel()%>">
	<input type="hidden" id="code" value="<%=org.getCode()%>">
	<input type="hidden" id="region" value="<%=org.getRegionCode()%>">
	<form id="searchForm" method="post">
			<input type="hidden" name="resultMap.page" /> <input type="hidden" name="resultMap.rows" />
			<table width="100%" style="margin: 10px 0; border:none;">
				<tr height="35px">
					<td width="5%" align="right">账期：</td>
					<td width="10%">
						<input type="text"  class="Wdate default-text-input wper80" readonly="readonly"
						onclick="WdatePicker({skin:'whyGreen',dateFmt:'yyyyMMdd',isShowClear:false})" value="<%=dealDate%>" id="dealDate">
					</td>
					<td width="5%" align="right">地市：</td>
					<td width="10%">
						<select name="regionCode" id="regionCode" class="default-text-input wper80">
								<option value=''>请选择</option>
						</select>
					</td>
					<td width="5%" align="right">营服：</td>
					<td width="10%">
						<select name="unitCode" id="unitCode" class="default-text-input wper80">
								<option value=''>请选择</option>
						</select>
					</td>
					<td width="5%">
						<a class="default-btn" href="#" id="searchBtn"
						style="float: right; margin-right: 28px;">查询</a>
					</td>
					<td width="5%">
						<a class="default-gree-btn" href="#" id="exportBtn" onclick="downsAll()">导出</a>
					</td>
				</tr>
				<tr>
				    <td width="5%" align="right">姓名：</td>
					<td width="10%">
						<input name="name" id="name" class="default-text-input wper80">
					</td>
					<td width="5%" align="right">渠道名称：</td>
					<td width="10%">
						<input name="hq_chan_name" id="hq_chan_name" class="default-text-input wper80">
					</td>
					<td width="5%" align="right">营服属性：</td>
					<td width="10%">
						<select name="unitType" id="unitType" class="default-text-input wper80">
								<option value=''>全部</option>
								<option value='本部'>本部</option>
								<option value='集团'>集团</option>
								<option value='客服'>客服</option>
								<option value='其他'>其他</option>
								<option value='营业'>营业</option>
						</select>
					</td>
					<td width="5%" align="right">渠道状态：</td>
					<td width="10%">
						<input name="state" id="state" class="default-text-input wper80">
					</td>
				</tr>
			</table>
	</form>
	<div id="content">
	</div>
</html>