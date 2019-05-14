var domIdMapTable = {};
var domIdMapChart = {};
var gridStackBuilder = null;
var currentTheme = 'default';
$(function () {
    buildSideItems();
    closeSideMenu();
    bindDragEndEvent();
    initChartThemes();
    gridStackBuilder = new GridStackBuilder();
    $('#save-grid').click(function () {
        gridStackBuilder.saveGrid()
    });
    $('#load-grid').click(function () {
        gridStackBuilder.loadGrid()
    });
    $('#clear-grid').click(function () {
        resetChartTheme('dark')
    });
    $('.grid-stack').on('click', 'a.close-btn', function () {
        var target = $(this).closest('.grid-stack-item');
        var widget = $(this).closest('.widget');
        var eleId = widget.data('id');
        gridStackBuilder.removeItem(target);
        destoryGridAndChart('modual_' + eleId)
    });
    $('.grid-stack').on('click', 'a.reset-btn', function () {
        var target = $(this).closest('.widget');
        var id = target.data('id');
        var type = target.data('type');
        initDataTable('modual_' + id, type)
    });
    $('.grid-stack').on('click', 'a.save-btn', function () {
        var target = $(this).closest('.widget');
        var id = target.data('id');
        var type = target.data('type');
        var modualId = 'modual_' + id;
        var datagrid = domIdMapTable[modualId];
        show_chart(type, '测试', datagrid, modualId)
    });
    $("#screen-shot").click(function () {
        var chartWrap = $("#graph-panel");
        var width = chartWrap.outerWidth() + 220;
        var height = chartWrap.outerHeight() + 60;
        var opts = {
            width: width,
            height: height,
            useCORS: true,
            onrendered: function (canvas) {
                var timestamp = Date.parse(new Date());
                saveFile(canvas.toDataURL(), timestamp / 1000 + '.png')
            }
        };
        html2canvas(chartWrap, opts)
    });
    $("#full-screen").click(function () {
        fullScreen()
    });
    $(window).resize(function () {
        allChartResize()
    })
});

function fullScreen() {
    var element = $('.main')[0];
    var method = "RequestFullScreen";
    var usablePrefixMethod;
    ["webkit", "moz", "ms", "o", ""].forEach(function (prefix) {
        if (usablePrefixMethod) return;
        if (prefix === "") {
            method = method.slice(0, 1).toLowerCase() + method.slice(1)
        }
        var typePrefixMethod = typeof element[prefix + method];
        if (typePrefixMethod + "" !== "undefined") {
            if (typePrefixMethod === "function") {
                usablePrefixMethod = element[prefix + method]()
            } else {
                usablePrefixMethod = element[prefix + method]
            }
        }
    });
    return usablePrefixMethod
};

function saveFile(data, filename) {
    var save_link = document.createElementNS('http://www.w3.org/1999/xhtml', 'a');
    save_link.href = data;
    save_link.download = filename;
    var event = document.createEvent('MouseEvents');
    event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
    save_link.dispatchEvent(event)
};

function initChartThemes() {
    var themes = ['default', 'dark', 'vintage', 'macarons', 'infographic', 'shine', 'roma'];
    var templat = '';
    themes.forEach(function (theme, i) {
        if (i == 0) {
            templat += '<li class="current" data-type="' + theme + '"><a href="javascript:;">' + theme + '</a></li>'
        } else {
            templat += '<li data-type="' + theme + '"><a href="javascript:;">' + theme + '</a></li>'
        }
    });
    $('#themeType').html(templat);
    $('#themeType li').on('click', function () {
        var themeType = $(this).data('type');
        $(this).addClass('current').siblings('li.current').removeClass('current');
        resetChartTheme(themeType)
    })
};

function resetChartTheme(themeType) {
    var themescripts = document.getElementById("themejs");
    if (themescripts) {
        themescripts.parentNode.removeChild(themescripts)
    }
    if (themeType == 'default') {
        changeChartsTheme(themeType);
        currentTheme = themeType
    } else {
        var script = document.createElement('script');
        script.setAttribute('id', 'themejs');
        script.onload = function () {
            changeChartsTheme(themeType);
            currentTheme = themeType
        };
        script.src = '../scripts/echarts/themes/' + themeType + '.js';
        document.body.appendChild(script)
    }
};

