//创建画布
let canvas = document.getElementById('canvas');
let width =canvas.clientWidth,height = canvas.clientHeight;
let svg = d3.select('#canvas').append('svg')
            .attr('width',width)
            .attr('height',height);
let main =svg.append('g').classed('main',true).attr('transform',`translate(${width/2},${height/2})`);
window.onload = function (){
    document.getElementsByClassName('list-group-item')[0].click();
}
//提示框
let tooltip = createTooltip();
//tooltip显示
function tipVisible(textContent){
    tooltip.transition()
                .duration(400)
                .style('opacity', 0.9)
                .style('display','block');
    tooltip.html(textContent)
                .style('left',(d3.event.pageX+15)+'px')
                .style('top',(d3.event.pageY+15)+'px');
}
//tooltip隐藏
function tipHidden(){
    tooltip.transition()		
    .duration(400)		
    .style('opacity', 0)
    .style('display','none');	  
}
//创建tooltip
function createTooltip(){
    return d3.select('body')
        .append('div')
        .classed('tooltip', true)
        .style('opacity', 0)
        .style('display', 'none');
}
let optionInfo = {
    industryUniversity:{
        url:'./data/industryUniversity.csv',
        name:'中国高校产学共创排行榜',
        format(d){
            return[
                d.高校名称,
                +d.校企合作论文数,
                +(+d.校企合作论文占比).toFixed(2),
                +d.校企合作论文总被引频次,
                +d.企业资助项目产出论文数,
                +d.校企合作专利数,
                +(+d.校企合作专利数占比).toFixed(2),
                +d.校企合作专利总被引频次,
                +d.海外同族合作专利数,
                +d.校企合作专利施引专利数,
                +d.与上市公司关联强度
            ];
        },
        drawBase(dataset){
            let option = {
                category:dataset.columns.slice(1),
                radius:((width>height)?height:width)/3,
                total:dataset.columns.length-1,
                level:10
            };
            let th = '<thead><tr><th>排名</th><th>高校名称</th></tr></thead><tbody></tbody>';
            createBoard(dataset,th);
            drawRadarBase(option);
            listenTableClick(dataset,option,'industryUniversity');
            
        }
    },
    paperMatrix:{
        url:'./data/paperMatrix.csv',
        name:'中国高校论文产出矩阵',
        format(d){
            return [d.name,d.subject,+d.x,+d.y];
        },
        drawBase(dataset){
            let tableTitle = '<thead><tr><th>高校名称</th></tr></thead><tbody></tbody>';
            createBoard(dataset,tableTitle);
            let maxMinData = getMaxMinData(dataset);
            for (let i in maxMinData){
                maxMinData[i] =maxMinData[i].map(x=>{
                    return x > 0 ?Math.ceil(x):Math.floor(x);
                });
            }
            // 绘制基础坐标图
            let orgin ={x:0.5,y:2.176};//坐标原点
            let title ={xTitle:'2012-2016年学科产出论文占全球份额（单位%）',yTitle:'学科论文被引频次增长率（2012-2016年相比于2007-2011年)'};
            let sideLength = (width>height)?height:width;
            let scale = matrixBase(maxMinData,orgin,title,sideLength);
            let xScale = scale.xScale;
            let yScale = scale.yScale;
            let option ={orgin,title,xScale,yScale,sideLength};
            listenTableClick(dataset,option,'paperMatrix'); 
        }
    },
    patentMatrix:{
        url:'./data/patentMatrix.csv',
        name:'中国高校专利产出矩阵',
        format(d){
            return [d.name,d.subject,+d.x,+d.y];
        },
        drawBase(dataset){
            let tableTitle = '<thead><tr><th>高校名称</th></tr></thead><tbody></tbody>';
            createBoard(dataset,tableTitle);
            let maxMinData = getMatrixExtentData(dataset);
            // 绘制基础坐标图
            let orgin ={x:1000,y:2};//坐标原点
            let title ={xTitle:'2012-2016年学科产出专利数量',yTitle:'被引频次增长率（2012-2016年相比于2007-2011年)'};
            let sideLength = (width>height)?height:width;
            let scale = matrixBase(maxMinData,orgin,title,sideLength);
            let xScale = scale.xScale;
            let yScale = scale.yScale;
            let option ={orgin,title,xScale,yScale,sideLength};
            listenTableClick(dataset,option,'paperMatrix');
        }

    },
    fushionIndex:{
        url:'./data/fushionIndex.csv',
        name:'中国学科高校融合指数',
        format(d){
            return [d.name,+d.index,+d.num0,+d.num1,+d.num2,+d.num3,+d.num4,+d.numTotal,+d.numPercent];
        },
        drawBase(dataset){
            let option = {
                radius:3*((width>height)?height:width)/8
            };
            let tableTitle = '<thead><tr><th>高校名称</th></tr></thead><tbody></tbody>';
            createBoard(dataset,tableTitle);
            drawBarChart(dataset);
            listenTableClick(dataset,option,'fushionIndex');
        }
    },
    worldMap:{
        url:'./data/worldMap.csv',
        name:'中国高校论文国际合作地图',
        format(d){
            return d;
        },
        drawBase(dataset){
            let tableTitle = '<thead><tr><th>高校名称</th></tr></thead><tbody></tbody>';
            let data=dataset.map(d=>[d.name]);
            createBoard(data,tableTitle);
            let option={
                startColor:d3.color(getColor(2)),
                endColor:d3.color(getColor(7)),
                columns:Object.keys(dataset[0])
            }
            drawWorldMapBase(option);
            let ddset = dataset.map(d=>Object.values(d));
            listenTableClick(ddset,option,'worldMap');
        }

    },
    medicalWork:{
        url:'./data/medicalWork.csv',
        name:'医疗机构医工结合排行榜',
        format(d){
            return [d.name,+d.ei,+d.link,+d.patent];
        },
        drawBase(dataset){
            let title ={xTitle:'EI论文数',yTitle:'德温特专利数',zTitle:'与上市公司的关联强度'};
            let radius = 3*((width>height)?height:width)/8;
            let option={title,radius};
            let th = '<thead><tr><th>序</th><th>医院名称</th></tr></thead><tbody></tbody>';
            createBoard(dataset,th);
            drawBubble(dataset,option);
            listenTableClick(dataset,option,'medicalWork');
        }
    }
};
function drawDoNChart(indexData,option,dataset){
    console.log(indexData);
    $('.main').empty();
    let extent = getMaxMinData(dataset);

    donutChart(indexData[0][1],extent.maxdata[0],0.9*option.radius,0.85*option.radius,getColor(0),option.title.xTitle);
    donutChart(indexData[0][2],extent.maxdata[1],0.8*option.radius,0.75*option.radius,getColor(1),option.title.zTitle);
    donutChart(indexData[0][3],extent.maxdata[2],0.7*option.radius,0.65*option.radius,getColor(2),option.title.yTitle);
    

}
function donutChart(data,max,innerRadius,outerRadius,color,type){
    let blank = max - data;
    let percent = d3.format(".1%")(data/max);
    //数据转换
    let pie  = d3.pie().startAngle(0).endAngle(Math.PI).sortValues(null)([data,blank]);
    console.log(pie);
    let arc  = d3.arc()
                .outerRadius(innerRadius)
                .innerRadius(outerRadius);
    //绘制
    main.append('g').classed('arcs',true)
        .selectAll('path')
        .data(pie)
        .enter()
        .append('path')
        .attr('d',arc)
        .style('fill','transparent')
        .style('stroke','gray')
        .each(function(){this._current = {startAngle: 0, endAngle: 0}; })
        .on('mouseover',function(){
            d3.select(this).transition().duration(300).style('fill-opacity',1);
            tipVisible( `<div>${type}:${data}</div><div>占排行榜内${type}最大值的${percent}</div>`);
        })
        .on('mouseout',function(){
            d3.select(this).transition().duration(300).style('fill-opacity',0.8);
            tipHidden();
        })
        .transition()
        .duration(400)
        .ease(d3.easeLinear)
        .style('fill',(d,i)=>i==0?color:'transparent')
        .style('fill-opacity',0.8)
        .attrTween('d',function(d) {
            var interpolate = d3.interpolate(this._current, d);
            return function(t) {
              return arc(interpolate(t));
            };
          });
    //文本
    main.append('g').classed('texts',true)
        .append('text')
        .text(type)
        .attr('transform',`translate(-10,${-outerRadius})`)
        .style('text-anchor','end');
    main.append('g').classed('texts',true)
        .append('text')
        .text(`数值:${data},占比:${percent}`)
        .attr('transform',`translate(-10,${innerRadius})`)
        .style('text-anchor','end');
}

