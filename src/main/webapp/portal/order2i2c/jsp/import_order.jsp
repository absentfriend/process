<%@page language="java" import="java.util.*" %>
<%@page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%
	String path = request.getContextPath();
    List<String> err=(List<String>) request.getAttribute("err");
%>
<html>
  <head>
 	<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
	<meta name="renderer" content="webkit">
	<meta http-equiv="X-UA-Compatible" content="IE=Edge,chrome=1" >
    <link href="<%=path%>/platform/theme/style/public.css" rel="stylesheet" type="text/css" />
    <script type="text/javascript" src="<%=path%>/js/jquery/jquery-1.8.0.min.js"></script>
	<script type="text/javascript" src="<%=path%>/portal/order2i2c/js/import_order.js?v=1"></script>
	<style>
		th {
		    background: #ffecc8 none repeat scroll 0 0;
		    border-left: 1px solid #e7d4b3;
		    color: #d28531;
		    font-size: 14px;
		    font-weight: bold;
		    text-align: center;
		    white-space: nowrap;
		}
		td{
			font-size: 14px;
		    font-weight: normal;
		}
		TR{
			height:50px;
		}
		td,th{
			border-top:1px solid #e7d4b3;
		    border-left:1px solid #e7d4b3;
		    border-bottom:none;
		    border-right:none;
		}
		Table{
			border-bottom:1px solid #e7d4b3;
			border-right:1px solid #e7d4b3;
		}
	</style>
  </head>
  <body class="taskPage">
    <input type="hidden" id="ctx" value="<%=path%>">
		<div id="main" class="clearfix">
			<div class="main-block">
				<div class="title">
					<i></i>订单上传
				</div>
				<div id="chose-sender">
					<div class="title-o">
						<i>文件上载步骤</i>
					</div>
					<form id="uploadForm" name="mainForm"
						method="post" enctype="multipart/form-data">
						<table cellspacing="0" width="100%">
							<tr>
								<th  width="100px">第一步</th>
								<td colspan='2'><span style="display:inline-block;">点击<b>模板下载</b>，导出对应的EXCEL数据模板。 </span><a class="default-btn" style="display:inline-block;"
									  style="cursor: pointer"
									onclick="downloadFile();" >模板下载</a>
									<span style="color:red;font-size:15px;">(必须下载模板)</span>
								</td>
							</tr>
							<tr>
								<th  width="100px">第二步</th>
								<td colspan='2'>点击<b>浏览</b>,选择编辑好的EXCEL数据文件，提交即可。
								</td>
							</tr> 
							<tr>
								<th  width="100px">上传文件</th>
								<td>
								    <input style="display:inline-block;" type="file" size="60" name="uploadFile" />
								</td>
								<td colspan="2">
								    <a style="display:inline-block;" class="default-btn"  style="cursor: pointer" id="upload">提交</a><span style="display:inline-block;">&nbsp;
								    <a style="display:inline-block;" class="default-btn"  style="cursor: pointer" onclick="toBack();">返回</a><span style="display:inline-block;">
								</td>
							</tr>
							<tr>
								<td colspan="4">
								    <span style="color:red;font-size:15px;">(注意事项：上传的模板必须要与模板下载的一致，表头不能有多列或少列；单元格必须要有实线边框；模板中不能有公式，拉伸或者特殊格式；数字列请设置为文本格式，否则会被Excel转化为科学计数法；上传出现错误时可以将数据复制到页面下载的模板中再上传。)</span>
								</td>
							</tr>
						</table>
					</form>
					<%
  if(err!=null){	
  %>
  	<div style="width:98%;margin-left:10px;">
		<fieldset>
		    <legend><font size="3" style="color:blue;">错误信息</font></legend>
		    <%
		    int ii=0;
		    for(String s:err){
		    	ii++;
		    %>
		    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<font size="2" color="red"><%=(ii+"."+s) %></font>	<br/>
	  		<%}%>
	  	</fieldset>
  	</div>
  <%
  }
  %>
				</div>
			</div>
		</div>		
	</body>
</html>
