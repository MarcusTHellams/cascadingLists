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


 		return '';
 	})();
 });