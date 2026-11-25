import { Routes } from '@angular/router';
import { phrasesGuard } from './guards/phrases.guard';
import { Main } from './pages/main/main';

export const routes: Routes = [
  { path: '', pathMatch: 'full', component: Main, title: 'English Bloom' },
  { path: 'home', pathMatch: 'full', redirectTo: '' },
  {
    path: 'vocabulary',
    loadComponent: () =>
      import('./pages/vocabulary/vocabulary-layout').then((m) => m.VocabularyLayout),
    children: [
      {
        path: '',
        pathMatch: 'full',
        title: 'Словарь · English Bloom',
        loadComponent: () => import('./pages/vocabulary/vocabulary').then((m) => m.Vocabulary),
      },
      {
        path: ':id',
        title: 'Карточка слова · English Bloom',
        loadComponent: () => import('./pages/vocabulary/word-details').then((m) => m.WordDetails),
      },
    ],
  },
  {
    path: 'rules',
    title: 'Правила · English Bloom',
    loadComponent: () => import('./pages/rules/rules').then((m) => m.Rules),
  },
  {
    path: 'phrases',
    title: 'Фразы · English Bloom',
    canActivate: [phrasesGuard],
    loadComponent: () => import('./pages/phrases/phrases').then((m) => m.Phrases),
  },
  {
    path: 'login',
    title: 'Учебный вход · English Bloom',
    loadComponent: () => import('./pages/login/login').then((m) => m.Login),
  },
  {
    path: '**',
    title: 'Страница не найдена · English Bloom',
    loadComponent: () => import('./pages/not-found/not-found').then((m) => m.NotFound),
  },
];
