var field=["LJ_JF_TOTAL_S","LJ_JF_QS_S","LJ_JF_DH_S","IS_JF_S","SY_JF_S","LJ_JF_TOTAL_A","LJ_JF_QS_S","LJ_JF_DH_A","IS_JF_A","SY_JF_A","LJ_JF_TOTAL_B","LJ_JF_QS_B","LJ_JF_DH_B","IS_JF_B","SY_JF_B","LJ_JF_TOTAL_C","LJ_JF_QS_C","LJ_JF_DH_C","IS_JF_C","SY_JF_C","LJ_JF_TOTAL_OTHER","LJ_JF_QS_OTHER","LJ_JF_DH_OTHER","IS_JF_OTHER","SY_JF_OTHER","LJ_JF_TOTAL_D"];
var title=[["州市","S","","","","","A","","","","","B","","","","","C","","","","","其他","","","","","D"],["","累计总积分 ","累计清算积分","累计可兑换积分","累计已兑换积分","累计剩余积分","累计总积分 ","累计清算积分","累计可兑换积分","累计已兑换积分","累计剩余积分","累计总积分 ","累计清算积分","累计可兑换积分","累计已兑换积分","累计剩余积分","累计总积分 ","累计清算积分","累计可兑换积分","累计已兑换积分","累计剩余积分","累计总积分 ","累计清算积分","累计可兑换积分","累计已兑换积分","累计剩余积分","累计总积分"]];
var report=null;
$(function(){
	var sumSql=getSumField();
	 report=new LchReport({
		title:title,
		field:["ROW_NAME"].concat(field),
		//css:[{gt:0,css:LchReporRIGHT_ALIGN}],
		rowParams:["ROW_ID","UNIT_ID"],//第一个为rowId
		content:"content",
		getSubRowsCallBack:function($tr){
			var preField='';
			var where=' WHERE INTEGRAL_SUB = 1';
			var groupBy='';
			var code='';
			var orgLevel='';
			var qdate = $("#month").val();
			var hr_id_name = $("#userName").val();
			var regionCode=$("#regionCode").val();
			var unitCode=$("#unitCode").val();
			var orderBy="";
			if($tr){
				code=$tr.attr("row_id");
				orgLevel=parseInt($tr.attr("orgLevel"));
				if(orgLevel==2){
					preField=' group_id_1 ROW_ID,group_id_1_name ROW_NAME';
					groupBy=' group by group_id_1,group_id_1_name ';
					orderBy=" order by group_id_1";
				}else if(orgLevel==3){
					preField=' unit_id ROW_ID,unit_name ROW_NAME';
					groupBy=' group by unit_id,unit_name ';
					where+=' and group_id_1=\''+code+"\' ";
					orderBy=" order by unit_id";
				}else if(orgLevel==4){
					preField=' unit_id,hr_id ROW_ID,hr_id_name ROW_NAME';
					groupBy=' group by unit_id,hr_id,hr_id_name ';
					where+=' and unit_id=\''+code+"\' ";
				}else if(orgLevel==5){
					var unit_id=$tr.attr("unit_id");
					preField=' group_id_4_name ROW_NAME';
					groupBy=' group by group_id_4,group_id_4_name ';
					where+=' and unit_id=\''+unit_id+'\' and hr_id=\''+code+"\' ";
				}else{
					return {data:[],extra:{}};
				}
				orgLevel++;
			}else{
				//先根据用户信息得到前几个字段
				code=$("#code").val();
				orgLevel=$("#orgLevel").val();
				if(orgLevel==1){//省
					preField=" '云南省'  ROW_NAME ";
					groupBy=' group by group_id_0 ';
					orgLevel++;
				}else if(orgLevel==2){//市
					preField=' group_id_1 ROW_ID,group_id_1_name ROW_NAME';
					groupBy=' group by group_id_1,group_id_1_name ';
					where+=' and GROUP_ID_1=\''+code+"\' ";
					orgLevel++;
				}else if(orgLevel==3){//营服中心
					preField=' unit_id ROW_ID,unit_name ROW_NAME';
					groupBy=' group by unit_id,unit_name ';
					where+=" and unit_id IN(SELECT T.OLD_UNIT_ID FROM PCDE.UNIT_HB T WHERE T.UNIT_ID = '"+code+"' UNION ALL SELECT '"+code+"' OLD_UNIT_ID FROM DUAL)";
					orgLevel++;
				}else if(orgLevel==4){//人员
					var hrId = $("#hrId").val();
					preField=' hr_id_name ROW_NAME';
					groupBy=' group by hr_id,hr_id_name ';
					where+=' and hr_id=\''+hrId+"\' ";
					orgLevel++;
				}else{
					return {data:[],extra:{}};
				}
			}	
			var sql='select '+preField+sumSql+' from PMRT.TAB_MRT_INTEGRAL_DEV_REPORT ';
						
			where+=' and DEAL_DATE='+qdate+' ';
			if(regionCode!=''){
				where+=" and GROUP_ID_1 = '"+regionCode+"'";
			}
			if(unitCode!=''){
				where+=" AND UNIT_ID IN("+_unit_relation(unitCode)+") ";
			}
			if(hr_id_name!=''){
				where+=" and HR_ID_NAME = '"+hr_id_name+"'";
			}
			sql+=where+groupBy+orderBy;
			var d=query(sql);
			
			return {data:d,extra:{orgLevel:orgLevel}};
		}
	});
    report.showSubRow();
	$("#lch_DataHead").find("TH").unbind();
	$("#lch_DataHead").find(".sub_on,.sub_off").remove();
	///////////////////////////////////////////
	$(".page_count").width($("#lch_DataHead").width());
	
	$("#searchBtn").click(function(){
	    report.showSubRow();
		$("#lch_DataHead").find("TH").unbind();
		$("#lch_DataHead").find(".sub_on,.sub_off").remove();
		///////////////////////////////////////////
		$(".page_count").width($("#lch_DataHead").width());
	});
});

