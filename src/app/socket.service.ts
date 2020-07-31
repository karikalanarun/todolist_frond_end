import { Injectable } from '@angular/core';
import io from 'socket.io-client';
import { environment } from 'src/environments/environment';
import { LoginService } from './login/login.service';
import { fromEvent, Observable } from 'rxjs';
import { UserDetails } from './todo-list/friends-popup/friends.service';

type UserDetail = {
  _id: string;
  email: string;
  first_name: string;
  last_name: string;
};

export type TodoListEventData = {
  user: UserDetail;
  title: string;
  event: 'created' | 'updated' | 'removed';
  owner: UserDetail;
};

type InputTodoListEventData = {
  userId: StringConstructor;
  title: string;
  event: 'created' | 'updated' | 'removed';
  owner: string;
};

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  socket;
  private friendReq$: Observable<UserDetail>;
  private todoLists$: Observable<TodoListEventData>;
  constructor(private loginService: LoginService) {}

  setupSocket() {
    this.socket = io(environment.SOCKET_ENDPOINT);
    this.socket.emit(
      'connectToAllChannels',
      this.loginService.getLoginUserID()
    );
    this.friendReq$ = fromEvent<UserDetail>(this.socket, 'friend-request');
    this.todoLists$ = fromEvent<TodoListEventData>(this.socket, 'todo-list');
  }
  friendRequests() {
    return this.friendReq$;
  }

  todolists() {
    return this.todoLists$;
  }

  friendReqGiven({
    raised_by,
    raised_to,
  }: {
    raised_by: string;
    raised_to: string;
  }) {
    console.log('friend request given');
    this.socket.emit('friend-request', { raised_to, raised_by });
  }

  sendTodoListEvent(event: InputTodoListEventData) {
    console.log('todo list event');
    this.socket.emit('todo-list', event);
  }
}
