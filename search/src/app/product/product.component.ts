import { Component, Input, Output } from '@angular/core';
import { Product } from '../interfaces/products';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent {

  @Input()  product: any;

}