function changeChartsTheme(themeType) {
    for (var eleId in domIdMapChart) {
        var _chart = domIdMapChart[eleId];
        var option = _chart.getOption();
        var title = option.title[0].text;
        if (_chart) {
            _chart.dispose()
        }
        var type = $('#' + eleId).data('type');
        _chart = echarts.init(document.getElementById(eleId), themeType);
        var option = initDefaultOptions(type, title);
        option = dealGridData(type, option, getDefaultData(eleId, type));
        _chart.setOption(option);
        domIdMapChart[eleId] = _chart
    }
};

function closeSideMenu() {
    $('.sidemenu-item').on("click", function (e) {
        $(this).toggleClass("open")
    });
    $('.menu-btn').on('click', function (e) {
        $('.sidemenu-item').toggleClass("hide_arrow")
        var el = $('#menu');
        if (el.hasClass('menu-collapse')) {
            $('.sidemenu').width(200);
            $('.main').css({
                left: '200px'
            })
            $('.menu-btn span.iconfont').html('&#xe835;');
        } else {
            $('.sidemenu').width(50);
            $('.main').css({
                left: '50px'
            });
            $('.menu-btn span.iconfont').html('&#xe834;');
        }
        el.toggleClass('menu-collapse');
        $(window).resize()
    })
};

function buildSideItems() {
    var chartItems = [{
            type: 'bar',
            label: '柱状图',
            icon: '&#xe617;',
            childItems: [{
                type: 'bar',
                label: '柱状图',
                icon: '&#xe617;'
            }, {
                type: 'stackbar',
                label: '堆叠柱状图',
                icon: '&#xe601;'
            }, {
                type: 'anglebar',
                label: '极坐标柱图',
                icon: '&#xe613;'
            }, {
                type: 'polarbar',
                label: '极坐标堆叠柱图',
                icon: '&#xe613;'
            }]
        },
        {
            type: 'bar',
            label: '条形图',
            icon: '&#xe600;',
            childItems: [{
                type: 'column',
                label: '条形图',
                icon: '&#xe600;'
            }, {
                type: 'stackcolumn',
                label: '堆叠条形图',
                icon: '&#xe602;'
            }]
        },
        {
            type: 'pie',
            label: '饼图',
            icon: '&#xe60f;',
            childItems: [{
                type: 'pie',
                label: '饼图',
                icon: '&#xe60f;'
            }, {
                type: 'ring',
                label: '环形图',
                icon: '&#xe603;'
            }, {
                type: 'rose',
                label: '玫瑰图',
                icon: '&#xe621;'
            }]
        }, {
            type: 'line',
            label: '折线图',
            icon: '&#xe618;',
            childItems: [{
                type: 'line',
                label: '折线图',
                icon: '&#xe618;'
            }, {
                type: 'spline',
                label: '曲线图',
                icon: '&#xe62e;'
            }, {
                type: 'area',
                label: '面积图',
                icon: '&#xe619;'
            }, {
                type: 'stackline',
                label: '堆叠折线图',
                icon: '&#xe618;'
            }, {
                type: 'stack',
                label: '堆叠面积图',
                icon: '&#xe60c;'
            }]
        }, {
            type: 'funnel',
            label: '漏斗图',
            icon: '&#xe609;',
            childItems: [{
                type: 'funnel',
                label: '漏斗图',
                icon: '&#xe609;'
            }, {
                type: 'mutfunnel',
                label: '多系漏斗图',
                icon: '&#xe630;'
            }]
        }, {
            type: 'radar',
            label: '雷达图',
            icon: '&#xe60a;',
            childItems: [{
                type: 'radar',
                label: '多边形雷达图',
                icon: '&#xe60a;'
            }, {
                type: 'cradar',
                label: '圆形雷达图',
                icon: '&#xe60a;'
            }]
        },
        {
            type: 'scatter',
            label: '散点图',
            icon: '&#xe61a;',
            childItems: [{
                type: 'scatter',
                label: '散点图',
                icon: '&#xe61a;'
            }]
        }, {
            type: 'wordCloud',
            label: '词云图',
            icon: '&#xe616;',
            childItems: [{
                type: 'wordCloud',
                label: '词云图',
                icon: '&#xe616;'
            }]
        },
        {
            type: 'gauge',
            label: '仪表盘',
            icon: '&#xe610;',
            childItems: [{
                type: 'gauge',
                label: '数字仪表盘',
                icon: '&#xe610;'
            }]
        }, {
            type: 'graph',
            label: '关系图',
            icon: '&#xe624;',
            childItems: [{
                type: 'graph',
                label: '力导关系图',
                icon: '&#xe624;'
            }, {
                type: 'cgraph',
                label: '圆形关系图',
                icon: '&#xe624;'
            }]
        },
    ];
    var template = '<ul>';
    chartItems.forEach(function (item, index) {
        template += '<li class="meun-had"><a class="sidemenu-item"><span class="iconfont">'+ item.icon + '</span><span class="sidemenu-text">  ' + item.label + '</span><span class="iconfont up" style="font-size:8px; float:right">&#xe84f;</span><span class="iconfont down" style="font-size:8px; float:right">&#xe84c;</span></a><ul>';
        item.childItems.forEach(function (childItem) {
            template += '<li id="' + childItem.type + '" draggable="true" class="chart-item"><a class="sidemenu-item"><span class="iconfont">' + childItem.icon + '</span><span class="sidemenu-text"> ' + childItem.label + '</span></a></li>'
        });
        template += '</ul></li>'
    });
    template += '</ul>';
    $('#menu').append(template)
};

