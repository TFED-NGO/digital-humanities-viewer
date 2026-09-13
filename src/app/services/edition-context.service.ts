import { Injectable } from '@angular/core';
import { SiteConfig, SiteEditionEntry } from '../models/site-config';

/**
 * Knows which editions exist (from `assets/editions.json`) and which one this page load is showing.
 *
 * The active edition is chosen once, at bootstrap, from the first URL segment. All EVT configuration
 * (`AppConfig.evtSettings`) is loaded for that edition before the app starts, so every parser, service
 * and component sees one consistent configuration for the lifetime of the page. Switching edition is
 * therefore a full document navigation (see `urlFor`), never an in-app route change.
 */
@Injectable({ providedIn: 'root' })
export class EditionContextService {
  private siteConfig: SiteConfig = { defaultEdition: '', editions: [] };
  private active: SiteEditionEntry | null = null;

  get editions(): SiteEditionEntry[] {
    return this.siteConfig.editions;
  }

  /** The edition this page load is showing, or null on the home page. */
  get activeEdition(): SiteEditionEntry | null {
    return this.active;
  }

  get activeSlug(): string | null {
    return this.active?.slug ?? null;
  }

  get defaultEdition(): SiteEditionEntry | undefined {
    return this.getEdition(this.siteConfig.defaultEdition) ?? this.editions[0];
  }

  init(siteConfig: SiteConfig, requestedSlug: string | null): void {
    this.siteConfig = siteConfig;
    this.active = requestedSlug ? this.getEdition(requestedSlug) ?? null : null;
  }

  getEdition(slug: string | null | undefined): SiteEditionEntry | undefined {
    return slug ? this.editions.find((e) => e.slug === slug) : undefined;
  }

  isValidSlug(slug: string | null | undefined): boolean {
    return !!this.getEdition(slug);
  }

  fileConfigUrl(entry: SiteEditionEntry): string {
    return `assets/editions/${entry.slug}/file_config.json`;
  }

  /**
   * Absolute URL for an edition, honouring `<base href>` so it works at `/` and under a sub-path.
   * Use this (with a plain `href` or `window.location.assign`) to move between editions.
   */
  urlFor(entry: SiteEditionEntry, viewMode?: string): string {
    const view = viewMode ?? entry.defaultViewMode ?? '';
    return new URL(`${entry.slug}${view ? '/' + view : ''}`, document.baseURI).toString();
  }

  /** First path segment of the current location, relative to `<base href>`. */
  static slugFromLocation(): string | null {
    if (typeof window === 'undefined') { return null; }
    const base = new URL(document.baseURI).pathname.replace(/\/$/, '');
    let path = window.location.pathname;
    if (base && path.startsWith(base)) {
      path = path.slice(base.length);
    }
    const first = path.split('/').filter((s) => s.length > 0)[0];

    return first ? decodeURIComponent(first) : null;
  }
}
