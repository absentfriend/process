var nowData = [];

var field="";
var title="";
var orderBy='';	
var report = null;
$(function() {
	field=["DEAL_DATE","GROUP_ID_1_NAME","UNIT_NAME","HR_ID","NAME","USER_ROLE","SUBSCRIPTION_ID","DEVICE_NUMBER","NET_TYPE","OWE_FEE","HQ_CHAN_CODE","OWEFEE1"];
	title=[["账期","地市","营服中心","HR编码","人员姓名","人员角色","用户编号","用户号码","用户类型","欠费截止当前账期","渠道编码","欠费上年12月31"]];
	report = new LchReport({
		title : title,
		field : field,
		css:[{gt:3,css:LchReport.RIGHT_ALIGN}],
		rowParams : [],//第一个为rowId
		content : "lchcontent",
		orderCallBack : function(index, type) {
			
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
	var code =$("#code").val();
	var region=$("#region").val();
	//地市编码
	var regionCode =$("#regionCode").val();
	//营服中心编码
	var unitCode=$("#unitCode").val();
	//用户名称
	var userName=$("#userName").val();
	//用户号码
	var　userPhone = $("#userPhone").val();
	
	//条件
	var sql = getSql()+" WHERE 1=1" ;
	
	//权限
	if(regionCode!=''){
		sql+=" AND T.GROUP_ID_1 = '"+ regionCode+"'";
	}
	if(unitCode!=''){
		sql += " AND UNIT_ID IN("+_unit_relation(unitCode)+")";
	}
	if(userName!=""){
		sql+=" AND T.NAME LIKE '%"+userName+"%'";
	}
	if(userPhone!=''){
		sql+=" AND T.DEVICE_NUMBER ='"+userPhone+"'";
	}
	var orgLevel=$("#orgLevel").val();
	if(orgLevel==1){

	}else if(orgLevel==2){
		sql+=" and T.GROUP_ID_1 ='"+ code+"'";
	}else if(orgLevel==3){
		sql+=" and T.GROUP_ID_1 ='"+ region+" AND UNIT_ID IN("+_unit_relation(code)+")";
	}else{
		sql+=" and 1=2";
	}
	
	var csql = sql;
	var cdata = query("select count(1) total from(" + csql+")");
	var total = 0;
	if(cdata && cdata.length) {
		total = cdata[0].TOTAL;
	}else{
		return;
	}
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



function getSql(){
	var dealDate=$("#dealDate").val();
	var s="SELECT T.DEAL_DATE,                                        "+
			"       T.GROUP_ID_1_NAME,                                  "+
			"       T.UNIT_NAME,                                        "+
			"       T.HR_ID,                                            "+
			"       T.NAME,                                             "+
			"       T.USER_ROLE,                                        "+
			"       T.SUBSCRIPTION_ID,                                  "+
			"       T.DEVICE_NUMBER,                                    "+
			"       DECODE(T.NET_TYPE,-1,'固网', 01, '2G', 02, '3G', 03, '3G上网卡', 4, '4G') AS NET_TYPE,                                         "+
			"       T.OWE_FEE,                                          "+
			"       T.HQ_CHAN_CODE,                                     "+
			"       T.OWEFEE1                                           "+
			"  FROM PODS.TB_ODS_JCDY_OWE_MON PARTITION(P"+dealDate+") T ";
	return s;
}
/////////////////////////下载开始/////////////////////////////////////////////
function downsAll(){
	var code =$("#code").val();
	var region=$("#region").val();
	var dealDate = $("#dealDate").val();
	//地市编码
	var regionCode =$("#regionCode").val();
	//营服中心编码
	var unitCode=$("#unitCode").val();
	//用户名称
	var userName=$("#userName").val();
	//用户号码
	var　userPhone = $("#userPhone").val();
	
	//条件
	var sql = getSql()+" WHERE 1=1" ;
	
	//权限
	if(regionCode!=''){
		sql+=" AND T.GROUP_ID_1 = '"+ regionCode+"'";
	}
	if(unitCode!=''){
		sql += " AND UNIT_ID IN("+_unit_relation(unitCode)+")";
	}
	if(userName!=""){
		sql+=" AND T.NAME LIKE '%"+userName+"%'";
	}
	if(userPhone!=''){
		sql+=" AND T.DEVICE_NUMBER ='"+userPhone+"'";
	}
	var orgLevel=$("#orgLevel").val();
	if(orgLevel==1){

	}else if(orgLevel==2){
		sql+=" and T.GROUP_ID_1 ='"+ code+"'";
	}else if(orgLevel==3){
		sql+=" and T.GROUP_ID_1 ='"+ region+" AND UNIT_ID IN("+_unit_relation(code)+")";
	}else{
		sql+=" and 1=2";
	}
	showtext = 'KPI欠费明细-'+dealDate;
	downloadExcel(sql,title,showtext);
}
/////////////////////////下载结束/////////////////////////////////////////////
