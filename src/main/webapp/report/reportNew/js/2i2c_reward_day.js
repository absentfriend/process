var nowData = [];
var report = null;
var orderBy='';
var field=["GROUP_ID_1_NAME","UNIT_NAME","NAME","PHONE" ,"HR_ID" ,"OPEN_PERSON_CODE" ,"HQ_CHAN_NAME" ,"HQ_CHAN_CODE" ,"CHNL_TYPE" ,"PROMOTION_FEE" ,"FIRST_REWARD" ,"EMP_TYPE"];
var title=[["州市","区县/营服","发展人姓名","发展人电话","发展人HR编码","发展人编码","渠道名称","渠道编码","发展渠道类型","推广费","首充激励","用工性质"]];
$(function() {
	report = new LchReport({
		title : title,
		field : field,
		css:[{gt:1,css:LchReport.RIGHT_ALIGN}],
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
	var code=$("#code").val();
	var region=$("#region").val();
	var orgLevel=$("#orgLevel").val();
	var hr_id=$("#hr_id").val();
	var dealDate=$("#dealDate").val();
	var regionCode=$("#regionCode").val();
	var hqChanlCode=$("#hqChanlCode").val();
	var hrId=$("#hrId").val();
	var userName=$("#userName").val();
	var dealDate1=dealDate.substr(0,6);
	
	//权限
	var where = "WHERE ACCT_DATE = '"+dealDate+"'";
	if(orgLevel==1){

	}else if(orgLevel==2){
		where += " AND GROUP_ID_1 =" + code;
	}else{
		where += " AND HR_ID IN (SELECT PORTAL.HR_PERM('"+hr_id+"', '"+dealDate1+"') FROM DUAL)";
	}
	//条件
	if(regionCode!=''){
		where+= " AND GROUP_ID_1 ='"+regionCode+"'";
	}
	if(hqChanlCode!=''){
		where+=" AND HQ_CHAN_CODE LIKE '%"+hqChanlCode+"%'";
	}
	if(hrId!=''){
		where+=" AND HR_ID LIKE '%"+hrId+"%'";
	}
	if(userName!=''){
		where+= " AND NAME LIKE '%"+userName+"%'";
	}
		
	var sql=getSql();
	sql+=where;
	downSql=sql;
	
	var cdata = query("select count(*) total from(" + sql+")");
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
	//$("#lch_DataHead").find("TH").unbind();
	//$("#lch_DataHead").find(".sub_on,.sub_off,.space").remove();
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
	var sql="SELECT                    "+
	"nvl(GROUP_ID_1_NAME,'--') GROUP_ID_1_NAME,                               "+
	"nvl(UNIT_NAME,'--') UNIT_NAME,                         "+
	"NAME,                               "+
	"PHONE,                                   "+
	"HR_ID,                                    "+
	"OPEN_PERSON_CODE,                                "+
	"HQ_CHAN_CODE,                                 "+
	"HQ_CHAN_NAME,                             "+
	"CHNL_TYPE,                              "+
	"PROMOTION_FEE,                            "+
	"FIRST_REWARD,                               "+
	"EMP_TYPE                            "+
	"FROM PMRT.VIEW_HLW_OUTLINE_USER ";
	return sql;
}

/////////////////////////下载开始/////////////////////////////////////////////
function downsAll(){
	
	showtext = "2I2C全省地推奖励日报";
	downloadExcel(downSql,title,showtext);
}
/////////////////////////下载结束/////////////////////////////////////////////
