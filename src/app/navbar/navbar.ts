import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, RouterLink } from "@angular/router";
import { Auth } from '../auth/auth';

@Component({
  imports: [MatToolbarModule, MatButtonModule, MatIconModule, MatSidenavModule, RouterLink],
  selector: 'app-navbar',
  styleUrl: './navbar.css',
  templateUrl: './navbar.html',
})
export class Navbar implements OnInit {
  brkPntService = inject(BreakpointObserver);
  smallScreen = signal(false);
  authService = inject(Auth);
  router = inject(Router);

  ngOnInit(): void {
    this.brkPntService.observe([
      Breakpoints.HandsetPortrait,
      Breakpoints.TabletPortrait
    ]).subscribe(result => {
      this.smallScreen.set(false);
      if (result.matches) {
        this.smallScreen.set(true);
      }
    });
  }

  logout(): void {
    this.authService.logout().subscribe({
      complete: () => {
        this.authService.user.set(undefined);
        this.router.navigate(['login']);
      }
    });
  }
}
