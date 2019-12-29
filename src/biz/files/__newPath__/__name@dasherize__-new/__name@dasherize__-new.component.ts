import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { NzMessageService, NzDrawerRef } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { <%=classify(name)%>Service } from '<%=ListPath%><%=module%>/<%=name%>/<%=name%>.service';

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