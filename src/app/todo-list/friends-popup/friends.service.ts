import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { flatMap, map } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

export type NonFriend = {
  _id: string;
  first_name: string;
  last_name: string;
  email: string;
};

export type CalculatedNonFriend = { request_sent: boolean } & NonFriend;

export type NonFriendList = CalculatedNonFriend[];

export type NonFriendFetchResponse = {
  status: number;
  message: string;
  result: NonFriend[];
};

// const alreadySentRequests = http;

const getNonFriendsList = (
  nonfriends: NonFriend[]
): Observable<NonFriendList> => {
  return of(nonfriends.map((friend) => ({ ...friend, request_sent: false })));
};

const fetchNonFriends = (http: HttpClient, url: string) => (): Observable<
  NonFriendList
> => {
  return http
    .get<NonFriendFetchResponse>(url)
    .pipe(map((response) => response.result))
    .pipe(flatMap(getNonFriendsList));
};

@Injectable({
  providedIn: 'root',
})
export class FriendsService {
  private getNonFriendsURL = `${environment.backend_url}/users/non-friends`;
  constructor(private http: HttpClient) {}
  // alreadySentRequests = alreadySentRequests;
  fetchNonFriends = fetchNonFriends(this.http, this.getNonFriendsURL);
}
