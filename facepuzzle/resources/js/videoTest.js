//is there a way to just have things transition using slot classes while also making it adjust to window resize? would have to use percents? 

//whats better practice? just do adjusttopleft manually inside move function, or make separate functions?

//can I do sprite sheet for video???

//better for portfolio if you can upload your own video and tracks?

//make function that check for speed and distance for reverting, maybe adjust revertduration based on these???

//SHOULD I MAKE GLOBAL VARIABLES LIKE var pieces = $(".piece"), because these don't change and don't need to select them each time...

//maybe way to avoid staggers is to go through and call 8 setIntervals that are all called 30ms off from each other, but each one also sets the current time t30 seconds further than that last

//Is there a better way to do do the slot position better. this comes up a lot. it's whenever you need scaling more complicated than a simple percentage. right now the slot class isn't doing anything except allowing me to select. I have to manually recalculate values, select the class, than update it's css when I want it to change.

$(document).ready(function() {
    
    var mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    function main() {
        if (mobile)
            $("body").html("<p id='mobile_error'>Face Puzzle doesn't currently support mobile browsers</p>")
        else {

            var emptySlot = 9;
            var adjacentArray = [[2,4],[1,3,5],[2,6],[1,5,7],[2,4,6,8],[3,5,9],[4,8],[5,7,9],[6,8]];
            var slotPositions = [{},{},{},{},{},{},{},{},{}];
            var puzzleTop;
            var puzzleLeft;
            var pieceSize;
            var timer;
            var downTime;

            
            function getSlotNumber(element) {
                for (i=1; i<=9; i++) {
                    if (element.hasClass("slot"+i)) {
                        return i;
                    }
                }
            }

            function getPieceNumber(element) {
                for (i=1; i<=8; i++) {
                    if (element.hasClass("piece"+i)) {
                        return i;
                    }
                }    
            }

            function updateTopLeft(newSlotNumber) {
                $(".slot"+newSlotNumber).css({
                    "top": slotPositions[newSlotNumber-1].top+"px", 
                    "left": slotPositions[newSlotNumber-1].left+"px"
                });
            }

            function muteOrUnmute(pieceNumber) {    //WHATS BETTER lESS CODE LINES, OR FEW TIMES NEEDING TO LOOK UP SELECTOR?
                var track = $(".track"+pieceNumber);
                if (pieceNumber == emptySlot) {
                    track.prop("muted", false);
                }
                else {
                    track.prop("muted", true);
                }
            }

            function updateEmptyAndMoveables(slotNumber) {
                emptySlot = slotNumber;
                var adjacentElements = adjacentArray[emptySlot-1];
                $(".piece").removeClass("moveable").draggable("disable");
                for (var i=0; i<adjacentElements.length; i++) {
                    var aei = adjacentElements[i];
                    var piece = $(".slot"+aei);  ///DONT REALLY NEED???
                    var top = puzzleTop + slotPositions[aei-1].top;
                    var left = puzzleLeft + slotPositions[aei-1].left;
                    switch (emptySlot - aei) {               //Is this the best way to set the bounds variable????
                        case -1:
                            var bounds = [(left-pieceSize-3), top, left, top];
                            break;
                        case 1:
                            var bounds = [left, top, (left+pieceSize+3), top];
                            break;
                        case -3:
                            var bounds = [left, (top-pieceSize-3), left, top];
                            break;
                        case 3:
                            var bounds = [left, top, left, (top+pieceSize+3)];
                            break;
                    }
                    piece.addClass("moveable");
                    piece.draggable({containment: bounds}).draggable("enable");
                }
            }

            function move(element) {

                var slotNumber = getSlotNumber(element);
                var pieceNumber = getPieceNumber(element);

                element.removeClass("slot"+slotNumber).addClass("slot"+emptySlot);
                $(".droppable").removeClass("slot"+emptySlot).addClass("slot"+slotNumber);
                updateTopLeft(emptySlot);
                updateTopLeft(slotNumber); 
                muteOrUnmute(pieceNumber);
                updateEmptyAndMoveables(slotNumber);
                $(".piece").removeClass("lastMoved");
                $(element).addClass("lastMoved");

            }

            function randomMove() {

                var adjacentElements = adjacentArray[emptySlot-1];
                var numberOfAdjacent = adjacentElements.length;
                var randomMoveable = $(".slot"+adjacentElements[Math.floor(Math.random()*numberOfAdjacent)]);

                while (randomMoveable.hasClass("lastMoved")) {
                    randomMoveable = $(".slot"+adjacentElements[Math.floor(Math.random()*numberOfAdjacent)]);
                }
                move(randomMoveable);
            }

            function initializePuzzle() {

                var numberOfRandomMoves = 30

                for (var i=0; i<numberOfRandomMoves; i++) {
                    setTimeout(randomMove, i*50);
                }
                setTimeout(function() {
                    $(".piece").removeClass("fastpiece");
                }, numberOfRandomMoves*50);
            }

            function adjustVideoMargins() {
                $("video").each(function(index, element) {
                    $(element).css({
                        "margin-left": (((-1)*(pieceSize)*(index%3))-(pieceSize*(37/18)))+"px",
                        "margin-top": (((-1)*(pieceSize)*(Math.floor(index/3)))-(pieceSize/2))+"px"
                    })
                });
            }



            function startVideos() { 
                var videos = $("video");
                videos.each(function(index, element) {
                    var el = element;
                    setTimeout(function() {
                        el.play();               
                    }, index*30);
                });
                setInterval(function() {
                    videos.each(function(index, element) {
                        element.currentTime = 0;
                    });
                }, 19500);
            }


            function startAudios() {
                $("audio").each(function(index, element) {
                    element.play(); 
                });
                //setInterval(function() {                               /////ATTEMPT TO LOOP AUDIO PERFECTLY
                    //$("audio").each(function(index,element) {
                        //element.currentTime = 0;
                    //}
                //}, 43440); 
            }

            function adjustSlotPositions() {
                for(var  i=0; i<9; i++) {
                    var row = Math.floor((i)/3);
                    var col = (i)%3;
                    slotPositions[i].top = row*(pieceSize+3)-3;
                    slotPositions[i].left = col*(pieceSize+3)-3;
                }
            }


            //-----------------------------------------------------------------------------------------------------------------------------
            //-----------------------------------------------------------------------------------------------------------------------------


            $(window).on("load resize", function() { ///do a thing where it doesnt trigger resize a million times, jut when i stop resizing.

                var winHeight = $(this).height();
                var winWidth = $(this).width();
                var puzzleSize = Math.min(winHeight,winWidth)*(.9)-6;
                pieceSize = (puzzleSize/3)-2;

                $("#puzzle").height(puzzleSize).width(puzzleSize);
                $("#puzzle").show();
                adjustVideoMargins();
                $("video").height(puzzleSize*(4/3)).show();
                $(".piece").height(pieceSize).width(pieceSize);
                $(".droppable").height(1.5*pieceSize).width(1.5*pieceSize);
                adjustSlotPositions();
                $(".piece").each(function(index, element) {
                    var slotNumber = getSlotNumber($(element)); 
                    updateTopLeft(slotNumber);   
                });
                puzzleTop = $("#puzzle").offset().top;
                puzzleLeft = $("#puzzle").offset().left;
            });


            $(window).on("load", function() {
                initializePuzzle();
                startVideos();
                startAudios();
            });



            $("#puzzle").on("mousedown", ".moveable", function(event) {
                timer = setTimeout(function() {                              //Require 100 milliseconds of mousedown before customcursor is added
                    $("body *").addClass("customcursor");
                }, 100);
                downTime = event.timeStamp;
            });

            $("#puzzle").on("click", ".moveable", function(event) {
                upTime = event.timeStamp;
                if (!downTime || upTime-downTime < 200) {
                    move($(this));
                }
            });

            $(window).on("mouseup", function() {
                clearTimeout(timer);                                         //Require 100 milliseconds of mousedown before customcursor is added                   
                $("body *").removeClass("customcursor");
            })


            $(window).on("keydown", function(event) {
                downTime = 0;
                switch(event.which) {
                    case 37:
                        $(".slot"+(emptySlot+1)).trigger("click");
                        break;
                    case 38:
                        $(".slot"+(emptySlot+3)).trigger("click");
                        break;
                    case 39:
                        $(".slot"+(emptySlot-1)).trigger("click");
                        break;
                    case 40:
                        $(".slot"+(emptySlot-3)).trigger("click");
                        break;
                }
            });











        ///////////////////////////////////





        $(".piece").draggable({
            revert: "invalid",
            revertDuration: 0,
            start: function(event, ui) {
                ui.helper.addClass("fastpiece");
                ui.helper
            },
            stop: function(event, ui) {
                ui.helper.removeClass("fastpiece");
                ui.helper.addClass("draggedpiece")
                setTimeout(function() {
                    ui.helper.removeClass("draggedpiece");
                }, 350);
            }
        });






        $(".droppable").droppable({
            tolerance: "touch",
            drop: function(event, ui) {  
                move(ui.draggable);
            }
        });




    }
}


main();


});



	