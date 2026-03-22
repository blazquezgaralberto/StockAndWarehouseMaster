import { Component, OnInit, ViewChild } from "@angular/core";
import { UserService } from "../../users/service/user.service";

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

    @ViewChild('carousel') carousel: any;

    images = [
        { id: '1', url: 'assets/img/captura1.png' },
        { id: '2', url: 'assets/img/captura2.png' },
        { id: '3', url: 'assets/img/captura4.png' },
        { id: '3', url: 'assets/img/captura5.png' }
    ];

    customOptions: any = {
        loop: true,
        mouseDrag: true,
        touchDrag: true,
        pullDrag: true,
        dots: true,
        autoplay: true,
        autoplayTimeout: 5000,
        autoplayHoverPause: true,
        center: true,
        navSpeed: 700,
        navText: ['', ''],
        responsive: {
            0: {
                items: 2
            },
            600: {
                items: 2
            },
            1000: {
                items: 1
            }
        },
        margin: 10,
        lazyLoad: true
    };
    isLogged = false;
    username = '';

    constructor(private userService: UserService) { }

    ngOnInit() {
        if (this.userService.getToken()) {
            this.isLogged = true;
            this.username = this.userService.getUserName();
        } else {
            this.isLogged = false;
            this.username = '';
        }
    }

    
}