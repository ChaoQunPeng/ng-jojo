import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
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

  constructor(
    public http: _HttpClient,
    private msg: NzMessageService,
    private cdf: ChangeDetectorRef,
    private drawerRef: NzDrawerRef,
    private <%=camelize(name) %>Service: <%=classify(name) %>Service
  ) {
  }

  ngOnInit() {
    
  }

  handleOk() {
    
  }

  handleCancel() {
    this.drawerRef.close(true);
  }
}