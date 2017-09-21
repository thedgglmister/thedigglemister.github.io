$(document).ready(function() {


	$(".about_button").on("click", function() {
		$('html, body').animate({ 
			scrollTop: $("#intro").offset().top
    	}, 700);
    });



});