# 🇪🇸 Fiszki – hiszpański

Prosta aplikacja w Angularze do codziennej nauki hiszpańskich słówek.

- **Codzienna sesja**: najpierw powtórki, potem do 10 nowych słówek dziennie
- **System Leitnera**: znana karta trafia do wyższego pudełka i wraca po 1 / 2 / 4 / 7 / 14 dniach, nieznana wraca na koniec bieżącej sesji
- **Wymowa** 🔊 przez Web Speech API (głos `es-ES`)
- **Kierunek** 🇪🇸→🇵🇱 lub 🇵🇱→🇪🇸
- **Skróty**: spacja = odwróć, `1` = nie wiem, `2` = wiem
- **Własne słówka** z kategoriami, wyszukiwarką i poziomem opanowania
- Seria dni nauki 🔥, a wszystko zapisuje się w `localStorage` (bez backendu)

## Uruchomienie

```bash
npm install
npm start        # http://localhost:4200
```

## Struktura

```
src/app/
  models/card.ts              – typy Card, StudyStats
  data/starter-cards.ts       – ~60 słówek na start
  services/deck.service.ts    – stan (signals), algorytm powtórek, zapis do localStorage
  services/speech.ts          – wymowa
  pages/home                  – ekran startowy ze statystykami
  pages/study                 – sesja nauki (odwracane fiszki)
  pages/words                 – lista słówek i dodawanie nowych
```
