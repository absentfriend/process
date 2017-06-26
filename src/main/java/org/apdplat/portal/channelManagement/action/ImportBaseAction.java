package org.apdplat.portal.channelManagement.action;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.sql.CallableStatement;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletResponse;
import javax.sql.DataSource;

import org.apache.poi.hssf.usermodel.HSSFCell;
import org.apache.poi.hssf.usermodel.HSSFDateUtil;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.ss.usermodel.WorkbookFactory;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.apache.struts2.ServletActionContext;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.Result;
import org.apache.struts2.convention.annotation.Results;
import org.apdplat.module.security.model.Org;
import org.apdplat.module.security.model.User;
import org.apdplat.module.security.service.UserHolder;
import org.apdplat.platform.action.BaseAction;
import org.apdplat.platform.util.Struts2Utils;
import org.apdplat.wgreport.common.SpringManager;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;

@SuppressWarnings("serial")
@Controller
@Namespace("/base")
@Scope("prototype")
@Results({
	@Result(name="success", location="/portal/channelManagement/jsp/import_base_list.jsp"),
	@Result(name="error", location="/portal/channelManagement/jsp/import_base.jsp")
})
public class ImportBaseAction extends BaseAction {
	private File uploadFile;

	@Resource
	DataSource dataSource;

	public void importToResult() throws SQLException {
		    User user = UserHolder.getCurrentLoginUser();
		    Org org=user.getOrg();
		    String regionCode=org.getRegionCode();
			String delRepeat = "DELETE PMRT.TAB_MRT_YYT_ZD_BASE WHERE GROUP_ID_1='"+ regionCode+"' AND IS_YES=0";
			SpringManager.getUpdateDao().update(delRepeat);
			String importToResult = "INSERT INTO PMRT.TAB_MRT_YYT_ZD_BASE SELECT * FROM PMRT.TAB_MRT_YYT_ZD_BASE_TEMP WHERE GROUP_ID_1='"+ regionCode+"' AND IS_YES IS NULL";
			SpringManager.getUpdateDao().update(importToResult);
			Connection conn =null;
			CallableStatement stmt=null;
			//调用存储过程
			conn = dataSource.getConnection();
			Date date=new Date();
			SimpleDateFormat ss=new SimpleDateFormat("yyyymm");
			String mon=ss.format(date);
			stmt = conn.prepareCall("{CALL PMRT.PRC_MRT_YYT_ZD(?,?,?)}");
			stmt.setString(1,org.getRegionCode());
			stmt.setString(2,mon);
			stmt.registerOutParameter(3,java.sql.Types.DECIMAL);
			stmt.executeUpdate();
			conn.close();
			stmt.close();
	}
	
