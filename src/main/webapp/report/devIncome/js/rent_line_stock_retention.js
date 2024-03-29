var nowData = [];
var field = [ "GROUP_ID_1_NAME", "RATE_LAST_YEAR", "FEE_LAST_12", "FEE_01","FEE_02", "FEE_03", "FEE_04", "FEE_05", "FEE_06", "FEE_07", "FEE_08","FEE_09", "FEE_10", "FEE_11", "FEE_12", "RATE_01", "RATE_02","RATE_03", "RATE_04", "RATE_05", "RATE_06", "RATE_07", "RATE_08","RATE_09", "RATE_10", "RATE_11", "RATE_12" ];
var orderBy = '';
var report = null;
$(function() {
	var time = $("#time").val();
	var title = [ [ "地市名称", (time - 1) + "年专租线<br/>存量收入保有率",
			(time - 1) + "年12月拍照专租线<br/>出账收入", time + "年1月拍照专租线<br/>保有出账收入",
			time + "年2月拍照专租线<br/>保有出账收入", time + "年3月拍照专租线<br/>保有出账收入",
			time + "年4月拍照专租线<br/>保有出账收入", time + "年5月拍照专租线<br/>保有出账收入",
			time + "年6月拍照专租线<br/>保有出账收入", time + "年7月拍照专租线<br/>保有出账收入",
			time + "年8月拍照专租线<br/>保有出账收入", time + "年9月拍照专租线<br/>保有出账收入",
			time + "年10月拍照专租线<br/>保有出账收入", time + "年11月拍照专租线<br/>保有出账收入",
			time + "年12月拍照专租线<br/>保有出账收入", time + "年1月拍照专租线<br/>保有出账收入保有率",
			time + "年2月拍照专租线<br/>保有出账收入保有率", time + "年3月拍照专租线<br/>保有出账收入保有率",
			time + "年4月拍照专租线<br/>保有出账收入保有率", time + "年5月拍照专租线<br/>保有出账收入保有率",
			time + "年6月拍照专租线<br/>保有出账收入保有率", time + "年7月拍照专租线<br/>保有出账收入保有率",
			time + "年8月拍照专租线<br/>保有出账收入保有率", time + "年9月拍照专租线<br/>保有出账收入保有率",
			time + "年10月拍照专租线<br/>保有出账收入保有率", time + "年11月拍照专租线<br/>保有出账收入保有率",
			time + "年12月拍照专租线<br/>保有出账收入保有率" ] ];
	report = new LchReport({
		title : title,
		field : field,
		lock : 1,
		css : [ {gt:0,css:LchReport.RIGHT_ALIGN},{array:[1,15,16,17,18,19,20,21,22,23,24,25,26],css:LchReport.NORMAL_STYLE}],
		tableCss : {
			leftWidth : 140
		},
		
		rowParams : [],// 第一个为rowId
		content : "lchcontent",
		getSubRowsCallBack : function($tr) {
			return {
				data : nowData,
				extra : {}
			};
		}
	});
	search(0);
	$("#searchBtn").click(function() {
		search(0);
	});
});

var pageSize = 19;
// 分页
function initPagination(totalCount) {
	$("#totalCount").html(totalCount);
	$("#pagination").pagination(totalCount, {
		callback : search,
		items_per_page : pageSize,
		link_to : "###",
		prev_text : '上页', // 上一页按钮里text
		next_text : '下页', // 下一页按钮里text
		num_display_entries : 5,
		num_edge_entries : 2
	});
}

