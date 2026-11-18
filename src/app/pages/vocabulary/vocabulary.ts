import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, map, of } from 'rxjs';
import { MemriseApi, type MemriseWord } from '../../ServcieAPI/memrise-api';

const PAGE_SIZE = 24;

type VocabularyResult = { kind: 'loaded'; words: readonly MemriseWord[] } | { kind: 'error' };

@Component({
  selector: 'app-vocabulary',
  templateUrl: './vocabulary.html',
  styleUrl: './vocabulary.scss',
})
export class Vocabulary {
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
  private readonly selectedDeck = signal('');
  private readonly search = signal('');
  private readonly visibleCount = signal(PAGE_SIZE);

  protected readonly decks = computed(() =>
    Array.from(new Set(this.words().map((word) => word.deck))),
  );
  protected readonly filteredWords = computed(() => {
    const deck = this.selectedDeck();
    const search = this.search();
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
    this.selectedDeck.set(deck);
    this.visibleCount.set(PAGE_SIZE);
  }

  protected setSearch(search: string): void {
    this.search.set(search.trim().toLocaleLowerCase());
    this.visibleCount.set(PAGE_SIZE);
  }

  protected showMore(): void {
    this.visibleCount.update((count) => count + PAGE_SIZE);
  }
}
