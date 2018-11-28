//input搜索框placeholder动态显示
// (function(){
//     let input = document.getElementById('search-input');
//         // let search = document.getElementById('btn-search');
//         let tip=['北京大学','中国人民解放军总医院','中国高校论文产出矩阵'];
//         let clock;
//         loopName(0);
//         function loopName(j){
//             (j<=2)?j:j=0;
//             let i=0;
//             clock= setInterval(()=>{
//                 setPlaceholder(i,j);   
//                 let lenName = tip[j].length;
//                 i++;
//                 if(i>lenName){
//                     clearInterval(clock); 
//                     j++;
//                     setTimeout(()=>loopName(j),1000);
//                 }
//             },200);
//         }
//         function setPlaceholder(i,j){
//             let name=tip[j];
//             let s = name.slice(0,i);
//             input.setAttribute('placeholder',s);
//         }
//         input.addEventListener('focus',()=>{
//             input.setAttribute('placeholder','');
//             clearInterval(clock);
//         });
//         input.addEventListener('blur',()=>{
//             clearInterval(clock);
//             loopName(0);
//         });
// })();
//监听移动端toggler点击事件
!function () {
    let togglerButton = document.querySelector('.navbar-toggler');
    let navMenu = document.querySelector('.nav-link');
    
    togglerButton.addEventListener('click', () => {
        let navCollapse = document.querySelector('.collapse');
        navCollapse.classList.toggle('show');
    });
    navMenu.addEventListener('touchstart', () => {
        let navItemMenu = document.querySelector('.nav-item-menu');
        navItemMenu.classList.toggle('show');
    });

    let drawerToggle = document.querySelector('.drawer-toggle');
    
    drawerToggle.addEventListener('click', () => {
        let icon = document.querySelector('.drawer-toggle>.icon').classList;
        let institutionList = document.querySelector('.institution-list').classList;
        let mainDOM = document.querySelector('main').classList;
        institutionList.toggle('show');
        icon.toggle('icon-recovery');
        mainDOM.toggle('drawer-open');
    });
}();

    const canvas = document.getElementById('canvas');//画布
    const modelName = document.querySelector('body').className;//body标签类名,指向功能模块名称
    const univList = document.getElementById('univ-list');//边栏机构列表table

    let width = canvas.clientWidth, height = canvas.clientHeight;

    let svg = d3.select('#canvas').append('svg')
        .attr('width', width)
        .attr('height', height)
        .attr("preserveAspectRatio", "xMidYMid meet")
        .attr("viewBox", `0 0 ${width} ${height}`);
    let main = svg.append('g').classed('main', true).attr('transform', `translate(${width / 2},${height / 2})`);

    const modelType = ['industryUniversity', 'paperMatrix', 'fushionIndex', 'worldMap', 'patentMatrix', 'medicalWork'];

    //图表配置项
    const chartOptions = {
        industryUniversity: {
            radius: ((width > height) ? height : width) / 3,
            level: 10
        },
        paperMatrix: {
            orgin: { x: 0.5, y: 2.176 },//坐标原点
            axisTitle: { xTitle: '学科产出论文占全球份额（%）', yTitle: '学科论文被引频次增长率（%）' },
            matrixWidth: 3 / 8 * width,
            matrixHeight: 3 / 8 * height,
            format: ''
        },
        patentMatrix: {
            orgin: { x: 1000, y: 2 },//坐标原点
            axisTitle: { xTitle: '学科产出专利数量（件）', yTitle: '被引频次增长率（%）' },
            matrixWidth: 3 / 8 * width,
            matrixHeight: 3 / 8 * height,
            format: '~s'
        },
        fushionIndex: {
            radius: ((width > height) ? height : width) * 0.45
        },
        worldMap: {
            startColor: d3.color(getColor(2)),
            endColor: d3.color(getColor(7)),
            mapWidth: 0.9 * width,
            mapHeight: height
        },
        medicalWork: {
            radius: ((width > height) ? height : width) / 2
        }
    }
    //更新页面layout-title部分
    const setLayoutTitles = (dataset, targetUnivIndexData, targetData, chartOptions) => {

        let targetSubjectLength = targetUnivIndexData.length;
        const layoutName = document.querySelector('.layout-name>h2');
        const layoutIndex = document.querySelectorAll('.layout-index>p');
        const indexList = document.getElementById('index-list');
        const industryUniversity = () => {
            let allUnivName = uniqueForCol(dataset, 0);
            layoutName.innerHTML = targetData.univ;
            layoutIndex[0].innerHTML = targetData.rank;
            layoutIndex[1].innerHTML = allUnivName.length;
            let indexData = targetUnivIndexData[0];
            let indexContent = indexData.slice(1).map((item, index) => {
                return `<tr><td>${dataset.columns[index + 1]}</td><td>${item}</td></tr>`;
            }
            );
            d3.select('.index-list>table>tbody').remove();
            indexList.innerHTML += indexContent.join('');
        };
        const paperMatrix = () => {
            let allSubject = uniqueForCol(dataset, 1);
            let targetSubject = uniqueForCol(targetUnivIndexData, 1);
            let allSubjectLength = allSubject.length;
            let subject4Num = [0, 0, 0, 0];
            let subjectName = ['无', '无', '无', '无'];
            let subjectSpace = allSubject.filter(d => !targetSubject.includes(d));
            targetUnivIndexData.forEach(element => {
                let x = chartOptions.orgin.x;
                let y = chartOptions.orgin.y;
                if (element[2] >= x && element[3] >= y) {
                    subject4Num[0]++;
                    (subjectName[0] === '无') ? subjectName[0] = element[1] : subjectName[0] += ',' + element[1];
                }
                else if (element[2] < x && element[3] >= y) {
                    subject4Num[1]++;
                    (subjectName[1] === '无') ? subjectName[1] = element[1] : subjectName[1] += ',' + element[1];
                }
                else if (element[2] < x && element[3] < y) {
                    subject4Num[2]++;
                    (subjectName[2] === '无') ? subjectName[2] = element[1] : subjectName[2] += ',' + element[1];
                }
                else {
                    subject4Num[3]++;
                    (subjectName[3] === '无') ? subjectName[3] = element[1] : subjectName[3] += ',' + element[1];
                }
            });
            let space = subjectSpace.join(',');
            subjectName.push((space === '') ? '无' : space);
            layoutName.innerHTML = targetData.univ;
            layoutIndex[0].innerHTML = targetSubjectLength;
            layoutIndex[1].innerHTML = subject4Num[0];
            layoutIndex[2].innerHTML = subject4Num[1];
            layoutIndex[3].innerHTML = subject4Num[2];
            layoutIndex[4].innerHTML = subject4Num[3];
            layoutIndex[5].innerHTML = allSubjectLength - targetSubjectLength;
            let indexListTd = document.querySelectorAll('#index-list>tbody>tr>td:last-of-type');
            for (let i = 0; i < indexListTd.length; i++) {
                indexListTd[i].innerHTML = subjectName[i];
            }
        };
        const patentMatrix = paperMatrix;
        const medicalWork = industryUniversity;
        const worldMap = () => {
            layoutName.innerHTML = targetData.univ;
            let indexData = targetUnivIndexData[0];
            let cooper = indexData.slice(1).reduce((res, cur, index) => {
                if (cur !== 0) res[dataset.columns[index + 1]] = cur;
                return res;
            }, {});

            let country = Object.keys(cooper);
            let cooperNum = Object.values(cooper);
            layoutIndex[0].innerHTML = country.length;
            layoutIndex[1].innerHTML = d3.sum(cooperNum);

            let indexContent = country.map(item => {
                return `<tr><td>${item}</td><td>${cooper[item]}</td></tr>`
            })
            d3.select('.index-list>table>tbody').remove();
            indexList.innerHTML += indexContent.join('');
        };
        const fushionIndex = () => {
            layoutName.innerHTML = targetData.univ;
            let indexData = targetUnivIndexData[0];
            layoutIndex[0].innerHTML = indexData[1];
            layoutIndex[1].innerHTML = indexData[7];
            layoutIndex[2].innerHTML = indexData[8];

            d3.csv('../data/fushionGroup.csv', d => Object.values(d)).then(dataset => {
                let indexData = dataset.filter(d => d[0] === targetData.univ);
                let indexContent = indexData.map(d => `<tr>${d.slice(1).map(item => `<td>${item}</td>`).join('')}</tr>`);
                d3.select('.index-list>table>tbody').remove();
                indexList.innerHTML += indexContent.join('');
            })
        }
        return {
            industryUniversity, paperMatrix, patentMatrix, medicalWork, worldMap, fushionIndex
        }
    };

    const modelOptions = () => {
        return new Map([
            ['industryUniversity', { columnNum: 2, drawBase: drawRadarBase, draw: drawRadar }],
            ['paperMatrix', { columnNum: 1, drawBase: drawMatrixBase, draw: drawScatter }],
            ['patentMatrix', { columnNum: 1, drawBase: drawMatrixBase, draw: drawScatter }],
            ['medicalWork', { columnNum: 2, drawBase: () => { }, draw: draw3DonutChart }],
            ['fushionIndex', { columnNum: 1, drawBase: () => { }, draw: drawDonutChart }],
            ['worldMap', { columnNum: 1, drawBase: drawWorldMapBase, draw: drawWorldMap }]
        ]);
    }

    let url = `../data/${modelName}.csv`;

    d3.csv(url, d => Object.values(d)).then(dataset => {
        let modelOption = modelOptions().get(modelName);
        let chartOption = chartOptions[modelName];
        let columns = dataset.columns;
        dataset = dataset.map(data => data.map(d => isNaN(+d) ? d : +d));
        dataset['columns'] = columns;
        setTable(dataset, modelOption.columnNum, chartOption, modelOption.draw, setLayoutTitles);
        modelOption.drawBase(dataset, chartOption);
        let loading = document.querySelector('#loading').classList;
        loading.add('hidden');
        document.querySelector('#univ-list>tbody>tr>td').click();
        listenSearch(dataset,modelOption);
    });
