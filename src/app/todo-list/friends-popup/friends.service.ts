import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { flatMap, map } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { LoginService } from 'src/app/login/login.service';

export type Response<T> = {
  status: number;
  message: string;
  result: T;
};

export type FriendRequest<T, K> = {
  status: 'created' | 'accepted' | 'rejected';
  _id: string;
  raised_by: T;
  raised_to: K;
};

type UserDetails = {
  _id: string;
  first_name: string;
  last_name: string;
  email: string;
};

type RequestRaisedByCurrentUser = FriendRequest<string, UserDetails>;

export type PendingRequestResponseRaised = Response<
  RequestRaisedByCurrentUser[]
>;

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

const alreadySentRequests = (http: HttpClient) => {
  return http.get<PendingRequestResponseRaised>(
    `${environment.backend_url}/friend_request/request_by_user`
  );
};

const getNonFriendsList = (http: HttpClient) => (
  nonfriends: NonFriend[]
): Observable<NonFriendList> => {
  // return of(nonfriends.map((friend) => ({ ...friend, request_sent: false })));
  return alreadySentRequests(http)
    .pipe(map((res) => res.result))
    .pipe(
      map((pendingRequests) => {
        const pendingUserIds = pendingRequests.map((req) => req.raised_to._id);
        return nonfriends.map((nonFriend) => {
          return {
            ...nonFriend,
            request_sent: pendingUserIds.some((id) => id === nonFriend._id),
          };
        });
      })
    );
};

const fetchNonFriends = (http: HttpClient, url: string) => (): Observable<
  NonFriendList
> => {
  return http
    .get<NonFriendFetchResponse>(url)
    .pipe(map((response) => response.result))
    .pipe(flatMap(getNonFriendsList(http)));
};

const createFriendRequest = (
  loginService: LoginService,
  http: HttpClient,
  url: string
) => (raised_to: string) => {
  return http.post(url, {
    raised_by: loginService.getLoginUserID(),
    raised_to,
  });
};

@Injectable({
  providedIn: 'root',
})
export class FriendsService {
  private getNonFriendsURL = `${environment.backend_url}/users/non-friends`;
  private createFrndReqURL = `${environment.backend_url}/friend_request`;

  constructor(private http: HttpClient, private loginService: LoginService) {}
  // alreadySentRequests = alreadySentRequests;
  fetchNonFriends = fetchNonFriends(this.http, this.getNonFriendsURL);
  createFriendRequest = createFriendRequest(
    this.loginService,
    this.http,
    this.createFrndReqURL
  );
}
