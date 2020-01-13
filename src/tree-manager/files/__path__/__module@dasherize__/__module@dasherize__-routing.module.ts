import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { <%=classify(name)%>Component } from './<%=name%>/<%=name%>.component';

const routes: Routes = [
  { path: '<%=name%>', component: <%=classify(name)%>Component, data: { title: "<%=tabTitle%>" } }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class <%=classify(module)%>RoutingModule { }