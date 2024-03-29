var nowData = [];
var title=[["营业厅编码","营业厅名称","指标名称","权重","指标得分"]];
var field=["HQ_CHAN_CODE","HQ_CHAN_NAME","KPI_NAME","KPI_WAIGHT","KPI_SCORE"];
var report = null;
var downSql="";

$(function() {
	var orgLevel=$("#orgLevel").val();
	if(orgLevel==1){
		$("#reppeatBtn").remove();
	}
	report = new LchReport({
		title : title,
		field : field,
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
	var code=$("#code").val();
	var sql="SELECT "+field.join(",")+" FROM PMRT.TAB_MRT_BUS_HALL_PKI_MON WHERE DEAL_DATE='"+time+"'";
	var orgLevel=$("#orgLevel").val();
	var regionCode=$("#regionCode").val();
	if(regionCode!=""){
		sql+=" AND GROUP_ID_1='"+regionCode+"'";
	}
	downSql=sql;
	var csql = sql;
	var cdata = query("select count(*) total from (" + csql+")");
	var total = 0;
	if(cdata && cdata.length) {
		total = cdata[0].TOTAL;
	}else{
		return;
	}
	sql = "select ttt.* from ( select tt.*,rownum r from (" + sql
			+ " ) tt where rownum<=" + end + " ) ttt where ttt.r>" + start;
	nowData = query(sql);
	if (pageNumber == 1) {
		initPagination(total);
	}
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

 function repeatImport(){
	 window.location.href=$("#ctx").val()+"/portal/channelManagement/jsp/import_hall_kpi.jsp";
 }
 
 function exportData(){
	var time=$("#time").val();
	var showtext = '自营厅自设指标-'+time;
	downloadExcel(downSql,title,showtext);
 }