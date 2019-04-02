define([], function () {

    //点聚类
    let pointClustering = function (data) {
        let size = {sm: 30, md: 150, lg: 500};
        let smSymbol = {color: {a: 0.8, r: 255, g: 204, b: 102}, outline: {color: {a: 0.8, r: 230, g: 184, b: 92}}}
        let mdSymbol = {color: {a: 0.8, r: 102, g: 204, b: 255}, outline: {color: {a: 0.8, r: 82, g: 163, b: 204}}}
        let lgSymbol = {color: {a: 0.8, r: 51, g: 204, b: 51}, outline: {color: {a: 0.8, r: 41, g: 163, b: 41}}}
        let xlSymbol = {color: {a: 0.8, r: 255, g: 65, b: 74}, outline: {color: {a: 0.8, r: 200, g: 52, b: 59}}}

        data.forEach(cluster => {
            if (cluster.length === 1) {
                clusterAddAlone.bind(this)(cluster)
            } else if (cluster.length < size.sm) {
                clusterAddClustering.bind(this)(cluster, smSymbol)
            } else if (cluster.length < size.md) {
                clusterAddClustering.bind(this)(cluster, mdSymbol)
            } else if (cluster.length < size.lg) {
                clusterAddClustering.bind(this)(cluster, lgSymbol)
            } else {
                clusterAddClustering.bind(this)(cluster, xlSymbol)
            }
        })
    };

    //alone
    let clusterAddAlone = function (data) {
        [data] = data
        let point = {longitude: data.longitude, latitude: data.latitude}
        let attribute = {type: "alone", name: data.name, data}
        if (data.gisIcon) {
            this.addPictureSymbol(point, diySymbol(0, 0, '../../images/camera1_n.png'), attribute, null, 'clusteringLayer')
        } else {
            this.addPointSymbol(point, clusterGetMiniSymbol(0, 0), attribute, null, 'clusteringLayer')
        }

    }

    //聚合点
    let clusterAddClustering = function (data, symbol) {
        let point = clusterGetCenterPoint(data)
        symbol = [{text: data.length, color: [255, 255, 255]}, symbol]

        //miniGraphic
        let miniSize = data.length <= 8 ? data.length : 8;
        let angle = 2 * Math.PI / miniSize;
        let miniGraphicId = []
        for (let i = 0; i < miniSize; i++) {
            let _symbol = {}
            let attribute = getAttribute(i, data)
            let graphic = {}
            if (data[i].gisIcon) {
                _symbol = diySymbol(Math.sin(angle * (i + 1)), Math.cos(angle * (i + 1)), data[i].gisIcon)
                graphic = this.addPictureSymbol(point, _symbol, attribute, null, 'clusteringLayer')
            } else {
                _symbol = clusterGetMiniSymbol(Math.sin(angle * (i + 1)), Math.cos(angle * (i + 1)))
                graphic = this.addPointSymbol(point, _symbol, attribute, null, 'clusteringLayer')
            }
            graphic.visible = false
            miniGraphicId.push(graphic.uid)
        }

        this.addBackgroundTextSymbol(point, symbol, {
            type: 'pGri',
            miniGri: data,
            miniGraphicId: miniGraphicId,
            id: data[0].id
        }, null, 'clusteringLayer')
    }

    //中心点
    let clusterGetCenterPoint = function (data) {
        let lng = 0, lat = 0;
        for (let i in data) {
            lng += data[i].longitude;
            lat += data[i].latitude;
        }
        lng /= data.length;
        lat /= data.length;

        return {longitude: lng, latitude: lat}
    }

    let getAttribute = function (i, data) {
        if (i === 7 && data.length > 8) {
            let _data = [];
            let name = '';
            for (let j = 7; j < data.length; j++) {
                _data.push(data[j]);
                j <= 9 ? name += data[j].name + '<br/>' : '';
                j === 9 ? name += '……' : '';
            }
            return {
                pGriId: data[0].id,
                name,
                data: _data,
                type: 'miniSymbol'
            }
        } else if (i <= 7) {
            return {
                pGriId: data[0].id,
                name: data[i].name,
                data: data[i],
                type: 'miniSymbol'
            }
        }
    }

    let diySymbol = function (x, y, url) {
        return {
            'url': url,
            'width': 20,
            'height': 20,
            'color': '',  //{a:1,r:255,g:255,b:255}
            'angle': 0,
            'xoffset': x * 30,
            'yoffset': y * 30
        }
    }

    //miniSymbol
    let clusterGetMiniSymbol = function (x, y) {
        return {
            "color": {a: 0.8, r: 119, g: 119, b: 119},
            "size": 17,
            "angle": 0,
            "xoffset": x * 30,
            "yoffset": y * 30,
            "outline": {
                "color": {a: 0.8, r: 255, g: 255, b: 255},
                "width": 1
            }
        }
    }

    let removeAllClustering = function () {
        this.clusteringLayer.removeAll()
    }

    //graphic移入
    function clusterGraphicMouseOverCalFun(graphic, mapPoint) {
        if (this.hiddenMiniTimer) {
            clearTimeout(this.hiddenMiniTimer)
            this.hiddenMiniTimer = null
        }
        if (graphic.attributes.type === 'pGri') {    //pGir
            if (graphic.attributes.miniGri.length > 20){
                this.mouseOverGraphic = null
                return
            }
            this.changeSymbol(graphic, [{font: {size: 15}}, {size: 32}])
            let graphicArr = []
            graphic.attributes.miniGraphicId.forEach(id => {
                graphicArr.push(this.clusteringLayer.graphics.items.find((element => {
                    return element.uid === id
                })))
            })
            clusterShowMini(graphicArr)
        }
        else if (graphic.attributes.type === 'miniSymbol') {
            if (this.mouseOverGraphic) {
                if (this.mouseOverGraphic.attributes.id === graphic.attributes.pGriId) {
                    this.showTitle(mapPoint, graphic.attributes.name)
                }
                else {
                    this.clusterGraphicMouseOutCalFun(this.mouseOverGraphic)
                }
            }
        } else if (graphic.attributes.type === 'alone') {
            this.showTitle(mapPoint, graphic.attributes.name)
        }
    }

    //clusterShowMini
    function clusterShowMini(graphics) {
        for (let i = 0; i < graphics.length; i++) {
            (function (i) {
                setTimeout(function () {
                    graphics[i].visible = true
                }, 50 * i)
            })(i);
        }
    }

    //graphic移出
    function clusterGraphicMouseOutCalFun(graphic) {
        let graphicArr = []
        graphic.attributes.miniGraphicId.forEach(id => {
            graphicArr.push(this.clusteringLayer.graphics.items.find((element => {
                return element.uid === id
            })))
        })
        clusterHiddenMini.bind(this)(graphicArr, graphic)
    }

    // clusterHiddenMini
    function clusterHiddenMini(graphics, Pgri) {
        this.hiddenMiniTimer = setTimeout(function () {
            hiddenTitle()
            this.changeSymbol(Pgri, [{font: {size: 12}}, {size: 25}])
            for (let i = 0; i < graphics.length; i++) {
                (function (i) {
                    setTimeout(function () {
                        graphics[i].visible = false
                    }, 50 * i)
                })(i);
            }
            this.mouseOverGraphic = null
            this.hiddenMiniTimer = null
        }.bind(this), 200)
    }

    // clusterGraphicOnclickCalFun
    function clusterGraphicOnclickCalFun(event) {
        let graphic = event.graphic
        let mapPoint = event.mapPoint
        if (graphic.attributes.type === 'miniSymbol' || graphic.attributes.type === 'alone') {
            if (this.eventObj.clusterOnClick) {
                this.triggerEvent('clusterOnClick', graphic, mapPoint)
            }
        }
    }

    // showTitle
    let showTitle = function (event, title, x, y) {
        if (!title) return
        this.hiddenTitle()
        let {x: pointX, y: pointY} = this.view.toScreen(event)

        let div = document.createElement("div")
        div.id = "miniSymbolNameDiv"
        div.innerHTML = title
        x = x || this.position.x
        y = y || this.position.y
        div.style.left = pointX + x + "px"
        div.style.top = pointY + y + "px"
        div.style.position = "absolute"
        div.style['z-index'] = 99
        div.style.background = '#fcffd1'
        div.style['font-size'] = '10px'
        div.style.border = '1px solid #0096ff'
        div.style.padding = '0.1em 0.3em 0.1em'
        div.style['border-radius'] = '3px'
        div.style['box-shadow'] = '0 0 0.75em #777777'
        document.body.appendChild(div);

    };

    // hiddenTitle
    let hiddenTitle = function (e) {
        let div = document.getElementById("miniSymbolNameDiv")
        if (div) {
            document.body.removeChild(div)
        }
    };

    return {
        pointClustering,
        removeAllClustering,
        clusterGraphicMouseOverCalFun,
        clusterGraphicMouseOutCalFun,
        clusterGraphicOnclickCalFun,
        showTitle,
        hiddenTitle
    }
})