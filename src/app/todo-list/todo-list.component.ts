import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { TodoListCreatePopUpComponent } from './todo-list-create-pop-up/todo-list-create-pop-up.component';

import {
  TodolistService,
  TodoList,
  ProperFriendsTodoList,
} from './todolist.service';
import { FriendsPopupComponent } from './friends-popup/friends-popup.component';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.css'],
})
export class TodoListComponent implements OnInit {
  userTodoLists: TodoList[] = [];

  frndsTodoLists: ProperFriendsTodoList[] = [];

  constructor(
    private modalService: NgbModal,
    private todolistService: TodolistService
  ) {}

  ngOnInit() {
    // const modalRef = this.modalService.open(TodoListCreatePopUpComponent);
    // modalRef.componentInstance.name = 'World';
    this.loadTodos();
  }

  loadTodos() {
    this.todolistService.getTodoListOfUSer().subscribe((todoList) => {
      this.userTodoLists = todoList;
    });
    this.todolistService
      .fetchFrndsTodoList()
      .subscribe((lists) => (this.frndsTodoLists = lists));
  }

  openCreateBox() {
    const modalRef = this.modalService.open(TodoListCreatePopUpComponent);
    modalRef.result.then((value) => {
      if (value === 'saved') {
        this.loadTodos();
      }
    });
  }

  openEditor(todoList) {
    console.log('todoList ::: ', todoList);
    const modalRef = this.modalService.open(TodoListCreatePopUpComponent);
    modalRef.componentInstance.mode = { type: 'edit', todo_id: todoList._id };
    modalRef.componentInstance.title = todoList.title;
    modalRef.componentInstance.currentTodo = '';
    modalRef.componentInstance.todos = todoList.todos.map((todo) => ({
      text: todo.text_history[todo.text_history.length - 1],
      completed: todo.completed,
    }));
    modalRef.result.then((value) => {
      if (value === 'saved') {
        this.loadTodos();
      }
    });
  }

  openFriendsPopup() {
    const modalRef = this.modalService.open(FriendsPopupComponent);
    modalRef.result.then((value) => {
      if (value === 'saved') {
        this.loadTodos();
      }
    });
  }
}
