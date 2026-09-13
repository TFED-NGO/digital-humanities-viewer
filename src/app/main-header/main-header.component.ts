import { Component } from '@angular/core';
import { combineLatest, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { AppConfig, EditionConfig } from '../app.config';
import { ViewMode } from '../models/evt-models';
import { SiteEditionEntry } from '../models/site-config';
import { EditionContextService } from '../services/edition-context.service';
import { EVTModelService } from '../services/evt-model.service';
import { EVTStatusService } from '../services/evt-status.service';
import { ThemesService } from '../services/themes.service';
import { EVTBtnClickEvent } from '../ui-components/button/button.component';
import { normalizeUrl } from '../utils/js-utils';

@Component({
  selector: 'evt-main-header',
  templateUrl: './main-header.component.html',
  styleUrls: ['./main-header.component.scss'],
})
export class MainHeaderComponent {
  public title$ = combineLatest([
    of(AppConfig?.evtSettings?.edition?.editionTitle),
    this.evtModelService.title$,
  ]).pipe(
    map(([configTitle, editionTitle]) => configTitle ?? editionTitle ?? 'defaultTitle'),
  );

  public viewModes: ViewMode[] = AppConfig.evtSettings.ui.availableViewModes?.filter(((e) => e.enable)) ?? [];
  public currentViewMode$ = this.evtStatusService.currentViewMode$;
  public mainMenuOpened = false;
  public editions: SiteEditionEntry[] = this.editionContext.editions;
  public activeEditionSlug = this.editionContext.activeSlug;
  public editionConfig: EditionConfig = AppConfig.evtSettings.edition;
  get editionHome() { return normalizeUrl(this.editionConfig.editionHome); }

  get logoUrl() {
    return AppConfig?.evtSettings?.files?.logoUrl ?? 'assets/images/logo_white.png';
  }

  constructor(
    public themes: ThemesService,
    private evtModelService: EVTModelService,
    private evtStatusService: EVTStatusService,
    private editionContext: EditionContextService,
  ) {
  }

  /** Full page load: the new edition's configuration must be loaded before anything renders. */
  switchEdition(slug: string) {
    const entry = this.editionContext.getEdition(slug);
    if (entry && slug !== this.activeEditionSlug) {
      const view = this.evtStatusService.updateViewMode$.getValue()?.id;
      window.location.assign(this.editionContext.urlFor(entry, view));
    }
  }

  trackEditions(_index: number, item: SiteEditionEntry) {
    return item.slug;
  }

  selectViewMode(viewMode: ViewMode) {
    this.evtStatusService.updateViewMode$.next(viewMode);
  }

  toggleMainMenu(clickEvent: EVTBtnClickEvent) {
    clickEvent.event.stopPropagation();
    this.mainMenuOpened = !this.mainMenuOpened;
  }

  handleItemClicked(itemClicked: string) {
    if (itemClicked) {
      this.mainMenuOpened = (itemClicked === 'theme' || itemClicked === 'language');
    }
  }

  // tslint:disable-next-line: variable-name
  trackViewModes(_index: number, item: ViewMode) {
    return item.id;
  }

  /** Site root (table of contents). A plain href, so the page reloads without any edition open. */
  get tocUrl() {
    return document.baseURI;
  }

}
