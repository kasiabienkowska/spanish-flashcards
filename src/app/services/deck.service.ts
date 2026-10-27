import { Injectable, computed, effect, signal } from '@angular/core';
import { Card, StudyStats } from '../models/card';
import { STARTER_CARDS } from '../data/starter-cards';

const CARDS_KEY = 'flashcards.cards';
const STATS_KEY = 'flashcards.stats';

/** Days until the next review after a card lands in a given box */
const BOX_INTERVALS = [0, 1, 2, 4, 7, 14];
export const MAX_BOX = BOX_INTERVALS.length - 1;
export const NEW_CARDS_PER_DAY = 10;

export function today(): string {
  return toDateKey(new Date());
}

function toDateKey(d: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function addDays(dateKey: string, days: number): string {
  const d = new Date(dateKey + 'T00:00:00');
  d.setDate(d.getDate() + days);
  return toDateKey(d);
}

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

@Injectable({ providedIn: 'root' })
export class DeckService {
  readonly cards = signal<Card[]>(load(CARDS_KEY, createStarterDeck()));
  private readonly stats = signal<StudyStats>(
    load(STATS_KEY, { studyDays: [], reviewedToday: 0, lastStudyDay: null }),
  );

  readonly categories = computed(() =>
    [...new Set(this.cards().map((c) => c.category))].sort(),
  );

  /** Reviews for today: already introduced cards that are due */
  readonly dueCards = computed(() =>
    this.cards().filter((c) => c.box > 0 && c.due <= today()),
  );

  readonly reviewedToday = computed(() => {
    const s = this.stats();
    return s.lastStudyDay === today() ? s.reviewedToday : 0;
  });

  /** New cards for today, capped by the daily limit (minus those already started today) */
  readonly newCards = computed(() => {
    const startedToday = this.cards().filter((c) => c.box > 0 && c.introduced === today()).length;
    const limit = Math.max(0, NEW_CARDS_PER_DAY - startedToday);
    return this.cards()
      .filter((c) => c.box === 0)
      .slice(0, limit);
  });

  readonly mastered = computed(() => this.cards().filter((c) => c.box === MAX_BOX).length);

  readonly streak = computed(() => {
    const days = new Set(this.stats().studyDays);
    let day = days.has(today()) ? today() : addDays(today(), -1);
    let count = 0;
    while (days.has(day)) {
      count++;
      day = addDays(day, -1);
    }
    return count;
  });

  constructor() {
    effect(() => localStorage.setItem(CARDS_KEY, JSON.stringify(this.cards())));
    effect(() => localStorage.setItem(STATS_KEY, JSON.stringify(this.stats())));
  }

  /** Today's session: reviews first, then new cards */
  buildSession(): Card[] {
    return shuffle([...this.dueCards()]).concat(this.newCards());
  }

  /** Records an answer. Returns true if the card should come back in this session. */
  answer(cardId: string, knew: boolean): boolean {
    const t = today();
    this.cards.update((cards) =>
      cards.map((c) => {
        if (c.id !== cardId) return c;
        const box = knew ? Math.min(c.box + 1, MAX_BOX) : 1;
        return {
          ...c,
          box,
          due: knew ? addDays(t, BOX_INTERVALS[box]) : t,
          introduced: c.introduced ?? t,
        };
      }),
    );
    this.stats.update((s) => ({
      studyDays: s.studyDays.includes(t) ? s.studyDays : [...s.studyDays, t],
      reviewedToday: (s.lastStudyDay === t ? s.reviewedToday : 0) + 1,
      lastStudyDay: t,
    }));
    return !knew;
  }

  addCard(es: string, pl: string, category: string): void {
    this.cards.update((cards) => [
      ...cards,
      { id: crypto.randomUUID(), es: es.trim(), pl: pl.trim(), category: category.trim() || 'Moje', box: 0, due: today() },
    ]);
  }

  removeCard(id: string): void {
    this.cards.update((cards) => cards.filter((c) => c.id !== id));
  }

  resetProgress(): void {
    this.cards.update((cards) => cards.map((c) => ({ ...c, box: 0, due: today(), introduced: undefined })));
    this.stats.set({ studyDays: [], reviewedToday: 0, lastStudyDay: null });
  }
}

function createStarterDeck(): Card[] {
  return STARTER_CARDS.map((c) => ({ ...c, id: crypto.randomUUID(), box: 0, due: today() }));
}

function shuffle<T>(items: T[]): T[] {
  for (let i = items.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [items[i], items[j]] = [items[j], items[i]];
  }
  return items;
}