function bindDragEndEvent() {
    var sources = document.querySelectorAll(".chart-item");
    for (var i = 0; i < sources.length; ++i) {
        sources[i].addEventListener("dragstart", function (event) {
            var dt = event.dataTransfer;
            dt.effectAllowed = 'copy';
            dt.setData("text/plain", event.target.id)
        }, false)
    }
    var graphPanel = $('#graph-panel')[0];
    graphPanel.addEventListener("dragend", function (event) {
        event.preventDefault()
    }, false);
    graphPanel.addEventListener("drop", function (event) {
        var dt = event.dataTransfer;
        var chartType = dt.getData("text/plain");
        event.preventDefault();
        event.stopPropagation();
        var itemId = gridStackBuilder.addGridItem(chartType);
        show_chart(chartType, '示例数据', getDefaultData(itemId, chartType), itemId)
    }, false);
    document.ondragover = function (e) {
        e.preventDefault()
    };
    document.ondrop = function (e) {
        e.preventDefault()
    }
};

function initDataTable(eleId, type) {
    var gridData = getDefaultData(eleId, type);
    var htmlTemplat = '<div class="container-fluid" style="margin:5px;"><div class="form-group" style="margin-bottom:50px;"><div class="col-sm-6"><input type="text" class="form-control" id="title" value="图表标题" placeholder="请输入标题"></div></div><div id="gridtable"></div></div>';
    var gridTable = null;
    layer.open({
        type: 1,
        title: "设置图表数据",
        content: htmlTemplat,
        area: ['800px', '500px'],
        btn: ['确定', '取消'],
        maxmin: true,
        shade: false,
        success: function (layero, index) {
            gridTable = $('#gridtable').handsontable({
                minRows: 10,
                minCols: 10,
                minSpareRows: 1,
                minSpareCols: 1,
                rowHeaders: true,
                colHeaders: true,
                data: gridData
            }).data('handsontable')
        },
        yes: function (index, layero) {
            var datagrid = gridTable.getData();
            domIdMapTable[eleId] = datagrid;
            var title = $('#title').val();
            show_chart(type, title, datagrid, eleId);
            layer.close(index)
        }
    })
};

