import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { map, mapTo, tap } from 'rxjs/operators';
import { UserDetails } from './friends-popup/friends.service';
import { Observable, timer } from 'rxjs';
import { SocketService } from '../socket.service';
import { LoginService } from '../login/login.service';

export type SingleTodoListResponse = { _id: string } & TodoList;

export type TodoListResponse = {
  status: number;
  message: string;
  result: SingleTodoListResponse[];
};

export type Todo = {
  text_history: string[];
  completed: boolean;
};

export type TodoList = {
  title: string;
  todos: Todo[];
};

type Response<T> = {
  status: number;
  message: string;
  result: T;
};

type FriendsTodoList = {
  _id: string;
  title: string;
  todos: Todo[];
  created_by: UserDetails;
};

type FriendsTodoListResponse = Response<FriendsTodoList[]>;

export type ProperFriendsTodoList = {
  user: UserDetails;
  lists: FriendsTodoList[];
};

const updateTodoList = (
  http: HttpClient,
  url: string,
  socket: SocketService,
  loginService: LoginService
) => (list: TodoList, id: string, owner: string) => {
  return http.put(`${url}/${id}`, list).pipe(
    tap(() => {
      console.log('sent to server ::: ');
      socket.sendTodoListEvent({
        userId: loginService.getLoginUserID(),
        title: list.title,
        owner: owner === 'own' ? loginService.getLoginUserID() : owner,
        event: 'updated',
      });
    })
  );
};

const removeTodoList = (
  http: HttpClient,
  url: string,
  socket: SocketService,
  loginService: LoginService
) => (id: string, title: string) => {
  return http.delete(`${url}/${id}`).pipe(
    tap(() => {
      console.log('sent to server ::: ');
      socket.sendTodoListEvent({
        userId: loginService.getLoginUserID(),
        title: title,
        owner: loginService.getLoginUserID(),
        event: 'removed',
      });
    })
  );
};

const saveTodoList = (
  http: HttpClient,
  url: string,
  socket: SocketService,
  loginService: LoginService
) => (list: TodoList) => {
  return http.post(url, list).pipe(
    tap(() => {
      socket.sendTodoListEvent({
        userId: loginService.getLoginUserID(),
        title: list.title,
        owner: loginService.getLoginUserID(),
        event: 'created',
      });
    })
  );
};

const getTodoListOfUSer = (http: HttpClient, url: string) => () => {
  return http.get<TodoListResponse>(url).pipe(map((res) => res.result));
};

const fetchFrndsTodoList = (http: HttpClient, url: string) => (): Observable<
  ProperFriendsTodoList[]
> => {
  return http
    .get<FriendsTodoListResponse>(url)
    .pipe(map((res) => res.result))
    .pipe(
      map((todos) => {
        return Object.values(
          todos.reduce((todoMap, todo) => {
            const userLists = todoMap[todo.created_by._id];
            if (!userLists) {
              todoMap[todo.created_by._id] = {
                user: todo.created_by,
                lists: [todo],
              };
            } else {
              todoMap[todo.created_by._id].lists.push(todo);
            }
            return todoMap;
          }, {})
        );
      })
    );
};

@Injectable({
  providedIn: 'root',
})
export class TodolistService {
  private createToDoListURL = `${environment.backend_url}/todolist`;
  private getTodoListURL = `${environment.backend_url}/todolist`;
  private updateTodoListURL = `${environment.backend_url}/todolist`;
  private removeTodoListURL = `${environment.backend_url}/todolist`;
  private fetchFrndsTodoListURL = `${environment.backend_url}/todolist/friends`;

  constructor(
    private http: HttpClient,
    private socket: SocketService,
    private loginService: LoginService
  ) {
    this.socket.setupSocket();
  }

  createTodoList = saveTodoList(
    this.http,
    this.createToDoListURL,
    this.socket,
    this.loginService
  );

  getTodoListOfUSer = getTodoListOfUSer(this.http, this.getTodoListURL);

  updateTodoList = updateTodoList(
    this.http,
    this.updateTodoListURL,
    this.socket,
    this.loginService
  );

  removeTodoList = removeTodoList(
    this.http,
    this.removeTodoListURL,
    this.socket,
    this.loginService
  );

  fetchFrndsTodoList = fetchFrndsTodoList(
    this.http,
    this.fetchFrndsTodoListURL
  );

  connectForNotification(): Observable<Object> {
    return timer(5000).pipe(mapTo({ type: 'awesome' }));
  }
}
