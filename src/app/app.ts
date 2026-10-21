import { Component } from '@angular/core';
import { Header } from './header/header';
import { Hero } from './hero/hero';
import { LearningTracks } from './learning-tracks/learning-tracks';
import { WordOfDay } from './word-of-day/word-of-day';
import { Footer } from './footer/footer';

@Component({
  selector: 'app-root',
  imports: [Header, Hero, LearningTracks, WordOfDay, Footer],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {}
