import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TodoListCreatePopUpComponent } from './todo-list-create-pop-up.component';

describe('TodoListCreatePopUpComponent', () => {
  let component: TodoListCreatePopUpComponent;
  let fixture: ComponentFixture<TodoListCreatePopUpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TodoListCreatePopUpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TodoListCreatePopUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
