import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EquipoListComponent } from './equipo-list.component';

describe('EquipoListComponent', () => {
  let component: EquipoListComponent;
  let fixture: ComponentFixture<EquipoListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EquipoListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EquipoListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
