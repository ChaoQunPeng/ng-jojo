import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { <%=classify(name)%>NewComponent } from './<%=name%>-new.component';

describe('<%=classify(name)%>NewComponent', () => {
  let component: <%=classify(name)%>NewComponent;
  let fixture: ComponentFixture<<%=classify(name)%>NewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ <%=classify(name)%>NewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(<%=classify(name)%>NewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
