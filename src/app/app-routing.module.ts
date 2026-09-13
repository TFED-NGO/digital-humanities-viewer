import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EditionDefaultRedirectComponent } from './edition-home/edition-default-redirect.component';
import { EditionHomeComponent } from './edition-home/edition-home.component';
import { EditionGuard } from './guards/edition.guard';
import { CollationComponent } from './view-modes/collation/collation.component';
import { DocumentalMixedComponent } from './view-modes/documental-mixed/documental-mixed.component';
import { ImageTextComponent } from './view-modes/image-text/image-text.component';
import { ImageOnlyComponent } from './view-modes/image-only/image-only.component';
import { ReadingTextComponent } from './view-modes/reading-text/reading-text.component';
import { TextSourcesComponent } from './view-modes/text-sources/text-sources.component';
import { TextTextComponent } from './view-modes/text-text/text-text.component';
import { TextVersionsComponent } from './view-modes/text-versions/text-versions.component';
import { ImageImageComponent } from './view-modes/image-image/image-image.component';

const viewModeRoutes: Routes = [
  { path: 'imageText', component: ImageTextComponent },
  { path: 'imageOnly', component: ImageOnlyComponent },
  { path: 'imageImage', component: ImageImageComponent },
  { path: 'readingText', component: ReadingTextComponent },
  { path: 'textText', component: TextTextComponent },
  { path: 'collation', component: CollationComponent },
  { path: 'textSources', component: TextSourcesComponent },
  { path: 'textVersions', component: TextVersionsComponent },
  { path: 'documentalMixed', component: DocumentalMixedComponent },
];

/**
 * URL shape: `/` (table of contents) and `/:edition/:viewMode?p=...&el=...`.
 * The edition slug is the first path segment; see EditionGuard / EditionContextService.
 */
const appRoutes: Routes = [
  { path: '', pathMatch: 'full', component: EditionHomeComponent },
  {
    path: ':edition',
    canActivate: [EditionGuard],
    children: [
      { path: '', pathMatch: 'full', component: EditionDefaultRedirectComponent },
      ...viewModeRoutes,
    ],
  },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule],
})
export class AppRoutingModule {
}
