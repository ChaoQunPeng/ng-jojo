import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, ViewChild } from '@angular/core';
import { NzMessageService, NzDrawerService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { DynamicView } from 'src/app/restful/dynamic-view';
import { STColumn, STPage, STComponent } from '@delon/abc';
import { SFSchema, SFComponent } from '@delon/form';
import { forkJoin } from 'rxjs/internal/observable/forkJoin';
import { STPageConfig, PagingConfig } from '@core/config/ST.config';
import { <%=classify(module) %> } from 'src/app/biz/restful/<%=module%>';
import { <%=classify(name) %>NewComponent } from '@bizComponents/<%=module %>/<%=name %>-new/<%=name %>-new.component';
import { <%=classify(name) %>EditComponent } from '@bizComponents/<%=module %>/<%=name %>-edit/<%=name %>-edit.component';


@Component({
  selector: 'app-<%=dasherize(name)%>',
  templateUrl: './<%=dasherize(name)%>.component.html',
  //styleUrls: ['./<%=dasherize(name)%>.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class <%=classify(name) %>Component implements OnInit {
  @ViewChild('sf', { static: false }) sf: SFComponent;
  @ViewChild('st', { static: false }) st: STComponent;
  dynamicView = new DynamicView(this.http);

  <%=camelize(module) %> = new <%=classify(module) %> (this.http);

  dataSet: any[] = [];
  bodyParams = {};
  loading = false;
  // 动态搜索表单
  searchSchema: SFSchema = {
    properties: {

    }
  };
  // #region 动态表格配置对象
  columns: STColumn[] = [];
  pi: number;
  ps: number;
  total: number;
  page: STPage;
  // #endregion

  constructor(
    public http: _HttpClient,
    private msg: NzMessageService,
    private drawerService: NzDrawerService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.page = STPageConfig;
    this.pi = PagingConfig.pi;
    this.ps = PagingConfig.ps;
    this.total = PagingConfig.total;
    this.getPaging();

    forkJoin([
      this.dynamicView.getForm('动态表单名称')
    ]).subscribe(([res]) => {
      this.searchSchema = JSON.parse(res.Columns);
      // this.searchSchema.properties[""].enum = {};
      this.sf.refreshSchema(this.searchSchema);
    });

    this.dynamicView.getTable(`动态表格名称`).subscribe(res => {
      this.columns = JSON.parse(res.Columns);
      // 这里循环找到动态列按钮的字段，然后给注册点击和编辑事件，下面的是例子
      // this.columns.forEach(e => {
      //   if (e.index == 'handle') {
      //     e.buttons = [
      //       {
      //         text: '编辑',
      //         type: "drawer",
      //         drawer: {
      //           title: "编辑",
      //           size: 600,
      //           component: <%=classify(name) %>EditComponent
      //         },
      //         click: (record, callback) => {
      //           if (callback) {
      //             this.getPaging();
      //           }
      //         }
      //       },
      //       {
      //         text: '删除',
      //         type: 'del',
      //         click: (_record) => {
      //           this.del(_record);
      //         }
      //       }
      //     ];
      //   }
      // });
      this.cdr.detectChanges();
    });
  }

  /**
   * 获取列表分页数据
   */
  getPaging() {
    this.loading = true;
    this.<%=camelize(module) %>.paging(this.pi, this.ps, this.bodyParams).subscribe(res => {
      this.dataSet = res.result;
      this.total = res.page.count;
      this.loading = false;
      this.cdr.detectChanges();
    });
  }

  /**
   * 刷新数据，保留查询参数
   */
  refresh() {
    this.getPaging();
  }

  /**
   * 打开新增组件
   */
  add() {
    const drawerRef = this.drawerService.create({
      nzTitle: '<%=classify(name) %>NewComponent',
      nzContent: <%=classify(name) %>NewComponent,
      nzWidth: 600
    });

  drawerRef.afterClose.subscribe(res => {
    if (res) {
      this.getPaging();
    }
  });
}

del(item) {
  this.<%=camelize(module) %>.delete(item.<%=classify(name) %>ID).subscribe(res => {
    this.msg.success(`删除成功！`);
    this.getPaging();
    this.cdr.detectChanges();
  });
}

// region searchSchema form
formSubmit($event) {
  this.bodyParams = $event;
  this.getPaging();
}

formReset($event) {
  this.bodyParams = {};
  this.getPaging();
}
// #endregion

/**
 * 动态表格响应事件
 * @param $event 
 */
change(event) {
  switch (event.type) {
    case "pi":
      this.pi = event.pi;
      this.getPaging();
      break;
    case "ps":
      this.ps = event.ps;
      this.getPaging();
    default:
      break;
  }
}
}