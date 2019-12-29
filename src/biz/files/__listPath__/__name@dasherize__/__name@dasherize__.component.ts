

import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { NzMessageService, NzDrawerService } from 'ng-zorro-antd';
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
      
    }
  
    del(item) {
      this.<%=camelize(module) %>.delete(item.<%=classify(module)%>ID).subscribe(res => {
        this.msg.success(`删除成功！`);
        this.getPaging();
        this.cdr.detectChanges();
      });
    }
  
    edit(item) {
     
    }
  
  
}