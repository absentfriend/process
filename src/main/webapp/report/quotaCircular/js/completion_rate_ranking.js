var nowData = [];
var field=["DEAL_DATE","GROUP_ID_1_NAME","UNIT_NAME","RANKING","RANKING_BASIS","TASK_INCOME","TOTAL_FEE","INCOME_RATE","TASK_DEV","DEV_COUNT","DEVTASK_RATE","COST_BUDGET","COST_COUNT","COST_RATE","BUDGET_TASK","BUDGET_ML","ML_RATE"];
var title=[["账期","地市名称","营服名称","排名标识","排名依据","收入排产目标（当年累计）","收入实际完成（当年累计）","收入累计完成率","积分排产目标（当年累计）","积分实际完成（当年累计）","积分累计完成率","成本预算（当年累计）","成本实际使用（当年累计）","成本累计完成率","毛利预算（当年累计）","毛利实际完成（当年累计）","毛利累计完成率"]];
var orderBy='';	
var report = null;
$(function() {
	listRegions();
	report = new LchReport({
		title : title,
		field : field,
		css:[{gt:4,css:LchReport.RIGHT_ALIGN}],
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
	var dealDate=$("#dealDate").val();
	var region=$("#region").val();
	//地市编码
	var regionCode =$("#regionCode").val();
	//营服中心编码
	var unitCode =$("#unitCode").val();
	//排名标识
	var ranking =$("#ranking").val();
	//排名依据
	var rankingBasis = $("#rankingBasis").val();
	//条件
	var sql = getSql()+" WHERE T.DEAL_DATE ="+dealDate ;
	
	//权限
	if(regionCode!=''){
		sql+=" AND T.GROUP_ID_1 = '"+ regionCode+"'";
	}
	if(unitCode!=''){
		sql+=" AND T.UNIT_ID ='"+unitCode+"'";
	}
	if(ranking!=''){
		sql+=" AND T.RANKING ="+ranking;
	}
	if(rankingBasis!=''){
		sql+=" AND T.RANKING_BASIS ="+rankingBasis;
	}
	var orgLevel=$("#orgLevel").val();
	if(orgLevel==1){

	}else if(orgLevel==2){
		sql+=" and T.GROUP_ID_1 =" + code;
	}else if(orgLevel==3){
		sql+=" and T.GROUP_ID_1 =" + region +" AND T.UNIT_ID = "+code;
	}else{
		sql+=" and 1=2";
	}
	
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
	var s="SELECT T.DEAL_DATE,                                             "+
			"       T.GROUP_ID_1_NAME,                                       "+
			"       T.UNIT_NAME,                                             "+
			"       T.TASK_INCOME,                                           "+
			"       T.TOTAL_FEE,                                             "+
			"       T.INCOME_RATE,                                           "+
			"       T.TASK_DEV,                                              "+
			"       T.DEV_COUNT,                                             "+
			"       T.DEVTASK_RATE,                                          "+
			"       T.COST_BUDGET,                                           "+
			"       T.COST_COUNT,                                            "+
			"       T.COST_RATE,                                             "+
			"       T.BUDGET_TASK,                                           "+
			"       T.BUDGET_ML,                                             "+
			"       T.ML_RATE,                                               "+
			"       DECODE(T.RANKING, '1', '前20', '2', '后20') AS RANKING,  "+
			"       DECODE(T.RANKING_BASIS,                                  "+
			"              '1',                                              "+
			"              '收入完成',                                       "+
			"              '2',                                              "+
			"              '积分完成',                                       "+
			"              '3',                                              "+
			"              '毛利完成') AS RANKING_BASIS                      "+
			"  FROM PMRT.TB_MRT_JF_ZB_COUNT_COMPLETERK T                     ";
	return s;
}
/////////////////////////下载开始/////////////////////////////////////////////
function downsAll(){
	var code =$("#code").val();
	var dealDate=$("#dealDate").val();
	var region=$("#region").val();
	//地市编码
	var regionCode =$("#regionCode").val();
	//营服中心编码
	var unitCode =$("#unitCode").val();
	//排名标识
	var ranking =$("#ranking").val();
	//排名依据
	var rankingBasis = $("#rankingBasis").val();
	//条件
	var sql = getSql()+" WHERE T.DEAL_DATE ="+dealDate ;
	
	//权限
	if(regionCode!=''){
		sql+=" AND T.GROUP_ID_1 = '"+ regionCode+"'";
	}
	if(unitCode!=''){
		sql+=" AND T.UNIT_ID ='"+unitCode+"'";
	}
	if(ranking!=''){
		sql+=" AND T.RANKING ="+ranking;
	}
	if(rankingBasis!=''){
		sql+=" AND T.RANKING_BASIS ="+rankingBasis;
	}
	var orgLevel=$("#orgLevel").val();
	if(orgLevel==1){

	}else if(orgLevel==2){
		sql+=" and T.GROUP_ID_1 =" + code;
	}else if(orgLevel==3){
		sql+=" and T.GROUP_ID_1 =" + region +" AND T.UNIT_ID = "+code;
	}else{
		sql+=" and 1=2";
	}
	showtext = '完成率排名-'+dealDate;
	downloadExcel(sql,title,showtext);
}
/////////////////////////下载结束/////////////////////////////////////////////



/****************地市查询以及结果设置到页面选项框**********************/
function listRegions(){
	var sql=" SELECT DISTINCT(T.GROUP_ID_1),T.GROUP_ID_1_NAME FROM  PMRT.TB_MRT_JF_ZB_COUNT_COMPLETERK T WHERE T.GROUP_ID_1 IS NOT NULL ";
	var orgLevel=$("#orgLevel").val();
	var code=$("#code").val();
	var region =$("#region").val();
	if(orgLevel==1){
		sql+="";
	}else if(orgLevel==2){
		sql+=" and T.GROUP_ID_1='"+code+"'";
	}else if(orgLevel==3){
		sql+=" and T.GROUP_ID_1 ='"+region+"'";
	}else{
		sql+=" and T.GROUP_ID_1='"+region+"'";
	}
	sql+=" ORDER BY T.GROUP_ID_1"
	var d=query(sql);
	if (d) {
		var h = '';
		if (d.length == 1) {
			h += '<option value="' + d[0].GROUP_ID_1
					+ '" selected >'
					+ d[0].GROUP_ID_1_NAME + '</option>';
			listUnits(d[0].GROUP_ID_1);
		} else {
			h += '<option value="" selected>请选择</option>';
			for (var i = 0; i < d.length; i++) {
				h += '<option value="' + d[i].GROUP_ID_1 + '">' + d[i].GROUP_ID_1_NAME + '</option>';
			}
		}
		var $area = $("#regionCode");
		var $h = $(h);
		$area.empty().append($h);
		$area.change(function() {
			listUnits($(this).attr('value'));
		});
	} else {
		alert("获取地市信息失败");
	}
}

/************查询营服中心***************/
function listUnits(region){
	var $unit=$("#unitCode");
	var sql = "SELECT DISTINCT(T.UNIT_ID),T.UNIT_NAME FROM  PMRT.TB_MRT_JF_ZB_COUNT_COMPLETERK T WHERE T.UNIT_ID IS NOT NULL ";
	if(region!=''){
		sql+=" AND T.GROUP_ID_1='"+region+"' ";
		//权限
		var orgLevel=$("#orgLevel").val();
		var code=$("#code").val();
		if(orgLevel==3){
			sql+=" and t.UNIT_ID='"+code+"'";
		}else if(orgLevel==4){
			sql+=" AND 1=2";
		}else{
		}
	}else{
		$unit.empty().append('<option value="" selected>请选择</option>');
		return;
	}
	
	sql+=" ORDER BY T.UNIT_ID"
	var d=query(sql);
	if (d) {
		var h = '';
		if (d.length == 1) {
			h += '<option value="' + d[0].UNIT_ID
					+ '" selected >'
					+ d[0].UNIT_NAME + '</option>';
		} else {
			h += '<option value="" selected>请选择</option>';
			for (var i = 0; i < d.length; i++) {
				h += '<option value="' + d[i].UNIT_ID + '">' + d[i].UNIT_NAME + '</option>';
			}
		}
		
		var $h = $(h);
		$unit.empty().append($h);
	} else {
		alert("获取基层单元信息失败");
	}
}