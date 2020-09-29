$(function(){
    let myCharts = echarts.init(document.getElementById('cityMap'));
    let sanData = [];
    // libs/echarts/test.json
    // libs/echarts/geo.json
    // libs/test/test011.json
    // libs/geo/geo011.json
    $.ajax({
        url: "libs/test/test023.json",
        type: "GET",
        dataType: "JSON",
        success: function (data) {
            var obj=data;

            for(var i=0;i<obj.length;i++){
                sanData.push({
                    name: obj[i].name,
                    value: obj[i].value
                })
            }
            // console.log(sanData);
        }
    });
    let geoCoordMap=new Object();
    $.ajax({
        url: "libs/geo/geo023.json",
        type: "GET",
        dataType: "JSON",
        success: function (data) {
            var obj=data;
            geoCoordMap=obj;
        }
    });
    $.get('./libs/echarts/xian-full.json',function(data){
        echarts.registerMap('xian', data, {});
        var mapData=[];

        var convertData = function (data) { // 处理数据函数
            var res = [];
            for (var i = 0; i < data.length; i++) {
                var geoCoord = geoCoordMap[data[i].name];
                if(geoCoord){
                    res.push({
                        name: data[i].name,
                        value: geoCoord.concat(data[i].value)
                    });
                }
            }
            return res;
        };
        let option = {
            tooltip: {
                trigger: 'item'
            },
            toolbox:{
                show:true,
                feature:{
                    saveAsImage:{
                        show:true
                    }
                }
            },
            geo: { // 地图配置
                show: true,
                map: 'xian',
                label: {
                    normal: {
                        show: false
                    },
                    emphasis: {
                        show: false
                    }
                },
                roam: true,
                itemStyle: {
                    normal: {
                        areaColor: '#323c48',
                        borderColor: '#111'
                    },
                    emphasis: {
                        areaColor: '#2a333d'
                    }
                },
                zoom: 1.2,
                backgroundColor: '#404a59',
            },
            series: [{ // 散点配置
                name: '数量',
                type: 'effectScatter',
                coordinateSystem: 'geo',
                data: convertData(sanData),
                symbolSize: function (val) {
                    return val[2];
                },
                showEffectOn: 'emphasis',
                rippleEffect: {
                    brushType: 'stroke'
                },
                hoverAnimation: true,
                label: {
                    normal: {
                        formatter: '{b}',
                        position: 'right',
                        show: false
                    },
                    emphasis: {
                        show: true
                    }
                },
                itemStyle: {
                    normal: {
                        color: '#ff8003'
                    }
                }
            }, { // 地图配置
                name: 'not known',
                type: 'map',
                mapType: 'xian', // 自定义扩展图表类型
                geoIndex: 0,
                // aspectScale: 0.75, // 长宽比
                itemStyle: {
                    normal: {label: {show: true}},
                    emphasis: {label: {show: true}}
                },
                data: mapData
            }
            ]
        };
        myCharts.setOption(option);
    });
});
