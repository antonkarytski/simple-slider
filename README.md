Simple slider: TypeScript, Scss, Webpack

for set-up slider:

copy from dist folder:<br>
**simpleSlider.js** <br>
**simple-slider.css**

add simple-slider.css to the head of document:
<pre>
&ltlink href="simple-slider.css" rel="stylesheet"&gt;
</pre>

add HTML:
<pre>
&lt;div class="simple-slider"&gt;
    &lt;div&gt;Hello Ann&lt;/div&gt;
    &lt;div&gt;Hello Tom&lt;/div&gt;
    &lt;div&gt;Hello John&lt;/div&gt;
    &lt;div&gt;Hello Den&lt;/div&gt;
&lt;/div&gt;
</pre>

add js file to the end of body tag:
<pre>
&lt;script src="SimpleSlider.js"&gt;&lt;/script&gt;
</pre>

also init slider by creating new SimpleSlider object and transmitting slider class and additional optionos.<br>
you may transmit only one argument - class, then options will set by default
<pre>
&lt;script&gt; 
  new SimpleSlider(".simple-slider");
  
  const possibleOptions = {
   innerComponentClass: "",//additional slide class
   startSlid: 1, //number of start slide, counting from 1
   buttonClasses: "", //additional button class
   leftButtonClass: "",
   rightButtonClass: "",
   isShowDots: true,
   isDraggable: true,
   isLooped: true
  }
&lt;/script&gt;
</pre>
