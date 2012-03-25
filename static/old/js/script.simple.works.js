/* 
	Author @ Nicholas Bannister-Andrews
	Date @ November 29th, 2011
	URL @ css-specificity-1-0.webapp-prototypes.appspot.com
	
	http://reference.sitepoint.com/css/specificity
	> To calculate a, count 1 if the declaration is from a style attribute rather than a rule with a selector (an inline style), 0 otherwise. (I ignore this)
	> To calculate b, count the number of ID (#elementID) attributes in the selector.
	> To calculate c, count the number of classes (.someclass), attribute ([type="submit"]), and pseudo-classes (:) in the selector.
	> To calculate d, count the number of element names (div...) and pseudo-elements (::) in the selector.
*/

/* ---------------------------------------------------------------------------------------------
 * Basic Algorithm for this application
 * ============================================================================================= 
 * Get rid of comments (both single line and multi-line)
 * Delimit on declarations {...}
 * Delimit again on comma (,)
 * Delimit again on (<space>, ~, >, +, *, ., ::, :, [, ], ...)
 * With each, find, delete what's found so it's not processed by the next step:
 * Find number of IDs (#elID)
 * Find number of classes (.class)
 * Find number of attribute selectors (...[type="submit"])
 * Find number of pseudo classes (:hover, etc.)
 * Find number of pseudo elements (::first-line|:first-line, etc.)
 * Find number of elements (div, header, etc.)
 * ------------------------------------------------------------------------------------------ */
 


	/* --------------------------------------------------------------------------------------------- 
     * 
	 * Eventually, need to turn this into a "Class"
	 * var selector = CSS.Selector('body.welcome #main-container');
	 * $('#output').append('<div>['+selector.printSpecificity()+']</div>')
	 * ---------------------------------------------------------------------------------------------
	 */
	 



