import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DegustationsComponent } from './degustations.component';

describe('DegustationsComponent', () => {
  let component: DegustationsComponent;
  let fixture: ComponentFixture<DegustationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DegustationsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DegustationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
