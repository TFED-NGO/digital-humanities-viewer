import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EditionContextService } from '../services/edition-context.service';
import { EVTStatusService } from '../services/evt-status.service';

/** `/:edition` with no view mode → `/:edition/<default view mode>`. */
@Component({ selector: 'evt-edition-default-redirect', template: '' })
export class EditionDefaultRedirectComponent implements OnInit {
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private editionContext: EditionContextService,
    private evtStatusService: EVTStatusService,
  ) {}

  ngOnInit(): void {
    const view = this.editionContext.activeEdition?.defaultViewMode ?? this.evtStatusService.defaultViewMode?.id ?? 'readingText';
    this.router.navigate([view], { relativeTo: this.route, replaceUrl: true, queryParamsHandling: 'preserve' });
  }
}
