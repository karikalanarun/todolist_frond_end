import { Component, OnInit } from '@angular/core';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TodolistService } from '../todolist.service';

type Todo = { text: string; completed: boolean };
type Todos = Todo[];

@Component({
  selector: 'app-todo-list-create-pop-up',
  templateUrl: './todo-list-create-pop-up.component.html',
  styleUrls: ['./todo-list-create-pop-up.component.css'],
})
export class TodoListCreatePopUpComponent implements OnInit {
  title = 'Here will be the title';
  currentTodo: string = 'first todo';
  todos: Todos = [{ text: 'added Todo', completed: true }];

  constructor(
    public activeModal: NgbActiveModal,
    private todoListService: TodolistService
  ) {}

  addTodo() {
    if (this.currentTodo.trim()) {
      this.todos = [
        ...this.todos,
        { text: this.currentTodo, completed: false },
      ];
      this.currentTodo = '';
    }
  }

  ngOnInit(): void {}

  save() {
    this.todoListService
      .createTodoList({
        title: this.title,
        todos: this.todos.map((todo) => ({ text_history: [todo.text] })),
      })
      .subscribe(() => {
        this.activeModal.close('saved');
      });
  }
}
