import { Injectable } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { NzDrawerService, NzDrawerOptions } from 'ng-zorro-antd';
import { <%=classify(module)%> } from '<%=RestfulPath%>/<%=module %>';

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
   * 删除
   * @param id 
   */
  del(id) {
    return this.<%=camelize(module) %>.delete(<%=classify(module)%>ID);
  }

}