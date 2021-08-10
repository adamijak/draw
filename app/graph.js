export class Graph {
    #selectedFn = this.#selectFn("x");
    A = [];
    b = [];
    x0 = 0;
    y0 = 0;

    #selectFn(func){
        switch (func) {
            case "x": return (x) => [x];
            case "x2": return (x) => [x**2];
            case "x3": return (x) => [x**3];
            case "x1/2": return (x) => [x**(1/2)];
            case "1/x": return (x) => [1/x];
            case "log": return (x) => [Math.log10(x)];
            case "ex": return (x) => [Math.E**x];
            case "2x": return (x) => [2**x];
        }
    }
    #fnX = (x, args) => math.dot(this.#selectedFn(x), args);

    clear() {
        this.A = [];
        this.b = [];
    }

    selectFn(fn){
        this.#selectedFn = this.#selectFn(fn);
    }

    append(x, y) {
        const fnRow = this.#selectedFn(x-this.x0);
        if (!fnRow.includes(NaN) && !fnRow.includes(Infinity) && !fnRow.includes(-Infinity)){
            this.A[this.A.length] = fnRow;
            this.b[this.b.length] = y-this.y0;
        }
    }

    offset(x0, y0) {
        this.x0 = x0;
        this.y0 = y0;
    }

    async fit(){
        const [q, r] = tf.linalg.qr(tf.tensor2d(this.A));
        const U = r.array();
        const v = q.transpose().dot(this.b).array();
        return math.usolve(await U, await v);
    }

    draw(args, w) {
        let points = [];
        for (let x = 0; x < w; x += 1) {
            const y = this.#fnX(x-this.x0,args);
            points.push(x);
            points.push(y);
        }
        return new Konva.Line({
            x: this.x0,
            y: this.y0,
            stroke: 'black',
            strokeWeight: 3,
            points: points,
        });
    }

    async fitDraw(w) {
        const args = await this.fit();
        return this.draw(args, w);
    }

    canFit = () => 0 !== this.A.length;
}