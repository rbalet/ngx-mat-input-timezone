import { FocusMonitor } from "@angular/cdk/a11y";
import { coerceBooleanProperty } from "@angular/cdk/coercion";
import {
  booleanAttribute,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DoCheck,
  ElementRef,
  HostBinding,
  Input,
  OnDestroy,
  OnInit,
  Optional,
  Self,
} from "@angular/core";
import {
  FormControl,
  FormGroupDirective,
  FormsModule,
  NgControl,
  NgForm,
  ReactiveFormsModule,
} from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { ErrorStateMatcher, MatRippleModule } from "@angular/material/core";
import { MatDialog, MatDialogModule } from "@angular/material/dialog";
import { MatFormFieldControl } from "@angular/material/form-field";
import { Subject } from "rxjs";
import {
  NgxMatInputTimezoneDialog,
  NgxMatInputTimezoneDialogData,
} from "./ngx-mat-input-timezone-dialog/ngx-mat-input-timezone.dialog";
import { countryZones } from "./ngx-mat-input-timezone.data";

interface TimezoneGroup {
  country: string;
  iso: string;
  showGroup?: boolean;
  zones: { zone: string; name: string; offset: string }[];
}

class ngxMatInputTimezoneBase {
  constructor(
    public _defaultErrorStateMatcher: ErrorStateMatcher,
    public _parentForm: NgForm,
    public _parentFormGroup: FormGroupDirective,
    public ngControl: NgControl,
  ) {}
}

