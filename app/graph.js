export class Graph {
    functions = {
        "x": {
            fn: (x) => [x],
            defaultTool:  'centeredDraw',
        },
        "x2": {
            fn: (x) => [x**2],
            defaultTool:  'centeredDraw',
        },
        "x3": {
            fn: (x) => [x**3],
            defaultTool:  'centeredDraw',
        },
        "x1/2": {
            fn: (x) => [x**1/2],
            defaultTool:  'centeredDraw',
        },
        "1/x": {
            fn: (x) => [1/x],
            defaultTool:  'offsetDraw',
        },
        "log": {
            fn: (x) => [Math.log10(x)],
            defaultTool:  'offsetDraw',
        },
        "ex": {
            fn: (x) => [Math.E**x],
            defaultTool:  'offsetDraw',
        },
        "2x": {
            fn: (x) => [2**x],
            defaultTool:  'offsetDraw',
        },
        "x3x2": {
            fn: (x) => [x**3,x**2],
            defaultTool:  'centeredDraw',
        },
    };

    #selected = this.functions['x'];
    A = [];
    b = [];
    x0 = 0;
    y0 = 0;



    #fnX = (x, args) => math.dot(this.#selected.fn(x), args);

    clear() {
        this.A = [];
        this.b = [];
    }

    selectFn(fn){
        this.#selected = this.functions[fn];
        return this.#selected.defaultTool;
    }

    append(point) {
        const fnRow = this.#selected.fn(point.x-this.x0);
        if (!fnRow.includes(NaN) && !fnRow.includes(Infinity) && !fnRow.includes(-Infinity)){
            this.A[this.A.length] = fnRow;
            this.b[this.b.length] = point.y-this.y0;
        }
    }

    offset(point) {
        this.x0 = point.x;
        this.y0 = point.y;
    }

    fit(){
        const {Q,R} = math.qr(math.matrix(this.A));
        const rn = math.min(R.size());
        return math.usolve(R.resize([rn,rn]), math.multiply(math.transpose(Q).resize([rn,Q.size()[1]]),this.b));
    }

    draw(args, w, color) {
        const line = new paper.Path({
            strokeWidth: 1.5,
            strokeColor: color,
        });

        for (let x = 0; x < w; x += 1) {
            const y = this.#fnX(x-this.x0,args);
            if (!isNaN(y) && isFinite(y)){
                line.add([x,y+this.y0]);
            }
        }
        line.simplify();
        return line;
    }

    async fitDraw(w, color) {
        const args = this.fit();
        return this.draw(args, w, color);
    }

    canFit = () => 0 !== this.A.length;
}