//监听搜索框
function listenSearch(dataset,modelOption){
    let inputSearch = document.querySelector('.btn-search-list>input');
    let autocomplete = document.querySelector('.autocomplete-suggestions');
    let cpClock = true;
    inputSearch.addEventListener('compositionstart', () => cpClock = false)
    inputSearch.addEventListener('compositionend', function() {
        cpClock = true;
        listenInput(this,dataset,autocomplete,cpClock);
    })
    inputSearch.addEventListener('keyup', function () {
        listenInput(this,dataset,autocomplete,cpClock);
    });
    inputSearch.addEventListener('input', function () {
        listenInput(this,dataset,autocomplete,cpClock);
    });
    function listenInput(that,dataset,autocomplete,cpClock){
        if (that.value !== '' && cpClock) {
            let univName = uniqueForCol(dataset, 0);
            let listText = univName.reduce((res, cur) => {
                return res + (cur.includes(that.value) ? `<li>${cur}</li>` : '');
            }, '');
            autocomplete.innerHTML = (listText === '') ? 'No result...' : listText;
            autocomplete.setAttribute('style', 'display:block');
        }
        else {
            autocomplete.setAttribute('style', 'display:none');

        }
    }
    autocomplete.addEventListener('click', e => {
        let univSelect = e.target.innerHTML;
        inputSearch.value = univSelect;
        autocomplete.setAttribute('style', 'display:none');
        let univList = (modelOption.columnNum == 1) ? document.querySelectorAll('#univ-list>tbody>tr>td') : document.querySelectorAll('#univ-list>tbody>tr>td:last-of-type');
        for (let i = 0; i < univList.length; i++) {
            if (univList[i].innerHTML === univSelect) univList[i].click();
        }
    })
}