/////////////////////////下载开始/////////////////////////////////////////////
function downsAll() {
	var qdate = $.trim($("#month").val());
	var preField=' group_id_1_name,unit_name,hr_id_name,group_id_4_name,fd_chnl_id';
	var where=' WHERE INTEGRAL_SUB = 1';
	var orderBy=" order by group_id_1,unit_id,hr_id,group_id_4 ";
	var hr_id_name = $("#userName").val();
	var regionCode=$("#regionCode").val();
	var unitCode=$("#unitCode").val();
	var groupBy=" group by group_id_1,group_id_1_name,unit_id,unit_name,hr_id,hr_id_name,group_id_4,group_id_4_name,fd_chnl_id";
	var fieldSql=getSumField();
		
	//先根据用户信息得到前几个字段
	var code = $("#code").val();
	var orgLevel = $("#orgLevel").val();
	if (orgLevel == 1) {//省
		
	} else if (orgLevel == 2) {//市
		where += " AND GROUP_ID_1='" + code + "' ";
	} else if (orgLevel == 3) {//营服中心
		where += " AND unit_id IN(SELECT T.OLD_UNIT_ID FROM PCDE.UNIT_HB T WHERE T.UNIT_ID = '"+code+"' UNION ALL SELECT '"+code+"' OLD_UNIT_ID FROM DUAL)";
	} else if (orgLevel == 4) {//
		where += " AND hr_id='" + hrId + "' ";
	}
	where+=' and DEAL_DATE='+qdate+' ';
	if(regionCode!=''){
		where+=" AND GROUP_ID_1 = '"+regionCode+"'";
	}
	if(unitCode!=''){
		where+=" AND UNIT_ID IN("+_unit_relation(unitCode)+") ";
	}
	if(hr_id_name!=''){
		where+=" AND HR_ID_NAME = '"+hr_id_name+"'";
	}
	var sql = 'SELECT ' + preField + fieldSql
			+ ' FROM PMRT.TAB_MRT_INTEGRAL_DEV_REPORT ';
	sql += where+groupBy+orderBy;
	showtext = '累计汇总报表' + qdate;
	var title=[["地市","营服中心","人员","渠道","渠道编码","S","","","","","A","","","","","B","","","","","C","","","","","其他","","","","","D"],["","","","","","累计总积分 ","累计清算积分","累计可兑换积分","累计已兑换积分","累计剩余积分","累计总积分 ","累计清算积分","累计可兑换积分","累计已兑换积分","累计剩余积分","累计总积分 ","累计清算积分","累计可兑换积分","累计已兑换积分","累计剩余积分","累计总积分 ","累计清算积分","累计可兑换积分","累计已兑换积分","累计剩余积分","累计总积分 ","累计清算积分","累计可兑换积分","累计已兑换积分","累计剩余积分","累计总积分"]];
	downloadExcel(sql,title,showtext);
}
////////////////////////////////////////////////////////////////////////
function getSumField(){
	var fs = ",SUM(CASE WHEN integral_grade = 'S'  "+
	"  THEN                              "+
	"     nvl(LJ_JF_TOTAL,0)             "+
	"     ELSE                           "+
	"       0                            "+
	"END)  LJ_JF_TOTAL_S                 "+
	",SUM(CASE WHEN integral_grade = 'S' "+
	"  THEN                              "+
	"     nvl(LJ_JF_QS,0)                "+
	"      ELSE                          "+
	"       0                            "+
	"END)  LJ_JF_QS_S                    "+
	",SUM(CASE WHEN integral_grade = 'S' "+
	"  THEN                              "+
	"     nvl(LJ_JF_DH,0)                "+
	"      ELSE                          "+
	"       0                            "+
	"END)  LJ_JF_DH_S                    "+
	",SUM(CASE WHEN integral_grade = 'S' "+
	"  THEN                              "+
	"    nvl(IS_JF,0)                    "+
	"     ELSE                           "+
	"       0                            "+
	"END)  IS_JF_S                       "+
	",SUM(CASE WHEN integral_grade = 'S' "+
	"  THEN                              "+
	"   nvl(LJ_JF_DH,0) -  nvl(IS_JF,0)  "+
	"    ELSE                            "+
	"       0                            "+
	"END)  SY_JF_S                       "+
	",SUM(CASE WHEN integral_grade = 'A' "+
	"  THEN                              "+
	"     nvl(LJ_JF_TOTAL,0)             "+
	"     ELSE                           "+
	"       0                            "+
	"END)  LJ_JF_TOTAL_A                 "+
	",SUM(CASE WHEN integral_grade = 'A' "+
	"  THEN                              "+
	"     nvl(LJ_JF_QS,0)                "+
	"      ELSE                          "+
	"       0                            "+
	"END)  LJ_JF_QS_A                    "+
	",SUM(CASE WHEN integral_grade = 'A' "+
	"  THEN                              "+
	"     nvl(LJ_JF_DH,0)                "+
	"      ELSE                          "+
	"       0                            "+
	"END)  LJ_JF_DH_A                    "+
	",SUM(CASE WHEN integral_grade = 'A' "+
	"  THEN                              "+
	"    nvl(IS_JF,0)                    "+
	"     ELSE                           "+
	"       0                            "+
	"END)  IS_JF_A                       "+
	",SUM(CASE WHEN integral_grade = 'A' "+
	"  THEN                              "+
	"   nvl(LJ_JF_DH,0) -  nvl(IS_JF,0)  "+
	"    ELSE                            "+
	"       0                            "+
	"END)  SY_JF_A                       "+
	",SUM(CASE WHEN integral_grade = 'B' "+
	"  THEN                              "+
	"     nvl(LJ_JF_TOTAL,0)             "+
	"     ELSE                           "+
	"       0                            "+
	"END)  LJ_JF_TOTAL_B                 "+
	",SUM(CASE WHEN integral_grade = 'B' "+
	"  THEN                              "+
	"     nvl(LJ_JF_QS,0)                "+
	"      ELSE                          "+
	"       0                            "+
	"END)  LJ_JF_QS_B                    "+
	",SUM(CASE WHEN integral_grade = 'B' "+
	"  THEN                              "+
	"     nvl(LJ_JF_DH,0)                "+
	"      ELSE                          "+
	"       0                            "+
	"END)  LJ_JF_DH_B                    "+
	",SUM(CASE WHEN integral_grade = 'B' "+
	"  THEN                              "+
	"    nvl(IS_JF,0)                    "+
	"     ELSE                           "+
	"       0                            "+
	"END)  IS_JF_B                       "+
	",SUM(CASE WHEN integral_grade = 'B' "+
	"  THEN                              "+
	"   nvl(LJ_JF_DH,0) -  nvl(IS_JF,0)  "+
	"    ELSE                            "+
	"       0                            "+
	"END)  SY_JF_B                       "+
	",SUM(CASE WHEN integral_grade = 'C' "+
	"  THEN                              "+
	"     nvl(LJ_JF_TOTAL,0)             "+
	"     ELSE                           "+
	"       0                            "+
	"END)  LJ_JF_TOTAL_C                 "+
	",SUM(CASE WHEN integral_grade = 'C' "+
	"  THEN                              "+
	"     nvl(LJ_JF_QS,0)                "+
	"      ELSE                          "+
	"       0                            "+
	"END)  LJ_JF_QS_C                    "+
	",SUM(CASE WHEN integral_grade = 'C' "+
	"  THEN                              "+
	"     nvl(LJ_JF_DH,0)                "+
	"      ELSE                          "+
	"       0                            "+
	"END)  LJ_JF_DH_C                    "+
	",SUM(CASE WHEN integral_grade = 'C' "+
	"  THEN                              "+
	"    nvl(IS_JF,0)                    "+
	"     ELSE                           "+
	"       0                            "+
	"END)  IS_JF_C                       "+
	",SUM(CASE WHEN integral_grade = 'C' "+
	"  THEN                              "+
	"   nvl(LJ_JF_DH,0) -  nvl(IS_JF,0)  "+
	"    ELSE                            "+
	"       0                            "+
	"END)  SY_JF_C                       "+
	",SUM(CASE WHEN integral_grade = '待评' "+
	"  THEN                              "+
	"     nvl(LJ_JF_TOTAL,0)             "+
	"     ELSE                           "+
	"       0                            "+
	"END)  LJ_JF_TOTAL_OTHER             "+
	",SUM(CASE WHEN integral_grade = '待评' "+
	"  THEN                              "+
	"     nvl(LJ_JF_QS,0)                "+
	"      ELSE                          "+
	"       0                            "+
	"END)  LJ_JF_QS_OTHER                "+
	",SUM(CASE WHEN integral_grade = '待评'"+
	"  THEN                              "+
	"     nvl(LJ_JF_DH,0)                "+
	"      ELSE                          "+
	"       0                            "+
	"END)  LJ_JF_DH_OTHER                "+
	",SUM(CASE WHEN integral_grade = '待评'"+
	"  THEN                              "+
	"    nvl(IS_JF,0)                    "+
	"     ELSE                           "+
	"       0                            "+
	"END)  IS_JF_OTHER                   "+
	",SUM(CASE WHEN integral_grade = '待评'"+
	"  THEN                              "+
	"   nvl(LJ_JF_DH,0) -  nvl(IS_JF,0)  "+
	"    ELSE                            "+
	"       0                            "+
	"END)  SY_JF_OTHER                   "+
	",SUM(CASE WHEN integral_grade = 'D' "+
	"  THEN                              "+
	"     nvl(LJ_JF_TOTAL,0)             "+
	"     ELSE                           "+
	"       0                            "+
	"END)  LJ_JF_TOTAL_D                 ";
	return fs;
}