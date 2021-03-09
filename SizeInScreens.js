/*global chrome*/
var mainConteiner = document.body;
if (document.URL.startsWith('https://www.youtube.com/'))
	mainConteiner = document.querySelector('ytd-app')

var idAddresses = 'Addresses';
var observer;

if (!observer)
	addObservers();

function addObservers() {
	window.addEventListener('resize', windowResize);
	window.addEventListener('scroll', windowResize);
	observer = new ResizeObserver(windowResize);
	observer.observe(mainConteiner);
}

function windowResize(ev) {
	// if (ev instanceof Event) {
	// 	if (ev.type == 'resize')
	// 		console.log('window.resize', window.innerHeight);
	// 	if (ev.type == 'scroll')
	// 		console.log('window.scroll', window.pageYOffset);
	// }
	// if (ev instanceof Array)
	// 	for (const el of ev)
	// 		console.log('body.resize', el.contentRect.height)

	let SizeInScreens = document.querySelectorAll('#SizeInScreens');
	if (SizeInScreens.length == 0) return;

	let heightWindow = window.innerHeight;
	let curOffset =	window.pageYOffset;
	let heightBodyAll = mainConteiner.scrollHeight;

	for (const el of SizeInScreens)
		el.innerText = Math.ceil(curOffset/heightWindow) + ' / ' + Math.round(heightBodyAll/heightWindow)
}


var floatSizeInScreens = createSizeInScreensElement();
document.body.prepend(floatSizeInScreens);
windowResize();


function createSizeInScreensElement() {
	console.log('Create SizeInScreens element');
	let div = document.createElement('div');
	div.id = 'floatSizeInScreens';
	div.style.position = 'fixed';
	div.style.zIndex = 9999;
	// div.style.border = '1px solid lightgrey';
	div.style.backgroundColor = 'white';
	div.style.padding = '0 4px';
	div.style.right = 15 + 'px';
	div.style.top = 15 + 'px';
	div.style.userSelect = 'none';
	div.draggable = true;

	let span = document.createElement('span');
	span.innerHTML = '0';
	span.id = 'SizeInScreens';

	div.appendChild(span);

	let divButtons = document.createElement('div');
	divButtons.id = 'SISButtons';
	divButtons.style.display = 'none'

	const buttonStyle = `
		font-family: Courier, monospace;
		padding: 0px 0px;
		width: 48%;
		line-height: 1.15;
		border: revert;`;

	// Added buttons for automatic launch on any given site
	let buttonAdd = document.createElement('button');
	buttonAdd.innerHTML = '+';
	buttonAdd.title = 'Always show SizeInScreens on this site';
	buttonAdd.style = buttonStyle;
	divButtons.appendChild(buttonAdd);

	let buttonRemove = document.createElement('button');
	buttonRemove.innerHTML = '-';
	buttonRemove.style.display = 'none';
	buttonRemove.title = "Don't show SizeInScreens on this site";
	buttonRemove.style = buttonStyle;
	divButtons.appendChild(buttonRemove);

	let buttonClose = document.createElement('button');
	buttonClose.innerHTML = '✖';
	buttonClose.title = 'Close SizeInScreens';
	buttonClose.style = buttonStyle + 'color: coral; margin-inline-start: 4%;';
	divButtons.appendChild(buttonClose);
	buttonClose.onclick = function(event) {
		div.remove();
	};

	div.appendChild(divButtons);
	// checkAddressInSavedAddresses();

	let timerMouseEnter;
	div.onmouseenter = function(event) {
		span.style.cursor = 'move';
		timerMouseEnter = setTimeout(function() {
			checkAddressInSavedAddresses();
			divButtons.style.display = 'block'
			span.style.cursor = '';
		}, 500);
	}

	div.onmouseleave = function(event) {
		divButtons.style.display = 'none';
		clearTimeout(timerMouseEnter);
	}

	buttonAdd.onclick = function(event) {
		let newAddr = prompt(`Always show SizeInScreens if URL address starts like this? 
(you can delete last part of address and leave only the site address)`, document.URL);
		if (!newAddr) return;

		chrome.storage.local.get([idAddresses], function(data) {
			let addresses = data[idAddresses] || [];

			if (addresses.indexOf(newAddr) > -1)
				return;
			addresses.push(newAddr)

			chrome.storage.local.set({ [idAddresses]: addresses }, function() {
				console.info('SizeInScreens: Saved new Address ' + newAddr);
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
					wasDeleted = confirm(`Don't show SizeInScreens if URL address starts like this 
'${addr}' ?`);
				else
					newAddresses.push(addr);
			}

			if (wasDeleted)
				chrome.storage.local.set({ [idAddresses]: newAddresses }, function() {
					console.info('SizeInScreens: Address was deleted');
					checkAddressInSavedAddresses();
				});

		});
	}
	return div;

	function checkAddressInSavedAddresses() {
		chrome.storage.local.get([idAddresses], function(data) {
			let addresses = data[idAddresses] || [];
			let savedAddress = false;
			for (const addr of addresses)
				if (document.URL.startsWith(addr)) {
					savedAddress = true;
					break;
				}

			buttonAdd.style.display = savedAddress ? 'none' : '';
			buttonRemove.style.display = savedAddress ? '' : 'none';
		});
	}
}


floatSizeInScreens.onclick = function(event) {
	windowResize();
}

floatSizeInScreens.ondblclick = function(event) {
	chrome.storage.local.get([idAddresses], function(data) {
		let addresses = data[idAddresses] || [];
		alert(addresses.join('\n'))
	});
}


var savedOffsetX;
var savedOffsetY;
var SizeInScreensDrag = false;

floatSizeInScreens.ondragstart = function(event) {
	let SISButtons = this.querySelector('#SISButtons');
	if ((SISButtons.style.display === 'block') && (event.offsetY > SISButtons.offsetTop)) {
		event.preventDefault();  //cancel dragging by grabbing buttons
		return;
	}

	savedOffsetX = event.offsetX;
	savedOffsetY = event.offsetY;
	SizeInScreensDrag = true;
	this.onmouseleave();  //hide buttons while dragging
}

floatSizeInScreens.ondragend = function(event) {
	let movementX = event.offsetX - savedOffsetX;
	let movementY = event.offsetY - savedOffsetY;

	let newLeft = this.offsetLeft + movementX;
	let newTop = this.offsetTop + movementY;

	if (newLeft < window.visualViewport.width / 2) {
		this.style.left = newLeft + 'px';
		this.style.right = '';
	} else {
		this.style.right = window.visualViewport.width - newLeft - this.offsetWidth + 'px';
		this.style.left = '';
	}
	this.style.top = newTop + 'px';

	SizeInScreensDrag = false;
}

window.addEventListener('dragover', windowDragower);

function windowDragower(event) {
	if (SizeInScreensDrag)
		event.preventDefault();  //change the default non-drag icon to allow-drag icon
}