import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter, map } from 'rxjs';
import { Header } from './header/header';
import { Footer } from './footer/footer';

@Component({
  selector: 'app-root',
  imports: [Header, RouterOutlet, Footer],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  private readonly router = inject(Router);
  protected readonly currentUrl = toSignal(
    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      map((event) => event.urlAfterRedirects.split('#')[0]),
    ),
    { initialValue: this.router.url.split('#')[0] },
  );
  protected readonly menuItems = [
    { id: 0, title: 'Главная', path: '/' },
    { id: 1, title: 'Словарь', path: '/vocabulary' },
    { id: 2, title: 'Правила', path: '/rules' },
    { id: 3, title: 'Фразы', path: '/phrases' },
  ];
}
