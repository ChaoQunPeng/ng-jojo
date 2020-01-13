import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { <%=classify(name)%>EditComponent } from './<%=name%>-edit.component';

describe('<%=classify(name)%>EditComponent', () => {
  let component: <%=classify(name)%>EditComponent;
  let fixture: ComponentFixture<<%=classify(name)%>EditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ <%=classify(name)%>EditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(<%=classify(name)%>EditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
