import { Component, Input } from '@angular/core';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, fromEvent, of, throwError } from 'rxjs';
import { catchError, map, retry } from 'rxjs/operators';
import { Product } from '../interfaces/products';

@Component({
  selector: 'app-product-search',
  templateUrl: './product-search.component.html',
  styleUrls: ['./product-search.component.css']
})

@Injectable() 
export class ProductSearchComponent {

  @Input()  productList: Array<any> = [];
  products: Product[];

  constructor(private http: HttpClient) { 
    this.products = [];
  }

  ngOnInit(): void {
    this.getProducts("");
  }

  doStuff(){
    this.productList.push({title: "derp"});
  }


  getProducts(searchTerm: string): void{
    

    this.http
    .get<{ content: Product[] }>('assets/products.json')
    .subscribe((data) => {
      const products = data.content;
    });

    // const params = new HttpParams(/*{fromString: 'name=term'}*/);
    // var testObservable = this.http.request('GET', "/assets/products.json", {responseType:'json', params});

    // const test = testObservable.subscribe({
    //   next(position: any) {
    //     var productListTemp: Array<Product> = position.content;  //how do I access this data outside this function?
    //     console.log(productListTemp);
    //   },
    //   error() {
    //     console.log("Error");
    //   }
    // });
   }


}

