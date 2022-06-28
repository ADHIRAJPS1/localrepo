import { Renderer2, OnInit, Inject, Component } from '@angular/core';
import { DOCUMENT } from '@angular/common';
@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.css']
})
export class FaqComponent implements OnInit {

  constructor(
    private _renderer2: Renderer2,
    @Inject(DOCUMENT) private _document: Document
) { }

public ngOnInit() {

    let scriptfaq = this._renderer2.createElement('script');
    scriptfaq.type = `application/ld+json`;
    scriptfaq.text = `
        {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [{
              "@type": "Question",
              "name": "How will PGC Support My Treatment",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "We are partnered with Milaap, a crowdsourcing platform. If the partner is not able to support due to unavoidable reasons, we fundraise on our platform. Initial verification process is done and the treatment is initiated with partner hospitals."
              }
            },{
              "@type": "Question",
              "name": "How do i get in touch with PGC for medical support.",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Call our toll-free number 18003094055, OR drop us a mail, OR connect over social media handles with all the information and our team will connect with you directly."
              }
            }]
        }
    `;

    this._renderer2.appendChild(this._document.body, scriptfaq);
}

}
