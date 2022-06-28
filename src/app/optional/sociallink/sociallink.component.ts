import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-sociallink',
  templateUrl: './sociallink.component.html',
  styleUrls: ['./sociallink.component.css'],
})
export class SociallinkComponent implements OnInit {
  @Input() type: 'facebook' | 'twitter' | 'linkedin' | 'ninecircle';
  @Input() shareUrl: string;
  navUrl: string;

  constructor() { }

  ngOnInit() {
    this.createNavigationUrl();
  }

  private createNavigationUrl() {
    let searchParams = new URLSearchParams();

    switch (this.type) {
      case 'facebook':
        searchParams.set('url', this.shareUrl);
        this.navUrl =
          'https://www.facebook.com/sharer/sharer.php?' + searchParams;
        break;
      case 'twitter':
        searchParams.set('url', this.shareUrl);
        this.navUrl = 'https://twitter.com/share?' + searchParams;
        break;

      case 'linkedin':
        searchParams.set('url', this.shareUrl);
        this.navUrl = 'http://www.linkedin.com/shareArticle?' + searchParams;
        break;
      case 'ninecircle':
        break;
    }
  }

  share() {
    return window.open(this.navUrl, '_blank');
  }
}
