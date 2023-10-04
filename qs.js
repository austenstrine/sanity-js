//The following 5 definitions just make it so I don't have to worry about the capital E in forEach. (Might be more definitions are to come in this regard)
Object.defineProperty(Array.prototype, 'foreach', {
	value: function(...params) { return this.forEach(...params); }
});
Object.defineProperty(NodeList.prototype, 'foreach', {
	value: function(...params) { return this.forEach(...params); }
});
Object.defineProperty(HTMLCollection.prototype, 'foreach', {
	value: function(...params) { return this.forEach(...params); }
});
Object.defineProperty(Set.prototype, 'foreach', {
	value: function(...params) { return this.forEach(...params); }
});
Object.defineProperty(Map.prototype, 'foreach', {
	value: function(...params) { return this.forEach(...params); }
});

//jquery-like helpers for class manipulation on elements
Object.defineProperty(Element.prototype, 'addClass', {
	value: function(...params) { return this.classList.add(...params); }
});
Object.defineProperty(Element.prototype, 'removeClass', {
	value: function(...params) { return this.classList.remove(...params); }
});
Object.defineProperty(Element.prototype, 'toggleClass', {
	value: function(...params) { return this.classList.toggle(...params); }
});
Object.defineProperty(Element.prototype, 'hasClass', {
	value: function(...params) { return this.classList.contains(...params); }
});
Object.defineProperty(Element.prototype, 'containsClass', {
	value: function(...params) { return this.hasClass(...params); }
});


/**pTimeout is roughly the same as setTimeout, except it returns a promise with a cancel
 * operation instead of a timeoutId.
 * E.G.
 * Instead of:
 *   const timeoutId = setTimeout(()=>{doStuff = 'here';}, 250);
 *   //I hate this because if the function has any length, the second parameter usually
 *   //gets accidentally omitted
 * you would do:
 *   const timeoutPromise = pTimeout(250);
 *   timeoutPromise.then(()=>{doStuff = 'here';});
 * And if you wanted to cancel, instead of:
 *   clearTimeout(timeoutId);
 * you would do:
 *   timeoutPromise.cancel();
 *
 * The advantage is we get to use the promise API instead of the outdated setTimeout system,
 * which is significantly clunkier; there's almost zero learning overhead for the programmer.
 */
class TimeoutPromise {
	constructor(executor, delay) {
		let timeoutId = null;
		let cancelPromiseClosure = null;

		//super refers to the constructor of the superclass (parent class)
		this.promise = new Promise((resolve, reject) => {
			cancelPromiseClosure = reject;
			timeoutId = setTimeout(() => {
				executor(resolve, reject);
			}, delay);
		});

		this.cancel = ()=>{
			if(timeoutId) {
				clearTimeout(timeoutId);
				timeoutId = null;
				cancelPromiseClosure(new Error('Timeout operation interrupted before execution.'));
				cancelPromiseClosure = null;
			}
		};

		this.then = (...params)=>{
			return this.promise.then(...params);
		};

		this.catch = (...params)=>{
			return this.promise.catch(...params);
		};
	}
}
function pTimeout(delay) {
	return new TimeoutPromise((resolve,reject) => {
		resolve();
	}, delay);
}
function getShadowDimensions(element) {
	const transitionPropertyOriginal = element.style.transitionProperty;
	const transitionDurationOriginal = element.style.transitionDuration;
	const heightOriginal = element.style.height;
	const widthOriginal = element.style.width;
	const paddingOriginal = element.style.padding;
	const marginOriginal = element.style.margin;
	const displayOriginal = element.style.display;
	const visibilityOriginal = element.style.visibility;

	element.style.transitionProperty = 'none';
	element.style.transitionDuration = 'none';

	element.style.height = '';
	element.style.width = '';
	element.style.padding = '';
	element.style.margin = '';
	element.style.display = 'block';
	element.style.visibility = 'hidden';

	const height = element.offsetHeight; // or element.getBoundingClientRect().height
	const width = element.offsetWidth;

	element.style.visibility = visibilityOriginal;
	element.style.display = displayOriginal;
	element.style.margin = marginOriginal;
	element.style.padding = paddingOriginal;
	element.style.width = widthOriginal;
	element.style.height = heightOriginal;
	element.style.transitionDuration = transitionDurationOriginal;
	element.style.transitionProperty = transitionPropertyOriginal;

	return [height, width];
}

function getShadowHeight(element) {
	return getShadowDimensions(element)[0];
}
function getShadowWidth(element) {
	return getShadowDimensions(element)[1];
}

Object.defineProperty(Element.prototype, 'slideUp', {
	value: function(duration = 300) {
		return slideHide(this,duration,'up');
	}
});
Object.defineProperty(Element.prototype, 'slideDown', {
	value: function(duration = 300) {
		return slideShow(this,duration,'up');
	}
});
Object.defineProperty(Element.prototype, 'slideUpFromBottom', {
	value: function(duration = 300) {
		return slideShow(this, duration, 'down');
	}
});
Object.defineProperty(Element.prototype, 'slideDownToBottom', {
	value: function(duration = 300) {
		return slideHide(this, duration, 'down');
	}
});
Object.defineProperty(Element.prototype, 'slideRight', {
	value: function(duration = 300) {
		return slideShow(this, duration, 'left');
	}
});
Object.defineProperty(Element.prototype, 'slideLeft', {
	value: function(duration = 300) {
		return slideHide(this, duration, 'left');
	}
});
Object.defineProperty(Element.prototype, 'slideRightToRight', {
	value: function(duration = 300) {
		return slideHide(this,duration,'right');
	}
});
Object.defineProperty(Element.prototype, 'slideLeftFromRight', {
	value: function(duration = 300) {
		return slideShow(this,duration,'right');
	}
});

