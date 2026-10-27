export interface Card {
  id: string;
  es: string;
  pl: string;
  category: string;
  /** Leitner box: 0 = new, 1–5 = mastery level */
  box: number;
  /** Next review date (YYYY-MM-DD) */
  due: string;
  /** Day the card was first studied */
  introduced?: string;
}

export interface StudyStats {
  /** Days (YYYY-MM-DD) with at least one study session */
  studyDays: string[];
  reviewedToday: number;
  lastStudyDay: string | null;
}
