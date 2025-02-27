import { Component, ElementRef, ViewChild } from '@angular/core';
import * as echarts from 'echarts';

@Component({
  selector: 'echart1',
  templateUrl: './echart1.component.html',
  styleUrls: ['./echart1.component.less']
})
export class Echart1Component {
  @ViewChild('myChart2') myChart2: ElementRef<HTMLCanvasElement>;
  @ViewChild('myChart') myChart: ElementRef<HTMLCanvasElement>;
  chart: echarts.ECharts;
  chart2: echarts.ECharts;
  ngAfterViewInit() {
    this.chart = echarts.init(this.myChart.nativeElement);
    // this.chart2 = echarts.init(this.myChart2.nativeElement);
    this.initGauge();
    // this.initBarChart();
  }
  initBarChart() {
    this.chart2.setOption({
      xAxis: {
        type: 'category',
        data: ['货船', '客船', '游轮', '高速船', '渔船', '游艇', '拖船/特种船', '其他'],
        axisTick: {
          alignWithLabel: false,
          interval: 0,
          inside: true,
          length: 2,
          lineStyle: {
            color: '#76809c'
          }
        },
        axisLine: {
          lineStyle: {
            color: '#76809c'
          }
        },
        axisLabel: {
          interval: 0
        },
        nameTextStyle: {
          color: '#D3DFFF'
        },
        nameGap: 20
      },
      yAxis: {
        type: 'value'
      },
      tooltip: {
        show: true,
        trigger: 'axis',
        axisPointer: {
          // 全局配置 十字准星指示器
          type: 'shadow',
          shadowStyle: {
            shadowColor: 'rgba(97,113,147,0.30)'
          }
        },
        formatter: '{b}: {c}'
      },
      series: [
        {
          name: '船舶数',
          data: [120, 200, 150, 80, 70, 110, 130, 20],
          type: 'bar'
        },
        {
          name: '报警数',
          data: [33, 44, 66, 2, 5, 66, 22, 10],
          type: 'bar'
        }
      ]
    });
  }
  initGauge() {
    this.chart.setOption({
      tooltip: {
        formatter: '{a} <br/>{b} : {c}%'
      },
      grid: [],
      graphic: [
        {
          type: 'image',
          left: 0,
          top: 0,
          origin: [30, 55], //中心点
          bounding: 'raw',
          style: {
            image: 'assets/images/echart/gauge-bg.png',
            width: 248,
            height: 148
          }
        }
      ],
      series: [
        {
          name: 'Pressure',
          type: 'gauge',
          startAngle: 180,
          endAngle: 360,
          radius: '88px',
          center: ['50%', '70%'],
          detail: {
            show: false,
            formatter: '{value}'
          },
          title: {
            show: false
          },
          pointer: {
            icon: 'image://assets/images/echart/gauge-pointer.png',
            length: '110%',
            width: 28
          },
          axisTick: {
            show: false
          },
          splitLine: {
            show: false
          },
          tooltip: {
            show: false,
          },
          axisLabel: {
            show: false
          },
          axisLine: {
            show: false
          },
          progress: {
            show: true,
            width: 14,
            itemStyle: {
              color: {
                type: 'linear',
                x: 1,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  {
                    offset: 1,
                    color: 'rgba(56,201,201,1)' // 0% 处的颜色
                  },
                  {
                    offset: 0,
                    color: 'rgba(38,255,121,1)' // 100% 处的颜色
                  }
                ],
                global: false // 缺省为 false
              }
            }
          },
          data: [
            {
              value: 10,
              name: 'SCORE'
            }
          ]
        }
      ]
    });
    setInterval(() => {
      this.chart.setOption({
        series: [
          {
            name: 'Pressure',
            data: [
              {value: 100, name: 'SCORE'}
            ]
          }
        ]
      });
    }, 3000);
  }
}
