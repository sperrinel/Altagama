import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailCodeComponent } from './detail-code.component';

describe('DetailCodeComponent', () => {
  let component: DetailCodeComponent;
  let fixture: ComponentFixture<DetailCodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailCodeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