function slideHide(element, duration = 300, direction = 'up') {
	if(direction !== 'up' && direction !== 'down' && direction !== 'left' && direction !== 'right') {
		direction = 'up';
	}
	let axis = '';
	switch(direction) {
		case 'up':
		case 'down':
			axis = 'vertical';
			break;
		case 'left':
		case 'right':
			axis = 'horizontal';
			break;
	}
	// Get the computed height of the element
	var computedHeight = window.getComputedStyle(element).height;
	var computedWidth = window.getComputedStyle(element).width;

	// Get original styles
	const transitionPropertyOriginal = element.style.transitionProperty;
	const transitionDurationOriginal = element.style.transitionDuration
	const boxSizingOriginal = element.style.boxSizing;
	const overflowOriginal = element.style.overflow;
	const wordBreakOriginal = element.style.wordBreak;

	const heightOriginal = element.style.height;
	const marginTopOriginal = element.style.marginTop;
	const marginBottomOriginal = element.style.marginBottom;
	const paddingTopOriginal = element.style.paddingTop;
	const paddingBottomOriginal = element.style.paddingBottom;

	const widthOriginal = element.style.width;
	const marginLeftOriginal = element.style.marginLeft;
	const marginRightOriginal = element.style.marginRight;
	const paddingLeftOriginal = element.style.paddingLeft;
	const paddingRightOriginal = element.style.paddingRight;

	// Set initial styles to hide the element
	if(axis == 'vertical') {
		element.style.transitionProperty = 'height, margin, padding';
	}
	else if(axis == 'horizontal') {
		element.style.transitionProperty = 'width, margin, padding';
	}
	element.style.transitionDuration = '0ms'; // Disable transition temporarily
	element.style.boxSizing = 'border-box';
	element.style.overflow = 'hidden';
	element.style.height = computedHeight;
	element.style.width = computedWidth;
	element.style.wordBreak = 'break-all';
	if(axis == 'vertical') {
		element.style.marginTop = '';
		element.style.marginBottom = '';
		element.style.paddingTop = '';
		element.style.paddingBottom = '';
	}
	else if(axis == 'horizontal') {
		element.style.marginLeft = '';
		element.style.marginRight = '';
		element.style.paddingLeft = '';
		element.style.paddingRight = '';
	}

	element.offsetHeight; // Trigger reflow
	element.offsetWidth; // Trigger reflow

	// Set final styles to transition to the computed height
	element.style.transitionDuration = duration + 'ms';

	if(axis == 'vertical') {
		element.style.height = '0px';
		element.style.marginTop = direction == 'down' ? computedHeight : '0px';
		element.style.marginBottom = direction == 'up' ? computedHeight : '0px';
		element.style.paddingTop = '0px';
		element.style.paddingBottom = '0px';
	}
	else if(axis == 'horizontal') {
		element.style.width = '0px';
		element.style.marginLeft = direction == 'right' ? computedHeight : '0px';
		element.style.marginRight = direction == 'left' ? computedHeight : '0px';
		element.style.paddingLeft = '0px';
		element.style.paddingRight = '0px';
	}
	element.offsetHeight; // Trigger reflow
	element.offsetWidth; // Trigger reflow

	return pTimeout(duration).then(()=>{
		element.style.transitionProperty = transitionPropertyOriginal;
		element.style.transitionDuration = transitionDurationOriginal;
		element.style.boxSizing = boxSizingOriginal;
		element.style.overflow = overflowOriginal;
		element.style.wordBreak = wordBreakOriginal;

		element.style.height = heightOriginal;
		element.style.marginTop = marginTopOriginal;
		element.style.marginBottom = marginBottomOriginal;
		element.style.paddingTop = paddingTopOriginal;
		element.style.paddingBottom = paddingBottomOriginal;

		element.style.width = widthOriginal;
		element.style.marginLeft = marginLeftOriginal;
		element.style.marginRight = marginRightOriginal;
		element.style.paddingLeft = paddingLeftOriginal;
		element.style.paddingRight = paddingRightOriginal;

		element.style.display = 'none';
		return element;
	});
}

function slideShow(element, duration = 300, direction = 'down') {
	if(direction !== 'up' && direction !== 'down' && direction !== 'left' && direction !== 'right') {
		direction = 'down';
	}
	let axis = '';
	switch(direction) {
		case 'up':
		case 'down':
			axis = 'vertical';
			break;
		case 'left':
		case 'right':
			axis = 'horizontal';
			break;
	}
	let [shadowHeight, shadowWidth] = getShadowDimensions(element);
	shadowHeight += 'px';
	shadowWidth += 'px';
	// console.error(direction, axis, shadowHeight, shadowWidth);

	const transitionPropertyOriginal = element.style.transitionProperty;
	const transitionDurationOriginal = element.style.transitionDuration
	const boxSizingOriginal = element.style.boxSizing;
	const overflowOriginal = element.style.overflow;
	const wordBreakOriginal = element.style.wordBreak;

	const heightOriginal = element.style.height;
	const marginTopOriginal = element.style.marginTop;
	const marginBottomOriginal = element.style.marginBottom;
	const paddingTopOriginal = element.style.paddingTop;
	const paddingBottomOriginal = element.style.paddingBottom;

	const widthOriginal = element.style.width;
	const marginLeftOriginal = element.style.marginLeft;
	const marginRightOriginal = element.style.marginRight;
	const paddingLeftOriginal = element.style.paddingLeft;
	const paddingRightOriginal = element.style.paddingRight;

	// Set initial styles
	element.style.transitionProperty = 'none';
	element.style.transitionDuration = '0ms';
	element.style.wordBreak = 'break-all';
	element.style.boxSizing = 'border-box';
	element.style.overflow = 'hidden';
	element.style.display = 'block';//should this be block?

	element.offsetHeight; // Trigger reflow
	element.offsetWidth; // Trigger reflow

	if(axis == 'vertical') {
		element.style.height = '0px';
		element.style.width = shadowWidth;
		element.style.marginTop = direction == 'down' ? shadowHeight : '0px';
		element.style.marginBottom = direction == 'up' ? shadowHeight : '0px';
		element.style.paddingTop = '0px';
		element.style.paddingBottom = '0px';
	}
	else if(axis == 'horizontal') {
		element.style.width = '0px';
		element.style.height = shadowHeight;
		element.style.marginLeft = direction == 'right' ? shadowWidth : '0px';
		element.style.marginRight = direction == 'left' ? shadowWidth : '0px';
		element.style.paddingLeft = '0px';
		element.style.paddingRight = '0px';
	}

	element.offsetHeight; // Trigger reflow
	element.offsetWidth; // Trigger reflow

	if(axis == 'vertical') {
		element.style.transitionProperty = 'height, margin, padding';
	}
	else if(axis == 'horizontal') {
		element.style.transitionProperty = 'width, margin, padding';
	}
	else {
		console.error(axis);
	}
	element.style.transitionDuration = duration + 'ms';
	element.offsetHeight; // Trigger reflow
	element.offsetWidth; // Trigger reflow
	if(axis == 'vertical') {
		element.style.height = shadowHeight;
		element.style.marginTop = marginTopOriginal;
		element.style.marginBottom = marginBottomOriginal;
		element.style.paddingTop = paddingTopOriginal;
		element.style.paddingBottom = paddingBottomOriginal;
	}
	else if(axis == 'horizontal') {
		element.style.width = shadowWidth;
		element.style.marginLeft = marginLeftOriginal;
		element.style.marginRight = marginRightOriginal;
		element.style.paddingLeft = paddingLeftOriginal;
		element.style.paddingRight = paddingRightOriginal;
	}

	return pTimeout(duration).then(()=>{
		// Set final styles to transition to height/width 0
		element.style.transitionProperty = transitionPropertyOriginal;
		element.style.transitionDuration = transitionDurationOriginal;
		element.style.boxSizing = boxSizingOriginal;
		element.style.overflow = overflowOriginal;
		element.style.wordBreak = wordBreakOriginal;

		element.style.height = heightOriginal;

		element.style.width = widthOriginal;
	});
}

