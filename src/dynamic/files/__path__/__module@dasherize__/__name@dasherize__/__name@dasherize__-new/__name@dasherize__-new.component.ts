import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef,ViewChild } from '@angular/core';
import { NzMessageService, NzDrawerRef } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { SFSchema, SFComponent } from '@delon/form';
import { DynamicViewApiService } from 'src/app/routes/dynamic/dynamic-view-api.service';
import { forkJoin } from 'rxjs/internal/observable/forkJoin';
import { <%=classify(module)%>ApiService } from '../../<%=module%>-api.service';

@Component({
  selector: 'app-<%=name%>-new',
  templateUrl: './<%=name%>-new.component.html',
  // styleUrls: ['./<%=name%>.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class <%=classify(name)%>NewComponent implements OnInit {
  @ViewChild('sf', { static: false }) sf: SFComponent;

  loading = false;

  schema: SFSchema = {
    properties: {

    }
  };

  constructor(
    public http: _HttpClient,
    private msg: NzMessageService,
    private cdf: ChangeDetectorRef,
    private drawerRef: NzDrawerRef,
    private dynamicViewApiService: DynamicViewApiService,
    private <%=camelize(module)%>ApiService: <%=classify(module)%>ApiService
  ) {
  }

  ngOnInit() {
    this.loading = true;
    forkJoin([
      this.dynamicViewApiService.getForm('<%=newFormName%>')
    ]).subscribe(([res]) => {
      this.schema = JSON.parse(res.Columns);
      // this.schema.properties[""].enum = {};
      this.sf.refreshSchema(this.schema);
      this.loading = false;
    });
  }

  handleOk() {
    this.loading = true;
    this.<%=camelize(module)%>ApiService.add(this.sf.value).subscribe(res => {
      this.drawerRef.close(res);
      this.loading = false;
    });
  }

  handleCancel() {
    this.drawerRef.close();
  }
}