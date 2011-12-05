Readme
======

Project: CSS Specificity
------------------------

This Google AppEngine web app takes the css selector rules and outputs the specificity of that rule with the parts broken down.

Hope someone finds it useful or fun.

Cheers,

Nicholas







CSS Specificity
===============

CSS specificity is not actually difficult to calculate once you know the rules. And knowing the rules can make it easier for you to construct efficient CSS selectors to target exactly what you want without making the selector convoluted and overly complex. This can lead to properties either matching more or less than what you want them to match.

I learn best by doing so I `created a small webapp to calculate the specificity of the CSS styles it is given  
<http://css-specificity.webapp-prototypes.appspot.com/>`_. 

It does *not* parse or validate CSS, so you should probably `use the W3C CSS validator <http://jigsaw.w3.org/css-validator/>`_ to make sure everything is copacetic. `I also made the source code available on github.com <http://github.com/nbannist/css-specificity>`_ for those who like code. 


Specificity Rules
-----------------

I used the rules published at http://reference.sitepoint.com/css/specificity as they seemed the most straight forward and easiest to follow. 

The first rule on inline styles I ignore, as my webapp processes stylesheets rather than entire webpages. I personally stay away from inline styles as they can make debugging much more difficult down the road and make style upkeep difficult by multipling the number of places you have to search.

1. If one declaration is from a style attribute, rather than a rule with a selector (an inline style), it has the highest specificity. If none of the declarations are inline, proceed to step two.

2. Count the ID selectors. The declaration with the highest count has the highest specificity. If two or more have the same number of ID selectors, or they all have zero ID selectors, proceed to step three.

3. Count the class selectors (for example, ".test"), attribute selectors (for example, "[type="submit"]"), and pseudo-classes (for example, ":hover"). The declaration with the highest total has the highest specificity. If two or more have the same total, or they all have totals of zero, proceed to step four.

4. Count the element type selectors (for example "div") and pseudo-elements (for example, "::first-letter"). The declaration with the highest total has the highest specificity.


Examples 
--------

Now for an example. Say we are comparing two similar style rules that are targeting first-child list elements. The first is: "ul#special-list.inline-list li:first-child" and the second rule is: "div#main-content ul.inline-list li:first-child"

Let's count the selectors!

IDs
***
- Rule 1: one (1) ID; #special-list
- Rule 2: one (1) ID; #main-content

Classes/Pseudo-classes/Attributes
*********************************
- Rule 1: one (1) class; .inline-list and one (1) pseudo-class, :first-child
- Rule 2: one (1) class; .inline-list and one (1) pseudo-class, :first-child

Elements/Pseudo-elements
************************
- Rule 1: two (2) elements; ul and li
- Rule 2: three (3) elements; div, ul, and li

This gives us the specificity matrix of [0,1,2,2] and [0,1,2,3]. Again, the "0" in the first column is for inline styles.

So, Rule 2 is more specific because it has one more element selector than Rule 1 does, while the other columns, for Inline Styles, IDs, and Classes, are all equal.

Now, let's consider the following rules on level 1 headings:
- Rule 1: "#main-content h1"
- Rule 2: "body div article section h1"

The first has an ID of "#main-content" and a single element of "h1".
The second consists of only five (5) element selectors: "body", "div", "article", "section", and "h1".

Since the first rule has an ID and the second does not, the first rule wins the specificity contest. A higher number in a same or preceding column will always trump any number in following column.

But what happens if they are equal on all columns? Well, that's easy. The rule that comes last overrides the rules that came before.

Hopefully now, you're beginning to understand the way specificity works. If not, fear not! Check out the resources below. 

References
----------
1. http://reference.sitepoint.com/css/specificity
2. http://www.w3.org/TR/CSS2/cascade.html#specificity