function drawBubble(dataset,option){
    let extent =getMaxMinData(dataset);
    let xScale = d3.scaleLinear().domain([0,extent.maxdata[0]]).range([-3*width/8,3*width/8]);
    let yScale = d3.scaleLinear().domain([((extent.maxdata[2]/100)+1)*100,0]).range([-3*height/8,3*height/8]);
    let zScale = d3.scaleLinear().domain([1,extent.maxdata[1]]).range([6,12]);
    let xAxis = d3.axisBottom(xScale).tickSize(4);
    let yAxis = d3.axisLeft(yScale).tickSize(4);
    main.append('g').classed('xAxis',true).call(xAxis).attr('transform',`translate(0,${3*height/8})`);
    main.append('g').classed('yAxis',true).call(yAxis).attr('transform',`translate(${-3*width/8},0)`);
    
    main.append('g').classed('texts',true)
        .append('text')
        .text(option.title.xTitle)
        .attr('transform',`translate(0,${(3*height/8)+36})`)
        .style('text-anchor','middle');

    main.append('g').classed('texts',true)
        .append('text')
        .text(option.title.yTitle)
        .attr('transform',`translate(${(-3*width/8)-36},0) rotate(-90)`)
        .style('text-anchor','middle');

    main.append('g').classed('texts',true)
        .append('text')
        .text(`气泡半径r代表${option.title.zTitle}`)
        .attr('transform',`translate(0,${-(3*height/8)+32})`)
        .style('text-anchor','middle');

    let circles = main.append('g').classed('circles',true);
    circles.selectAll('circle')
        .data(dataset)
        .enter()
        .append('circle')
        .attr('transform',d=>`translate(${xScale(0)},${yScale(0)})`)
        .on('mouseover',function(d){
            d3.select(this)
            .transition()
            .duration(300)
            .style('fill-opacity',1)
            .attr('r',d=>zScale(d[2])+1);
            tipVisible(`<div>${d[0]}</div><div>x:${d[1]}, y:${d[3]}, r:${d[2]}</div>`);
        })
        .on("mouseout", function() {			
            d3.select(this)
            .transition()
            .duration(300)
            .attr('r',d=>zScale(d[2]))
            .style('fill-opacity',0.5);
            tipHidden();
        })
        .transition()
        .duration(400)
        .attr('r',d=>zScale(d[2]))
        .style('fill',getColor(7))
        .style('fill-opacity',0.5)
        .attr('transform',d=>`translate(${xScale(d[1])},${yScale(d[3])})`);

}
function drawBarChart(dataset){
    $('.main').empty();
    const index = dataset.map(d=>d[1]);
    let extent = d3.extent(index);
    let length = width/2;
    let scale = d3.scaleLinear()
                .domain(extent)
                .range([10,length])
    let barChart =main.append('g').classed('barChart',true);
    barChart.append('g').classed('rects',true)
        .selectAll('rect')
        .data(dataset)
        .enter()
        .append('rect')
        .attr('height',16)
        .attr('width',0)
        .style('fill','transparent')
        .attr('x',0)
        .attr('y',(d,i)=>(i*24)+8)
        .attr('transform',`translate(${-width/4},${-height/2})`)
        .transition()
        .duration(500)
        .ease(d3.easeBackOut)
        .attr('width',d=>scale(d[1]))
        .style('fill',getColor(0))
        
   let texts = barChart.append('g').classed('texts',true)
   texts.selectAll('text')
        .data(dataset)
        .enter()
        .append('text')
        .text(d=>d[0])
        .attr('x',0)
        .attr('y',(d,i)=>(i*24)+8)
        .attr('dy',12)
        .attr('dx',-6)
        .attr('transform',`translate(${-width/4},${-height/2})`)
        .style('text-anchor','end');
    let indexes = barChart.append('g').classed('texts',true)
    indexes.selectAll('text')
        .data(dataset)
        .enter()
        .append('text')
        .attr('x',0)
        .attr('y',(d,i)=>(i*24)+8)
        .attr('dy',12)
        .attr('dx',6)
        .style('text-anchor','start')
        .attr('transform',`translate(${-width/4},${-height/2})`)
        .transition()
        .duration(500)
        .ease(d3.easeBackOut)
        .text(d=>d[1])
        .attr('x',d=>scale(d[1]));
        
    let barHeight = index.length*24+8;
    svg.attr('height',barHeight);
}
// 监听机构评价功能模块点击事件
(function (){
    const functionModel = document.getElementById('function-list');
    functionModel.addEventListener('click',(e)=>{
        if(e.target.tagName.toLowerCase()=== 'li'){
            svg.attr('height',height);
            let boardType = e.target.getAttribute('data-type');
            $(e.target).addClass('model-active');
            $(e.target).siblings().removeClass('model-active');
            //清空画布以及table表格
            emptySvgTable(); 
            
            let dataUrl = optionInfo[boardType].url;
            let format = optionInfo[boardType].format;
            let drawBase = optionInfo[boardType].drawBase
            //请求数据，并画图
            d3.csv(dataUrl,d=>format(d)).then(dataset=>{
                drawBase(dataset);
            });
        }
    })
})();
// 清空svg画布
function emptySvgTable(){
    $('#leader-board>table').empty();
    $('.main').empty();
    $('defs').remove();
}
// 获取高校名称
function getUnivData(dataset){
    return Array.from(new Set(dataset.map(data => data[0])));
}
// 建立排行榜
function createBoard(dataset,tableTitle){
    let univName = getUnivData(dataset);
    $('#leader-board>table').append(tableTitle);
    univName.forEach((item,index) => {
        let tb='';
        if(tableTitle.split('<th>').length-1 ===2){
             tb=`<tr><td>${index+1}</td><td>${item}</td></tr>`;
        }
        else if(tableTitle.split('<th>').length-1 ===1){
             tb=`<tr><td>${item}</td></tr>`;
        }
        $('#leader-board>table>tbody').append(tb);
    });
}

