d3.select("svg")
  .selectAll("g.module")
  .attr("cursor", "pointer")
  .on("mouseover", function () {
    d3.select(this).transition().duration(400).attr("transform", "translate(0,-10)").select(".cls").style("fill",
      "#2563c6").style("stroke", "rgb(255,255,255,0.2)")
  })
  .on("mouseout", function () {
    d3.select(this).transition().duration(400).attr("transform", "translate(0,0)").select(".cls").style("fill",
      "#45a3e9").style("stroke", "none")
  })
  .on("click", function () {
    window.location.reload()
  })


//数字变化特效
function rollNum(elId, startVal, endVal, decimalNum,duration) {
  let n = decimalNum || 0;
  let countUp = new CountUp(elId, startVal, endVal, n, duration, {
    useEasing: true,
    useGrouping: true,
    separator: ',',
    decimal: '.'
  });
  if (!countUp.error) {
    countUp.start();
  } else {
    console.error(countUp.error);
  }
}

window.onload = function () {
  
  rollNum("num1", 10, 12345,0,10);
  rollNum("num2", 300, 20345,0,10);
  rollNum("num3", 100, 30345,0,10);
  rollNum("num4", 200, (Math.random()*400).toFixed(0),0,2);
  rollNum("num5", 0, (Math.random()*200).toFixed(0),0,2);
  rollNum("num6", 0, (Math.random()*200).toFixed(0),0,2);
  rollNum("num7", 200, (Math.random()*400).toFixed(0),0,2);
  rollNum("num8", 0, (Math.random()*200).toFixed(0),0,2);
  rollNum("num9", 400, (Math.random()*600).toFixed(0),0,2);
  rollNum("num10", 0, (Math.random()*200).toFixed(0),0,2);
  rollNum("num11", 0, (Math.random()*200).toFixed(0),0,2);

}