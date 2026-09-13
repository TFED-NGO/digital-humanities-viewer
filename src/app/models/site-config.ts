import { ViewModeId } from './evt-models';

/** Shape of `src/assets/editions.json`, the registry of editions served by this site. */
export interface SiteConfig {
  /** Slug whose configuration is loaded when the URL names no edition (e.g. the home page). */
  defaultEdition: string;
  editions: SiteEditionEntry[];
}

export interface SiteEditionEntry {
  /** URL segment, e.g. `oswald` → `/oswald/readingText`. Also the folder name under `assets/editions/`. */
  slug: string;
  /** Display name on the home page and in the header switcher. */
  label: string;
  /** Overrides `edition_config.json` → `defaultViewMode` when opening `/<slug>` with no view mode. */
  defaultViewMode?: ViewModeId;
}
