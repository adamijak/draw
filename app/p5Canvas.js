const p5Canvas = (p) => {
    let points = new Points();
    let selected = false;
    let pg = null;
    let changed = true;
    let selectedFun = "x";

    let wW = () => p.windowWidth-15;
    let wH = () => p.windowHeight-60;

    let canvasInit = function (w, h) {
        pg.clear();
        pg.line(0, h / 2, w, h / 2);
        pg.line(w / 2, 0, w / 2, h);
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
        p.line(mX - 100, mY, mX + 100, mY);
        p.line(mX, mY - 100, mX, mY + 100);
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