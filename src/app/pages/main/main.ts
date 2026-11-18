import { Component } from '@angular/core';
import { Hero } from './hero/hero';
import { LearningTracks } from './learning-tracks/learning-tracks';
import { WordOfDay } from './word-of-day/word-of-day';

@Component({
  selector: 'app-main',
  imports: [Hero, LearningTracks, WordOfDay],
  templateUrl: './main.html',
  styleUrl: './main.scss',
})
export class Main {}
