import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OffresParticulieresComponent } from './offres-particulieres.component';

describe('OffresParticulieresComponent', () => {
  let component: OffresParticulieresComponent;
  let fixture: ComponentFixture<OffresParticulieresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OffresParticulieresComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OffresParticulieresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
