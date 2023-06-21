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
  paginationPage: number = 0;
  paginationProductsperPage: number = 10;
  showNextButton:boolean = true;
  showPrevButton:boolean = false;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.getProducts("");
  }

  doStuff(){
    this.updatePaginationButtons(0);
  }

  previous(){
    this.updatePaginationButtons(-1);
  }

  next(){
    this.updatePaginationButtons(+1);
  }

  updatePaginationButtons(change: number){

    var newPage = this.paginationPage + change;
    var totalPages = Math.ceil(this.productList.length/this.paginationProductsperPage);

    if (newPage < 1) {
      this.showPrevButton = false;
    }else{
      this.showPrevButton = true;
    }
    if (newPage >= totalPages-1) {
      this.showNextButton = false;
    }else{
      this.showNextButton = true;
    }
    this.paginationPage = newPage;
  }


  getProducts(searchTerm: string): void{
    
    this.http
    .get<{ content: Product[] }>('assets/products.json')
    .subscribe((data) => {
      const products = data.content; //how do I access this data outside this function?
      this.productList = products;
    });

    // const params = new HttpParams(/*{fromString: 'name=term'}*/);
    // var testObservable = this.http.request('GET', "/assets/products.json", {responseType:'json', params});

    // const test = testObservable.subscribe({
    //   next(position: any) {
    //     var productListTemp: Array<Product> = position.content;  
    //     console.log(productListTemp);
    //   },
    //   error() {
    //     console.log("Error");
    //   }
    // });
   }


}

