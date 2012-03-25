/* -------------------------------------------------------------------------------------------------
 * Title @ Simple CSS Specificity Parser
 * Author @ Nicholas Bannister-Andrews
 * Email @ nbannist@gmail.com
 * --------------------------------------
 * The 
 * 
 * 
 * 
 * 
 * 
4.1.1 Tokenization

All levels of CSS — level 1, level 2, and any future levels — use the same core syntax. This allows UAs to parse (though not completely understand) style sheets written in levels of CSS that did not exist at the time the UAs were created. Designers can use this feature to create style sheets that work with older user agents, while also exercising the possibilities of the latest levels of CSS.

At the lexical level, CSS style sheets consist of a sequence of tokens. The list of tokens for CSS is as follows. The definitions use Lex-style regular expressions. Octal codes refer to ISO 10646 ([ISO10646]). As in Lex, in case of multiple matches, the longest match determines the token.

Token	Definition
IDENT	{ident}
ATKEYWORD	@{ident}
STRING	{string}
BAD_STRING	{badstring}
BAD_URI	{baduri}
BAD_COMMENT	{badcomment}
HASH	#{name}
NUMBER	{num}
PERCENTAGE	{num}%
DIMENSION	{num}{ident}
URI	url\({w}{string}{w}\)
|url\({w}([!#$%&*-\[\]-~]|{nonascii}|{escape})*{w}\)
UNICODE-RANGE	u\+[0-9a-f?]{1,6}(-[0-9a-f]{1,6})?
CDO	<!--
CDC	-->
:	:
;	;
{	\{
}	\}
(	\(
)	\)
[	\[
]	\]
S	[ \t\r\n\f]+
COMMENT	\/\*[^*]*\*+([^/*][^*]*\*+)*\/
FUNCTION	{ident}\(
INCLUDES	~=
DASHMATCH	|=
DELIM	any other character not matched by the above rules, and neither a single nor a double quote
The macros in curly braces ({}) above are defined as follows:

Macro	Definition
ident	[-]?{nmstart}{nmchar}*
name	{nmchar}+
nmstart	[_a-z]|{nonascii}|{escape}
nonascii	[^\0-\237]
unicode	\\[0-9a-f]{1,6}(\r\n|[ \n\r\t\f])?
escape	{unicode}|\\[^\n\r\f0-9a-f]
nmchar	[_a-z0-9-]|{nonascii}|{escape}
num	[0-9]+|[0-9]*\.[0-9]+
string	{string1}|{string2}
string1	\"([^\n\r\f\\"]|\\{nl}|{escape})*\"
string2	\'([^\n\r\f\\']|\\{nl}|{escape})*\'
badstring	{badstring1}|{badstring2}
badstring1	\"([^\n\r\f\\"]|\\{nl}|{escape})*\\?
badstring2	\'([^\n\r\f\\']|\\{nl}|{escape})*\\?
badcomment	{badcomment1}|{badcomment2}
badcomment1	\/\*[^*]*\*+([^/*][^*]*\*+)*
badcomment2	\/\*[^*]*(\*+[^/*][^*]*)*
baduri	{baduri1}|{baduri2}|{baduri3}
baduri1	url\({w}([!#$%&*-~]|{nonascii}|{escape})*{w}
baduri2	url\({w}{string}{w}
baduri3	url\({w}{badstring}
nl	\n|\r\n|\r|\f
w	[ \t\r\n\f]*
For example, the rule of the longest match means that "red-->" is tokenized as the IDENT "red--" followed by the DELIM ">", rather than as an IDENT followed by a CDC.

Below is the core syntax for CSS. The sections that follow describe how to use it. Appendix G describes a more restrictive grammar that is closer to the CSS level 2 language. Parts of style sheets that can be parsed according to this grammar but not according to the grammar in Appendix G are among the parts that will be ignored according to the rules for handling parsing errors.

stylesheet  : [ CDO | CDC | S | statement ]*;
statement   : ruleset | at-rule;
at-rule     : ATKEYWORD S* any* [ block | ';' S* ];
block       : '{' S* [ any | block | ATKEYWORD S* | ';' S* ]* '}' S*;
ruleset     : selector? '{' S* declaration? [ ';' S* declaration? ]* '}' S*;
selector    : any+;
declaration : property S* ':' S* value;
property    : IDENT;
value       : [ any | block | ATKEYWORD S* ]+;
any         : [ IDENT | NUMBER | PERCENTAGE | DIMENSION | STRING
              | DELIM | URI | HASH | UNICODE-RANGE | INCLUDES
              | DASHMATCH | ':' | FUNCTION S* [any|unused]* ')'
              | '(' S* [any|unused]* ')' | '[' S* [any|unused]* ']'
              ] S*;
unused      : block | ATKEYWORD S* | ';' S* | CDO S* | CDC S*;
The "unused" production is not used in CSS and will not be used by any future extension. It is included here only to help with error handling. (See 4.2 "Rules for handling parsing errors.")

COMMENT tokens do not occur in the grammar (to keep it readable), but any number of these tokens may appear anywhere outside other tokens. (Note, however, that a comment before or within the @charset rule disables the @charset.)

The token S in the grammar above stands for white space. Only the characters "space" (U+0020), "tab" (U+0009), "line feed" (U+000A), "carriage return" (U+000D), and "form feed" (U+000C) can occur in white space. Other space-like characters, such as "em-space" (U+2003) and "ideographic space" (U+3000), are never part of white space.

The meaning of input that cannot be tokenized or parsed is undefined in CSS 2.1. 
 
 
------------------------------------------------------------------------------------------------- */


