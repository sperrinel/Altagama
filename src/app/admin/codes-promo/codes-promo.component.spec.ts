import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CodesPromoComponent } from './codes-promo.component';

describe('CodesPromoComponent', () => {
  let component: CodesPromoComponent;
  let fixture: ComponentFixture<CodesPromoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CodesPromoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CodesPromoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