//移动端侧边栏收缩
function sideBarRecovery(){
    let institutionList = document.querySelector('.institution-list').classList;
    let mainDOM = document.querySelector('main').classList;
    let icon = document.querySelector('.icon.icon-spread').classList;
    institutionList.remove('show');
    icon.remove('icon-recovery');
    mainDOM.remove('drawer-open');
}

//更新table
function setTable(dataset,columnNum,drawOption,draw,setLayoutTitles){
    let univName = uniqueForCol(dataset,0);
    let tableContent =univName.map((item,index) =>
        (columnNum ===2)?`<tr><td>${index+1}</td><td>${item}</td></tr>`:`<tr><td>${item}</td></tr>`);
    univList.innerHTML += tableContent.join('');
    univList.addEventListener('click',e=>{
        if(e.target.tagName.toLowerCase()==='th') return;
        let targetData=(columnNum ===2)?{'univ':e.target.parentNode.lastChild.innerHTML,'rank':e.target.parentNode.firstChild.innerHTML}:{'univ':e.target.parentNode.firstChild.innerHTML};
        let targetUnivIndexData =dataset.filter(d=>d[0]===targetData.univ);
        toggleClass(e.target.parentNode);
        sideBarRecovery();
        draw(dataset,targetUnivIndexData,drawOption);
        setLayoutTitles(dataset,targetUnivIndexData,targetData,drawOption)[modelName]();
    });
    
}

