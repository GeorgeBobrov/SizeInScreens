var mainConteiner = document.body;
if (document.URL.startsWith("https://www.youtube.com/"))
	mainConteiner = document.querySelector('ytd-app')

var idAddresses = 'Addresses';
var observer;

if (! observer)
	addObservers();

function addObservers() {
	window.addEventListener("resize", windowResize);
	window.addEventListener("scroll", windowResize);
	observer = new ResizeObserver(windowResize);
	observer.observe(mainConteiner);
}	

function windowResize(ev) {
	// if (ev instanceof Event) {
	// 	if (ev.type == "resize")
	// 		console.log("window.resize", window.innerHeight);
	// 	if (ev.type == "scroll")
	// 		console.log("window.scroll", window.pageYOffset);
	// }
	// if (ev instanceof Array)
	// 	for (el of ev)
	// 		console.log("body.resize", el.contentRect.height)

	var SizeInScreens = document.querySelectorAll("#SizeInScreens");
	if (SizeInScreens.length == 0) return;

	let heightWindow = window.innerHeight;
	let curOffset =	window.pageYOffset;
	let heightBodyAll = mainConteiner.scrollHeight;

	for (el of SizeInScreens)
		el.innerText = Math.ceil(curOffset/heightWindow) + " / " + Math.round(heightBodyAll/heightWindow)
};


var floatSizeInScreens = createSizeInScreensElement();
document.body.prepend(floatSizeInScreens);
windowResize();
floatSizeInScreens.style.left = window.innerWidth - parseInt(floatSizeInScreens.offsetWidth) - 50 + "px";


function createSizeInScreensElement(){
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

	var divButtons = document.createElement("div"); 
	divButtons.id = "SISButtons";
	divButtons.style.display = "none"

	// Added buttons for automatic launch on any given site
	var buttonAdd = document.createElement("button"); 
	buttonAdd.innerHTML = "+";
	buttonAdd.title = "Add address";
	divButtons.appendChild(buttonAdd);

	var buttonRemove = document.createElement("button"); 
	buttonRemove.innerHTML = "-";
	buttonRemove.style.display = "none";
	buttonRemove.title = "Remove address";	
	divButtons.appendChild(buttonRemove);

	var buttonClose = document.createElement("button"); 
	buttonClose.innerHTML = "X";
	buttonClose.title = "Close";	
	divButtons.appendChild(buttonClose);
	buttonClose.onclick = function(event) {
		div.remove();
	};

	div.appendChild(divButtons);	
	checkAddressInSavedAddresses();

	let timerMouseEnter;
	div.onmouseenter = function(event) {
		span.style.cursor = "move";
		timerMouseEnter = setTimeout(function() {
			divButtons.style.display = "block"
			span.style.cursor = "unset";	
			// setTimeout(function() {	
			// }, 500) 			
		}, 500) 
	}

	div.onmouseleave = function(event) {
		divButtons.style.display = "none";
		clearTimeout(timerMouseEnter);
	}
	buttonAdd.onclick = function(event) {
		newAddr = prompt('Always show SizeInScreens if URL address starts like this?', document.URL)
		if (!newAddr) return;
	
		chrome.storage.local.get([idAddresses], function(data) {
			let addresses = data[idAddresses] || [];
		
			if (addresses.indexOf(newAddr) > -1)
				return;
			addresses.push(newAddr)
	
			chrome.storage.local.set({ [idAddresses]: addresses }, function() {
				console.info("SizeInScreens: Saved new Address " + newAddr);
				checkAddressInSavedAddresses();
			});
		});
	}
	
	buttonRemove.onclick = function(event) {
		chrome.storage.local.get([idAddresses], function(data) {
			let addresses = data[idAddresses] || [];

			let newAddresses = [];
			let wasDeleted = false;
	
			for (const addr of addresses) {
				if (document.URL.startsWith(addr) && !wasDeleted) 
					wasDeleted = confirm(`Don't show SizeInScreens if URL address starts like this "${addr}" ?`);
				else
					newAddresses.push(addr);			
			}
	
			if (wasDeleted)
				chrome.storage.local.set({ [idAddresses]: newAddresses }, function() {
					console.info("SizeInScreens: Address was deleted");
					checkAddressInSavedAddresses();
				});		
	
		});
	}
	return div;

	function checkAddressInSavedAddresses() {
		buttonAdd.style.display = "unset";
		buttonRemove.style.display = "none";
		
		chrome.storage.local.get([idAddresses], function(data) {
			let addresses = data[idAddresses] || [];
			for (const addr of addresses)
				if (document.URL.startsWith(addr)) {
					buttonAdd.style.display = "none";
					buttonRemove.style.display = "unset";
					buttonRemove.title = `Remove address "${addr}"`;
					break;
				}
		});	
	}
}


floatSizeInScreens.onclick = function(event) {
	windowResize();
}

floatSizeInScreens.ondblclick = function(event) {
	this.remove();
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
		if (this.style.left)
			curX = parseInt(this.style.left);
		else
			curX = 0;
		if (this.style.top)
			curY = parseInt(this.style.top);
		else
			curY = 0;			
		this.style.left = curX + event.movementX + "px"
		this.style.top = curY + event.movementY + "px"
		this.onmouseleave();
	} 
}
