/// <reference types="vitest/globals" />
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";

import {
  NgxMatInputTimezoneDialog,
  NgxMatInputTimezoneDialogData,
} from "./ngx-mat-input-timezone.dialog";

describe("NgxMatInputTimezoneDialog", () => {
  let component: NgxMatInputTimezoneDialog;
  let fixture: ComponentFixture<NgxMatInputTimezoneDialog>;

  const dialogData: NgxMatInputTimezoneDialogData = {
    ariaLabel: "Select timezone",
    enableSearch: true,
    searchPlaceholder: "Search",
    noResultsLabel: "No results",
    showOffset: true,
    offsetName: "UTC",
    selectedTimezone: null,
    timezoneGroups: [
      {
        country: "Djibouti",
        iso: "DJ",
        showGroup: true,
        zones: [
          { zone: "Africa/Nairobi", name: "Nairobi", offset: "+03:00" },
          { zone: "Africa/Djibouti", name: "Djibouti", offset: "+03:00" },
        ],
      },
      {
        country: "Kenya",
        iso: "KE",
        showGroup: false,
        zones: [{ zone: "Africa/Nairobi", name: "Kenya", offset: "+03:00" }],
      },
      {
        country: "Uganda",
        iso: "UG",
        showGroup: false,
        zones: [{ zone: "Africa/Nairobi", name: "Uganda", offset: "+03:00" }],
      },
    ],
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgxMatInputTimezoneDialog],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: dialogData },
        { provide: MatDialogRef, useValue: { close: () => {} } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(NgxMatInputTimezoneDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should return each matching timezone zone only once in search results", () => {
    component.searchControl.setValue("nairobi");
    fixture.detectChanges();

    const matchingZones = component.filteredTimezoneGroups.flatMap((group) => group.zones);

    expect(matchingZones.filter((zone) => zone.zone === "Africa/Nairobi")).toHaveLength(1);
  });
});
