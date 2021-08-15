export class OffcanvasButton {
    constructor(offcanvasId, point, size) {
        this.offcanvas = new bootstrap.Offcanvas(document.getElementById(offcanvasId));
        this.button = new paper.Group({
            children: [
                new paper.Path.Rectangle({
                    point: [0,0],
                    size,
                    fillColor: 'white',
                    strokeColor: 'black',
                }),
                new paper.PointText({
                    point: [2,20],
                    content: 'Settings',
                    fillColor: 'black',
                    fontFamily: 'Courier New',
                    fontWeight: 'bold',
                    fontSize: 12,
                }),
            ],
            position: point,
            onMouseDown: (event) => {
                this.offcanvas.toggle();
            }
        });
    }
}