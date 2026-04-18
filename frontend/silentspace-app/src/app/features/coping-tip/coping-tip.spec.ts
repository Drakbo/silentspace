import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CopingTip } from './coping-tip';

describe('CopingTip', () => {
  let component: CopingTip;
  let fixture: ComponentFixture<CopingTip>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CopingTip],
    }).compileComponents();

    fixture = TestBed.createComponent(CopingTip);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
