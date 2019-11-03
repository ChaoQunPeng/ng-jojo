

<% if(listComponentType=='static') { %>
import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { <%=classify(module) %> } from 'src/app/biz/restful/<%=module%>';
  
@Component({
    selector: 'app-<%=dasherize(name)%>',
    templateUrl: './<%=dasherize(name)%>.component.html',
    //styleUrls: ['./<%=dasherize(name)%>.component.less'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class <%=classify(name) %>Component implements OnInit {
    <%=camelize(module) %> = new <%=classify(module) %> (this.http);
  
    dataSet: any[] = [];
    pageNum: number = 1;
    pageSize: number = 10;
    pageCount: number = 0;
    bodyParams = {};
  
    newIsVisible = false;
    editIsVisible = false;
    editItem: any; // 编辑的数据对象
    loading = false;
    constructor(
      public http: _HttpClient,
      private msg: NzMessageService,
      private cdr: ChangeDetectorRef
    ) { }
  
    ngOnInit() {
      this.getPaging();
    }
  
    getPaging() {
      this.loading = true;
      this.<%=camelize(module) %>.paging(this.pageNum, this.pageSize, this.bodyParams).subscribe(res => {
        this.dataSet = res.result;
        this.pageNum = res.page.num;
        this.pageSize = res.page.size;
        this.pageCount = res.page.count;
        this.loading = false;
        this.cdr.detectChanges();
      });
    }
  
    pageNumChange() {
      this.getPaging();
    }
  
    pageSizeChange() {
      this.getPaging();
    }
  
    refresh() {
      this.getPaging();
    }
  
    add() {
      this.newIsVisible = !this.newIsVisible;
    }
  
    del(item) {
      /**
       * 这里记得把id改成实际
       */
      this.<%=camelize(module) %>.delete(item.id).subscribe(res => {
        if (res.EffectCount) {
          this.msg.success(`删除成功！`);
          this.getPaging();
        } else {
          this.msg.error(`删除失败！`);
        }
        this.cdr.detectChanges();
      });
    }
  
    edit(item) {
      this.editItem = { ...item };
      this.editIsVisible = !this.editIsVisible;
    }
  
    handleNewChange(event) {
      if (event) {
        this.getPaging();
      }
    }
  
    handleEditChange() {
      if (event) {
        this.getPaging();
      }
    }
  
}
<% } else { %>
import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, ViewChild } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { <%=classify(module) %> } from 'src/app/biz/restful/<%=module%>';
import { DynamicView } from 'src/app/restful/dynamic-view';
import { STComponent, STColumn } from '@delon/abc';

@Component({
  selector: 'app-<%=dasherize(name)%>',
  templateUrl: './<%=dasherize(name)%>.component.html',
  //styleUrls: ['./<%=dasherize(name)%>.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class <%=classify(name) %>Component implements OnInit {
  @ViewChild('st', { static: false }) st: STComponent;
  <%=camelize(module) %> = new <%=classify(module) %> (this.http);

  columns: STColumn[] = [];
  dataSet: any[] = [];
  bodyParams = {};

  newIsVisible = false;
  editIsVisible = false;
  loading = false;

  dynamicView = new DynamicView(this.http);

  constructor(
    public http: _HttpClient,
    private msg: NzMessageService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.getPaging();
  }

  /**
   * 获取列表分页数据
   */
  getPaging() {
    this.loading = true;
    this.<%=camelize(module) %>.paging().subscribe(res => {
      this.dataSet = res;
      this.loading = false;
      this.cdr.detectChanges();
    });

    this.dynamicView.getTable('表格的名称').subscribe(res => {
      this.columns = JSON.parse(res.Columns);
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
    this.newIsVisible = !this.newIsVisible;
  }

  /**
   * 动态表格响应事件
   * @param $event 回调事件
   */
  change($event) {

  }
}
<% } %>