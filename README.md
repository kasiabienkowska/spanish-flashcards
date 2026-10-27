# 🇪🇸 Spanish Flashcards

A simple Angular app for learning Spanish vocabulary every day (UI in Polish).

- **Daily session**: reviews first, then up to 10 new words per day
- **Leitner system**: a known card moves up a box and comes back after 1 / 2 / 4 / 7 / 14 days; a missed card returns at the end of the current session
- **Pronunciation** 🔊 via the Web Speech API (`es-ES` voice)
- **Direction** 🇪🇸→🇵🇱 or 🇵🇱→🇪🇸
- **Shortcuts**: space = flip, `1` = don't know, `2` = know
- **Custom words** with categories, search, and mastery level
- Study streak 🔥, everything stored in `localStorage` (no backend)

## Running

```bash
npm install
npm start        # http://localhost:4200
```

## Structure

```
src/app/
  models/card.ts              – Card, StudyStats types
  data/starter-cards.ts       – ~60 starter words
  services/deck.service.ts    – state (signals), spaced repetition, localStorage persistence
  services/speech.ts          – pronunciation
  pages/home                  – start screen with stats
  pages/study                 – study session (flip cards)
  pages/words                 – word list and adding new words
```
