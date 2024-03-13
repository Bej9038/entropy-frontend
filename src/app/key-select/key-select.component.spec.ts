import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KeySelectComponent } from './key-select.component';

describe('KeySelectComponent', () => {
  let component: KeySelectComponent;
  let fixture: ComponentFixture<KeySelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KeySelectComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KeySelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
