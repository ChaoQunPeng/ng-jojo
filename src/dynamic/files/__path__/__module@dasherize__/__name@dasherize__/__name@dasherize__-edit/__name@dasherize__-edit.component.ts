import { Component, OnInit, ViewChild, ChangeDetectionStrategy, ChangeDetectorRef,Input } from '@angular/core';
import { NzMessageService, NzDrawerRef } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { SFSchema, SFComponent } from '@delon/form';
import { DynamicViewApiService } from 'src/app/routes/dynamic/dynamic-view-api.service';
import { forkJoin } from 'rxjs/internal/observable/forkJoin';
import { <%=classify(module) %>ApiService } from '../../<%=module%>-api.service';

@Component({
  selector: 'app-<%=name%>-edit',
  templateUrl: './<%=name%>-edit.component.html',
  // styleUrls: ['./<%=name%>.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class <%=classify(name) %>EditComponent implements OnInit {
  @ViewChild('sf', { static: false }) sf: SFComponent;

  @Input() record: any;

  loading = false;

  schema: SFSchema = {
    properties: {

    }
  };
  formData: any = {};
  

  constructor(
    public http: _HttpClient,
    private msg: NzMessageService,
    private cdf: ChangeDetectorRef,
    private drawerRef: NzDrawerRef,
    private dynamicViewApiService: DynamicViewApiService,
    private <%=camelize(module) %>ApiService: <%=classify(module) %>ApiService
  ) {

  }

  ngOnInit() {
    this.formData=this.record;
    this.loading = true;
    forkJoin([
      this.dynamicViewApiService.getForm('<%=editFormName%>')
    ]).subscribe(([res]) => {
      this.schema = JSON.parse(res.Columns);
      // this.schema.properties[""].enum = {};
      this.sf.refreshSchema(this.schema);
      this.loading = false;
    });
  }



  /**
  * 点击确定
  */
  handleOk() {
    this.<%=camelize(module) %>ApiService.edit(this.record.<%=classify(module) %>ID, this.sf.value).subscribe(res => {
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