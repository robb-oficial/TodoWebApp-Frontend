import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from "./navbar/navbar";
import { MatSidenavContent, MatSidenav, MatSidenavContainer } from "@angular/material/sidenav";
import { MatToolbar } from "@angular/material/toolbar";

@Component({
  selector: 'app-root',
  imports: [Navbar, MatSidenavContent, MatSidenav, MatSidenavContainer, MatToolbar, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {

}
