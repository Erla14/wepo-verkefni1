var settings = {
canvas: undefined,
context: undefined,
nextObject: "Pen",
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