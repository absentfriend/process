<%@page import="org.apdplat.module.security.model.Org"%>
<%@page import="org.apdplat.module.security.service.UserHolder"%>
<%@page import="org.apdplat.module.security.model.User"%>
<%@page import="java.text.SimpleDateFormat"%>
<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@ taglib uri="/struts-tags" prefix="s"%>
<%
	String path = request.getContextPath();
	Calendar c = Calendar.getInstance();     
	c.add(Calendar.MONTH, -1);
	String currentday = new SimpleDateFormat("yyyyMM").format(c.getTime());
	User user = UserHolder.getCurrentLoginUser();
	Org org = user.getOrg();
	String orgLevel = org.getOrgLevel();
	String orgCode = org.getCode();
%>
<html>
  <head>
    <title>积分汇总</title>
<script type="text/javascript">
	var group_id = "<%=orgCode%>";
	var group_level = "<%=orgLevel%>";
	var deal_date = "<%=currentday%>";
</script>

<link href="<%=path%>/wgreport/bireport/nresources/default/css/reset.css" rel="stylesheet" type="text/css" />
<link href="<%=path%>/wgreport/bireport/nresources/default/css/common.css" rel="stylesheet" type="text/css" />
<link href="<%=path%>/wgreport/bireport/nresources/default/css/provincial.css" rel="stylesheet" type="text/css" />

<link href="<%=path %>/wgreport/bireport/css/pub-ana.css" rel="stylesheet" type="text/css" />
<link href="<%=path %>/wgreport/bireport/css/plus.css" rel="stylesheet" type="text/css" />
<link href="<%=path %>/wgreport/bireport/css/ana/modal-1.css" rel="stylesheet" type="text/css" />
<link href="<%=path %>/wgreport/bireport/css/ana/img.css" rel="stylesheet" type="text/css" />
<link href="<%=path %>/js/My97DatePicker/skin/WdatePicker.css" rel="stylesheet" type="text/css" />

<script type="text/javascript" src="<%=path %>/js/jquery/jquery-1.8.0.min.js"></script>
<script type="text/javascript" src="<%=path%>/wgreport/bireport/js/main.js"></script>
<script type="text/javascript" src="<%=path%>/js/My97DatePicker/WdatePicker.js"></script>
<script type="text/javascript" src="<%=path %>/wgreport/bireport/js/analize/common.jquery.js"></script>
<script type="text/javascript" src="<%=path %>/wgreport/bireport/js/analize/extend.jquery.js"></script>
<script type="text/javascript" src="<%=path %>/wgreport/bireport/js/analize/plus.js"></script>
<script type="text/javascript" src="<%=path %>/wgreport/bireport/js/analize/helper.js"></script>

<script type="text/javascript" src="<%=path %>/wgreport/page/javascript/jlkh/tb_jcdy_jf_all_mon.js"></script>

<style type="text/css">
	.attend_th {white-space:nowrap;}
</style>
</head>
  
<body>
	<input type="hidden" id="ctx" value="<%=request.getContextPath()%>">
	<div class="work-div" style="margin-top: 0px;margin-left: 5px;" id="workdiv">
		<div class="search-div" style="width: 100%;" id="contions"> 
			<table>
				<tr>
					<td align="right">帐期</td>
					<td>
						<input type="text" style="width:100px" class="Wdate" id="deal_date" readonly="readonly" value="<%=currentday %>"  onclick="WdatePicker({isShowClear:false,skin:'whyGreen',dateFmt:'yyyyMM'})"/>
					</td>
					<td align="right">地市名称</td>
					<td>
						<div class="mutiSelect" style="width: 150px; font-size: 12px;">
							<div class="ct" style="height: 16px; width: 150px">
								<span class="tmp">全部</span>
							</div>
							<ul class="theOptions" style="width: 150px" id="boxselect">
								<!-- JS后台加载 -->
							</ul>
						</div>
					</td>
					<td>营服中心</td>
					<td>
						<input type="text" name="unit_name" id="unit_name">
					</td>
					<td>人员姓名</td>
					<td>
						<input type="text" name="user_name" id="user_name" style="width: 152px;">
					</td>
					<td align="center" rowspan="2" width="100">
						<input type="button" id="search" class="btn-search" />
					</td>
					<td rowspan="2">
						<input type="button" id="exceldown" value="导出Excel" class="ana-button" style="cursor:pointer;margin-top: 3px;"/>
					</td>
				</tr>
			</table>
		</div>
<div class="item p3" style="margin-top:3px;height:100%;width:100%;" >
  <div id="target-data" style="height: 100%;width:100%">
   <div id="data" style="height:100%;width:100%;">
    <div id="scrollDiv" class="scrollDiv" style="height:100%;margin:0px" >
      <table id="tableData" border="0" cellspacing="0" cellpadding="0" class="table-normal" style="margin-left:5px;border-bottom:1px solid #F9C9D1;width: 90%" >
        <thead>  
       </thead> 
        <tbody>
        </tbody>
       </table>
      </div>
  </div>
  </div>
  </div>
  <div id="ana-img-buttons" style="text-align: right;width:100%;margin:0px" align="right"></div> 
 </div>
 <script type="text/javascript">
  $(function(){
	  $(".p3").height($(".p3").height()-$(".search-div").height()-$("#ana-img-buttons").height()-18);
  });
 </script>
  </body>
</html>