//jquery-like helpers for css manipulation
function kebabToCamelCase(kebabCaseString) {
	return kebabCaseString.replace(/-([a-z])/g, function(match, letter) {
		return letter.toUpperCase();
	});
}
Object.defineProperty(Element.prototype, 'styling', {
	value: function(name, value) {
		if(typeof name === 'object') {
			const cssSetObject = name;
			for(const propertyName in cssSetObject) {
				this.style[kebabToCamelCase(propertyName)] = cssSetObject[propertyName];
			}
			return this;
		}
		else if(undefined === value) {
			return this.style[kebabToCamelCase(name)];
		}
		else {
			this.style[kebabToCamelCase(name)] = value;
			return this;
		}
	}
});

//JavaScript does not have a "unique" or "distinct" function, so I'm adding one.
Object.defineProperty(Array.prototype, 'unique', {
	value: function() { return [...new Set(this)]; }
});

//JavaScript does not have an "intersect" function, so I'm adding one.

//This function returns an array containing every unique element that is
//in every given array (NOT INCLUDING the array it is called on).

//PLEASE NOTE: Array.intersect() operates ONLY on the passed parameters,
//where Array.intersection() operates on the passed parameters AND the
//array it is called on.
Object.defineProperty(Array.prototype, 'intersect', {
	value: function(...arrays) {
		let intersection = [];
		let firstArray = [];
		let firstArrayIndex = null;
		for(const index in arrays) {
			arrays[index] = arrays[index].unique();
			if(arrays[index].length < firstArray.length) {
				firstArray = arrays[index];
				firstArrayIndex = index;
			}
		}
		arrays.splice(firstArrayIndex, 1);
		for(const element of firstArray) {
			let elementIntersects = true;
			for(const otherArray of arrays) {
				if(!otherArray.includes(element)) {
					elementIntersects = false;
					break;
				}
			}
			if(elementIntersects) {
				intersection.push(element)
			}
		}
		return intersection;
	}
});
//This function returns an array containing every unique element that is
//in every given array (INCLUDING the array it is called on).

//PLEASE NOTE: Array.intersect() operates ONLY on the passed parameters,
//where Array.intersection() operates on the passed parameters AND the
//array it is called on.
Object.defineProperty(Array.prototype, 'intersection', {
	value: function(...arrays) {
		arrays.push(this);
		return [].intersect(...arrays);
	}
});

//JavaScript does not have an Array.difference() function, so I made one.
//It is cumulative - if you pass multiple arrays in, it will give you
//every value that is only in ONE of the arrays. In this way it functions
//as the inverse of the intersect/ion functions.
Object.defineProperty(Array.prototype, 'difference', {
	value: function(...arrays) {
		const allValues = this.concat(...arrays).unique();
		arrays.push(this);
		//tracks the number of arrays that include the value
		const numberOfIncludesByValueIndex = allValues.map(v=>0);//makes an array of 0's
		//go through every unique value
		for(const valueIndex in allValues) {
			const value = allValues[valueIndex];
			//go through every array
			for(const array of arrays) {
				//if the array has the value
				if(array.includes(value)) {
					//increment the count for this valueIndex
					numberOfIncludesByValueIndex[valueIndex] += 1;
					//if the count of this valueIndex is more than one
					if(numberOfIncludesByValueIndex[valueIndex] > 1) {
						//exit early for efficiency's sake
						break;
					}
				}
			}
		}
		let difference = [];
		for(const valueIndex in numberOfIncludesByValueIndex) {
			if(numberOfIncludesByValueIndex[valueIndex] == 1) {
				difference.push(allValues[valueIndex]);
			}
		}
		return difference;
	}
});

//simplifies using 'addEventListener'
Object.defineProperty(NodeList.prototype, 'addEventListener', {
	value: function(...params) {
		for(var i = 0; i < this.length; i++) {
			this[i].addEventListener(...params);
		}
	}
});

//psudonym for contains function
Object.defineProperty(DOMTokenList.prototype, 'has', {
	value: function(...params) {
		return this.contains(...params);
	}
});

//The 3 following definitions make it easier to work with small batches
//of FormData by enabling function chaining.
Object.defineProperty(FormData.prototype, 'appending', {
	value: function(...params) {
		this.append(...params)
		return this;
	}
});
Object.defineProperty(FormData.prototype, 'setting', {
	value: function(...params) {
		this.set(...params)
		return this;
	}
});
Object.defineProperty(FormData.prototype, 'deleting', {
	value: function(...params) {
		this.delete(...params)
		return this;
	}
});

