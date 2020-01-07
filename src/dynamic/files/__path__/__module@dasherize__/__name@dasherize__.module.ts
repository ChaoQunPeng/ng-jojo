import { NgModule } from '@angular/core';
import { SharedModule } from '@shared';
import { <%=classify(module)%>RoutingModule } from './<%=classify(module)%>-routing.module';
import { <%=classify(name)%>Component } from './<%=name%>/<%=name%>.component';
import { <%=classify(name)%>NewComponent } from './<%=name%>/<%=name%>-new/<%=name%>-new.component';
import { <%=classify(name)%>EditComponent } from './<%=name%>/<%=name%>-edit/<%=name%>-edit.component';

const COMPONENTS = [
  <%=classify(name)%>Component,
  <%=classify(name)%>NewComponent,
  <%=classify(name)%>EditComponent
];

@NgModule({
  imports: [
    SharedModule,
    <%=classify(module)%>RoutingModule
  ],
  declarations: [
    ...COMPONENTS,
  ],
  entryComponents: [
    ...COMPONENTS
  ]
})
export class <%=classify(module)%>Module { }
