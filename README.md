# ngx-mat-input-timezone

Angular Material timezone picker component with searchable dialog selection and reactive forms support.

[![npm version](https://img.shields.io/npm/v/ngx-mat-input-timezone.svg)](https://www.npmjs.com/package/ngx-mat-input-timezone)
![NPM](https://img.shields.io/npm/l/ngx-mat-input-timezone)
![npm bundle size](https://img.shields.io/bundlephobia/min/ngx-mat-input-timezone)
![npm](https://img.shields.io/npm/dm/ngx-mat-input-timezone)

<!-- <p align="center" style="display: flex; gap: 16px; justify-content: center; flex-wrap: wrap;">
  <img src="https://raw.githubusercontent.com/rbalet/ngx-mat-input-timezone/main/example-1.png" />
</p> -->

## Demo

- https://stackblitz.com/~/github.com/rbalet/ngx-mat-input-timezone

## Features

- Dialog-based timezone selector integrated with Angular Material
- Search by country, timezone name, IANA id, or UTC offset
- Optional UTC offset display in list and selected label
- Optional automatic timezone guess from browser (`Intl.DateTimeFormat`)
- Works with Angular reactive forms via `ControlValueAccessor`

## Installation

```bash
npm i ngx-mat-input-timezone@latest
```

## Usage

### Standalone import

```ts
import { Component } from "@angular/core";
import { FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { ngxMatInputTimezoneComponent } from "ngx-mat-input-timezone";

@Component({
  selector: "app-root",
  templateUrl: "./app.html",
  imports: [ReactiveFormsModule, MatFormFieldModule, ngxMatInputTimezoneComponent],
})
export class AppComponent {
  form = new FormGroup({
    timezone: new FormControl(""),
  });
}
```

### Template example

```html
<form [formGroup]="form">
  <mat-form-field>
    <ngx-mat-input-timezone
      formControlName="timezone"
      placeholder="Select timezone"
      ariaLabel="Select timezone"
      enableSearch
      showOffset
    ></ngx-mat-input-timezone>
  </mat-form-field>
</form>
```

Selected value is an IANA timezone string (for example: `Europe/Paris`, `America/New_York`).

## Inputs

| Input               | Type                | Default           | Description                                                |
| ------------------- | ------------------- | ----------------- | ---------------------------------------------------------- |
| `ariaLabel`         | `string`            | `Select timezone` | Dialog title and selector aria label                       |
| `autocomplete`      | `off \| tel`        | `off`             | Kept for API compatibility                                 |
| `cssClass`          | `string`            | `undefined`       | Kept for API compatibility                                 |
| `errorStateMatcher` | `ErrorStateMatcher` | Angular default   | Custom Material error matcher                              |
| `maxLength`         | `string \| number`  | `15`              | Kept for API compatibility                                 |
| `name`              | `string`            | `undefined`       | Kept for API compatibility                                 |
| `placeholder`       | `string`            | `""`              | Text shown when no timezone selected                       |
| `guess`             | `boolean`           | `true`            | Auto-select browser timezone on init when control is empty |
| `showOffset`        | `boolean`           | `true`            | Show UTC offset in dialog and selected label               |
| `offsetName`        | `string`            | `UTC`             | Prefix used for offset display (for example `UTC+02:00`)   |
| `enableSearch`      | `boolean`           | `false`           | Show search field in dialog                                |
| `searchPlaceholder` | `string`            | `Search`          | Search field placeholder                                   |
| `noResultsLabel`    | `string`            | `No results`      | Label shown when no timezone matches                       |
| `required`          | `boolean`           | `false`           | Material form-field required state                         |
| `disabled`          | `boolean`           | `false`           | Disable selector interaction                               |
| `resetOnChange`     | `boolean`           | `false`           | Kept for API compatibility                                 |
| `separateDialCode`  | `boolean`           | `false`           | Kept for API compatibility                                 |
| `hideAreaCodes`     | `boolean`           | `false`           | Kept for API compatibility                                 |

## Outputs

No custom outputs are currently exposed.

Use your form control value changes:

```ts
this.form.get("timezone")?.valueChanges.subscribe((timezone) => {
  console.log(timezone);
});
```

## Styling notes

The selector opens a Material dialog and includes:

- Search field (optional)
- Grouped timezone list
- Highlight for currently selected timezone

You can override styles in your app by targeting the component classes in:

- `.timezone-select-dialog`
- `.timezone-list-item`
- `.timezone-name.selected`

## Contributing

- Fork repo
- Go to `projects/ngx-mat-input-timezone`
- Update `src/lib`
- Update `README.md`
- Open a pull request

## Helpful commands

- Build lib: `npm run build`
- Test: `npm run test`
- Lint: `npm run lint`

## License

MIT
