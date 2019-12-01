import { Injectable } from '@angular/core';
import { CommonDict } from 'src/app/restful/common-dict';
import { _HttpClient } from '@delon/theme';
import { NzDrawerService, NzDrawerOptions } from 'ng-zorro-antd';
import { <%=classify(module)%> } from '<%=RestfulPath%>/<%=camelize(module) %>';
import { <%=classify(name)%>NewComponent } from './<%=name%>-new.component';

@Injectable({
  providedIn: 'root'
})
export class <%=classify(name)%>NewService {
  <%=camelize(module) %> = new <%=classify(module)%>(this.http);

  constructor(
    private http: _HttpClient,
    private drawerService: NzDrawerService
  ) { }

  /**
   * 打开新增抽屉
   * @param options drawer配置
   */
  createNewDrawer(options?: NzDrawerOptions) {
    const drawerRef = this.drawerService.create<<%=classify(name)%>NewComponent>({
      nzTitle: `新增${options && options.nzTitle ? options.nzTitle : ''}`,
      nzContent:<%=classify(name)%>NewComponent,
      nzWidth: 600
    });

    return drawerRef;
  }
}