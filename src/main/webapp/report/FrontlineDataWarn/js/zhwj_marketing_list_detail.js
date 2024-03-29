var nowData = [];
var title=[["账期","分公司","营服名","渠道经理","归属地","宽带账号","用户名","装机地址","联系电话","套餐","入网时间","捆绑手机号码","状态","局站","接入方式","宽带速率","发展渠道","预存款余额"]];		
var field=["DEAL_DATE","GROUP_ID_1_NAME","UNIT_NAME","HQ_NAME","GROUP_ID_2_NAME","DEVICE_NUMBER","CUSTOMER_NAME","STD_6_NAME","CONTACT_PHONE","PRODUCT_NAME","INNET_DATE","DEVICE_NUMBE","STATUS_NAME","EXCH_NAME","INPUT_TYPE","SPEED_M","HQ_CHAN_CODE","ADVANCE_FEE"];
var orderBy = ' ORDER BY GROUP_ID_1,UNIT_ID';
var report = null;
$(function() {
	var orgLevel =$("#orgLevel").val();
	if(orgLevel==2){
		var code =$("#code").val();
		listUnits(code);
	}else{
		$("#unitCode").parent().css({"display":"none"});
		$("#unitCode").parent().prev().css({"display":"none"});
	}
	report = new LchReport({
		title : title,
		field : field,
		css:[/*{gt:3,css:LchReport.RIGHT_ALIGN},{eq:8,css:LchReport.SUM_PART_STYLE}*/],
		rowParams:["ROW_NAME","ROW_ID"],
		content : "content",
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
	var code=$("#code").val();
	var orgLevel=$("#orgLevel").val();
	
	var unitCode=$("#unitCode").val();
	var hqName = $.trim($("#hqName").val());
	var sql="	SELECT T.DEAL_DATE,			"+		//--账期
			"	       T.GROUP_ID_1_NAME,   "+		//--分公司
			"	       T.UNIT_NAME,         "+		//--营服名
			"	       T.HQ_NAME,           "+		//--渠道经理
			"	       T.GROUP_ID_2_NAME,   "+		//--归属地
			"	       T.DEVICE_NUMBER,     "+		//--宽带账号
			"	       T.CUSTOMER_NAME,     "+		//--用户名
			"	       T.STD_6_NAME,        "+		//--装机地址
			"	       T.CONTACT_PHONE,     "+		//--联系电话
			"	       T.PRODUCT_NAME,      "+		//--套餐
			"	       T.INNET_DATE,        "+		//--入网时间
			"	       T.TEL AS DEVICE_NUMBE,"+		//--捆绑号码
			"	       T.STATUS_NAME,       "+		//--状态
			"	       T.EXCH_NAME,         "+		//--局站
			"	       T.INPUT_TYPE,        "+		//--接入方式
			"	       T.SPEED_M,           "+		//--速率
			"	       T.HQ_CHAN_CODE,      "+		//--发展渠道
			"	       T.ADVANCE_FEE        "+		//--预存款余额
			"	FROM PMRT.TAB_MRT_GK_JZYX_MON PARTITION(P"+dealDate+") T "+
			"	WHERE FALG=01 				"+
			"   AND IS_ACCT=1				";


	if(unitCode!=''){
		sql+="  AND  T.UNIT_ID='"+unitCode+"'";
	}
	if(hqName!=''){
		sql+=" AND  T.HQ_NAME LIKE '%"+hqName+"%'";
	}
	
	if(orgLevel==1){
		
	}else if(orgLevel==2){
		sql+=" and t.GROUP_ID_1='"+code+"'";
	}else if(orgLevel==3){
		sql+=" and t.UNIT_ID='"+code+"'";
	}else if(orgLevel==4){
		sql+=" and HR_ID='"+code+"'";
	}else{
		sql+=" and 1=2";
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
	
	var sql=getsql();
	var groupName =$("#groupName").val();
	var title=[["账期","分公司","营服名","渠道经理","归属地","宽带账号","用户名","装机地址","联系电话","套餐","入网时间","捆绑手机号码","状态","局站","接入方式","宽带速率","发展渠道","预存款余额"]];		
		
	showtext ='"'+groupName+'"智慧沃家营销清单-'+dealDate;
	downloadExcel(sql,title,showtext);

}
/////////////////////////下载结束/////////////////////////////////////////////