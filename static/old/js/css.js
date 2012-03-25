/* -------------------------------------------------------------------------------------------------	
 * @Title: Javascript CSS Parser
 * @Author: Nicholas Bannister-Andrews
 * @StartDate: 2011.12.02
 * @Version1: <date first version was finished>
 * 
 -------------------------------------------------------------------------------------------------*/
/* -------------------------------------------------------------------------------------------------
API
    
    var rule = new Css.Rule('#asdf.qwerty');
    var ids = rule.getIds('list'); //default 
    var classes = rule.getClasses('array'); 
    var pseudoClasses = rule.getPseudoClasses(); 
    var attributes = rule.getAttributes();
    var pseudoElements = rule.getPsuedoElements();
    var elements = rule.getElements();
    
    
    var styleSheet = new Css.StyleSheet($('#css_raw').val()); // takes a bunch of style rules. // returns an Array 
    
    
    
 To find ending "}" after a "@media ... {" rule:
> capture the index in the full string where the "{" is.
> substring the string from that point until the end of the full string.

loop the following until it finds the correct ending "}"
> in the substring, find the next "}". If it doesn't find one: Error
> now search backwards looking for a "{". if it doesn't find one: then that's the end of the declaration for the @media
> if it does find one, go back to the full string and substring the full string starting at the index with the "}" on to the rest of the string.


// possible structure blueprint for css parser 
{ "rule": {"selector": {"raw": "div#somthing.asdf",
									"organized":
										{"e": // elements
											["div"],
										"a": // attributes
											[""],
										"c": // classes
											[".asdf"],
										"pc": // pseudoclasses
											[""],
										"pe":	/pseudoelements
											[""],
										"i": //ids
											[""],
										"er": // errors
											[{"bad string":"reason it's an error"},...]
										}
			},
		"declaration", 
			{"raw":"..."},
			{"exploded":
				{"property"[{"font-weight":{"value":"bold"}},
							{"width":{"value":"320","unit":"px"}},
							{"propertyName":{"value":"object"}}
							]
				}
			}
		}
	}
} 

 ------------------------------------------------------------------------------------------------ */
 


/* --------------------------------------------------------------------------------------------- 
 * 
 * Eventually, need to turn this into a "Class"
 * var selector = CSS.Selector('body.welcome #main-container');
 * $('#output').append('<div>['+selector.printSpecificity()+']</div>')
 * ---------------------------------------------------------------------------------------------
 */
	 
/* -----------------------------------------------------------------------------------------------*/

var Css = createNamespace('Css'); // '.' delemited 

Css.css_multiline_comments_re = /\/\*([\s\S]*?)\*\//gi;
Css.css_declarations_re = /{([\s\S]*?)*?}/gi;
Css.selector_separator = /\{[\s\S]*?\}/gi;


Css.StyleSheet = function (raw_stylesheet) {
	var _raw = raw_stylesheet;
	var _clean = "";
	var _cleaned = false;
	var _selectors = [];
	var _declaration_blocks = [];
	
	
	/* INIT function */
	(
		function(raw_stylesheet) {
			var parser = new Css.Parser();
			_clean = parser.clean(raw_stylesheet);
			_cleaned = true;
			console.log(_clean);
		}
	)(_raw);
};
Css.Rule = function(raw_rule, clean) {
	var _raw = raw_rule || null;
	var _clean = "";
	var _cleaned = clean || false;
	var _selector = {}; 			// a single Css.Selectors();
	var _declaration_block = {};
	
	/// ---------------------------
	var _inline = {};
	var _ids = {};
	var _classes = {};
	var _pseudoClasses = {};
	var _attributes = {};
	var _elements = {};
	var _pseudoElements = {};
	/// ---------------------------
	
	
	this.getIds = function (output_format) {
		var format = output_format; // || 'list';
		if (format == 'array') {
			// change to output array.
			return _ids;
		} else { // list
			return _ids;
		}
	};
	
    this.getClasses = function (output_format) {
		var format = output_format || 'list';
		if (format == 'array') {
			// change to output array.
			return _classes;
		} else { // list
			return _classes;
		}
    };
    this.getPseudoClasses = function (output_format) {
		var format = output_format || 'list';
		if (format == 'array') {
			// change to output array.
			return _pseudoClasses;
		} else { // list
			return _pseudoClasses;
		}
	};
    this.getAttributes = function (output_format) {
		var format = output_format || 'list';
		if (format == 'array') {
			// change to output array.
			return _attributes;
		} else { // list
			return _attributes;
		}
	};
    this.getPsuedoElements = function (output_format) {
		var format = output_format || 'list';
		if (format == 'array') {
			// change to output array.
			return _pseudoElements;
		} else { // list
			return _pseudoElements;
		}
	};
    this.getElements = function (output_format) {
		var format = output_format || 'list';
		if (format == 'array') {
			// change to output array.
			return _elements;
		} else { // list
			return _elements;
		}
	};
	
	
	
	
	// INIT annonymous function
	(
	  function(raw_rule) {
	  	if (_cleaned) {
	  		_clean = raw_rule;
		  	_selector = new Css.Selector(raw_rule);
	  	} else {
	  		_clean = Css.Parser.prototype.clean(raw_rule)
	  		_selector = new Css.Selector(_clean);
			_cleaned = true;
		}
	  } // EO Function
	)(_raw);
	
};


Css.Selector = function (raw_selector) {
	var _raw = raw_selector;
	// public getter function 
	this.get = function () {
		return _raw;
	}
};

Css.Properties = function (raw_properties) {
	var _raw = raw_properties;	
	
	// public getter function 
	this.get = function () {
		return _raw;
	}
};


Css.Parser = function (sheet_or_rule) { // Takes a Sheet or Rule 
	
};
Css.Parser.prototype.clean = function (stylesheet) { // string
	return stylesheet;
};
/* -------------------------------------------------------------------------------------------------
 * 
 * 
 * 
 * 
 * 
 * 
 * PSEUDO CODE
 delimiters <space>,+,~,>,[,],#,<.>,@,"
 for (length of a full selector) { // single selector (not necessarily a simple selector)
 	if (currentIndex is a delimiter) {
 		break off the previous part of the string.
 		substring(last_break_index -> currentIndex-1) (conserves the delimiter in the next part)
 		add this new part to the array.
 		last_break_index = currentIndex;
 	}
 }
 # -------------------------------------------------------------------------------------------------
 # Some delimiters have a partner
 # [], "", '', {}
 # 
 # 
 # 
 # 
 
 
 ------------------------------------------------------------------------------------------------ */
Css.Parser.prototype.parse = function () {
	console.log('Css.Parser.prototype.parse');
};




























/* -------------------------------------------------------------------------------------------------
 * 
 * Credit: http://elegantcode.com/2011/01/26/basic-javascript-part-8-namespaces/
 * 
 ------------------------------------------------------------------------------------------------ */
function createNamespace(namespaceString) {
    var parts = namespaceString.split('.'),
        parent = window,
        currentPart = '';    

    for(var i = 0, length = parts.length; i < length; i++) {
        currentPart = parts[i];
        parent[currentPart] = parent[currentPart] || {};
        parent = parent[currentPart];
    }
    return parent;
}








/* --------------------------------------------------------------------------------------------- 
 * Add a trim function 
 * incase the user is using a browser with a JS engine without String.trim();
 * ---------------------------------------------------------------------------------------------
 */
if(!String.prototype.trim) {
	String.prototype.trim = function () {
		return this.replace(/^\s+|\s+$/g,'');
	};
}