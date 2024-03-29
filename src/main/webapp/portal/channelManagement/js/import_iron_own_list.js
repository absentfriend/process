var nowData = [];
var title=[["账期","地市","营服中心","是否入库","配置平台站址编码","业务确认单号","铁塔公司站址编码","运营商自有物理站址名称","运营商自有物理站址编码","详细地址","经度","纬度","产品配置","实际最高天线挂高（米）","RRU拉远时BBU是否放在铁塔公司机房","铁塔既有共享客户总数","机房及配套既有共享客户总数","铁塔存量新增共享客户数","机房及配套存量新增共享客户数","0-6点是否可上站","维护等级","电力保障服务费模式","是否具备发电条件","是否选择发电服务","油机发电服务费模式","包干电费（元/月）（不含税）","油机发电服务费（元/月）（不含税）","超过10%高等级服务站址额外维护服务费（元/月）（不含税）","BBU安装在铁塔机房的服务费（元/月）（不含税）","其他费用（元/月）（不含税）","其它费用说明","铁塔基准价格（元/月）（不含税）","机房及配套基准价格（元/月）（不含税）","维护费（元/月）（不含税）","产品单元数","场地费（元/月）（不含税）","电力引入费（元/月）（不含税）","维护费折扣","场地费折扣","电力引入费折扣","铁塔共享折扣","机房及配套享折扣","服务起始日期","服务结束日期","产品服务费合计（元/年）不含税","产品服务费合计（元/年）含税","维护费用原始录入值","场地费原始录入值","电力引入原始录入值","油机发电服务费原始录入值","其他费用原始录入值","铁塔共享折扣系数1","铁塔共享变化日期1","机房及配套共享折扣系数1","机房及配套共享折扣变化日期1","铁塔共享折扣系数2","铁塔共享变化日期2","机房及配套共享折扣系数2","机房及配套共享折扣变化日期2"]];
var field=["DEAL_DATE","GROUP_ID_1_NAME","UNIT_NAME","IS_IN_UNIT","P_ADDR_CODE","BUSI_CONF_CODE","IRON_ADDR_CODE","OWN_ADDR_NAME","OWN_ADDR_CODE","DETAIL_ADDR","LONGITUDE","LATITUDE","PRODUCT_CONF","FACT_HIGH","RRU_BBU","IRON_SHARE_NUM","ROOM_SHARE_NUM","IRON_STORE_NUM","ROOM_STORE_NUM","ZERO_SIX","SVR_LEVEL","ELECT_SVR_TYPE","IS_ELECT_ENABLE","IS_ELECT_SVR","OIL_ELECT_TYPE","ELECT_Y_FEE","OIL_ELECT_Y_FEE","TEN_PER_FEE","BBU_FEE","OTHER_FEE","OTHER_FEE_DEC","IRON_STAND_FEE","ROOM_STAND_FEE","SVR_FEE","PRODUCT_UNIT_NUM","PLACE_FEE","ELECT_IN_FEE","SVR_RATIO","PLACE_RATIO","ELECT_IN_RATIO","IRON_SHARE_RATIO","ROOM_SHARE_RATIO","SVR_BEGIN_TIME","SVR_END_TIME","PRODUCT_SVR_NO_FEE","PRODUCT_SVR_FEE","SVR_SOURCE_FEE","PLACE_SOURCE_FEE","ELECT_IN_SOURCE_FEE","OIL_SOURCE_FEE","OTHER_SOURCE_FEE","IRON_SHARE_RATIO1","IRON_SHARE_DATE1","ROOM_SHARE_RATIO1","ROOM_SHARE_DATE1","IRON_SHARE_RATIO2","IRON_SHARE_DATE2","ROOM_SHARE_RATIO2","ROOM_SHARE_DATE2"];
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
		css:[
		      {array:[3],css:LchReport.NORMAL_STYLE}
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
	var code=$("#code").val();
	var sql="SELECT "+field.join(",")+" FROM PMRT.TAB_MRT_IRON_OWN_MON WHERE DEAL_DATE='"+time+"'";
	var orgLevel=$("#orgLevel").val();
	var regionCode=$("#regionCode").val();
	if(orgLevel==1){
		if(regionCode!=""){
			sql+=" AND GROUP_ID_1='"+regionCode+"'";
		}
	}else{
		sql+=" AND GROUP_ID_1='"+code+"'";
	}
	var is_in_unit=$("#is_in_unit").val();
	if(is_in_unit!=""){
		sql+=" AND IS_IN_UNIT='"+is_in_unit+"'";
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
	 window.location.href=$("#ctx").val()+"/portal/channelManagement/jsp/import_iron_own.jsp";
 }
 
 function exportData(){
	var time=$("#time").val();
	var showtext = '铁塔起租存量自有-'+time;
	downloadExcel(downSql,title,showtext);
 }