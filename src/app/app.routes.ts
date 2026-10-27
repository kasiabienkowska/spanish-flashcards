import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Study } from './pages/study/study';
import { Words } from './pages/words/words';

export const routes: Routes = [
  { path: '', component: Home, title: 'Fiszki – hiszpański' },
  { path: 'nauka', component: Study, title: 'Nauka – Fiszki' },
  { path: 'slowka', component: Words, title: 'Słówka – Fiszki' },
  { path: '**', redirectTo: '' },
];
