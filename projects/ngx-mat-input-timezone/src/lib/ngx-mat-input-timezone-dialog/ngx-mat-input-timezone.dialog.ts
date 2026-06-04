import { Component, Inject, OnInit } from "@angular/core";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { MatIconButton } from "@angular/material/button";
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatListModule } from "@angular/material/list";
import { startWith } from "rxjs";

export interface TimezoneGroup {
  country: string;
  iso: string;
  showGroup?: boolean;
  zones: { zone: string; name: string; offset: string }[];
}

export interface NgxMatInputTimezoneDialogData {
  ariaLabel: string;
  enableSearch: boolean;
  searchPlaceholder: string;
  noResultsLabel: string;
  showOffset: boolean;
  offsetName: string;
  selectedTimezone: string | null;
  timezoneGroups: TimezoneGroup[];
}

@Component({
  selector: "ngx-mat-input-timezone-dialog",
  templateUrl: "./ngx-mat-input-timezone.dialog.html",
  styleUrls: ["./ngx-mat-input-timezone.dialog.scss"],
  imports: [
    // Forms
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,

    // Mat
    MatDialogModule,
    MatIconButton,
    MatIconModule,
    MatListModule,
  ],
})
export class NgxMatInputTimezoneDialog implements OnInit {
  searchControl = new FormControl("");
  filteredTimezoneGroups: TimezoneGroup[] = [];

  constructor(
    public dialogRef: MatDialogRef<NgxMatInputTimezoneDialog, string>,
    @Inject(MAT_DIALOG_DATA) public data: NgxMatInputTimezoneDialogData,
  ) {}

  get ariaLabel(): string {
    return this.data.ariaLabel;
  }

  get enableSearch(): boolean {
    return this.data.enableSearch;
  }

  get searchPlaceholder(): string {
    return this.data.searchPlaceholder;
  }

  get noResultsLabel(): string {
    return this.data.noResultsLabel;
  }

  get showOffset(): boolean {
    return this.data.showOffset;
  }

  ngOnInit(): void {
    this.searchControl.valueChanges
      .pipe(startWith(""))
      .subscribe((query) => (this.filteredTimezoneGroups = this.filter(query || "")));

    this.filteredTimezoneGroups = this.data.timezoneGroups.slice();
  }

  onTimezoneSelect(zone: string): void {
    this.dialogRef.close(zone);
  }

  isSelected(zone: string): boolean {
    return this.data.selectedTimezone === zone;
  }

  formatOffset(offset: string): string {
    return `${this.data.offsetName}${offset}`;
  }

  private filter(query: string): TimezoneGroup[] {
    const result: TimezoneGroup[] = [];
    const normalizedQuery = query.toLowerCase();
    const seenZones = new Set<string>();

    for (const timezoneGroup of this.data.timezoneGroups) {
      if (!normalizedQuery) {
        result.push({
          ...timezoneGroup,
          zones: [...timezoneGroup.zones],
          showGroup: timezoneGroup.zones.length > 1,
        });
      } else {
        const matchedZones = timezoneGroup.country.toLowerCase().includes(normalizedQuery)
          ? timezoneGroup.zones
          : timezoneGroup.zones.filter((zone) => {
              return (
                zone.name.toLowerCase().includes(normalizedQuery) ||
                zone.zone.toLowerCase().includes(normalizedQuery) ||
                zone.offset.includes(normalizedQuery)
              );
            });

        const zones = matchedZones.filter((zone) => {
          if (seenZones.has(zone.zone)) {
            return false;
          }
          seenZones.add(zone.zone);
          return true;
        });

        if (zones.length > 0) {
          result.push({ ...timezoneGroup, zones, showGroup: zones.length > 1 });
        }
      }
    }

    return result;
  }
}