// 列表信息
function search(pageNumber) {
	pageNumber = pageNumber + 1;
	var start = pageSize * (pageNumber - 1);
	var end = pageSize * pageNumber;

	var year = $("#time").val();
	var orderBy = "";
	var sql = getSql();

	var title = [ [ (year - 1) + "年专租线<br/>存量收入保有率",
			(year - 1) + "年12月拍照专租线<br/>出账收入", year + "年1月拍照专租线<br/>保有出账收入",
			year + "年2月拍照专租线<br/>保有出账收入", year + "年3月拍照专租线<br/>保有出账收入",
			year + "年4月拍照专租线<br/>保有出账收入", year + "年5月拍照专租线<br/>保有出账收入",
			year + "年6月拍照专租线<br/>保有出账收入", year + "年7月拍照专租线<br/>保有出账收入",
			year + "年8月拍照专租线<br/>保有出账收入", year + "年9月拍照专租线<br/>保有出账收入",
			year + "年10月拍照专租线<br/>保有出账收入", year + "年11月拍照专租线<br/>保有出账收入",
			year + "年12月拍照专租线<br/>保有出账收入", year + "年1月拍照专租线<br/>保有出账收入保有率",
			year + "年2月拍照专租线<br/>保有出账收入保有率", year + "年3月拍照专租线<br/>保有出账收入保有率",
			year + "年4月拍照专租线<br/>保有出账收入保有率", year + "年5月拍照专租线<br/>保有出账收入保有率",
			year + "年6月拍照专租线<br/>保有出账收入保有率", year + "年7月拍照专租线<br/>保有出账收入保有率",
			year + "年8月拍照专租线<br/>保有出账收入保有率", year + "年9月拍照专租线<br/>保有出账收入保有率",
			year + "年10月拍照专租线<br/>保有出账收入保有率", year + "年11月拍照专租线<br/>保有出账收入保有率",
			year + "年12月拍照专租线<br/>保有出账收入保有率" ] ];
	for (var i = 0; i < title[0].length; i++) {
		$("#lch_DataHead tr").find("th:eq(" + (i + 1) + ")").html(title[0][i]);
	}

	var cdata = query("select count(*) total from(" + sql + ")");
	var total = 0;
	if (cdata && cdata.length) {
		total = cdata[0].TOTAL;
	} else {
		return;
	}
	sql += orderBy;
	sql = "select ttt.* from ( select tt.*,rownum r from (" + sql
			+ " ) tt where rownum<=" + end + " ) ttt where ttt.r>" + start;
	var d = query(sql);
	if (pageNumber == 1) {
		initPagination(total);
	}
	nowData = d;
	report.showSubRow();
	// /////////////////////////////////////////
	$("#lch_DataHead").find("TH").unbind();
	$("#lch_DataHead").find(".sub_on,.sub_off,.space").remove();
	// /////////////////////////////////////////
	$("#lch_DataBody").find("TR").each(function() {
		var area = $(this).find("TD:eq(0)").find("A").text();
		if (area)
			$(this).find("TD:eq(0)").empty().text(area);
	});
}

