class Points {
    constructor() {
        this.clear();
    }

    clear() {
        this.X = [];
        this.Y = [];
    }

    offset(x0, y0) {
        this.x0 = x0;
        this.y0 = y0;
    }

    append(x, y) {
        this.X[this.X.length] = x - this.x0;
        this.Y[this.Y.length] = y - this.y0;
    }

    any() {
        return 0 !== this.X.length;
    }
}