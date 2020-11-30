window.addEventListener("resize", windowResize);
window.addEventListener("scroll", windowResize);
document.body.addEventListener("scroll", windowResize);
function windowResize() {
	var SizeInScreens = document.getElementById("SizeInScreens");
	if (! SizeInScreens) return;
	if (floatSizeInScreens.style.color == disableColor) return;

	let heightWindow = window.innerHeight;
	let curOffset =	window.pageYOffset;

	let heightBodyAll = document.body.scrollHeight;
	if (document.URL.startsWith("https://www.youtube.com/"))
		heightBodyAll = document.querySelector('ytd-app').scrollHeight;

	SizeInScreens.innerText = Math.ceil(curOffset/heightWindow) + " / " + Math.round(heightBodyAll/heightWindow);
};


new ResizeObserver(windowResize).observe(document.body);

document.body.prepend(createCheckboxElement());
windowResize();
floatSizeInScreens.style.left = window.innerWidth - parseInt(floatSizeInScreens.offsetWidth) - 50 + "px";

var disableColor = "white";

function createCheckboxElement(){
	console.log("Create SizeInScreens element"); 
	var div = document.createElement("div"); 
	div.id = "floatSizeInScreens";
	div.style.position = "fixed";
	div.style.zIndex = 9999;
	// div.style.border = "1px solid lightgrey";
	div.style.backgroundColor = "white";
	div.style.padding = "0 4px";
	div.style.left = window.innerWidth - 50 + "px";
	div.style.top = 15 + "px";
	div.style.userSelect = "none";

	var span = document.createElement("span");	
	span.innerHTML = "0";
	span.id = "SizeInScreens";

	div.appendChild(span);
	return div;
}

floatSizeInScreens.onclick = function(event) {
	windowResize();
}

floatSizeInScreens.ondblclick = function(event) {
	floatSizeInScreens.remove()
	// if (floatSizeInScreens.style.color !== disableColor) {
	// 	floatSizeInScreens.style.color = disableColor;
	// 	floatSizeInScreens.style.border = "1px solid lightgrey";
	// } else {
	// 	floatSizeInScreens.style.color = "";
	// 	floatSizeInScreens.style.border = "";
	// }
}


var mousePressed = false; 
floatSizeInScreens.onmousedown = function(event) {
	mousePressed = true; 
}

document.addEventListener("mouseup", function(event) {
	mousePressed = false; 
});

floatSizeInScreens.onmousemove = function(event) {
	if (mousePressed) {
		let curX;
		let curY;
		if (floatSizeInScreens.style.left)
			curX = parseInt(floatSizeInScreens.style.left);
		else
			curX = 0;
		if (floatSizeInScreens.style.top)
			curY = parseInt(floatSizeInScreens.style.top);
		else
			curY = 0;			
		floatSizeInScreens.style.left = curX + event.movementX + "px"
		floatSizeInScreens.style.top = curY + event.movementY + "px"
	} 
}