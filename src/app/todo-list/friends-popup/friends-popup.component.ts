import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import {
  FriendsService,
  NonFriendList,
  PendingFriendRequest,
  UserDetails,
} from './friends.service';

@Component({
  selector: 'app-friends-popup',
  templateUrl: './friends-popup.component.html',
  styleUrls: ['./friends-popup.component.css'],
})
export class FriendsPopupComponent implements OnInit {
  active = 1;

  nonFriends: NonFriendList = [];
  friends: UserDetails[] = [];
  pendingRequests: PendingFriendRequest[] = [];

  constructor(
    public activeModal: NgbActiveModal,
    private friendsService: FriendsService
  ) {}

  loadNonFriends() {
    this.friendsService.fetchNonFriends().subscribe((nonFriends) => {
      this.nonFriends = nonFriends;
    });
  }

  loadPendingReqs() {
    this.friendsService.getPendingReq().subscribe((frndReqs) => {
      this.pendingRequests = frndReqs;
    });
  }

  loadFriends() {
    this.friendsService.fetchFriends().subscribe((frnds) => {
      console.log('frnds ::: ', frnds);
      this.friends = frnds;
    });
  }

  loadFriendsDetails() {
    this.loadNonFriends();
    this.loadPendingReqs();
    this.loadFriends();
  }

  createFrndRequest(to: string) {
    this.friendsService.createFriendRequest(to).subscribe(() => {
      this.loadFriendsDetails();
    });
  }

  acceptRequest(req: string) {
    this.friendsService.acceptFrndReq(req).subscribe(() => {
      this.loadFriendsDetails();
    });
  }

  ngOnInit(): void {
    this.loadFriendsDetails();
  }
}
