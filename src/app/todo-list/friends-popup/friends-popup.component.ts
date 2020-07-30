import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-friends-popup',
  templateUrl: './friends-popup.component.html',
  styleUrls: ['./friends-popup.component.css'],
})
export class FriendsPopupComponent implements OnInit {
  active = 1;
  constructor(public activeModal: NgbActiveModal) {}

  ngOnInit(): void {}
}
