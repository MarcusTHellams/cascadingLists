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
 								target[name] = extend(deep, clone, copy);
 							} else if (copy !== undefined) {
 								target[name] = copy;
 							}
 						}
 					}
 				}
 				return target;
 			}
 		};


 		function ajax(obj) {
 			var request = new XMLHttpRequest();
 			request.open('GET', obj.url, true);

 			request.onload = function() {
 				if (this.status >= 200 && this.status < 400) {
 					// Success!
 					var resp = this.response;
 					obj.success(resp, this.statusText, this);
 				} else {
 					// We reached our target server, but it returned an error

 				}
 			};

 			request.onerror = function() {
 				obj.error(this, this.statusText, this.response);
 			};

 			return request.send();
 		}


 		UTILS.extend({
 			ajax: $.ajax
 		});

 		function CascadingLists() {
 			if (arguments.length === 0) {
 				throw 'CascadingLists can not be used without any arguments';
 			}
 			if (!(this instanceof CascadingLists)) {
 				return new CascadingLists(arguments);
 			}
 			this.listOptions = [];
 		}

 		CascadingLists.ajaxLib = function(func) {
 			Utils.ajax = func;
 		};

 		// reqwest.compat({
 		// 	url: 'https://vpic.nhtsa.dot.gov/api/vehicles/GetAllMakes?format=json',
 		// 	dataType: 'json',
 		// 	method: 'get',
 		// 	success: function(){
 		// 		console.log(arguments);
 		// 	}
 		// });


 		return CascadingLists;
 	})();
 });