
import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectionStrategy, ChangeDetectorRef, ViewChild } from '@angular/core';
import { NzMessageService, NzDrawerRef } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { Workflow } from 'src/app/biz/restful/workflow';
import { DynamicView } from 'src/app/restful/dynamic-view';
import { SFSchema, SFComponent } from '@delon/form';
import { <%=classify(module) %> } from 'src/app/biz/restful/<%=module%>';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-<%=dasherize(name)%>-edit',
  templateUrl: './<%=dasherize(name)%>-edit.component.html',
  //styleUrls: ['./<%=dasherize(name)%>.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class <%=classify(name) %>EditComponent implements OnInit {
  @ViewChild('sf', { static: false }) sf: SFComponent;
  @Input() record: any;

  dynamicView = new DynamicView(this.http);
  <%=camelize(module) %> = new <%=classify(module) %>(this.http);

  searchSchema: SFSchema = {
    properties: {
    }
  };
  formData = {};

  constructor(
    public http: _HttpClient,
    private msg: NzMessageService,
    private cdf: ChangeDetectorRef,
    private drawerRef: NzDrawerRef
  ) {
  }
  
  ngOnInit() {
    this.formData = this.record;
    forkJoin([
      this.dynamicView.getForm('动态表单名称')
    ]).subscribe(([res]) => {
      this.searchSchema = JSON.parse(res.Columns);
      // this.searchSchema.properties[""].enum = {};
      this.sf.refreshSchema(this.searchSchema);
    });
  }

  handleOk(value) {
    this.<%=camelize(module) %>.put(item.<%=classify(module) %>ID, item).subscribe(res => {
      if (res.EffectCount) {
        this.msg.success(`编辑成功！`);
        this.drawerRef.close(true);
      }
    });
  }

  handleCancel() {
    this.drawerRef.close(true);
  }

}
