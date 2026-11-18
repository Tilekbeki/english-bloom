import { Component } from '@angular/core';
import { Header } from './header/header';
import { Main } from './pages/main/main';
import { Footer } from './footer/footer';
import {Rules} from './pages/rules/rules';
import {Phrases} from './pages/phrases/phrases';
import {Vocabulary} from './pages/vocabulary/vocabulary';

@Component({
  selector: 'app-root',
  imports: [Header, Main, Footer,Phrases,Vocabulary,Rules],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly menuItems = [
    {
      id: 0,
      title: 'Главная',
      page: 'mainPage',
    },
    {
      id: 1,
      title: 'Словарь',
      page: 'Vocabulary',
    },
    {
      id: 2,
      title: 'Правила',
      page: 'Rules',
    },
    {
      id: 3,
      title: 'Фразы',
      page: 'Phrases',
    },
  ];

  protected currentPage = 'mainPage';

  protected readonly onPageSelect = (id: number, page: string): void => {
    console.log(id, page);
    this.currentPage = page;
    console.log(this.currentPage, '  page');
  };
}
