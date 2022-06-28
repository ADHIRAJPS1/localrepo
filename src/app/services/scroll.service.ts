import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class ScrollService {
  constructor(
    private router: Router,
    @Inject(DOCUMENT) private dom
  ) {}

  scrollTo(path: string) {
    const { url, elementId } = this.__getUrlAndElementId(path);
    if (url) {
      this.router.navigate([url]);
      if (elementId) {
        this.scrollToElementById(elementId);
      }
    }
  }

  private __getUrlAndElementId(path: string) {
    const splits = path.split('#');
    return {
      url: splits[0],
      elementId: splits[1],
    };
  }

  scrollToElementById(id: string) {
    const element = this.__getElementById(id);
    this.scrollToElement(element);
  }

  private __getElementById(id: string): HTMLElement {
    const element = this.dom.querySelector(`#${id}`);
    return element;
  }

  scrollToElement(element: HTMLElement) {
    element.scrollIntoView({ behavior: 'smooth' });
  }
}
