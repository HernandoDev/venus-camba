import {Component} from '@angular/core';
import { AppComponent } from 'src/app/app.component';

@Component({
    selector: 'app-footer',
    template: `
        <div class="layout-footer">
            <div class="footer-logo-container">
            </div>
            <span class="copyright">&#169; VENTU - 2023</span>
        </div>
    `
})
export class AppFooterComponent {
    constructor(public app: AppComponent) {}
}
