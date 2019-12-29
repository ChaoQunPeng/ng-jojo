import { Injectable } from '@angular/core';
import { CommonDict } from 'src/app/restful/common-dict';
import { _HttpClient } from '@delon/theme';
import { NzDrawerService, NzDrawerOptions } from 'ng-zorro-antd';
import { <%=classify(module)%> } from '<%=RestfulPath%>/<%=camelize(module) %>';
import { <%=classify(name)%>EditComponent } from './<%=name%>-edit.component';

@Injectable({
  providedIn: 'root'
})
export class <%=classify(name)%>EditService {
  <%=camelize(module) %> = new <%=classify(module)%>(this.http);

  constructor(
    private http: _HttpClient,
    private drawerService: NzDrawerService
  ) { }

  /**
   * 打开编辑抽屉
   * @param options drawer配置
   */
  createDrawer(options?: NzDrawerOptions) {
    const drawerRef = this.drawerService.create<<%=classify(name)%>EditComponent>({
      nzTitle: `编辑-${options && options.nzTitle ? options.nzTitle : ''}`,
      nzContent:<%=classify(name)%>EditComponent,
      nzWidth: 600,
      nzContentParams: {
        record: options.nzContentParams
      }
    });

    return drawerRef;
  }
}