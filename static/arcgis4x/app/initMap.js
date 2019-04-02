define([], () => {
    // 加载文件之后调用初始化地图
    let initMap = function (id, data, calFun) {
        require([
            "esri/Map",
            "esri/views/MapView",
            "esri/views/SceneView",
            "esri/layers/TileLayer",
            "esri/layers/MapImageLayer",

            "esri/Graphic",
            "esri/layers/GraphicsLayer",

            "esri/views/2d/draw/Draw",
            "esri/widgets/Sketch",
            "esri/widgets/Sketch/SketchViewModel",

            "esri/tasks/GeometryService",
            "esri/geometry/geometryEngine",
            "esri/tasks/support/BufferParameters",
            "esri/geometry/SpatialReference",
            "esri/geometry/support/webMercatorUtils",

            "dojo/domReady!"
        ], (
            Map,
            MapView,
            SceneView,
            TileLayer,
            MapImageLayer,
            Graphic,
            GraphicsLayer,
            Draw,
            Sketch,
            SketchViewModel,
            GeometryService,
            geometryEngine,
            BufferParameters,
            SpatialReference,
            webMercatorUtils
        ) => {
            this.esri.Map = Map; // Map
            this.esri.MapView = MapView; // MapView
            this.esri.SceneView = SceneView
            this.esri.TileLayer = TileLayer; // TileLayer
            this.esri.MapImageLayer = MapImageLayer

            this.esri.Graphic = Graphic // Graphic
            this.esri.GraphicsLayer = GraphicsLayer // Graphic

            this.esri.Draw = Draw
            this.esri.Sketch = Sketch
            this.esri.SketchViewModel = SketchViewModel

            this.esri.GeometryService = GeometryService
            this.esri.geometryEngine = geometryEngine
            this.esri.BufferParameters = BufferParameters
            this.esri.SpatialReference = SpatialReference
            this.esri.webMercatorUtils = webMercatorUtils

            _initMap.bind(this)(id, data, calFun)
        });
    };

    // 初始化地图
    let _initMap = function (id = 'map', data = {}, calFun) {

        this.mapLayer = new this.esri.TileLayer({
            url: data.url || this.MapService,
            id: 'TileLayer'
        })

        this.mapLayer.on("layerview-create", (event) => {
            if (this.eventObj.layerCreate) {
                this.triggerEvent('layerCreate', event)
            }
        });

        this.sketchLayer = new this.esri.GraphicsLayer({id: 'sketchLayer'})
        this.clusteringLayer = new this.esri.GraphicsLayer({id: 'clusteringLayer'})
        this.map = new this.esri.Map({
            layers: [this.mapLayer, this.sketchLayer, this.clusteringLayer]
        });

        this.view = new this.esri.MapView({
            container: id,
            map: this.map,
            zoom: data.zoom || 6,
            center: data.point || [113.3221, 23.1631],
            constraintsObject: {
                rotationEnabled: false
            },
            ui: {
                components: []
            }
        });

        this.view.watch("extent", (event) => {
            this.currentExtent = event
        });

        this.view.watch("zoom", (event) => {
            if (this.eventObj.zoomChange && (event % 1 === 0)) {
                this.triggerEvent('zoomChange', event)
            }
        });

        this.view.watch("animation", (response) => {
            if (!(response && response.state === "running")) {
                if (this.eventObj.extentChange) {
                    this.triggerEvent('extentChange', this.currentExtent)
                }
            }
        });

        this.view.on('drag', (event) => {
            if (event.action === 'end' && this.eventObj.extentChange) {
                this.triggerEvent('extentChange', this.currentExtent)
            }
        });


        this.view.on('click', (event => {
            this.view.hitTest(event).then((response) => {
                if (response.results[0]) {
                    this.clusterGraphicOnclickCalFun(response.results[0])
                    if (this.eventObj.graphicClick) {
                        this.triggerEvent('graphicClick', response.results[0])
                    }
                }
            })
        }))

        this.mouseOverGraphic = null
        this.view.on('pointer-move', (event => {
            this.view.hitTest(event).then((response) => {
                if (response.results[0]) {
                    let graphic = response.results[0].graphic
                    let mapPoint = response.results[0].mapPoint

                    if (graphic.attributes.type === 'pGri') {
                        if (!this.mouseOverGraphic) {
                            this.mouseOverGraphic = graphic
                            this.clusterGraphicMouseOverCalFun(graphic, mapPoint)
                        }
                    } else if (graphic.attributes.type === 'miniSymbol' || graphic.attributes.type === 'alone') {
                        this.clusterGraphicMouseOverCalFun(graphic, mapPoint)
                    }
                } else {
                    if (this.mouseOverGraphic && !this.hiddenMiniTimer) {
                        this.clusterGraphicMouseOutCalFun(this.mouseOverGraphic)
                    }
                    this.hiddenTitle()
                }
            })
        }))


        this.view.when(() => {
            this.sketchVM = new this.esri.SketchViewModel({
                layer: this.sketchLayer,
                view: this.view
            })

            this.sketchVM.on("create", event => {
                if (event.state === "complete") {
                    if (this.eventObj.drawEnd) {
                        this.triggerEvent('drawEnd', event.graphic)
                    }
                    if (this.eventObj.drawLineBufferEnd) {
                        this.triggerEvent('drawLineBufferEnd', event.graphic)
                    }
                }
            });

            this.sketchVM.on("update", event => {
                if (event.state === "complete" || event.state === "cancel") {
                    this.activeGraphic = null
                    if (this.eventObj.drawEnd) {
                        this.triggerEvent('drawEnd', event.graphics[0])
                    }
                    if (this.eventObj.drawLineBufferEnd) {
                        this.triggerEvent('drawLineBufferEnd', event.graphics[0])
                    }
                } else {
                    this.activeGraphic = event.graphics[0]
                }
            })
        });

        if (calFun) {
            calFun()
        }

    };


    //返回本模块API
    return {
        initMap
    }
})
