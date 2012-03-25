
	
	
	
	

	
	
	
	
	
	/* ---------------------------------------------------------------------------------------------
	 * 
	 * 
	 * 
	 -------------------------------------------------------------------------------------------- */
    /* function splitOnCombinatorsIdAndClass(selector) {
        var combinators = ' .#>+~';
        var simpleSelectors = [selector];
        var selectorIndex = 0; // cursor index for the full selector; needed?
        // Loop through combinators and split the string on each //
        for (var i=0; i<=combinators.length; i++) {
            var combinatorIndex = 0;
            while (combinatorIndex > -1) {
                var tempSelector = simpleSelectors[selectorIndex].trim(); // temporarily store value here 
                combinatorIndex = tempSelector.indexOf(combinator.charAt(i));
                if (combinatorIndex == 0) { // match is at first index
                    // need to move forward somehow.
                    tempSelector = tempSelector.substring(1);
                    combinatorIndex = tempSelector.indexOf(combinator.charAt(i));
                    if (combinatorIndex > 0) {
                    	combinatorIndex+1;
                    	tempSelector = simpleSelectors[selectorIndex].trim();
                    }
                }
                // make sure the combinatorIndex is greater than 0 (and also -1 (meaning no match)) and also less than the length of the string                
                if (combinatorIndex > 0) {  // && combinatorIndex < tempSelector.length
                    simpleSelector[selectorIndex] = tempSelector.substring(0,combinatorIndex-1); // replace current index with first part
                    simpleSelector.push(tempSelector.substring(combinatorIndex)); // rest of the string goes into a new array element
                    selectorIndex = simpleSelector.length-1; // the new array element is the new target. 
                }
            }
        }
    }
    */	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	/* --------------------------------------------------------------------------------------------- 
	 * Probably should get rid of @media, @fontface, @charset etc.
	 * After getting rid of comments.
	 * ------------------------------------------------------------------------------------------ */
/*	
	$('#calculate_btn').click( function (clickEvent) {
		var css_input = $('#css_raw').val(); // get content of textarea
		var output = cleanUpStyleSheet(css_input); // clean up the css (user probably copy and pasted into textarea)
		var lines = output.split(selector_separator); // {...}
		$('#output').empty(); // clear Output
		for (var i=0; i<lines.length; i++) { // loop through lines
			var multi = lines[i].split(',');
			if (multi.length > 1) {
				for (var m = 0; m <= multi.length; m++) {
					if (multi[m] != null && multi[m] != "") {
						//var selectors = simplifySelector(multi[m]);  // returns an array of simple selectors
						var specificity = calculateCSSSpecificity(multi[m]); // returns an array
						$('#output').append('<div title="[a='+specificity[0]+' b='+specificity[1]+' c='+specificity[2]+' d='+specificity[3]+'] => specificity = '+specificity[0]+','+specificity[1]+','+specificity[2]+','+specificity[3]+'"><span class="selector">'+multi[m]+'</span><span class="specificity">['+specificity[0]+','+specificity[1]+','+specificity[2]+','+specificity[3]+']</span></div>');
					}
				}
			} else { //  MIGHT NOT NEED THIS
				if (lines[i] != "" && lines[i] != null) {
					//var selectors = simplifySelector(lines[i]); // returns an array of simple selectors
					var specificity = calculateCSSSpecificity(lines[i]); // returns an array
					$('#output').append('<div title="[a='+specificity[0]+' b='+specificity[1]+' c='+specificity[2]+' d='+specificity[3]+'] => specificity = '+specificity[0]+','+specificity[1]+','+specificity[2]+','+specificity[3]+'"><span class="selector">'+lines[i]+'</span><span class="specificity">['+specificity[0]+','+specificity[1]+','+specificity[2]+','+specificity[3]+']</span></div>');
				}
			}
		}
		
		// don't let the event bubble up and actually submit the form.
		clickEvent.stopPropagation();
		clickEvent.preventDefault();
		return false;
	});
*/
	/* ===========================================================
	 * 
	 * Gets rid of multi and single line comments and css declarations (e.g., {}) 
	 * 	
	 =========================================================== */
/*	function cleanUpStyleSheet(css) {
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
*/	
	
	/* ===========================================================
		Passed Initial Inspection
	=========================================================== */