function getDefaultData(eleId, type) {
    var data = [];
    var tableData = domIdMapTable[eleId];
    if (tableData) {
        data = tableData
    } else {
        data = initChartTypeDemoData(type)
    }
    return data
};

function show_chart(type, title, datagrid, eleId) {
    var chartObj = domIdMapChart[eleId];
    if (chartObj) {
        chartObj.dispose()
    }
    chartObj = echarts.init(document.getElementById(eleId), currentTheme || 'default');
    var option = initDefaultOptions(type, title);
    option = dealGridData(type, option, datagrid);
    chartObj.setOption(option);
    domIdMapChart[eleId] = chartObj
};

function initDefaultOptions(type, title) {
    var option = {
        title: {
            text: title,
            textStyle: {
                fontStyle: 'normal',
                fontFamily: 'sans-serif',
                fontSize: 13
            }
        },
        tooltip: {
            trigger: 'axis'
        },
        grid: {
            left: '3%',
            right: '3%',
            bottom: '3%',
            containLabel: true
        },
        toolbox: {
            feature: {
                saveAsImage: {}
            }
        }
    };
    return option
};

function initChartTypeDemoData(type) {
    var data = [];
    if (type == 'bar' || type == 'column' || type == 'stackcolumn' || type == 'stackbar' || type == 'line' || type == 'stackline' || type == 'spline' || type == 'area' || type == 'stack' || type == 'anglebar' || type == 'polarbar') {
        data = [
            ["年份", "类型A", "类型B", "类型C"],
            ["2016", 120, 123, 80],
            ["2017", 100, 110, 100],
            ["2018", 200, 80, 120],
            ["2019", 130, 50, 130]
        ]
    } else if (type == 'pie' || type == 'ring' || type == 'rose' || type == 'funnel') {
        data = [
            ["类别", "数值"],
            ["A", 120],
            ["B", 100],
            ["C", 80],
            ["D", 60]
        ]
    } else if (type == 'scatter') {
        data = [
            ["X轴值", "Y轴值"],
            [10, 5],
            [6, 4],
            [3, 8],
            [5, 7]
        ]
    } else if (type == 'wordCloud') {
        data = [
            ["词", "大小"],
            ['数据可视化', 30],
            ['可拖拽', 30],
            ['关系图', 20],
            ['可视分析', 40],
            ['社会网络', 10],
            ['工程化', 20],
            ['Echarts', 40],
            ['D3', 50]
        ]
    } else if (type == 'radar' || type == 'cradar' || type == 'mutfunnel') {
        data = [
            ["类型", "预算", "实际"],
            ["销售经费", 10, 15],
            ["管理", 8, 6],
            ["市场", 20, 22],
            ["研发", 15, 15],
            ["客服", 5, 6]
        ]
    } else if (type == 'gauge') {
        data = [
            ["指标", "值", "最小值", "最大值"],
            ["时速", 80, 0, 180]
        ]
    } else if (type == 'graph' || type == 'cgraph') {
        data = [
            ["源点", "目标点"],
            ["A", "B"],
            ["A", "C"],
            ["A", "D"],
            ["A", "E"],
            ["B", "F"],
            ["B", "G"],
            ["B", "H"]
        ]
    }
    return data
};

function dealGridData(type, option, datagrid) {
    if (type == 'bar' || type == 'column' || type == 'stackcolumn' || type == 'stackbar' || type == 'line' || type == 'stackline' || type == 'spline' || type == 'area' || type == 'stack') {
        option = dealNormalData(option, datagrid, type)
    } else if (type == 'anglebar' || type == 'polarbar') {
        option = dealPolarData(option, datagrid, type)
    } else if (type == 'pie' || type == 'ring' || type == 'rose') {
        option = dealPieData(option, datagrid, type)
    } else if (type == 'scatter') {
        option = dealTwoDecimeData(option, datagrid, type)
    } else if (type == 'funnel' || type == 'mutfunnel') {
        option = dealFunnelData(option, datagrid, type)
    } else if (type == 'wordCloud') {
        dealWordCloudData(option, datagrid, type)
    } else if (type == 'radar' || type == 'cradar') {
        dealRadarData(option, datagrid, type)
    } else if (type == 'gauge') {
        dealGaugeData(option, datagrid, type)
    } else if (type == 'graph' || type == 'cgraph') {
        dealGraphData(option, datagrid, type)
    }
    return option
};

