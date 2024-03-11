import { Component } from '@angular/core';

@Component({
  selector: 'shop-car-anime',
  templateUrl: './shop-car-anime.component.html',
  styleUrls: ['./shop-car-anime.component.less']
})
export class ShopCarAnimeComponent {
  products: any = [
    {
      name: '苹果',
      price: 13
    },

  ]
  addProducts: any = []
  addToCar(item: any) {
    // 触发加入购物车动画
    this.addProducts.push(item);
  }
}
