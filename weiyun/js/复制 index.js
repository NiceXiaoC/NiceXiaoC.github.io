/*
 * @version : v1.0
 * @author  : 饭     
 * @update ：    new Date()
 * @fn : 主js，
 */


(function(){
	var datas = data;
	
	
	var tools = {
		init : function(){
			tools.setViewH();//初始化响应式高度
			var treeMenu = $("#treeMenu");
			treeMenu.html(tools.treeMenuTemplate(datas,-1));//初始化树形菜单
			tools.selctCurrTreeMenu(treeMenu);//默认选中第一个
			tools.breadNavShow(0,datas);//面包屑导航显示第一个 
			tools.showSubMenu(treeMenu,datas);//切换菜单导航或面包屑导航显示子菜单（folder）
			
			tools.handleFn();
		},
		
		// 工具方法：下载，分享，移动，重命名，删除，新建文件夹 【注意下移】
		handleFn : function(){
			
			//下载
			$("#download").on("click",function(){
				$.tm_friendlyTips({
					content:"暂无下载链接，请联系管理员！",
					controls : "tm_warning",
					timer:1
				});
			});
			
			//分享
			$("#share").on("click",function(){
				$.tm_friendlyTips({
					content:"暂无分享，敬请期待！",
					controls : "tm_warning",
					timer:1
				});
			});
			
			//移动
			$("#move").on("click",function(){
				$.tm_friendlyTips({
					content:"暂无此方法，敬请期待！",
					controls : "tm_warning",
					timer:1
				});
			});
			
			//重命名
			$("#rename").on("click",function(){
				/*$.tm_friendlyTips({
					content:"重命名，即刻上线！",
					controls : "tm_warning",
					timer:1
				});*/
				
				var selFile = $("#filesView").find(".active");//选中的文件
				if(!selFile.length){
					$.tm_friendlyTips({
						content:"请选择文件",
						controls : "tm_warning",
						timer:1
					});
				}else if(selFile.length >=2){
					$.tm_friendlyTips({
						content:"只能对单个文件重命名！",
						controls : "tm_warning",
						timer:1
					});
				}else if(selFile.length === 1){
					selFile = $("#filesView").find(".active")
					
					var filename = selFile.find(".filename");
					var editInput = selFile.find(".txt");
					var fileId = selFile.data("file-id");
					var treeTitle = $("#treeMenu").find(".title[data-file-id='"+fileId+"']");
					selFile.addClass("reNameFile");
					editInput.val(filename.html());
					editInput.select();
					/*$(document).on("keyup",function(ev){
						if(ev.keyCode === 13){ //回车键 确定命名
							reName(editInput);
						};
					});*/
					editInput.on("blur",function(){
						reName($(this));
					});
					
					//重命名
					function reName(obj){
						var newName =  obj.val();
						if(newName.trim() !== ""){
							filename.html(newName);
							treeTitle.find("span").html(newName);
							var state = tools.changeNameById(datas,fileId,newName); //更新原数据
							if(state){ //更新成功提示
								$.tm_friendlyTips({
									content:"重命名文件成功！",
									controls : "tm_success",
									timer:1
								});
							}
						}
						obj.parents(".files").removeClass("reNameFile");
						$(document).off("keyup");
					}
				}
			});
			
			//删除
			$("#cancle").on("click",function(){
				var selFile = $("#filesView").find(".active");//选中的文件
				if(selFile.length<1){
					$.tm_friendlyTips({
						content:"请选中要删除的文件！",
						controls : "tm_warning",
						timer:1
					});
				}else{
					
					$.tmDialog({
						title : "友情提示",
						contents : "你确定要删除么？",
						success : function(){ //确定删除
							
							selFile.remove(); //删除文件夹,
							selFile.each(function(index,ele){
								var id = $(this).data("file-id");
								var trueMenus = $("#treeMenu").find(".title[data-file-id="+id+"]");
									//删除对应的树形菜单
								trueMenus.parent().remove();
								//删除对应的数据
								dataControl.delDataById(datas,id);
							});
							
							if($("#filesView").html() == ""){// filesView为空，显示提示文字，隐藏view
								$("#noFileTips").addClass("noFileTipsShow");
								$("#view-of-icon").hide();
								$("#treeMenu").find(".title[data-file-id="+$("#getPidInput").val()+"]").removeClass("active").addClass("control-none");
							}
							
							
							$.tm_friendlyTips({
								content:"文件删除成功！",
								controls : "tm_success",
								timer:1
							});
							
						}
					});
				}
			});
			
			//新建文件夹
			$("#newfolder").on("click",function(){
				
				$("#noFileTips").removeClass("noFileTipsShow");
				$("#view-of-icon").show();
				
				var newFile = $("#filesView").find(".newFile");
				if(newFile.length==0){
					
					var newFile = {
						title : "新建文件夹",
						id : new Date().getTime()
					}
					
					$("#filesView").prepend(createFile(newFile));
					
					var newFile = $("#filesView").find(".newFile");
					var $edit = $("#filesView").find(".txt"); 
					$edit.focus();
					$edit.on("blur",function(){
						var val = $edit.val();
						if(val.trim() === ""){ //如果输入框为空，移除新建的元素
							newFile.remove();
							if($("#filesView").html() == ""){// filesView为空，显示提示文字，隐藏view
								$("#noFileTips").addClass("noFileTipsShow");
								$("#view-of-icon").hide();
							}
							$.tm_friendlyTips({
								content:"新建文件夹失败！",
								controls : "tm_warning"
							});
						}else{
							
							//在哪里新建的内容？，获取新建内容的父id【放在点击的隐藏域里面】
							var parentId = $("#getPidInput").val();
							
							var fileid = newFile.data("file-id");
							//新文件数据
							var newFileDate = {
								id:fileid,
								pid:parentId,
								title:val,
								type:"file"
							}
							
							//移除相关的样式
							newFile.removeClass("reNameFile newFile");
							//跟新title
							newFile.find(".filename").html(val);
							
							//更新数据
							datas.unshift(newFileDate);
							
							//获取树形菜单的 file-id = parentId的元素，目的：更新树形目录
							var iNowPt = $("#treeMenu").find(".title[data-file-id='"+parentId+"']");
							//获取iNowPt的相邻元素ul,并把创建的树形菜单添加到里面
							var sibUl = iNowPt.siblings("ul");
							var leave = tools.getLevelById(datas,fileid);
							
							sibUl.append(createTreeHtml({ //更新树形菜单
								id : fileid,
								title : val,
								level :leave
							}));
							
							if(sibUl.html() != ""){//如果子元素为空，则添加下拉小图标【即移除 control-none 样式 即可】
								iNowPt.addClass("active").removeClass("control-none");
							}
							
							$.tm_friendlyTips({
								content:"新建文件夹成功！",
								controls : "tm_success",
								timer:1
							});
						}
						$edit.off("blur"); //杀死，避免重命名出错
					});
					
				}else{
					var inputTxt = newFile.find(".txt");
					inputTxt.focus();
				}
				
				
				
				//创建树形菜单：
				function createTreeHtml(opts){
					var $li = $("<li></li>")
					$li.html(`
						<div class="title control-none" style="padding-left:${opts.level*14}px;" data-file-id="${opts.id}">
							<i class="icon icon1"></i>
							<i class="icon icon2"></i>
							<span>${opts.title}</span>
						</div>
						<ul style="display:block"></ul>
					`);
					return $li;
				}
				
				//创建文件夹
				function createFile(fileData){
					var newFile = $("<div class='files reNameFile newFile' data-file-id='"+fileData.id+"'></div>");
					newFile.html(FileHtml(fileData));
					return newFile;
				}
				
				//文件夹模板
				function FileHtml(fileData){
					var html = `
						<a href="javascript:void(0)" class="selectBox"></a>
						<span class="icon folderIcon"></span>
						<p class="filename">${fileData.title}</p>
						<input type="text" class="txt">
						`;
					return html;
				}
			});
			
			//刷新
			$("#refresh").on("click",function(){
				$.tm_friendlyTips({
					content:"哈哈哈，就是不让刷新！",
					controls : "tm_warning",
					timer:1
				});
			});
			
		},
		
		//显示子菜单【点击菜单或者面包屑导航时触发，】
		showSubMenu : function(obj,datas){
			
			datas = datas;
			
			//树形菜单
			obj.on("click",".title",function(){
				var currid = $(this).data("file-id");
				tools.selctCurrTreeMenu(obj,currid);//切换树形菜单导航
				tools.breadNavShow(currid,datas);//显示（切换）面包屑导航
				tools.selectCheckAllBtn();//选中全选按钮
				tools.selectFolder();//初始化文件选中
			});
			
			//面包屑导航
			$("#breadNav").on("click","li>a",function(){
				var currid = $(this).data("file-id");
				tools.breadNavShow(currid,datas);//显示（切换）面包屑导航
				tools.selctCurrTreeMenu(obj,currid);//切换面包屑导航，同步切换树形菜单导航
				tools.selectFolder();//初始化文件选中
			});
		},
		
		
		//选中文件夹 【点击选择文件】
		selectFolder : function(){
			
			$("#filesView").off().on("mousedown",".files .selectBox",function(ev){
				var parents = $(this).parents(".files");
				if(ev.button == 0){ //左键
					if(ev.ctrlKey){ //ctrl + 左键
						parents.toggleClass("active");
					}else{ //没有ctrl
						var len = $("#filesView").find(".active").length;
						len>1 ? parents.addClass("active") : parents.toggleClass("active");
						parents.siblings(".files").removeClass("active");
					}
					tools.selectCheckAllBtn();//是否选中全选按钮
				}
			});
			
			//选中所有【按钮选择】
			$("#selectAllFiles").on("click",function(){
				var curr = $(this).hasClass("sel");
				var allFiles = $("#filesView").find(".files");
				$(this).toggleClass("sel");
				!curr ? allFiles.addClass("active") : allFiles.removeClass("active");
			});
			
			//拖拽选中
			$("#view-of-icon").on("mousedown",".files",function(ev){
				return false;
			});
			
			$("#view-of-icon").off().on("mousedown",function(ev){
				var filesBox = $("#filesView").find(".files");
				var disX = ev.clientX;
				var disY = ev.clientY;
				var newCase = $("<div></div>"); //创建元素
				var minleft = $("#view-of-icon").offset().left;
				var mintop = $("#view-of-icon").offset().top;
				newCase.css({width : 0,height : 0,background:"blue",opacity:0.2,position : "absolute",left : disX,top : disY,border : "1px dashed #dedede"});
				$("body").append(newCase); //body添加新建元素
				
				$(document).on("mousemove",moveFn);
				$(document).on("mouseup",upFn);
				
				//鼠标移动
				function moveFn(ev){
					var dx = ev.clientX;
					var dy = ev.clientY;
					
					if(Math.abs(dx-disX) <= 10) return false;//如果移动的距离小于10,代表不托选
					dx = dx<=minleft ? minleft : dx;
					dy = dy<=mintop ? mintop : dy;
					//计算鼠标移动的距离，【就是新建元素的高或宽】
					var newDisX = Math.abs(dx - disX); 
					var newDisY = Math.abs(dy -disY);
					//默认：鼠标按下的坐标为新建元素的坐标
					var left = disX; 
					var top = disY;
					if(ev.clientX > disX && ev.clientY > disY){ //向右下角拉动，left,top为默认的鼠标按下时坐标
						left = disX;
						top = disY;
					}else if(ev.clientX < disX && ev.clientY < disY){//向左上角拉动，left,top修改为新的鼠标移动时坐标
						left = ev.clientX;
						top = ev.clientY;
					}else if(ev.clientY < disY){ //向右上角拉动 ,left为鼠标按下的坐标，top为鼠标移动的坐标
							left = disX;
							top = ev.clientY;
					}else if(ev.clientX < disX){ //向左下角拉动，left为鼠标移动的x轴坐标，top为鼠标按下的坐标
						left = ev.clientX;
						top = disY;
					}
					
					left = left<=minleft ? minleft : left;
					top = top<=mintop ? mintop : top;
					
					//更新拖拽框的位置的位置
					newCase.css({
						width : parseInt(newDisX),
						height : parseInt(newDisY),
						left : left,
						top : top
					});
					
					//碰撞【拖拽是碰撞回调】
					tools.pzCallbackFn(newCase,{
						boxDom : filesBox,
						pzCallbacll :function(){
							$(this).addClass("active");
						},
						nopzCallbacll :function(){
							$(this).removeClass("active");
						}
					});
					
				}
				
				//鼠标抬起
				function upFn(){
					$(document).off("mousemove");
					$(document).off("mouseup");
					newCase.remove();//移除新建选框
				}
				
			});
		},
		
		//选中全选按钮
		selectCheckAllBtn : function(){
			var sel = $("#filesView").find(".active").length;
			var folder = $("#filesView").find(".files").length;
			sel === folder ? $("#selectAllFiles").addClass("sel") : $("#selectAllFiles").removeClass("sel");
		},
		
		//点击菜单，查找子文件【根据当前选中的菜单项显示子菜单】
		breadNavShow : function(currid,datas){
			//获取currid的父元素
			var parents = tools.getParents(datas,currid).reverse();
			tools.breadNav(parents);//初始化面包屑导航
			tools.drawFiles(datas,currid);//重新渲染子菜单文件
		},
		
		//渲染子菜单文件【文件夹】
		drawFiles : function(datas,currid){
			//获取当前currid的子元素
			var childs = tools.getChildById(datas,currid);
			var hasChilds = tools.hasChilds(datas,currid);//是否有子元素
			if(hasChilds){
				$("#noFileTips").removeClass("noFileTipsShow");
				$("#view-of-icon").show();
				
				//console.log(childs);
				var html = "";
				childs.forEach(function(item){
					html += tools.filesHtml(item);
				});
				$("#filesView").html(html);
				
				tools.selectFolder();//初始化文件选中
			}else{
				$("#view-of-icon").hide();
				$("#filesView").find(".files").removeClass("active");//移除所有的选中状态，目的：避免全选按钮出错
				$("#noFileTips").addClass("noFileTipsShow");
				$("#filesView").html("");//无子文件,移除所有内容
			}
			tools.selectCheckAllBtn();//是否选中全选按钮
			
			$("#getPidInput").val(currid);
		},
		
		//选中当前id的菜单
		selctCurrTreeMenu : function(obj,currid){
			currid = currid || 0;
			var ele = obj.find(".title[data-file-id='"+currid+"']");
			obj.find(".title").removeClass("control");
			ele.addClass("control");
		},
		
		//获取id下面的所有子元素
		getChildById : function(arr,pid){
			var newArr = [];
			for(var i=0;i<arr.length;i++){
				if(arr[i].pid == pid){
					newArr.push(arr[i]);
				}
			}
			return newArr;
		},
		
		//获取当前的id在第几层
		getLevelById:function (data,id){
			return tools.getParents(data,id).length;
		},
		
		//当前id是否有子元素
		hasChilds:function (data,id){
			return tools.getChildById(data,id).length !== 0;
		},
		
		//获取当前id的所有的父级
		getParents : function (data,currentId){
			var arr = [];
			for( var i = 0; i < data.length; i++ ){
				if( data[i].id == currentId ){
					arr.push(data[i]);
					arr = arr.concat(tools.getParents(data,data[i].pid))
					break;
				}
			}
			return arr;
		},
		
		//修改某个id的名字
		changeNameById:function (data,id,names){
			for( var i = 0; i < data.length; i++ ){
				if( data[i].id == id ){
					data[i].title = names;
					return true;
				}
			}
			return false;	
		},
		
		treeMenuTemplate : function(data,id){//树形菜单模板
			var childs = tools.getChildById(data,id);
			var html = "<ul style='display:block'>";
			childs.forEach(function(item){
				//获取当前数据的层级
				var level = tools.getLevelById(data,item.id);
				//判断当前数据有木有子集
				var hasChild = tools.hasChilds(data,item.id);
				var classNames = hasChild ? "active" : "control-none";
				html += `
					<li>
						<div class="title ${classNames}" style="padding-left:${level*14}px;" data-file-id="${item.id}">
							<i class="icon icon1"></i>
							<i class="icon icon2"></i>
							<span>${item.title}</span>
						</div>
						${tools.treeMenuTemplate(data,item.id)}
					</li>
				`;
			});
			html += "</ul>";
			return html;
		},
		
		//面包屑导航模板
		breadNav : function(parents){
			var breadHtml = "";
			parents.forEach(function(elem,index){
				if(index == parents.length-1)return false;
				breadHtml += `<li>
							<a href="javascript:void(0)" data-file-id="${elem.id}">
								<span>${elem.title}</span>
							</a>
							<i class="icon"></i>
						</li>`;
			});
			breadHtml += `<li>
						<span class="currPath active" data-file-id="${parents[parents.length-1].id}">
							${parents[parents.length-1].title}
						</span>
					</li>`;
			$("#breadNav").html(breadHtml);		
		},
		
		//文件夹模板
		filesHtml : function(fileData){
			var fileHtml = `<div class="files" data-file-id = "${fileData.id}">
						<a href="javascript:void(0)" class="selectBox"></a>
						<span class="icon folderIcon"></span>
						<p class="filename">${fileData.title}</p>
						<input type="text" class="txt">
					</div>`;
			return fileHtml;
		},
		
		//碰撞回调
		pzCallbackFn:function(obj,jsons){
			var boxDom = jsons.boxDom;
			/*{
				boxDom : boxDom,//要碰撞的元素
				pzCallbacll :function(){},//碰撞回调
				nopzCallbacll :function(){}//取消碰撞回调
			}*/
			
			for(var i=0;i<boxDom.length;i++){
				if(tools.pzFn(obj,boxDom.eq(i)) && obj!== boxDom.eq(i) ){
					//撞到时回调函数
					jsons.pzCallbacll && typeof jsons.pzCallbacll === "function" && jsons.pzCallbacll.call(boxDom.eq(i));
				}else{
					//未撞到时回调函数
					jsons.nopzCallbacll && typeof jsons.nopzCallbacll === "function" && jsons.nopzCallbacll.call(boxDom.eq(i));
				}
			}
			tools.selectCheckAllBtn();//发生碰撞后是否选中全选按钮
		},
		
		//碰撞检测：
		pzFn :  function(obj1,obj2){
			var top1 = obj1.offset().top;
			var right1 = obj1.offset().left+obj1.width();
			var bottom1 = obj1.offset().top + obj1.height();
			var left1 = obj1.offset().left; 
			var top2 = obj2.offset().top;
			var right2 = obj2.offset().left+obj2.width();
			var bottom2 = obj2.offset().top + obj2.height();
			var left2 = obj2.offset().left;
			//没有碰撞的情况
			if(left1 > right2 || bottom1 < top2 ||  right1 < left2 || top1 > bottom2){	
				return false;
			}else{
				return true;
			}
		},
		
		//设置视图的高、宽度
		setViewH : function(){
			viewWH();
			$(window,document).resize(viewWH);
			function viewWH(){
				var height = $("body").height() - 130;
				var width = $("body").width() - $(".left").outerWidth();
				$("#mainView").css("height",height);
				$("#panelArea").css("width",width);
			}
		}
	}
	
	window.wy = tools;
})();