$(document).ready(function() {
    var css_multiline_comments_re = /\/\*([\s\S]*?)\*\//gi;
    var css_singleline_comments_re = /\/\/([\s\S]*?)[\n\r\f\v]{1}/gi;
    var css_declarations_re = /{([\s\S]*?)*?}/gi;
    var whitespace_set = /([\s]+?)/gi; 
    var selector_separator = /\{[\s\S]*?\}/gi;
    
    
    
    
    
    
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







	/* ===========================================================
	 * 
	 * Gets rid of multi and single line comments and css declarations (e.g., {}) 
	 * 	
	 =========================================================== */
 	 function cleanUpStyleSheet(css) {
		css = css.trim();
		css = css.replace(css_multiline_comments_re, '');
		css = css.replace(css_singleline_comments_re, '');
		 
		//	Add replacement for @ rules
		//	@import: rule 
		//	@charset rule
		//	@font-face rule
		//	@media rule
		//	@page rule
		
		return css;
	}	
 	
 	
 	
 	
 	
 	
	/* ---------------------------------------------------------------------------------------------
	 * 
	 * 
	 * 
	 -------------------------------------------------------------------------------------------- */	
	$('#calculate_btn').click( function (clickEvent) {
		// don't let the event bubble up and actually submit the form.
		clickEvent.stopPropagation();
		clickEvent.preventDefault();
		var css_input = $('#css_raw').val(); // get content of textarea
		var output = cleanUpStyleSheet(css_input); // clean up the css (user probably copy and pasted into textarea)
		var lines = output.split(selector_separator); // {...}
		$('#output').empty(); // clear Output
		splitLines(lines);
		return false;
	});
	
	
	
	
	
	
	
	
	/* ---------------------------------------------------------------------------------------------
	 * 
	 * 
	 * 
	 -------------------------------------------------------------------------------------------- */
	
	function splitLines(lines) {
	    for (var l=0; l<lines.length; l++) { // loop through lines
			var multi = lines[l].split(',');
			if (multi.length > 1) { // Selectors with commas
				for (var m=0; m<=multi.length; m++) {
                    calculateLineSpecificity(multi[m]);
				}
			} else { //  No Commas
				calculateLineSpecificity(lines[l]);
			}
		}
	}
	
	
	
	
	
	
	
	/* ---------------------------------------------------------------------------------------------
	 * 
	 * 
	 * 
	 -------------------------------------------------------------------------------------------- */
	function calculateLineSpecificity(line) {
	    if (line != null && line.trim() != "") {
	    	var splitSelector = splitIntoSimpleSelectors(line);
            var specificity = calculateCSSSpecificity(splitSelector); // returns an array
            console.dir(specificity);
            $('#output').append('<div title="[a='+specificity[0]+' b='+specificity[1]+' c='+specificity[2]+' d='+specificity[3]+'] => specificity = '+specificity[0]+','+specificity[1]+','+specificity[2]+','+specificity[3]+'"><span class="selector">'+line+'</span><span class="specificity">['+specificity[0]+','+specificity[1]+','+specificity[2]+','+specificity[3]+']</span></div>');
        }
	}
	
	
	/* ---------------------------------------------------------------------------------------------
	 * 
	 * 
	 * 
	 -------------------------------------------------------------------------------------------- */
	function calculateCSSSpecificity(simpleSelectorsArray) {
		console.log("calculateCSSSpecificity");
		var badElements = [];
		var a=0, b=0, c=0, d=0;
		for (var i=0; i<simpleSelectorsArray.length; i++) {
			console.log("First Element of selector: "+simpleSelectorsArray[i][0]+"");
			if (simpleSelectorsArray[i][0] == "[") {
				// add one for attributes
				c++;
			} else if (simpleSelectorsArray[i][0] == "#") {
				// add one for IDs
				b++;
			} else if (simpleSelectorsArray[i][0] == ".") {
				// add one for classes
				c++;
			} else if (simpleSelectorsArray[i][0] == ":") {
				// check for pseudoElements and Classes
				if (findCss3PseudoElements(simpleSelectorsArray[i]) != -1) {
					d++;
				} else if (findCss2PseudoElements(simpleSelectorsArray[i]) > -1) {
					d++;
				} else if (findPseudoClass(simpleSelectorsArray[i]) > -1) {
					c++;
				} else {
					// BAD SELECTOR!
					console.log('BAD: "'+simpleSelectorsArray[i]+'"');
				}
			} else {
				// check for ELEMENTS (blockquote|div|...)
				if (findCssElements(simpleSelectorsArray[i]) > -1) {
					d++;
				} else {
				// LAST RESORT
				// BAD SELECTOR 
					console.log('BAD: "'+simpleSelectorsArray[i]+'"');
				}
			}
		}
		var returnValue = [a,b,c,d];
		return returnValue;
	}
	
	
	
	
	
	/* ---------------------------------------------------------------------------------------------
	 * 
	 * 
	 * 
	 -------------------------------------------------------------------------------------------- */
	function splitIntoSimpleSelectors(selector) {
		var returnValue = splitOnCombinators(selector); // split on Combinators first
		returnValue = splitOnAttributes(returnValue);     // [type="submit"]
		returnValue = splitOnPseudoElements(returnValue);
		returnValue = splitOnPseudoClasses(returnValue);
		returnValue = splitOnIDs(returnValue);
		returnValue = splitOnClasses(returnValue);
		returnValue = splitOnElements(returnValue);

		
        return returnValue;
	}
	
	
	
	
	/* ---------------------------------------------------------------------------------------------
	 * 
	 * FIND FUNCTIONS for each selector type (attribute ([...]), class (.class), ID (#ID),
	 * pseudo-element (::first-line), pseudo-class (:hover), elements (div, p, ....).
	 *
	 * findCss3PseudoElements
	 * findCss2PseudoElements
	 * findPseudoClass
	 * findCssClass
	 * findCssIDs
	 * findCssElements
	 * 
	 -------------------------------------------------------------------------------------------- */
		
	
	
	/* ---------------------------------------------------------------------------------------------
	 * 
	 * 
	 * 
	 -------------------------------------------------------------------------------------------- */
	function findCss3PseudoElements(selector) {
		// ::first-line
		var css3PseudoElements_re = /::(first-line|first-letter|before|after)/i;
		return selector.search(css3PseudoElements_re);
	}
	
	
	
	
	
	/* ---------------------------------------------------------------------------------------------
	 * 
	 * 
	 * 
	 -------------------------------------------------------------------------------------------- */
	function findCss2PseudoElements(selector) {
		// :first-line
		var css2PseudoElements_re = /:(first-line|first-letter|before|after)/i;
		return selector.search(css2PseudoElements_re);
	}
	
	
	
	
	
	/* ---------------------------------------------------------------------------------------------
	 * 
	 * 
	 * 
	 -------------------------------------------------------------------------------------------- */
	function findPseudoClass(selector) {
		var pseudoClass_re = /:(link|visited|hover|active|focus|first-child|last-child|target|lang\([^\)]+\)|enabled|disabled|checked|indeterminate|root|nth\-child\([^\)]+\)|nth-of-child\([^\)]+\)|nth\-last\-child\([^\)]+\)|nth\-last\-of\-type\([^\)]+\)|nth\-of\-type\([^\)]+\)|nth\-child\([^\)]+\)|nth\-last\-child\([^\)]+\)|nth\-of\-type\([^\)]+\)|nth\-last\-of\-type\([^\)]+\)|first\-of\-type|last\-of\-type|only\-child|only-of-type|empty|not\([^\)]+\))/i;
		return selector.search(pseudoClass_re);		
	}
	
	
	
	
	
	/* ---------------------------------------------------------------------------------------------
	 * 
	 * 
	 * 
	 -------------------------------------------------------------------------------------------- */
	function findCssClass(selector) {
		var cssClass_re = /\./i;
		return selector.search(cssClass_re);	
	}
	
	
	
	
	
	/* ---------------------------------------------------------------------------------------------
	 * findCssIDs(selector)
	 * 
	 * 
	 -------------------------------------------------------------------------------------------- */
	function findCssIDs(selector) {
		var cssID_re = /#/i;
		return selector.search(cssID_re);
	}
	
	
	
	
	
	/* ---------------------------------------------------------------------------------------------
	 * findCssElements(selector)
	 * 
	 * 
	 -------------------------------------------------------------------------------------------- */
	function findCssElements(selector) {
		var cssElements_re = /^(blockquote|textarea|noscript|optgroup|progress|datalist|colgroup|fieldset|summary|section|address|article|caption|command|details|caption|legend|keygen|object|option|output|script|select|source|strong|button|canvas|figure|footer|header|hgroup|iframe|aside|audio|input|label|style|param|thead|table|tbody|track|title|small|tfoot|video|meter|embed|abbr|area|base|body|cite|code|ruby|samp|span|time|form|head|link|mark|menu|meta|html|map|bdi|bdo|col|nav|pre|sub|img|del|dfn|div|fig|ins|kbd|var|wbr|sup|br|h1|h2|h3|h4|h5|h6|hr|li|dd|dl|dt|em|td|rp|rt|th|tr|ul|ol|a|b|p|q|s|u|i)$/i;
		return selector.search(cssElements_re);
	}
	
	
	
	
	
	/* ---------------------------------------------------------------------------------------------
	 * 
	 * 
	 * 
	 -------------------------------------------------------------------------------------------- */
	function splitOnAttributes(selectorArray) {
		var temp = selectorArray;
		var returnValue = [];
		for (var i=0; i<temp.length; i++) { // loop through the array
			var currentSelector = temp[i];
			var attributeStart = currentSelector.indexOf('[');
			var attributeEnd = currentSelector.indexOf(']');
			var splitSelector = splitOnIndices(currentSelector, attributeStart, attributeEnd);
			if (splitSelector.length > 0) {
				returnValue = returnValue.concat(splitSelector);
			}
		}
		return returnValue;
	}
	
	
	
	
	
	/* ---------------------------------------------------------------------------------------------
	 * 
	 * 
	 * 
	 -------------------------------------------------------------------------------------------- */
	function splitOnPseudoElements(selectorArray) {
		var temp = selectorArray;
		var returnValue = [];
		for (var i=0; i<temp.length; i++) { // loop through the array
			var currentSelector = temp[i];
			var pseudoElementCSS3 = findCss3PseudoElements(currentSelector);
			var pseudoElementCSS2 = findCss2PseudoElements(currentSelector);
			var splitSelector = [];
			if (pseudoElementCSS3 > -1) {
				splitSelector = splitOnIndices(currentSelector, pseudoElementCSS3, currentSelector.length-1);
			} else if (pseudoElementCSS2 > -1) {
				splitSelector = splitOnIndices(currentSelector, pseudoElementCSS2, currentSelector.length-1);	
			}
			if (splitSelector.length > 0) {
				returnValue = returnValue.concat(splitSelector);
			} else {
				returnValue = returnValue.concat(currentSelector);
			}
		}
		return returnValue;
	}
	
	
	
	
	
	/* ---------------------------------------------------------------------------------------------
	 * 
	 * 
	 * 
	 -------------------------------------------------------------------------------------------- */
	function splitOnPseudoClasses(selectorArray) {
		var temp = selectorArray;
		var returnValue = [];
		for (var i=0; i<temp.length; i++) { // loop through the array
			var currentSelector = temp[i];
			var pseudoClass = findPseudoClass(currentSelector);
			var splitSelector = [];
			if (pseudoClass > -1) {
				splitSelector = splitOnIndices(currentSelector, pseudoClass, currentSelector.length-1);
			}
			if (splitSelector.length > 0) {
				returnValue = returnValue.concat(splitSelector);
			} else {
				returnValue = returnValue.concat(currentSelector);
			}
		}
		return returnValue;
	}
	
	
	
	
	
	/* ---------------------------------------------------------------------------------------------
	 * 
	 * 
	 * 
	 -------------------------------------------------------------------------------------------- */
	function splitOnClasses(selectorArray) {
		var temp = selectorArray;
		var returnValue = [];
		for (var i=0; i<temp.length; i++) { // loop through the array
			var currentSelector = temp[i];
			var cssClass = findCssClass(currentSelector);
			var splitSelector = [];
			if (cssClass > -1) {
				splitSelector = splitOnIndices(currentSelector, cssClass, currentSelector.length-1);
			}
			if (splitSelector.length > 0) {
				returnValue = returnValue.concat(splitSelector);
			} else {
				returnValue = returnValue.concat(currentSelector);
			}
		}
		return returnValue;
	}
	
	
	
	
	
	/* ---------------------------------------------------------------------------------------------
	 * 
	 * 
	 * 
	 -------------------------------------------------------------------------------------------- */
	function splitOnIDs(selectorArray) {
		var temp = selectorArray;
		var returnValue = [];
		for (var i=0; i<temp.length; i++) { // loop through the array
			var currentSelector = temp[i];
			var cssIDs = findCssIDs(currentSelector);
			var splitSelector = [];
			if (cssIDs > -1) {
				splitSelector = splitOnIndices(currentSelector, cssIDs, currentSelector.length-1);
			}
			if (splitSelector.length > 0) {
				returnValue = returnValue.concat(splitSelector);
			} else {
				returnValue = returnValue.concat(currentSelector);
			}
		}
		return returnValue;
		
	}
	
	
	
	
	
	/* ---------------------------------------------------------------------------------------------
	 * splitOnElements(selectorArray)
	 * 
	 * 
	 -------------------------------------------------------------------------------------------- */
	function splitOnElements(selectorArray) {
		var temp = selectorArray;
		var returnValue = [];
		for (var i=0; i<temp.length; i++) { // loop through the array
			var currentSelector = temp[i];
			var cssElement = findCssElements(currentSelector);
			var splitSelector = [];
			if (cssElement > -1) {
				splitSelector = splitOnIndices(currentSelector, cssElement, currentSelector.length-1);
			}
			if (splitSelector.length > 0) {
				returnValue = returnValue.concat(splitSelector);
			} else {
				returnValue = returnValue.concat(currentSelector);
			}
		}
		return returnValue;
	}
	
	
	
	
	
	/* ---------------------------------------------------------------------------------------------
	 * splitOnCombinators(selector)
	 * 
	 * 
	 -------------------------------------------------------------------------------------------- */
	function splitOnCombinators(selector) {
        var combinators = ' >+~';
        var previousSplit = 0;
        var returnValue = [];
        for (var c=0; c < selector.length; c++) {
        	if (selector.charCodeAt(c) == combinators.charCodeAt(0) || // <space>
        		selector.charCodeAt(c) == combinators.charCodeAt(1) || // >
        		selector.charCodeAt(c) == combinators.charCodeAt(2) || // +
        		selector.charCodeAt(c) == combinators.charCodeAt(3)) { // ~
				returnValue = combinatorSplitString(returnValue, selector, previousSplit, c);
				previousSplit = c;
        	} else { /* DO NOTHING */ }
        }
        if (previousSplit < selector.length-1) {
        	returnValue.push(selector.substring(previousSplit+1));
        }
        return returnValue;
	}
	
	
	
	
	
	
	/* ---------------------------------------------------------------------------------------------
	 * combinatorSplitString(simpleSelectors, selector, previousCursor, currentCursor)
	 * Helper Function combinatorSplitString(arrayToAddTo, StringWeAreDealingWith, LastSplitIndex, CurrentSplitIndex)
	 * Returns the array possibly with a new element
	 -------------------------------------------------------------------------------------------- */
	function combinatorSplitString(simpleSelectors, selector, previousCursor, currentCursor) {
		var temp = selector.substring(previousCursor,currentCursor);
		if (temp != " " && temp != ">" && temp != "+" && temp != "~") {
			simpleSelectors.push(temp.trim());
		}
		return simpleSelectors;
	}
	
	
	
	
	
	

	/* ---------------------------------------------------------------------------------------------
	 * splitOnIndices(selector, firstIndex, secondIndex)
	 * splits a string into up to three (3) parts giving the indexes.  
	 * if start and end aren't at the ends of the string then 
	 * 		the first part is from the beginning of the string to the firstIndex
	 * 		the second part is from the first index to the second index
	 * 		the third part is from the second index to the end of the string
	 -------------------------------------------------------------------------------------------- */
	function splitOnIndices(selector, firstIndex, secondIndex) {
		var returnValue = [];
		if (firstIndex > -1 && secondIndex > -1) {
			secondIndex+=1;
			// FIRST PART 
			var firstPart = selector.substring(0,firstIndex);
			if (firstPart.length > 0) {
				returnValue.push(firstPart);
			}
			//Middle Part
			var middlePart = selector.substring(firstIndex,secondIndex)
			returnValue.push(middlePart);
			// LAST PART
			var lastPart = selector.substring(secondIndex);
			if (lastPart.length > 0) {
				returnValue.push(lastPart);
			}
		} else {
			returnValue.push(selector);
		}
		return returnValue;
	}
	
});	