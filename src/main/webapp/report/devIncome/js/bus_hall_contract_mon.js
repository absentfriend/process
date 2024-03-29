var title="";
var field="";
$(function(){
	$("#dealDate").val(getMaxDate("PMRT.TB_MRT_BUS_HALL_HY_DEV_HZ"));
	search();
	$("#searchBtn").click(function(){
		$("#searchForm").find("TABLE").find("TR:eq(0)").find("TD:last").remove();
		search();
	});
});
function search(){
	var dealDate=$("#dealDate").val();
		//省，地市
		title=[["组织架构","经营模式","自有厅","","","","","","全渠道","","","","",""],
		       ["","","合约办理量本月累计","环比","其中套餐96以上占比","其中：存费送机","其中：合约惠机","其中：沃享4G自备机","合约办理量本月累计","环比","其中套餐96以上占比","其中：存费送机","其中：合约惠机","其中：沃享4G自备机"]
			];
		field=["OPERATE_TYPE","ZYT_HY_NUM","ZYT_HY_HB","ZYT_HY_ZB","ZYT_CFSJ","ZYT_HYHJ","ZYT_WX4G_ZBJ","QQD_HY_NUM","QQD_HY_HB","QQD_HY_ZB","QQD_CFSJ","QQD_HYHJ","QQD_WX4G_ZBJ"];
		//营业厅
	/*	title=[["组织架构","经营模式","自有厅移动网活跃用户数","","","其中自有厅CBSS套餐活跃用户数","","","其中自有厅3G套餐活跃用户数","","","其中自有厅2G套餐活跃用户数","",""],
		       ["","","本月","本月较上月增减","增减变化","本月","本月较上月增减","增减变化","本月","本月较上月增减","增减变化","本月","本月较上月增减","增减变化"]];
		field=["OPERATE_TYPE","THIS_YM_NUM","ZJ_YW_NUM","HB_YW","THIS_4G_NUM","ZJ_4G_NUM","HB_4G","THIS_3G_NUM","ZJ_3G_NUM","HB_3G","THIS_2G_NUM","ZJ_2G_NUM","HB_2G"];*/
	var report=new LchReport({
		title:title,
		field:["ROW_NAME"].concat(field),
		css:[{gt:0,css:LchReport.RIGHT_ALIGN}],
		rowParams:["ROW_ID"],//第一个为rowId
		content:"content",
		orderCallBack:function(index,type){
			
		},afterShowSubRows:function(){
			//$("#lch_DataBody").find("TR").find("TD:gt(0)").css({textAlign:"right"});
		},
		getSubRowsCallBack:function($tr){
			var preField='';
			var code='';
			var orgLevel='';
			var region =$("#region").val();
			var chanlCode = $("#chanlCode").val();
			var regionCode=$("#regionCode").val();
			var operateType=$("#operateType").val();
			var where=' WHERE DEAL_DATE='+dealDate;
			var flag=1;
			if(chanlCode!=""){
				flag=2;
			}
			if($tr){
				code=$tr.attr("row_id");
				orgLevel=parseInt($tr.attr("orgLevel"));
				if(orgLevel==2){//点击省
					flag=2;
					preField=' HQ_CHAN_CODE AS ROW_ID,BUS_HALL_NAME AS ROW_NAME'+
							"  ,OPERATE_TYPE                        "+		//
					    	"  ,ZYT_HY_NUM       					"+		//--本月合约办理量       
					    	"  ,ZYT_HY_HB        					"+		//--环比
					    	"  ,ZYT_HY_ZB        					"+		//--其中套餐96以上占比
					    	"  ,ZYT_CFSJ         					"+		//--其中：存废送机
					    	"  ,ZYT_HYHJ         					"+		//--其中合约惠机
					    	"  ,ZYT_WX4G_ZBJ     					"+		//--其中：沃享4G自备机 
					    	" FROM PMRT.TB_MRT_BUS_HALL_HY_DEV_HZ   ";		//
				   where+= "  AND GROUP_ID_1= '"+code+"' AND FLAG = "+flag ;
				}else{
					return {data:[],extra:{}}
				}
				orgLevel++;
			}else{
				//先根据用户信息得到前几个字段
				code=$("#code").val();
				orgLevel=$("#orgLevel").val();
				if(orgLevel==1){//省
					preField=' GROUP_ID_1  AS ROW_ID ,GROUP_ID_1_NAME  AS ROW_NAME'+getSumSql();
					where+=" AND FLAG= "+flag ;
					orgLevel=2;
				}else if(orgLevel==2||orgLevel==3){//市
					preField=' GROUP_ID_1  AS ROW_ID ,GROUP_ID_1_NAME  AS ROW_NAME'+getSumSql();
					where=' AND GROUP_ID_1=\''+region+'\' AND FLAG='+flag ;
					orgLevel=2;
				}else{
					return {data:[],extra:{}};
				}
			}
			if(regionCode!=""){
				where+=" AND GROUP_ID_1='"+regionCode+"'";
			}
			if(operateType!=""){
				where+=" AND OPERATE_TYPE='"+operateType+"'";
			}
			if(chanlCode!=""){
				where += " AND HQ_CHAN_CODE ='"+chanlCode+"' ";
			}
			var sql='SELECT'+preField+where;
			var d=query(sql);
			return {data:d,extra:{orgLevel:orgLevel}};
		}
	});
	report.showSubRow();
    ///////////////////////////////////////////
	$("#lch_DataHead").find("TH").unbind();
	$("#lch_DataHead").find(".sub_on,.sub_off,.space").remove();
	///////////////////////////////////////////
}
function getSumSql() {
	 var s="  ,'--' AS  OPERATE_TYPE                    "+		//
		   "  ,ZYT_HY_NUM       						"+	//--本月合约办理量       
		   "  ,ZYT_HY_HB        						"+	//--环比
		   "  ,ZYT_HY_ZB        						"+	//--其中套餐96以上占比
		   "  ,ZYT_CFSJ         						"+	//--其中：存废送机
		   "  ,ZYT_HYHJ         						"+	//--其中合约惠机
		   "  ,ZYT_WX4G_ZBJ     						"+	//--其中：沃享4G自备机
		   "  ,QQD_HY_NUM       						"+	//--本月合约办理量 
		   "  ,QQD_HY_HB        						"+	//--环比
		   "  ,QQD_HY_ZB        						"+	//--其中套餐96以上占比
		   "  ,QQD_CFSJ         						"+	//--其中：存废送机
		   "  ,QQD_HYHJ         						"+	//--其中合约惠机
		   "  ,QQD_WX4G_ZBJ     						"+	//--其中：沃享4G自备机
		   " FROM   PMRT.TB_MRT_BUS_HALL_HY_DEV_HZ      ";	//
		return s;
}

