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

    it("should return true for shouldLabelFloat when value exists", () => {
      component.focused = false;
      component.value = "Europe/Paris";

      expect(component.shouldLabelFloat).toBe(true);
      expect(component.empty).toBe(false);
    });

    it("should return false for shouldLabelFloat when not focused and empty", () => {
      component.focused = false;
      component.value = undefined;

      expect(component.shouldLabelFloat).toBe(false);
      expect(component.empty).toBe(true);
    });
  });

  describe("dial code focus behavior", () => {
    it("should set isDialCodeFocused on focus", () => {
      component.isDialCodeFocused = false;

      component.onDialCodeFocus();

      expect(component.isDialCodeFocused).toBe(true);
    });

    it("should clear focused state in separated dial mode when phone input is not focused", () => {
      const stateChangesSpy = vi.spyOn(component.stateChanges, "next");
      component.separateDialCode = true;
      component.focused = true;
      component.isPhoneInputFocused = false;

      component.onDialCodeFocus();

      expect(component.focused).toBe(false);
      expect(stateChangesSpy).toHaveBeenCalled();
    });

    it("should not change focused state in non separated dial mode", () => {
      component.separateDialCode = false;
      component.focused = true;

      component.onDialCodeFocus();

      expect(component.focused).toBe(true);
    });

    it("should clear dial code focus on blur", () => {
      component.isDialCodeFocused = true;

      component.onDialCodeBlur();

      expect(component.isDialCodeFocused).toBe(false);
    });

    it("should keep focused state on blur in separated mode when phone input is focused", () => {
      const stateChangesSpy = vi.spyOn(component.stateChanges, "next");
      component.separateDialCode = true;
      component.focused = true;
      component.isPhoneInputFocused = true;

      component.onDialCodeBlur();

      expect(component.focused).toBe(true);
      expect(stateChangesSpy).toHaveBeenCalled();
    });

    it("should clear focused state on blur in separated mode when phone input is not focused", () => {
      component.separateDialCode = true;
      component.focused = true;
      component.isPhoneInputFocused = false;

      component.onDialCodeBlur();

      expect(component.focused).toBe(false);
    });
  });

  describe("template rendering", () => {
    it("should render the input element", () => {
      const input = fixture.nativeElement.querySelector("input");

      expect(input).toBeTruthy();
      expect(input.type).toBe("text");
    });

    it("should bind placeholder value", () => {
      component.placeholder = "Select timezone";
      fixture.detectChanges();

      const input = fixture.nativeElement.querySelector("input");

      expect(input.placeholder).toBe("Select timezone");
    });
  });

  describe("ControlValueAccessor integration", () => {
    it("should register and call onChange callback", () => {
      const mockCallback = vi.fn();
      component.registerOnChange(mockCallback);
      component.value = "UTC";

      component.onValueChange();

      expect(mockCallback).toHaveBeenCalledWith("UTC");
    });

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
    });

    it("should reset propagated value to null", () => {
      const changeSpy = vi.fn();
      component.registerOnChange(changeSpy);

      component.reset();

      expect(changeSpy).toHaveBeenCalledWith(null);
    });
  });

  describe("container interaction", () => {
    it("should focus input when container is clicked outside input", () => {
      const input: HTMLInputElement = fixture.nativeElement.querySelector("input");
      const focusSpy = vi.spyOn(input, "focus");
      const clickEvent = {
        target: document.createElement("div"),
      } as unknown as MouseEvent;

      component.onContainerClick(clickEvent);

      expect(focusSpy).toHaveBeenCalled();
    });

    it("should not focus input when input is clicked", () => {
      const input: HTMLInputElement = fixture.nativeElement.querySelector("input");
      const focusSpy = vi.spyOn(input, "focus");
      const clickEvent = {
        target: input,
      } as unknown as MouseEvent;

      component.onContainerClick(clickEvent);

      expect(focusSpy).not.toHaveBeenCalled();
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
