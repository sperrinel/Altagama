import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalAddPanierComponent } from './modal-add-panier.component';

describe('ModalAddPanierComponent', () => {
  let component: ModalAddPanierComponent;
  let fixture: ComponentFixture<ModalAddPanierComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalAddPanierComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalAddPanierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