/* API */
/* ------------------------------------------------------------------------ */
Css.Rule.parse();




/* ------------------------------------------------------------------------ */

var Css = createNamespace('Css'); // '.' delemited 





/* -------------------------------------------------------------------------------------------------
 * 
 * 
 * 
 * 
 -------------------------------------------------------------------------------------------------*/
Css.Parser = function(raw_css) {
	var _raw = raw_css || null;
	var _clean = null;
	var _selectors = []; // will be an array of Css.Selectors();
	
    this._css_multiline_comments_re = /\/\*([\s\S]*?)\*\//gi;
    this._css_singleline_comments_re = /\/\/([\s\S]*?)[\n\r\f\v]{1}/gi;
    this._css_declarations_re = /{([\s\S]*?)*?}/gi;
    this._whitespace_set = /([\s]+?)/gi; 
    this.selector_separator = /\{[\s\S]*?\}/gi;
    var selector_separator = /\{[\s\S]*?\}/gi;
	
	// INIT annonymous function
	(
	  function(raw_css) {
		_clean = Css.Parser.prototype.clean(raw_css);
		var lines = Css.Parser.prototype.splitOnDeclarations(_clean);
		var selectorArray = Css.Parser.prototype.splitOnCommas(lines);
		for (var i=0; i<selectorArray.length; i++) {
			var selector = Css.Selector.prototype.make(selectorArray[i]);
			_selectors.push(selector);
			_selectors.push(Css.Parser.prototype.parse(selector));
		}
	  }
	)(_raw);
};








/* ===========================================================
 * PARSER - the Big Kahuna!
 =========================================================== */
/* ===========================================================
 * 
 =========================================================== */
Css.Parser.prototype.parseSingleSelector = function (cssSelector) {
	return cssSelector;
}

Css.Parser.prototype.parse = function (cssSelector) {
	var cssSelectorArray = [];
	if (cssSelector.constructor == Array) {
		for (var i=0; i<cssSelector.length; i++) {
			cssSelectorArray.push(Css.Parser.prototype.parseSingleSelector(cssSelector));
		}
	} else {
		cssSelectorArray.push(Css.Parser.prototype.parseSingleSelector(cssSelector));
	}
	return cssSelectorArray;
}








/* ===========================================================
 * Gets rid of multi-line comments
 =========================================================== */
Css.Parser.prototype.clean = function (cssString) {
	cssString = cssString.trim();
	cssString = cssString.replace(Css.Parser.prototype._css_multiline_comments_re, '');
	return cssString;
}








/* ===========================================================
 * Splits the CSS on the {  }
 =========================================================== */
Css.Parser.prototype.splitOnDeclarations = function (cssString) {
	var selector_separator = /\{[\s\S]*?\}/gi; // Figure out how to reference this from main Css.Parser Obj....
	var lines = cssString.split(selector_separator); // split off declarations ; ignore declarations for now; may collect them later
	var returnArray = [];
	for (var i=0; i<lines.length; i++) {
		if (lines[i] != "") {
			returnArray.push(lines[i]);
		}
	}
	return returnArray;
}







/* ===========================================================
 * splits css on commas (commas between selectors); 
 =========================================================== */
Css.Parser.prototype.splitOnCommas = function (cssSelectors) {
	var returnArray = [];
	if (cssSelectors.constructor == Array) { // multi
		for (var l=0; l<cssSelectors.length; l++) { // loop through lines
			returnArray = returnArray.concat(Css.Parser.prototype.splitOnCommas_helper(cssSelectors[l]));
		}
	} else if (cssSelectors.constructor == String) { // single
		returnArray = returnArray.concat(Css.Parser.prototype.splitOnCommas_helper(cssSelectors));
	}
	return returnArray;
}
/* -------------------------------------------------------------------------------------------------
 * 
 * Helper function for "Css.Parser.prototype.splitOnCommas"
 * Does the actual split work if it needs doing.
 * 
 -------------------------------------------------------------------------------------------------*/
Css.Parser.prototype.splitOnCommas_helper = function (cssSelectorString) {
	var multi = cssSelectorString.split(',');
	var returnArray = [];
	if (multi.length > 1) { // Selectors with commas
		for (var m=0; m<=multi.length; m++) {
			returnArray.push(multi[m]);
		}
	} else { //  No Commas
		returnArray.push(multi[0]);
	}
	return returnArray;
}






/* ------------------------------------------------------- 
 * Selector Object
 ------------------------------------------------------- */
Css.Selector = function (selector) { // selector: string; cleaned true:false;
	var _selector = selector.trim();
	var _cleaned = false;
	
	// public getter function 
	this.get = function () {
		return _selector;
	}
	
	// INIT annonymous function
	//( function(selector) {} )(_selector);
	
};

Css.Selector.prototype.toString = function () {
	return "Selector: ("+this.get()+")";
}






/* -------------------------------------------------------------------------------------------------
 * 
 * 
 * 
 * 
 -------------------------------------------------------------------------------------------------*/
Css.Selector.prototype.make = function (selectorString) {
	var temp = new Css.Selector(selectorString);
	return temp;
}






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