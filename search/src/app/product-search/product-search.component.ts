import { Component, Input } from '@angular/core';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, from, fromEvent, of, throwError } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, map, retry, switchMap, tap } from 'rxjs/operators';
import { Product } from '../interfaces/products';

@Component({
  selector: 'app-product-search',
  templateUrl: './product-search.component.html',
  styleUrls: ['./product-search.component.css']
})

@Injectable() 
export class ProductSearchComponent {

  @Input()  productList: Array<any> = [];
  @Input()  searchedProductList: Array<any> = [];

  paginationPage: number = 0;
  paginationProductsperPage: number = 10;
  showNextButton:boolean = true;
  showPrevButton:boolean = true;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    
    this.getProducts();
    this.updatePaginationButtons(0);
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
    var totalPages = Math.ceil(this.searchedProductList.length/this.paginationProductsperPage);

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


  getProducts(): void{
    if (this.productList.length == 0) {
      console.log("fetching");
      this.http
      .get<{ content: Product[] }>('assets/products.json')
      .subscribe((data) => {
        const products = data.content;
        this.productList = products;
      });
    }
  }

  filter(event: Event){
    of(event).pipe(
      debounceTime(150),
      distinctUntilChanged(),
      tap(val => console.log(val)),
      map((e: any) => e.target.value),
      switchMap((keys: string) =>
      of(this.getFilteredValues(keys)))
    )
    .subscribe();
  }

   getFilteredValues(keys: string): Array<String>{
    this.getProducts();
    this.searchedProductList = this.productList.filter(e => e.title.indexOf(keys.toLowerCase()) > -1);
    return this.productList.filter(e => e.title.indexOf(keys.toLowerCase()) > -1);
   }

}

// dataen skal først hentes ved første søgning
// search fungerer ikke ordenligt
// search skal søge efter individuelle ord i en hvilken som helst rækkefølge
