import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PianoNoteComponent } from './piano-note.component';

describe('PianoNoteComponent', () => {
  let component: PianoNoteComponent;
  let fixture: ComponentFixture<PianoNoteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PianoNoteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PianoNoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
