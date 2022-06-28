import { Title, Meta, MetaDefinition } from '@angular/platform-browser';
import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Config } from '../services/config';

@Injectable({
  providedIn: 'root',
})
export class SeoService {
  constructor(
    private title: Title,
    private meta: Meta,
    private config: Config,
    @Inject(DOCUMENT) private dom
  ) {}

  loadHeaderScript(url: any) {
    let canURL = url == undefined ? this.dom.URL : url;
    let currentUrl = this.config.appUri + canURL;
    let scriptId = 'ID20220511';
    let scriptText =
      `{"context":"http:\/\/schema.org","@type":"WebSite","id":"#website","url":"` +
      currentUrl +
      `","name":"` +
      currentUrl +
      `","potentialAction":{"@type":"SearchAction","target":"` +
      currentUrl +
      `?s={search_term_string}","query-input":"required name=search_term_string"}}`;

    let scriptExist = this.dom.getElementById(scriptId);
    if (scriptExist) {
      scriptExist.remove();
      //scriptExist.setAttribute('text', scriptText);
    }
    let script = this.dom.createElement('script');
    script.id = scriptId;
    script.text = scriptText;
    script.type = 'application/ld+json';
    this.dom.getElementsByTagName('head')[0].appendChild(script);
  }

  updateTitle(title: string) {
    if (title && title.length) {
      this.title.setTitle(title);
    }
  }

  updateMetaTags(metaTags: MetaDefinition[]) {
    metaTags.forEach((m) => {
      this.meta.updateTag(m);
    });
  }

  updateMetaUrls(url?: string) {
    let canURL = url == undefined ? this.dom.URL : url;
    // nonwww
    this.dom
      .getElementById('canonicalNonWWW')
      .setAttribute('href', this.config.appUrlnonWWW + canURL);
    const head = this.dom.getElementsByTagName('head')[0];
    let canonical: HTMLLinkElement =
      this.dom.querySelector(`link[rel='canonical']`) || null;

    if (canonical == null) {
      canonical = this.dom.createElement('link') as HTMLLinkElement;
      head.appendChild(canonical);
    }
    canonical.setAttribute('rel', 'canonical');
    canonical.setAttribute('href', this.config.appUri + canURL);

    // shortlink
    let shortLink: HTMLLinkElement =
      this.dom.querySelector(`link[rel='shortlink']`) || null;

    if (shortLink == null) {
      shortLink = this.dom.createElement('link') as HTMLLinkElement;
      head.appendChild(shortLink);
    }

    shortLink.setAttribute('rel', 'shortlink');
    shortLink.setAttribute('href', this.config.appUri + canURL);

    this.meta.updateTag({
      property: 'og:url',
      content: this.config.appUri + canURL,
    }); // og:url
    this.meta.updateTag({
      name: 'twitter:url',
      content: this.config.appUri + canURL,
    }); // twitter:url
  }
}