//allows you to append an object full of data to the data already in the form
Object.defineProperty(FormData.prototype, 'appendData', {
	value: function(data) {
		let iterableEntries = null;
		if(
			typeof(data) == 'object'
			&& data.constructor.name === 'Object'
		) {
			iterableEntries = Object.entries(data);
		}
		else if(
			typeof(data) == 'object'
			&& data.constructor.name === 'FormData'
		) {//in case they went through the legwork of using a formdata object
			iterableEntries = data.entries();
		}
		if(iterableEntries) {
			for(let entry of iterableEntries) {
				this.append(entry[0], entry[1]);
			}
		}
		return this;
	}
});
//pseudonym for x.querySelector
function qs(...params) {
	if(
		typeof(params[0]) === 'object'
		&& typeof(params[0].querySelector) !== 'undefined'
		&& typeof(params[0].querySelector) === 'function'
	) {
		return params.shift().querySelector(...params);
	}
	return document.querySelector(...params);
}
Object.defineProperty(Document.prototype, 'qs', {
	value: function(...params) { return this.querySelector(...params); }
});
Object.defineProperty(Element.prototype, 'qs', {
	value: function(...params) { return this.querySelector(...params); }
});
Object.defineProperty(DocumentFragment.prototype, 'qs', {
	value: function(...params) { return this.querySelector(...params); }
});
Object.defineProperty(ShadowRoot.prototype, 'qs', {
	value: function(...params) { return this.querySelector(...params); }
});
//pseudonym for x.querySelectorAll
function qsa(...params) {
	if(
		typeof(params[0]) === 'object'
		&& typeof(params[0].querySelectorAll) !== 'undefined'
		&& typeof(params[0].querySelectorAll) === 'function'
	) {
		return params.shift().querySelectorAll(...params);
	}
	return document.querySelectorAll(...params);
}
Object.defineProperty(Document.prototype, 'qsa', {
	value: function(...params) { return this.querySelectorAll(...params); }
});
Object.defineProperty(Element.prototype, 'qsa', {
	value: function(...params) { return this.querySelectorAll(...params); }
});
Object.defineProperty(DocumentFragment.prototype, 'qsa', {
	value: function(...params) { return this.querySelectorAll(...params); }
});
Object.defineProperty(ShadowRoot.prototype, 'qsa', {
	value: function(...params) { return this.querySelectorAll(...params); }
});

//pseudonym for window.getComputedStyle(...).getPropertyValue(...)
function getCss(node, cssName) {
	return window.getComputedStyle(node).getPropertyValue(cssName);
}
Object.defineProperty(Window.prototype, 'getCss', {
	value: function(node, cssName) { return getCss(node,cssName); }
});
Object.defineProperty(Element.prototype, 'getCss', {
	value: function(cssName) { return getCss(this,cssName); }
});

//pseudonym for document.addEventListener('DOMContentLoaded', ...) (stands for 'document ready')
function dr(...params) {
	return document.addEventListener('DOMContentLoaded', ...params);
}

//pseudonym for fetch(...).then(...), initOptions should include 'parse' if you don't want to use the default response.text().
function ft(resource, initOptions) {
	initOptions = initOptions ?? {};
	if(
		typeof(resource) == 'object'
		&& resource.constructor.name === 'SubmitEvent'
	) {
		let formData = new FormData(resource.target);
		if(initOptions) {
			if(typeof(initOptions.body) == 'object') {
				formData.appendData(initOptions.body);
			}
		}
		else {
			initOptions = {};
		}
		initOptions.body = formData;
		let resourceFound = resource.target.action ?? '';
		if(!resourceFound.trim()) {
			resourceFound = resource.target.url ?? '';
		}
		resource = resourceFound;
		initOptions.method = initOptions.method ?? 'POST';
	}
	if(typeof(initOptions.body) == 'object') {
		let formData = new FormData();
		formData.appendData(initOptions.body);
		initOptions.body = formData;
		initOptions.method = initOptions.method ?? 'POST';
	}
	return fetch(resource, initOptions)
		.then((response)=>{
			if(!response.ok) {
				throw response.status+' Error: '+response.statusText;
			}
			return response[initOptions.parse ?? 'text']();
		})
	;
}
//pseudonym for x.addEventListener(...), does not dynamically listen for new elements that match the selector.
function _ael(nodeOrNodelist, type, listener, optionsOrUseCapture, listenerName) {
	// console.log('listener.name',listener.name ?? '');
	let nestedListener = (event)=>{
		if(listener !== null) {
			let _aelTrigger = event.target;
			if(nodeOrNodelist.constructor.name == 'NodeList' || nodeOrNodelist.constructor.name == 'Array') {
				nodeOrNodelist.foreach((node)=>{
					if(node.contains(_aelTrigger)) {
						while(_aelTrigger != node) {
							_aelTrigger = _aelTrigger.parentNode;
						}
					}
				});
			}
			else {
				while(_aelTrigger != nodeOrNodelist) {
					_aelTrigger = _aelTrigger.parentNode;
				}
			}
			//typeof is not good enough to detect a function, see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/typeof
			if(typeof listener === 'object' && listener.hasOwnProperty('handleEvent') && typeof listener.handleEvent == 'function') {
				listener.handleEvent(event, _aelTrigger);
			}
			else if(typeof listener == 'function') {
				listener(event, _aelTrigger);
			}
		}
	};
	Object.defineProperty(nestedListener, 'name', {value: listenerName});
	return nodeOrNodelist.addEventListener(type, nestedListener, optionsOrUseCapture);
}
//Mimic of jQuery's document-bound event listeners.
//May cause problems in edge cases, but I haven't found them yet.
//Does NOT bind an event listener to the document.
//Instead, uses a mutationObserver on the document.
//The ael function will immediately bind to the given selector,
//and add an event listener to any newly added nodes that match
//the selector.
//If the selector is not a string, it will assume a Node or
//NodeList, and attempt to add the event listener to it, and will
//ignore adding the event listener to newly added nodes.
const _aelRecords = [];
function _addEventListenersToNewNodes(mutationRecords) {
	// console.log('observing')
	for(let index = 0, len = mutationRecords.length; index < len; index += 1) {
		//check for added nodes
		if(mutationRecords[index].addedNodes) {
			for(const node of mutationRecords[index].addedNodes) {
				switch(node.nodeType) {
					case 1:
					case 9:
					case 11:
						// console.log('node type passed');
						_aelRecords.foreach((record)=>{
							if(node.matches(record.selector)) {
								// console.log('match found: ', node);
								if(node.getAttribute('qs-removed')) {
									// console.log('Is a moved element, aborting ael');
									node.removeAttribute('qs-removed');
								}
								else {
									_ael(node, record.type, record.listener, record.optionsCapture, record.listener.name ?? 'anonymous');
								}
							}
							else {
								let matchingChildren = qsa(node, record.selector);
								for(let childNode of matchingChildren) {
									// console.log('match found: ', childNode);
									if(childNode.getAttribute('qs-removed')) {
										// console.log('Is a moved element, aborting ael');
										childNode.removeAttribute('qs-removed');
									}
									else {
										_ael(childNode, record.type, record.listener, record.optionsCapture, record.listener.name ?? 'anonymous');
									}
								}
							}
						});//end _aelRecords foreach
					break;
				}
			}//end for addedNodes
		}//end addedNodes
		//check for removed nodes
		if(mutationRecords[index].removedNodes) {
			for(const node of mutationRecords[index].removedNodes) {
				switch(node.nodeType) {
					case 1:
					case 9:
					case 11:
						// console.log('node type passed');
						_aelRecords.foreach((record)=>{
							if(node.matches(record.selector)) {
								// console.log('remove match found: ', node);
								node.setAttribute('qs-removed', true);
							}
							else {
								let matchingChildren = qsa(node, record.selector);
								for(let childNode of matchingChildren) {
									// console.log('remove match found: ', childNode);
									childNode.setAttribute('qs-removed', true);
								}
							}
						});
					break;
				}
			}//end for
		}//end removedNodes
	}//end for mutationRecords
}//end _addEventListenersToNewNodes

