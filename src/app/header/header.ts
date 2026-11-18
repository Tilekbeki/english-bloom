import { Component, input } from '@angular/core';

@Component({
  imports: [],
  selector: 'app-header',
  styleUrl: './header.scss',
  templateUrl: './header.html',
})
export class Header {
  readonly onPageSelect = input.required<(id: number, page: string) => void>();
  readonly menuItems = input.required<{ id: number; title: string; page: string }[]>();
  readonly currentPage = input.required<string>();
}
