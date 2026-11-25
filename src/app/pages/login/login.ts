import { Component, inject, input } from '@angular/core';
import { Router } from '@angular/router';
import { DemoSession } from '../../services/demo-session';

@Component({
  selector: 'app-login',
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  readonly returnUrl = input<string>();
  protected readonly session = inject(DemoSession);
  private readonly router = inject(Router);

  protected signIn(): void {
    this.session.signIn();
    const returnUrl = this.returnUrl();
    const destination =
      typeof returnUrl === 'string' &&
      (returnUrl === '/phrases' || returnUrl.startsWith('/phrases?'))
        ? returnUrl
        : '/phrases';
    void this.router.navigateByUrl(destination);
  }
}