// 表格增加监听事件函数
function listenTableClick(dataset,option,type){
    $('#leader-board > table').unbind('click');
   
    // 祖先元素代理
    $('#leader-board > table').click(e=>{
        
        if($(e.target).parent().get(0).tagName.toLowerCase() === 'tr' && e.target.tagName.toLowerCase() !=='th'){
            $(e.target).parent().addClass('tableClick');
            $(e.target).parent().siblings().removeClass('tableClick');
            $('.row >div:nth-of-type(2)').removeClass('d-block');
            $('.row >div:nth-of-type(3)').removeClass('d-block');
            $('.drawer-toggle').css('left','0');
            let td = $(e.target).parent().children();
            let univName = (td.length ===1)? td.html():(td.length===2)? td.eq(1).html():'';
            let indexData = dataset.filter(data=> data[0] === univName);
            draw(indexData,option,type,dataset);
        }
      
    });
    
}
function draw(indexData,option,type,dataset){
    switch(type){
        case 'industryUniversity':
            drawRadar(indexData,option,getMaxMinData(dataset))
            break;
        case 'paperMatrix':
            drawScatter(indexData,option,dataset)
            break;
        case 'fushionIndex':
            drawDonutChart(indexData,option)
            break;
        case 'worldMap':
            drawWorldMap(indexData,option)
            break;
        case 'medicalWork':
            drawDoNChart(indexData,option,dataset)
            break;
    }

}
function getMatrixExtentData(dataset){
    let maxMinData = getMaxMinData(dataset);
    for (let i in maxMinData){
        maxMinData[i] =maxMinData[i].map(x=>{
            return x > 0 ?Math.ceil(x):Math.floor(x);
        });
    }
    return maxMinData;
}
//获取颜色
function getColor(idx) {
    var palette = [
        '#1890FF', '#2FC25B', '#FACC14', '#223273','#8543E0', '#13C2C2', '#3436C7', '#F04864'
    ]
    return palette[idx % palette.length];
}
//绘制世界地图基础图
function drawWorldMapBase(option){
    //读取worldMap.json文件绘制世界地图
    d3.json('./data/world-countries.json').then(function(worldGeo){

        addMapLegend(option.startColor,option.endColor);
        //过滤南极洲
        let worldGeoFeatures = worldGeo.features.filter(d=>d.properties.name!=='Antarctica')
        //地图投影
        // let projection = d3.geoEquirectangular().scale(1).translate([0,0]).fitSize([width,height],worldGeo);
        let projection = cylindrical(0.8*width,0.8*height);
        //地理路径生成器
        let path = d3.geoPath(projection);
        main.append('g').classed('worldMap',true)
        .selectAll('path')
        .data(worldGeoFeatures)
        .enter()
        .append('path')
        .attr('d',path)
        .attr('transform',`translate(${-0.8*width/2},${-0.7*height/2})`);    

        function cylindrical(width, height) {
            return d3.geoProjection(function(λ, φ) { return [λ, φ * 2 / width * height]; })
                .scale(width / 2 / Math.PI)
                .translate([width / 2, height / 2]);
        }
    });
    
}
//根据数据为世界地图绘制颜色
function drawWorldMap(indexData,option){
    indexData = indexData[0].slice(1).map(d=>+d);
    let column =option.columns.slice(1);
    let extent=d3.extent(indexData);//获取极值
    let color  = d3.scaleLinear().domain([1,extent[1]]).range([option.startColor,option.endColor]);
    main.select('.worldMap')
        .selectAll('path')
        .on('mouseover',function(d){
            d3.select(this)
                .transition()
                .duration(300)
                .style('fill',getColor(1));
                tipVisible(`<div>${d.properties.name}</div><div>合作次数:${indexData[column.indexOf(d.properties.name)]}</div>`);
        })
        .on('mouseout',function(d){
            d3.select(this)
                .transition()
                .duration(300)
                .style('fill',indexData[column.indexOf(d.properties.name)]>0?color(indexData[column.indexOf(d.properties.name)]):d3.rgb(255,255,255));
            tipHidden();

        })
        .transition()
        .duration(500)
        .ease(d3.easeLinear)
        .style('fill',d=>{  
            let index = column.indexOf(d.properties.name);
            return indexData[index]>0?color(indexData[index]):d3.rgb(255,255,255);
        })
}
//世界地图图例
function addMapLegend(startColor,endColor){
    // 定义一个线性渐变
    let defs = svg.append('defs');
    let linearGradient = defs.append('linearGradient')
                        .attr('id','linearColor')
                        .attr('x1','0%')
                        .attr('y1','0%')
                        .attr('x2','0%')
                        .attr('y2','100%')
    linearGradient.append('stop')
                    .attr('offset','0%')
                    .style('stop-color',endColor.toString())
                    .style('stop-opacity','1');
    linearGradient.append('stop')
                    .attr('offset','100%')
                    .style('stop-color',startColor.toString())
                    .style('stop-opacity','1');
    // 添加矩形应用线性渐变
    let legend = main.append('g').classed('legend',true)
                .attr('transform',`translate(${0.9*width/2},-${0.2*height})`);
    legend.append('g').classed('rect',true)
        .append('rect')
        .attr('width',14)
        .attr('height',height/3)
        .style('fill',`url(#${linearGradient.attr('id')})`);
    legend.append('g').classed('text',true)
        .append('text')
        .text('高')
        .attr('dx',0)
        .attr('dy',-8)
        .style('text-anchor','start');
    legend.select('.text').append('text').text('低')
            .attr('dy',(height/3)+16)
            .style('text-anchor','start');
}
//绘制散点图
function drawScatter(indexData,option,dataset){
    $('.points').remove(); 
    //坐标轴复位 
    // main.select('.base').attr('transform',d3.zoomIdentity);
    $('.main').remove();
    main = svg.append('g').classed('main',true)
    matrixBase(getMatrixExtentData(dataset),option.orgin,option.title,option.sideLength);
    let points= main.append('g').classed('points',true);
    let t =  d3.transition().duration(300).ease(d3.easeLinear);
    points.selectAll('circle')
        .data(indexData)
        .enter()
        .append('circle')
        .style('fill',d=>{
            if(d[2]>=option.orgin.x && d[3]>=option.orgin.y){
                return getColor(0);
            }
            else if(d[2]<option.orgin.x && d[3]>=option.orgin.y){
                return getColor(1);
            }
            else if(d[2]<option.orgin.x && d[3]<option.orgin.y){
                return getColor(2);
            }
            else if(d[2]>=option.orgin.x && d[3]<option.orgin.y){
                return getColor(3);
            }
        })
        .attr('r',0)
        .attr('transform',d=>`translate(${option.xScale(option.orgin.x)},${option.yScale(option.orgin.y)})`)
        .on('mouseover',function(d){
            d3.select(this)
            .transition()
            .duration(300)
            .style('fill-opacity',1)
            .attr('r',6);
            tipVisible(`<div>${d[1]}</div><div>x:${d[2]}, y:${d[3]}</div>`);
        })
        .on("mouseout", function() {		
            d3.select(this)
            .transition()
            .duration(300)
            .attr('r',5)
            .style('fill-opacity',0.5);
            tipHidden();
        })
        .transition(t)
        .attr('r',5)
        .attr('transform',d=>`translate(${option.xScale(d[2])},${option.yScale(d[3])})`);
        
         
        let zoom = d3.zoom().scaleExtent([1/2,6]).on('zoom',zoomed);    
        
        function zoomed(){
            let transform = d3.event.transform;
            
            d3.select('.base').attr('transform',transform);
            d3.selectAll('circle').attr('transform',d => `translate(${transform.apply([option.xScale(d[2]),option.yScale(d[3])])})`); 
        } 
        main.call(zoom); 
        main.attr('transform',d3.zoomIdentity.translate(width/2,height/2));
}

