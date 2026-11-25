import { Component, computed, inject, input } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { catchError, map, of } from 'rxjs';
import { MemriseApi } from '../../ServcieAPI/memrise-api';

@Component({
  selector: 'app-word-details',
  imports: [RouterLink],
  templateUrl: './word-details.html',
  styleUrl: './word-details.scss',
})
export class WordDetails {
  readonly id = input.required<string>();

  protected readonly result = toSignal(
    inject(MemriseApi).words$.pipe(
      map((words) => ({ words, failed: false })),
      catchError(() => of({ words: [], failed: true })),
    ),
  );
  protected readonly word = computed(() =>
    this.result()?.words.find((word) => String(word.id) === this.id()),
  );
  protected readonly nextWord = computed(() => {
    const words = this.result()?.words ?? [];
    const index = words.findIndex((word) => String(word.id) === this.id());
    return index >= 0 ? words[index + 1] : undefined;
  });
}
