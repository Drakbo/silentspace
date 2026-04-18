import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MoodLogs } from './mood-logs';

describe('MoodLogs', () => {
  let component: MoodLogs;
  let fixture: ComponentFixture<MoodLogs>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MoodLogs],
    }).compileComponents();

    fixture = TestBed.createComponent(MoodLogs);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
