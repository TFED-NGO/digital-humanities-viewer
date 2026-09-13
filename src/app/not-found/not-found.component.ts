import { Component } from '@angular/core';
import { SiteEditionEntry } from '../models/site-config';
import { EditionContextService } from '../services/edition-context.service';

/** Shown for any URL that does not name a known edition. The address bar keeps the requested URL. */
@Component({
  selector: 'evt-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.scss'],
})
export class NotFoundComponent {
  requestedPath = typeof window !== 'undefined' ? window.location.pathname : '';
  editions: SiteEditionEntry[] = this.editionContext.editions;

  constructor(private editionContext: EditionContextService) {}

  href(entry: SiteEditionEntry): string {
    return this.editionContext.urlFor(entry);
  }

  trackBySlug(_index: number, item: SiteEditionEntry) {
    return item.slug;
  }
}