const _aelObserver = new MutationObserver(_addEventListenersToNewNodes);
_aelObserver.observe(document,{childList: true,subtree: true});

//ael === add event listener. Makes use of the _ael function and the _aelObserver to add an event once, and
//persistently keep an event added to a selector, depending on input.
function ael(selectorOrEventListenable, type, listener, optionsCapture = null){
	if((typeof selectorOrEventListenable) === (typeof '')) {//if selectorOrEventListenable is a selector string
		//Add event listener now,
		//AND add a record of the ael data to be used by the _aelObserver for new nodes
		if(Array.isArray(type)) {
			for(const typeItem of type) {
				_ael(qsa(selectorOrEventListenable), typeItem, listener, optionsCapture, listener.name ?? 'anonymous');
				_aelRecords.push({selector:selectorOrEventListenable, type:typeItem, listener:listener, optionsCapture:optionsCapture});
			}
		}
		else {
			_ael(qsa(selectorOrEventListenable), type, listener, optionsCapture, listener.name ?? 'anonymous');
			_aelRecords.push({selector:selectorOrEventListenable, type:type, listener:listener, optionsCapture:optionsCapture});
		}
	}
	else {//assume it is an event listenable, and add event listener now without worrying about future elements
		//Add event listener now.
		if(Array.isArray(type)) {
			for(const typeItem of type) {
				_ael(selectorOrEventListenable, typeItem, listener, optionsCapture, listener.name ?? 'anonymous');
			}
		}
		else {
			_ael(selectorOrEventListenable, type, listener, optionsCapture, listener.name ?? 'anonymous');
		}
	}//end if/else selectorOrEventListenable == string
}//end ael
Object.defineProperty(EventTarget.prototype, 'ael', {
	value: function(...parameters) { return ael(this, ...parameters); }
});
Object.defineProperty(EventSource.prototype, 'ael', {
	value: function(...parameters) { return ael(this, ...parameters); }
});
Object.defineProperty(XMLHttpRequestEventTarget.prototype, 'ael', {
	value: function(...parameters) { return ael(this, ...parameters); }
});
Object.defineProperty(AudioWorkletNode.prototype, 'ael', {
	value: function(...parameters) { return ael(this, ...parameters); }
});
Object.defineProperty(MessagePort.prototype, 'ael', {
	value: function(...parameters) { return ael(this, ...parameters); }
});
Object.defineProperty(WebSocket.prototype, 'ael', {
	value: function(...parameters) { return ael(this, ...parameters); }
});
Object.defineProperty(Worker.prototype, 'ael', {
	value: function(...parameters) { return ael(this, ...parameters); }
});
Object.defineProperty(XMLHttpRequest.prototype, 'ael', {
	value: function(...parameters) { return ael(this, ...parameters); }
});
Object.defineProperty(AbortSignal.prototype, 'ael', {
	value: function(...parameters) { return ael(this, ...parameters); }
});
Object.defineProperty(ReadableStream.prototype, 'ael', {
	value: function(...parameters) { return ael(this, ...parameters); }
});
Object.defineProperty(WritableStream.prototype, 'ael', {
	value: function(...parameters) { return ael(this, ...parameters); }
});
Object.defineProperty(RTCDataChannel.prototype, 'ael', {
	value: function(...parameters) { return ael(this, ...parameters); }
});

//pseudonym for x.dispatchEvent(new Event(...))
function de(...params){
	return params.shift().dispatchEvent(new Event(...params));
}

function dme(...params){
	return params.shift().dispatchEvent(new MouseEvent(...params));
}

function dce(...params){
	return params.shift().dispatchEvent(new CustomEvent(...params));
}

function hparse(htmlString){
	//https://stackoverflow.com/a/55046067/6047611
	let parse = Range.prototype.createContextualFragment.bind(document.createRange());
	return parse(htmlString);
}

//put element 1 after element 2
function putAfter(element1, element2){
	element2.parentNode.insertBefore(element1, element2.nextSibling);
}

//put element 1 before element 2
function putBefore(element1, element2){
	element2.parentNode.insertBefore(element1, element2);
}

var cssNamesByJsNames = {'Top':'-top', 'Bottom':'-bottom', 'Right':'-right', 'Left':'-left'};
var jsNames = Object.keys(cssNamesByJsNames);

function _getAnimationTimeObject(node) {
	let animationTime = getCss(node, 'transition-duration');
	if(animationTime.endsWith('ms')) {
		animationTime = parseInt(animationTime.split('ms')[0]);
		animationTime = {
			'milliseconds' : animationTime,
			'seconds' : animationTime/1000
		};
	}
	else if(animationTime.endsWith('s')) {
		animationTime = parseFloat(animationTime.split('s')[0]);
		animationTime = {
			'milliseconds' : animationTime*1000,
			'seconds' : animationTime
		};
	}
	else {
		animationTime = {
			'milliseconds' : 0,
			'seconds' : 0
		};
	}
	return animationTime;
}