function downsAll() {
	var orderBy=" ORDER BY GROUP_ID_1,HQ_CHAN_CODE";
	//先根据用户信息得到前几个字段
	var orgLevel=$("#orgLevel").val();
	var dealDate=$("#dealDate").val();
	var region =$("#region").val();
	var chanlCode = $("#chanlCode").val();
	var regionCode=$("#regionCode").val();
	var operateType=$("#operateType").val();
	var where ="";
	var preField = 	" SELECT GROUP_ID_1_NAME,               "+
					"        BUS_HALL_NAME,                 "+
					"        HQ_CHAN_CODE,                  "+
					"        OPERATE_TYPE,                  "+
					"        ZYT_HY_NUM,                    "+
					"        ZYT_HY_HB,                     "+
					"        ZYT_HY_ZB,                     "+
					"        ZYT_CFSJ,                      "+
					"        ZYT_HYHJ,                      "+
					"        ZYT_WX4G_ZBJ                   "+
					"   FROM PMRT.TB_MRT_BUS_HALL_HY_DEV_HZ "+
					"  WHERE FLAG = 02                      "+
					"    AND DEAL_DATE = '"+dealDate+"'     ";
	if (orgLevel == 1) {//省
		
	} else {//市或者其他层级
		where = " AND T1.GROUP_ID_1='" + region + "' ";
	} 
	if(regionCode!=""){
		where+=" AND GROUP_ID_1='"+regionCode+"'";
	}
	if(operateType!=""){
		where+=" AND OPERATE_TYPE='"+operateType+"'";
	}
	if(chanlCode!=""){
		where += " AND HQ_CHAN_CODE ='"+chanlCode+"' ";
	}
	var sql = preField + where+orderBy;
	var showtext = '营业厅合约月报表' + dealDate;
	title=[["分公司","营业厅","渠道编码","经营模式","合约办理量本月累计","环比","其中套餐96以上占比","其中：存费送机","其中：合约惠机","其中：沃享4G自备机"]];
	downloadExcel(sql,title,showtext);
}
