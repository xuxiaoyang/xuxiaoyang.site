$(function () {
    lineChart();
    barChart();
    triaBarChart();
    rosePieChart();
    progressPieChart();
    gaugeChart();
    //生成指定个数的随机数组
    function randomArr(num, mincount,maxcount) {
        var arr = [];
        for(let i=0;i<num;i++){
            arr.push((Math.random() * maxcount +mincount).toFixed(0))
        }
        return arr
    }
    function lineChart() {
        // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById('chart_1'));
        var data = [
            randomArr(4,0,60),randomArr(4,0,60)
        ]
        var option = {
            tooltip: {
                trigger: 'axis'
            },
            grid: {
                borderWidth: 0,
                top: 5,
                bottom: 25,
                left: 10,
                right: 20,
                containLabel: true
            },
            color: ['#a4d8cc', 'rgb(218,103,84)'],
            legend: {
                data: ['在线', '离线'],
                icon: 'circle',
                bottom: 5,
                right: 15,
                itemWidth: 4,
                textStyle: {
                    color: 'white',
                    fontSize: 10
                }
            },
            calculable: true,
            xAxis: [{
                type: 'category',
                axisTick: {
                    show: false
                },
                boundaryGap: false,
                axisLabel: {
                    textStyle: {
                        color: 'rgba(255,255,255,.6)',
                        fontSize: '10',
                    },
                    lineStyle: {
                        color: 'rgba(255,255,255,.1)',
                    },
                    interval: {
                        default: 0
                    },
                    formatter: function (params) {
                        var newParamsName = ""; // 最终拼接成的字符串
                        var paramsNameNumber = params.length; // 实际标签的个数
                        var provideNumber = 4; // 每行能显示的字的个数
                        var rowNumber = Math.ceil(paramsNameNumber / provideNumber); // 换行的话，需要显示几行，向上取整
                        /**
                         * 判断标签的个数是否大于规定的个数， 如果大于，则进行换行处理 如果不大于，即等于或小于，就返回原标签
                         */
                        // 条件等同于rowNumber>1
                        if (paramsNameNumber > provideNumber) {
                            /** 循环每一行,p表示行 */
                            var tempStr = "";
                            tempStr = params.substring(0, 4);
                            newParamsName = tempStr + "..."; // 最终拼成的字符串
                        } else {
                            // 将旧标签的值赋给新标签
                            newParamsName = params;
                        }
                        //将最终的字符串返回
                        return newParamsName
                    }

                },
                data: ['门禁', '对讲', '摄像头 ', '智能终端']
            }],
            yAxis: {
                min: 0,
                type: 'value',
                axisLabel: {
                    textStyle: {
                        color: '#ccc',
                        fontSize: '10',
                    }
                },
                axisLine: {
                    lineStyle: {
                        color: 'rgba(160,160,160,0.2)',
                    }
                },
                splitLine: {
                    lineStyle: {
                        color: 'rgba(160,160,160,0.2)',
                    }
                },
                splitNumber: 3
            },

            series: [{
                    name: '在线',
                    lineStyle: {
                        color: '#72b0f9',
                    },
                    type: 'line',
                    areaStyle: {
                        normal: {
                            type: 'default',
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 0.8, [{
                                offset: 0,
                                color: 'rgba(129,197,255,.6)'
                            }, {
                                offset: 1,
                                color: 'rgba(129,197,255,.0)'
                            }], false)
                        }
                    },
                    itemStyle: {
                        normal: {
                            areaStyle: {
                                type: 'default'
                            }
                        }
                    },
                    data: data[0]
                },
                {
                    name: '离线',
                    lineStyle: {
                        color: 'rgb(218,103,84)'
                    },
                    type: 'line',
                    areaStyle: {
                        normal: {
                            type: 'default',
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 0.8, [{
                                offset: 0,
                                color: 'rgba(218,103,84,.6)'
                            }, {
                                offset: 1,
                                color: 'rgba(218,103,84,0)'
                            }], false)
                        }
                    },
                    itemStyle: {
                        normal: {
                            areaStyle: {
                                type: 'default'
                            }
                        }
                    },
                    data: data[1]
                }
            ]
        };

        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
        window.addEventListener("resize", function () {
            myChart.resize();
        });
    }

    function barChart() {
        var myChart = echarts.init(document.getElementById('chart_2'));
        var data = [
            randomArr(3,10,20),
            randomArr(3,20,40),
            randomArr(3,40,60)
        ]
        var option = {
            tooltip: {
                show: "true",
                trigger: 'item',
                backgroundColor: 'rgba(0,0,0,0.4)', // 背景
                padding: [8, 10], //内边距
                formatter: function (params) {
                    if (params.seriesName != "") {
                        return params.name + ' ：  ' + params.value;
                    }
                },

            },
            color: ['rgb(51,151,237)', 'rgb(218,103,84)', 'rgb(113,193,159)'],
            legend: {
                data: ['一级', '二级', '三级'],
                icon: 'square',
                bottom: 2,
                right: 15,
                itemWidth: 10,
                textStyle: {
                    color: 'white',
                    fontSize: 10
                }
            },
            grid: {
                borderWidth: 0,
                top: 5,
                bottom: 25,
                left: 10,
                right: 10,
                textStyle: {
                    color: "#fff"
                },
                containLabel: true
            },
            xAxis: {
                type: 'category',
                axisTick: {
                    show: false
                },
                axisLine: {
                    show: false
                },
                axisLabel: {
                    inside: false,
                    textStyle: {
                        fontSize: '10',
                        color: 'rgba(255,255,255,0.6)'
                    }
                },
                data: ['所内应急指挥', '所外就医指挥', '押解投牢指挥'],
            },
            yAxis: {
                min: 0,
                type: 'value',
                axisTick: {
                    show: false
                },
                axisLine: {
                    show: false
                },
                splitLine: {
                    show: true,
                    interval: 'auto',
                    lineStyle: {
                        color: 'rgba(255,255,255,0.1)',
                    }
                },
                axisLabel: {
                    textStyle: {
                        color: '#bac0c0',
                        fontWeight: 'normal',
                        fontSize: '10',
                    },
                    formatter: '{value}',
                },
                splitNumber: 2
            },
            series: [{
                    name: '一级',
                    type: 'bar',
                    itemStyle: {
                        normal: {
                            show: true,
                            barBorderRadius: 50,
                            borderWidth: 0,
                        },
                        emphasis: {
                            shadowBlur: 15,
                            shadowColor: 'rgba(105,123, 214, 0.7)'
                        }
                    },
                    zlevel: 2,
                    barWidth: '10%',
                    data: data[0]
                },
                {
                    name: '二级',
                    type: 'bar',
                    itemStyle: {
                        normal: {
                            show: true,
                            barBorderRadius: 50,
                            borderWidth: 0,
                        },
                        emphasis: {
                            shadowBlur: 15,
                            shadowColor: 'rgba(105,123, 214, 0.7)'
                        }
                    },
                    zlevel: 2,
                    barWidth: '10%',
                    data: data[1]
                },
                {
                    name: '三级',
                    type: 'bar',
                    itemStyle: {
                        normal: {
                            show: true,
                            barBorderRadius: 50,
                            borderWidth: 0,
                        },
                        emphasis: {
                            shadowBlur: 15,
                            shadowColor: 'rgba(105,123, 214, 0.7)'
                        }
                    },
                    zlevel: 2,
                    barWidth: '10%',
                    data: data[2]
                }
            ]
        }
        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
        window.addEventListener("resize", function () {
            myChart.resize();
        });
    }

    function progressPieChart() {
        var myChart = echarts.init(document.getElementById('chart_3'));
        var data = [{
            name: '今日在所',
            value: (Math.random()*100).toFixed(0)
        }, {
            name: '今日入所',
            value: (Math.random()*50).toFixed(0)
        }, {
            name: '今日出所',
            value: (Math.random()*50).toFixed(0)
        }]

        var titleArr = [],
            seriesArr = [];
        var colors =[
            ['rgb(51,151,237)','rgb(51,151,237,0.4)'],
            ['rgb(218,103,84)', 'rgba(218,103,84,0.4)'],
            ['rgb(113,193,159)', 'rgba(113,193,159,0.4)'],
        ] 
        data.forEach(function (item, index) {
            titleArr.push({
                text: item.name,
                left: index * 33.33 + 13+ '%',
                bottom: '10%',
                textAlign: 'center',
                textStyle: {
                    fontWeight: 'normal',
                    fontSize: '10',
                    color: colors[index][0],
                    textAlign: 'center',
                },
            });
            seriesArr.push({
                name: item.name,
                type: 'pie',
                clockWise: false,
                radius: [25, 30],
                itemStyle: {
                    normal: {
                        color: colors[index][0],
                        shadowColor: colors[index][0],
                        shadowBlur: 0,
                        label: {
                            show: false
                        },
                        labelLine: {
                            show: false
                        },
                    }
                },
                hoverAnimation: false,
                center: [index * 33.33 + 15 + '%', '40%'],
                data: [{
                    value: item.value,
                    label: {
                        normal: {
                            formatter: function (params) {
                                return params.value + '%';
                            },
                            position: 'center',
                            show: true,
                            textStyle: {
                                fontSize: '10',
                                fontWeight: 'bold',
                                color: colors[index][0]
                            }
                        }
                    },
                }, {
                    value: 100 - item.value,
                    name: 'invisible',
                    itemStyle: {
                        normal: {
                            color: colors[index][1]
                        },
                        emphasis: {
                            color: colors[index][1]
                        }
                    }
                }]
            })
        });


        var option = {
            title: titleArr,
            grid: {
                borderWidth: 0,
                top: 5,
                bottom: 5,
                left: 10,
                right: 10,
                textStyle: {
                    color: "#fff"
                },
                containLabel: true
            },
            series: seriesArr
        }
        myChart.setOption(option);
        window.addEventListener("resize", function () {
            myChart.resize();
        });
    }

    function triaBarChart() {
        var myChart = echarts.init(document.getElementById('chart_4'));
        var barData = randomArr(5,100,600)
        var option = {
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'none'
                },
                formatter: function (params) {
                    return params[0].name + ': ' + params[0].value;
                }
            },
            grid: {
                borderWidth: 0,
                top: 5,
                bottom: 5,
                left: 10,
                right: 10,
                textStyle: {
                    color: "#fff"
                },
                containLabel: true
            },
            xAxis: {
                data: ['10-20', '20-30', '40-50', '50-60', '60以上'],
                axisTick: {
                    show: false
                },
                axisLine: {
                    show: false
                },
                axisLabel: {
                    inside: false,
                    textStyle: {
                        fontSize: '10',
                        color: 'rgba(255,255,255,0.6)'
                    }
                }

            },
            yAxis: {
                axisTick: {
                    show: false
                },
                axisLine: {
                    show: false
                },
                splitLine: {
                    show: true,
                    interval: 'auto',
                    lineStyle: {
                        color: 'rgba(255,255,255,0.1)',
                    }
                },
                axisLabel: {
                    textStyle: {
                        color: '#bac0c0',
                        fontWeight: 'normal',
                        fontSize: '10',
                    },
                    formatter: '{value}',
                },
                splitNumber: 2
            },
            color: ['rgb(51,151,237)', 'rgb(218,103,84)', 'rgb(113,193,159)'],
            series: [{
                name: 'hill',
                type: 'pictorialBar',
                barCategoryGap: '-20%',
                symbol: 'path://M150 50 L130 130 L170 130Z',
                itemStyle: {
                    opacity: 0.5
                },
                emphasis: {
                    itemStyle: {
                        opacity: 1
                    }
                },
                data: barData,
                z: 10
            }, ]
        };
        myChart.setOption(option);
        window.addEventListener("resize", function () {
            myChart.resize();
        });
    }

    function rosePieChart() {
        var myChart = echarts.init(document.getElementById('chart_5'));
        var data = randomArr(3,40,200)
        var option = {
            tooltip: {
                trigger: 'item',
                formatter: "{b}: <br/> {c} ({d}%)"
            },
            grid: {
                borderWidth: 0,
                top: 10,
                bottom: 10,
                left: 10,
                right: 10,
                textStyle: {
                    color: "#fff"
                },
                containLabel: true
            },
            calculable: true,
            series: [{
                name: '排名',
                type: 'pie',
                color: ['rgb(51,151,237)', 'rgb(218,103,84)', 'rgb(113,193,159)'],
                radius: [10, 50],
                center: ['50%', '50%'],
                roseType: 'area',
                data: [{
                        value: data[0],
                        name: '总数'
                    },
                    {
                        value: data[1],
                        name: '已出所'
                    },
                    {
                        value: data[2],
                        name: '未回所'
                    }
                ]
            }]

        }
        myChart.setOption(option);
        window.addEventListener("resize", function () {
            myChart.resize();
        });
    }

    function gaugeChart(){
        var myChart = echarts.init(document.getElementById('chart_6'));
        var option = {
            color: ['rgb(51,151,237)', 'rgb(218,103,84)', 'rgb(113,193,159)'],
            series: [{
                name: '人员风险',
                type: 'gauge',
                min:0,
                max:4000,
                radius:'60%',
                title:{
                    offsetCenter:[0,'-130%'],
                    color:'white',
                    fontSize:12
                },
                center:['25%','50%'],
                detail: {
                    formatter: '{value}',
                    backgroundColor:'auto',
                    color:'white',
                    offsetCenter:[0,'120%'],
                    fontSize:15
                },
                pointer:{width:5},
                splitNumber:4,
                splitLine:{
                    show:true,
                    length:10,
                    lineStyle:{
                        color: 'rgba(255,255,255,0.5)',
                        shadowBlur:12
                        
                    }
                },
                axisTick:{show:false},
                axisLabel:{
                    fontSize:10,
                    distance:5,
                },
                axisLine: {
                    show: true,
                    lineStyle: {
                        width: 10,
                        shadowBlur: 0,
                        color: [
                            [0.25, 'rgb(51,151,237)'],
                            [0.75, 'rgb(218,103,84)'],
                            [1, 'rgb(113,193,159)']
                        ]
                    }
                },
                data: [{
                    value: 1500,
                    name: '人员风险',
                }]
            },
            {
                name: '设备风险',
                type: 'gauge',
                min:0,
                max:4000,
                radius:'60%',
                center:['75%','50%'],
                title:{
                    offsetCenter:[0,'-130%'],
                    color:'white',
                    fontSize:12
                },
                detail: {
                    formatter: '{value}',
                    backgroundColor:'auto',
                    color:'white',
                    offsetCenter:[0,'120%'],
                    fontSize:15
                },
                splitNumber:4,
                pointer:{width:5},
                splitLine:{
                    show:true,
                    length:10,
                    lineStyle:{
                        color: 'rgba(255,255,255,0.5)',
                        shadowBlur:12        
                    }
                },
                axisTick:{show:false},
                axisLabel:{
                    fontSize:10,
                    distance:5,
                },
                axisLine: {
                    show: true,
                    lineStyle: {
                        width: 10,
                        shadowBlur: 0,
                        color: [
                            [0.25, 'rgb(51,151,237)'],
                            [0.75, 'rgb(218,103,84)'],
                            [1, 'rgb(113,193,159)']
                        ]
                    }
                },
                data: [{
                    value: 2000,
                    name: '设备风险',
                }]
        
            }
            ]
        };
        myChart.setOption(option, true);
        setInterval(function() {
            option.series[0].data[0].value = (Math.random() * 4000).toFixed(0) - 0;
            option.series[1].data[0].value = (Math.random() * 4000).toFixed(0) - 0;
            myChart.setOption(option, true);
        }, 2000);
        window.addEventListener("resize", function () {
            myChart.resize();
        });
    }
})