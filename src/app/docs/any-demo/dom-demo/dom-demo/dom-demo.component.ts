import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import * as echarts from 'echarts';
import 'echarts-gl';
@Component({
  selector: 'dom-demo',
  templateUrl: './dom-demo.component.html',
  styleUrls: ['./dom-demo.component.less']
})
export class DomDemoComponent {
  chart: echarts.ECharts;
  // 3Dpie数据
  mock: any = [
    { type: '测试A', value: 1, startRatio: 0, endRatio: 60 }
    // { type: '测试B', value: 2, startRatio: 60, endRatio: 180 },
    // { type: '测试C', value: 3, startRatio: 180, endRatio: 360 }
  ];
  constructor(private http_: HttpClient) {}
  async ngAfterViewInit() {
    this.chart = echarts.init(document.getElementById('echart-container') as HTMLDivElement);
    this.chart.setOption({
      tooltip: {},
      backgroundColor: '#fff',
      visualMap: {
        show: false,
        dimension: 2,
        min: -1,
        max: 1,
        inRange: {
          color: [
            '#313695',
            '#4575b4',
            '#74add1',
            '#abd9e9',
            '#e0f3f8',
            '#ffffbf',
            '#fee090',
            '#fdae61',
            '#f46d43',
            '#d73027',
            '#a50026'
          ]
        }
      },
      xAxis3D: {
        type: 'value'
      },
      yAxis3D: {
        type: 'value'
      },
      zAxis3D: {
        type: 'value'
      },
      grid3D: {
        viewControl: {
          // projection: 'orthographic'
        }
      },
      series: [
        {
          type: 'surface',
          wireframe: {
            // show: false
          },
          parametric: true,
          parametricEquation: {
            u: {
              min: 0,
              max: Math.PI * 2,
              step: Math.PI / 20
            },
            v: {
              min: 0,
              max: Math.PI * 2,
              step: Math.PI / 20
            },
            x: function (u, v) {
              return Math.cos(u) * (1 - Math.abs(Math.sin(v) / 2));
            },
            y: function (u, v) {
              return  Math.sin(u) * (1 - Math.abs(Math.sin(v) / 2));
            },
            z: function (u, v) {
              return Math.sin(v) > 0 ? 0 : 1;
            }
          }
        }
      ]
    });
  //   const serieses: echarts.SeriesOption = this.mock.map((item, index) => {
  //     const startRad = item.startRatio * (Math.PI / 180);
  //     const endRad = item.endRatio * (Math.PI / 180);
  //     const radius = 1;
  //     const height = 1;
  //     return {
  //       type: 'surface',
  //       parametric: true,
  //       wireframe: false,
  //       // 圆形
  //       parametricEquation: {
  //         u: {
  //           min: -Math.PI,
  //           max: Math.PI * 3,
  //           step: Math.PI / 32
  //         },
  //         v: {
  //           min: 0,
  //           max: Math.PI * 2,
  //           step: Math.PI / 20
  //         },
  //         x: (u, v) => {
  //           if (u < startRad) {
  //             return Math.cos(startRad) * (1 + (Math.cos(v) * 1) / 3);
  //           }
  //           if (u > endRad) {
  //             return Math.cos(endRad) * (1 + (Math.cos(v) * 1) / 3);
  //           }
  //           return Math.cos(u) * (1 + (Math.cos(v) * 1) / 3);
  //         },
  //         y: (u, v) => {
  //           if (u < startRad) {
  //             return Math.sin(startRad) * (1 + (Math.cos(v) * 1) / 3);
  //           }
  //           if (u > endRad) {
  //             return Math.sin(endRad) * (1 + (Math.cos(v) * 1) / 3);
  //           }
  //           return Math.sin(u) * (1 + (Math.cos(v) * 1) / 3);
  //         },
  //         z: (u, v) => {
  //           const h = index / 3;
  //           if (u < -Math.PI * 0.5) {
  //             return Math.sin(u);
  //           }
  //           if (u > Math.PI * 2.5) {
  //             return Math.sin(u) * h * 0.1;
  //           }
  //           return Math.sin(v) > 0 ? 1 * h * 0.1 : -1;
  //         }
  //       }
  //     };
  //   });
  // }

  //   const res: any = await this.http_.get('assets/json/geo.json').toPromise();
  //   console.log(res);
  //   echarts.registerMap('china', res);
  //   let regions = [
  //     {
  //       name: '新疆维吾尔自治区',
  //       itemStyle: {
  //         areaColor: '#374ba4',
  //         opacity: 1
  //       }
  //     },
  //     {
  //       name: '四川省',
  //       itemStyle: {
  //         areaColor: '#fe9b45',
  //         opacity: 1
  //       }
  //     },
  //     {
  //       name: '陕西省',
  //       itemStyle: {
  //         areaColor: '#fd691b',
  //         opacity: 1
  //       }
  //     },
  //     {
  //       name: '黑龙江省',
  //       itemStyle: {
  //         areaColor: '#ffc556',
  //         opacity: 1
  //       }
  //     }
  //   ];
  //   let scatter = [
  //     { name: '北京烤鸭', value: [116.46122, 39.97886, 9] },
  //     { name: '兰州拉面', value: [103.86615, 36.040129, 9] },
  //     { name: '新疆烤肉', value: [87.613228, 43.810394, 9] },
  //     { name: '长沙臭豆腐', value: [112.915204, 28.207735, 9] },
  //     { name: '西安肉夹馍', value: [108.953445, 34.288842, 9] },
  //     { name: '云南', value: [102.710002, 25.045806, 9] }
  //   ];
  //   this.chart.setOption({
  //     geo3D: {
  //       map: 'china',
  //       roam: true,
  //       itemStyle: {
  //         color: "#4189f2", // 背景
  //         opacity: 1, //透明度
  //         borderWidth: .1, // 边框宽度
  //         borderColor: "#eee", // 边框颜色
  //         fontSize: .1, //
  //       },
  //       viewControl: {
  //         distance: 120,
  //         alpha: 70, // 上下旋转的角度
  //         beta: 0, // 左右旋转的角度
  //       },
  //     },
  //     //配置属性
  //     series: [{
  //       type: 'bar3D',
  //       coordinateSystem: 'geo3D',
  //       data: scatter,
  //       color: '#EC691A',
  //       minHeight: 5,
  //       barSize: 1.5,
  //       animation: true,
  //       animationDurationUpdate: 2000
  //     }]
  //   });
  // }
  }
}
