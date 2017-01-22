<!--setja textasvæði sem er hidden, svo þegar smellt er, birtist það   -->
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
