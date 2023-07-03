import { Component, OnInit } from '@angular/core';
@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  constructor() { }

  ngOnInit(): void {
  }
  irFacebook(){
    window.open('https://www.facebook.com/ventuapp', '_blank');
  }
  irInstagram(){
    window.open('https://www.instagram.com/ventu.vip/', '_blank');
  }
}
