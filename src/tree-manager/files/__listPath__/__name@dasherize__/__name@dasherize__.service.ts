// import { Injectable } from '@angular/core';
// import { CommonDict } from 'src/app/restful/common-dict';
// import { _HttpClient } from '@delon/theme';
// import { NzDrawerService, NzDrawerOptions } from 'ng-zorro-antd';
// import { <%=classify(name)%>NewComponent } from '@shared/components/<%=module%>/<%=name%>-new/<%=name%>-new.component';
// import { <%=classify(name)%>EditComponent } from '@shared/components/<%=module%>/<%=name%>-edit/<%=name%>-edit.component';

// @Injectable({
//   providedIn: 'root'
// })
// export class <%=classify(name)%>Service {
//   <%=name%> = new <%=classify(name)%>(this.http);

//   constructor(
//     private http: _HttpClient,
//     private drawerService: NzDrawerService
//   ) { }
  
//   /**
//    * 返回tree数据
//    * 此处请求相应的tree接口
//    */
//   getTreeDataList() {
//     return;
//   }

//   /**
//    * 删除
//    * @param id 
//    */
//   del(id) {
//     return this.<%=camelize(module) %>.del(id);
//   }

//   /**
//    * 打开新增抽屉
//    * @param options drawer配置
//    */
//   createNewDrawer() {
//     const drawerRef = this.drawerService.create<any>({
//       nzTitle: `新增`,
//       nzWidth: 600,
//       nzContent: <%=classify(name)%>NewComponent
//     });

//     return drawerRef;
//   }

//   /**
//    * 打开编辑抽屉
//    * @param options drawer配置
//    */
//   createEditDrawer(options: NzDrawerOptions) {
//     const drawerRef = this.drawerService.create<any>({
//       nzTitle: `编辑-${options.nzTitle}`,
//       nzWidth: 600,
//       nzContent: <%=classify(name)%>EditComponent,
//       nzContentParams: {
//         record: options.nzContentParams
//       }
//     });

//     return drawerRef;
//   }
// }
