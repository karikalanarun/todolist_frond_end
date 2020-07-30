import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FriendsPopupComponent } from './friends-popup.component';

describe('FriendsPopupComponent', () => {
  let component: FriendsPopupComponent;
  let fixture: ComponentFixture<FriendsPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FriendsPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FriendsPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
