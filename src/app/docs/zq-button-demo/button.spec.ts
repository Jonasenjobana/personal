import { ComponentFixture, TestBed } from "@angular/core/testing"
import { ZqButtonDemo } from "./zq-button-demo.component"
import { ZqButtonComponent } from "src/app/shared/module/button/zq-button.component"
import { template } from "lodash";
import { Component, DebugElement, ElementRef, Inject } from "@angular/core";
import { ZqButtonModule } from "src/app/shared/module/button/zq-button.module";
import { By } from "@angular/platform-browser";

describe('zq-button', () => {
    let btnFixture: ComponentFixture<ZqTestButtonComponent>;
    let btn: DebugElement
    let testBtn: ZqButtonComponent;
    beforeEach(() => {
        btnFixture = TestBed.createComponent(ZqTestButtonComponent);
        btn = btnFixture.debugElement.query(By.directive(ZqButtonComponent));
        testBtn = btn.componentInstance;
    })
    it('if test demo init', () => {
        expect(btnFixture).toBeDefined();
        expect(btn).toBeDefined();
    });
    it('change btn type', () => {
        testBtn.zqType = 'dangerous';
        btnFixture.detectChanges();
        expect(btn.nativeElement.classList).toContain('zq-btn-dangerous');
        
        testBtn.zqType = 'dangerous';
        btnFixture.detectChanges();
        expect(btn.nativeElement.classList).toContain('zq-btn-dangerous');
        
        testBtn.zqType = 'primary';
        btnFixture.detectChanges();
        expect(btn.nativeElement.classList).toContain('zq-btn-primary');
        
        testBtn.zqType = 'default';
        btnFixture.detectChanges();
        expect(btn.nativeElement.classList).toContain('zq-btn-default');
        
    })
})
@Component({
    template: `
        <button zq-button>测试</button>
    `,
    imports: [ZqButtonModule],
    standalone: true
})
class ZqTestButtonComponent {

}