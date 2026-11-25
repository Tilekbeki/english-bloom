import { Component, computed, inject, input } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { catchError, map, of } from 'rxjs';
import { MemriseApi, type MemriseWord } from '../../ServcieAPI/memrise-api';

const PAGE_SIZE = 24;

function queryValue(value: string | string[] | undefined): string {
  return Array.isArray(value) ? (value[0] ?? '') : (value ?? '');
}

type VocabularyResult = { kind: 'loaded'; words: readonly MemriseWord[] } | { kind: 'error' };

@Component({
  selector: 'app-vocabulary',
  imports: [RouterLink],
  templateUrl: './vocabulary.html',
  styleUrl: './vocabulary.scss',
})
export class Vocabulary {
  readonly q = input('', { transform: queryValue });
  readonly deck = input('', { transform: queryValue });
  readonly page = input('', { transform: queryValue });
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  protected readonly result = toSignal(
    inject(MemriseApi).words$.pipe(
      map((words): VocabularyResult => ({ kind: 'loaded', words })),
      catchError(() => of<VocabularyResult>({ kind: 'error' })),
    ),
  );

  private readonly words = computed(() => {
    const result = this.result();
    return result?.kind === 'loaded' ? result.words : [];
  });
  private readonly visibleCount = computed(() => {
    const page = Number(this.page());
    return (Number.isSafeInteger(page) && page > 0 ? page : 1) * PAGE_SIZE;
  });

  protected readonly decks = computed(() =>
    Array.from(new Set(this.words().map((word) => word.deck))),
  );
  protected readonly filteredWords = computed(() => {
    const deck = this.deck();
    const search = this.q().trim().toLocaleLowerCase();
    return this.words().filter(
      (word) =>
        (!deck || word.deck === deck) &&
        (word.term.toLocaleLowerCase().includes(search) ||
          word.translation.toLocaleLowerCase().includes(search)),
    );
  });
  protected readonly visibleWords = computed(() =>
    this.filteredWords().slice(0, this.visibleCount()),
  );

  protected selectDeck(deck: string): void {
    void this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { deck: deck || null, page: null },
      queryParamsHandling: 'merge',
    });
  }

  protected setSearch(search: string): void {
    void this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { q: search || null, page: null },
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });
  }

  protected showMore(): void {
    void this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { page: Math.ceil(this.visibleWords().length / PAGE_SIZE) + 1 },
      queryParamsHandling: 'merge',
    });
  }
}
