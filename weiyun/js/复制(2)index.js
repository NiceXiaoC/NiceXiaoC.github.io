/*
 * @version : v1.0
 * @author  : 饭     
 * @update ：    new Date()
 * @fn : 主js，
 * 
 */


(function(){
	var datas = data;
	var wYun  = function(){
		var tools = {
			
			//初始化
			init : function(){
				
				tools.setViewH(); //初始化view的高度
				
				//下拉菜单
				tools.showDropDownMenu("mainUser-info","userheder","infosTool","active");
				tools.showDropDownMenu("viewMode","sortMode","sortMd_lists","active");

				tools.drawTreeMenu(datas,-1); //渲染树形菜单
				
				tools.changeMenu(datas); // 绑定 菜单切换
				
				tools.selectFolder(); //初始化文件选中
				
				tools.handleFn(); //初始化工具方法
				
				
				$(window).resize(function(){
					tools.setViewH();
				});
			},
			
			// 工具方法：下载，分享，移动，重命名，删除，新建文件夹
			handleFn : function(){
				var _this = this;
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
					
					var moveFile = $("#filesView").find(".active"); //获取要移动的文件
					if(!moveFile.length){ 
						$.tm_friendlyTips({
							content:"请选择文件",
							controls : "tm_warning",
							timer : 3
						});
					}else if(moveFile.length >= 2){
						
						$.tm_friendlyTips({
							content:"只提对供单个文件夹进行移动！",
							controls : "tm_warning",
							timer : 2
						});
						
					}else{
						
						$("#overlayout").fadeIn(); //显示遮盖层
						
						//重新渲染 目录结构
						var treeMenu = $("#treeMenuPanel");
						var TreeMenuHtml = template.treeMenuTemplate(datas,-1);
						treeMenu.html(TreeMenuHtml);
						_this.selctCurrTreeMenu(treeMenu,0); //默认选中第一个
						
						//为当前的树形目录绑定选中事件
						$("#treeMenuPanel").off("click").on("click",".title",function(){
							$("#treeMenuPanel").find(".title").removeClass("active");
							$(this).addClass("active");
						});
						
						//显示 文件移动位置选择 窗口
						$("#moveToOther").tmDrags({
							isDrag : true, //是否可以拖拽，默认true
							closeBtn : $(".close"),
							suerBtn : $(".sure"),
							cancleBtn : $(".cancle"),
							closeFn : function(){
								$("#overlayout").fadeOut(); //关闭时触发，关闭遮盖层
							},
							callback : function(){ //成功回调
								
								var currentId = moveFile.data("file-id"); //要移动的文件的 id
								
								var moveArea = $("#treeMenuPanel").find(".active"); //要移动到的目标位置
								
								var targetId = moveArea.data("file-id"); // 获取目标位置的file-id
								
								//console.log("要移动到的位置："+targetId);
								
								if(currentId === targetId){//如果：要移动得文件与目标位置相同
									
									$.tm_friendlyTips({
										content:"文件移动失败，重新选择目标位置！",
										controls : "tm_warning",
										timer:2
									});
									
								}else{ //否则
									
									
									//获取当前要移动的目标位置的所有父级【目的：父级 不能 移动到 子集】
									var parents =  dataControl.getParents(datas,targetId);
									
									//判断要移动到的目标位子 是不是要移动文件的子文件
									var isExist = dataControl.isChildsOfCurrent(parents,currentId);
									
									if(!isExist){ 
										
										// 获取当前 要移动的 文件的层级 ：
										var currentLevel = dataControl.getLevelById(datas,currentId)
										
										// 获取 目标 位置文件的  子集存放的 层数 【+1的目的是需要在下一级显示】
										var targetLevel = dataControl.getLevelById(datas,targetId) + 1;
										
										// 如果  要移动的层级 与移动后的层级在同一级，，表示不移动
										if(currentLevel === targetLevel){
											$.tm_friendlyTips({
												content:"文件移动失败，重新选择目标位置！",
												controls : "tm_warning",
												timer:2
											});
										}else{
											//console.log("准备移动！！");
											
											//存放 选中文件的所有子元素【包括本身】
											var currentIdAllChilds = [];  
											
											// 获取选中文件 本身的数据
											for(var i=0;i<datas.length;i++){
												if(datas[i].id == currentId){
													datas[i].pid = targetId; //修改 parent id
													currentIdAllChilds.push(datas[i]);  
												}
											}
											
											//获取选中文件的 所有子文件数据
											function getAllChilds(data,pid){
												for(var i=0;i<data.length;i++){
													if(data[i].pid == pid){
														currentIdAllChilds.push(data[i])
														getAllChilds(data,data[i].id); //递归查找
													}
												}
											}
											getAllChilds(datas,currentId);
											
											
											//在哪个（pid=currentId）目录下面创建树形菜单
											var iNowPrentMenu = $("#treeMenu").find(".title[data-file-id='"+targetId+"']");
											// 获取 iNowPrentMenu 的相邻元素，目的：存放新创建的额树形菜单 
											var sibEle = iNowPrentMenu.siblings("ul");
											
											// 获取需要移除的树形目录
											var removeMenu = $("#treeMenu").find(".title[data-file-id='"+currentId+"']");
											removeMenu.parent().remove();
											
											moveFile = $("#filesView").find(".active");
											moveFile.remove();
											
											if($("#filesView").html() == ""){
												$("#view-of-icon").hide();
												$("#noFileTips").addClass("noFileTipsShow");
												$("#selectAllFiles").removeClass("sel")
											}
											
											
											//循环更新移动的文件id,并创建新的树形目录结构【方法：类似新建文件一样，添加树形目录】
											currentIdAllChilds.forEach(function(ele){
												var newF = {
													id : new Date().getTime() + Math.random()*100, //避免id 重复
													title : ele.title, //文件名
													level :targetLevel++  //层级（要在第几层显示）
												}
												for(var i=0;i<datas.length;i++){
													if(datas[i].id == ele.id){
														datas[i].id =  newF.id; //更新原始数据的id
														ele.id = newF.id; //更新当前要移动的(所有)文件id
													}
													//console.log(datas[i]);
												}
												
												//添加树形目录
												sibEle.append(template.createTreeMenu(newF));
											});
											
											//修改 每个元素的pid 【目的：根据这个pid来更新原始数据的pid】
											for(var i=1;i<currentIdAllChilds.length;i++){
												currentIdAllChilds[i].pid = currentIdAllChilds[i-1].id;
											}
											
											// 更新原始数据：
											for(var i=0;i<datas.length;i++){
												for(var j = 0;j<currentIdAllChilds.length;j++){
													if(datas[i].id == currentIdAllChilds[j].id){
														datas[i].pid = currentIdAllChilds[j].pid;
													}
												}
											}
											
											// 更改树形目录的各级状态
											//最简单的方式是：重新更新目录结构（暂时先这样子做吧！嘿嘿嘿 ）
											var treeMenu = $("#treeMenu");
											var TreeMenuHtml = template.treeMenuTemplate(datas,-1);
											treeMenu.html(TreeMenuHtml);
											_this.selctCurrTreeMenu(treeMenu,$("#getPidInput").val()); //默认选上一次选中过的
											
											
											/*console.log('-----------------------------------');
											
											currentIdAllChilds.forEach(function(ele){
													console.log(ele);
											})
											
											console.log("+++++++++++++++++++++++++++++++++++++++++++++++++");
											
											datas.forEach(function(ele){
												console.log(ele);
											});*/
											
										}
									}else{
										
										$.tm_friendlyTips({
											content:"文件移动失败，重新选择目标位置！",
											controls : "tm_warning",
											timer:3
										});
									}
									
								}
							}
						});
					}
					
				});
				
				// 重命名
				
				$("#rename").on("click",function(){
					
					//获取要重命名的文件
					var renameFile = $("#filesView").find(".active");
					
					if(!renameFile.length){
						$.tm_friendlyTips({
							content:"请选择文件",
							controls : "tm_warning",
							timer:1
						});
					}else if(renameFile.length >=2){
						$.tm_friendlyTips({
							content:"只能对单个文件重命名！",
							controls : "tm_warning",
							timer:1
						});
					}else{
						
						//重新获取，避免出错
						renameFile = $("#filesView").find(".active");
						
						//获取文件名box
						var filename = renameFile.find(".filename");
						
						//获取重命名编辑框
						var editorInput = renameFile.find(".txt");
						
						//获取当前重名的 文件id
						var fileId = renameFile.data("file-id");
						
						//获取对应树形目录的title 
						var treeTitle = $("#treeMenu").find(".title[data-file-id='"+fileId+"']");
						
						//添加样式，【表示开始重命名，显示命名框】
						renameFile.addClass("reNameFile");
						editorInput.val(filename.html());
						editorInput.select();
						
						editorInput.on("blur",function(){
							
							var val = $(this).val();
							
							if(val.trim() == ""){
								
								$.tm_friendlyTips({
									content:"请输入文件名字",
									controls : "tm_warning"
								});
								editorInput.focus(); //重新获取焦点
								
							}else{
								
								var parentId = $("#getPidInput").val();
								var isExist = dataControl.isNameExsit(datas,parentId,val,fileId);
								
								if(isExist){ //表示文件名存在，提示
									$.tm_friendlyTips({ 
										content:"文件不能重名！",
										controls : "tm_warning"
									});
									editorInput.select();
								}else{
									
									filename.html(val); //更新文件名
									treeTitle.find("span").html(val); //更新树形菜单对应的名字
									
									//更新修改后的数据
									var isChangeSucc =  dataControl.changeNameById(datas,fileId,val);
									if(isChangeSucc){ //更新成功
										$.tm_friendlyTips({ 
											content:"重命名成功",
											controls : "tm_success"
										});
										renameFile.removeClass("reNameFile active");
										editorInput.off("blur");//清楚当前绑定
									}else{
										$.tm_friendlyTips({ 
											content:"重命名失败，请坚持网络。。",
											controls : "tm_warning"
										});
									}
								}
							}
						});
					}
				});
				
				//删除
				$("#cancle").on("click",function(){
					
					//获取要删除的文件夹【即：当前选中的】
					var selFile = $("#filesView").find(".active");
					
					if(!selFile.length){
						$.tm_friendlyTips({
							content:"请选中要删除的文件！",
							controls : "tm_warning",
							timer:1
						});
					}else{
						
						$.tmDialog({ //删除提示
							title : "友情提示",
							contents : "你确定要删除么？",
							success : function(){ //确定删除
								
								
								// 标记：删除有问题，，明天继续
								
								
								
								selFile.remove(); //删除文件夹,
								
								for(var i=0;i<selFile.length;i++){
									
									var id = $(selFile[i]).data("file-id"); //获取要删除的文件的id
									
									//获取对应的树形菜单 menu
									var trueMenus = $("#treeMenu").find(".title[data-file-id="+id+"]");
									
									//删除对应的树形菜单
									trueMenus.parent().remove();
									
									//删除对应的数据
									
									//要删除的数据
									var newArr = [];
									function del(data,pid){
										for(var i=0;i<data.length;i++){
											if(data[i].pid == pid){
												newArr.push(data[i])
												del(data,data[i].id); //递归查找子元素，
											}
										}
									}
									del(datas,id);
									dataControl.delDataByArr(datas,newArr,id); //删除数据
									
								}
								
								// filesView为空，显示提示文字，隐藏view
								if($("#filesView").html() == ""){
									
									$("#noFileTips").addClass("noFileTipsShow"); //显示无文件提醒
									$("#view-of-icon").hide(); //隐藏view
									
									//树形菜单去下下拉状态
									$("#treeMenu").find(".title[data-file-id="+$("#getPidInput").val()+"]").removeClass("control").addClass("control-none");
								
									//取消全选按钮选中状态
									$("#selectAllFiles").removeClass("sel");
								}
								
								//提示文件删除成功
								$.tm_friendlyTips({
									content:"文件删除成功！",
									controls : "tm_success",
									timer:1
								});
							}
						});
					}
				});
				
				
				// 新建文件夹
				$("#newfolder").on("click",function(){
					
					$("#noFileTips").removeClass("noFileTipsShow"); //隐藏提示
					$("#view-of-icon").show(); //显示视图
					
					var newFile = $("#filesView").find(".newFile"); //获取新建的文件夹
					
					//如果不存在刚刚新建的文件夹，则开始新建【目的：避免多次创建文件夹】
					if(!newFile.length){
						
						var newFile = {
							title : "新建文件夹", //新建文件夹的名称
							id : new Date().getTime() //新建文件夹的id,时间戳：避免id相同
						};
						
						//在view中添加新建的文件夹
						$("#filesView").prepend(template.createFile(newFile));
						
						//获取新创建的文件
						var createNewFile = $("#filesView").find(".newFile");
						//获取 编辑文件 输入框
						var editor  = createNewFile.find(".txt");
						editor.select();
						editor.on("blur",function(){
							var val = $(this).val();
							if(val.trim() == ""){
								
								createNewFile.remove(); //移除新建的文件建，表示新建失败
								
								// filesView为空，显示提示文字，隐藏view
								if($("#filesView").html() == ""){
									$("#noFileTips").addClass("noFileTipsShow");
									$("#view-of-icon").hide();
								}
								
								//提示文件新建失败
								$.tm_friendlyTips({ 
									content:"新建文件夹失败！",
									controls : "tm_warning"
								});
								
							}else{
								
								//在哪里新建的内容？，获取新建内容的父id【放在点击的隐藏域里面】
								var parentId = $("#getPidInput").val();
								var fileid = createNewFile.data("file-id");
								
								var isExist = dataControl.isNameExsit(datas,parentId,val,newFile.id);
								
								//如果该文件加的名字存在
								if(isExist){
									//提示文件不能重名
									$.tm_friendlyTips({ 
										content:"文件不能重名！",
										controls : "tm_warning"
									});
									editor.select();
								}else{ //开始创建，更新数据
									
									var newFileDate = {
										id:newFile.id,
										pid:parentId,
										title:val,
										type:"file"
									};
									
									//更新title
									createNewFile.find(".filename").html(val);
									
									//移除相关的样式【表示创建成功，要在当前显示】
									createNewFile.removeClass("reNameFile newFile"); 
									
									//实时更新数据【为数据新添加一项】
									datas.unshift(newFileDate);
									
									//创建对应树形菜单
									
									//在哪个（pid=parentId）目录下面创建树形菜单
									var iNowPrentMenu = $("#treeMenu").find(".title[data-file-id='"+parentId+"']");
									// 获取 iNowPrentMenu 的相邻元素，目的：存放新创建的额树形菜单 
									var sibEle = iNowPrentMenu.siblings("ul");
									
									//获取新创建的文件应该存放到第几级
									var leave = dataControl.getLevelById(datas,fileid);
									
									//添加树形目录
									sibEle.append(template.createTreeMenu({ //更新树形菜单
										id : fileid,
										title : val,
										level :leave
									}));
									
									if(sibEle.html() != ""){//如果子元素为空，则添加下拉小图标【即移除 control-none 样式 即可】
										iNowPrentMenu.addClass("control").removeClass("control-none");
									}
									
									//提示文件创建成功
									$.tm_friendlyTips({
										content:"新建文件夹成功！",
										controls : "tm_success"
									});
									
									//创建成功后取消当次blur事件，避免重命名出错
									editor.off("blur");
								}
							}
						});
						
					}else{
						var inputTxt = newFile.find(".txt");
						inputTxt.focus();
					}
				});
				
				
			},
			
			//菜单切换【包括：树形菜单切换、面包屑导航切换】
			changeMenu : function(data){
				var _this = this;
				//树形菜单切换
				$("#treeMenu").on("click",".title",function(){
					changeMenus($(this));
				});
				
				//面包屑当行切换
				$("#breadNav").on("click","li>a",function(){
					changeMenus($(this));
				});
				
				//切换导航
				function changeMenus(currentMenu){
					var obj = $("#treeMenu");
					var currId = currentMenu.data("file-id"); //获取当前id
					_this.selctCurrTreeMenu(obj,currId); //选中当前点击的menu
					_this.drawBreadNav(data,currId); //重新渲染面包屑导航
					$("#getPidInput").val(currId); //缓存当前 id ,为后续删除做准备
					$("#selectAllFiles").removeClass("sel"); //切换菜单时取消全选按钮的状态
				}
				
			},
			
			// 文件夹选中
			selectFolder : function(){
				
				var _this = this;
				
				//点击选中按钮，选中文件夹【ctrl多选，取消多选】
				$("#filesView").on("mousedown",".files .selectBox",function(ev){
					var parents = $(this).parents(".files");
					if(ev.button == 0){
						if(ev.ctrlKey){ // ctrl + 左键点击
							parents.toggleClass("active");
						}else{ 
							var len = $("#filesView").find(".active").length;
							len>1 ? parents.addClass("active") : parents.toggleClass("active");
							parents.siblings(".files").removeClass("active");
						}
						_this.selectCheckAllBtn();
					}
					return false;
				});
				
				//点击全选按钮选中所有的文件
				$("#selectAllFiles").on("click",function(){
					$(this).toggleClass("sel");
					var isSel = $(this).hasClass("sel"); //当前全选按钮是否选中
					var files =  $("#filesView").find(".files");
					isSel ? files.addClass("active") : files.removeClass("active");
				});
				
				// 拖拽选中
				$("#view-of-icon").off().on("mousedown",function(ev){
					
					var filesBox = $("#filesView").find(".files");
					var disX = ev.clientX;
					var disY = ev.clientY;
					var newCase = $("<div></div>"); //创建拖选框
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
						dataControl.pzCallbackFn(newCase,{
							boxDom : filesBox,
							pzCallbacll :function(){
								$(this).addClass("active");
								_this.selectCheckAllBtn();
							},
							nopzCallbacll :function(){
								$(this).removeClass("active");
								_this.selectCheckAllBtn();
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
				
				$("#selectAllFiles").removeClass("sel"); //切换时取消全选按钮
				
				//当选中的  与  总共的文件 一样时，表示选中全部
				(sel === folder && sel)  ? $("#selectAllFiles").addClass("sel") : $("#selectAllFiles").removeClass("sel");
				
			},
			
			
			//渲染树形菜单
			drawTreeMenu : function(data,currid){ 
				var treeMenu = $("#treeMenu");
				var TreeMenuHtml = template.treeMenuTemplate(data,currid);
				treeMenu.html(TreeMenuHtml);
				this.selctCurrTreeMenu(treeMenu,0); //默认选中第一个
				this.drawBreadNav(datas,0);
			},
			
			//渲染面包屑导航
			drawBreadNav : function(data,currid){
				//获取currid的父元素
				var parents = dataControl.getParents(data,currid).reverse();
				template.breadNavTemp(parents);//初始化面包屑导航
				this.drawFiles(datas,currid);//根据导航 渲染子菜单文件
			},
			
			//渲染子菜单文件【文件夹】
			drawFiles : function(data,currid){
				
				
				// 获取当前 currid 下面是否有子元素
				var hasChilds = dataControl.hasChilds(data,currid);//是否有子元素
				
				if(hasChilds){ //有 子元素
					
					//获取 当前 currid 下的所有子元素
					var childs = dataControl.getChildById(data,currid);
					
					$("#noFileTips").removeClass("noFileTipsShow"); //隐藏无内容提示
					$("#view-of-icon").show(); //显示文件显示
					var html = "";
					childs.forEach(function(item){
						html +=  template.folderView(item);
					});
					$("#filesView").html(html);
					
				}else{//无子元素
					
					$("#view-of-icon").hide();
					$("#filesView").find(".files").removeClass("active");//移除所有的选中状态，目的：避免全选按钮出错
					$("#noFileTips").addClass("noFileTipsShow");
					$("#filesView").html("");//无子文件,移除所有内容
					
				}
				
			},
			
			//选中当前id的菜单
			selctCurrTreeMenu : function(obj,currid){
				currid = currid || 0;
				var ele = obj.find(".title[data-file-id='"+currid+"']");
				obj.find(".title").removeClass("active"); //取消其他选中状态
				ele.addClass("active"); //为当前的menu添加选中状态
			},
			
			// 显示下拉菜单
			showDropDownMenu : function(obj,child1,child2,currName){
				$("#"+obj).mouseover(function(){
					$(this).find("."+child1).addClass(currName);
					$(this).find("."+child2).show();
				}).mouseout(function(){
					$(this).find("."+child1).removeClass(currName);
					$(this).find("."+child2).hide();
				});
			},
			
			//设置view的高度【随浏览器的变化而变化】
			setViewH : function(){
				var _this = this;
				var height = $("body").height() - 130;
				var width = $("body").width() - $(".left").outerWidth();
				$("#mainView").css("height",height);
				$("#panelArea").css("width",width);
			}
		}
		return tools.init();
	}
	
	
	window.wy = wYun; //提供外界接口
})();