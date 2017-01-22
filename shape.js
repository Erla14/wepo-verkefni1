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
