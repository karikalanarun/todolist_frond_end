import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { flatMap, map, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { LoginService } from 'src/app/login/login.service';
import { SocketService } from 'src/app/socket.service';

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

export type UserDetails = {
  _id: string;
  first_name: string;
  last_name: string;
  email: string;
};

type RequestRaisedByCurrentUser = FriendRequest<string, UserDetails>;

export type PendingFriendRequest = FriendRequest<UserDetails, string>;

type PendingFriendRequestResponse = Response<PendingFriendRequest[]>;

type PendingRequestResponseRaised = Response<RequestRaisedByCurrentUser[]>;

type FriendListResponse = Response<UserDetails[]>;

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
  socket: SocketService,
  url: string
) => (raised_to: string) => {
  return http
    .post(url, {
      raised_by: loginService.getLoginUserID(),
      raised_to,
    })
    .pipe(
      tap(() => {
        socket.friendReqGiven({
          raised_by: loginService.getLoginUserID(),
          raised_to,
        });
      })
    );
};

const getPendingReq = (http: HttpClient, url: string) => () => {
  return http
    .get<PendingFriendRequestResponse>(url)
    .pipe(map((res) => res.result));
};

type URLFn = (id: string) => string;

const acceptFrndReq = (http: HttpClient, url: URLFn) => (reqId: string) => {
  return http.patch(url(reqId), {});
};

const fetchFriends = (http: HttpClient, url: string) => () => {
  return http.get<FriendListResponse>(url).pipe(map((res) => res.result));
};

@Injectable({
  providedIn: 'root',
})
export class FriendsService {
  private getNonFriendsURL = `${environment.backend_url}/users/non-friends`;
  private createFrndReqURL = `${environment.backend_url}/friend_request`;
  private getPendingReqURL = `${environment.backend_url}/friend_request/pending_requests`;
  private getFrndsListURL = `${environment.backend_url}/users/friends`;

  constructor(
    private http: HttpClient,
    private loginService: LoginService,
    private socket: SocketService
  ) {}
  // alreadySentRequests = alreadySentRequests;
  fetchNonFriends = fetchNonFriends(this.http, this.getNonFriendsURL);
  createFriendRequest = createFriendRequest(
    this.loginService,
    this.http,
    this.socket,
    this.createFrndReqURL
  );
  frndReqURL = (reqId: string) => {
    return `${environment.backend_url}/friend_request/${reqId}/accept`;
  };
  getPendingReq = getPendingReq(this.http, this.getPendingReqURL);
  acceptFrndReq = acceptFrndReq(this.http, this.frndReqURL);
  fetchFriends = fetchFriends(this.http, this.getFrndsListURL);
}