function _addCssTransitionIfNeeded(node, time = null, curve = null, delay = null) {
	let before = getCss(node, 'transition');
	let after = before;
	if(
		before == 'all 0s ease 0s'//is not set
		|| before == ''//could not calculate
		|| !(//does not include all properties needed for the animation
			(
				before.includes('max-height')
				&& before.includes('opacity')
				&& before.includes('padding')
				&& before.includes('margin')
			)
			|| before.includes('all')
		)
	) {
		after = 'all '+ ((time !== null && time !== '') ? time : '0.15s') + ' ' + ((curve !== null && curve !== '') ? curve : 'ease-in-out') + ' ' + ((delay !== null && delay !== '') ? delay : '0s');
	}
	node.style.transition = after;
	return {before: before, after: after};
}

function calcHeight(node, options) {
	// return getShadowHeight(node);//I think getShadowHeight is better. Probably needs a better name though
	options.display = options.display ?? 'block';
	//set parent vars
	let hasHideClass = false;
	if(node.classList.contains('qs-hide')) {
		node.classList.remove('qs-hide');
		hasHideClass = true;
	}
	const parentNode = node.parentNode;
	const parentPreHeight = parentNode.style.height;
	const parentPreTransition = parentNode.style.transition;
	parentNode.style.height = getCss(parentNode, 'height');
	parentNode.style.transition = 'all 0s ease 0s';
	//set vars
	const preTransition = node.style.transition;
	const preCalcTransition = getCss(node, 'transition');
	node.style.transition = 'all 0s ease 0s';
	const preWidth = node.style.width;
	const prePosition = node.style.position;
	const preTop = node.style.top;
	const preCalcTop = getCss(node, 'top');
	const preLeft = node.style.left;
	const preDisplay = node.style.display;
	const preMaxHeight = node.style.maxHeight;
	const preOpacity = node.style.opacity;
	const preMargin = node.style.margin;
	const prePadding = node.style.padding;
	let nodeWidth = getCss(node, 'width');
	let maxWidthFallback = 'none';
	let currentNode = parentNode;
	while(currentNode && currentNode.id !== 'product-content') {
		currentNode = currentNode.parentNode;
	}
	if (currentNode) {
		maxWidthFallback = getCss(currentNode, 'max-width');
	}
	if(parseInt(nodeWidth) > 0) {
		node.style.width = nodeWidth;
	}
	node.style.position = 'fixed';
	node.style.top = '-11111px';
	node.style.left = '-10000px';
	node.style.display = options.display;
	node.style.maxHeight = 'none';
	node.style.maxWidth = maxWidthFallback;
	node.style.opacity = '';
	node.style.margin = '';
	node.style.padding = '';
	return pTimeout(0).promise.then(()=>{
		const rect = node.getBoundingClientRect();
		const height = parseInt(rect.height);
		parentNode.style.transition = parentPreTransition;
		parentNode.style.height = parentPreHeight;
		node.style.width = preWidth;
		node.style.position = prePosition;
		node.style.top = preTop;
		node.style.left = preLeft;
		node.style.display = preDisplay;
		node.style.maxHeight = preMaxHeight;
		node.style.opacity = preOpacity;
		node.style.margin = preMargin;
		node.style.padding = prePadding;
		node.style.transition = preTransition;
		if(hasHideClass) {
			node.classList.add('qs-hide');
		}
		while(getCss(qs(getNthHierarchy(node)), 'transition') !== preCalcTransition) {
			//
		}
		return pTimeout(0).promise.then(()=>{return height;});

	});
}
/**
 * Fades out, then shrinks to 0 height, then sets to display:none.
 * Works with either a node or some iterable collection of nodes.
 * Does NOT require css transition to be set, and if set on the element it will be ignored.
 * To customize the transition animation, pass transition properties into options:
 * E.G. options.time, options.curve, options.delay
 */
function hideNode(node, options = {deleteNode: false}) {
	options.display = options.display ?? 'none';
	//if node is actually some collection of nodes, run this function on each, resolve when all are done animating
	if(typeof(node.length) !== 'undefined') {
		return new Promise(async function(resolve){
			let nodes = node;
			let promises = [];
			for(let node of nodes) {
				promises.push(hideNode(node, options));
			}
			for(let promise of promises){
				await promise;
			}
			resolve(nodes);
		});
	}
	else {
		return new Promise(resolvePromise=>{
			let rect = node.getBoundingClientRect();
			// console.log('entered function');
			if(rect.height > 0 && node.getAttribute('is-animating') !== 'true') {
				// console.log('hiding');
				node.setAttribute('is-animating', 'true');
				let resolve = (node)=>{
					node.setAttribute('is-animating', 'false');
					resolvePromise(node);
				};
				let nodeTransition = _addCssTransitionIfNeeded(node, options.time, options.curve, options.delay);
				// console.log('transition is ', nodeTransition);
				const start = Date.now();
				let animationTime = _getAnimationTimeObject(node);
				// console.log('time is ', animationTime);
				// console.log('setting overflow');
				let preOverflow = node.style.overflow;
				//make calculated css explicit in the style tag
				node.style.maxHeight = parseInt(rect.height)+'px';
				node.setAttribute('data-height', parseInt(rect.height));
				jsNames.foreach(jsName=>{
					node.style['padding'+jsName] = getCss(node, 'padding'+cssNamesByJsNames[jsName]);
					node.style['margin'+jsName] = getCss(node, 'margin'+cssNamesByJsNames[jsName]);
				});
				let initialPromise = null
				if(options.quick) {
					// console.log('quick');
					initialPromise = pTimeout(0).promise.then(()=>{
						// console.log('setting opacity, overflow, padding, margin, max-height');
						node.style.opacity = '0';
						node.style.overflow = 'hidden';
						if(!options.fade) {
							node.style.maxHeight = '0px';
							jsNames.foreach(jsName=>{
								node.style['padding'+jsName] = '0px';
								node.style['margin'+jsName] = '0px';
							});
						}
						// console.log('waiting '+animationTime.milliseconds+'ms');
						return pTimeout(animationTime.milliseconds).promise;
					});
				}
				else {
					// console.log('not quick');
					initialPromise = pTimeout(0).promise.then(()=>{
						// console.log('setting opacity');
						node.style.opacity = '0';
						// console.log('waiting '+animationTime.milliseconds+'ms');
						return pTimeout(animationTime.milliseconds).promise;
					})
					.then(()=>{
						// console.log('setting overflow, padding, margin, max-height');
						node.style.overflow = 'hidden';
						node.style.maxHeight = '0px';
						jsNames.foreach(jsName=>{
							node.style['padding'+jsName] = '0px';
							node.style['margin'+jsName] = '0px';
						});
						// console.log('waiting '+animationTime.milliseconds+'ms');
						return pTimeout(animationTime.milliseconds).promise;
					});
				}
				return initialPromise.then(()=>{
					// console.log('deleting, or setting display and restoring overflow');
					if(options.deleteNode ?? false) {
						node.parentNode.removeChild(node);
					}
					else {
						if(!options.fade) {
							node.style.display = options.display;
						}
						node.style.overflow = preOverflow;
					}
					// console.log('waiting '+animationTime.milliseconds+'ms');
					return pTimeout(animationTime.milliseconds).promise;
				})
				.then(()=>{
					// console.log('restoring transition if necessary');
					if(nodeTransition.before !== nodeTransition.after) {
						node.style.transition = nodeTransition.before;
					}
					node.classList.add('qs-hide');
					resolve(node);
				});
			}
			resolvePromise(node);
		});
	}
}
/**
 * Unsets display, then grows to natural height, then fades in.
 * Works with either a node or some iterable collection of nodes.
 * Does NOT require css transition to be set, and if set on the element it will be ignored.
 * To customize the transition animation, pass transition properties into options:
 * E.G. options.time, options.curve, options.delay
 */
