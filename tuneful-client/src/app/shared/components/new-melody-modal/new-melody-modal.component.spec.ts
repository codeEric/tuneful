import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewMelodyModalComponent } from './new-melody-modal.component';

describe('NewMelodyModalComponent', () => {
  let component: NewMelodyModalComponent;
  let fixture: ComponentFixture<NewMelodyModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewMelodyModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewMelodyModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
