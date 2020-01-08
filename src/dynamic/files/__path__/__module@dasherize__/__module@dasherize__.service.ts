import { Injectable } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { NzDrawerService } from 'ng-zorro-antd';
import { <%=classify(name)%>NewComponent } from './<%=name%>/<%=name%>-new/<%=name%>-new.component';
import { <%=classify(name)%>EditComponent } from './<%=name%>/<%=name%>-edit/<%=name%>-edit.component';

const DRAWERWIDTH = 600;

@Injectable({
  providedIn: 'root'
})
export class <%=classify(module)%>Service {

  constructor(
    private drawerService: NzDrawerService
  ) { }

  /**
   * 打开新增抽屉
   */
  createNewDrawer() {
    const drawerRef = this.drawerService.create({
      nzTitle: `新增`,
      nzContent: <%=classify(name)%>NewComponent,
      nzWidth: DRAWERWIDTH
    });

    return drawerRef;
  }

  /**
   * 打开编辑抽屉
   * @param 编辑对象
   */
  createEditDrawer(item) {
    const drawerRef = this.drawerService.create({
      nzTitle: `编辑`,
      nzContent: <%=classify(name)%>EditComponent,
      nzWidth: DRAWERWIDTH,
      nzContentParams: {
        record: item
      }
    });

    return drawerRef;
  }
}