function dealNormalData(option, datagrid, type) {
    var series = [];
    var xAxisData = [];
    var xLabel = datagrid[0][0];
    var legendData = [];
    var firstRow = datagrid[0];
    for (var i = 1; i < firstRow.length; i++) {
        var cellData = firstRow[i];
        if (cellData == null || cellData == '') {
            break
        }
        legendData.push(cellData)
    }
    for (var i = 1; i < datagrid.length; i++) {
        var rowData = datagrid[i];
        var firstCellData = rowData[0];
        if (firstCellData == null || firstCellData == '') {
            break
        }
        xAxisData.push(firstCellData);
        for (var j = 1; j < rowData.length; j++) {
            var cellData = rowData[j];
            if (cellData == null || cellData == '') {
                break
            }
            var value = parseFloat(cellData);
            if (isNaN(value)) {
                value = 0
            }
            if (series[j - 1] == null) {
                series[j - 1] = [value]
            } else {
                series[j - 1].push(value)
            }
        }
    }
    var chartType = 'bar';
    var smoothFlag = false;
    var areaStyle = null;
    var stackFlag = null;
    option.legend = {
        data: legendData
    };
    if (type == 'bar' || type == 'stackbar') {
        option.xAxis = [{
            name: xLabel,
            data: xAxisData,
            type: 'category'
        }];
        option.yAxis = [{
            type: 'value'
        }];
        if (type == 'stackbar') {
            stackFlag = '总量'
        }
    } else if (type == 'column' || type == 'stackcolumn') {
        option.xAxis = [{
            type: 'value'
        }];
        option.yAxis = [{
            name: xLabel,
            data: xAxisData,
            type: 'category'
        }];
        if (type == 'stackcolumn') {
            stackFlag = '总量'
        }
    } else if (type == 'line' || type == 'stackline') {
        chartType = 'line';
        option.xAxis = [{
            name: xLabel,
            data: xAxisData,
            type: 'category',
            boundaryGap: false
        }];
        option.yAxis = [{
            type: 'value'
        }];
        if (type == 'stackline') {
            stackFlag = '总量'
        }
    } else if (type == 'spline') {
        chartType = 'line';
        option.xAxis = [{
            name: xLabel,
            data: xAxisData,
            type: 'category',
            boundaryGap: false
        }];
        option.yAxis = [{
            type: 'value'
        }];
        smoothFlag = true
    } else if (type == 'area') {
        chartType = 'line';
        option.xAxis = [{
            name: xLabel,
            data: xAxisData,
            type: 'category',
            boundaryGap: false
        }];
        option.yAxis = [{
            type: 'value'
        }];
        smoothFlag = true;
        areaStyle = {
            normal: {}
        }
    } else if (type == 'stack') {
        chartType = 'line';
        option.xAxis = [{
            name: xLabel,
            data: xAxisData,
            type: 'category',
            boundaryGap: false
        }];
        option.yAxis = [{
            type: 'value'
        }];
        smoothFlag = true;
        areaStyle = {
            normal: {}
        };
        stackFlag = '总量'
    }
    option.series = [];
    for (var i = 0; i < series.length; i++) {
        option.series.push({
            name: legendData[i],
            type: chartType,
            data: series[i],
            smooth: smoothFlag,
            stack: stackFlag,
            areaStyle: areaStyle
        })
    }
    return option
};

