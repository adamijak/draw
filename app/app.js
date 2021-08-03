let vW = () => windowWidth-15;
let vH = () => windowHeight-60;


let points = new Points();
let selected = false;
let pg;
let changed = true;


function selectMat(fun){
    switch (fun) {
        case "x2": return () => math.transpose([math.dotPow(points.X, 2)]);
        case "x3": return () => math.transpose([math.dotPow(points.X, 3)]);
        case "sin": return () => math.transpose([math.sin(points.X)]);
    }
}
function selectFn(fun){
    switch (fun) {
        case "x2": return (args, x) => args[0]* x*x;
        case "x3": return (args, x) => args[0]* x*x*x;
        case "sin": return (args, x) => args[0]*math.sin(x);
    }
}

let selectedFn = selectFn("x2");
let selectedMat = selectMat("x2");

function selectGraph(fun){
    selectedFn = selectFn(fun);
    selectedMat = selectMat(fun);
}



function canvasInit(w, h) {
    pg.clear();
    pg.line(0, h / 2, w, h / 2);
    pg.line(w / 2, 0, w / 2, h);
}

function setup() {
    let w = vW();
    let h = vH();
    const cnv = createCanvas(w, h);
    pg = createGraphics(w, h);
    canvasInit(w, h);
}

function windowResized() {
    let w = vW();
    let h = vH();
    resizeCanvas(w, h);
    canvasInit(w, h);
    changed = true;
}

function draw() {
    if (changed){
        changed = false;
        image(pg, 0, 0);
    }
}

function mousePressed() {
    const mX = mouseX;
    const mY = mouseY;
    strokeWeight(1);
    line(mX - 100, mY, mX + 100, mY);
    line(mX, mY - 100, mX, mY + 100);
    strokeWeight(3);
    points.offset(mX, mY);
}

function mouseReleased() {
    clear();
    if (points.any()) {
        const args = lstSqr(selectedMat(), points.Y);
        drawFunc(args, selectedFn);
        points.clear();
        selected = false;
    }
    changed = true;
}

function mouseDragged() {
    const mX = mouseX;
    const mY = mouseY;
    ellipse(mX, mY, 5);
    points.append(mX, mY);
}

function lstSqr(A, b) {
    const {Q, R} = math.qr(A);
    const _b = math.multiply(Q,b);
    return math.usolve([R[0]],[_b[0]]);
}

function drawFunc(args, func) {
    if (args == null) {
        return;
    }
    let px = 0;
    let py = func(args, px - points.x0);
    let w = vW();
    for (let x = 0; x < w; x += 1) {
        let y = func(args, x-points.x0);
        pg.line(px, py + points.y0, x, y + points.y0)
        px = x;
        py = y;
    }
    changed = true;
}


