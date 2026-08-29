import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeeManager } from './fee-manager';

describe('FeeManager', () => {
  let component: FeeManager;
  let fixture: ComponentFixture<FeeManager>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeeManager],
    }).compileComponents();

    fixture = TestBed.createComponent(FeeManager);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
