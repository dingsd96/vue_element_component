define([], function () {

    class Geometry {
        constructor(type, data) {
            this.type = type
            this.longitude = data.longitude ? data.longitude : null
            this.latitude = data.latitude ? data.latitude : null
            this.paths = data.path ? data.path : null
            this.rings = data.rings ? data.rings : null
        }
    }

    class Symbol {
        constructor(type, data) {
            this.type = type
            this.url = data.url
            this.text = data.text
            this.color = data.color || [226, 119, 40]
            this.size = data.size || 12
            this.width = data.width || 5
            this.height = data.height || 5
            this.xoffset = data.xoffset || 0
            this.yoffset = data.yoffset || 0
            this.font = data.font || {size: 10}
            this.outline = data.outline || null
        }
    }

    let _addGraphic = function (graphic, layerId) {
        if (layerId) {
            let layers = this.map.allLayers.items
            if (Array.isArray(layers)) {
                let layer = layers.find((item) => {
                    return item.id === layerId
                })
                if (layer) {
                    layer.add(graphic)
                } else {
                    this.map.add(new this.esri.GraphicsLayer({id: layerId}).add(graphic));
                }
            }
        } else {
            this.view.graphics.add(graphic);
        }
    }

    let addPointSymbol = function (point = {}, symbol = {}, attributes = {}, popupTemplate, layerId) {

        let graphic = new this.esri.Graphic({
            geometry: new Geometry("point", point),
            symbol: new Symbol("simple-marker", symbol),
            attributes: attributes,
            popupTemplate: popupTemplate ? popupTemplate : null
        });

        _addGraphic.bind(this)(graphic, layerId)

        return graphic
    }

    let addPictureSymbol = function (point = {}, symbol = {}, attributes = {}, popupTemplate, layerId) {
        let graphic = new this.esri.Graphic({
            geometry: new Geometry("point", point),
            symbol: new Symbol("picture-marker", Object.assign({width: 28, height: 28}, symbol)),
            attributes: attributes,
            popupTemplate: popupTemplate ? popupTemplate : null
        });

        _addGraphic.bind(this)(graphic, layerId)

        return graphic
    }

    /*let addTextSymbol = function (point = {}, symbol = {}, attributes = {}, popupTemplate, layerId) {
        let graphic = new this.esri.Graphic({
            geometry: new Geometry("point", point),
            symbol: new Symbol("text", symbol),
            attributes: attributes,
            popupTemplate: popupTemplate ? popupTemplate : null
        });

        _addGraphic.bind(this)(graphic, layerId)

        return graphic
    }*/

    let addBackgroundTextSymbol = function (path = {}, symbol, attributes = {}, popupTemplate, layerId) {
        if (!Array.isArray(symbol)) symbol = [symbol, {}]
        let pointSymbol = Object.assign({
            size: 25,
            color: {a: 1, r: 255, g: 0, b: 0}
        }, symbol[1])
        let graphic2 = addPointSymbol.bind(this)(path, pointSymbol, attributes, popupTemplate, layerId)

        let graphic = new this.esri.Graphic({
            geometry: new Geometry("point", path),
            symbol: new Symbol("text", Object.assign(symbol[0], {yoffset: -3, font: {size: 12}})),
            attributes: attributes,
            popupTemplate: popupTemplate ? popupTemplate : null
        });
        _addGraphic.bind(this)(graphic, layerId)

        let pointSymbol2 = pointSymbol
        pointSymbol2.color = [0, 0, 0, 0]
        attributes = Object.assign(attributes, {associateGraphic: [graphic2, graphic]})
        return addPointSymbol.bind(this)(path, pointSymbol2, attributes, popupTemplate, layerId)

    }

    let addLineSymbol = function (path = {}, symbol = {}, attributes = {}, popupTemplate, layerId) {

        let graphic = new this.esri.Graphic({
            geometry: new Geometry("polyline", {path}),
            symbol: new Symbol("simple-line", symbol),
            attributes: attributes,
            popupTemplate: popupTemplate ? popupTemplate : null
        });

        _addGraphic.bind(this)(graphic, layerId)

        return graphic
    }

    let addPolygonSymbol = function (rings = {}, symbol = {}, attributes = {}, popupTemplate, layerId) {

        let graphic = new this.esri.Graphic({
            geometry: new Geometry("polygon", {rings}),
            symbol: new Symbol("simple-fill", symbol),
            attributes: attributes,
            popupTemplate: popupTemplate ? popupTemplate : null
        });

        _addGraphic.bind(this)(graphic, layerId)

        return graphic
    }

    let removeSymbol = function (graphic) {
        let layer = {}
        if (graphic.layer && graphic.layer.id) {
            layer = graphic.layer
        } else {
            layer = this.view.graphics
        }
        if (graphic.attributes && graphic.attributes.associateGraphic) {
            graphic.attributes.associateGraphic.forEach(item => {
                layer.remove(item);
            })
        }
        layer.remove(graphic);
    }

    let removerLayer = function (layerId) {
        if(layerId){
            this.map.remove(this.map.findLayerById(layerId))
        }else{
            let arr = this.map.allLayers.items.filter(layer=>layer.id !== 'TileLayer')
            arr.forEach(item=>{
                item.removeAll()
            })
        }
    }


    let changeSymbol = function (graphic, symbol) {
        if (!graphic.attributes.associateGraphic) {
            graphic.symbol = new Symbol(graphic.symbol.type, Object.assign(graphic.symbol, symbol))
        } else {
            changeAssociateGraphic(graphic, symbol)
        }
    }

    let changeAssociateGraphic = function (graphic, symbol) {
        graphic.symbol = new Symbol(graphic.symbol.type, Object.assign(graphic.symbol, symbol[1]))
        graphic.attributes.associateGraphic.forEach(item => {
            let _symbol = item.symbol.type === 'text' ? symbol[0] : symbol[1]
            item.symbol = new Symbol(item.symbol.type, Object.assign(item.symbol, _symbol))
        })
    }

    return {
        addPointSymbol,
        addPictureSymbol,
        addBackgroundTextSymbol,
        addLineSymbol,
        addPolygonSymbol,
        removeSymbol,
        removerLayer,
        changeSymbol
    }
});