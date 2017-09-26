$(document).ready(function() {

    var canvas = $("#grid")[0];
    var context = canvas.getContext('2d');

    Array.matrix = function (m, n) {
        var a, i, j, mat = [];
        for (i = 0; i < m; i += 1) {
            a = [];
            for (j = 0; j < n; j += 1)
                a[j] = 0;
            mat[i] = a;
        }
        return mat;
    };
    
    var Life = {};

    Life.WIDTH = 29;
    Life.HEIGHT = 29;
    Life.DEAD = 0;
    Life.ALIVE = 1;
    Life.DELAY = 500;
    Life.STOPPED = 0;
    Life.RUNNING = 1;
    Life.minimum = 2;
    Life.maximum = 3;
    Life.spawn = 3;
    Life.state = Life.STOPPED;
    Life.interval = null;
    Life.grid = Array.matrix(Life.HEIGHT, Life.WIDTH);
    Life.counter = 0;
              
    Life.updateState = function() {
        var neighbours;
        var nextGenerationGrid = Array.matrix(Life.HEIGHT, Life.WIDTH); 
        for (var h = 0; h < Life.HEIGHT; h++)
            for (var w = 0; w < Life.WIDTH; w++) {
                neighbours = Life.calculateNeighbours(h, w);
                if ((Life.grid[h][w] !== Life.DEAD) && (neighbours >= Life.minimum) && (neighbours <= Life.maximum))
                    nextGenerationGrid[h][w] = Life.ALIVE;
                else if (neighbours === Life.spawn) 
                    nextGenerationGrid[h][w] = Life.ALIVE;
            }
        for (var h = 0; h < Life.HEIGHT; h++)
            Life.grid[h] = nextGenerationGrid[h].slice(0);
        Life.counter++;
    };
              
    Life.calculateNeighbours = function(y, x) {    ///kill at borders........   
        var total = ((Life.grid[y][x] !== Life.DEAD) ? -1 : 0);
        for (var h = -1; h <= 1; h++)
            for (var w = -1; w <= 1; w++) 
                if ((y + h) >= 0 && (y + h) < Life.HEIGHT && (x + w) >= 0 && (x + w) < Life.WIDTH &&
                    Life.grid[(Life.HEIGHT + (y + h)) % Life.HEIGHT][(Life.WIDTH + (x + w)) % Life.WIDTH] !== Life.DEAD)
                    total++;
        return total;
    };
      
    function Cell(row, column) {
        this.row = row;
        this.column = column;
    };

    function all_dead() {
        for (var h = 0; h < Life.HEIGHT; h++)
            for (var w = 0; w < Life.WIDTH; w++)
                if (Life.grid[h][w] !== Life.DEAD)
                    return 0;
        return 1;
    }

    $("#controlLink").on("click", function() {
        if (Life.state == Life.STOPPED) {
            Life.interval = setInterval(function() {
                Life.updateState();
                updateAnimations();
                if (all_dead() == 1) {
                    clearInterval(Life.interval);
                    Life.counter = 0;
                    Life.state = Life.STOPPED;
                    updateAnimations();
                    $("#controlLink").html("►");
                }
            }, Life.DELAY);
            Life.state = Life.RUNNING;
            $(this).html("❚❚");
        }
        else {
            clearInterval(Life.interval);
            Life.state = Life.STOPPED;
            $(this).html("►");
        }
    });
      
    $("#clearLink").on("click", function() {
        Life.grid = Array.matrix(Life.HEIGHT, Life.WIDTH);
        Life.counter = 0;
        clearInterval(Life.interval);
        Life.state = Life.STOPPED;
        updateAnimations();
        $("#controlLink").html("►");
    });

    function updateAnimations() {
        for (var h = 0; h < Life.HEIGHT; h++)
            for (var w = 0; w < Life.WIDTH; w++) {
                if (Life.grid[h][w] === Life.ALIVE)
                    context.fillStyle = "#000";                 
                else
                    context.fillStyle = "#eee";
                context.fillRect(w * Life.CELL_SIZE +1, 
                                 h * Life.CELL_SIZE +1, 
                                 Life.CELL_SIZE -1,
                                 Life.CELL_SIZE -1);
            }
        $("#counter").html(Life.counter); 
    };

    function getCursorPosition(e) {
        var x;
        var y;
        if (e.pageX || e.pageY) {
            x = e.pageX;
            y = e.pageY;
        } else {
            x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
            y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
        }
        x -= $("#grid")[0].offsetLeft;
        y -= $("#grid")[0].offsetTop;
        var cell = new Cell(Math.floor((y - 4) / Life.CELL_SIZE), Math.floor((x - 2) / Life.CELL_SIZE));
        return cell;
    };

    $("#grid").on("mousedown", function(e) {
        var cell = getCursorPosition(e);
        var state = Life.grid[cell.row][cell.column] == Life.ALIVE ? Life.DEAD : Life.ALIVE;
        Life.grid[cell.row][cell.column] = state;
        updateAnimations();
        $(this).on("mousemove", function(e2) {
            var cell = getCursorPosition(e2);
            var state = Life.grid[cell.row][cell.column] == Life.ALIVE ? Life.DEAD : Life.ALIVE;
            if (state == Life.ALIVE) {
                Life.grid[cell.row][cell.column] = state;
                updateAnimations();
            }
        });
    });

    $(window).on("mouseup", function() {
        $("#grid").off("mousemove");
    });


    function set_display() {
        if ($(window).width() < 700 && $(window).width() > 620) {
            canvas.style.width = "232px";
            canvas.style.height = "232px";
        }
        else {
            canvas.style.width = "348px";
            canvas.style.height = "348px";
        }
        canvas.width  = parseInt(canvas.offsetWidth / 29) * 29;
        canvas.height = parseInt(canvas.offsetHeight / 29) * 29;
        Life.X = canvas.width;
        Life.Y = canvas.height;
        Life.CELL_SIZE = Life.X / 29;
        for (var x = 0; x <= Life.X; x += Life.CELL_SIZE) {
            context.moveTo(0.5 + x, 0);
            context.lineTo(0.5 + x, Life.Y);
        }
        for (var y = 0; y <= Life.Y; y += Life.CELL_SIZE) {
            context.moveTo(0, 0.5 + y);
            context.lineTo(Life.X, 0.5 + y);
        }
        context.strokeStyle = "#fff";
        context.stroke();
        updateAnimations();
    }

    $(window).on("resize", set_display);
    set_display();
    Life.grid[11][8] = Life.ALIVE;
    Life.grid[11][9] = Life.ALIVE;
    Life.grid[12][10] = Life.ALIVE;
    Life.grid[13][11] = Life.ALIVE;
    Life.grid[14][11] = Life.ALIVE;
    Life.grid[15][11] = Life.ALIVE;
    Life.grid[16][10] = Life.ALIVE;
    Life.grid[17][9] = Life.ALIVE;
    Life.grid[17][8] = Life.ALIVE;
    updateAnimations();
});


