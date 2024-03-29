<%@page import="java.text.SimpleDateFormat"%>
<%@page import="java.util.Calendar"%>
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt" %>
<%
	String path = request.getContextPath();
	Calendar c=Calendar.getInstance();
	String year=new SimpleDateFormat("yyyyMM").format(c.getTime());
%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>拟稿人排产审批界面</title>
<link href="<%=path%>/platform/theme/style/public.css" rel="stylesheet" type="text/css" />
<link href="<%=path%>/css/validationEngine.jquery.css" rel="stylesheet" type="text/css" />
<link href="<%=path%>/js/My97DatePicker/skin/WdatePicker.css" rel="stylesheet" type="text/css" />
<link href="<%=path%>/js/artDialog4.1.7/skins/default.css" rel="stylesheet" type="text/css" />
<script type="text/javascript" src="<%=path%>/js/jquery/jquery-1.8.0.min.js"></script>
<script type="text/javascript" src="<%=path%>/js/jquery-easyui-1.3.0/plugins/jquery.form.js"></script>
<script type="text/javascript" src="<%=path%>/js/My97DatePicker/WdatePicker.js"></script>
<script type="text/javascript" src="<%=path%>/js/artDialog4.1.7/artDialog.js"></script>
<script type="text/javascript" src="<%=path%>/js/artDialog4.1.7/plugins/iframeTools.js"></script>
<script type="text/javascript" src="<%=path%>/js/jquery/jquery.blockUI.js"></script>
<script type="text/javascript" src="<%=path%>/js/jquery/jquery.validationEngine-zh_CN.js"></script>
<script type="text/javascript" src="<%=path%>/js/jquery/jquery.validationEngine.js"></script>
<script type="text/javascript" src="<%=path%>/workflow/workorder/activityApproval/processEdit/js/saleschedule_edit.js"></script>
<script type="text/javascript">
	var path = "<%=path%>";
</script>
<style type="text/css">
.taskTable td {
	text-align:center;
}
</style>
</head>
<body>
	<div id="smartForm">
		<div id="container">
			<div id="cc" style="width:100%;">
				<div id="main" class="clearfix">
					<div class="main-block">
						<form id="justValidateFrom">
							<table id="sm-payment-order-apply">
		                    	<tr>
                                	<td>标题：</td>
                                    <td colspan="3"><input class="default-text-input wper91" name="theme" type="text" value="${workOrderVo.title}" readonly="readonly"/><span><font color="red">&nbsp;&nbsp;*</font></span></td>
                                </tr>
                                <tr>
                                	<td width="10%">拟稿人：</td>
                                    <td width="40%"><input class="default-text-input wper80" name="" type="text" value="${workOrderVo.startManName}" readonly="readonly"/></td>
                                    <td  width="10%">工单编号：</td>
                                    <td width="40%"><input class="default-text-input wper80" name="" type="text" readonly="readonly" value="${workOrderVo.displayPid}"/></td>
                                </tr>
                                <tr>
                                	<td>部门：</td>
                                    <td><input class="default-text-input wper80" name="" type="text" readonly="readonly" value="${workOrderVo.startManDeptName}"/></td>
                                    <td>申请时间：</td>
                                    <td>
               							 <input class="time_input wper80" name="createTime" type="text" value="<fmt:formatDate value="${workOrderVo.createTime}" type="both"/>" size="14" readonly="readonly"  />
                					</td>
                                </tr>
		                    </table>
							<div class="title-o"><i>排产任务信息</i></div>
							<div class="title" style="margin-top: 20px;"><i></i>任务时间</div>
						
							<table id="sm-payment-order-apply" style="width: 100%;">
	                       		<tr>
	           						<th style="width: 10%;">时间类型：</th>
	           						<td style="width: 10%;" id="dateType">
	           						</td>
	           						<th style="width: 5%;">时间：</th>
	                            	<td style="width: 80px;">
	                               		<input readonly="readonly" onfocus="blur()" type="text" style="width:80px" class="Wdate" id="dateValue"  name="sale_datepi"  value="" />
	            					</td>
	                           	</tr>
	                       	</table>
	                       	<div class="title" style="margin-top: 20px;"><i></i>指标及总任务值</div>
	                        <div class="default-dt dt-autoH" style="margin-top: 12px;">
	                             	<div class="no-js-table">
	                          			<table class="overflow-y taskTable" style="margin-top: 5px;">
	                                		<thead>
	                                			<tr>
	                      							<th>地市</th>
		                                       	<th>指标名称</th>
		                                       	<th>指标单位</th>
		                                       	<th>业务类型</th>
		                                       	<th>指标值</th>
		                                    </tr>
	                              			</thead>
	                              			<tbody id="sumDataBoby">
	                              			</tbody>
	                              		</table>
	                              	</div>
	                       	</div>		
	                        <div class="title" style="margin-top: 20px;"><i></i>任务分解</div>
	                        <div class="default-dt dt-autoH" style="margin-top: 12px;">
	                       		<div class="no-js-table">
	                         		<table class="overflow-y taskTable" id="subordinateAreaDataTable">
	                             		<thead>
	                          				<tr>
	                      						<th>下级地域</th>
	                                    	 	<th>指标名称</th>
	                                      		<th>指标单位</th>
	                                      		<th>业务类型</th>
	                                      		<th>指标值</th>
	                                   		</tr>
	                             		</thead>
	                             	</table>
	                             </div>
	                       	</div>
                       	</form>
                       	
                       	<form id="addSaleScheduleForm" method="post" encType="multipart/form-data">
                       		
                       		<div class="title" style="margin-top: 20px;"><i></i>附件信息</div>
	                       	<div class="default-dt dt-autoH">
	                            <table id="attachment_Info"></table>
	                            <div class="div_box"  id="filetd" style="width: 98%">
					            	<span ><input type='file' name='myFile'  size='80%' /><img alt="" src="<%=path %>/images/add.png" onclick="addFile()" ></span>			        
								</div>
	                       	</div>
                       	
                            <div class="center mt10 mb10">
                            	<a href="javascript:void(0)" class="default-btn mauto" onclick="doEdit()">保存</a>
                            	<font color="red">(修改指标值或附件后请先点击‘保存’更新数据！)</font>
                            </div>
                           	
                           	<input type="hidden" name="sumTaskInfoJsonStr" id="sumTaskInfoJsonStr" value="" />
                           	<input type="hidden" name="taskInfoJsonStr" id="taskInfoJsonStr" value="" />
                           	<input type="hidden" value="${workOrderVo.businessKey}" id="workNo" name="workNo"/>
						</form>
                       	
                       	<jsp:include page="/workflow/workorder/activityApproval/approveCommon.jsp"></jsp:include>
					</div>
				</div>
			</div>
		</div>
	</div>
</body>
</html>