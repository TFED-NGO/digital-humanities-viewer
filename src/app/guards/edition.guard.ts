import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, UrlTree } from '@angular/router';
import { EditionContextService } from '../services/edition-context.service';

/**
 * Guards `/:edition/...`. The configuration for the active edition was loaded at bootstrap, so the only
 * slug this page load can render is the active one. Any other valid slug triggers a full document
 * navigation (which reloads with that edition's configuration); an unknown slug goes to the home page.
 */
@Injectable({ providedIn: 'root' })
export class EditionGuard implements CanActivate {
  constructor(
    private editionContext: EditionContextService,
    private router: Router,
  ) {}

  canActivate(route: ActivatedRouteSnapshot): boolean | UrlTree {
    const slug = route.paramMap.get('edition');
    if (slug === this.editionContext.activeSlug) {
      return true;
    }
    const other = this.editionContext.getEdition(slug);
    if (other) {
      window.location.assign(this.editionContext.urlFor(other, route.firstChild?.routeConfig?.path || undefined));

      return false;
    }

    return this.router.createUrlTree(['/']);
  }
}
