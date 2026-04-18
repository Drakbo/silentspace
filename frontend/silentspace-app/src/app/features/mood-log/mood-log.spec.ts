import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MoodLog } from './mood-log';

describe('MoodLog', () => {
  let component: MoodLog;
  let fixture: ComponentFixture<MoodLog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MoodLog],
    }).compileComponents();

    fixture = TestBed.createComponent(MoodLog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
