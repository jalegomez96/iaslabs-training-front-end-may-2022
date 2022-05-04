import { discounts } from './../../shared/constants/discoun.constant';
import { DiscountModel } from 'src/app/core/models/discount.model';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, of, Subject, Subscription } from 'rxjs';
import { mergeMap, takeUntil, tap } from 'rxjs/operators';
import { CategoryModel } from 'src/app/core/models/categories.model';
import { ProductModel } from 'src/app/core/models/product.model';
import { CategoryService } from 'src/app/shared/services/category-service/category.service';
import { ProductService } from 'src/app/shared/services/product-service/product.service';
import { DiscountService } from 'src/app/shared/services/discount-service/discount.service';

@Component({
  selector: 'app-products-list',
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.css'],
})
export class ProductsListComponent implements OnInit, OnDestroy {
  captionText = 'List of products';
  listOfProducts: Array<ProductModel> = [];
  listOfCategories: CategoryModel[] = [];
  listOfDiscounts: DiscountModel[] = [];
  suscribe$: Subscription;
  complete$ = new Subject<boolean>();

  constructor(
    private readonly productService: ProductService,
    private readonly categoryService: CategoryService,
    private readonly discountService: DiscountService
  ) {}

  ngOnInit(): void {
    this.callServices();
    this.listenerChanges();
  }

  callServices(): void {
    this.getAllCategories()
      .pipe(
        takeUntil(this.complete$),
        mergeMap((categories: CategoryModel[]) => {
          console.log('Executing mergeMap ...');
          return this.getAllProductos();
        })
      )
      .subscribe();

    this.getAllDiscounts()
      .pipe(
        takeUntil(this.complete$),
        mergeMap((discounts: DiscountModel[]) => {
          console.log('Executing mergeMap ...');
          return this.getAllDiscounts();
        })
      )
      .subscribe();
  }

  getAllCategories(): Observable<CategoryModel[]> {
    return this.categoryService.getCategory().pipe(
      takeUntil(this.complete$),
      tap((categories: CategoryModel[]) => {
        console.log('Executing categories ...');
        this.listOfCategories = [...categories];
      })
    );
  }

  getAllDiscounts(): Observable<DiscountModel[]> {
    return this.discountService.getAllDiscount().pipe(
      takeUntil(this.complete$),
      tap((discounts: DiscountModel[]) => {
        console.log('Executing discounts ...');
        this.listOfDiscounts = [...discounts];
      })
    );
  }

  getAllProductos(): Observable<ProductModel[]> {
    return this.productService.getAllProducts().pipe(
      takeUntil(this.complete$),
      tap((products: ProductModel[]) => {
        console.log('Executing getAllProducts...');
        this.listOfProducts = [...products];
        console.log('ListOfProducts', this.listOfProducts);
      })
    );
  }

  listenerChanges(): void {
    this.suscribe$ = this.productService
      .getChanges()
      .pipe(
        mergeMap((change: boolean) => (change ? this.getAllProductos() : of()))
      )
      .subscribe();
  }

  transformType(typeId: number): string | number {
    const categoryForChange = this.listOfCategories.find(
      (category: CategoryModel) => category.id === Number(typeId)
    );
    return categoryForChange ? categoryForChange.name : typeId;
  }

  transformDiscount(typeId: number): string | number {
    const discountForChange = this.listOfDiscounts.find(
      (discount: DiscountModel) => discount.idProduct === Number(typeId)
    );
    return discountForChange && discountForChange.discountApply
      ? discountForChange.value / 100
      : 0;
  }

  applyDiscount(product: ProductModel): string | number {
    const discountForChange = this.listOfDiscounts.find(
      (discount: DiscountModel) =>
        discount.idProduct === Number(product.typeOfProduct)
    );
    return discountForChange && discountForChange.discountApply
      ? product.price * (1 - discountForChange.value / 100)
      : product.price;
  }

  trackByItems(index: number, item: ProductModel): number {
    return item.productId;
  }

  ngOnDestroy(): void {
    this.suscribe$.unsubscribe();
    this.complete$.next(true);
    this.complete$.unsubscribe();
  }
}
