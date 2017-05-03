var nowData = [];
var title=[["州市","区县营服中心","是否入库","成本中心代码","水电系统编号","基站名称","营业厅编号","合同编号","合同名称","主合同编号","期初余额","本月计提房租及一次性费用","本月计提物业管理费","本月支付（不含税）","支付增值税","期末余额"]];
var field=["GROUP_ID_1_NAME","UNIT_NAME","IS_IN_UNIT","ACPEFIX","CELL_ID","CELL_NAME","D_LAN","CONTRACT_NO","CONTRACT_NAME","MAIN_CONTRACT_NO","START_FEE","THIS_MON_ONE_JT","THIS_MON_WY_JT","PAY_FEE","PAY_FAX","END_FEE"];
var orderBy = " ORDER BY GROUP_ID_1,UNIT_ID";
var report = null;
var downSql="";

$(function() {
	var orgLevel=$("#orgLevel").val();
	if(orgLevel!=1){
		$("#reppeatBtn").remove();
	}
	report = new LchReport({
		title : title,
		field : field,
		css:[
		      {array:[2],css:LchReport.NORMAL_STYLE}
		    ],
		rowParams : [],//第一个为rowId
		content : "lchcontent",
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
	var time=$("#time").val();
	var regionCode=$("#regionCode").val();
	var is_in_unit=$("#is_in_unit").val();
//条件
	var sql = "SELECT "+field.join(",")+" FROM PMRT.TAB_MRT_RENT_MON WHERE 1=1";
	if(time!=''){
		sql+=" AND DEAL_DATE="+time;
	}
	if(regionCode!=''){
		sql+=" AND GROUP_ID_1 = '"+regionCode+"'";
	}
	var is_in_unit=$("#is_in_unit").val();
	if(is_in_unit!=""){
		sql+=" AND IS_IN_UNIT='"+is_in_unit+"'";
	}
	sql += orderBy;
	downSql=sql;
	var csql = sql;
	var cdata = query("select count(*) total from(" + csql+")");
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
	$(".page_count").width($("#lch_DataHead").width());
	$("#lch_DataBody").find("TR").each(function(){
		var area=$(this).find("TD:eq(0)").find("A").text();
		if(area)
			$(this).find("TD:eq(0)").empty().text(area);
	});
}

 function repeatImport(){
	 window.location.href=$("#ctx").val()+"/portal/channelManagement/jsp/import_rent_new.jsp";
 }
 
 function downsAll(){
	var time=$("#time").val();
	var showtext = '房租汇总导入-'+time;
	downloadExcel(downSql,title,showtext);
 }

 