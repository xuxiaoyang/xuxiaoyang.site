/**
 * 雷达图构建模块
 * @param {*} data 雷达图构建需要的指标数据对象
 * @param {*} option 配置对象配置对象, 如果不传则使用默认的配置
 *                - catergory 类别名称数组
 *                - leveNum 雷达图底层正多边形数量
 * 模块的使用：引入模块，用参数实例化本模块。
 */

function Radar(data,option){
    let categoryInit = filterNumber(data.map((element,index) => `类别${index+1}`));
    let defaultOption={ //模块的默认配置,实例化时传入,不传使用默认配置
        category:categoryInit,
        levelNum:10,
    }
    this.option = Object.assign(defaultOption,option);
}
DrawRadar.prototype.init = function(){
    
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

function filterNumber(data){
    return data.filter(d=> typeof d === 'number');
}