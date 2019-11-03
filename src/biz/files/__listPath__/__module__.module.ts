import { NgModule } from '@angular/core';
import { SharedModule } from '@shared';
import { <%=classify(module) %>RoutingModule } from './<%=module %>-routing.module';
import { <%=classify(name) %>Component } from './<%=name %>/<%=name %>.component';
import { BizSharedModule } from '../../shared/biz.shared.module';

const COMPONENTS = [
    <%=classify(name) %>Component];
const COMPONENTS_NOROUNT = [];

@NgModule({
  imports: [
    SharedModule,
    BizSharedModule,
    <%=classify(module) %>RoutingModule
  ],
  declarations: [
    ...COMPONENTS,
    ...COMPONENTS_NOROUNT
  ],
  entryComponents: COMPONENTS_NOROUNT
})
export class <%=classify(module) %>Module { }
