$(document).ready(function() {

	var slide_index = 0;

	show_div(slide_index);

	function show_div(n) {
		var slides = $(".slide");
		slide_index = n % slides.length;
	    slides.hide();
	    $(".circle_button").css("background-color", "transparent");
	    slides.eq(slide_index).fadeIn(400);
	    $(".circle_button").eq(slide_index).css("background-color", "#888");
	}

	$(".left_button").on("click", function() {
		slide_index -= 1;
		show_div(slide_index);
	});

	$(".right_button, .carousel img").on("click", function() {
		slide_index += 1;
		show_div(slide_index);
	});

	$(".circle_button").on("click", function() {
		slide_index = $(this).index() - 1;
		show_div(slide_index);
	});

	$("video").on("click", function() {
  		if (this.paused == false)
      		this.pause();
 		else
      		this.play();
	});

});
