import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { TodoListCreatePopUpComponent } from './todo-list-create-pop-up/todo-list-create-pop-up.component';
import { TodolistService, TodoList } from './todolist.service';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.css'],
})
export class TodoListComponent implements OnInit {
  userTodoLists: TodoList[] = [];

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
  }

  openCreateBox() {
    const modalRef = this.modalService.open(TodoListCreatePopUpComponent);
    modalRef.result.then((value) => {
      if (value === 'saved') {
        this.loadTodos();
      }
    });
  }
}
