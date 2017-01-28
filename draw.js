var drawing = {
    title: "Nú er gaman",
    content: "the contents of the shapes array"
};

var url = "http://localhost:3000/api/drawings";

function senda(){

$.ajax({
    type: "POST",
    contentType: "application/json; charset=utf-8",
    url: url,
    data: JSON.stringify(drawing),
    success: function (data) {
        // The drawing was successfully saved
        //prompt("The drawing was successfully saved.");
    },
    error: function (xhr, err) {
        // The drawing could NOT be saved
        //prompt("The drawing could NOT be saved.");
    }
});

}

console.log(drawing);

//Shape sér um að geyma öll sameiginleg gögn um teiknihlutina.
class Shape {
    constructor(x, y, color, width) {
        this.x = x;
        this.y = y;
        this.endX = x;
        this.endY = y;
        this.color = color;
        this.width = width;
    }

    setEnd(x, y) {
        this.endX = x;
        this.endY = y;
    }
}

class Rectangle extends Shape {
    constructor(x, y, color, width){
        super(x, y, color, width);
    }

    draw(context){
        //console.log("drawing rectangle");

        context.lineWidth = this.width;
        context.strokeStyle = this.color;
        context.strokeRect(this.x, this.y, this.endX - this.x, this.endY - this.y);
    }
}

class Circle extends Shape {
    constructor(x, y, color, width){
        super(x, y, color, width);
    }

    draw(context){
        console.log("drawing circle");

        var radius = Math.max(Math.abs(this.endX - this.x), Math.abs(this.endY - this.y));

        context.lineWidth = this.width;
        context.strokeStyle = this.color;
        context.beginPath();

        var newX = (this.endX - this.x)/2;
        var newY = (this.endY - this.y)/2;
        var radius = Math.sqrt(Math.pow(newX,2) + Math.pow(newY,2));

        console.log(newX); console.log(newY); console.log(radius);
        context.arc(this.x + newX, this.y + newY ,radius,0,2*Math.PI);
        context.stroke();
        context.closePath();
    }
}

class Line extends Shape {
    constructor(x, y, color, width){
        super(x, y, color, width);
    }

    draw(context){
        console.log("drawing line");

        context.strokeStyle = this.color;
        context.lineWidth = this.width;
        context.beginPath();
        context.moveTo(this.x, this.y);
        context.lineTo(this.endX, this.endY);
        context.stroke();
    }
}

class Pen extends Shape {
    constructor(x, y, color, width){
        super(x, y, color,width);
        this.points = [];
    }

    setEnd(x, y) {
        this.points.push({x: x, y: y});
    }

    draw(context){
        context.strokeStyle = this.color;
        context.lineWidth = this.width;
        context.beginPath();
        context.moveTo(this.x, this.y);

        for( var i = 0; i < this.points.length; i++ ){
            context.lineTo(this.points[i].x, this.points[i].y);
        }
        context.stroke();

    }
}

class Text extends Shape {
    constructor(x, y, color, width) {
        super(x, y, color, width);
    }

    draw(context) {
        console.log("writing text");

        var pixels = "";
        switch(parseInt(this.width)) {
        case 1:
            pixels = "10px";
            break;
        case 2:
            pixels = "15px";
            break;
        case 3:
            pixels = "20px";
            break;
        case 4:
            pixels = "25px";
            break;
        case 5:
            pixels = "30px";
            break;
        case 6:
            pixels = "35px";
            break;
        case 7:
            pixels = "40px";
            break;
        case 8:
            pixels = "45px";
            break;
        case 9:
            pixels = "50px";
            break;
        case 10:
            pixels = "55px";
            break;
    }

    var fontAndSize = pixels + " Arial";
    var textContents = $("#textBox").val();

    context.fillStyle = this.color;
    context.font = fontAndSize;
    context.fillText(textContents,this.x,this.y);

    textBox.remove();
  }
}

var settings = {
    canvas: undefined,
    context: undefined,
    nextObject: "Pen",
    nextColor: "Black",
    isDrawing: false,
    currentShape: undefined,
    dragStartLocation: undefined,
    nextWidth: 3,
    redo: [],
    shapes: []
}

