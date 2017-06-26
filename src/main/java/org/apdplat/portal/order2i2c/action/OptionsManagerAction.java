package org.apdplat.portal.order2i2c.action;

import java.util.HashMap;
import java.util.Map;

import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.Result;
import org.apache.struts2.convention.annotation.Results;
import org.apdplat.module.security.model.Org;
import org.apdplat.module.security.model.User;
import org.apdplat.module.security.service.UserHolder;
import org.apdplat.platform.action.BaseAction;
import org.apdplat.platform.log.APDPlatLogger;
import org.apdplat.portal.order2i2c.service.OptionsManagerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;

@Controller
@Namespace("/optionsManager")
@Scope("prototype")
@Results({
	@Result(name="success", location="/portal/order2i2c/jsp/import_base_list.jsp")
})
@SuppressWarnings("serial")
public class OptionsManagerAction extends BaseAction {
	 @SuppressWarnings("unused")
	private final APDPlatLogger logger = new APDPlatLogger(getClass());

	@Autowired
	private OptionsManagerService service;
	private Map<String, String> resultMap;

	
	public void save() {
		Map<String,String> result=new HashMap<String,String>();
		User user = UserHolder.getCurrentLoginUser();
		Org org=user.getOrg();
		try {
			resultMap.put("regionCode", org.getRegionCode());
			resultMap.put("username", user.getUsername());
			resultMap.put("code", org.getCode());
			service.save(resultMap);
			service.insert(resultMap);
			if(resultMap.get("isAgree").equals("0")){
				if(!resultMap.get("startPhone").equals("")){
					sendSMSCode();
				}
			}
			result.put("state","1");
			result.put("msg", "审批成功！");
		} catch (Exception e) {
			e.printStackTrace();
			result.put("state","0");
			result.put("msg", "审批失败！");
		}
		this.reponseJson(result);
	}
	
	public void sendSMSCode() {
		try{
			User user = UserHolder.getCurrentLoginUser();
			String username=user.getUsername();//审批人
			String content="您在基层的工单由"+username+"审批未通过，请核查处理！";
			HttpSendMessageUtil.sendMessage(resultMap.get("startPhone"), content);
		}catch(Exception e){
			e.printStackTrace();
		}
	}

	public Map<String, String> getResultMap() {
		return resultMap;
	}

	public void setResultMap(Map<String, String> resultMap) {
		this.resultMap = resultMap;
	}
	
	
}
