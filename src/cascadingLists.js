 (function(name, global, definition) {
 	if (typeof module !== 'undefined') {
 		module.exports = definition();
 	} else if (typeof define === 'function' && define.amd) {
 		define(definition);
 	} else {
 		global[name] = definition();
 	}
 })('CascadingLists', this, function() {
 	return (function() {

 		var cascades = [];

 		/*
 		 *  UTILS - Object Literal for common functions.
 		 */

 		var UTILS = {
 			/*
 			 * extend function base on jQuery's implementation.
 			 */
 			extend: function() {
 				var options, name, src, copy, copyIsArray, clone, target = arguments[0] || {},
 					i = 1,
 					length = arguments.length,
 					deep = false,
 					toString = Object.prototype.toString,
 					hasOwn = Object.prototype.hasOwnProperty,
 					push = Array.prototype.push,
 					slice = Array.prototype.slice,
 					trim = String.prototype.trim,
 					indexOf = Array.prototype.indexOf,
 					class2type = {
 						"[object Boolean]": "boolean",
 						"[object Number]": "number",
 						"[object String]": "string",
 						"[object Function]": "function",
 						"[object Array]": "array",
 						"[object Date]": "date",
 						"[object RegExp]": "regexp",
 						"[object Object]": "object"
 					},
 					jQuery = {
 						isFunction: function(obj) {
 							return jQuery.type(obj) === "function";
 						},
 						isArray: Array.isArray ||
 							function(obj) {
 								return jQuery.type(obj) === "array";
 							},
 						isWindow: function(obj) {
 							return obj !== null && obj == obj.window;
 						},
 						isNumeric: function(obj) {
 							return !isNaN(parseFloat(obj)) && isFinite(obj);
 						},
 						type: function(obj) {
 							return obj === null ? String(obj) : class2type[toString.call(obj)] || "object";
 						},
 						isPlainObject: function(obj) {
 							if (!obj || jQuery.type(obj) !== "object" || obj.nodeType) {
 								return false;
 							}
 							try {
 								if (obj.constructor && !hasOwn.call(obj, "constructor") && !hasOwn.call(obj.constructor.prototype, "isPrototypeOf")) {
 									return false;
 								}
 							} catch (e) {
 								return false;
 							}
 							var key;
 							for (key in obj) {}
 							return key === undefined || hasOwn.call(obj, key);
 						}
 					};
 				if (typeof target === "boolean") {
 					deep = target;
 					target = arguments[1] || {};
 					i = 2;
 				}
 				if (typeof target !== "object" && !jQuery.isFunction(target)) {
 					target = {};
 				}
 				if (length === i) {
 					target = this;
 					--i;
 				}
 				for (i; i < length; i++) {
 					if ((options = arguments[i]) !== null) {
 						for (name in options) {
 							src = target[name];
 							copy = options[name];
 							if (target === copy) {
 								continue;
 							}
 							if (deep && copy && (jQuery.isPlainObject(copy) || (copyIsArray = jQuery.isArray(copy)))) {
 								if (copyIsArray) {
 									copyIsArray = false;
 									clone = src && jQuery.isArray(src) ? src : [];
 								} else {
 									clone = src && jQuery.isPlainObject(src) ? src : {};
 								}
 								// WARNING: RECURSION
 								target[name] = UTILS.extend(deep, clone, copy);
 							} else if (copy !== undefined) {
 								target[name] = copy;
 							}
 						}
 					}
 				}
 				return target;
 			}
 		};

 		UTILS.extend({
 			ajax: function(obj) {
 				obj = obj || {};
 				var defaults = {
 					url: window.location.href,
 					success: noop,
 					error: noop,
 					beforeCall: noop,
 					afterCall: noop
 				};

 				var opts = UTILS.extend({}, defaults, obj);

 				var request = new XMLHttpRequest();
 				request.open('GET', opts.url, true);

 				request.onload = function() {
 					if (this.status >= 200 && this.status < 400) {
 						// Success!
 						var resp = this.response;
 						opts.success(resp, this.statusText, this);
 						opts.afterCall();
 					} else {
 						opts.error(this, this.statusText, this.response);
 						opts.afterCall();

 					}
 				};

 				request.onerror = function() {
 					opts.error(this, this.statusText, this.response);
 					opts.afterCall();
 				};
 				opts.beforeCall();
 				return request.send();
 			},
 			each: function(arr, callback) {
 				Array.prototype.forEach.call(arr, callback);
 				return arr;
 			}
 		});

 		/*
 		 *  ajax: boolean. if when the options for the listener don't come from an ajax call
 		 *  broadcaster: html select node that is listend to when to update
 		 *  listener:  html select node that changes based on the broadcaster
 		 *  url: text
 		 *  mapping: object {value: value, label: label}
 		 *  onSuccces: funtion anything additional you want done once the resouce call to populate the drop down is successfully called
 		 *  onError: funtion anything additional you want done once the resouce call to populate the drop down is unsuccessfully called
 		 *  onBroadCasterChange: functon called when broacaster is changed
 		 *  nonAjaxChange: function to call when the options for the listener don't come from an ajax call
 		 */

 		function CascadingLists(obj /* an object with the above properties*/ ) {
 			if (arguments.length === 0) {
 				throw 'CascadingLists can not be used without any arguments';
 			}
 			if (!(this instanceof CascadingLists)) {
 				return new CascadingLists(obj);
 			}

 			var self = this;

 			var defaults = {
 				ajax: false,
 				broadcaster: null,
 				listener: null,
 				url: window.location.href,
 				mapping: null,
 				onSuccess: noop,
 				onError: noop,
 				beforeCall: noop,
 				afterCall: noop,
 				onBroadCasterChange: noop,
 				nonAjaxChange: noop
 			};

 			var opts = {};

 			UTILS.extend(true, opts, defaults, obj);

 			init();



 			function init() {
 				selectNodeCheck(opts.listener);
 				selectNodeCheck(opts.broadcaster);

 				UTILS.extend(self, {
 					destroy: destroy,
 					outputOptionTags: outputOptionTags,
 					destroyOptionTags: destroyOptionTags,
 					option: option
 				});

 				cascades.push(self);
 				/*
 				 * Add EventListener to broadcaster
 				 */

 				opts.broadcaster.addEventListener('change', broadCasterFunction);
 			}

 			function option(opt, value) {
 				if (value) {
 					opts[opt] = value;
 					return self;
 				} else {
 					return opts[opt];
 				}
 			}

 			function destroy() {
 				opts.broadcaster.removeEventListener('change', broadCasterFunction);
 				var index = cascades.indexOf(self);
 				if (index !== -1) {
 					cascades.splice(index, 1);
 				}
 				destroyOptionTags(skipFirst);
 			}

 			function destroyOptionTags(skipFirst) {
 				var select = opts.listener;
 				var options = select.querySelectorAll('option');
 				UTILS.each(options, function(option, index) {
 					if (skipFirst && index === 0) {
 						return;
 					} else {
 						option.parentNode.removeChild(option);
 					}

 				});

 				return self;
 			}

 			function outputOptionTags(datas, attributes) {
 				var frag = document.createDocumentFragment();
 				datas.forEach(function(data) {
 					var option = document.createElement('option');
 					if (attributes) {
 						for (var prop in attributes) {
 							option.setAttribute(prop, attributes[prop]);
 						}
 					}

 					option.setAttribute('value', data.value);
 					option.innerText = data.label;

 					frag.appendChild(option);
 				});

 				opts.listener.appendChild(frag);

 				return self;
 			}

 			function broadCasterFunction() {
 				opts.onBroadCasterChange.call(self, opts);
 				if (opts.ajax) {
 					UTILS.ajax({
 						url: opts.url,
 						success: opts.onSuccess,
 						error: opts.onError,
 						beforeCall: opts.beforeCall,
 						afterCall: opts.afterCall
 					});
 				}

 			}



 			return self;
 		}

 		CascadingLists.destroyAllLists = function() {
 			cascades.forEach(function(cascade) {
 				cascade.destroy();
 			});

 			cascades = [];
 		};

 		function selectNodeCheck(el) {
 			if (!el || !el.nodeName || el.nodeName.toLowerCase() !== 'select') {
 				throw el + ' should be a SELECT element';
 			}
 		}

 		function noop() {}


 		return CascadingLists;
 	})();
 });