function dealPolarData(option, datagrid, type) {
    var series = [];
    var xAxisData = [];
    var legendData = [];
    var firstRow = datagrid[0];
    for (var i = 1; i < firstRow.length; i++) {
        var cellData = firstRow[i];
        if (cellData == null || cellData == '') {
            break
        }
        legendData.push(cellData)
    }
    for (var i = 1; i < datagrid.length; i++) {
        var rowData = datagrid[i];
        var firstCellData = rowData[0];
        if (firstCellData == null || firstCellData == '') {
            break
        }
        xAxisData.push(firstCellData);
        for (var j = 1; j < rowData.length; j++) {
            var cellData = rowData[j];
            if (cellData == null || cellData == '') {
                break
            }
            var value = parseFloat(cellData);
            if (isNaN(value)) {
                value = 0
            }
            if (series[j - 1] == null) {
                series[j - 1] = [value]
            } else {
                series[j - 1].push(value)
            }
        }
    }
    var chartType = 'bar';
    option.title.left = 'center';
    option.legend = {
        orient: 'vertical',
        left: 'left',
        data: legendData
    };
    option.polar = {};
    if (type == 'anglebar') {
        option.angleAxis = {};
        option.radiusAxis = {
            type: 'category',
            data: xAxisData,
            z: 10
        }
    } else if (type == 'polarbar') {
        option.radiusAxis = {};
        option.angleAxis = {
            type: 'category',
            data: xAxisData,
            z: 10
        }
    }
    option.series = [];
    for (var i = 0; i < series.length; i++) {
        option.series.push({
            name: legendData[i],
            type: chartType,
            data: series[i],
            coordinateSystem: 'polar',
            stack: 'a'
        })
    }
    return option
};

function dealRadarData(option, datagrid, type) {
    var series = [];
    var categoryData = [];
    var legendData = [];
    var firstRow = datagrid[0];
    for (var i = 1; i < firstRow.length; i++) {
        var cellData = firstRow[i];
        if (cellData == null || cellData == '') {
            break
        }
        legendData.push(cellData)
    }
    for (var i = 1; i < datagrid.length; i++) {
        var rowData = datagrid[i];
        var firstCellData = rowData[0];
        if (firstCellData == null || firstCellData == '') {
            break
        }
        categoryData.push({
            name: firstCellData
        });
        for (var j = 1; j < rowData.length; j++) {
            var cellData = rowData[j];
            if (cellData == null || cellData == '') {
                break
            }
            var value = parseFloat(cellData);
            if (isNaN(value)) {
                value = 0
            }
            if (series[j - 1] == null) {
                series[j - 1] = [value]
            } else {
                series[j - 1].push(value)
            }
        }
    }
    option.tooltip = {
        trigger: 'item',
        backgroundColor: 'rgba(0,0,250,0.2)'
    };
    option.title.left = 'left';
    option.legend = {
        top: 'bottom',
        data: legendData
    };
    option.radar = {
        indicator: categoryData,
        name: {
            textStyle: {
                color: '#fff',
                backgroundColor: '#73a2eb',
                borderRadius: 3,
                padding: [3, 5]
            }
        },
        splitArea: {
            areaStyle: {
                color: ['rgba(114, 172, 209, 0.2)', 'rgba(114, 172, 209, 0.4)', 'rgba(114, 172, 209, 0.6)', 'rgba(114, 172, 209, 0.8)', 'rgba(114, 172, 209, 1)'],
                shadowColor: 'rgba(0, 0, 0, 0.3)',
                shadowBlur: 10
            }
        },
        axisLine: {
            lineStyle: {
                color: 'rgba(255, 255, 255, 0.5)'
            }
        },
        splitLine: {
            lineStyle: {
                color: 'rgba(255, 255, 255, 0.5)'
            }
        }
    };
    if (type == 'cradar') {
        option.radar.shape = 'circle'
    }
    option.series = [];
    var datas = [];
    for (var i = 0; i < series.length; i++) {
        datas.push({
            name: legendData[i],
            value: series[i]
        })
    }
    option.series.push({
        type: 'radar',
        data: datas
    });
    return option
};

