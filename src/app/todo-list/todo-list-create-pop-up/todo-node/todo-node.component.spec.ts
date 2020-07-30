import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TodoNodeComponent } from './todo-node.component';

describe('TodoNodeComponent', () => {
  let component: TodoNodeComponent;
  let fixture: ComponentFixture<TodoNodeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TodoNodeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TodoNodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
