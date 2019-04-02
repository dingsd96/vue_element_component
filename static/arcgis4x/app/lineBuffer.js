define([], function () {

    let drawLineBuffer = function (distances) {
        this.subscribeEvent('drawLineBufferEnd', (data) => {
            if (data.data.symbol.type === 'simple-line') {
                this.showLineBuffer(data.data, distances)
            }
        })
        this.drawPolyLine()
    }

    let showLineBuffer = function (graphic, distances) {
        this.removerLayer('lineBufferLayer')
        if (distances <= 0) return
        let lineBuffer = this.esri.geometryEngine.buffer(graphic.geometry, distances, "kilometers")
        let xy = this.esri.webMercatorUtils.webMercatorToGeographic(lineBuffer)
        let symbol = {
            color: {r: 24, g: 144, b: 255, a: 0.3},
            outline: {
                color: {r: 24, g: 144, b: 255, a: 0.6},
                width: 2
            }
        }
        this.addPolygonSymbol(xy.rings[0], symbol, {}, null, 'lineBufferLayer')
    }

    //返回本模块API
    return {
        drawLineBuffer,
        showLineBuffer
    }
})