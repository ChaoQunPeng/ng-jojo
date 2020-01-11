import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef,ViewChild } from '@angular/core';
import { NzMessageService, } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { STColumn, STPage } from '@delon/abc';
import { SFSchema, SFComponent } from '@delon/form';
import { STPageConfig, PagingConfig } from 'src/app/config/ST.config';
import { DynamicViewApiService } from 'src/app/routes/dynamic/dynamic-view-api.service';
import { forkJoin } from 'rxjs/internal/observable/forkJoin';
import { <%=classify(module) %>ApiService } from '../<%=module%>-api.service';


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
    private <%=camelize(module) %>ApiService: <%=classify(module) %>ApiService
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
              text: '操作',
              click: (callback) => {
                
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
    this.loading = true;
    this.cdr.detectChanges();
    this.<%=camelize(module) %>ApiService.getPaging(this.pi, this.ps, this.params).subscribe(res => {
      this.data = res.result;
      this.total = res.page.count;
      this.loading = false;
      this.cdr.detectChanges();
    });
  }

  change(event: any) {
    switch (event.type) {
      case 'pi':
        this.pi = event.pi;
        this.getPaging();
        break;
      case 'ps':
        this.ps = event.ps;
        this.getPaging();
        break;
      default:
          break;
    }
  }

  formSubmit($event) {
    this.params = $event;
    this.getPaging();
  }

  formReset($event) {
    this.params = { };
    this.getPaging();
  }

  reload() {
    this.getDynamicTable();
    this.getPaging();
  }
}