function showNode(node, options = {}) {
	options.display = options.display ?? '';
	//if node is actually some collection of nodes, run this function on each, resolve when all are done animating
	if(typeof(node.length) !== 'undefined') {
		return new Promise(async function(resolve){
			let nodes = node;
			let promises = [];
			for(let node of nodes) {
				promises.push(showNode(node, options));
			}
			for(let promise of promises){
				await promise;
			}
			resolve(nodes);
		});
	}
	else {
		return new Promise(resolvePromise=>{
			let rect = node.getBoundingClientRect();
			if((rect.height <= 0 || options.fade) && (node.getAttribute('is-animating') !== 'true' || options.forceAnimate)) {
				node.setAttribute('is-animating', 'true');
				let resolve = (node)=>{
					node.setAttribute('is-animating', 'false');
					resolvePromise(node);
				};
				let nodeTransition = _addCssTransitionIfNeeded(node, options.time, options.curve, options.delay);

				const start = Date.now();
				let animationTime = _getAnimationTimeObject(node);
				let preOverflow = node.style.overflow;
				let maxHeight = null;
				if(!options.fade) {
					if(!node.getAttribute('data-height', '')) {
						return calcHeight(node, options).then((height)=>{
							node.setAttribute('data-height', height);
							options.forceAnimate = true;
							return showNode(node, options).then(()=>{resolve(node)});
						});
					}
					let attributeHeight = node.getAttribute('data-height') ?? '';
					maxHeight = attributeHeight + 'px';
					node.style.overflow = 'hidden';
					node.style.display = options.display;
					node.classList.remove('qs-hide');
				}
				let initialPromise = null;
				if(options.quick) {
					initialPromise = pTimeout(0).promise.then(()=>{
						if(!options.fade) {
							node.style.maxHeight = maxHeight;
							jsNames.foreach(jsName=>{
								node.style['padding'+jsName] = '';
								node.style['margin'+jsName] = '';
							});
						}
						node.style.opacity = '1';
						return pTimeout(animationTime.milliseconds).promise;
					});
				}
				else {
					initialPromise = pTimeout(0).promise.then(()=>{
						node.style.maxHeight = maxHeight;
						jsNames.foreach(jsName=>{
							node.style['padding'+jsName] = '';
							node.style['margin'+jsName] = '';
						});
						return pTimeout(animationTime.milliseconds).promise;
					})
					.then(()=>{
						node.style.overflow = preOverflow;
						node.style.opacity = '1';
						return pTimeout(animationTime.milliseconds).promise;
					});
				}
				return initialPromise.then(()=>{
					if(nodeTransition.before !== nodeTransition.after) {
						node.style.transition = nodeTransition.before;
					}
					if(options.quick) {
						node.style.overflow = preOverflow;
					}
					return resolve(node);
				});
			}
			return resolvePromise(node);
		});
	}
}
//sets a node to hidden without animating the change. Used for initializing the styles
function quickHideNode(node, options = {}) {
	options.quick = true;
	if(options.instant) {
		options.time = '0s';
	}
	return hideNode(node, options);
}
//sets a node to shown without animating the change. Used for initializing the styles
function quickShowNode(node, options = {}) {
	options.quick = true;
	if(options.instant) {
		options.time = '0s';
	}
	return showNode(node, options);
}
function fadeNodeOut(node, options = {}) {
	options.quick = true;
	options.fade = true;
	if(options.instant) {
		options.time = '0s';
	}
	return hideNode(node, options);
}
function fadeNodeIn(node, options = {}) {
	options.quick = true;
	options.fade = true;
	if(options.instant) {
		options.time = '0s';
	}
	return showNode(node, options);
}

function toggleNode(node, options = {}) {
	if(typeof(node.length) !== 'undefined') {
		return new Promise(async function(resolve){
			let nodes = node;
			let promises = [];
			for(let node of nodes) {
				promises.push(toggleNode(node, options));
			}
			for(let promise of promises){
				await promise;
			}
			resolve(nodes);
		});
	}
	else {
		if(nodeIsHidden(node, options)) {
			options.display = options.showDisplay ?? '';
			return showNode(node, options);
		}
		else {
			options.display = options.hideDisplay ?? 'none';
			return hideNode(node, options);
		}
	}
}
function nodeIsHidden(node, options = {}) {
	let hideDisplay = options.hideDisplay ?? 'none';
	if(getCss(node, 'display') == hideDisplay) {
		return true;
	}
	return false;
}

