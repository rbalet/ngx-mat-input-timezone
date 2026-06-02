import { AfterViewInit, Component } from "@angular/core";
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatDividerModule } from "@angular/material/divider";
import { MatFormFieldModule } from "@angular/material/form-field";
import { ngxMatInputTimezoneComponent } from "projects/ngx-mat-input-timezone/src/lib/ngx-mat-input-timezone";

@Component({
  selector: "ngx-root",
  templateUrl: "./app.html",
  styleUrls: ["./app.scss"],
  imports: [
    // Forms
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,

    // Components
    ngxMatInputTimezoneComponent,

    // Mat
    MatButtonModule,
    MatDividerModule,
  ],
})
export class AppComponent implements AfterViewInit {
  form = new FormGroup({
    timezone: new FormControl("", [Validators.required]),
  });

  onSubmit() {
    this.form.markAllAsTouched();
  }

  onReset() {
    this.form.reset();
  }

  ngAfterViewInit() {
    this.form.valueChanges.subscribe((value) => {
      console.log("form.valueChanges", value);
    });
  }
}
