import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BpmSelectComponent } from './bpm-select.component';

describe('BpmSelectComponent', () => {
  let component: BpmSelectComponent;
  let fixture: ComponentFixture<BpmSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BpmSelectComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BpmSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