//绘制环图
function drawDonutChart(indexdata,option){
    svg.attr('height',height);
    $('.main').empty();
    let data = indexdata[0];
    let innerRadius = option.radius*0.7;
    let outerRadius = option.radius*0.9;
    //数据转换
    let pie = d3.pie()(data.slice(2,7));
    let arc = d3.arc().innerRadius(innerRadius).outerRadius(outerRadius);
    //绘制
    let arcs= main.append('g').classed('arcs',true)
    .selectAll('path')
    .data(pie)
    .enter()
    .append('path')
    .style('fill',(d,i)=>getColor(i))
    .each(function(){this._current = {startAngle: 0, endAngle: 0}; });
    //设置外扩的效果
    arcs.on('mouseover',function(d,i){
        d3.select(this)
        .transition()
        .duration(500)
        .ease(d3.easeLinear)
        //centroid返回的是弧形的重心与弧心的相对位置
        .attr('transform',d=> `translate(${arc.centroid(d)[0] / 9},${arc.centroid(d)[1] / 9})`);
        tipVisible(`<div>跨学科距离${i}</div><div>论文数: ${data.slice(2,7)[i]}</div>`);
    })
    .on('mouseout',function(d,i){
        d3.select(this)
        .transition()
        .duration(500)
        .attr('transform',d=>`translate(0,0)`);
        tipHidden();
    });
    arcs.transition()
    .duration(500)
    .ease(d3.easeLinear)
    .attrTween('d',function(d) {
        var interpolate = d3.interpolate(this._current, d);
        return function(t) {
          return arc(interpolate(t));
        };
      });
    //图例
    let text = function(i){return `学科距离${i}`; };
    legend(pie,innerRadius,option.radius,text);
    drawText(data);
 
}
//绘制图例
function legend(pieData,innerRadius,radius,text){
    let legendArea = main.append('g').classed('legends',true)
                        .attr('height',innerRadius)
                        .attr('transform',`translate(${radius},-${innerRadius/2})`);
    let legend = legendArea.selectAll('g')
                .data(pieData)
                .enter()
                .append('g')
                .attr("transform", (d, i)=>`translate(0,${i*innerRadius/pieData.length})`);
    //添加图例小圆点
    legend.append('circle')
        .attr('r',4)
        .style('fill',(d,i)=>getColor(i));
    //添加文本
    legend.append('text')
    .attr('x',24)
    .attr('y',6)
    .style('fill',(d,i)=>getColor(i))
    .text((d,i)=>text(i))
    .attr('dx','-18')
    .style('font-size','0.8rem')
    .style('text-anchor','start');
}
//绘制环内文本
function drawText(data){
    let textArea = main.append('g').classed('texts',true);
    textArea.append('text')
                .data(data)
                .text(`学科融合指数${data[1]}`)
                .style('font-size','1.6em');
    textArea.append('text').data(data).text(`跨学科论文${data[7]}篇,占比${data[8]}%`)
            .attr('transform','translate(0,40)');

}

