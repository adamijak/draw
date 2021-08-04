const p5Canvas = (p) => {
    let points = new Points();
    let selected = false;
    let pg = null;
    let changed = true;
    let selectedFun = "x";

    let wW = () => p.windowWidth-15;
    let wH = () => p.windowHeight-60;

    let canvasInit = (w, h) => {
        pg.clear();
        const w2 = w/2;
        const h2 = h/2;
        drawCross(pg, w2, h2,w2,h2);
    }

    let drawCross = (cnv, x, y, w, h) => {
        cnv.line(x - w, y, x+w, y);
        cnv.line(x, y-h, x, y+h);
    }

    p.selectFun = (fun) => selectedFun = fun;

    p.setup = () => {
        let w = wW();
        let h = wH();
        const cnv = p.createCanvas(w, h);
        pg = p.createGraphics(w, h);
        canvasInit(w, h);
    }

    p.draw = () => {
        if (changed){
            changed = false;
            p.image(pg, 0, 0);
        }
    }

    p.mousePressed = () => {
        const mX = p.mouseX;
        const mY = p.mouseY;
        p.strokeWeight(1);
        drawCross(p, mX, mY, 50, 50);
        p.strokeWeight(3);
        points.offset(mX, mY);
    }

    p.mouseReleased = () => {
        p.clear();
        changed = true;
        p.draw();
        if (points.any()) {
            lstSqr(selectMat(selectedFun, points.X), points.Y).then(res => {
                const x = tf.range(0,wW()).arraySync();
                drawFunc(pg, wW(), points, res, selectFun(selectedFun));
                points.clear();
                selected = false;
                changed = true;
            });
        }
    }

    p.mouseDragged = () => {
        const mX = p.mouseX;
        const mY = p.mouseY;
        p.ellipse(mX, mY, 5);
        points.append(mX, mY);
    }

    p.windowResized = () => {
        let w = wW();
        let h = wH();
        p.resizeCanvas(w, h);
        canvasInit(w, h);
        changed = true;
    }
};

const P5 = new p5(p5Canvas, 'p5Canvas');