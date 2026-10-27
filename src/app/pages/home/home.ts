import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DeckService, NEW_CARDS_PER_DAY } from '../../services/deck.service';

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  template: `
    <section class="hero">
      <h1>¡Hola! 👋</h1>
      <p>Kilka minut dziennie i hiszpański wejdzie sam.</p>
    </section>

    <section class="stats">
      <div class="stat">
        <span class="value">🔥 {{ deck.streak() }}</span>
        <span class="label">dni z rzędu</span>
      </div>
      <div class="stat">
        <span class="value">{{ deck.dueCards().length }}</span>
        <span class="label">powtórek na dziś</span>
      </div>
      <div class="stat">
        <span class="value">{{ deck.newCards().length }}</span>
        <span class="label">nowych słówek (max {{ newPerDay }})</span>
      </div>
      <div class="stat">
        <span class="value">{{ deck.mastered() }} / {{ deck.cards().length }}</span>
        <span class="label">opanowanych</span>
      </div>
    </section>

    @if (deck.dueCards().length + deck.newCards().length > 0) {
      <a class="btn primary big" routerLink="/study">Zaczynamy naukę →</a>
    } @else {
      <div class="done">
        <p>🎉 Na dziś wszystko zrobione! Wróć jutro.</p>
        <a class="btn" routerLink="/words">Dodaj własne słówka</a>
      </div>
    }

    @if (deck.reviewedToday() > 0) {
      <p class="muted">Dziś przerobiono już {{ deck.reviewedToday() }} kart.</p>
    }
  `,
  styles: `
    :host { display: flex; flex-direction: column; gap: 1.5rem; align-items: center; text-align: center; }
    .hero h1 { font-size: 2.5rem; margin: 0; }
    .hero p { color: var(--muted); margin: .25rem 0 0; }
    .stats { display: grid; grid-template-columns: repeat(2, 1fr); gap: .75rem; width: 100%; }
    .stat { background: var(--surface); border-radius: 16px; padding: 1rem; display: flex; flex-direction: column; box-shadow: var(--shadow); }
    .value { font-size: 1.6rem; font-weight: 700; }
    .label { color: var(--muted); font-size: .85rem; }
    .big { font-size: 1.15rem; padding: 1rem 2rem; }
    .done p { font-size: 1.1rem; }
    .muted { color: var(--muted); margin: 0; }
  `,
})
export class Home {
  protected readonly deck = inject(DeckService);
  protected readonly newPerDay = NEW_CARDS_PER_DAY;
}
