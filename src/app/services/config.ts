import { Injectable } from '@angular/core';
import { AngularEditorConfig } from '@kolkov/angular-editor';

@Injectable({
  providedIn: 'root',
})
export class Config {
  constructor() {}

  public application = 'GlobalCure';
  public appDisplayName = 'Project Global Cure';
  public tagline = 'Providing Medical Access to the Poor';

  public appUri: string = 'https://www.projectglobalcure.org';
  public appUrlnonWWW: string = 'http://projectglobalcure.org';
  public baseUri: string = 'https://api.projectglobalcure.org';
  public apiKey: string = 'Service qrgUGrVfzKnl7dEAmwR6LLbprbuuqtzm';

  public contactEmail: string = 'connect@projectglobalcure.org';
  public hrEmail: string = 'hr@projectglobalcure.org';

  public isLoading: boolean = false; // Never edit this directly, call the functions

  /**
   * Show a loader
   */
  public showLoading() {
    this.isLoading = true;
  }

  /**
   * Dismiss loader
   */
  public dismissLoading() {
    this.isLoading = false;
  }

  public defaultError = {
    title: '',
    detail: 'Unexpected Error Occured! Please try again...',
  };

  public tokens = {
    auth: '',
    refresh: '',
    jwtid: '',
  };

  public editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '15rem',
    minHeight: '5rem',
    placeholder: 'Enter text here...',
    translate: 'no',
    defaultParagraphSeparator: 'p',
    defaultFontName: 'Arial',
    toolbarHiddenButtons: [['bold']],
    customClasses: [
      {
        name: 'quote',
        class: 'quote',
      },
      {
        name: 'redText',
        class: 'redText',
      },
      {
        name: 'titleText',
        class: 'titleText',
        tag: 'h1',
      },
    ],
  };
  public empCodeList = ['00000', 'CTL101', 'CTL102'];
  public statusList = [
    {
      value: 'draft',
      title: 'Draft',
      count: 0,
    },
    {
      value: 'hold',
      title: 'Disabled',
      count: 0,
    },
    /*{
      value: 'inreview',
      title: 'In Review',
      count: 0,
    },
    {
      value: 'pending',
      title: 'Pending',
      count: 0,
    },*/
    {
      value: 'published',
      title: 'Published',
      count: 0,
    },
    {
      value: 'completed',
      title: 'Completed',
      count: 0,
    },
    {
      value: 'deleted',
      title: 'Deleted',
      count: 0,
    },
  ];

  public summaryStringlimit: number = 100;
}
