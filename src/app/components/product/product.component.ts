import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ProductModel } from 'src/app/core/models/product.model';
import { ProductService } from 'src/app/shared/services/product-service/product.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css'],
})
export class ProductComponent implements OnInit, OnDestroy {
  form: FormGroup;
  suscribe$: Subscription;

  constructor(
    private readonly fb: FormBuilder,
    private readonly productService: ProductService
  ) {}

  ngOnInit(): void {
    this.createForm();
    this.listenerFieldTypeOfProduct();
    console.log(window.localStorage.getItem('userApp')); // remove item - is the same function
  }

  createForm(): void {
    this.form = this.fb.group({
      productId: ['', [Validators.required]],
      typeOfProduct: [undefined, [Validators.required]],
      name: ['', [Validators.required]],
      price: [0, [Validators.required]],
    });
  }

  onClickSave(): void {
    if (this.form.valid) {
      const product: ProductModel = { ...this.form.value };
      this.productService.saveProduct(product).subscribe(
        (product: ProductModel) => {
          // logic - if request is success
          this.form.reset();
          alert(`Se ha guardado con exito el usuario: ${product.productId} - ${product.name}` );
          this.productService.setChanges(true);
        }
      );
    } else {
      alert('El Formulario no se encuentra valido.');
    }
  }

  onChangeTypeOfProduct(): void {
    console.log(this.form.get('typeOfProduct').value);
  }

  listenerFieldTypeOfProduct(): void {
    this.suscribe$ = this.form.get('typeOfProduct').valueChanges.subscribe(
      (typeOfProduct: string) => {
        console.log('Executing lintener type of product: ', typeOfProduct);
      }
    );
  }

  ngOnDestroy(): void {
      this.suscribe$.unsubscribe();
  }
}
