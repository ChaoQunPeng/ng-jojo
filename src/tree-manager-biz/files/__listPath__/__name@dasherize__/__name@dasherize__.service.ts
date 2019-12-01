import { Injectable } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { NzDrawerService, NzDrawerOptions } from 'ng-zorro-antd';
import { <%=classify(module)%> } from '<%=RestfulPath%>/<%=module %>';
import { <%=classify(name)%>NewComponent } from '<%=SharedComponentDirTsConfig%>/<%=module%>/<%=name%>-new/<%=name%>-new.component';
import { <%=classify(name)%>EditComponent } from '<%=SharedComponentDirTsConfig%>/<%=module%>/<%=name%>-edit/<%=name%>-edit.component';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class <%=classify(name)%>Service {
  <%=camelize(module) %> = new <%=classify(module)%>(this.http);

  constructor(
    private http: _HttpClient,
    private drawerService: NzDrawerService
  ) { }
  
  /**
   * 返回tree数据
   * 此处请求相应的tree接口
   */
  getTreeDataList() {
    return of([]);
  }

  /**
   * 删除
   * @param id 
   */
  del(id) {
    return this.<%=camelize(module) %>.delete(id);
  }

}
