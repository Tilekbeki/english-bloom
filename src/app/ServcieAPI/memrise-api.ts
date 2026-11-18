import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { unzipSync } from 'fflate';
import { shareReplay, switchMap } from 'rxjs';

export interface MemriseWord {
  readonly id: number;
  readonly term: string;
  readonly translation: string;
  readonly deck: string;
}

@Injectable({ providedIn: 'root' })
export class MemriseApi {
  private readonly http = inject(HttpClient);

  readonly words$ = this.http
    .get('data/Memrise.apkg', { responseType: 'arraybuffer' })
    .pipe(switchMap(readMemriseArchive), shareReplay(1));
}

async function readMemriseArchive(archive: ArrayBuffer): Promise<readonly MemriseWord[]> {
  const collectionName = 'collection.anki21';
  const collection = unzipSync(new Uint8Array(archive), {
    filter: (entry) => entry.name === collectionName,
  })[collectionName];

  if (!collection) {
    throw new Error('База карточек не найдена в Memrise.apkg');
  }

  const { default: initSqlJs } = await import('sql.js');
  const sqlite = await initSqlJs({ locateFile: (file) => 'data/' + file });
  const db = new sqlite.Database(collection);

  try {
    db.run('PRAGMA trusted_schema = OFF');
    const decksJson = db.exec('SELECT decks FROM col')[0]?.values[0]?.[0];
    if (typeof decksJson !== 'string') {
      throw new Error('Колоды не найдены в Memrise.apkg');
    }

    const decks = JSON.parse(decksJson) as Record<string, { id: number; name: string }>;
    const deckNames = new Map(
      Object.values(decks).map(({ id, name }) => [id, name.split('::').at(-1) ?? name]),
    );
    const notes = db.exec(
      'SELECT notes.id, notes.flds, cards.did FROM notes JOIN cards ON cards.nid = notes.id ORDER BY notes.id',
    )[0];

    const words: MemriseWord[] = [];
    for (const [id, fields, deckId] of notes?.values ?? []) {
      if (typeof id !== 'number' || typeof fields !== 'string' || typeof deckId !== 'number') {
        continue;
      }

      const [term, translation] = fields.split('\u001f');
      if (term?.trim() && translation?.trim()) {
        words.push({
          id,
          term: term.trim(),
          translation: translation.trim(),
          deck: deckNames.get(deckId) ?? 'Без колоды',
        });
      }
    }
    return words;
  } finally {
    db.close();
  }
}
