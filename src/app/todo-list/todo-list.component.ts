import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { TodoListCreatePopUpComponent } from './todo-list-create-pop-up/todo-list-create-pop-up.component';

import {
  TodolistService,
  TodoList,
  ProperFriendsTodoList,
} from './todolist.service';
import { FriendsPopupComponent } from './friends-popup/friends-popup.component';
import { LoginService } from '../login/login.service';
import { Subscription } from 'rxjs';
import { AppToastService } from '../app-toast-service.service';
import { SocketService, TodoListEventData } from '../socket.service';

const showTodoEvents = (
  toast: AppToastService,
  event: TodoListEventData
): void => {
  console.log('event ::: ', event);
  if (event.event === 'created') {
    return toast.show(
      `"${event.user.first_name} ${event.user.last_name}" created new todo list`,
      `"${event.user.first_name} ${event.user.last_name}" created a todo list with the title "${event.title}"`
    );
  } else if (event.event === 'removed') {
    return toast.show(
      `"${event.user.first_name} ${event.user.last_name}" removed a todo list`,
      `"${event.user.first_name} ${event.user.last_name}" removed a todo list with the title "${event.title}"`
    );
  } else if (event.event === 'updated') {
    if (event.user._id === event.owner._id) {
      return toast.show(
        `"${event.user.first_name} ${event.user.last_name}" updated todo list`,
        `"${event.user.first_name} ${event.user.last_name}" update the todo list with the title "${event.title}"`
      );
    } else {
      return toast.show(
        `"${event.user.first_name} ${event.user.last_name}" updated todo list of "${event.owner.first_name} ${event.owner.last_name}"`,
        `"${event.user.first_name} ${event.user.last_name}" updated the todo list with the title "${event.title}"`
      );
    }
  }
};

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.css'],
})
export class TodoListComponent implements OnInit, OnDestroy {
  userTodoLists: TodoList[] = [];

  frndsTodoLists: ProperFriendsTodoList[] = [];

  friendReqSubscriptions: Subscription;
  todoListSubscription: Subscription;

  constructor(
    private modalService: NgbModal,
    private todolistService: TodolistService,
    public loginService: LoginService,
    private toast: AppToastService,
    private socket: SocketService
  ) {}

  ngOnInit() {
    this.loadTodos();
    this.friendReqSubscriptions = this.socket
      .friendRequests()
      .subscribe((userWhoGave) => {
        this.toast.show(
          'New Friend Request',
          `${userWhoGave.first_name} ${userWhoGave.last_name} gave friend request to you`
        );
      });

    this.todoListSubscription = this.socket
      .todolists()
      .subscribe((todoListEvent) => {
        showTodoEvents(this.toast, todoListEvent);
        this.loadTodos();
        this.playAudio();
      });
  }

  ngOnDestroy() {
    this.friendReqSubscriptions.unsubscribe();
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

  openEditor(todoList, owner: 'own' | string) {
    console.log('todoList ::: ', todoList);
    const modalRef = this.modalService.open(TodoListCreatePopUpComponent);
    modalRef.componentInstance.mode = {
      type: 'edit',
      todo_id: todoList._id,
      owner,
    };
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

  playAudio() {
    let audio = new Audio();
    audio.src = '../../assets/juntos.mp3';
    audio.load();
    audio.play();
  }

  openFriendsPopup() {
    const modalRef = this.modalService.open(FriendsPopupComponent);
    modalRef.result.then(
      () => {
        this.loadTodos();
      },
      () => {
        this.loadTodos();
      }
    );
  }
}
