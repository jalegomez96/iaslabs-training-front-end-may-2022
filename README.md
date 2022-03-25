# ActividadDosAngular

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 10.2.0.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.

#### Requerimientos

1. consumir el servicio "DiscountService" con el metodo "getAllDiscount" para obtener si el tipo de producto seleccionado por el usuario tiene descuento.

Si dicho producto tiene descuento, se deberá de colocar un campo bloqueado en el formulario que muestre el valor, además, se deberá guardar dicha información y mostrarla en la tabla con su porcentaje de descuento y el valor total que quedaría al aplicarle el descuento.
	
si dicho producto no tiene descuento, el campo no deberá de aparecer
### conclusión: 
datos nuesvo en el form: discount value = number - discount apply (marcar si tiene, desmarcar si no tiene) - (ambos campos bloqueados)
  datos nuevos en la tabla: discount - total value.
(cómo es posible que estos valores vayan a quedar vacios por que el tipo de producto no tiene descuento, se deberá de dejar los valores con un "-" en la tabla.

#### ayudas:

consumir el servicio cuando se crea el componente "producto.component.ts" y cada vez que cambie  el tipo de producto(utilizando un "(onChange)" o el "changeValue" del reactiveForm), se deberá revisar si el producto tiene descuento en la lista consultada.

para mostar y no mostrar un campo, utilizar la directiva *ngIf=""

para asignar valores a un campo del formulario se realiza con la siguiente sintaxis: 
    si el formControlName es por ejemplo "discountApply"
    this.form.get('discountApply').setValue(true); //tomando true cómo el tipo de dato de discountApply


2. En el archivo "products.component.html" cambiar el "select" de la linea 14, para que las opciones mostradas sean a través del servicio de categorias (category-service)

#### Documentation about Rick and Morty Apo
https://rickandmortyapi.com/documentation
