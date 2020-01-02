

import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { NzMessageService, NzDrawerService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
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
    <%=camelize(module) %> = new <%=classify(module) %> (this.http);
  
    dataSet: any[] = [];
    pageNum: number = 1;
    pageSize: number = 10;
    pageCount: number = 0;
    bodyParams = {};

    loading = false;
    constructor(
      public http: _HttpClient,
      private msg: NzMessageService,
      private cdr: ChangeDetectorRef,
      private drawerService: NzDrawerService
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
      const drawerRef = this.drawerService.create({
        nzTitle: `新增`,
        nzContent: <%=classify(name) %>NewComponent
      });
  
      drawerRef.afterClose.subscribe(res => {
        if (res) {
          this.getPaging();
        }
      });
    }
  
    del(item) {
      this.<%=classify(module) %>.delete(item.<%=classify(name) %>ID).subscribe(res => {
        this.msg.success(`删除成功！`);
        this.getPaging();
        this.cdr.detectChanges();
      });
    }
  
    edit(item) {
      const drawerRef = this.drawerService.create({
        nzTitle: `编辑`,
        nzContent: <%=classify(name) %>EditComponent,
        nzContentParams: {
          record: item
        }
      });
  
      drawerRef.afterClose.subscribe(res => {
        if (res) {
          this.getPaging();
        }
      });
    }
  
  
}