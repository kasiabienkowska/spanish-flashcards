export interface Card {
  id: string;
  es: string;
  pl: string;
  category: string;
  /** Pudełko Leitnera: 0 = nowa, 1–5 = poziom opanowania */
  box: number;
  /** Data następnej powtórki (YYYY-MM-DD) */
  due: string;
  /** Dzień, w którym karta pierwszy raz pojawiła się w nauce */
  introduced?: string;
}

export interface StudyStats {
  /** Dni (YYYY-MM-DD), w których była nauka */
  studyDays: string[];
  reviewedToday: number;
  lastStudyDay: string | null;
}
