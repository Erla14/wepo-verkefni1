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
