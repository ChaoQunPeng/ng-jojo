
import { Component, OnInit,  ChangeDetectionStrategy, ChangeDetectorRef, Input } from '@angular/core';
import { NzMessageService, NzDrawerRef } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { <%=classify(name)%>Service } from '<%=ListPath%><%=module%>/<%=name%>/<%=name%>.service';

@Component({
  selector: 'app-<%=dasherize(name)%>-edit',
  templateUrl: './<%=dasherize(name)%>-edit.component.html',
  //styleUrls: ['./<%=dasherize(name)%>.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class <%=classify(name) %>EditComponent implements OnInit {
  @Input() record: any;

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

  setFormDefaultValue() {
   
  }

  handleOk() {
   
  }

  handleCancel() {
    this.drawerRef.close();
  }

}
