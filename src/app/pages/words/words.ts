import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DeckService, MAX_BOX } from '../../services/deck.service';
import { speakSpanish } from '../../services/speech';

@Component({
  selector: 'app-words',
  imports: [FormsModule],
  template: `
    <h2>Dodaj słówko</h2>
    <form class="add" (ngSubmit)="add()">
      <input name="es" placeholder="po hiszpańsku, np. el perro" [(ngModel)]="es" required />
      <input name="pl" placeholder="po polsku, np. pies" [(ngModel)]="pl" required />
      <input name="category" placeholder="kategoria" list="categories" [(ngModel)]="category" />
      <datalist id="categories">
        @for (c of deck.categories(); track c) { <option [value]="c"></option> }
      </datalist>
      <button class="btn primary" type="submit" [disabled]="!es.trim() || !pl.trim()">Dodaj</button>
    </form>

    <h2>Twoje słówka ({{ filtered().length }})</h2>
    <div class="filters">
      <input placeholder="Szukaj…" [ngModel]="search()" (ngModelChange)="search.set($event)" />
      <select [ngModel]="filterCategory()" (ngModelChange)="filterCategory.set($event)">
        <option value="">Wszystkie kategorie</option>
        @for (c of deck.categories(); track c) { <option [value]="c">{{ c }}</option> }
      </select>
    </div>

    <ul class="list">
      @for (card of filtered(); track card.id) {
        <li>
          <button class="icon" (click)="speak(card.es)" title="Wymowa">🔊</button>
          <div class="text">
            <strong>{{ card.es }}</strong>
            <span>{{ card.pl }}</span>
          </div>
          <span class="level" [title]="card.box === 0 ? 'Jeszcze nie ćwiczone' : 'Poziom ' + card.box + '/' + maxBox">
            @for (i of levels; track i) { <i [class.on]="i <= card.box"></i> }
          </span>
          <button class="icon" (click)="deck.removeCard(card.id)" title="Usuń">🗑️</button>
        </li>
      } @empty {
        <li class="empty">Brak słówek.</li>
      }
    </ul>

    <button class="btn danger small reset" (click)="reset()">Wyzeruj postępy</button>
  `,
  styles: `
    :host { display: flex; flex-direction: column; gap: .75rem; }
    h2 { margin: .5rem 0 0; font-size: 1.2rem; }
    .add, .filters { display: flex; gap: .5rem; flex-wrap: wrap; }
    .add input, .filters input, .filters select { flex: 1 1 140px; }
    .list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: .4rem; }
    li { display: flex; align-items: center; gap: .75rem; background: var(--surface); border-radius: 12px; padding: .6rem .8rem; box-shadow: var(--shadow); }
    .text { flex: 1; display: flex; flex-direction: column; }
    .text span { color: var(--muted); font-size: .9rem; }
    .icon { background: none; border: none; cursor: pointer; font-size: 1.1rem; padding: .2rem; }
    .level { display: flex; gap: 3px; }
    .level i { width: 8px; height: 8px; border-radius: 50%; background: var(--border); }
    .level i.on { background: var(--success); }
    .empty { justify-content: center; color: var(--muted); }
    .reset { align-self: center; margin-top: 1rem; }
  `,
})
export class Words {
  protected readonly deck = inject(DeckService);
  protected readonly maxBox = MAX_BOX;
  protected readonly levels = Array.from({ length: MAX_BOX }, (_, i) => i + 1);

  protected es = '';
  protected pl = '';
  protected category = '';
  protected readonly search = signal('');
  protected readonly filterCategory = signal('');

  protected readonly filtered = computed(() => {
    const q = this.search().toLowerCase().trim();
    const cat = this.filterCategory();
    return this.deck
      .cards()
      .filter((c) => !cat || c.category === cat)
      .filter((c) => !q || c.es.toLowerCase().includes(q) || c.pl.toLowerCase().includes(q));
  });

  protected add(): void {
    if (!this.es.trim() || !this.pl.trim()) return;
    this.deck.addCard(this.es, this.pl, this.category);
    this.es = '';
    this.pl = '';
  }

  protected speak(text: string): void {
    speakSpanish(text);
  }

  protected reset(): void {
    if (confirm('Na pewno wyzerować cały postęp nauki?')) this.deck.resetProgress();
  }
}