function dealPieData(option, datagrid, type) {
    var legendData = [];
    var seriesData = [];
    var categoryName = datagrid[0][0];
    option.series = [];
    for (var i = 1; i < datagrid.length; i++) {
        var rowData = datagrid[i];
        var firstCellData = rowData[0];
        if (firstCellData == null || firstCellData == '') {
            break
        }
        legendData.push(firstCellData);
        var valueCellData = rowData[1];
        var value = parseFloat(valueCellData);
        if (isNaN(value)) {
            value = 0
        }
        seriesData.push({
            name: firstCellData,
            value: value
        })
    }
    option.title.left = 'center';
    option.tooltip = {
        trigger: 'item',
        formatter: "{a} <br/>{b} : {c} ({d}%)"
    };
    option.legend = {
        orient: 'vertical',
        left: 'left',
        data: legendData
    };
    var circleRaius = '80%';
    var roseType = '';
    if (type == 'ring') {
        circleRaius = ['50%', '80%']
    } else if (type == 'rose') {
        circleRaius = ['20%', '80%'];
        roseType = 'radius'
    }
    option.series.push({
        name: categoryName,
        type: 'pie',
        roseType: roseType,
        radius: circleRaius,
        center: ['50%', '50%'],
        data: seriesData
    });
    return option
};

function dealTwoDecimeData(option, datagrid, type) {
    var seriesData = [];
    var xName = datagrid[0][0];
    var yName = datagrid[0][1];
    for (var i = 1; i < datagrid.length; i++) {
        var rowData = datagrid[i];
        var xCellData = rowData[0];
        if (xCellData == null || xCellData == '') {
            break
        }
        var xValue = parseFloat(xCellData);
        if (isNaN(xValue)) {
            xValue = 0
        }
        var yCellData = rowData[1];
        var yValue = parseFloat(yCellData);
        if (isNaN(yValue)) {
            yValue = 0
        }
        seriesData.push([xValue, yValue])
    }
    option.xAxis = {
        name: xName
    };
    option.yAxis = {
        name: yName
    };
    option.series = [];
    option.series.push({
        type: 'scatter',
        symbolSize: 10,
        data: seriesData
    });
    return option
};

function dealFunnelData(option, datagrid, type) {
    var categoryData = [];
    var legendData = [];
    var series = [];
    var firstRow = datagrid[0];
    for (var i = 1; i < firstRow.length; i++) {
        var cellData = firstRow[i];
        if (cellData == null || cellData == '') {
            break
        }
        legendData.push(cellData)
    }
    for (var i = 1; i < datagrid.length; i++) {
        var rowData = datagrid[i];
        var firstCellData = rowData[0];
        if (firstCellData == null || firstCellData == '') {
            break
        }
        categoryData.push(firstCellData);
        for (var j = 1; j < rowData.length; j++) {
            var cellData = rowData[j];
            if (cellData == null || cellData == '') {
                break
            }
            var value = parseFloat(cellData);
            if (isNaN(value)) {
                value = 0
            }
            if (series[j - 1] == null) {
                series[j - 1] = [value]
            } else {
                series[j - 1].push(value)
            }
        }
    }
    option.title.left = 'center';
    option.tooltip = {
        trigger: 'item',
        formatter: "{b} : {c}"
    };
    option.legend = {
        orient: 'vertical',
        left: 'left',
        data: categoryData
    };
    option.series = [];
    for (var i = 0; i < series.length; i++) {
        var seriesData = [];
        series[i].forEach(function (value, index) {
            seriesData.push({
                name: categoryData[index],
                value: value
            })
        });
        var showFlag = false;
        if (i % 2 == 0) {
            showFlag = true
        }
        option.series.push({
            name: legendData[i],
            type: 'funnel',
            left: '15%',
            top: 30,
            bottom: 10,
            width: '80%',
            maxSize: (1 - i * 0.2) * 100 + '%',
            sort: 'descending',
            data: seriesData,
            label: {
                normal: {
                    show: showFlag,
                    position: 'inside',
                    formatter: '{c}',
                    textStyle: {
                        color: '#fff'
                    }
                }
            }
        })
    }
    return option
};

