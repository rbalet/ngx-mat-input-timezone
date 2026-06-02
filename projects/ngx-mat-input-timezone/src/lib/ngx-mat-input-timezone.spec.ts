/// <reference types="vitest/globals" />
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { vi } from "vitest";

import { ngxMatInputTimezoneComponent } from "./ngx-mat-input-timezone";

describe("ngxMatInputTimezoneComponent", () => {
  let component: ngxMatInputTimezoneComponent;
  let fixture: ComponentFixture<ngxMatInputTimezoneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ngxMatInputTimezoneComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ngxMatInputTimezoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  describe("host binding getters", () => {
    it("should return true for shouldLabelFloat when focused", () => {
      component.focused = true;
      component.value = undefined;

      expect(component.shouldLabelFloat).toBe(true);
    });

    it("should return false for shouldLabelFloat when not focused and empty", () => {
      component.focused = false;
      component.value = undefined;

      expect(component.shouldLabelFloat).toBe(false);
      expect(component.empty).toBe(true);
    });
  });

  describe("template rendering", () => {
    it("should render timezone selector button", () => {
      const button = fixture.nativeElement.querySelector(".timezone-selector");

      expect(button).toBeTruthy();
    });

    it("should show placeholder when no timezone is selected", () => {
      const localFixture = TestBed.createComponent(ngxMatInputTimezoneComponent);
      const localComponent = localFixture.componentInstance;

      localComponent.guess = false;
      localComponent.placeholder = "Select timezone";
      localFixture.detectChanges();

      const button = localFixture.nativeElement.querySelector(".timezone-selector-label");

      expect(button.textContent.trim()).toBe("Select timezone");
    });
  });

  describe("dialog behavior", () => {
    it("should open timezone selector when enabled", () => {
      const dialogOpenSpy = vi.spyOn(component["_dialog"], "open");

      component.openTimezoneDialog();

      expect(dialogOpenSpy).toHaveBeenCalled();
    });

    it("should not open timezone selector when disabled", () => {
      component.setDisabledState(true);
      const dialogOpenSpy = vi.spyOn(component["_dialog"], "open");

      component.openTimezoneDialog();

      expect(dialogOpenSpy).not.toHaveBeenCalled();
    });

    it("should propagate value and close dialog on timezone selection", () => {
      const changeSpy = vi.fn();
      component.registerOnChange(changeSpy);

      component.onTimezoneSelect("Europe/Paris");

      expect(changeSpy).toHaveBeenCalledWith("Europe/Paris");
      expect(component.value).toBe("Europe/Paris");
    });
  });

  describe("ControlValueAccessor integration", () => {
    it("should register onTouched callback", () => {
      const mockCallback = vi.fn();
      component.registerOnTouched(mockCallback);

      expect(component.onTouched).toBe(mockCallback);
    });

    it("should set disabled state when setDisabledState is called with true", () => {
      component.setDisabledState(true);
      fixture.detectChanges();

      expect(component.disabled).toBe(true);
    });

    it("should clear disabled state when setDisabledState is called with false", () => {
      component.setDisabledState(true);
      fixture.detectChanges();
      component.setDisabledState(false);
      fixture.detectChanges();

      expect(component.disabled).toBe(false);
    });

    it("should mark for check when writeValue is called", () => {
      const markForCheckSpy = vi.spyOn(component["_changeDetectorRef"], "markForCheck");

      component.writeValue("Europe/Zurich");

      expect(markForCheckSpy).toHaveBeenCalled();
      expect(component.value).toBe("Europe/Zurich");
    });

    it("should reset propagated value to null", () => {
      const changeSpy = vi.fn();
      component.registerOnChange(changeSpy);

      component.reset();

      expect(changeSpy).toHaveBeenCalledWith(null);
    });
  });

  describe("container interaction", () => {
    it("should open selector when container is clicked outside button", () => {
      const openDialogSpy = vi.spyOn(component, "openTimezoneDialog");
      const clickEvent = {
        target: document.createElement("div"),
      } as unknown as MouseEvent;

      component.onContainerClick(clickEvent);

      expect(openDialogSpy).toHaveBeenCalled();
    });

    it("should not reopen selector when container click originates inside button", () => {
      const openDialogSpy = vi.spyOn(component, "openTimezoneDialog");
      const button = document.createElement("button");
      const label = document.createElement("span");
      button.appendChild(label);

      const clickEvent = {
        target: label,
      } as unknown as MouseEvent;

      component.onContainerClick(clickEvent);

      expect(openDialogSpy).not.toHaveBeenCalled();
    });
  });

  describe("lifecycle", () => {
    it("should stop monitoring and complete state changes on destroy", () => {
      const stopMonitoringSpy = vi.spyOn(component["_focusMonitor"], "stopMonitoring");
      const completeSpy = vi.spyOn(component.stateChanges, "complete");

      component.ngOnDestroy();

      expect(stopMonitoringSpy).toHaveBeenCalled();
      expect(completeSpy).toHaveBeenCalled();
    });
  });
});
