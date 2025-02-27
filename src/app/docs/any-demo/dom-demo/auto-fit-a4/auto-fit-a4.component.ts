import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Host, HostListener, ViewChild } from '@angular/core';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
/**
 * 比例适配
 * 1、确认容器比例 长宽，确认长宽 缩放
 * 2、根据容器长宽，计算等比例的宽高
 * 3、设置容器em值 设置百分比
 * 4、样式根据百分比变化 使用em 局部的比例
 * 5、html2canvas想要高清图，需要画布像素密度增加 同时缩放对应比例
 */
@Component({
  selector: 'auto-fit-a4',
  templateUrl: './auto-fit-a4.component.html',
  styleUrls: ['./auto-fit-a4.component.less']
})
export class AutoFitA4Component {
  @ViewChild('a4Ref') a4Ref: ElementRef<HTMLDivElement>;
  @ViewChild('containerRef') containerRef: ElementRef<HTMLDivElement>;
  constructor(private cdr: ChangeDetectorRef) {}
  public cachedSize: { width: number; height: number } | null = null;
  readonly A4_SCALE = 1.414;
  public a4FontSize = 0;
  pdf: jsPDF = new jsPDF();
  setSize() {
    const { clientHeight: height, clientWidth: width } = this.containerRef.nativeElement;
    const size = width > height ? { width: height / this.A4_SCALE, height } : { width, height: width * this.A4_SCALE };
    this.cachedSize = size;
  }
  ngOnInit() {}
  ngAfterViewInit() {
    this.setA4();
  }
  setA4() {
    this.setSize();
    this.setRem();
    this.cdr.detectChanges();
  }
  setRem() {
    const { width } = this.cachedSize;
    this.a4FontSize = width / 100;
  }
  @HostListener('window:resize', ['$event'])
  onResize() {
    this.setA4();
  }
  download() {
    const canvas = document.createElement('canvas'); //创建一个canvas节点
    const el = this.a4Ref.nativeElement;
    const { width, height } = el.getBoundingClientRect();
    const imgWidth = 595.28;
    const imgHeight = 841.89;
    const scale = imgWidth / width * 4;
    canvas.width = width * scale; //定义canvas 宽度
    canvas.height = height * scale; //定义canvas高度
    canvas.getContext('2d')?.scale(scale, scale);
    html2canvas(this.a4Ref.nativeElement, {
      removeContainer: true,
      useCORS: true,
      canvas,
      scale: 1,
      width, //dom 原始宽度
      height, //dom 原始高度
      scrollY: 0,
      scrollX: 0,
      allowTaint: true,
    }).then(canvas => {
      const pageData = canvas.toDataURL('image/jpeg', 1.0);
      this.pdf = new jsPDF('p', 'pt', 'a4');
      this.pdf.addImage(pageData, 'JPEG', 0, 0, imgWidth, imgHeight);
      this.pdf.save(`${11}.pdf`);
    });
  }
}
