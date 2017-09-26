$(document).ready(function() {

	var slide_index = 1;

	show_div(slide_index);

	function show_div(n) {
		var slides = $(".slide");
	    if (n > slides.length)
	    	slide_index = 1;
	    if (n < 1)
	    	slide_index = slides.length;
	    slides.hide();
	    $(slides[slide_index - 1]).fadeIn(400);
	}

	$(".left_button").on("click", function() {
		slide_index -= 1;
		show_div(slide_index);
	});

	$(".right_button, .carousel img").on("click", function() {
		slide_index += 1;
		show_div(slide_index);
	});

	$("video").on("click", function() {
  		if (this.paused == false)
      		this.pause();
 		else
      		this.play();
	});

});