function getNthHierarchy(node, asString = true) {
	let hierarchyString = '';
	while(node && typeof node.getAttribute === 'function' && node.tagName !== 'HTML') {
		let i = 1;
		let child = node;
		while( (child = child.previousSibling) != null ) {
			if(child.tagName) {
				i++;
			}
		}
		let selectorSubstring = node.tagName.toLowerCase();
		if(!selectorSubstring.includes('body')) {
			selectorSubstring +=':nth-child('+i+')'
		}
		if(hierarchyString) {
			hierarchyString = selectorSubstring + ' > ' + hierarchyString;
		}
		else {
			hierarchyString = selectorSubstring;
		}
		node = node.parentNode;
	}
	if(asString === true) {
		return hierarchyString;
	}
	return hierarchyString.split(' > ');
}

function getSelectorHierarchy(node, asString = true) {
	let hierarchyString = '';
	while(node && typeof node.getAttribute === 'function' && node.tagName !== 'HTML') {
		let idAndClassElements = [];
		var i = null;
		if(node.getAttribute('id')) {
			idAndClassElements.push('#'+node.getAttribute('id'))
		}
		else {
			i = 1;
			let child = node;
			while( (child = child.previousSibling) != null ) {
				if(child.tagName) {
					i++;
				}
			}
		}
		if(node.classList.length > 0) {
			node.classList.forEach(function(element){
				idAndClassElements.push('.'+element);
			});
		}
		if(i !== null && idAndClassElements.length > 0) {
			idAndClassElements.push(':nth-child('+i+')');
		}
		if(hierarchyString) {
			if(idAndClassElements.length > 0) {
				hierarchyString = idAndClassElements.join('') + ' > ' + hierarchyString;
			}
			else {
				let selectorSubstring = node.tagName.toLowerCase();
				if(i !== null && !selectorSubstring.includes('body')) {
					selectorSubstring += ':nth-child('+i+')';
				}
				hierarchyString = selectorSubstring + ' > ' + hierarchyString;
			}
		}
		else {
			if(idAndClassElements.length > 0) {
				hierarchyString = idAndClassElements.join('');
			}
			else {
				let selectorSubstring = node.tagName.toLowerCase();
				if(i !== null && !selectorSubstring.includes('body')) {
					selectorSubstring += ':nth-child('+i+')';
				}
				hierarchyString = selectorSubstring;
			}
		}
		node = node.parentNode;
	}
	if(asString === true) {
		return hierarchyString;
	}
	return hierarchyString.split(' > ');
}

/**
 * Returns a Promise that recursively polls(periodically executes) the predicateClosure, resolves when the predicateClosure returns a truthy value, and rejects if the poll expiration has been exceeded(!). The result of the last poll will be passed to both the resolve and the reject closures.
 *
 * @summary TLDR; "when(()=>{return someCondition == 'truthy'}).then(()=>{executeSomeCode = 'foobar';});".
 *
 * @param   Closure predicateClosure       This is a closure (anonymous function) the return value of which must be truthy for the Promise to resolve. It should return the result of some conditional expression. It will be passed the amount of time that has expired, in milliseconds, since polling began.
 * @param   integer intervalMilliseconds   This integer represents how long to wait between checking the predicate closure for truthiness.
 * @param   integer expirationMilliseconds This integer represents the maximum time to wait for the predicate function to return true before giving up. Default is 0, which means the poll cycle will never expire.
 * @param   string  tag                    This string represents a tag to present in the console when warning the user that the poll cycle has exited early.
 *
 * @returns Promise Whether resolved or rejected, the then() closure will be passed the last polled result of predicateClosure().
 *
 * @example
 * const pollFrequencyInMs = 500;
 * const stopPollingAfterMs = 3000;
 *  when(
 *    (timePassedMs)=>{
 *      if(timePassedMs == 1500) {
 *        console.log('Reached halfway point between poll start and poll expiration.');
 *      }
 *      return document.querySelector('#thirdPartyDiv');//this return value is the source of successReturnVal, failureReturnVal below.
 *    },
 *    pollFrequencyInMs,
 *    stopPollingAfterMs
 *  ).then((successReturnVal, failureReturnVal)=>{
 *    if(successReturnVal) {
 *      successReturnVal.innerHTML = 'Finished when successfully.';
 *    }
 *    else {
 *      console.log('Could not find #thirdPartyDiv within 3 seconds, aborting when.', failureReturnVal);
 *    }
 *  });
 */
function when(predicateClosure, intervalMilliseconds = 500, expirationMilliseconds = 0, tag = '') {
	let totalMillisecondsPassed = 0;
	let lastPredicateResult = null;
	const pollPredicateClosure = (resolvePromise, rejectPromise)=>{
		if(expirationMilliseconds > 0 && totalMillisecondsPassed > expirationMilliseconds) {
			console.warn((tag ? tag+': ' : '')+'Polling exceeded maximum of '+expirationMilliseconds+' milliseconds. Promise will now exit poll cycle and resolve as rejected.');
			return rejectPromise(lastPredicateResult);
		}
		lastPredicateResult = predicateClosure(totalMillisecondsPassed);
		if(lastPredicateResult) {
		 return resolvePromise(lastPredicateResult);
		}
		else {
			totalMillisecondsPassed += intervalMilliseconds;
			return setTimeout(()=>{return pollPredicateClosure(resolvePromise);}, intervalMilliseconds)
		}
	};
	return new Promise(pollPredicateClosure);
}

//It's important for this section to come last. Please place any new code above this line.
function getArrayOfFunctionsFromPrototype(prototype) {
	const descriptors = Object.getOwnPropertyDescriptors(prototype);
	return Object.keys(descriptors).filter((propertyName) => {
		const descriptor = descriptors[propertyName];
		return typeof descriptor.value === 'function';
	});
}
//Dynamically assign Element methods to the NodeList prototype, so that calling an Element method on
//a node list will call it on every node in the node list
getArrayOfFunctionsFromPrototype(Element.prototype).foreach((methodName) => {
	if(!NodeList.prototype.hasOwnProperty(methodName)) {
		Object.defineProperty(NodeList.prototype, methodName, {
			value: function (...args) {
				// Call the method on each Node member of self
				const results = [];
				this.foreach((node) => {
					if(node.nodeType === 1) {
						results.push(node[methodName].apply(node, args));
					}
				});
				return results;
			}
		});
	}
});