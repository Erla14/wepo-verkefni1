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
    },
    error: function (xhr, err) {
        // The drawing could NOT be saved
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
        context.lineWidth = this.width;
        context.strokeStyle = this.color;
        context.strokeRect(this.x, this.y, this.endX - this.x, this.endY - this.y);
    }
}

class Circle extends Shape {
    constructor(x, y, color){
        super(x, y, color);
       
    }

    doStuff(){
        super.doStuff();
    }

    draw(context){
        context.beginPath();
        context.arc(this.x, this.y, this.endX - this.x, this.endY - this.y, 2*Math.PI);
        context.stroke();
        context.closePath();
    
        if((this.x - this.endY) < 0) {


            this.x = Math.abs(this.x);
        }

        if(this.endY < 0) {
            this.y = Math.abs(this.y);
        }
    }
}

class Line extends Shape {
    constructor(x, y, color, width){
        super(x, y, color, width);
        this.points = [];
    }

    draw(context){

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
    }

    setEnd(x, y) {
        //þetta eru bara naflaus object, líka hægt að búa til klasa um points
        //og senda þá x og y sem færibreytur í smiðinn
        this.points.push({x: x, y: y});    }

    draw(context){
        
    }
}

var settings = {
canvas: undefined,
context: undefined,
nextObject: "Circle",
nextColor: "Black",
isDrawing: false,
currentShape: undefined,
dragStartLocation: undefined,
nextWidth: 3,
redo: undefined,
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

    
    $("#myCanvas").mousedown(function(e)
    {
        var shape = undefined;
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
            shape = new Text( settings.dragStartLocation.x, settings.dragStartLocation.y, settings.nextColor, settings.nextWidth);
        }

        settings.currentShape = shape;
    });

    $("#myCanvas").mousemove(function(e) {

        if (settings.isDrawing === true) {
            drawAll();

            var shape = settings.currentShape;

            var position = getCanvasPoints(e);

            shape.setEnd(position.x, position.y);

            shape.draw(settings.context);
        }        
    });

    $("#myCanvas").mouseup(function(e)
    {
        if(settings.isDrawing === true) {
            var shape = settings.currentShape;

            settings.isDrawing = false;
            var position = getCanvasPoints(e);
            shape.setEnd(position.x, position.y);

            settings.shapes.push(shape);

            drawAll();    
        }
        
    });
});

function drawAll() {
    settings.context.clearRect(0, 0, settings.canvas.width, settings.canvas.height);
    for(var i = 0; i < settings.shapes.length; i++)
    {
        settings.shapes[i].draw(settings.context);
    }
}

$('#clear-btn').click(function() {
    settings.shapes = [];
    settings.redo = [];
    drawAll();
})

$('#undo-btn').click(function() {
    settings.redo = settings.shapes.pop();
    drawAll();
})

$('#redo-btn').click(function() {
    if(settings.redo != undefined){
        settings.shapes.push(settings.redo);
        drawAll();
        settings.redo = undefined;    
    }
})
/*
$('#redo-btn').click(function() {
    if (settings.redo.length > 0) {
      settings.shapes.push(settings.redo.pop());
      drawAll();
    }
})
*/

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