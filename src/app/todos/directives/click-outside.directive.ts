import { Directive, ElementRef, Output, EventEmitter, HostListener, Input } from '@angular/core';
@Directive({
  selector: '[appClickOutside]'
})
export class ClickOutsideDirective {
  @Input()
  private skipClickElementWithClass: string[];
  @Input()
  private forceOnClickElementWithClass: string[];

  @Output()
  private appClickOutside = new EventEmitter();

  constructor(private elementRef: ElementRef) {}

  @HostListener('document:click', ['$event.target'])
  public onClick(targetElement) {
    const clickedInside = this.elementRef.nativeElement.contains(targetElement);
    if (this.elementIsForcedAsOutside(targetElement)) {
      return this.appClickOutside.emit(null);
    }
    if (!clickedInside && this.elementIsNotIgnored(targetElement)) {
      this.appClickOutside.emit(null);
    }
  }

  private elementIsNotIgnored(targetElement: HTMLElement) {
    if (!this.skipClickElementWithClass || !this.skipClickElementWithClass.length) {
      return true;
    }

    for (const ignoredClass of this.skipClickElementWithClass) {
      if (targetElement.classList.contains(ignoredClass)) {
        return false;
      }
    }

    return true;
  }

  private elementIsForcedAsOutside(targetElement: HTMLElement) {
    if (!this.forceOnClickElementWithClass || !this.forceOnClickElementWithClass.length) {
      return false;
    }

    for (const forcedClass of this.forceOnClickElementWithClass) {
      if (targetElement.classList.contains(forcedClass)) {
        return true;
      }
    }

    return false;
  }
}
