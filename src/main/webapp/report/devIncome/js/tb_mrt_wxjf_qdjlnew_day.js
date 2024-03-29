var nowData = [];
var title=[["账期","地市","营服中心","渠道编码","渠道名称","HR编码","人员姓名","用户编号","用户号码","办理日期","指标编码","指标描述","指标值","操作员编码","活动编码","活动名称","套餐编码","原始积分","渠道系数","营服系数","渠道调节后的积分","营服调节后积分"]];
var field=["DEAL_DATE","GROUP_ID_1_NAME","UNIT_NAME","HQ_CHAN_CODE","HQ_CHAN_NAME","HR_ID","NAME","USER_NO","DEVICE_NUMBER","ACCT_DATE","ITEMCODE","ITEMDESC","ITEMVALUE","OPERATOR_ID","SCHEME_ID","SCHEME_NAME","PRODUCT_ID","CRE","HQ_RATIO","UNIT_RATIO","HQ_CRE","UNIT_CRE"];
var orderBy = '';
var report = null;
$(function() {
	report = new LchReport({
		title : title,
		field : field,
		css:[{gt:16,css:LchReport.RIGHT_ALIGN}],
		rowParams : [],//第一个为rowId
		content : "lchcontent",
		orderCallBack : function(index, type) {
			orderBy = " order by " + field[index] + " " + type + " ";
			search(0);
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
	var phoneNumber=$("#phoneNumber").val();
	var starttime=$("#starttime").val();
	var endtime=$("#endtime").val();
	var regionCode=$("#regionCode").val();
	var unitCode=$("#unitCode").val();
	var userName=$("#userName").val();
	var itemDesc=$.trim($("#itemDesc").val());
//条件
	var sql = " from PMRT.TB_MRT_WXJF_QDJLNEW_DAY t where 1=1 ";
	sql+=" and t.DEAL_DATE BETWEEN '"+starttime+"' and '"+endtime+"'";
	if(regionCode!=''){
		sql+=" and t.GROUP_ID_1 = '"+regionCode+"'";
	}
	if(unitCode!=''){
		sql+=" AND UNIT_ID IN("+_unit_relation(unitCode)+") ";
	}
	if(userName!=''){
		sql+=" and t.NAME like '%"+userName+"%'";
	}
	if(phoneNumber!=''){
		sql+=" and t.DEVICE_NUMBER like '%"+phoneNumber+"%'";
	}
	if(itemDesc!=''){
		sql+=" and t.ITEMDESC like '%"+itemDesc+"%'";
	}
	
//权限
	var orgLevel=$("#orgLevel").val();
	var code=$("#code").val();
	var hrId=$("#hrId").val();
	if(orgLevel==1){
		
	}else if(orgLevel==2){
		sql+=" and t.GROUP_ID_1="+code;
	}else{
		 var hrIds=_jf_power(hrId,endtime);
		 if(hrIds!=""){
		   sql+=" and t.HR_ID in("+hrIds+") ";
		 }
	}
	
	
	
	var csql = sql;
	var cdata = query("select count(*) total" + csql);
	var total = 0;
	if(cdata && cdata.length) {
		total = cdata[0].TOTAL;
	}else{
		return;
	}

	orderBy=" order by t.deal_date "
	sql += orderBy;

	sql = "select * " + sql;

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
function isNull(obj){
	if(obj==0||obj=='0'){
		return 0;
	}
	if(obj == undefined || obj == null || obj == '') {
		return "";
	}
	return obj;
}
function roundN(number,fractionDigits){   
    with(Math){   
        return round(number*pow(10,fractionDigits))/pow(10,fractionDigits);   
    }   
}   
/////////////////////////下载开始/////////////////////////////////////////////
function downsAll(){
	var sql="";
	var starttime=$("#starttime").val();
	var endtime=$("#endtime").val();
	var regionCode=$("#regionCode").val();
	var unitCode=$("#unitCode").val();
	var userName=$("#userName").val();
	var phoneNumber=$("#phoneNumber").val();
	var itemDesc=$.trim($("#itemDesc").val());
	//条件
	var sql = " from PMRT.TB_MRT_WXJF_QDJLNEW_DAY t where 1=1 ";
	sql+=" and t.DEAL_DATE BETWEEN '"+starttime+"' and '"+endtime+"'";
	if(regionCode!=''){
		sql+=" and t.GROUP_ID_1 = '"+regionCode+"'";
	}
	if(unitCode!=''){
		sql+=" AND UNIT_ID IN("+_unit_relation(unitCode)+") ";
	}
	if(userName!=''){
		sql+=" and t.NAME like '%"+userName+"%'";
	}
	if(phoneNumber!=''){
		sql+=" and t.DEVICE_NUMBER like '%"+phoneNumber+"%'";
	}
	if(itemDesc!=''){
		sql+=" and t.ITEMDESC like '%"+itemDesc+"%'";
	}
	
	//权限
	var orgLevel=$("#orgLevel").val();
	var code=$("#code").val();
	var hrId=$("#hrId").val();
	if(orgLevel==1){
		
	}else if(orgLevel==2){
		sql+=" and t.GROUP_ID_1="+code;
	}else{
	 var hrIds=_jf_power(hrId,endtime);
	 if(hrIds!=""){
		   sql+=" and t.HR_ID in("+hrIds+") ";
	 }
	 }
	//排序
	orderBy=" order by t.deal_date "
	sql += orderBy;

	sql = "select "+field.join(",") + sql;
	
	showtext = ' 渠道经理维系日积分-'+starttime+"-"+endtime;
	downloadExcel(sql,title,showtext);
}
/////////////////////////下载结束/////////////////////////////////////////////