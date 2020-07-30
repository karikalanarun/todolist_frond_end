import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

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

@Injectable({
  providedIn: 'root',
})
export class TodolistService {
  private createToDoListURL = `${environment.backend_url}/todolist`;
  private getTodoListURL = `${environment.backend_url}/todolist`;
  private updateTodoListURL = `${environment.backend_url}/todolist`;

  constructor(private http: HttpClient) {}

  createTodoList = saveTodoList(this.http, this.createToDoListURL);

  getTodoListOfUSer = getTodoListOfUSer(this.http, this.getTodoListURL);

  updateTodoList = updateTodoList(this.http, this.updateTodoListURL);
}
