import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { NzMessageService, NzDrawerRef } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { <%=classify(module)%>ApiService } from '../../<%=module%>-api.service';

@Component({
  selector: 'app-<%=name%>-new',
  templateUrl: './<%=name%>-new.component.html',
  // styleUrls: ['./<%=name%>.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class <%=classify(name)%>NewComponent implements OnInit {

  loading = false;
  constructor(
    public http: _HttpClient,
    private msg: NzMessageService,
    private cdf: ChangeDetectorRef,
    private drawerRef: NzDrawerRef,
    private <%=camelize(module)%>ApiService: <%=classify(module)%>ApiService
  ) {
  }

  ngOnInit() {

  }


  handleOk() {
    this.loading = true;
    this.<%=camelize(module)%>ApiService.add({}).subscribe(res => {
      this.drawerRef.close(res);
      this.loading = false;
    });
  }

  handleCancel() {
    this.drawerRef.close();
  }
}