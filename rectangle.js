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