/*	function calculateCSSSpecificity(selector) {
		selector = selector.trim();
		var a = 0, b = 0, c = 0;
		var result = findCssIDs(selector);
		
		a += result[0];
		console.log('a: '+a+'');
		selector = result[1];
		// --------------------------------------------------
		result = findCssAttributes(selector);
		b += result[0];
		selector = result[1];
		console.log('b2: '+b+'');
		
		result = findCssClasses(selector);
		b += result[0];
		selector = result[1];
		console.log('b1: '+b+'');
		
		result = findCssPseudoClasses(selector);
		b += result[0];
		selector = result[1];
		console.log('b3: '+b+'');
		// --------------------------------------------------		
		result = findCssPseudoElements(selector);
		c += result[0];
		selector = result[1];
		console.log('c1: '+c+'');
		
		result = findCssTypeSelectors(selector);
		c += result[0];
		selector = result[1];
		console.log('c2: '+c+'');
		// --------------------------------------------------
		
		var returnValue = [0,a,b,c]; // Concatenate as a string
		return returnValue;
	}
*/	
	
	/* ===========================================================
		Passed Initial Inspection
	=========================================================== */
/*	function findCssIDs(selector) {
		//console.log('-- findCssIDs --------------------------------------------------');
		// IDs = #idofelement 
		var numberofids = 0;
		var id_finder = /#([^ ~\+>\.:\s\[\],\{\}]+)/i;
		var returnValue = [0,selector];
		var result = '';
		while(result != null) {
			result = selector.match(id_finder);
			selector = selector.replace(id_finder, '', 'i');
			if (result != null) {
				numberofids+=1;
			}
		}
		returnValue[0] = numberofids;
		returnValue[1] = selector;
		return returnValue;
	}
*/	
	/* ===========================================================
		Passed Initial Inspection
	=========================================================== */
/*	function findCssClasses(selector) {
		var returnValue = [0,selector];
		var numberofclasses = 0;
		var class_finder = /\.([^ >\+~\.:\s\[\],\}\{]+)/i;
		var result = "";
		while(result != null) {
			result = selector.match(class_finder);
			selector = selector.replace(class_finder, '', 'i');
			if (result != null) {
				numberofclasses+=1;
			}
		}
		returnValue[0] = numberofclasses;
		returnValue[1] = selector;
		return returnValue;
	}
*/	
	/* ===========================================================
		
	=========================================================== */
/*	function findCssAttributes(selector) {
		console.log("findCssAttributes");
		var returnValue = [0,selector];
		var numberofattributes = 0;
		var attr_finder = /\[\S+(=|\^=|\$=|\*=)"\S+"\]/i;
		var result = "";
		while(result != null) {
			result = selector.match(attr_finder);
			console.log('r['+result+']');
			selector = selector.replace(attr_finder, '', 'i');
			console.log('s['+selector+']');
			if (result != null) {
				numberofattributes+=1;
			}
		}
		returnValue[0] = numberofattributes;
		returnValue[1] = selector;
		return returnValue;
	}
*/	
	/* ===========================================================
		Passed initial inspection
	=========================================================== */
/*	function findCssPseudoClasses(selector) {
		var returnValue = [0,selector];
		var numberofpseudoclasses = 0;
		var pseudoclass_finder = /:(link|visited|hover|active|focus|first-child|last-child|target|lang\([^\)]+\)|enabled|disabled|checked|indeterminate|root|nth\-child\([^\)]+\)|nth-of-child\([^\)]+\)|nth\-last\-child\([^\)]+\)|nth\-last\-of\-type\([^\)]+\)|nth\-of\-type\([^\)]+\)|nth\-child\([^\)]+\)|nth\-last\-child\([^\)]+\)|nth\-of\-type\([^\)]+\)|nth\-last\-of\-type\([^\)]+\)|first\-of\-type|last\-of\-type|only\-child|only-of-type|empty|not\([^\)]+\))/i;
		var result = "";
		while(result != null) {
			result = selector.match(pseudoclass_finder);
			selector = selector.replace(pseudoclass_finder, '', 'i');
			if (result != null) {
				numberofpseudoclasses+=1;
			}
		}
		returnValue[0] = numberofpseudoclasses;
		returnValue[1] = selector;
		return returnValue;
	}
*/	
	/* ===========================================================
		Passed Initial Inspection
	=========================================================== */
