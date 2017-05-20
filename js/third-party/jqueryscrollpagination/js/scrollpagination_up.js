/*
**	Anderson Ferminiano
**	contato@andersonferminiano.com -- feel free to contact me for bugs or new implementations.
**	jQuery ScrollPagination
**	28th/March/2011
**	http://andersonferminiano.com/jqueryscrollpagination/
**	You may use this script for free, but keep my credits.
**	Thank you.
*/
function buildParams( prefix, obj, add ) {
	var name;

	if ( jQuery.isArray( obj ) ) {
		// Serialize array item.
		jQuery.each( obj, function( i, v ) {
			if ( traditional || rbracket.test( prefix ) ) {
				// Treat each array item as a scalar.
				add( prefix, v );

			} else {
				// If array item is non-scalar (array or object), encode its
				// numeric index to resolve deserialization ambiguity issues.
				// Note that rack (as of 1.0.0) can't currently deserialize
				// nested arrays properly, and attempting to do so may cause
				// a server error. Possible fixes are to modify rack's
				// deserialization algorithm or to provide an option or flag
				// to force array serialization to be shallow.
				buildParams( prefix + "[" + ( typeof v === "object" ? i : "" ) + "]", v,  add );
			}
		});

	} else if ( jQuery.type( obj ) === "object" ) {
		// Serialize object item.
		for ( name in obj ) {
			buildParams( prefix + "[" + name + "]", obj[ name ], add );
		}

	} else {
		// Serialize scalar item.
		add( prefix, obj );
	}
};

$.extend($,{param2:function( a ) {
	var prefix,
		s = {},i=0,
		add = function( key, value ) {
			// If value is a function, invoke it and return its value
			value = jQuery.isFunction( value ) ? value() : ( value == null ? "" : value );
			s[encodeURIComponent( key )]=encodeURIComponent( value );
		};

	
	// If an array was passed in, assume that it is an array of form elements.
	if ( jQuery.isArray( a ) || ( a.jquery && !jQuery.isPlainObject( a ) ) ) {
		// Serialize the form elements
		jQuery.each( a, function() {
			i++
			add( this.name, this.value );
		});

	} else {
		// If traditional, encode the "old" way (the way 1.3.2 or older
		// did it), otherwise encode params recursively.
		for ( prefix in a ) {
			buildParams( prefix, a[ prefix ],  add );
		}
	}

	// Return the resulting serialization
	return s;
}});

(function( $ ){
	 
		 
 $.fn.scrollPagination = function(options) {
		var opts = $.extend($.fn.scrollPagination.defaults, options);
		var target = opts.scrollTarget;
		if (target == null){
			target = obj; 
	 	}
		
		opts.scrollTarget = target;
		return this.each(function() {
		  $.fn.scrollPagination.init($(this), opts);
		});

  };
  
  $.fn.stopScrollPagination = function(){
	  return $(this).each(function() {
	 	$(this).attr('scrollPagination', 'disabled');
	  });
	  
  };
 
  
  
  $.fn.scrollPagination.loadContent = function(obj, opts){
	if(opts.stop) return false;
	 var target = opts.scrollTarget;
	 
	 var mayLoadContent = $(target).scrollTop()+opts.heightOffset >= $(obj).offset().top+$(obj).height()-$(target).height();
	 
	 
	 if ((mayLoadContent && opts.lock) ){
		 if (opts.beforeLoad != null){
			opts.beforeLoad(); 
		 }
		 opts.lock=false;
		 setTimeout(function(){
			 $(obj).children().attr('rel', 'loaded');
			 $.ajax({
				  type: 'post',
				  url: opts.contentPage,
				  data: opts.noParamJson?opts.contentData:opts.contentData,
				  dataType: opts.dataType,
				  jsonp:'jsonpcallback',
				  success: function(data){
					opts.lock=true;
					opts.loader(data);
					var objectsRendered = $(obj).children('[rel!=loaded]');
					
					if (opts.afterLoad != null){
						opts.afterLoad(objectsRendered);	
					}
				  },
                  timeout:5000,
                  error:function(){
                      popup("oops~看起来你断网了");
                  }
			 });	 
		 },opts.delaytime);
		 
		 
	 }
	 
  };
  
  $.fn.scrollPagination.init = function(obj, opts){
	 var target = opts.scrollTarget;
	 $(obj).attr('scrollPagination', 'enabled');
	
	 $(target).on("scroll",function(event){
		if ($(obj).attr('scrollPagination') == 'enabled'){
	 		$.fn.scrollPagination.loadContent(obj, opts);		
		}
		else {
			event.stopPropagation();	
		}
	 });
	 
	 $.fn.scrollPagination.loadContent(obj, opts);
	 
 };
	
 $.fn.scrollPagination.defaults = {
      	 'contentPage' : null,
      	 'noParamJson' : 0,
     	 'contentData' : {},
		 'beforeLoad': null,
		 'afterLoad': null	,
		 'scrollTarget': null,
		 'heightOffset': 0,
		 'delaytime': 0,
		 'lock': true,
		 'dataType':null,
         'loader':function(data){}		  
 };
 
 $.fn.fadeInWithDelay = function(){
	var delay = 0;
	return this.each(function(){
		$(this).delay(delay).animate({opacity:1}, 1000);
		delay += 100;
	});
 };	

})( jQuery );