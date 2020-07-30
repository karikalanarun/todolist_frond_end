import { Component, OnInit, Input } from '@angular/core';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TodolistService } from '../todolist.service';

type Todo = { text: string; completed: boolean };
type Todos = Todo[];

type PopUpMode = { type: 'create' } | { type: 'edit'; todo_id: string };

@Component({
  selector: 'app-todo-list-create-pop-up',
  templateUrl: './todo-list-create-pop-up.component.html',
  styleUrls: ['./todo-list-create-pop-up.component.css'],
})
export class TodoListCreatePopUpComponent implements OnInit {
  title = 'Here will be the title';
  currentTodo: string = 'first todo';

  @Input()
  todos: Todos = [{ text: 'added Todo', completed: true }];

  @Input()
  mode: PopUpMode = { type: 'create' };

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

  updateTodo(index, todo) {
    this.todos = [
      ...this.todos.slice(0, index),
      todo,
      ...this.todos.slice(index + 1),
    ];
  }

  remove(index) {
    this.todos = [
      ...this.todos.slice(0, index),
      ...this.todos.slice(index + 1),
    ];
  }

  ngOnInit(): void {}

  save() {
    if (this.mode.type === 'create') {
      this.todoListService
        .createTodoList({
          title: this.title,
          todos: this.todos.map((todo) => ({ text_history: [todo.text] })),
        })
        .subscribe(() => {
          this.activeModal.close('saved');
        });
    } else if (this.mode.type === 'edit') {
      this.todoListService
        .updateTodoList(
          {
            title: this.title,
            todos: this.todos.map((todo) => ({ text_history: [todo.text] })),
          },
          this.mode.todo_id
        )
        .subscribe(() => {
          this.activeModal.close('saved');
        });
    }
  }
}
