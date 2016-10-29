/*
 * @version : v1.0
 * @author  : 饭     
 * @update ：    new Date()
 * @fn : 桌面系统！
 */

(function(){
	var MyDesk = function(){
		this.menu = $("menu"); //右键菜单
		this.$menuBtn = this.menu.getElementsByTagName("li");
		this.menuList = $("menuList").getElementsByTagName("li");
		this.deskContiner = $("deskContiner");
		this.data = eval("("+localStorage.getItem("deskDate")+")") || deskData;
		this.fileNum = localStorage.getItem("fileNum") || 1;
		this.width = 0;//获取右键菜单的宽度
		this.height = 0;//获取右键菜单的高度
		this.winW = document.documentElement.clientWidth || document.body.clientWidth;//获取屏幕的宽度
		this.winH = document.documentElement.clientHeight || document.body.clientHeight;//获取屏幕的高度
	};
	
	MyDesk.prototype = {
		constructor : MyDesk,
		init : function(){ //初始化
			
			document.onkeydown = function(ev){
				var ev = ev || window.event;
				if(ev.keyCode === 9){ //屏蔽tab建，，避免bug 
					return false;
				}
			}
			this.rightMenu(); //右键菜单
			this.onMenuEvent(); //菜单事件
			
			// 图标大小方式
			var fileSize = localStorage.getItem("fileSize");
			var selArr = JSON.parse(localStorage.getItem("delDatas"));
			switch(fileSize){
				case "80" :
					this.deskContiner.classList.add("smallFile");
				break;
				case "120" :
					this.deskContiner.classList.add("bigFile");
				break;
			}
			this.initFolder(this.data); //初始化左面文件
			this.getCenter($("recycleBin-panel"));
			var selArr = JSON.parse(localStorage.getItem("delDatas"));
			if(selArr && selArr.length!==0) $("garbage").querySelector('.icon').classList.add("garbagefull");
		},
		
		// 初始化桌面文件
		initFolder : function(data){
			this.deskContiner.innerHTML = this.defaluteFile(data);
			//初始化桌面默认文件
			this.filoderPosition(); //初始化文件加位置
			
			var deskContiner = document.getElementById("deskContiner");
			var fileAll = deskContiner.querySelectorAll(".file");
			for(var i=0;i<fileAll.length;i++){
				new Drag().init({id:fileAll[i].id}); //初始化拖拽
			}
			
			this.folderFn(); //初始化 阻止文件夹操作 冒泡
			this.musicAndPhotoEvent();//初始化音乐
		},
		//右键菜单
		rightMenu : function(){
			//默认右键菜单屏蔽
			var _this = this;
			_this.width = parseInt(_this.getStyle(_this.menu,"width"))+4;
			_this.height = parseInt(_this.getStyle(_this.menu,"height"))+4;
			document.oncontextmenu = function(){return false;} //禁止右键
			_this.onEvent(_this.deskContiner,"mousedown",function(ev){ //右键菜单显示
				var ev = ev || window.event;
				var keycode = ev.button || ev.which; //获取鼠标的按键 1:左键，2/3：右键
				var maxL = _this.winW - _this.width;
				var maxT = _this.winH - _this.height;
				if(keycode === 2 || keycode === 3){
					var disX = ev.clientX || ev.pageX;//获取X轴坐标
					var disY = ev.clientY || ev.pageY;//获取Y轴坐标
					
					disX = disX >= maxL ? maxL : disX;
					disY = disY >= maxT ? maxT : disY;
					_this.menu.style.left = disX + "px";
					_this.menu.style.top = disY + "px";
					_this.menu.style.display = "block";
				}
				ev.stopPropagation();
			});
			_this.onEvent(_this.deskContiner,"click",function(ev){ //点击桌面隐藏右键菜单
				var ev = ev || window.event;
				ev.cancelBubble = true;
				_this.menu.style.display = "none";
			});
			_this.onEvent(window,"resize",function(){ //更新win的宽高度
				_this.winW = document.documentElement.clientWidth || document.body.clientWidth;//获取屏幕的宽度
				_this.winH = document.documentElement.clientHeight || document.body.clientHeight;//获取屏幕的高度
				_this.filoderPosition(); //重新初始化文件位置
				_this.getCenter($("recycleBin-panel")); //回收站居中
			});
		},
		
		//子菜单显示位置【靠左/右显示】
		subMenuPosi : function(ev){ 
			var _this = this;
			
			//子菜单显示
			_this.trigger(_this.$menuBtn,"mouseover",false,function(index){
				var tallW = _this.menu.offsetWidth + _this.menu.offsetLeft + 104;
				var smallMenu = this.getElementsByTagName("div")[0];
				if(smallMenu){
					if(tallW >= _this.winW){
						smallMenu.classList.remove("currR");
						smallMenu.classList.add("currL");
					}else{
						smallMenu.classList.remove("currL");
						smallMenu.classList.add("currR");
					}
				}
			});
		},
		// music 、photo 、calendar 显示/隐藏
		musicAndPhotoEvent : function(){
			var _this = this;
			var garbage = $("garbage");//回收站
			var recycleBinPanel = $("recycleBin-panel");//回收站panel
			var rcRightCons = $("rc-rightCons"); //
			var rightMenu = $("rightMenu");//回收站右键菜单
			var $menuLi = rightMenu.querySelectorAll("li");//回收站右键菜单功能
			var recycleClose = $("recycleClose"); //回收站关闭按钮
			
			var music = $("music"); //音乐
			var picture = $("picture"); //照片墙
			var calendar = $("calendar");//日历
			
			var iframeMusic = $("iframeMusic"); // iframe 音乐
			var iframephoto = $("iframephoto"); // iframe 照片
			var cdPanel = $("cdPanel"); //日历盒子
			
			var goBack = $("goback");
			var goBack1 = $("goback1");
			var closeBtn = cdPanel.querySelector(".closeBtn");
			
			//回收站
			_this.onEvent(garbage,"dblclick",function(){
				//alert("这是回收站哦");animated 
				recycleBinPanel.style.display = "block";
				recycleBinPanel.classList.add("animated");
				recycleBinPanel.classList.add("rollIn");
				var delData = JSON.parse(localStorage.getItem("delDatas")); //删除的数据
				if(delData)rcRightCons.innerHTML = _this.defaluteFile(delData); //初始化回收站文件
				var garbageFiles = rcRightCons.querySelectorAll(".file"); //回收站文件
				for(var i = 0;i<garbageFiles.length;i++){
					_this.onEvent(garbageFiles[i],"mousedown",function(ev){ //右键菜单显示
						var ev = ev || window.event;
						ev.stopPropagation();
						var keycode = ev.button || ev.which; //获取鼠标的按键 1:左键，2/3：右键
						rightMenu.style.display = "none";
						for(var j=0;j<garbageFiles.length;j++){
							garbageFiles[j].classList.remove("seled");
						}
						this.classList.add("seled");
						if(keycode === 2 || keycode === 3){ //右键
							var disX = ev.clientX;
							var disY = ev.clientY;
							var left = disX - ($("rightdetail").offsetLeft+$("recycleBin-panel").offsetLeft);
							var top = disY - ($("rightdetail").offsetTop+$("recycleBin-panel").offsetTop);
							rightMenu.style.left = left + "px";
							rightMenu.style.top = top + "px";
							rightMenu.style.display = "block";
						}
					});
				};
			});
			
			//回收站空白处 点击 ，清楚样式
			_this.onEvent($("rc-rightCons"),"mousedown",function(ev){
				var ev = ev || window.event;
				var garbageFiles = $("rc-rightCons").querySelectorAll(".file");
				ev.stopPropagation();
				for(var j=0;j<garbageFiles.length;j++){
					garbageFiles[j].classList.remove("seled");
				}
				rightMenu.style.display = "none";
			});
				
			//回收站 还原 删除的文件
			for(var i=0;i<$menuLi.length;i++){
				_this.onEvent($menuLi[i],"click",function(ev){ //右键菜单显示
					var selFiles = $("rc-rightCons").querySelector(".seled");
					if(!selFiles)return false;
					var selFilesId = selFiles.id;
					var delData = JSON.parse(localStorage.getItem("delDatas")); //获取删除的数据
					var revData = JSON.parse(localStorage.getItem("deskDate")) || []; //获取桌面图标数据
					$("rc-rightCons").removeChild(selFiles);
					rightMenu.style.display = "none";
					delData.forEach(function(e,i){
						if(selFilesId === e.typeId){
							revData.push(e);
							delData.splice(i,1);
							return false;
						}
					});
					localStorage.setItem("deskDate",JSON.stringify(revData));
					localStorage.setItem("delDatas",JSON.stringify(delData));
					var selArr = JSON.parse(localStorage.getItem("delDatas"));
					_this.initFolder(revData); //重新初始化桌面图标
					if(selArr && selArr.length!==0) $("garbage").querySelector('.icon').classList.add("garbagefull");
					if(selArr.length == 0) {
						recycleBinPanel.classList.remove("rollIn");
						recycleBinPanel.classList.add("bounceOutUp");
					}
				});
			}
			
			//回收站关闭
			_this.onEvent(recycleClose,"click",function(){
				recycleBinPanel.classList.remove("rollIn");
				recycleBinPanel.classList.add("bounceOutUp");
			});
			
			
			/**** 判断是否有这些元素的原因：这些元素肯能被删除，再次初始化后无法找到****/
			
			//音乐
			if(music)dbEvent(music,iframeMusic,goBack);
			//照片墙
			if(picture)dbEvent(picture,iframephoto,goBack1);
			//日历
			if(calendar){
				_this.onEvent(calendar,"dblclick",function(){
					mTween(cdPanel, {bottom:0}, 300, "easeIn");
				});
			}
			//关闭日历，重新初始化日历：目的，重新显示当前日期
			_this.onEvent(closeBtn,"click",function(){
				mTween(cdPanel, {bottom:-398}, 300, "easeIn",function(){
					new tmCalender({id : "Mycalendar"}).init(); //重新初始化日历
				});
			})
			
			//当前 双击移动元素 方法
			function dbEvent(obj,child,goback){
				_this.onEvent(obj,"dblclick",function(){
					child.style.left=0;
				});
				_this.onEvent(goback,"click",function(){
					child.style.left="100%";
				});
			}
			
		},
		//菜单按钮事件
		onMenuEvent : function(){
			var _this = this;
			_this.subMenuPosi(); // 子菜单位置初始化
			_this.seeTheWay();//查看方式
			_this.sorts(); //排序方式
			
			//菜单 功能
			for(var i=0;i<_this.$menuBtn.length;i++){
				(function(index){
					_this.onEvent(_this.$menuBtn[i],"click",function(ev){
						var ev = ev || window.event;
						ev.cancelBubble = true; //阻止向上冒泡
						if(index == 2 || index == 3 || index == 7){ // 新建文件，刷新
							_this.rightMenuFn(index);
							// 隐藏 右键菜单
							_this.menu.style.display = "none";
						}else{
							return false;
						}
					});
				})(i);
			}
		},
		rightMenuFn : function(index){ //右键一级菜单功能
			var _this = this;
			switch(index){
				case 2: //刷新
					 location.reload();
				break;
				case 3: //新建文件夹
					_this.createFolder();
				break;
				case 7: //清除本地存储
					localStorage.clear();
					location.reload();
				break;
			};
		},
		
		//桌面文件上操作时，阻止冒泡
		folderFn : function(){
			var _this = this;
			var deskContiner = $("deskContiner");
			var files = deskContiner.querySelectorAll(".file");
			for(var i=0;i<files.length;i++){
				(function(index){
					_this.onEvent(files[index],"click",function(ev){
						var ev = ev || window.event;
						ev.stopPropagation(); //阻止 触发 document上的 click 事件
						_this.menu.style.display = "none";
					});
				})(i);
				
				(function(index){
					_this.onEvent(files[index],"mousedown",function(ev){
						var ev = ev || window.event;
						var keycode = ev.button || ev.which; //获取鼠标的按键 1:左键，2/3：右键
						if(keycode === 2 || keycode === 3){
							ev.cancelBubble = true; //屏蔽文件夹上点击右键出现默认右键菜单
							//alert(11);
						}
					});
				})(i);
			}
		},
		//创建文件夹
		createFolder : function(){
			//alert("新建文件夹");
			var _this = this;
			var newFiles = {
				id : new Date().getTime(),
				title : "新建文件夹"+(_this.fileNum++),
				data : "2016-10-15",
				type : "folders",
				typeId : "file" + new Date().getTime()
			};
			
			console.log(newFiles);
			
			var newFileData = JSON.parse(localStorage.getItem("deskDate")) || deskData;
			newFileData.push(newFiles);
			localStorage.setItem("deskDate",JSON.stringify(newFileData));
			var fileNum = _this.fileNum;
			localStorage.setItem("fileNum",fileNum);
			
			var newFile = document.createElement("div");
			var fileIcon = document.createElement("div");
			var fileName = document.createElement("p");
			var fileId = newFiles.typeId;
			newFile.className = "file folders";
			newFile.id = fileId;
			
			fileIcon.className = "fileIcon icon";
			fileName.className = "fileName";
			fileName.innerHTML = newFiles.title;
			newFile.appendChild(fileIcon);
			newFile.appendChild(fileName);
			_this.deskContiner.appendChild(newFile);
			_this.filoderPosition();
			_this.folderFn();
			new Drag().init({id:fileId});
		},
		
		filoderPosition : function(){
			var _this = this;
			var col = 1;//定义列
			var row = 0;//定义行
			var fileSize = localStorage.getItem("fileSize");
			var space = fileSize || 100;//默认一个图标的大小
			var position = 10;//间距
			var windowH = window.innerHeight;
			var num = parseInt(windowH / space);//一行显示的个数
			var itemdoms = _this.deskContiner.querySelectorAll(".file");
			var i = 0,len = itemdoms.length;
			for(;i<len;i+=1){
				if(i >= num*col){ //控制列
					col ++;
					row = 0;
				}
				mTween(itemdoms[i], {left:position+(space * (col-1)),top:position+(space *row)}, 300, "easeIn");
				row++;
			}
		},
		//查看方式
		seeTheWay : function(){
			var _this = this;
			var seeWay = $("seeWay").getElementsByTagName("a");
			_this.trigger(seeWay,"click",true,function(index){
				if(index === 0){
					_this.deskContiner.classList.remove("bigFile");
					_this.deskContiner.classList.add("smallFile");
					localStorage.setItem("fileSize",80);
					_this.filoderPosition();
				}else if(index === 1){
					_this.deskContiner.classList.remove("smallFile");
					_this.deskContiner.classList.add("bigFile");
					localStorage.setItem("fileSize",120);
					_this.filoderPosition();
				}else if(index === 2){
					_this.deskContiner.classList.remove("bigFile");
					_this.deskContiner.classList.remove("smallFile");
					localStorage.setItem("fileSize",100);
					_this.filoderPosition();
				}else if(index === 3){
					var fileSize = localStorage.getItem("fileSize");
					_this.horizonPosi(fileSize);
				}else if(index === 4){
					_this.filoderPosition();
				}
			});
		},
		
		// 横排显示图标
		horizonPosi: function(space){
			var _this = this;
			var col = 0;//定义列
			var row = 0;//定义行
			var space = space || 100;//默认一个图标的大小
			var position = 10;//间距
			var windowH = window.innerWidth;
			var num = parseInt(windowH / space);//一行显示的个数
			var itemdoms = _this.deskContiner.querySelectorAll(".file");
			var i = 0,len = itemdoms.length;
			for(;i<len;i+=1){
				if(i >= num*row){ //控制列
					row ++;
					col = 0;
				}
				mTween(itemdoms[i], {left:position+(space * col),top:position+(space *(row-1))}, 300, "easeIn");
				col++;
			}
		},
		
		//排序方式
		sorts : function(){
			var _this = this;
			var sortWay = $("sorts").getElementsByTagName("a");
			var sortNum = localStorage.getItem("sortNum") || "up";
			_this.trigger(sortWay,"click",true,function(index){
				if(index === 0){
					//alert("日期排序");
					var sortData =  eval("("+localStorage.getItem("deskDate")+")") || deskData;
					for(var i=0;i<sortData.length;i++){
						sortData[i].numbers = sortData[i].data.replace(/-/g,''); 
					}
					if(sortNum === "up"){
						_this.sortSFn(sortData,"numbers",true);
						sortNum = "down";
					}else{
						_this.sortSFn(sortData,"numbers",false);
						sortNum = "up";
					}
					localStorage.setItem("sortNum",sortNum);
				}
			});
		},
		
		sortSFn : function(sortData,way,flag){
			var _this = this;
			if(flag){ //升序
				sortData.sort(function(a,b){
					return a[way] - b[way];
				});
			}else{//降序
				sortData.sort(function(a,b){
					return b[way] < a[way];
				});
			}
			_this.initFolder(sortData);
			var str = JSON.stringify(sortData);
			localStorage.setItem("deskDate",str);
		},
		
		/*
			trigger : 事件绑定触发
			 	$obj : 对象，
			 	event : 事件，如click
			 	isHide : 是否隐藏右键菜单
			 	callback ： 回调函数
		*/
		trigger : function($obj,event,isHide,callback){
			var _this = this;
			for(var i=0;i<$obj.length;i++){
				(function(index){
					_this.onEvent($obj[index],event,function(){
						callback && typeof callback === "function" && callback.call(this,index);
						if(isHide)_this.menu.style.display = "none";
					});
				})(i);
			}
		},
		
		//事件监听
		onEvent:function (dom,type,callback){ //事件绑定
            if(document.addEventListener){//高版本
                dom.addEventListener(type,callback,false);
            }else if(document.attachEvent){//IE低版本
                dom.attachEvent("on"+type,callback);
            }else{//用on绑定
                dom["on"+type] = callback;
            }
        },
        
        //桌面文件
        defaluteFile : function(data){
        	var files = "";
        	for(var i=0;i<data.length;i++){
        		var fileType = data[i].type;
        		if(fileType === "folders") {
        			
        			files += '<div class="file folders" id="'+data[i].typeId+'">'+
							'	<div class="fileIcon icon"></div>'+
							'	<p class="fileName">'+data[i].title+'</p>'+
							'</div>';
				}else{
					files += '<div class="file" id="'+data[i].typeId+'">'+
							'	<div class="icon '+data[i].type+'"></div>'+
							'	<p class="fileName">'+data[i].title+'</p>'+
							'</div>';
				}
        	}
        	return files;
        },
        
        //元素居中
        getCenter:function(obj){
        	var _this = this;
			var height = parseInt(_this.getStyle(obj,"height"));
			var width = parseInt(_this.getStyle(obj,"width"));
			var winW = window.innerWidth;
			var winH = window.innerHeight;
			var left = (winW - width)/2;
			var top =  (winH - height)/2;
			mTween(obj, {left:left,top:top}, 300, "easeIn");
		},
        
        //获取计算后的值
        getStyle : function(dom,attr){
			return window.getComputedStyle ? window.getComputedStyle(dom,false)[attr]:dom.currentStyle[attr];
		}
	}
	function $(id){
    	return document.getElementById(id);
   };
	window.myDesk = new MyDesk;
})();
