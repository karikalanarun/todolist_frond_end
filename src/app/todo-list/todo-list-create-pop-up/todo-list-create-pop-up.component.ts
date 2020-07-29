import { Component, OnInit } from '@angular/core';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

type Todo = { text: String; completed: boolean };
type Todos = Todo[];

@Component({
  selector: 'app-todo-list-create-pop-up',
  templateUrl: './todo-list-create-pop-up.component.html',
  styleUrls: ['./todo-list-create-pop-up.component.css'],
})
export class TodoListCreatePopUpComponent implements OnInit {
  title: String = 'Here will be the title';
  currentTodo: String = 'first todo';
  todos: Todos = [{ text: 'added Todo', completed: true }];
  constructor(public activeModal: NgbActiveModal) {}

  addTodo() {
    console.log('addtodo call aavuthu ::: ', this.currentTodo.trim());
    if (this.currentTodo.trim()) {
      this.todos = [
        ...this.todos,
        { text: this.currentTodo, completed: false },
      ];
      this.currentTodo = '';
    }
  }

  ngOnInit(): void {
    // .result.then(
    //   (result) => {
    //     this.closeResult = `Closed with: ${result}`;
    //   },
    //   (reason) => {
    //     this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    //   }
    // );
  }

  save() {
    console.log('title ::: ', this.title);
  }
}
