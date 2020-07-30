import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

type Todo = { text: string; completed: boolean; todos?: Todo[] };

type NodeMode = { type: 'edit' } | { type: 'show' };

@Component({
  selector: 'app-todo-node',
  templateUrl: './todo-node.component.html',
  styleUrls: ['./todo-node.component.css'],
})
export class TodoNodeComponent implements OnInit {
  mode: NodeMode = { type: 'show' };
  @Input() todo: Todo;
  editedText = this.todo;

  @Output()
  todoChange: EventEmitter<Todo> = new EventEmitter();

  constructor() {}

  ngOnInit(): void {}

  switchToEditMode() {
    this.mode = { type: 'edit' };
  }

  updateCompleted(completed: boolean) {
    this.todoChange.emit({ ...this.todo, completed });
  }

  switchToShowMode() {
    this.mode = { type: 'show' };
  }
}
