var pictureWall = document.getElementById("pictureWall");
var panel = document.getElementById("panel");
var swite = document.getElementById("swite");
var imgs = swite.querySelectorAll("li");
var btns = panel.querySelectorAll(".btns");
var xDeg = 0,yDeg = -10,xs = 0,ys = 0,p=null;
var isRoate = true;
var is3D = true;

var wrap = document.getElementById("wrap");
var oL = wrap.querySelectorAll("li");
var len = oL.length;
var Deg = 360/len;

setTimeout(function(){
	rotates();
},100);


btns[0].onclick = function(){
	var _this = this;
	if(!isRoate){
		if(!is3D){
			Out3d();
			setTimeout(ddd,1800);
		}else{
			ddd();
		}
		
		function ddd(){
			wrap.style.opacity = "0";
			xDeg = 0,yDeg = -10,xs = 0,ys = 0,p=null; //重新初始化
			is3D = true;
			swite.style.opacity = "1";
			swite.style.transform = "scale(1)";
			clears(_this);
			pictureWall.classList.remove("heartbeat");
			isRoate = true;
			rotates();
		}
		
	}
}

btns[1].onclick = function(){
	if(!isRoate){
		clears(this);
		if(!is3D){
			Out3d();
			setTimeout(ccc,1500)
		}else{
			ccc();
		}
		
		
		
		function ccc(){
			wrap.style.opacity = "0";
			xDeg = 0,yDeg = -10,xs = 0,ys = 0,p=null; //重新初始化
			is3D = true;
			swite.style.opacity = "1";
			swite.style.transform = "scale(1)";
			swite.style.transition = "all 1s";
			swite.style.transform = "scale(1)";
			swite.style.opacity = "1";
			pictureWall.classList.add("heartbeat");
		}
	}
	return false;
};
btns[2].onclick = function(){
	if(is3D){
		swite.style.transition = "all 1s";
		swite.style.transform = "scale(10)";
		swite.style.opacity = "0";
		
		setTimeout(function(){
			swite.style="";
			swite.style.transform = "scale(0)";
			wrap.style = "";
			xDeg = 0,yDeg = -10,xs = 0,ys = 0,p=null; //重新初始化
			wrap.style.opacity = "1";
			setTimeout(drag3d,300);
		},1000);
		is3D = false;
	}
	
};

document.onmousedown = function(e){
	clearInterval(p);
	var x1 = e.clientX;
	var y1 = e.clientY;
	document.onmousemove = function(e){
		xs = e.clientX - x1;
		ys = e.clientY - y1;
		x1 = e.clientX;
		y1 = e.clientY;
		xDeg += xs*0.3;
		yDeg -= ys*0.1;
		wrap.style.transform = "perspective(1000px) rotateX("+yDeg+"deg) rotateY("+xDeg+"deg)";
	};
	
	document.onmouseup = function(){
		p = setInterval(function(){
			if(Math.abs(xs)<0.5&&Math.abs(ys)<0.5){clearInterval(p)};
			xs = xs*0.95;
			ys = ys*0.95;
			xDeg += xs*0.3;
			yDeg -= ys*0.1;
			wrap.style.transform = "perspective(1000px) rotateX("+yDeg+"deg) rotateY("+xDeg+"deg)";
		},30);
		document.onmousemove = null;
		document.onmouseup = null;
	};
	return false;
};


function clears(obj){
	for(var i=0;i<btns.length;i++){
		btns[i].classList.remove("active");
	}
	obj.classList.add("active");
}

function rotates(){
	var endNum = 0;
	for(var i=0;i<imgs.length;i++){
		(function(i){
			setTimeout(function(){
				mothion(imgs[i],'1s',function(){
					this.style.transform = "scale(0)";
				},function(){
					mothion(this,'1s',function(){
						this.style.transform = "scale(1)";
						this.style.opacity = 0;
					},function(){
						endNum ++;
						if(endNum==imgs.length){
							//console.log("wanl");
							getBig();
						}
					});
				});
				
			},Math.random()*1000);
		})(i);
	}
}



function getBig(){
	var num = 0;
	for(var i=0;i<imgs.length;i++){
		imgs[i].style.transition = "",
		imgs[i].style.transform = "rotateY(0deg) translateZ(-" +Math.random()*500 + "px)";
		(function(i){
			setTimeout(function() {
				mothion(imgs[i],'2s',function(){
					this.style.opacity = 1;
					this.style.transform = "rotateY(-360deg) translateZ(0)"
				},function(){
					num ++;
					if(num==imgs.length){
						for(var j=0;j<imgs.length;j++){
							imgs[j].style = "";
							isRoate = false;
						}
					}
				});
			},Math.random()*1000);
		})(i);
	}
}

function mothion(obj,time,dofn,callback){
	obj.style.transition = time;
	dofn.call(obj);
	var called = false;
	obj.addEventListener('transitionend',function(){
		if(!called){
			callback && callback.call(obj);
			called = true;
			obj.removeEventListener("transitionend",callback,false);
		}
	},false);
}

function drag3d(){
	for (var i=len-1;i>=0;i--){
		oL[i].style.transition = "1s "+(len-i)*0.15+"s transform,.5s "+(1+len*0.15)+"s opacity";
		oL[i].style.transform = 'rotateY('+Deg*i+'deg) translateZ(350px)';
	}
}

function Out3d(){
	for(var i=0;i<=len-1;i++){
		oL[i].style.transition = "1s "+(i)*0.15+"s transform";
		oL[i].style.transform = 'rotateY('+0+'deg) translateZ(0px)';
	}
}
