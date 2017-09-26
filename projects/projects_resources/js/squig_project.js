$(document).ready(function() {

	var squig_params = {pipes:       50,
						width:       5, 
						speed:       4,
						min_s:       5,
						max_s:	     12,
						min_r:       25,
						max_r:	     40,
						min_t:       70,
						max_t:	     170,
						color: 		 "#994400",					
						squig_i:     0,
						repeats:     false,
						show_divs:   false,
						show_wraps:  false,
						win_bounds:  get_win_bounds(),
						path_bounds: []
	};

	function update_start() {
		
		var i = parseInt(Math.random() * 4);
		if (i % 2) {
			squig_params.init_left = parseInt(Math.random() * $("#squig").innerWidth());
			if (i / 2 >= 1) {
				squig_params.init_top = 0;
				squig_params.init_angle = 90;
			}
			else {
				squig_params.init_top = $("#squig").innerHeight();
				squig_params.init_angle = -90;
			}
		}
		else {
			squig_params.init_top = parseInt(Math.random() * $("#squig").innerHeight());
			if (i / 2) {
				squig_params.init_left = 0;
				squig_params.init_angle = 0;
			}
			else {
				squig_params.init_left = $("#squig").innerWidth();
				squig_params.init_angle = 180;
			}
		}
		
		/*
				squig_params.init_left = $("#squig").width() / 2;
				squig_params.init_top = $("#squig").height() / 2;
				squig_params.init_angle = -90;
				*/
	}

	function get_win_bounds() {
		var win_h = $("#squig").innerHeight() - 50;
		var win_w = $("#squig").innerWidth() - 50;
		var left  = new Bound({x1: 50, y1: 50, x2: 50, y2: win_h, ineq: ">"});
		var top   = new Bound({x1: 50, y1: 50, x2: win_w, y2: 50, ineq: "<"});
		var right = new Bound({x1: win_w, y1: 50, x2: win_w, y2: win_h, ineq: "<"});
		var bot   = new Bound({x1: 50, y1: win_h, x2: win_w, y2: win_h, ineq: ">"});
		if (squig_params)
			squig_params.win_bounds = [left, top, right, bot];
		return ([left, top, right, bot]);
	}

	function build_and_draw_squig() {
		$(".wrap").remove();
		update_start();
		var squig = new Squig(squig_params);
		squig.build_seq();
		squig.build_DOM();
		squig.animate_squig();
	}
 
	$("#squig_button").on("click", build_and_draw_squig);
	$(window).on("resize", get_win_bounds); /////

});
