var pageSize = 15;
$(function() {
	search(0);
	$("#saveBtn").click(function(){
		save();
	});
	$("#addSaveBtn").click(function(){
		add();
	});
});

//列表信息
function search(pageNumber) {
	pageNumber = pageNumber + 1;
	$.ajax({
		type:"POST",
		dataType:'json',
		cache:false,
		url:$("#ctx").val()+"/channelManagement/channelResource_listTownDetail.action",
		data:{
           "resultMap.page":pageNumber,
           "resultMap.rows":pageSize,
           "city_id":$("#city_id").val()
	   	}, 
	   	success:function(data){
	   		if(data.msg) {
	   			art.dialog.alert(data.msg);
	   			return;
	   		}
	   		var pages=data;
	   		if(pageNumber == 1) {
				initPagination(pages.pagin.totalCount);
			}
	   		var content="";
	   		$.each(pages.rows,function(i,n){
				content+="<tr>"
				+"<td>"+isNull(n['CITY_NAME'])+"</td>"
				+"<td>"+isNull(n['TOWN_NAME'])+"</td>"
				+"<td><a onclick='update($(this))' id='"+isNull(n['ID'])+"' town_name='"+isNull(n['TOWN_NAME'])+"' href='#'>修改</a>&nbsp;&nbsp;" +
		 		"<a onclick='del($(this))' id='"+isNull(n['ID'])+"' href='#'>删除</a></td>";
				content+="</tr>";
			});
			if(content != "") {
				$("#dataBody").empty().html(content);
			}else {
				$("#dataBody").empty().html("<tr><td colspan='3'>暂无数据</td></tr>");
			}
	   	},
	   	error:function(XMLHttpRequest, textStatus, errorThrown){
		   alert("加载数据失败！");
	    }
	});
}

function update(obj){
	art.dialog.data('id',obj.attr("id"));
	$("#town_name").val(obj.attr("town_name"));
	var formdiv=$('#updateFormDiv');
	formdiv.show();
	formdiv.dialog({
		title : '修改',
		width : 400,
		height : 100,
		closed : false,
		cache : false,
		modal : false,
		maximizable : true
	});
}

function openAdd(){
	var formdiv=$('#addFormDiv');
	formdiv.show();
	formdiv.dialog({
		title : '添加',
		width : 400,
		height : 100,
		closed : false,
		cache : false,
		modal : false,
		maximizable : true
	});
}

function save(){
	var id=art.dialog.data('id');
	$("#id").val(id);
	var url = $("#ctx").val()+'/channelManagement/channelResource_updateTownDetail.action';
	var updateForm=$('#updateForm');
	var town_name=$.trim($("#town_name").val());
	updateForm.form('submit',{
		url:url,
		dataType:"json",
		async: false,
		type: "POST", 
		onSubmit:function(){
			if($(this).form('validate')==false){
				return false;
			}
			var d=isExist(town_name);
			if(d==true){
				return false;
			}
		},
		success:function(data){
			var win = artDialog.open.origin;//来源页面
			var d = $.parseJSON(data);
			alert(d.msg);
			$('#updateFormDiv').dialog('close');
			search(0);
			//win.reload();
		}
	});
}

function add(){
	var url = $("#ctx").val()+'/channelManagement/channelResource_addTownType.action';
	var addForm=$('#addForm');
	var town_name=$.trim($("#add_town_name").val());
	addForm.form('submit',{
		url:url,
		dataType:"json",
		async: false,
		type: "POST", 
		onSubmit:function(){
			if($(this).form('validate')==false){
				return false;
			}
			var d=isExist(town_name);
			if(d==true){
				return false;
			}
		},
		success:function(data){
			var win = artDialog.open.origin;//来源页面
			var d = $.parseJSON(data);
			alert(d.msg);
			$('#addFormDiv').dialog('close');
			search(0);
			//window.parent().listTownType(0);
		}
	});
}
function isExist(town_name){
	var r=false;
	$.ajax({ 
        type: "POST", 
        async: false,
        url: $("#ctx").val()+"/channelManagement/channelResource_isTownExist.action", 
        dataType: "json",
		data:{
			town_name:town_name,
			city_id:$("#city_id").val()
		},
		 success:function(data){
			 if(data.msg){
				 r=true;
				 alert(data.msg);
			 }
    	},
    	error: function (XMLHttpRequest, textStatus, errorThrown) { 
            alert("验证出现异常！"); 
		} 
	});
	return r;
}

function del(obj){
	var id=obj.attr("id");
	if(confirm('确认刪除吗?')){
		if(beforeDelete(id)){
			$.ajax({ 
		        type: "POST", 
		        async: false,
		        url: $("#ctx").val()+"/channelManagement/channelResource_delTownDetail.action?id="+id, 
		        dataType: "json",
				data:{
					id:id
				},
				 success:function(data){
				    alert(data);
				    search(0);
		    	},
		    	error: function (XMLHttpRequest, textStatus, errorThrown) { 
		            alert("删除出现异常！"); 
				} 
			});
		}
	}
}

function beforeDelete(id){
	var isCanDelete;
	$.ajax({ 
        type: "POST", 
        async: false,
        url: $("#ctx").val()+"/channelManagement/channelResource_beforeDelTownDetail.action?id="+id, 
        dataType: "json",
		data:{
			id:id
		},
		 success:function(data){
			 if(data=="ok"){
				 isCanDelete=true; 
			 }else{
				 isCanDelete=false;
				 alert(data);
			 }
    	},
    	error: function (XMLHttpRequest, textStatus, errorThrown) {
    		isCanDelete=false;
            alert("验证出现异常！"); 
		} 
	});
	return isCanDelete;
}
//分页
function initPagination(totalCount) {
	 $("#totalCount").html(totalCount);
	 $("#pagination").pagination(totalCount, {
       callback: search,
       items_per_page:pageSize,
       link_to:"###",
       prev_text: '上页',       //上一页按钮里text  
	   next_text: '下页',       //下一页按钮里text  
	   num_display_entries: 5, 
	   num_edge_entries: 2
	 });
}

function isNull(obj){
	if(obj == undefined || obj == null || obj == '') {
		return "&nbsp;";
	}
	return obj;
}

function cancel(id) {
	$("#"+id).dialog('close');
}
