define([], function () {

    let drawPolygon = function () {
        this.sketchVM.create("polygon");
    }

    let drawPolyLine = function () {
        this.sketchVM.create("polyline");
    }

    let drawRectangle = function () {
        this.sketchVM.create("rectangle");
    }

    let drawCircle = function () {
        this.sketchVM.create("circle");
    }

    let setSketchSymbol = function (type, symbol) {
        symbol = {
            style: symbol.style || "circle",
            size: symbol.size || 6,
            color: symbol.color || [255, 255, 255],
            width: symbol.width || 2,
            outline: symbol.outline || {
                color: [50, 50, 50],
                width: 1
            }
        }
        if (type === 'pointSymbol') {
            symbol.type = "simple-marker"
        } else if (type === 'polygonSymbol') {
            symbol.type = "simple-fill"
        } else if (type === 'polylineSymbol') {
            symbol.type = "simple-line"
        } else {
            return
        }
        this.sketchVM[type] = symbol
    }

    let removeActive = function () {
        this.sketchLayer.remove(this.activeGraphic)
        this.sketchVM.cancel()
        this.activeGraphic = null
    }

    let removeAllSketch = function () {
        this.sketchLayer.removeAll()
    }

    return {
        drawPolygon,
        drawPolyLine,
        drawRectangle,
        drawCircle,
        setSketchSymbol,
        removeActive,
        removeAllSketch
    }
})