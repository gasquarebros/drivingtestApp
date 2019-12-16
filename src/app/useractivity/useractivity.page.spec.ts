import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UseractivityPage } from './useractivity.page';

describe('UseractivityPage', () => {
  let component: UseractivityPage;
  let fixture: ComponentFixture<UseractivityPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UseractivityPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UseractivityPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
