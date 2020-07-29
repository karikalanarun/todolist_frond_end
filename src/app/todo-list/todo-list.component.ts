import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { TodoListCreatePopUpComponent } from './todo-list-create-pop-up/todo-list-create-pop-up.component';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.css'],
})
export class TodoListComponent implements OnInit {
  constructor(private modalService: NgbModal) {}

  ngOnInit() {
    const modalRef = this.modalService.open(TodoListCreatePopUpComponent);
    // modalRef.componentInstance.name = 'World';
  }

  openCreateBox() {
    this.modalService.open(TodoListCreatePopUpComponent);
  }
}
