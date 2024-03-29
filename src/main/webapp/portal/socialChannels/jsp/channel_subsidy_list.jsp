<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@page import="java.text.SimpleDateFormat"%>
<%@page import="java.util.*"%>
<%@page import="org.apdplat.module.security.model.User"%>
<%@page import="org.apdplat.module.security.service.UserHolder"%>
<%@page import="org.apdplat.module.security.model.Org"%>
<%
Calendar ca=Calendar.getInstance();
String nowMonth=new SimpleDateFormat("yyyyMMdd").format(ca.getTime());

ca.add(Calendar.MONTH,-1);
String month=new SimpleDateFormat("yyyyMM").format(ca.getTime());

User user = UserHolder.getCurrentLoginUser();
Org org = user.getOrg();
String userName=user.getRealName()+"["+user.getUsername()+"]";
%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
	<title>预支录入</title>
	<link href="<%=request.getContextPath()%>/platform/theme/style/public.css" rel="stylesheet" type="text/css" />
	<link href="<%=request.getContextPath()%>/js/artDialog4.1.7/skins/default.css" rel="stylesheet" type="text/css" />
	<link href="<%=request.getContextPath()%>/js/jquery-easyui-1.3.0/themes/gray/easyui.css" rel="stylesheet" type="text/css" />
	<link href="<%=request.getContextPath()%>/platform/theme/style/jquery-ui.css" rel="stylesheet" type="text/css" />
	<link href="<%=request.getContextPath()%>/js/My97DatePicker/skin/WdatePicker.css" rel="stylesheet" type="text/css" />
	<link rel="stylesheet" type="text/css" href="<%=request.getContextPath()%>/css/jpagination.css">
	<script type="text/javascript" src="<%=request.getContextPath()%>/js/jquery/jquery-1.8.0.min.js"></script>
	<script type="text/javascript" src="<%=request.getContextPath()%>/platform/theme/js/jquery-ui.js"></script>
	<script type="text/javascript" src="<%=request.getContextPath()%>/js/artDialog4.1.7/artDialog.js"></script>
	<script type="text/javascript" src="<%=request.getContextPath()%>/js/artDialog4.1.7/plugins/iframeTools.js"></script>
	<script type="text/javascript" src="<%=request.getContextPath()%>/js/jquery-easyui-1.3.0/jquery.easyui.min.js"></script>
	<script type="text/javascript" src="<%=request.getContextPath()%>/js/pagination/jpagination.js"></script>
	<script type="text/javascript" src="<%=request.getContextPath()%>/wgreport/bireport/js/analize/common.jquery.js"></script>
	<script type="text/javascript" src="<%=request.getContextPath()%>/wgreport/bireport/js/analize/extend.jquery.js"></script>
	<script type="text/javascript" src="<%=request.getContextPath()%>/wgreport/bireport/js/analize/plus.js"></script>
	<script type="text/javascript" src="<%=request.getContextPath()%>/js/My97DatePicker/WdatePicker.js"></script>
	<script type="text/javascript" src="<%=request.getContextPath()%>/wgreport/bireport/js/analize/helper.js"></script>
	<script type="text/javascript" src="<%=request.getContextPath()%>/report/devIncome/js/lch-report.js"></script>
	<script type="text/javascript" src="<%=request.getContextPath()%>/portal/socialChannels/js/channel_subsidy_list.js?v=1"></script>

</head>
<body class="easyui-layout">
	<input type="hidden" id="ctx" value="<%=request.getContextPath()%>"/>
	<div data-options="region:'center',title:'预支录入列表'">
		<div id="container">
			<form id="searchForm" method="post">
				<input type="hidden" name="params.page" />
	            <input type="hidden" name="params.rows" />
	            <input type="hidden" id="orgLevel" value="<%=org.getOrgLevel()%>">
				<input type="hidden" id="code" value="<%=org.getRegionCode()%>">
				<input type="hidden" id="updateMan" value="<%=userName%>">
				<input type="hidden" id="nowMonth" value="<%=nowMonth%>">
	          	<table width="100%" style="margin:10px 0px;">
	                <tr height="35px">
	                	<td style="width: 80px;padding-left:10px;">帐期：</td>
						<td style="width: 250px;"><input readonly="readonly"
							type="text" style="width: 80px" class="Wdate" id="dealDate"
							name="dealDate" value="<%=month%>"
							onchange="changeDealDate();"
							onclick="WdatePicker({skin:'whyGreen',dateFmt:'yyyyMM'})" />
						</td>
						<td style="width: 80px;">地市：</td>
						<td style="width: 250px;">
							<select name="regionCode" id="regionCode" onchange="" class="default-text-input wper90">
									<option value=''>请选择</option>
							</select>
						</td>
	                    <td style="width: 80px;padding-left:10px;">渠道编码：</td>
	                    <td style="width: 250px;"><input class="default-text-input wper80" id="hqChanCode" name="hqChanCode" type="text" /></td>
						<td style="width: 80px;padding-left:10px;">渠道名称：</td>
						<td style="width: 250px;"><input class="default-text-input wper80" id="hqChanName" name="hqChanName" type="text" /></td>
					</tr>
					<tr>
	                    <td style="padding-left:10px;width:40px;">补贴科目：</td>
	                    <td><input class="default-text-input wper80" id="subItemName" name="subItemName" type="text" /></td>
						<td>是否抵扣：</td>
	                    <td>
	                    	<select id="isUsed" class="default-text-input wper80" name="isUsed">
	                    		<option value="">全部</option>
	                    		<option value="1">是</option>
	                    		<option value="0">否</option>
	                    	</select>
	                    </td>
						
						<td colspan="4">
                         	<a class="default-btn fLeft mr10" href="#" id="searchBtn">查询</a>
                         	<a class="default-gree-btn fLeft mr10" href="#" id="downloadExcel">导出</a>
                        </td>
					</tr>
	            </table>
	        </form>
			<div class="default-dt dt-autoH">
				<div class="sticky-wrap">
					<table id="dataTale" class="default-table sticky-enabled">
						<thead>
							<tr>
								<th class="first">地市</th>
								<th>渠道编码</th>
								<th>渠道名称</th>
								<th>工单编号</th>
								<th>考核期数</th>
								<th>期数修改人</th>
								<th>期数修改时间</th>
								<th><input type="checkbox" id="checkAll" style='display:none;'/>是否抵扣</th>
								
								<th>补贴科目</th>
								<th>总金额(元)</th>
								<th>已抵扣金额(元)</th>
								<th>未抵扣金额(元)</th>
								<th>拟稿人</th>
								<th>拟稿时间</th>
								<th>结束时间</th>
							</tr>
						</thead>
						<tbody id="dataBody">
						</tbody>
						<tr>
							<td colspan="15">
									<div class="page_count">
										<div class="page_count_left">
											共有 <span id="totalCount"></span> 条数据
										</div>
		
										<div class="page_count_right">
											<div id="pagination"></div>
										</div>
									</div>
							</td>
						</tr>
					</table>
				</div>
			</div>
		</div>
	</div>
</body>
</html>