	public String importToTemp() {
		User user = UserHolder.getCurrentLoginUser();
		Org org=user.getOrg();
		String regionCode=org.getRegionCode();
		String regionName=org.getRegionName();
		String username=user.getUsername();
		List<String> err = new ArrayList<String>();
		String resultTableName = "PMRT.TAB_MRT_YYT_ZD_BASE_TEMP";
		String field="CREATE_TIME,GROUP_ID_1,GROUP_ID_1_NAME,USER_NAME,ZD_BRAND,ZD_TYPES,ZD_MEMORY,ZD_COLOR,ZD_IEMI,YYT_HQ_NAME,YYT_CHAN_CODE,SUP_HQ_NAME,SUP_HQ_CODE,IN_PRICE,OUT_PRICE";
		if (uploadFile == null) {
			err.add("上传文件为空！");
			Struts2Utils.getRequest().setAttribute("err", err);
			return "error";
		} else {
			FileInputStream in =null;
		    Workbook wb = null;
			Connection conn = null;
			PreparedStatement pre = null;
			try {
				conn = this.getCon();
				conn.setAutoCommit(false);
				//Sheet hssfSheet = wb.getSheetAt(0);  //示意访问sheet  
				// 上传时覆盖
				String delSql = "DELETE FROM " + resultTableName
						+ " WHERE GROUP_ID_1='"+regionCode+"'";
				
				SpringManager.getUpdateDao().update(delSql);
				in = new FileInputStream(uploadFile);
				wb = WorkbookFactory.create(in);  
				int sheetNum = wb.getNumberOfSheets();// 得到sheet数量
				System.out.println("准备导入...");
				if (sheetNum > 0) {
					Sheet sheet = wb.getSheetAt(0);
					System.out.println("导入Sheet页0:" + sheet.getSheetName());
					int start = sheet.getFirstRowNum() +1 ;// 去前1行标题
					int end = sheet.getLastRowNum();
					Row row;
					String sql = "INSERT INTO "+ resultTableName+"("+field+") values(sysdate"+",'"+regionCode+"','"+regionName+"','"+username+"'";
					for(int i=0;i<11;i++){
						sql+=",?";
					}
					sql+=")";
					pre=conn.prepareStatement(sql);
					for (int y = start; y <= end; y++) {
						row = sheet.getRow(y);
						if (row == null)
							continue;
						int cstart = row.getFirstCellNum();//排除第一列
						int cend = row.getLastCellNum();
						System.out.println(cstart + "：" + cend);
						for (int i = cstart; i < cend; i++) {
								pre.setString(i+1,getCellValue(row.getCell(i)));
						}
						pre.addBatch();
					}
					pre.executeBatch();
					conn.commit();
					conn.setAutoCommit(true);
					String isRepeatSql="SELECT ZD_IEMI FROM PMRT.TAB_MRT_YYT_ZD_BASE_TEMP WHERE ZD_IEMI IN(SELECT ZD_IEMI FROM PMRT.TAB_MRT_YYT_ZD_BASE WHERE IS_YES=1)";
					List<Map<String,String>> l=SpringManager.getFindDao().find(isRepeatSql);
					String repeatMsg="";
					if(l!=null&&l.size()>0){
						for(int i=0;i<l.size();i++){
							if(i==0){
								repeatMsg+=l.get(i).get("ZD_IEMI");
							}else{
								repeatMsg+=","+l.get(i).get("ZD_IEMI");
							}
						}
						err.add("终端串码为："+repeatMsg+"已存在于库中,请检查！");
						Struts2Utils.getRequest().setAttribute("err", err);
						return "error";
					}
					importToResult();
				}
			} catch (Exception e) {
				e.printStackTrace();
				err.add(e.getMessage());
			}finally{
				try {
					conn.close();
					if(wb instanceof XSSFWorkbook){
						in.close();
					}else{
						 wb.close();
					}
				} catch (Exception e) {
					e.printStackTrace();
				}
			}
		}
		if(err.size()>0){
		   Struts2Utils.getRequest().setAttribute("err", err);
		   return "error";
		}
		return "success";
	}

	public void downfile() {
		File f=new File(this.request.getRealPath("/portal/channelManagement/down/import_base.xls"));
		HttpServletResponse resp=ServletActionContext.getResponse();
		OutputStream os=null;
		InputStream is=null;
		try{
			os=resp.getOutputStream();
			is=new FileInputStream(f);
			resp.addHeader("content-disposition", "attachment;filename=import_base.xls");
			byte[] b=new byte[1024];
			int size=is.read(b);
			while(size>0){
				os.write(b,0,size);
				size=is.read(b);
			}
		}catch(IOException e){
			e.printStackTrace();
			if(null==os){
				try {
					os=resp.getOutputStream();
				} catch (IOException e1) {}
			}
		}finally{
			if(is!=null){
				try{ is.close();}catch(Exception e1){}
			}
			if(os!=null){
				try{ os.close();}catch(Exception e2){}
			}
		}
	}
	
	public File getUploadFile() {
		return uploadFile;
	}

	public void setUploadFile(File uploadFile) {
		this.uploadFile = uploadFile;
	}

	private String getCellValue(Cell cell){
		String value="";
		if(cell==null){
			return value;
		}
		int cellType=cell.getCellType();
		if(cellType==HSSFCell.CELL_TYPE_STRING){
			value=cell.getStringCellValue()+"";
		}else if(cellType==HSSFCell.CELL_TYPE_NUMERIC){
			if(HSSFDateUtil.isCellDateFormatted(cell)){
				value=new SimpleDateFormat("yyyy年MM月dd日").format(cell.getDateCellValue())+"";
			}else{
				value=cell.getNumericCellValue()+"";
			}
		}else if(cellType==HSSFCell.CELL_TYPE_BLANK){
			
		}else if(HSSFCell.CELL_TYPE_FORMULA==cellType){
			try {
				value = String.valueOf(cell.getNumericCellValue());
			} catch (IllegalStateException e) {
				value = String.valueOf(cell.getRichStringCellValue());
			}
			System.out.print("\t" + value);
		}
		return value;
	}
	
}