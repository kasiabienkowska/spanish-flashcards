import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Card } from '../../models/card';
import { DeckService } from '../../services/deck.service';
import { speakSpanish } from '../../services/speech';

type Direction = 'es-pl' | 'pl-es';

@Component({
  selector: 'app-study',
  imports: [RouterLink],
  host: { '(document:keydown)': 'onKey($event)' },
  template: `
    @if (current(); as card) {
      <div class="toolbar">
        <span class="progress">{{ answered() }} / {{ answered() + queue().length }}</span>
        <button class="btn small" (click)="toggleDirection()">
          {{ direction() === 'es-pl' ? '🇪🇸 → 🇵🇱' : '🇵🇱 → 🇪🇸' }}
        </button>
      </div>
      <div class="bar"><div class="fill" [style.width.%]="progressPct()"></div></div>

      <div class="card" [class.flipped]="flipped()" (click)="flip()">
        <div class="face front">
          <span class="category">{{ card.category }}</span>
          <span class="word">{{ direction() === 'es-pl' ? card.es : card.pl }}</span>
          @if (card.box === 0) { <span class="badge">nowe</span> }
          <span class="hint">kliknij lub spacja, aby odwrócić</span>
        </div>
        <div class="face back">
          <span class="category">{{ card.category }}</span>
          <span class="word">{{ direction() === 'es-pl' ? card.pl : card.es }}</span>
          <span class="sub">{{ direction() === 'es-pl' ? card.es : card.pl }}</span>
        </div>
      </div>

      <div class="actions">
        <button class="btn" (click)="speak(card)" title="Posłuchaj wymowy">🔊</button>
        @if (flipped()) {
          <button class="btn danger" (click)="answer(false)">✗ Nie wiem <kbd>1</kbd></button>
          <button class="btn success" (click)="answer(true)">✓ Wiem <kbd>2</kbd></button>
        } @else {
          <button class="btn primary" (click)="flip()">Pokaż odpowiedź</button>
        }
      </div>
    } @else {
      <div class="finished">
        <h2>¡Muy bien! 🎉</h2>
        @if (answered() > 0) {
          <p>Sesja skończona: {{ answered() }} odpowiedzi, {{ correct() }} trafionych za pierwszym razem.</p>
        } @else {
          <p>Na dziś nie ma nic do nauki.</p>
        }
        <a class="btn primary" routerLink="/">Wróć na start</a>
      </div>
    }
  `,
  styleUrl: './study.scss',
})
export class Study {
  private readonly deck = inject(DeckService);

  protected readonly queue = signal<Card[]>(this.deck.buildSession());
  protected readonly flipped = signal(false);
  protected readonly answered = signal(0);
  protected readonly correct = signal(0);
  protected readonly direction = signal<Direction>('es-pl');
  private readonly missed = new Set<string>();

  protected readonly current = computed(() => {
    const id = this.queue()[0]?.id;
    // bierzemy świeżą wersję karty z talii (np. zaktualizowane pudełko)
    return id ? this.deck.cards().find((c) => c.id === id) : undefined;
  });

  protected readonly progressPct = computed(() => {
    const total = this.answered() + this.queue().length;
    return total ? (this.answered() / total) * 100 : 0;
  });

  protected flip(): void {
    const card = this.current();
    if (!card) return;
    this.flipped.update((f) => !f);
    if (this.flipped() && this.direction() === 'pl-es') speakSpanish(card.es);
  }

  protected speak(card: Card): void {
    speakSpanish(card.es);
  }

  protected toggleDirection(): void {
    this.direction.update((d) => (d === 'es-pl' ? 'pl-es' : 'es-pl'));
    this.flipped.set(false);
  }

  protected answer(knew: boolean): void {
    const [card, ...rest] = this.queue();
    if (!card) return;
    const again = this.deck.answer(card.id, knew);
    if (knew && !this.missed.has(card.id)) this.correct.update((n) => n + 1);
    if (!knew) this.missed.add(card.id);
    this.answered.update((n) => n + 1);
    this.flipped.set(false);
    // błędne karty wracają na koniec kolejki, aż zostaną zapamiętane
    this.queue.set(again ? [...rest, card] : rest);
  }

  protected onKey(event: KeyboardEvent): void {
    if (event.target instanceof HTMLInputElement) return;
    if (event.key === ' ' || event.key === 'Enter') {
      event.preventDefault();
      this.flip();
    } else if (this.flipped() && event.key === '1') {
      this.answer(false);
    } else if (this.flipped() && event.key === '2') {
      this.answer(true);
    }
  }
}
