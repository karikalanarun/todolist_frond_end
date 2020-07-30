import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FriendsService, NonFriendList } from './friends.service';

@Component({
  selector: 'app-friends-popup',
  templateUrl: './friends-popup.component.html',
  styleUrls: ['./friends-popup.component.css'],
})
export class FriendsPopupComponent implements OnInit {
  active = 1;

  nonFriends: NonFriendList = [];
  friends = [];
  pendingRequests = [];

  constructor(
    public activeModal: NgbActiveModal,
    private friendsService: FriendsService
  ) {}

  loadNonFriends() {
    this.friendsService.fetchNonFriends().subscribe((nonFriends) => {
      this.nonFriends = nonFriends;
    });
  }

  loadFriendsDetails() {
    this.loadNonFriends();
  }

  createFrndRequest(to: string) {
    this.friendsService.createFriendRequest(to).subscribe(() => {
      this.loadFriendsDetails();
    });
  }

  ngOnInit(): void {
    this.loadFriendsDetails();
  }
}
