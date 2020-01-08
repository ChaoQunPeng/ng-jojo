import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef,ViewChild } from '@angular/core';
import { NzMessageService, } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { STColumn, STPage } from '@delon/abc';
import { SFSchema, SFComponent } from '@delon/form';
import { STPageConfig, PagingConfig } from 'src/app/config/ST.config';
import { DynamicViewApiService } from 'src/app/routes/dynamic/dynamic-view-api.service';
import { forkJoin } from 'rxjs/internal/observable/forkJoin';
import { <%=classify(module) %>ApiService } from '../<%=module%>-api.service';
import { <%=classify(module) %>Service } from "../<%=module%>.service";
import { <%=classify(name) %>NewComponent } from './<%=name%>-new/<%=name%>-new.component';
import { <%=classify(name) %>EditComponent } from './<%=name%>-edit/<%=name%>-edit.component';


@Component({
  selector: 'app-<%=name%>',
  templateUrl: './<%=name%>.component.html',
  // styleUrls: ['./<%=name%>.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class <%=classify(name) %>Component implements OnInit {
  @ViewChild('sf', { static: false }) sf: SFComponent;
  
  loading = false;
  searchSchema: SFSchema = {
    properties: {

    }
  };
  // #region 动态表格配置对象
  data: any[] = [];
  columns: STColumn[] = [];
  pi: number;
  ps: number;
  total: number;
  page: STPage;
  params: any;
  // #endregion

  constructor(
    private msg: NzMessageService,
    private cdr: ChangeDetectorRef,
    private dynamicViewApiService: DynamicViewApiService,
    private <%=camelize(module) %>ApiService: <%=classify(module) %>ApiService,
    private <%=camelize(module) %>Service: <%=classify(module) %>Service
  ) { }

  ngOnInit() {
    this.page = STPageConfig;
    this.pi = PagingConfig.pi;
    this.ps = PagingConfig.ps;
    this.total = PagingConfig.total;
    
    forkJoin([
      this.dynamicViewApiService.getForm('<%=searchFormName%>')
    ]).subscribe(([res]) => {
      this.searchSchema = JSON.parse(res.Columns);
      // this.searchSchema.properties[""].enum = {};
      this.sf.refreshSchema(this.searchSchema);
    });

    this.getDynamicTable();
  }

  add() {
    const drawerRef = this.<%=camelize(module) %>Service.createNewDrawer();

    drawerRef.afterClose.subscribe(res => {
      if (res) {

      }
    });
  }

  edit(item) {
    const drawerRef = this.<%=camelize(module) %>Service.createEditDrawer(item);

    drawerRef.afterClose.subscribe(res => {
      if (res) {

      }
    });
  }

  del(item) {
    this.loading = true;
    this.<%=camelize(module) %>ApiService.del(item.<%=classify(module) %>ID).subscribe(res => {
      this.msg.success(`删除成功！`);
      this.loading = false;
    });
  }

  getDynamicTable(){
    forkJoin([
      this.dynamicViewApiService.getTable('<%=tableName%>'),
      this.<%=camelize(module) %>ApiService.getPaging(this.pi, this.ps, this.params)
    ]).subscribe(([dynamicCols,paging]) => {

      this.columns = JSON.parse(dynamicCols.Columns);
      this.columns.forEach(e => {
        if (e.index == 'HANDLECOL') {
          e.buttons = [
            {
              text: '编辑',
              type: "drawer",
              drawer: {
                title: "编辑",
                size: 1000,
                component: <%=classify(name) %>EditComponent
              },
              click: (record, callback) => {
                if (callback) {
                  this.getPaging();
                }
              }
            },
            {
              text: '删除',
              type: 'del',
              click: (_record) => {
                this.del(_record);
              }
            }
          ];
        }
      });
      this.columns = [...this.columns];
      this.data = paging.result;
      this.total = paging.page.count;
      this.cdr.detectChanges();
    });
  }

  getPaging(){
    this.<%=camelize(module) %>ApiService.getPaging(this.pi, this.ps, this.params).subscribe(res => {
      this.data = res.result;
      this.total = res.page.count;
    });
  }

  // region searchSchema form
  formSubmit($event) {
    this.params = $event;
    this.getPaging();
  }

  formReset($event) {
    this.params = { };
    this.getPaging();
  }
  // #endregion

  reload() {
    this.getDynamicTable();
  }
}