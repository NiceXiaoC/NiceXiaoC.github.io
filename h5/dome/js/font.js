/*(function () {
    document.addEventListener('DOMContentLoaded', function () {
        var html = document.documentElement;
        var windowWidth = html.clientWidth; 
        html.style.fontSize = windowWidth / 750 * 100+ 'px';
    }, false);
})();
*/

(function () {
    document.addEventListener('DOMContentLoaded', function () {
        setSize();
    }, false);
    
    document.body.onresize = function(){
    	console.log(1);
    	setSize();
    }
    function setSize(){
    	var html = document.documentElement;
        var windowWidth = html.clientWidth; 
      	/*if(windowWidth>=750){
        	windowWidth = 320;
        }*/
        html.style.fontSize = windowWidth * 100 / 750 + 'px';
    }
    
    
})();