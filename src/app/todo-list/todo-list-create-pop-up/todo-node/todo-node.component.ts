import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

type Todo = { text: string; completed: true; todos?: Todo[] };

type NodeMode = 'edit' | 'show';

@Component({
  selector: 'app-todo-node',
  templateUrl: './todo-node.component.html',
  styleUrls: ['./todo-node.component.css'],
})
export class TodoNodeComponent implements OnInit {
  mode: NodeMode = 'show';
  @Input() todo: Todo;

  @Output()
  todoChange: EventEmitter<Todo> = new EventEmitter();

  constructor() {}

  ngOnInit(): void {}
}