// 获取高校名称
function uniqueForCol(dataset,col_th){
    return Array.from(new Set(dataset.map(data => data[col_th])));
}
//table>tr类切换
function toggleClass(element){
    let slidings = element.parentNode.children;
    let len = slidings.length;
        let i = 0;
        while(i<len){
            slidings[i].classList.remove('trClick');
            i++;
        }
        element.classList.add('trClick');
}

// 绘制底层基础雷达网络
function drawRadarBase(dataset,option){
    let category = dataset.columns.slice(1);
    let total = category.length;
    let polygons = getRadarCoordinate(total,option);
    // 绘制基础网络
    drawWebs(main,polygons.webs);
    // 添加纵轴
    drawAxises(main,polygons.websPoint[0]);
    // 绘制文字标签
    drawCategoryLabel(main,polygons.websPoint[0],category);
}
// 计算整体雷达网区域各顶点坐标，返回polygons对象
function getRadarCoordinate(total,option){
    const arc = 2 * Math.PI;//1圈360度
    let onePiece = arc/total;//total个指标，两两间的夹角
    let polygons = {
        webs:[],
        websPoint:[]
    }; //存放各级雷达网格的各顶点坐标
    for(let i=option.level; i>0;i--){
        let webs='';
        let websPoint =[];
        let r = option.radius/option.level * i;
        //计算i级雷达网络顶点的坐标
        for(let j=0;j<total;j++ ){
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

 // 在底层雷达网络上绘制多边形
function drawRadar(dataset,indexData,option){
    d3.select('.radar').remove();
    let category = dataset.columns.slice(1);
    let total = category.length;//指标总数

    let index =dataset.map(data=>data.slice(1));//所有的指标数据
    let maxMinData =getMaxMinData(index);

    //目标机构的指标数据
    indexData =indexData[0].slice(1);
    
    let areaData =getCoordinate(indexData,option,total,category,maxMinData);
    //创建areas分组
    let areas = createRadarAreas(main);
    //绘制多边形
    drawPolygon(areas,areaData.polygon);
    // 绘制所有的点
    drawCircle(areas,areaData.points,indexData);
    
}
// 计算雷达图表的坐标.indexData某高校total个指标的数组;radius雷达网络的实际最大半径;total雷达网络的维度数量;maxMinData指标数据最大最小值对象
function getCoordinate(indexData,option,total,category,maxMinData){
    let area='',points=[];
    let onePiece = 2 * Math.PI/total;
    for(let i=0;i<total;i++){
        let r= option.radius * (indexData[i]-maxMinData.mindata[i])/(maxMinData.maxdata[i]-maxMinData.mindata[i]);
        let x= r * Math.sin(i* onePiece);
        let y= r * Math.cos(i* onePiece);
        area += `${x},${y} `;
        points.push({
            x:x,
            y:y,
            category:category[i]
        });
    }
    return {
        polygon:area,
        points:points
    }
}
//计算导入指标数据各个维度的最大值与最小值
function getMaxMinData(numberData) {
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
//筛选dataset中数值型数据
function filterNumber(dataset){
    return dataset.map(d=> d.filter(data=> typeof data === 'number'));
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
        .style('stroke',getColor(7));
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
        tipVisible(`<div>${d.category}</div><div>value : ${indexData[i]}</div>`);
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
    .style('fill',getColor(7));
}
//获取颜色
function getColor(idx) {
    var palette = [
        '#1890FF', '#2FC25B', '#FACC14', '#223273','#8543E0', '#13C2C2', '#3436C7', '#F04864'
    ]
    return palette[idx % palette.length];
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

/*高校论文产出矩阵**/
//绘制底层矩阵坐标图;
function drawMatrixBase(dataset,option){
    let maxMinData = getMatrixExtentData(dataset);
    let maxX = maxMinData.maxdata[0];
    let minX = maxMinData.mindata[0];
    let maxY = maxMinData.maxdata[1];
    let minY = maxMinData.mindata[1];
    let width = option.matrixWidth;
    let height = option.matrixHeight;
    let orgin = option.orgin;
    let title = option.axisTitle;
    // 坐标轴线性比例尺
    let xScale = d3.scaleLinear().domain([minX,maxX]).range([-width,width]);
    let yScale = d3.scaleLinear().domain([maxY,minY]).range([-height,height]);
    
    let x = d3.axisBottom(xScale).tickSize(4).tickFormat(d3.format(option.format));
    let y = d3.axisLeft(yScale).tickSize(4);
    let base =  main.append('g').classed('base',true);
    
    base.append('g').classed('axis',true).call(x).attr('transform',`translate(0,${yScale(orgin.y)})`)
    base.append('g').classed('axis',true).call(y).attr('transform',`translate(${xScale(orgin.x)},0)`);
    base.append('g').classed('rect',true)
        .append('rect')
        .attr('width',width*2)
        .attr('height',height*2)
        .attr('transform',`translate(${-width},${-height})`)
    //添加坐标轴标题
    base.append('g').classed('texts',true)
        .append('text')
        .text(title.xTitle)
        .attr('transform',`translate(0,${height+15})`)
        .style('text-anchor','middle');
    base.append('g').classed('texts',true)
        .append('text')
        .text(title.yTitle)
        .attr('transform',`translate(${-(width+15)},0) rotate(-90)`)
        .style('text-anchor','middle');
    
    return {
        xScale:xScale,
        yScale:yScale
    }
}
//扩展最大值与最小值(大于最大值的最小整数,小于最小值的最大整数)
function getMatrixExtentData(dataset){
    
    let maxMinData = getMaxMinData(filterNumber(dataset));
    for (let i in maxMinData){
        maxMinData[i] =maxMinData[i].map(x=>{
            return x > 0 ?Math.ceil(x):Math.floor(x);
        });
    }
    return maxMinData;
}

function drawScatter(dataset,indexData,option){
    d3.select('.points').remove(); 
    d3.select('.main').remove();
    main = svg.append('g').classed('main',true)
    let scale = drawMatrixBase(dataset,option);
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
                return getColor(7);
            }
        })
        .attr('r',0)
        .attr('transform',d=>`translate(${scale.xScale(option.orgin.x)},${scale.yScale(option.orgin.y)})`)
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
            .style('fill-opacity',0.8);
            tipHidden();
        })
        .transition(t)
        .attr('r',5)
        .attr('transform',d=>`translate(${scale.xScale(d[2])},${scale.yScale(d[3])})`);
        
         
        let zoom = d3.zoom().scaleExtent([1/2,6]).on('zoom',zoomed);    
        
        function zoomed(){
            let transform = d3.event.transform;
            
            d3.select('.base').attr('transform',transform);
            d3.selectAll('circle').attr('transform',d => `translate(${transform.apply([scale.xScale(d[2]),scale.yScale(d[3])])})`); 
        } 
        main.call(zoom); 
        main.attr('transform',d3.zoomIdentity.translate(width/2,height/2));
}

