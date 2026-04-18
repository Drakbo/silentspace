import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MoodHistory } from './mood-history';

describe('MoodHistory', () => {
  let component: MoodHistory;
  let fixture: ComponentFixture<MoodHistory>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MoodHistory],
    }).compileComponents();

    fixture = TestBed.createComponent(MoodHistory);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
