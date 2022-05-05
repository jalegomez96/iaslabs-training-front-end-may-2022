import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { merge, Observable, Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';
import { CategoryModel } from 'src/app/core/models/categories.model';
import { DiscountModel } from 'src/app/core/models/discount.model';
import { ProductModel } from 'src/app/core/models/product.model';
import { CategoryService } from 'src/app/shared/services/category-service/category.service';
import { DiscountService } from 'src/app/shared/services/discount-service/discount.service';
import { ProductService } from 'src/app/shared/services/product-service/product.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css'],
})
export class ProductComponent implements OnInit, OnDestroy {
  form: FormGroup;
  suscribe$: Subscription;
  categories: CategoryModel[];
  discounts: DiscountModel[];
  discountApply: DiscountModel;

  constructor(
    private readonly fb: FormBuilder,
    private readonly productService: ProductService,
    private readonly categoryService: CategoryService,
    private readonly discountService: DiscountService
  ) {}

  ngOnInit(): void {
    this.createForm();
    this.callService();
    this.listenerFieldTypeOfProduct();
    console.log(window.localStorage.getItem('userApp')); // remove item - is the same function
  }

  createForm(): void {
    this.form = this.fb.group({
      productId: ['', [Validators.required]],
      typeOfProduct: [undefined, [Validators.required]],
      name: ['', [Validators.required]],
      price: [0, [Validators.required]],
      discountApply: [false],
    });
  }

  callService(): void {
    merge<CategoryModel[], DiscountModel[]>(
      this.getCategories(),
      this.getDiscounts()
    ).subscribe();
  }

  getDiscounts(): Observable<DiscountModel[]> {
    return this.discountService.getAllDiscount().pipe(
      tap((discounts: DiscountModel[]) => {
        console.log('Executing discounts...', discounts);
        this.discounts = discounts;
      })
    );
  }

  getCategories(): Observable<CategoryModel[]> {
    return this.categoryService.getCategory().pipe(
      tap((categories: CategoryModel[]) => {
        console.log('Executing categories...', categories);
        this.categories = categories;
      })
    );
  }

  onClickSave(): void {
    if (this.form.valid) {
      const product: ProductModel = { ...this.form.value };
      this.productService
        .saveProduct(product)
        .subscribe((product: ProductModel) => {
          // logic - if request is success
          this.form.reset();
          alert(
            `Se ha guardado con exito el usuario: ${product.productId} - ${product.name}`
          );
          this.productService.setChanges(true);
        });
    } else {
      alert('El Formulario no se encuentra valido.');
    }
  }

  onChangeTypeOfProduct(): void {
    console.log(this.form.get('typeOfProduct').value);
    this.form.get('discountApply').setValue(!!this.discountApply);
  }

  listenerFieldTypeOfProduct(): void {
    this.suscribe$ = this.form
      .get('typeOfProduct')
      .valueChanges.subscribe((typeOfProduct: string) => {
        console.log('Executing lintener type of product: ', typeOfProduct);
        this.discountApply = this.discounts.find(
          (discount: DiscountModel) =>
            discount.idProduct.toString() === typeOfProduct &&
            discount.discountApply
        );
      });
  }

  ngOnDestroy(): void {
    this.suscribe$.unsubscribe();
  }
}
