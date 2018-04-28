
/** 使用此方法必须手动引入highcharts组件（目前在首页、指数中心的图标使用）
   * highcharts.....xAxis--datetime
   * highcharts横轴为时间序列
   * @param divId:绘图区域id
   * @param seriesData:曲线序列值
   * @param axisTimeFmt:X轴时间格式化
   * @param toolTipTimeFmt:提示框时间格式化
   */
  
function HC_drawXTime(divId,seriesData,axisTimeFmt,toolTipTimeFmt){

	    var maxData = seriesData[0][1];
	    var minData = seriesData[0][1];
	    var YMean = seriesData[0][2];
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
	    

	    $('#'+divId).highcharts({
	        chart: {zoomType: 'x'},
	        title: {text: null}, 
	        subtitle: {
	            text: document.ontouchstart === undefined ?'鼠标拖动可以进行缩放' : '手势操作进行缩放'
	        },
	        xAxis: {
	            type: 'datetime',
	            gridLineWidth :1,
	            minTickInterval:1000,
	            dateTimeLabelFormats:axisTimeFmt
	           },
	        tooltip: {
	          dateTimeLabelFormats:toolTipTimeFmt,
	            crosshairs: [{
	                width: 1,
	                color: '#1E90FF'
	            }, {
	                width: 1,
	                color: '#1E90FF'
	            }]
	        },
	        yAxis: {
	            title: {text: null},
	            max:maxData,
	            endOnTick:false,
	            min:minData,
	            startOnTick: false
	            /*plotLines: [{   //一条延伸到整个绘图区的线，标志着轴中一个特定值。
	                color: '#0000ff',
	                dashStyle: 'Dash', //Dash,Dot,Solid,默认Solid
	                width: 1.5,
	                value: 110  //x轴显示位置，一个标记为1
	            }],
	            plotBands: [{ //彩色带横跨绘图区，标志着轴间隔。
	                color: '#FFFF00',
	                from: 110,
	                to: 120
	            }]*/
	        },
	        legend: {
	            enabled: false
	        },
	        plotOptions: {
	          series: {// 针对所有数据列有效的配置
	            lineWidth: 1,
	            color:'#ff0000',
	            marker: { 
	              radius: 2
	            },
	            states: {
	              hover: {
	                lineWidth: 1
	              }
	            }
	          }
	        },
	        series: [{
	            type: 'spline',
	            name: YMean,
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