function getSql() {
	var year = $("#time").val();
	var regionCode = $("#regionCode").val();
	sql = "SELECT T2.GROUP_ID_1_NAME,                                                                         "+
			"       PODS.GET_RADIX_POINT(T2.RATE_LAST_YEAR,2) AS RATE_LAST_YEAR,      "+
			"       PODS.GET_RADIX_POINT(T2.FEE_LAST_12,2) AS FEE_LAST_12,            "+
			"       PODS.GET_RADIX_POINT(T2.FEE_01,2) AS FEE_01,                      "+
			"       PODS.GET_RADIX_POINT(T2.FEE_02,2) AS FEE_02,                      "+
			"       PODS.GET_RADIX_POINT(T2.FEE_03,2) AS FEE_03,                      "+
			"       PODS.GET_RADIX_POINT(T2.FEE_04,2) AS FEE_04,                      "+
			"       PODS.GET_RADIX_POINT(T2.FEE_05,2) AS FEE_05,                      "+
			"       PODS.GET_RADIX_POINT(T2.FEE_06,2) AS FEE_06,                      "+
			"       PODS.GET_RADIX_POINT(T2.FEE_07,2) AS FEE_07,                      "+
			"       PODS.GET_RADIX_POINT(T2.FEE_08,2) AS FEE_08,                      "+
			"       PODS.GET_RADIX_POINT(T2.FEE_09,2) AS FEE_09,                      "+
			"       PODS.GET_RADIX_POINT(T2.FEE_10,2) AS FEE_10,                      "+
			"       PODS.GET_RADIX_POINT(T2.FEE_11,2) AS FEE_11,                      "+
			"       PODS.GET_RADIX_POINT(T2.FEE_12,2) AS FEE_12,                      "+
			"       PODS.GET_RADIX_POINT(T2.RATE_01,2) AS RATE_01,                    "+
			"       PODS.GET_RADIX_POINT(T2.RATE_02,2) AS RATE_02,                    "+
			"       PODS.GET_RADIX_POINT(T2.RATE_03,2) AS RATE_03,                    "+
			"       PODS.GET_RADIX_POINT(T2.RATE_04,2) AS RATE_04,                    "+
			"       PODS.GET_RADIX_POINT(T2.RATE_05,2) AS RATE_05,                    "+
			"       PODS.GET_RADIX_POINT(T2.RATE_06,2) AS RATE_06,                    "+
			"       PODS.GET_RADIX_POINT(T2.RATE_07,2) AS RATE_07,                    "+
			"       PODS.GET_RADIX_POINT(T2.RATE_08,2) AS RATE_08,                    "+
			"       PODS.GET_RADIX_POINT(T2.RATE_09,2) AS RATE_09,                    "+
			"       PODS.GET_RADIX_POINT(T2.RATE_10,2) AS RATE_10,                    "+
			"       PODS.GET_RADIX_POINT(T2.RATE_11,2) AS RATE_11,                    "+
			"       PODS.GET_RADIX_POINT(T2.RATE_12,2) AS RATE_12                     "
			+ "  FROM (SELECT T0.GROUP_ID_1,                                                                      "
			+ "               T0.GROUP_ID_1_NAME,                                                                 "
			+ "               NVL(T0.RATE_LAST_YEAR, 0) * 100 || '%' AS RATE_LAST_YEAR,                           "
			+ "               NVL(T0.FEE_LAST_12, 0) AS FEE_LAST_12,                                              "
			+ "               NVL(T0.FEE_01, 0) AS FEE_01,                                                        "
			+ "               NVL(T0.FEE_02, 0) AS FEE_02,                                                        "
			+ "               NVL(T0.FEE_03, 0) AS FEE_03,                                                        "
			+ "               NVL(T0.FEE_04, 0) AS FEE_04,                                                        "
			+ "               NVL(T0.FEE_05, 0) AS FEE_05,                                                        "
			+ "               NVL(T0.FEE_06, 0) AS FEE_06,                                                        "
			+ "               NVL(T0.FEE_07, 0) AS FEE_07,                                                        "
			+ "               NVL(T0.FEE_08, 0) AS FEE_08,                                                        "
			+ "               NVL(T0.FEE_09, 0) AS FEE_09,                                                        "
			+ "               NVL(T0.FEE_10, 0) AS FEE_10,                                                        "
			+ "               NVL(T0.FEE_11, 0) AS FEE_11,                                                        "
			+ "               NVL(T0.FEE_12, 0) AS FEE_12,                                                        "
			+ "               NVL(T0.RATE_01, 0) * 100 || '%' AS RATE_01,                                         "
			+ "               NVL(T0.RATE_02, 0) * 100 || '%' AS RATE_02,                                         "
			+ "               NVL(T0.RATE_03, 0) * 100 || '%' AS RATE_03,                                         "
			+ "               NVL(T0.RATE_04, 0) * 100 || '%' AS RATE_04,                                         "
			+ "               NVL(T0.RATE_05, 0) * 100 || '%' AS RATE_05,                                         "
			+ "               NVL(T0.RATE_06, 0) * 100 || '%' AS RATE_06,                                         "
			+ "               NVL(T0.RATE_07, 0) * 100 || '%' AS RATE_07,                                         "
			+ "               NVL(T0.RATE_08, 0) * 100 || '%' AS RATE_08,                                         "
			+ "               NVL(T0.RATE_09, 0) * 100 || '%' AS RATE_09,                                         "
			+ "               NVL(T0.RATE_10, 0) * 100 || '%' AS RATE_10,                                         "
			+ "               NVL(T0.RATE_11, 0) * 100 || '%' AS RATE_11,                                         "
			+ "               NVL(T0.RATE_12, 0) * 100 || '%' AS RATE_12                                          "
			+ "          FROM PMRT.TB_MRT_JCDY_ZZCL_YEAR T0                                                       "
			+ "         WHERE 1 = 1                                                                               "
			+ "           AND YEAR =  " + year;
	if (regionCode != '') {
		sql += " AND GROUP_ID_1 = '" + regionCode + "'";
	}
	// 权限
	var orgLevel = $("#orgLevel").val();
	var code = $("#code").val();
	var region=$("#region").val();
	if (orgLevel == 1) {
		orderBy = " ORDER BY GROUP_ID_1";
	} else{
		sql += " AND GROUP_ID_1 = " + region;
	}
	sql +=  "UNION ALL                                                                                   "+
			"SELECT '99999' AS GROUP_ID_1,                                                               "+
			"       '合计' AS GROUP_ID_1_NAME,                                                           "+
			"       ROUND(NVL((SUM(T.FEE_2015) / SUM(T.FEE_2014)), 0) * 100, 2) || '%' AS RATE_LAST_YEAR,"+
			"       NVL(SUM(T.FEE_LAST_12), 0) AS FEE_LAST_12,                                           "+
			"       NVL(SUM(T.FEE_01), 0) AS FEE_01,                                                     "+
			"       NVL(SUM(T.FEE_02), 0) AS FEE_02,                                                     "+
			"       NVL(SUM(T.FEE_03), 0) AS FEE_03,                                                     "+
			"       NVL(SUM(T.FEE_04), 0) AS FEE_04,                                                     "+
			"       NVL(SUM(T.FEE_05), 0) AS FEE_05,                                                     "+
			"       NVL(SUM(T.FEE_06), 0) AS FEE_06,                                                     "+
			"       NVL(SUM(T.FEE_07), 0) AS FEE_07,                                                     "+
			"       NVL(SUM(T.FEE_08), 0) AS FEE_08,                                                     "+
			"       NVL(SUM(T.FEE_09), 0) AS FEE_09,                                                     "+
			"       NVL(SUM(T.FEE_10), 0) AS FEE_10,                                                     "+
			"       NVL(SUM(T.FEE_11), 0) AS FEE_11,                                                     "+
			"       NVL(SUM(T.FEE_12), 0) AS FEE_12,                                                     "+
			"       ROUND(NVL((SUM(T.FEE_01) / SUM(T.FEE_LAST_12)), 0) * 100, 2) || '%' AS RATE_01,      "+
			"       ROUND(NVL((SUM(T.FEE_02) / SUM(T.FEE_LAST_12)), 0) * 100, 2) || '%' AS RATE_02,      "+
			"       ROUND(NVL((SUM(T.FEE_03) / SUM(T.FEE_LAST_12)), 0) * 100, 2) || '%' AS RATE_03,      "+
			"       ROUND(NVL((SUM(T.FEE_04) / SUM(T.FEE_LAST_12)), 0) * 100, 2) || '%' AS RATE_04,      "+
			"       ROUND(NVL((SUM(T.FEE_05) / SUM(T.FEE_LAST_12)), 0) * 100, 2) || '%' AS RATE_05,      "+
			"       ROUND(NVL((SUM(T.FEE_06) / SUM(T.FEE_LAST_12)), 0) * 100, 2) || '%' AS RATE_06,      "+
			"       ROUND(NVL((SUM(T.FEE_07) / SUM(T.FEE_LAST_12)), 0) * 100, 2) || '%' AS RATE_07,      "+
			"       ROUND(NVL((SUM(T.FEE_08) / SUM(T.FEE_LAST_12)), 0) * 100, 2) || '%' AS RATE_08,      "+
			"       ROUND(NVL((SUM(T.FEE_09) / SUM(T.FEE_LAST_12)), 0) * 100, 2) || '%' AS RATE_09,      "+
			"       ROUND(NVL((SUM(T.FEE_10) / SUM(T.FEE_LAST_12)), 0) * 100, 2) || '%' AS RATE_10,      "+
			"       ROUND(NVL((SUM(T.FEE_11) / SUM(T.FEE_LAST_12)), 0) * 100, 2) || '%' AS RATE_11,      "+
			"       ROUND(NVL((SUM(T.FEE_12) / SUM(T.FEE_LAST_12)), 0) * 100, 2) || '%' AS RATE_12       "+
			"  FROM PMRT.TB_MRT_JCDY_ZZCL_YEAR T                                                         "+
			" WHERE 1 = 1                                                                                "+
			"   AND YEAR =" + year; 
	if (regionCode != '') {
		sql += " AND GROUP_ID_1 = '" + regionCode + "'";
	}
	if (orgLevel == 1) {
		orderBy = " ORDER BY GROUP_ID_1";
	} else{
		sql += " AND GROUP_ID_1 = " + region;
	}
	sql += ") T2                                                                     "
		+ " ORDER BY T2.GROUP_ID_1                                                                            ";
	return sql;
}
// ///////////////////////下载开始/////////////////////////////////////////////
function downsAll() {
	var year = $("#time").val();
	var title = [ [ "地市名称", (year - 1) + "年专租线存量收入保有率",
			(year - 1) + "年12月拍照专租线出账收入", year + "年1月拍照专租线保有出账收入",
			year + "年2月拍照专租线保有出账收入", year + "年3月拍照专租线保有出账收入",
			year + "年4月拍照专租线保有出账收入", year + "年5月拍照专租线保有出账收入",
			year + "年6月拍照专租线保有出账收入", year + "年7月拍照专租线保有出账收入",
			year + "年8月拍照专租线保有出账收入", year + "年9月拍照专租线保有出账收入",
			year + "年10月拍照专租线保有出账收入", year + "年11月拍照专租线保有出账收入",
			year + "年12月拍照专租线保有出账收入", year + "年1月拍照专租线保有出账收入保有率",
			year + "年2月拍照专租线保有出账收入保有率", year + "年3月拍照专租线保有出账收入保有率",
			year + "年4月拍照专租线保有出账收入保有率", year + "年5月拍照专租线保有出账收入保有率",
			year + "年6月拍照专租线保有出账收入保有率", year + "年7月拍照专租线保有出账收入保有率",
			year + "年8月拍照专租线保有出账收入保有率", year + "年9月拍照专租线保有出账收入保有率",
			year + "年10月拍照专租线保有出账收入保有率", year + "年11月拍照专租线保有出账收入保有率",
			year + "年12月拍照专租线保有出账收入保有率" ] ];
	var sql = getSql();
	
	var cdata = query("select count(*) total from(" + sql + ")");
	var total = 0;
	if (cdata && cdata.length) {
		total = cdata[0].TOTAL;
	} else {
		return;
	}
	showtext = '专租线存量收入保有率-' + year;
	downloadExcel(sql, title, showtext);
}
// ///////////////////////下载结束/////////////////////////////////////////////

