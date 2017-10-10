// 地址解析器
var myGeo = new BMap.Geocoder()
// 大区集合
var myLabeless = []
// 住宅小区集合
var VillageLabeless = []
// 起始z-index
var zIndex = 10
// 大区点击状态
var isAreaClick = false
// 当前大区id
var _areaId = ""




// 地图缩放级别更改结束时
/***** map.setMaxZoom(19),map.setMinZoom(11)会触发zoomend事件 ****/
map.addEventListener('zoomend', eventHandle)
// 地图拖拽结束
/****  centerAndZoom会触发moveend事件，且多次触发  ****/
map.addEventListener('moveend', eventHandle)
map.addEventListener('touchend',function(e){
    e.domEvent.srcElement.click()
});
function eventHandle(e) {
    var zoom = map.getZoom()
    if(zoom >= 17) {
    	//areaClick：点击行政区执行的地图缩放
    	//noAreaClick：滚动地图缩放，鼠标拖拽
    	_areaId?areaClick(_areaId):noAreaClick()
    }else {
        Areashows()
    }
}



/*----------大区显示-------------------*/
//f: 行政区数据
function Areashows() {
    var fyInfo = _fyInfo
    removeGroundOverlay()
    myLabeless = []
    //循环绑定行政区
    for (var i = 0; i < fyInfo.length; i++) {
            point = new BMap.Point(fyInfo[i].PointX, fyInfo[i].PointY)
            
            var txtdictId = fyInfo[i].dictId

            // 复杂的自定义覆盖物
            function ComplexCustomOverlay(point, text, textem, texta) {
                this._point = point
                this._text = text
                this._textem = textem
                this._texta = texta
            }
            ComplexCustomOverlay.prototype = new BMap.Overlay()
            ComplexCustomOverlay.prototype.initialize = function (map) {
                this._map = map
                var div = this._div = document.createElement("div")
                div.style.position = "absolute"
                div.style.zIndex = BMap.Overlay.getZIndex(this._point.lat)
                div.style.background = "url(map_points.png)"
                div.style.color = "white"
                div.style.height = "50px"
                div.style.width = "90px"
                div.style.textAlign = "center"
                div.style.padding = "20px 0"
                div.style.lineHeight = "24px"
                div.style.fontSize = "16px"
                div.data =    fyInfo[i].dictId

                var span = this._span = document.createElement("span")
                div.appendChild(document.createTextNode(this._text))
                div.appendChild(span)

                var em = this._span = document.createElement("em")
                em.style.display = "block",
                em.style.fontSize = "14px",
                span.appendChild(em)
                em.appendChild(document.createTextNode(this._textem))

                var that = this
                map.getPanes().labelPane.appendChild(div)
                div.onclick = function(e) {
                    var divE = this
                    removeGroundOverlay()
                    // 记录行政区id，记录执行了点击行政区操作
                     _areaId = divE.data
                    map.removeEventListener("moveend", eventHandle);
                    resetMap(divE.data,fyInfo) 
                }
                return div
            }
            ComplexCustomOverlay.prototype.draw = function () {
                var map = this._map
                var pixel = map.pointToOverlayPixel(this._point)
                this._div.style.left = pixel.x - 30 + "px"
                this._div.style.top = pixel.y - 30 + "px"
            }
            var texta = fyInfo[i].dictId
            var text = fyInfo[i].RegionName
            var textem = fyInfo[i].DictHJ + " 套"
            var myCompOverlay = new ComplexCustomOverlay(point, text, textem, texta)

            map.addOverlay(myCompOverlay)

            myLabeless[i] = myCompOverlay
    }
}

/*----------小区显示-------------------*/
function Villageshows(sqInfo) {
    removeGroundOverlay()
    //循环绑定小区
    for (var i = 0; i < sqInfo.length; i++) {
        if( sqInfo[i].SecondAveragePrice > 0) {
            var point = new BMap.Point(sqInfo[i].PointX, sqInfo[i].PointY)
           //VillageLabel = new BMap.Label("<div class='single_price clearfix'  onmouseenter='addZindex(this)'> <div class='single_price_left'><span class='single_price_num'>" + sqInfo[i].SecondAveragePrice + "万</span><em class='san'></em></div><span class='single_name' >  " + sqInfo[i].shopName+ "<em>"+sqInfo[i].HouNum + "</em>套</span></div></a> ",
           VillageLabel = new BMap.Label("  <div class='detail shawdow' onclick = 'getHDetail("+ sqInfo[i].CommunityID+")'  onmouseenter='addZindex(this)'><a class='detail_price'>"+sqInfo[i].SecondAveragePrice+"<em>万</em></a><span class='detail_deco'>" + sqInfo[i].shopName+ "  <em>"+sqInfo[i].HouNum + "</em>套</span><em class='san'></em></div> ",
            {    
                offset: new BMap.Size( - 35, -40),
                position: point
            })
            VillageLabel.setStyle({
                "border": "0",
                "padding": "0"
            })
            var result = BMapLib.GeoUtils.isPointInRect(point, map.getBounds())
            if (result == true) {
                VillageLabeless[i] = VillageLabel
                map.addOverlay(VillageLabel)
            }
        }
    }
}

/*----------清除-------------------*/
function removeGroundOverlay() {
    for (i = 0; i < myLabeless.length; i++) {
        map.removeOverlay(myLabeless[i])
    }
    for (i = 0; i < VillageLabeless.length; i++) {
        map.removeOverlay(VillageLabeless[i])
    }   
}

/*-----------小区显示优先级--------------*/
function addZindex(ele){
    zIndex++
    $(ele).closest('label').css('z-index',zIndex)
}  

/*-----------resetMap--------------*/
// dictId 行政区id
function resetMap(dictId,fyInfo) {
    var pointDict = ""
    for(index in fyInfo) {
        // 匹配大区
        if(fyInfo[index].dictId == dictId) {
            if(fyInfo[index].DictHJ!=0) {
                pointDict = new BMap.Point(fyInfo[index].PointX, fyInfo[index].PointY)
            }
        }
    }
    // 触发地图 缩放事件
    map.centerAndZoom(pointDict, 17)
    map.addEventListener('moveend', eventHandle)
}



/*-----------houseDetail 数据填充--------------*/
//houseInfoList 是一个数组形json
function setTemplate(houseInfoList) {
    var _d = $(".dd")
    if(!houseInfoList || !houseInfoList.length){
        // 提示没有数据。不需要
    }else {
        _d.empty()
        for(var i = 0;i<houseInfoList.length;i++) {
            var content = 
            "<div class='dd_wrap clearfix'>"+
                "<div class='ddw_left'><a href='#'><img src='"+houseInfoList[i].DefaultPic+"'></a></div>"+
                "<div class='ddw_right'>"+
                    "<h1>"+houseInfoList[i].HouseInfo['Title']+"</h1>"+
                    "<p class='ddwr_p'>"+
                        "<strong class='ddwr_price'>"+houseInfoList[i].HouseInfo['PriceTotal']+"万元</strong>"+
                        "<em class='ddwr_aver'>（"+houseInfoList[i].HouseInfo['PriceSingle']+"/㎡）</em>"+
                        "<br>"+
                        "<em>"+houseInfoList[i].HouseInfo['Hou_Name']+"</em>"+
                    "</p></div></div>"
            _d.append(content)
        }
        _defHouse=  (_defHouse?_defHouse:_d.html())
    }
}