function dealWordCloudData(option, datagrid, type) {
    var seriesData = [];
    for (var i = 1; i < datagrid.length; i++) {
        var rowData = datagrid[i];
        var firstCellData = rowData[0];
        if (firstCellData == null || firstCellData == '') {
            break
        }
        var valueCellData = rowData[1];
        var value = parseFloat(valueCellData);
        if (isNaN(value)) {
            value = 0
        }
        seriesData.push({
            name: firstCellData,
            value: value
        })
    }
    option.series = [{
        type: 'wordCloud',
        shape: 'ellipse',
        size: ['95%', '95%'],
        autoSize: {
            enable: true,
            minSize: 14,
            maxSize: 80
        },
        textStyle: {
            normal: {
                color: function () {
                    var colors = ['#fda67e', '#81cacc', '#cca8ba', "#88cc81", "#82a0c5", '#fddb7e', '#735ba1', '#bda29a', '#6e7074', '#546570', '#c4ccd3'];
                    return colors[parseInt(Math.random() * 10)]
                }
            },
            emphasis: {
                shadowBlur: 10,
                shadowColor: '#333'
            }
        },
        data: seriesData
    }];
    return option
};

function dealGaugeData(option, datagrid, type) {
    option.series = [];
    for (var i = 1; i < datagrid.length; i++) {
        var rowData = datagrid[i];
        var firstCellData = rowData[0];
        if (firstCellData == null || firstCellData == '') {
            break
        }
        var valueCellData = rowData[1];
        var value = parseFloat(valueCellData);
        if (isNaN(value)) {
            value = 0
        }
        var minData = rowData[2];
        var minValue = parseFloat(minData);
        if (isNaN(minValue)) {
            minValue = 0
        }
        var maxData = rowData[3];
        var maxValue = parseFloat(maxData);
        if (isNaN(maxValue)) {
            maxValue = 100
        }
        option.tooltip = {
            formatter: "{b} : {c}"
        };
        option.series.push({
            name: firstCellData,
            type: 'gauge',
            radius: '90%',
            min: minValue,
            max: maxValue,
            data: [{
                value: value,
                name: firstCellData
            }]
        })
    }
    return option
};

function dealGraphData(option, datagrid, type) {
    var nodes = [];
    var links = [];
    for (var i = 1; i < datagrid.length; i++) {
        var rowData = datagrid[i];
        var source = rowData[0];
        if (source == null || source == '') {
            break
        }
        if (nodes.indexOf(source) == -1) {
            nodes.push(source)
        }
        var target = rowData[1];
        if (target == null || target == '') {
            break
        }
        if (nodes.indexOf(target) == -1) {
            nodes.push(target)
        }
        links.push({
            source: source,
            target: target
        })
    }
    var _nodes = [];
    nodes.forEach(function (node) {
        _nodes.push({
            name: node,
            category: node
        })
    });
    var layoutType = 'force';
    if (type == 'cgraph') {
        layoutType = 'circular'
    }
    option.animationDurationUpdate = 1500;
    option.animationEasingUpdate = 'quinticInOut';
    option.series = [{
        type: 'graph',
        layout: layoutType,
        categories: _nodes,
        symbolSize: 30,
        roam: true,
        label: {
            normal: {
                show: true
            }
        },
        edgeSymbol: ['circle', 'arrow'],
        edgeSymbolSize: [2, 5],
        force: {
            initLayout: 'circular',
            gravity: 0.02,
            repulsion: 100,
            edgeLength: 50
        },
        lineStyle: {
            normal: {
                color: 'source',
                curveness: 0.3
            }
        },
        data: _nodes,
        links: links
    }];
    return option
};

function destoryGridAndChart(eleId) {
    if (eleId) {
        var _chart = domIdMapChart[eleId];
        if (_chart) {
            _chart.dispose()
        }
        var gridData = domIdMapTable[eleId];
        if (gridData) {
            gridData = null
        }
        domIdMapChart[eleId] = null;
        domIdMapTable[eleId] = null;
        delete domIdMapChart[eleId];
        delete domIdMapTable[eleId]
    }
};

function allChartResize() {
    for (var eleId in domIdMapChart) {
        var _chart = domIdMapChart[eleId];
        if (_chart) {
            _chart.resize()
        }
    }
};