/*	function findCssTypeSelectors(selector) {
		console.log('--findCssTypeSelectors : '+selector+' --------------------------------------------------');
		var returnValue = [0,selector];
		
		// HTML TYPES = HTML Elements 
		var numberofelements = 0;
		var type_finder = /(?:[^ \#\~\+\>\.\:\s\[\]\,\{\}\"\=a-zA-Z]?)(blockquote|textarea|noscript|optgroup|progress|datalist|colgroup|fieldset|summary|section|address|article|caption|command|details|caption|legend|keygen|object|option|output|script|select|source|strong|button|canvas|figure|footer|header|hgroup|iframe|aside|audio|input|label|style|param|thead|table|tbody|track|title|small|tfoot|video|meter|embed|abbr|area|base|body|cite|code|ruby|samp|span|time|form|head|link|mark|menu|meta|html|map|bdi|bdo|col|nav|pre|sub|img|del|dfn|div|fig|ins|kbd|var|wbr|sup|br|h1|h2|h3|h4|h5|h6|hr|li|dd|dl|dt|em|td|rp|rt|th|tr|ul|ol|a|b|p|q|s|u|i)(?:[^ \#\~\+\>\.\:\s\[\]\,\{\}\"\=a-zA-Z]?)/i;
		//[^ \=\:\.\>\~\*\[\]\{\}]*
		//a|abbr|address|area|article|aside|audio|b|base|bdi|bdo|blockquote|body|br|button|canvas|caption|cite|code|col|colgroup|command|datalist|dddel|details|dfn|div|dl|dt|em|embed|fieldset|figcaption|figure|footer|form|h1|h2|h3|h4|h5|h6|head|header|hgroup|hr|html|i|iframe|img|input|ins|kbd|keygen|label|legend|li|link|map|mark|menu|meta|meter|nav|noscript|object|ol|optgroup|option|output|p|param|pre|progress|q|rp|rt|ruby|s|samp|script|section|select|small|source|span|strong|style|sub|summary|sup|table|tbody|td|textarea|tfoot|th|thead|time|title|tr|track|u|ul|var|video|wbr
		var result = "";
		while(result != null) {
			result = selector.match(type_finder);
			selector = selector.replace(type_finder, '', 'i');
			if (result != null) {
				numberofelements+=1;
			}
		}
		returnValue[0] = numberofelements;
		returnValue[1] = selector;
		return returnValue;
	}
*/
	
	/* ===========================================================
		
	=========================================================== */
/*	function findCssPseudoElements(selector) {
		var returnValue = [0,selector];
		var numberofpseudoelements = 0;
		var pseudoelements_finder = /(?:[:]{1,2})(first-line|first-letter|before|after)/i;
		// [:]?(:first-line|:first-letter|:before|:after)
		var result = "";
		while(result != null) {
			result = selector.match(pseudoelements_finder);
			selector = selector.replace(pseudoelements_finder, '', 'i');
			if (result != null) {
				numberofpseudoelements+=1;
			}
		}
		returnValue[0] = numberofpseudoelements;
		returnValue[1] = selector;
		return returnValue;
	}
*/	
	/* ===========================================================
		
	=========================================================== */
/*	function findCssCombinators(selector) {
		console.log('--findCssCombinators--------------------------------------------------');
		var returnValue = [0,selector];
		//  
		//	Descendant Combinators:
		//	<space> Generic Descendant: body h1
		//	* Universal Selector (matches any element)
		//	
		//	Child Combinators:
		//	> greater-than symbol (body > p)
		//	
		//	Sibling Combinator:
		//	Adjacent Sibling (share the same parent; first element comes immediately before second element)
		//	+ plus symbol (h1 + p)
		//	
		//	General Sibling Combinator:
		//	Similar to Adjacent Sibling, above, but the second element need not come immediately after the first.
		//	~ tilde			
		//
		// NOT USED IN CALCULATING SPECIFICITY - 
		//	it's considered whitespace; separators between simple selectors
		//	<space>, +, >, ~
		
		return [0,''];
	}
});
*/