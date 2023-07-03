import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-mobile-screenshot',
  templateUrl: './mobile-screenshot.component.html',
  styleUrls: ['./mobile-screenshot.component.css']
})
export class MobileScreenshotComponent implements OnInit {
  @Input('pagina') pagina: string = '';
  constructor() { }

  ngOnInit(): void {
  }

}
