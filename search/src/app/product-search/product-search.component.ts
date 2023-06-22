import { Component, Input } from '@angular/core';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, forkJoin, from, fromEvent, of, throwError } from 'rxjs';
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
  totalPages: number = 0;
  paginationProductsperPage: number = 10;
  showNextButton:boolean = false;
  showPrevButton:boolean = false;
  showPageNumber:boolean = false;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    
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

    this.paginationPage = this.paginationPage + change;
    this.totalPages = Math.ceil(this.searchedProductList.length/this.paginationProductsperPage);
    if (this.totalPages > 1) {
      this.showPageNumber = true;
    }else{
      this.showPageNumber = false;
    }
    if (this.paginationPage < 1) {
      this.showPrevButton = false;
    }else{
      this.showPrevButton = true;
    }
    if (this.paginationPage >= this.totalPages-1) {
      this.showNextButton = false;
    }else{
      this.showNextButton = true;
    }
  }

  getProducts(): Observable<{ content: Product[] }>{
    if (this.productList.length == 0) {
      var obs = this.http.get<{ content: Product[] }>('assets/products.json');
      obs.subscribe((data) => {
        const products = data.content;
        this.productList = products;
      });
      return obs;
    }else{
      return from(this.productList);
    }
  }

  filter(event: Event){

    const example = forkJoin({
      productList: this.getProducts().pipe(catchError(error => of(error))),
      keyEvent: of(event).pipe(
        debounceTime(150),
        distinctUntilChanged(),
      )

    }).subscribe(({ productList, keyEvent }) => {
      of(keyEvent).pipe(
       
        map((e: any) => e.target.value),
        switchMap((keys: string) =>
        of(this.getFilteredValues(keys)))
      )
      .subscribe(() => {
        this.updatePaginationButtons(0);
      }
      );
    });
  }

   getFilteredValues(keys: string): Array<String>{

    var words = keys.split(" ").filter(n => n);
    this.searchedProductList = this.productList.filter(e => this.containsWords(e.title, words));
    return this.searchedProductList;
   }

   containsWords(productName: string, words: string[]): boolean{
    productName = productName.toLocaleLowerCase();

    for (let index = 0; index < words.length; index++) {
      if (!productName.includes(words[index].toLowerCase())) {
        return false;
      }
    }
    return true;
   }

}
