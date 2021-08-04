function selectMat(fun,p){
    const vecShape = [p.length,1];
    switch (fun) {
        case "x": return tf.tensor2d(p, vecShape);
        case "x2": return tf.tensor2d(p, vecShape).pow(tf.scalar(2));
        case "x3": return tf.tensor2d(p, vecShape).pow(tf.scalar(3));
        // case "x3x2": return tf.tensor2d([tf.pow(p, tf.fill(vecShape, 3)),tf.pow(p,tf.fill(vecShape, 2))], [p.length,1]);
        case "x1/2": return tf.tensor2d(p, vecShape).pow(tf.scalar(1/2));
        case "1/x": return tf.tensor2d(p, vecShape).pow(tf.scalar(-1));
        case "sin": return tf.tensor2d(p, vecShape).sin();
        case "log": return tf.tensor2d(p, vecShape).log();
    }
}
function selectFun(fun){
    switch (fun) {
        case "x": return  (args, x) => args[0]*x;
        case "x2": return (args, x) => args[0]* x*x;
        case "x3": return (args, x) => args[0]* x*x*x;
        case "x1/2": return (args, x) => args[0]* Math.sqrt(x);
        case "1/x": return  (args, x) => args[0]/x;
        case "sin": return (args, x) => Math.PI*args[0]*Math.sin(x);
        case "log": return (args, x) => args[0]*Math.log(x);
    }
}

// function selectFunc(fun){
//     switch (fun) {
//         case "x": return  (args, x) => args[0]*x;
//         case "x2": return (args, x) => args[0]* x*x;
//     }
// }

async function lstSqr(A, b) {
    const [q, r] = tf.linalg.qr(A);
    const _A = r.array();
    const _b = q.transpose().dot(b).array();
    return math.usolve(await _A, await _b);
}

function drawFunc(pg, w, points, args, func) {
    if (args == null) {
        return;
    }
    let px = 0;
    let py = func(args, px - points.x0);
    for (let x = 0; x < w; x += 1) {
        let y = func(args, x-points.x0);
        pg.line(px, py + points.y0, x, y + points.y0)
        px = x;
        py = y;
    }
}


