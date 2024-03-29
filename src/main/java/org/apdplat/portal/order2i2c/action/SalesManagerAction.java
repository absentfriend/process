package org.apdplat.portal.order2i2c.action;

import java.sql.CallableStatement;
import java.sql.Connection;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import javax.annotation.Resource;
import javax.sql.DataSource;

import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.Result;
import org.apache.struts2.convention.annotation.Results;
import org.apdplat.module.security.model.Org;
import org.apdplat.module.security.model.User;
import org.apdplat.module.security.service.UserHolder;
import org.apdplat.platform.action.BaseAction;
import org.apdplat.platform.log.APDPlatLogger;
import org.apdplat.portal.order2i2c.service.SalesManagerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;

@Controller
@Namespace("/salesManager")
@Scope("prototype")
@Results({
	@Result(name="success", location="/portal/channelManagement/jsp/sales_manager_list.jsp")
})
@SuppressWarnings("serial")
public class SalesManagerAction extends BaseAction {
	 @SuppressWarnings("unused")
	private final APDPlatLogger logger = new APDPlatLogger(getClass());

	@Autowired
	private SalesManagerService service;
	private Map<String, String> resultMap;
	
	@Resource
	DataSource dataSource;
	
	public void save() {
		Map<String,String> result=new HashMap<String,String>();
		User user = UserHolder.getCurrentLoginUser();
		Org org=user.getOrg();
		try {
			resultMap.put("regionCode", org.getRegionCode());
			resultMap.put("username", user.getUsername());
			resultMap.put("code", org.getCode());
			String order_code=resultMap.get("order_code");
			SimpleDateFormat s=new SimpleDateFormat("yyyyMMdd HH:mm");
			resultMap.put("create_time", s.format(new Date()));
			if(order_code!=null&&!order_code.equals("")){//换机或退货修改原来数据状态，换机再增加一条并保留工单编号
				service.update(resultMap);
				if(resultMap.get("is_back").equals("1")){//换机
					
				}else{//2退货,不新增记录 库存恢复为可销售状态0
					result.put("state","1");
					result.put("msg", "退货成功！");
					resultMap.put("is_back", "0");
					service.updateSalesStatus(resultMap);
					resultMap.put("bakStatus", "01");
					service.updateBackBak(resultMap);//记录到新老对应表
					this.reponseJson(result); 
					//callPre();
					return;
				}
			}else{
				SimpleDateFormat format = new SimpleDateFormat("yyyyMMddHHssSSS");
				String time = format.format(new Date());
				String businessKey = "YN-"+time; //订单编号
				resultMap.put("order_code", businessKey);
			}
			service.insert(resultMap);
			if(resultMap.get("is_back").equals("0")){//正常销售完,更改库存为已销售1
				resultMap.put("is_back", "1");
			}else if(resultMap.get("is_back").equals("1")){//换机，库存恢复为可销售状态0
				resultMap.put("bakStatus", "02");
				service.updateBackBak(resultMap);//记录到新老对应表
				resultMap.put("is_back", "0");
				resultMap.put("zd_iemi", resultMap.get("old_zd_iemi"));
			}
			service.updateSalesStatus(resultMap);
			result.put("state","1");
			result.put("msg", "操作成功！");
			//callPre();
		} catch (Exception e) {
			e.printStackTrace();
			result.put("state","0");
			result.put("msg", "操作失败！");
		}
		this.reponseJson(result);
	}

	public String callPre() throws Exception{
		Connection conn =null;
		CallableStatement stmt=null;
		conn = dataSource.getConnection();
		stmt = conn.prepareCall("{CALL PMRT.PRC_MRT_YYT_ZD_REPORT(?,?)}");
		SimpleDateFormat s=new SimpleDateFormat("yyyyMMdd");
		stmt.setString(1,s.format(new Date()));
		stmt.registerOutParameter(2,java.sql.Types.VARCHAR);
		stmt.executeUpdate();
		String r=stmt.getString(2);
		return "success";
	}
	public Map<String, String> getResultMap() {
		return resultMap;
	}

	public void setResultMap(Map<String, String> resultMap) {
		this.resultMap = resultMap;
	}
	
}
