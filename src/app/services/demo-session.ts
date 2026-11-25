import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class DemoSession {
  private readonly _signedIn = signal(false);
  readonly signedIn = this._signedIn.asReadonly();

  signIn(): void {
    this._signedIn.set(true);
  }

  signOut(): void {
    this._signedIn.set(false);
  }
}
