import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, inject, signal } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  imports: [],
  selector: 'app-about',
  styleUrl: './about.css',
  templateUrl: './about.html',
})
export class About {
  brkPntService = inject(BreakpointObserver);
  smallScreen = signal(false);
  breakpointSubscription: Subscription | undefined;

  ngOnInit(): void {
    this.setResponsiveObservables();
  }

  setResponsiveObservables(): void {
    this.breakpointSubscription = this.brkPntService.observe([
      Breakpoints.HandsetPortrait,
      Breakpoints.TabletPortrait
    ]).subscribe(result => {
      this.smallScreen.set(false);
      if (result.matches) {
        this.smallScreen.set(true);
      }
    });
  }
}
