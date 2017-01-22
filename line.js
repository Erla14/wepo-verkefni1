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
