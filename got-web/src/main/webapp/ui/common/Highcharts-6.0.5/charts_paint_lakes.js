
/** 使用此方法必须手动引入highcharts组件（目前在首页、指数中心的图标使用）
 * highcharts.....xAxis--datetime
 * highcharts横轴为时间序列
 * @param divId:绘图区域id
 * @param xData:绘图区的x轴类目集合--本方法中不使用
 * @param seriesData:曲线序列值
 */
function hchart_paint_xshijian(divId,xData,seriesData){

  var maxData = seriesData[0][1];
  var minData = seriesData[0][1];
  for(var i=0; i<seriesData.length; i++){
  	var curData = seriesData[i][1];
  	if(curData>maxData){
  		maxData = curData;
  	}
  	if(curData<minData){
  		minData = curData;
  	}
  }
  maxData = parseInt(maxData+15);
  minData = parseInt(minData-15);

 var weekXAxis = {
 	type: 'datetime',
 	gridLineWidth :1,
	minTickInterval:24*3600*1000,
	dateTimeLabelFormats:
     {
         second: '%Y-%m-%d',
         minute: '%Y-%m-%d',
         hour: '%Y-%m-%d',
         day: '%Y-%m-%d',
         week: '%Y-%m-%d',
         month: '%Y年%m月',
         year: '%Y年'
     } 
 };
 
 var currAxis = weekXAxis
	$('#'+divId).highcharts({
            chart: {
                zoomType: 'x'
            },
			
            title: {
                text: null
            }, 
            subtitle: {
                text: document.ontouchstart === undefined ?'鼠标拖动可以进行缩放' : '手势操作进行缩放'
            },
            xAxis: currAxis,
            tooltip: {
            	dateTimeLabelFormats:
                {
                    second: '%Y-%m-%d',
                    minute: '%Y-%m-%d',
                    hour: '%Y-%m-%d',
                    day: '%Y-%m-%d',
                    week: '%Y-%m-%d',
                    month: '%Y年%m月',
                    year: '%Y年'
                }
            },
            yAxis: {
                title: {
                    text: null//seriesData[0].name
                },
                max:maxData,
                endOnTick:false,
                min:minData,
                startOnTick: false
            },
            legend: {
                enabled: false
            },
            plotOptions: {
                area: {
                    fillColor: {
                        linearGradient: {
                            x1: 0,
                            y1: 0,
                            x2: 0,
                            y2: 1
                        },
                        stops: [
                            [0, Highcharts.getOptions().colors[0]],
                            [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                        ]
                    },
                    marker: { 
                        radius: 2
                    },
                    lineWidth: 1,
                    states: {
                        hover: {
                            lineWidth: 1
                        }
                    },
                    threshold: null
                }
            },
            series: [{
                type: 'spline',
                name: '指数',
                data: seriesData
            }]
        });
}

/**使用此方法必须手动引入highcharts组件（目前在首页、指数中心的图标使用）
 * highcharts.....xAxis--category
 * highcharts横轴为类目序列
 * @param divId:绘图区域id
 * @param xData:绘图区的x轴类目集合--本方法中使用
 * @param seriesData:曲线序列值
 */
function hchart_paint_xleibie(divId,xData,seriesData){
	var tarDataList = seriesData[0].data;
	var tarDataList2 = new Array();
	for(var i=0;i<tarDataList.length;i++){
		var data = tarDataList[i];
		data = data.toFixed(2);
		tarDataList2.push(parseFloat(data));
	}
//横轴的间隔值
	var tickInterval_ = Math.floor(tarDataList2.length/6);
	
	var maxData = tarDataList[0];
	var minData = tarDataList[0];
	for(var i=0; i<tarDataList.length; i++){
		var curData = tarDataList[i];
		if(curData>maxData){
			maxData = curData;
		}
		if(curData<minData){
			minData = curData;
		}
	}
	maxData = parseInt(maxData+15);
	minData = parseInt(minData-15);

		$('#'+divId).highcharts({
	            chart: {
	                zoomType: 'x'
	            },
				
	            title: {
	                text: null//seriesData[0].name
	            }, 
	            subtitle: {
	                text: document.ontouchstart === undefined ?'鼠标拖动可以进行缩放' : '手势操作进行缩放'
	            },
	            xAxis: {
	                tickInterval: tickInterval_,
					categories: xData
					
	            },
	            tooltip: {
	                dateTimeLabelFormats: {
	                    millisecond: '%H:%M:%S.%L',
	                    second: '%H:%M:%S',
	                    minute: '%H:%M',
	                    hour: '%H:%M',
	                    day: '%Y-%m-%d',
	                    week: '%m-%d',
	                    month: '%Y-%m',
	                    year: '%Y'
	                }
	            },
	            yAxis: {
	                title: {
	                    text: null
	                },
	                max:maxData,
	                endOnTick:false,
	                min:minData,
	                startOnTick: false
	            },
	            legend: {
	                enabled: false
	            },
	            plotOptions: {
	                area: {
	                    fillColor: {
	                        linearGradient: {
	                            x1: 0,
	                            y1: 0,
	                            x2: 0,
	                            y2: 1
	                        },
	                        stops: [
	                            [0, Highcharts.getOptions().colors[0]],
	                            [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
	                        ]
	                    },
	                    marker: { 
	                        radius: 2
	                    },
	                    lineWidth: 1,
	                    states: {
	                        hover: {
	                            lineWidth: 1
	                        }
	                    },
	                    threshold: null
	                }
	            },
	            series: [{
	                type: 'spline',
	                name: '数值',
	                data: tarDataList2//seriesData[0].data
	            }]
	        });
	}
