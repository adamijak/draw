export class Axes{
    center = {
        x: 0,
        y: 0,
    };

    secondaryAxes = new paper.Group({
        children: [
            new paper.Path.Line([0, 0], [window.outerWidth, 0]),
            new paper.Path.Line([0, 0], [0, window.outerHeight]),
        ],
        strokeWidth: 2,
        strokeColor: 'grey',
    });

    axes = new paper.Group({
        children: [
            new paper.Path.Line([0, 0], [window.outerWidth, 0]),
            new paper.Path.Line([0, 0], [0, window.outerHeight]),
        ],
        strokeWidth: 2,
        strokeColor: 'black',
    });

    constructor() {
        this.axesMoveToCenter();
    }
    axesMoveToCenter(){
        const center = paper.project.view.center;
        this.center.x = Math.floor(center.x/2)*2;
        this.center.y = Math.floor(center.y/2)*2;
        this.axesMove(this.center);
        this.secAxesMove(this.center);
    }
    axesMove(point){
        this.axes.children[0].setPosition(this.center);
        this.axes.children[1].setPosition(this.center);
    }
    secAxesMove(point) {
        this.secondaryAxes.children[0].setPosition([this.center.x, point.y]);
        this.secondaryAxes.children[1].setPosition([point.x, this.center.y]);
    }

}