$(document).ready(function()
{
    settings.canvas = document.getElementById("myCanvas");
    settings.context = settings.canvas.getContext("2d");

//láta val frá notanda fara inn í þessar breytur
//these are attributes in an object

    function getCanvasPoints(e){
        var x = e.pageX - settings.canvas.offsetLeft;
        var y = e.pageY - settings.canvas.offsetTop;

        return {x: x, y: y};
    }


    $("#myCanvas").mousedown(function(e) {
        //console.log("Inside mousedown");

        var shape = undefined;
        settings.redo = [];
        settings.isDrawing = true;
        settings.dragStartLocation = getCanvasPoints(e);


        if (settings.nextObject === "Circle") {
            shape = new Circle( settings.dragStartLocation.x, settings.dragStartLocation.y, settings.nextColor, settings.nextWidth);
        }
        else if (settings.nextObject === "Rectangle") {
            shape = new Rectangle( settings.dragStartLocation.x, settings.dragStartLocation.y, settings.nextColor, settings.nextWidth);
        }
        else if (settings.nextObject === "Line") {
            shape = new Line( settings.dragStartLocation.x, settings.dragStartLocation.y, settings.nextColor, settings.nextWidth);
        }
        else if (settings.nextObject === "Pen") {
            shape = new Pen( settings.dragStartLocation.x, settings.dragStartLocation.y, settings.nextColor, settings.nextWidth);
        }
        else if (settings.nextObject === "Text") {
            var currentBox = document.getElementById("textBox");
            var boundingBox = settings.canvas.getBoundingClientRect();
            var xcords = settings.dragStartLocation.x + boundingBox.left;
            var ycords = settings.dragStartLocation.y + boundingBox.top;

            if(currentBox !== null){
              currentBox.remove()
            }

            this.textInput;
            this.textInput = $("<input />");
            $(this.textInput).attr("id", "textBox");
            this.textInput.css("position", "absolute");
            this.textInput.css("left", xcords + "px");
            this.textInput.css("top", ycords + "px");
            this.textInput.css("visibility", "visible");

            $("#canvasDiv").append(this.textInput);

        }
        settings.currentShape = shape;
    });

    $("#myCanvas").mousemove(function(e) {
        //console.log("Inside mousemove");

        if (settings.isDrawing === true) {
            if (settings.nextObject === "Text") {
                return;
            }
            drawAll();

            var shape = settings.currentShape;
            var position = getCanvasPoints(e);

            shape.setEnd(position.x, position.y);
            shape.draw(settings.context);
        }
    });

    $("#myCanvas").mouseup(function(e) {
        //console.log("Inside mouseup");

        if(settings.isDrawing === true) {
            if (settings.nextObject === "Text") {
                return;
            }
            var shape = settings.currentShape;
            var position = getCanvasPoints(e);

            settings.isDrawing = false;
            shape.setEnd(position.x, position.y);
            settings.shapes.push(shape);

            drawAll();
        }

    });
});

function drawAll() {
    settings.context.clearRect(0, 0, settings.canvas.width, settings.canvas.height);

    for(var i = 0; i < settings.shapes.length; i++) {
        settings.shapes[i].draw(settings.context);
    }
}

$(document).keypress(function(e) {
    if (e.keyCode === 13) {
        if (settings.nextObject === "Text") {
            var shape = new Text(settings.dragStartLocation.x, settings.dragStartLocation.y, settings.nextColor, settings.nextWidth);
            shape.draw(settings.context);
        }
    }
});

$('#clear-btn').click(function() {
    settings.shapes = [];
    settings.redo = [];
    drawAll();
})

$('#undo-btn').click(function() {
    if (settings.shapes.length > 0) {
      settings.redo.push(settings.shapes.pop());
      drawAll();
    }
})

$('#redo-btn').click(function() {
    if (settings.redo.length > 0) {
      settings.shapes.push(settings.redo.pop());
      drawAll();
    }
})

$('#red-rdo').click(function() {
    settings.nextColor = "Red";
})

$('#green-rdo').click(function() {
    settings.nextColor = "Green";
})

$('#blue-rdo').click(function() {
    settings.nextColor = "Blue";
})

$('#black-rdo').click(function() {
    settings.nextColor = "Black";
})

function changeShape(){
    settings.nextObject = $('#shapes').val();
}

function changeWidth(){
    settings.nextWidth = $('#str-width').val();
}
