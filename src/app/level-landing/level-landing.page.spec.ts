import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LevelLandingPage } from './level-landing.page';

describe('LevelLandingPage', () => {
  let component: LevelLandingPage;
  let fixture: ComponentFixture<LevelLandingPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LevelLandingPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LevelLandingPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