function draw3DonutChart(dataset,indexData,option){
    d3.selectAll('.main>.arcs').remove();
    d3.selectAll('.main>.texts').remove();
    let index =dataset.map(data=>data.slice(1));//所有的指标数据
    let extent = getMaxMinData(index);
    donutChart(indexData[0][1],extent.maxdata[0],0.9*option.radius,0.85*option.radius,getColor(0),dataset.columns[1]);
    donutChart(indexData[0][2],extent.maxdata[1],0.8*option.radius,0.75*option.radius,getColor(1),dataset.columns[2]);
    donutChart(indexData[0][3],extent.maxdata[2],0.7*option.radius,0.65*option.radius,getColor(2),dataset.columns[3]);
}
function donutChart(data,max,innerRadius,outerRadius,color,type){
    let blank = max - data;
    let percent = d3.format(".1%")(data/max);
    //数据转换
    let pie  = d3.pie().startAngle(0).endAngle(Math.PI).sortValues(null)([data,blank]);
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
        // .style('stroke','gray')
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
        .style('fill',(d,i)=>i==0?color:'#e6ecf0')
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
//绘制世界地图基础图
function drawWorldMapBase(dataset,option){
    //读取worldMap.json文件绘制世界地图
    d3.json('../data/world-countries.json').then(function(worldGeo){

        addMapLegend(option.startColor,option.endColor);
        //过滤南极洲
        let worldGeoFeatures = worldGeo.features.filter(d=>d.properties.name!=='Antarctica')
        //地图投影
        // let projection = d3.geoEquirectangular().scale(1).translate([0,0]).fitSize([width,height],worldGeo);
        let projection = cylindrical(option.mapWidth,option.mapHeight);
        //地理路径生成器
        let path = d3.geoPath(projection);
        main.append('g').classed('wMap',true)
        .selectAll('path')
        .data(worldGeoFeatures)
        .enter()
        .append('path')
        .attr('d',path)
        .attr('transform',`translate(${-option.mapWidth/2},${-0.8*option.mapHeight/2})`);    
        function cylindrical(width, height) {
            return d3.geoProjection(function(λ, φ) { return [λ, φ * 2 / width * height]; })
                .scale(width / 2 / Math.PI)
                .translate([width / 2, height / 2]);
        }
        document.querySelector('#univ-list>tbody>tr>td').click();
    });
    
    
}
//根据数据为世界地图绘制颜色
function drawWorldMap(dataset,indexData,option){
    indexData = indexData[0];
    let column =dataset.columns;
    let max=d3.max(indexData.slice(1));//获取极值

    let color  = d3.scaleLinear().domain([1,max]).range([option.startColor,option.endColor]);
    main.select('.wMap')
        .selectAll('path')
        .style('fill',d3.rgb(255,255,255))
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
        .style('fill',`url(#${linearGradient.attr('id')})`)
        .style('stroke-width',0);
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
//绘制环图
function drawDonutChart(dataset,indexdata,option){
    d3.select('.arcs').remove();
    d3.select('.texts').remove();
    d3.select('.legends').remove();

    let data = indexdata[0];
    let innerRadius = option.radius*0.75;
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
                    .text(`融合指数${data[1]}`)
                    .style('font-size','1.2em');
        textArea.append('text').data(data).text(`跨学科论文${data[7]}篇,占比${data[8]}%`)
                .attr('transform','translate(0,40)');

    }
}

// window.onload = function () {
//     let loading = document.querySelector('#loading').classList;
//     loading.add('hidden');
// }
