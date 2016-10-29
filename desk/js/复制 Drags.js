	//拖拽的构造函数
	function Drag(){}
	//元素拖拽三要素：
	//1:加定位 position:absolute/fixed; 改变的元素:left 和top
	//2:绑定事件:onmousedown (onmousemove onmouseup)---document
	//3:清空鼠标事件
	var dragZindex = 0;
	Drag.prototype.init = function(options){
		var dragObj = this;
		//参数的混入 jquery $.extend
		var opts = mix({},{arrow:"",handler:"",parent:"",position:"relative"},options);
		var boxDom = dom(opts.id);
		//父元素
		var parentDom = dom(opts.id);
		if(opts.handler){
			boxDom = boxDom.children[opts.handler*1-1];
		}
		
		//获取父盒子对象	
		var parentBoxDom = dom(opts.parent);
		if(parentBoxDom)parentBoxDom.style.position = opts.position;

		var mark  = false;
		boxDom.onmousedown = function(e){
			parentDom.style.zIndex = ++dragZindex;
			//拿到元素的位置
			var sleft = parentDom.offsetLeft;
			var stop = parentDom.offsetTop;
			//获取最大的距离
			var maxWidth  = Math.max(window.innerWidth,document.body.clientWidth);
			var maxHeight  = Math.max(window.innerHeight,document.body.clientHeight);
			var maxLeft = (parentBoxDom?parentBoxDom.offsetWidth:maxWidth) - parentDom.offsetWidth;
			var maxTop = (parentBoxDom?parentBoxDom.offsetHeight:maxHeight) -parentDom.offsetHeight;//潜在的问题?
			//拿到鼠标的位置
			var pos = getXY(e);
			mark = true;
			document.onmousemove = function(e){
				if(mark){
					//移动鼠标的位置
					var pos2 = getXY(e);
					var nleft = pos2.x - pos.x + sleft;
					var ntop = pos2.y - pos.y + stop;
					//边界判断

					if(nleft<=0)nleft = 0;
					if(ntop<=0)ntop = 0;
					if(nleft>=maxLeft)nleft = maxLeft;
					if(ntop>=maxTop)ntop = maxTop;
					//改变位置
					if(opts.arrow=="left"){
						parentDom.style.left = nleft+"px";
					}else if(opts.arrow=="top"){
						parentDom.style.top = ntop+"px";
					}else{
						parentDom.style.left = nleft+"px";
						parentDom.style.top = ntop+"px";
					}
				}
			};
			
			//鼠标松开的时候，释放拖动
			document.onmouseup = function(){
				this.onmousemove = null;
				this.onmouseup = null;
				mark = false;
				if(opts.callback)opts.callback.call(parentDom);
			};
		};
	};