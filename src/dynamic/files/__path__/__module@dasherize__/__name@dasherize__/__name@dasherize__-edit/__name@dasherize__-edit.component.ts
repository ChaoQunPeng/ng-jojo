import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { NzMessageService, NzDrawerRef } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { <%=classify(module) %> ApiService } from '../../<%=module%>-api.service';

@Component({
  selector: 'app-<%=name%>-edit',
  templateUrl: './<%=name%>-edit.component.html',
  // styleUrls: ['./<%=name%>.component.less'],
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class <%=classify(module) %>EditComponent implements OnInit {
  @Input() record: any;

  loading = false;

  constructor(
    public http: _HttpClient,
    private msg: NzMessageService,
    private cdf: ChangeDetectorRef,
    private drawerRef: NzDrawerRef,
    private <%=camelize(module) %>ApiService: <%=classify(module) %>ApiService
  ) {

  }

  ngOnInit() {


  }



  /**
  * 点击确定
  */
  handleOk() {
    this.<%=camelize(module) %>ApiService.edit(this.record.<%=classify(module) %>ID, {}).subscribe(res => {
      this.msg.success(`修改成功！`);
      this.drawerRef.close(true);
    });
  }

  /**
   * 点击取消
   */
  handleCancel() {
    this.drawerRef.close();
  }

}