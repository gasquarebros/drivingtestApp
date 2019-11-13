import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DemoLandingPage } from './demo-landing.page';

describe('DemoLandingPage', () => {
  let component: DemoLandingPage;
  let fixture: ComponentFixture<DemoLandingPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DemoLandingPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DemoLandingPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