//绘制底层矩阵坐标图;
function matrixBase(maxMinData,orgin,title,sideLength){
    let maxX = maxMinData.maxdata[0];
    let minX = maxMinData.mindata[0];
    let maxY = maxMinData.maxdata[1];
    let minY = maxMinData.mindata[1];
    // 坐标轴线性比例尺
    let xScale = d3.scaleLinear().domain([minX,maxX]).range([-3*sideLength/8,3*sideLength/8]);
    let yScale = d3.scaleLinear().domain([maxY,minY]).range([-3*sideLength/8,3*sideLength/8]);
    
    let x = d3.axisBottom(xScale).tickSize(4);
    let y = d3.axisLeft(yScale).tickSize(4);
    let base =  main.append('g').classed('base',true);
    base.append('g').classed('axis',true).call(x).attr('transform',`translate(0,${yScale(orgin.y)})`)
    base.append('g').classed('axis',true).call(y).attr('transform',`translate(${xScale(orgin.x)},0)`);
    base.append('g').classed('rect',true)
        .append('rect')
        .attr('width',3*sideLength/4)
        .attr('height',3*sideLength/4)
        .style("fill", "none")
        .style("pointer-events", "all")
        .style('stroke','black')
        .attr('transform',`translate(${-3*sideLength/8},${-3*sideLength/8})`)
    //添加坐标轴标题
    base.append('g').classed('texts',true)
        .append('text')
        .text(title.xTitle)
       .attr('transform',`translate(0,${(3*sideLength/8)+15})`)
        .style('text-anchor','middle');
    base.append('g').classed('texts',true)
        .append('text')
        .text(title.yTitle)
        .attr('transform',`translate(-${(3*sideLength/8)+15},0) rotate(-90)`)
        .style('text-anchor','middle');
    
    return {
        xScale:xScale,
        yScale:yScale
    }
}

