class Shape {
    constructor(x, y, color, width) {
        this.x = x;
        this.y = y;
        this.endX = x;
        this.endY = y;
        this.color = color;
        this.width = width;
    }

    moveTo(posChange)
    {
        this.x += posChange.x;
        this.y += posChange.y;
        this.endX += posChange.x;
        this.endY += posChange.y;
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

    moveTo(posChange)
    {
        this.x += posChange.x;
        this.y += posChange.y;

        for( var i = 0; i < this.points.length; i++ ){
            this.points[i].x += posChange.x;
            this.points[i].y += posChange.y;
        }
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
        this.textInput;
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

    context.fillStyle = this.color;
    context.font = fontAndSize;
    context.fillText(this.textInput.val(),this.x,this.y);
    this.textInput.remove();
  }

  spawnBox() {
      var currentBox = document.getElementById("textBox");
      var boundingBox = settings.canvas.getBoundingClientRect();
      var xcords = settings.dragStartLocation.x + boundingBox.left;
      var ycords = settings.dragStartLocation.y + boundingBox.top;

      if (currentBox !== null) {
          currentBox.remove();
      }

      this.textInput = $("<input />");
      $(this.textInput).attr("id", "textBox");
      this.textInput.css("position", "absolute");
      this.textInput.css("left", xcords + "px");
      this.textInput.css("top", ycords + "px");
      this.textInput.css("visibility", "visible");

      $("#canvasDiv").append(this.textInput);
  }
}

var settings = {
    canvas: undefined,
    context: undefined,
    gcontext: undefined,
    nextObject: "Pen",
    nextColor: "Black",
    isDrawing: false,
    isMoving: false,
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

    var ghostcanvas = document.createElement('canvas');
    ghostcanvas.height = settings.canvas.height;
    ghostcanvas.width = settings.canvas.width;
    settings.gcontext = ghostcanvas.getContext('2d');

    function getCanvasPoints(e){
        var x = e.pageX - settings.canvas.offsetLeft;
        var y = e.pageY - settings.canvas.offsetTop;

        return {x: x, y: y};
    }

    function clear(ctx)
    {
        ctx.clearRect(0, 0, settings.canvas.width, settings.canvas.height);
    }

    $("#myCanvas").mousedown(function(e) {

        var shape = undefined;
        settings.redo = [];
        settings.dragStartLocation = getCanvasPoints(e);

        clear(settings.gcontext);

        var l = settings.shapes.length;
        for (var i = l-1; i >= 0; i--) {
            // draw shape onto ghost context
            settings.shapes[i].draw(settings.gcontext);

            // get image data at the mouse x,y pixel
            var imageData = settings.gcontext.getImageData(settings.dragStartLocation.x, settings.dragStartLocation.y, 1, 1);
            var index = (settings.dragStartLocation.x + settings.dragStartLocation.y * imageData.width) * 4;

            // if the mouse pixel exists, select and break
            if (imageData.data[3] > 0) {
                settings.isMoving = true;
                settings.currentShape = settings.shapes[i];
                clear(settings.gcontext);
                return;
            }
        }

        settings.isDrawing = true;

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
          shape = new Text(settings.dragStartLocation.x, settings.dragStartLocation.y, settings.nextColor, settings.nextWidth);
          shape.spawnBox();
        }
        settings.currentShape = shape;
    });

    $("#myCanvas").mousemove(function(e) {

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
        else if (settings.isMoving === true){

            var shape = settings.currentShape;
            var position = getCanvasPoints(e);
            var posChange = {x: position.x - settings.dragStartLocation.x, y: position.y - settings.dragStartLocation.y};
            shape.moveTo(posChange);
            settings.dragStartLocation = position;
            console.log(posChange);
            drawAll();
        }
    });

    $("#myCanvas").mouseup(function(e) {

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
        else if (settings.isMoving === true) {
            
            settings.isMoving = false;
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
            settings.shapes.push(settings.currentShape);
            drawAll();
        }
    }
});

$('#clear-btn').click(function() {
    settings.shapes = [];
    settings.redo = [];
    drawAll();
});

$('#undo-btn').click(function() {
    if (settings.shapes.length > 0) {
      settings.redo.push(settings.shapes.pop());
      drawAll();
    }
});

$('#redo-btn').click(function() {
    if (settings.redo.length > 0) {
      settings.shapes.push(settings.redo.pop());
      drawAll();
    }
});

$("#save-btn").click(function(){
  var url = "http://localhost:3000/api/drawings";

  var currentDate = new Date();
  var day = currentDate.getDate();
  var month = currentDate.getMonth() + 1;
  var year = currentDate.getFullYear();
  var drawingTitle = currentDate;
  var drawing = {
    title: "Picture from " + drawingTitle,
    content: settings.shapes
  };

  $.ajax({
    type: "POST",
    contentType: "application/json; charset=utf-8",
    url: url,
    data: JSON.stringify(drawing),
    success: function (data) {
        console.log(data);
    },
    error: function (xhr, err) {
        console.log(xhr);
        console.log(err);
    }
  });
});

$("#load-btn").click(function(){
  var url = "http://localhost:3000/api/drawings/0"; //harkóðað, þarf að laga

  $.ajax({
    type: "GET",
    contentType: "application/json; charset=utf-8",
    url: url,
    //dataGet: JSON.parse(data),    (virkar ekki...!)
    success: function (dataGet) {
        console.log(dataGet);
        settings.shapes = dataGet.content;
        drawAll();
    },
    error: function (xhr, err) {
        console.log(xhr);
        console.log(err);
    }
  });
});
//var savedDrawing = $.parseJSON(drawing);

$('#red-rdo').click(function() {
    settings.nextColor = "Red";
});

$('#green-rdo').click(function() {
    settings.nextColor = "Green";
});

$('#blue-rdo').click(function() {
    settings.nextColor = "Blue";
});

$('#black-rdo').click(function() {
    settings.nextColor = "Black";
});

function changeShape(){
    settings.nextObject = $('#shapes').val();
};

function changeWidth(){
    settings.nextWidth = $('#str-width').val();
};