import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { UserDetails } from './friends-popup/friends.service';
import { Observable } from 'rxjs';

export type SingleTodoListResponse = { _id: string } & TodoList;

export type TodoListResponse = {
  status: number;
  message: string;
  result: SingleTodoListResponse[];
};

export type Todo = {
  text_history: string[];
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

const updateTodoList = (http: HttpClient, url: string) => (
  list: TodoList,
  id: string
) => {
  return http.put(`${url}/${id}`, list);
};

const saveTodoList = (http: HttpClient, url: string) => (list: TodoList) => {
  return http.post(url, list);
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
  private fetchFrndsTodoListURL = `${environment.backend_url}/todolist/friends`;

  constructor(private http: HttpClient) {}

  createTodoList = saveTodoList(this.http, this.createToDoListURL);

  getTodoListOfUSer = getTodoListOfUSer(this.http, this.getTodoListURL);

  updateTodoList = updateTodoList(this.http, this.updateTodoListURL);

  fetchFrndsTodoList = fetchFrndsTodoList(
    this.http,
    this.fetchFrndsTodoListURL
  );
}