@Component({
  selector: "ngx-mat-input-timezone",
  templateUrl: "./ngx-mat-input-timezone.html",
  styleUrl: "./ngx-mat-input-timezone.scss",
  providers: [{ provide: MatFormFieldControl, useExisting: ngxMatInputTimezoneComponent }],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    // Forms
    FormsModule,
    ReactiveFormsModule,

    // Mat
    MatButtonModule,
    MatDialogModule,
    MatRippleModule,
  ],
})
export class ngxMatInputTimezoneComponent
  extends ngxMatInputTimezoneBase
  implements OnInit, DoCheck, OnDestroy
{
  timezoneGroups!: TimezoneGroup[];
  selectedTimezoneLabel = "";

  static nextId = 0;

  @HostBinding()
  id = `ngx-mat-input-timezone-${ngxMatInputTimezoneComponent.nextId++}`;
  @HostBinding("class.ngx-floating")
  get shouldLabelFloat(): boolean {
    return this.focused || !this.empty;
  }

  @Input() autocomplete: "off" | "tel" = "off";
  @Input() ariaLabel = "Select timezone";
  @Input() cssClass?: string;
  @Input() errorStateMatcher: ErrorStateMatcher = this._defaultErrorStateMatcher;
  @Input() maxLength: string | number = 15;
  @Input() name?: string;
  @Input() placeholder = "";

  // Timezone options
  @Input() guess = true;
  @Input() showOffset = true;
  @Input() offsetName = "UTC";

  // Search options
  @Input() searchPlaceholder = "Search";
  @Input() noResultsLabel = "No results";

  @Input({ transform: booleanAttribute }) enableSearch = false;
  @Input({ transform: booleanAttribute }) resetOnChange = false;
  @Input({ transform: booleanAttribute }) separateDialCode = false;
  @Input({ transform: booleanAttribute }) hideAreaCodes = false;

  private _required = false;
  @Input({ transform: booleanAttribute })
  set required(value: boolean) {
    this._required = coerceBooleanProperty(value);
    this.stateChanges.next(undefined);
  }
  get required(): boolean {
    return this._required;
  }

  private _disabled = false;
  @Input({ transform: booleanAttribute })
  set disabled(value: boolean) {
    this._disabled = coerceBooleanProperty(value);
    this.stateChanges.next(undefined);
  }
  get disabled(): boolean {
    return this._disabled;
  }

  get empty(): boolean {
    return !this.value;
  }

  stateChanges = new Subject<void>();
  focused = false;
  describedBy = "";
  isDialCodeFocused = false;
  isPhoneInputFocused = false;
  value?: string;

  onTouched = () => {};
  propagateChange = (_: any) => {};

  private errorState?: boolean;

  constructor(
    private _changeDetectorRef: ChangeDetectorRef,
    private _focusMonitor: FocusMonitor,
    private _elementRef: ElementRef<HTMLElement>,
    private _dialog: MatDialog,
    @Optional() @Self() _ngControl: NgControl,
    @Optional() _parentForm: NgForm,
    @Optional() _parentFormGroup: FormGroupDirective,
    _defaultErrorStateMatcher: ErrorStateMatcher,
  ) {
    super(_defaultErrorStateMatcher, _parentForm, _parentFormGroup, _ngControl);

    _focusMonitor.monitor(_elementRef, true).subscribe((origin: any) => {
      if (this.focused && !origin) {
        this.onTouched();
      }
      this.focused = !!origin;
      this.stateChanges.next();
    });

    if (this.ngControl != null) {
      this.ngControl.valueAccessor = this;
    }
  }

  ngOnInit() {
    this._init();

    this._changeDetectorRef.markForCheck();
    this.stateChanges.next();
  }

  ngOnDestroy() {
    this.stateChanges.complete();
    this._focusMonitor.stopMonitoring(this._elementRef);
  }

  ngDoCheck(): void {
    if (this.ngControl) {
      const oldState = this.errorState;
      const newState = this.errorStateMatcher.isErrorState(
        this.ngControl.control,
        this._parentForm,
      );

      this.errorState =
        (newState && (!this.ngControl.control?.value || this.ngControl.control?.touched)) ||
        (!this.focused ? newState : false);

      if (oldState !== newState) {
        this.errorState = newState;
        this.stateChanges.next();
      }
    }
  }

  openTimezoneDialog(): void {
    if (this.disabled) {
      return;
    }

    const dialogData: NgxMatInputTimezoneDialogData = {
      ariaLabel: this.ariaLabel,
      enableSearch: this.enableSearch,
      searchPlaceholder: this.searchPlaceholder,
      noResultsLabel: this.noResultsLabel,
      showOffset: this.showOffset,
      offsetName: this.offsetName,
      timezoneGroups: this.timezoneGroups,
    };

    const dialogRef = this._dialog.open<
      NgxMatInputTimezoneDialog,
      NgxMatInputTimezoneDialogData,
      string
    >(NgxMatInputTimezoneDialog, {
      width: "480px",
      maxWidth: "90vw",
      maxHeight: "80vh",
      autoFocus: this.enableSearch ? "dialog" : "first-tabbable",
      restoreFocus: true,
      data: dialogData,
    });

    dialogRef.afterClosed().subscribe((selectedTimezone) => {
      if (selectedTimezone) {
        this.onTimezoneSelect(selectedTimezone);
      }
    });
  }

  onTimezoneSelect(zone: string): void {
    this.writeValue(zone);
    this.propagateChange(zone);
    this.onTouched();
  }

  updateErrorState() {
    if (
      this.ngControl &&
      this.ngControl.invalid &&
      (this.ngControl.touched || (this._parentForm && this._parentForm.submitted))
    ) {
      const currentState = this.errorStateMatcher.isErrorState(
        this.ngControl.control as FormControl,
        this.ngControl?.value,
      );
      if (currentState !== this.errorState) {
        this.errorState = currentState;
        this._changeDetectorRef.markForCheck();
      }
    }
  }

  public onDialCodeFocus(): void {
    this.isDialCodeFocused = true;
    if (this.separateDialCode && !this.isPhoneInputFocused) {
      this.focused = false;
      this.stateChanges.next();
    }
  }

  public onDialCodeBlur(): void {
    this.isDialCodeFocused = false;
    if (this.separateDialCode) {
      if (!this.isPhoneInputFocused) {
        this.focused = false;
      }
      this.stateChanges.next();
    }
  }

  onValueChange(): void {
    this.propagateChange(this.value);
    this._changeDetectorRef.markForCheck();
  }

  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
    this._changeDetectorRef.markForCheck();
    this.stateChanges.next(undefined);
  }

  writeValue(value: any): void {
    this.value = value;
    this.selectedTimezoneLabel = this.getTimezoneDisplayLabel(value);
    this._changeDetectorRef.markForCheck();
    this.stateChanges.next(undefined);
  }

  setDescribedByIds(ids: string[]) {
    this.describedBy = ids.join(" ");
  }

  onContainerClick(event: MouseEvent): void {
    if ((event.target as Element).tagName.toLowerCase() !== "button") {
      this.openTimezoneDialog();
    }
  }

  reset() {
    this.value = undefined;
    this.selectedTimezoneLabel = "";
    this.propagateChange(null);

    this._changeDetectorRef.markForCheck();
    this.stateChanges.next(undefined);
  }

  private _init() {
    this._initData();

    if (!this.ngControl?.control?.value && this.guess) {
      this.guessedTimezone();
      this._changeDetectorRef.detectChanges();
    } else {
      this.value = this.ngControl?.control?.value;
      this.selectedTimezoneLabel = this.getTimezoneDisplayLabel(this.value || "");
    }
  }

  private _initData(): void {
    this.timezoneGroups = Object.keys(countryZones).map((iso: string) => {
      const val = countryZones[iso];
      const hasMultiple = val.zones.length > 1;
      const zones = val.zones.map((x) => {
        return hasMultiple
          ? {
              zone: x,
              name: `${this.formatTimezoneString(x)}`,
              offset: this.offsetOfTimezone(x),
            }
          : {
              zone: x,
              name: val.name,
              offset: this.offsetOfTimezone(x),
            };
      });
      return { iso, country: val.name, zones, showGroup: zones.length > 1 };
    });
  }

  formatTimezoneString(zone: string): string {
    const arr = zone.split("/");
    return arr[arr.length - 1].split("_").join(" ");
  }

  offsetOfTimezone(zone: string): string {
    const offset = this.timezoneOffsetMinutes(zone);
    const neg = offset < 0;
    const absoluteOffset = Math.abs(offset);
    const hours = Math.floor(absoluteOffset / 60);
    const minutes = absoluteOffset % 60;

    return `${neg ? "-" : "+"}${this.rjust(hours.toString(), 2)}:${this.rjust(
      minutes.toString(),
      2,
    )}`;
  }

  private timezoneOffsetMinutes(zone: string, date = new Date()): number {
    const formatter = new Intl.DateTimeFormat("en-US", {
      timeZone: zone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hourCycle: "h23",
    });

    const parts = formatter.formatToParts(date);
    const values = Object.fromEntries(
      parts
        .filter((part) => part.type !== "literal")
        .map((part) => [part.type, Number(part.value)]),
    );

    const zonedAsUtc = Date.UTC(
      values.year,
      values.month - 1,
      values.day,
      values.hour,
      values.minute,
      values.second,
    );

    return Math.round((zonedAsUtc - date.getTime()) / 60000);
  }

  formatOffset(offset: string): string {
    return `(${this.offsetName}${offset})`;
  }

  guessedTimezone(): void {
    const zone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    this.writeValue(zone);
    this.propagateChange(zone);
  }

  getTimezoneDisplayLabel(zone: string): string {
    if (!zone) {
      return "";
    }

    for (const group of this.timezoneGroups ?? []) {
      const timezone = group.zones.find((item) => item.zone === zone);
      if (timezone) {
        return `${timezone.name} ${this.showOffset ? this.formatOffset(timezone.offset) : ""}`.trim();
      }
    }

    return zone;
  }

  private rjust(value: string, width: number, padding = "0"): string {
    padding = padding || " ";
    padding = padding.substr(0, 1);
    if (value.length < width) {
      return padding.repeat(width - value.length) + value;
    } else {
      return value;
    }
  }
}
