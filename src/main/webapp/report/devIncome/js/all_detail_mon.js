var nowData = [];
var title=[["账期","地市编码","地市名称","营服编码","营服名称","hr编码","姓名","角色","积分任务","积分完成","收入任务","收入完成","欠费","去年拍照用户<br/>12月收入","拍照用户今年<br/>累计收入","毛利预算","预算成本","累计收入","去年12月欠费"]];
var field=["DEAL_DATE","GROUP_ID_1","GROUP_ID_1_NAME","UNIT_ID","UNIT_NAME","HR_ID","NAME","USER_ROLE","TASK_DEV","DEV_COUNT","TASK_INCOME","TOTAL_FEE","OWEFEE","AMOUNT_12","AMOUNT_MONTH","BUDGET_ML","BUDEGET_COST","AMOUNT_ALL","LAST_OWE_12"];
var orderBy = '';
var report = null;
var downSql="";
$(function() {
	report = new LchReport({
		title : title,
		field : field,
		//lock:3,
		css:[{gt:6,css:LchReport.RIGHT_ALIGN}],
		tableCss:{leftWidth:350},
		rowParams : [],//第一个为rowId
		content : "lchcontent",
		orderCallBack : function(index, type) {
			/*orderBy = " ORDER BY " + field[index] + " " + type + " ";
			search(0);*/
		},
		getSubRowsCallBack : function($tr) {
			return {
				data : nowData,
				extra : {}
			};
		}
	});
	search(0);
	
	$("#searchBtn").click(function(){
		search(0);
	});
});

var pageSize = 15;
//分页
function initPagination(totalCount) {
	$("#totalCount").html(totalCount);
	$("#pagination").pagination(totalCount, {
		callback : search,
		items_per_page : pageSize,
		link_to : "###",
		prev_text : '上页', //上一页按钮里text  
		next_text : '下页', //下一页按钮里text  
		num_display_entries : 5,
		num_edge_entries : 2
	});
}
//列表信息
function search(pageNumber) {
	pageNumber = pageNumber + 1;
	var start = pageSize * (pageNumber - 1);
	var end = pageSize * pageNumber;
	
	var startDate=$("#startDate").val();
	var endDate=$("#endDate").val();
	var regionCode=$("#regionCode").val();
	var unitCode=$("#unitCode").val();
	var userName=$.trim($("#userName").val());
//条件
	var sql = " FROM PODS.TB_ODS_KPI_ALL_DEATIL_MON where DEAL_DATE BETWEEN '"+startDate+"' AND '"+endDate+"'";
	if(regionCode!=''){
		sql+=" AND GROUP_ID_1 = '"+regionCode+"'";
	}
	if(unitCode!=''){
		sql+=" AND UNIT_ID IN("+_unit_relation(unitCode)+")";
	}
	if(userName!=''){
		sql+=" AND NAME like '%"+userName+"%'";
	}
//权限
	var orgLevel=$("#orgLevel").val();
	var code=$("#code").val();
	var hrId=$("#hrId").val();
	if(orgLevel==1){
		
	}else if(orgLevel==2){
		sql+=" AND GROUP_ID_1="+code;
	}else{
		 var hrIds=_jf_power(hrId,startDate);
		 if(hrIds!=""){
		   sql+=" AND HR_ID in("+hrIds+") ";
		 }else{
		   sql+=" AND 1=2 "; 
		 }
	}
	var cdata = query("select count(*) total" + sql);
	var total = 0;
	if(cdata && cdata.length) {
		total = cdata[0].TOTAL;
	}else{
		return;
	}
	//排序
	if (orderBy != '') {
		sql += orderBy;
	}
	sql = "select * " + sql;
	downSql=sql;
	sql = "select ttt.* from ( select tt.*,rownum r from (" + sql
			+ " ) tt where rownum<=" + end + " ) ttt where ttt.r>" + start;
	var d = query(sql);
	if (pageNumber == 1) {
		initPagination(total);
	}
	nowData = d;

	report.showSubRow();
	///////////////////////////////////////////
	$("#lch_DataHead").find("TH").unbind();
	$("#lch_DataHead").find(".sub_on,.sub_off,.space").remove();
	///////////////////////////////////////////
	$(".page_count").width($("#lch_DataHead").width());
	$("#lch_DataBody").find("TR").each(function(){
		var area=$(this).find("TD:eq(0)").find("A").text();
		if(area)
			$(this).find("TD:eq(0)").empty().text(area);
	});
}

  
/////////////////////////下载开始/////////////////////////////////////////////
function downsAll(){
	var startDate=$("#startDate").val();
	var endDate=$("#endDate").val();
	var showtext = 'KPI分月汇总月报-'+startDate+"-"+endDate;
	downloadExcel(downSql,title,showtext);
}
/////////////////////////下载结束/////////////////////////////////////////////