import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectionStrategy, ChangeDetectorRef, ViewChild } from '@angular/core';
import { NzMessageService, NzDrawerRef } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { DynamicView } from 'src/app/restful/dynamic-view';
import { <%=classify(module) %> } from 'src/app/biz/restful/<%=module%>';
import { SFSchema, SFComponent } from '@delon/form';

@Component({
  selector: 'app-<%=dasherize(name)%>-new',
  templateUrl: './<%=dasherize(name)%>-new.component.html',
  //styleUrls: ['./<%=dasherize(name)%>.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class <%=classify(name) %>NewComponent implements OnInit {
  @ViewChild('sf', { static: false }) sf: SFComponent;
  dynamicView=new DynamicView(this.http);
  
  <%=camelize(module) %> = new <%=classify(module) %>(this.http);

  schema: SFSchema={
    properties:{

    }
  };

  constructor(
    public http: _HttpClient,
    private msg: NzMessageService,
    private cdf: ChangeDetectorRef,
    private drawerRef: NzDrawerRef
  ) {
  }

  ngOnInit() {
    this.dynamicView.getForm("表单名称").subscribe(res => {
      this.schema = JSON.parse(res.Columns);
      this.sf.refreshSchema(this.schema);
      this.cdf.detectChanges();
    });
  }

  handleOk(value) {
    this.<%=camelize(module) %>.post(value).subscribe(res => {
      if (res.EffectCount) {
        this.msg.success(`新增成功！`);
        this.drawerRef.close(true);
      }
    });
  }

  handleCancel() {
    this.drawerRef.close(true);
  }
}