import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ADomicileComponent } from './a-domicile.component';

describe('ADomicileComponent', () => {
  let component: ADomicileComponent;
  let fixture: ComponentFixture<ADomicileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ADomicileComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ADomicileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