//筛选dataset中数值型数据
function filterNumber(dataset){
    return dataset.map(d=> d.filter(data=> typeof data === 'number'));
}
//计算导入指标数据各个维度的最大值与最小值
function getMaxMinData(dataset) {
    let numberData = filterNumber(dataset);
    let len = numberData[0].length;
    let maxdata = new Array(len);
    let mindata = new Array(len);
    for (let item of numberData) {  
        for (let i = 0; i < len; i++) {
            maxdata[i] = maxdata[i] > item[i] ? maxdata[i] : item[i];
            mindata[i] = mindata[i] < item[i] ? mindata[i] : item[i];
        }
    }
    return {
        maxdata:maxdata,
        mindata:mindata
    };
}

//根据类别数据创建雷达网络上的不规则多边形区域
function createRadarAreas(canvas){
    let areas = canvas.append('g')
        .classed('radar',true);
    return areas;
}
//绘制雷达网络上的多边形
function drawPolygon(canvas,data){
    let polygon=canvas.append('g')
        .classed('polygon',true)
        .append('polygon')
        .datum(data)
        .attr('points',d=>d.split(' ').map(x=>'0,0').join(' '))
        .style('stroke','transparent');
    polygon.transition()
        .duration(400)
        .ease(d3.easeCircleInOut)
        .attr('points',d=>d)
        .style('stroke',d=>getColor(7));
}
//绘制雷达网络上的数据点
function drawCircle(canvas,data,indexData){
    let circles = canvas.append('g')
                    .classed('circles',true);
    circles.selectAll('circle')
    .data(data)
    .enter()
    .append('circle')
    .on('mouseover',function(d,i){
        d3.select(this).transition().duration(300).attr('r',6);
        tipVisible(`<div>${d.category}</div><div>value : ${indexData[i+1]}</div>`);
    })
    .on("mouseout", function() {		
        d3.select(this).transition() .duration(200).attr('r',4)
        tipHidden();
    })
    .transition()
    .duration(400)
    .ease(d3.easeCircleInOut)
    .attr('cx',d=>d.x)
    .attr('cy',d=>d.y)
    .attr('r',4)
    .style('fill',d=>getColor(7));
}

