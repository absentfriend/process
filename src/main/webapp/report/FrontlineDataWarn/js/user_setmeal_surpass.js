var nowData = [];
var title=[
           ["分公司","区县","营服名","渠道经理","超套用户清单(在网时长在三个月以上且语音、流量适配度>1.1的出账用户)","","","","","","","","","","","","","","",""],
           ["","","","","渠道名称","渠道编码","用户名称","用户ID","用户号码","现用套餐","推荐套餐","入网时间","状态","状态变化时间","近三月平均出账收入","近三月平均流量","仅三月平均主叫语音","语音套餐适配度","流量套餐适配度","客户姓名"]
           ];		
var field=["DEAL_DATE","GROUP_ID_1_NAME","UNIT_NAME","HR_ID_NAME","HQ_CHNL_NAME","HQ_CHNL_CODE","USER_NAME","SUBSCRIPTION_ID","SERVICE_NUM","PRODUCT_NAME","TJ_PRODUCT_NAME","INNET_DATE","STATUS_NAME","STATUS_CHANGE_DATE","GAV_INCOME","GAV_FLOW","GAV_CALLING","MATCH_CALL","MATCH_FLOW","CUSTOMER_NAME"];
var orderBy = ' ORDER BY GROUP_ID_1,UNIT_ID';
var report = null;
$(function() {
	listRegions();
	report = new LchReport({
		title : title,
		field : field,
		css:[{gt:3,css:LchReport.RIGHT_ALIGN}/*,{eq:8,css:LchReport.SUM_PART_STYLE}*/],
		rowParams : [/*"HR_NO","USER_NAME"*/],//第一个为rowId
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
	//获得查询sql
	var sql = getsql();
	
	var csql = sql;
	var cdata = query("select count(*) total FROM(" + csql+")");
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


function getsql(){
	var dealDate=$("#dealDate").val();
	
	var regionCode=$("#regionCode").val();
	var unitCode=$("#unitCode").val();
	var hqName = $.trim($("#hqName").val());
	//权限
	var orgLevel=$("#orgLevel").val();
	var code=$("#code").val();
	var sql=" SELECT                                                                "+	
			" 	 T.DEAL_DATE,                                                       "+	//--账期
			" 	 T.GROUP_ID_1_NAME, 											    "+	//--分公司
			" 	 T.UNIT_NAME,       											    "+	//--营服名
			" 	 T.HR_ID_NAME,      											    "+	//--渠道经理
			" 	 T.HQ_CHNL_NAME,    											    "+	//--渠道名
			" 	 T.HQ_CHNL_CODE,    											    "+	//--渠道编码
			" 	 T.USER_NAME,       											    "+	//--用户名称
			" 	 T.SUBSCRIPTION_ID, 											    "+	//--用户ID
			" 	 T.SERVICE_NUM,     											    "+	//--用户号码
			" 	 T.PRODUCT_NAME,    											    "+	//--现用套餐
			" 	 T.TJ_PRODUCT_NAME, 											    "+	//--推荐套餐
			" 	 T.INNET_DATE,      											    "+	//--入网时间
			" 	 T.STATUS_NAME ,     												"+	//--状态
			" 	 T.STATUS_CHANGE_DATE, 										 	    "+	//--状态变化时间
			" 	 T.GAV_INCOME,         										 	    "+	//--近三月平均出账收入
			" 	 T.GAV_FLOW,           										 	    "+	//--近三月平均流量
			" 	 T.GAV_CALLING,        										 	    "+	//--近三月平均主叫语音
			" 	 T.MATCH_CALL,         										 	    "+	//--语音套餐适配度
			" 	 T.MATCH_FLOW,         										 	    "+	//--流量套餐适配度
			" 	 T.CUSTOMER_NAME       										 	    "+	//--客户名
			" FROM PMRT.TAB_MRT_SUPER_PRODUCT_USER_MON PARTITION (P"+dealDate+")  T "+
			" WHERE 1 = 1";

	if(regionCode!=''){
		sql+=" AND  T.GROUP_ID_1='"+regionCode+"'";
	}
	if(unitCode!=''){
		sql+="  AND  T.UNIT_ID='"+unitCode+"'";
	}
	if(hqName!=''){
		sql+=" AND  T.HR_ID_NAME LIKE '%"+hqName+"%'";
	}
	
	if(orgLevel==1){
		
	}else if(orgLevel==2){
		sql+=" and t.GROUP_ID_1='"+code+"'";
	}else if(orgLevel==3){
		sql+=" and t.UNIT_ID='"+code+"'";
	}else{
		sql+=" 1=2";
	}
	
	return sql;
}

///////////////////////////地市查询///////////////////////////////////////
function listRegions(){
    var sql=" SELECT DISTINCT T.GROUP_ID_1,T.GROUP_ID_1_NAME FROM PCDE.TB_CDE_REGION_CODE  T WHERE GROUP_ID_1 NOT IN('86000','16099') ";
    var orgLevel=$("#orgLevel").val();
    var code=$("#code").val();
    var region =$("#region").val();
    if(orgLevel==1){
        sql+="";
    }else if(orgLevel==2){
        sql+=" and T.GROUP_ID_1='"+code+"'";
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
    var sql = "SELECT  DISTINCT T.UNIT_ID,T.UNIT_NAME FROM PCDE.TAB_CDE_GROUP_CODE T  WHERE 1=1 ";
    if(region!=''){
        sql+=" AND T.GROUP_ID_1='"+region+"' ";
        //权限
        var orgLevel=$("#orgLevel").val();
        var code=$("#code").val();
        /**查询营服中心编码条件是有地市编码，***/
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

/////////////////////////下载开始/////////////////////////////////////////////
function downsAll(){
	var dealDate=$("#dealDate").val();

	var sql = getsql();
	var title=[
	           ["分公司","区县","营服名","渠道经理","超套用户清单(在网时长在三个月以上且语音、流量适配度>1.1的出账用户)","","","","","","","","","","","","","","",""],
	           ["","","","","渠道名称","渠道编码","用户名称","用户ID","用户号码","现用套餐","推荐套餐","入网时间","状态","状态变化时间","近三月平均出账收入","近三月平均流量","仅三月平均主叫语音","语音套餐适配度","流量套餐适配度","客户姓名"]
	           ];		
	showtext = '超套用户清单-'+dealDate;
	downloadExcel(sql,title,showtext);
}
/////////////////////////下载结束/////////////////////////////////////////////