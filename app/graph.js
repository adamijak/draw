export class Graph {
    colorSelector = document.getElementById('colorSelector');

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
            fn: (x) => [x**0.5],
            defaultTool:  'centeredDraw',
        },
        "1/x": {
            fn: (x) => [1/x],
            defaultTool:  'offsetDraw',
            isBreakPoint: (x) => x === 0,
        },
        "log": {
            fn: (x) => [Math.log10(x)],
            defaultTool:  'offsetDraw',
        },
        "ex": {
            fn: (x) => [Math.E**(x/100)],
            defaultTool:  'offsetDraw',
        },
        "2x": {
            fn: (x) => [2**(x/100)],
            defaultTool:  'offsetDraw',
        },
        "x3x2": {
            fn: (x) => [x**3,x**2],
            defaultTool:  'centeredDraw',
        },
        "sin": {
            fn: (x) => [Math.sin(x/20/Math.PI)],
            defaultTool:  'centeredDraw',
        },
        "cos": {
            fn: (x) => [Math.cos(x/20/Math.PI)],
            defaultTool: 'offsetDraw',
        },
        "tg": {
            fn: (x) => [Math.tan((x*Math.PI)/200)],
            defaultTool:  'centeredDraw',
            isBreakPoint: (x) => {
                const eps = (x+100)%200;
                return 0 <= eps && eps <= 1;
            },
        },
    };

    #selected = this.functions['x'];
    A = [];
    b = [];
    x0 = 0;
    y0 = 0;

    constructor(defaultFn) {
        this.selectFn(defaultFn);
    }

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

    draw(x0, y0, w, fn) {
        const color = this.colorSelector.value;
        const isBreakPoint = this.#selected.isBreakPoint;

        const pathOpt = {
            strokeWidth: 1.5,
            strokeColor: color,
        }
        const line = new paper.Group({
            children: [new paper.Path(pathOpt)]
        });

        for (let x = 0; x < w; x += 1) {
            const y = fn(x);

            if(isNaN(y)){
                continue;
            }

            if(isBreakPoint && isBreakPoint(x-x0)){
                line.addChild(new paper.Path(pathOpt));
            }

            line.lastChild.add([x,y+y0]);
        }
        // line.simplify();
        return line;
    }

    fitDraw(w) {
        const args = this.fit();
        return this.draw(this.x0, this.y0, w, (x)=>math.dot(this.#selected.fn(x-this.x0), args));
    }

    drawExpression(exp,w){
        const fn = math.compile(exp);
        const center = paper.project.view.center;
        return this.draw(center.x, center.y, w, (x)=>-1*fn.evaluate({x:x-center.x}));
    }

    canFit = () => 0 !== this.A.length;
}