// 在底层雷达网络上绘制多边形
function drawRadar(indexData,option,maxMinData){
    
    $('.radar').remove();
    indexData =indexData[0];
    let areaData =getCoordinate(indexData,option,maxMinData);
    //创建areas分组
    let areas = createRadarAreas(main)
    //绘制多边形
    drawPolygon(areas,areaData.polygon);
    // 绘制所有的点
    drawCircle(areas,areaData.points,indexData);
    
}
// 计算雷达图表的坐标.indexData某高校total个指标的数组;radius雷达网络的实际最大半径;total雷达网络的维度数量;maxMinData指标数据最大最小值对象
function getCoordinate(indexData,option,maxMinData){
    let area='',points=[];
    let onePiece = 2 * Math.PI/option.total;
    for(let i=0;i<option.total;i++){
        let r= option.radius * (indexData[i+1]-maxMinData.mindata[i])/(maxMinData.maxdata[i]-maxMinData.mindata[i]);
        let x= r * Math.sin(i* onePiece);
        let y= r * Math.cos(i* onePiece);
        area += `${x},${y} `;
        points.push({
            x:x,
            y:y,
            category:option.category[i]
        });
    }
    return {
        polygon:area,
        points:points
    }
}
//绘制雷达网络正多边形
function drawWebs(canvas,data){
    canvas.append('g').classed('webs',true)
    .selectAll('polygon')
    .data(data)
    .enter()
    .append('polygon')
    .attr('points',function(d){return d;});
}
//绘制雷达网络的坐标轴
function drawAxises(canvas,data){
   return  canvas.append('g')
        .classed('lines',true)
        .selectAll('line')
        .data(data)
        .enter()
        .append('line')
        .attr('x1',0)
        .attr('y1',0)
        .attr('x2',function(d){return d.x;})
        .attr('y2',function(d){return d.y;});
}
//绘制雷达网络类别标签
function drawCategoryLabel(main,data,category){
    main.append('g')
        .classed('texts', true)
        .selectAll('text')
        .data(data)
        .enter()
        .append('text')
        .attr('x', function (d) {
            return d.x * 1.08;
        })
        .attr('y', function (d) {
            return d.y * 1.08;
        })
        .text(function (d, i) {
            return category[i];
        })
        .attr('transform', function (d, i) {
            let onePiece = 2 * Math.PI / data.length;
            let angle = i * onePiece * (180 / Math.PI);
            let rotate = `rotate(${180-angle},${d.x*1.08} ${d.y*1.08})`;
            return rotate;
        });
}
// 绘制底层基础雷达网络
function drawRadarBase(option){
    let polygons = getRadarCoordinate(option);
    // 绘制基础网络
    drawWebs(main,polygons.webs);
    // 添加纵轴
    drawAxises(main,polygons.websPoint[0]);
    // 绘制文字标签
    drawCategoryLabel(main,polygons.websPoint[0],option.category);
}
// 计算整体雷达网区域各顶点坐标，返回polygons对象
function getRadarCoordinate(radarParameter){
    const arc = 2 * Math.PI;//1圈360度
    let onePiece = arc/radarParameter.total;//total个指标，两两间的夹角
    let polygons = {
        webs:[],
        websPoint:[]
    }; //存放各级雷达网格的各顶点坐标
    for(let i=radarParameter.level; i>0;i--){
        let webs='';
        let websPoint =[];
        let r = radarParameter.radius/radarParameter.level * i;
        //计算i级雷达网络顶点的坐标
        for(let j=0;j<radarParameter.total;j++ ){
            let x = r * Math.sin(j * onePiece);
            let y = r * Math.cos(j * onePiece);
            webs += `${x},${y} `;
            websPoint.push({x:x*1.05,y:y*1.05});
        }
        polygons.webs.push(webs);
        polygons.websPoint.push(websPoint);
    }
    return polygons;
}