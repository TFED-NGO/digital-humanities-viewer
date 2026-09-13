import { Component } from '@angular/core';
import { SiteEditionEntry } from '../models/site-config';
import { EditionContextService } from '../services/edition-context.service';

/** Table of contents: one link per edition in `assets/editions.json`. */
@Component({
  selector: 'evt-edition-home',
  templateUrl: './edition-home.component.html',
  styleUrls: ['./edition-home.component.scss'],
})
export class EditionHomeComponent {
  editions: SiteEditionEntry[] = this.editionContext.editions;

  constructor(private editionContext: EditionContextService) {}

  /** Plain href (not routerLink): each edition needs its own configuration, loaded on a fresh page. */
  href(entry: SiteEditionEntry): string {
    return this.editionContext.urlFor(entry);
  }

  trackBySlug(_index: number, item: SiteEditionEntry) {
    return item.slug;
  }
}
