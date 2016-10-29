(function(){// 
	var 项目名 = function(){
		var xxx = (function(){ //匿名函数自执行【类似闭包】
			var 全局1 = "htttp://url....";
			var 全局2 = "htttp://url....";
			var 全局3 = "htttp://url....";
			var jsons = {
				init : function(){ //初始化
					jsons.serach();
					jsons.upLoad();
				},
				serach : function(){ //搜索
					...
				},
				upLoad : function(){ //上传
				},
				.... 其他方法
			}
			return jsons.init(); //返回初始化方法，避免修改其他方法
		})();
		return xxx;
	}
	window.外界接口名 = 项目名;
})();
