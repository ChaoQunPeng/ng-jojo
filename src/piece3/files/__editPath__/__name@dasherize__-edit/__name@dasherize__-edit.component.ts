<% if(editComponentType=='static') { %>
import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { NzMessageService, NzModalRef, NzModalService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { <%=classify(module) %> } from 'src/app/biz/restful/<%=module%>';
import { DynamicView } from 'src/app/restful/dynamic-view';

@Component({
  selector: 'app-<%=dasherize(name)%>-edit',
  templateUrl: './<%=dasherize(name)%>-edit.component.html',
  //styleUrls: ['./<%=dasherize(name)%>.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class <%=classify(name) %>EditComponent implements OnInit {
    <%=module %> = new <%=classify(module) %> (this.http);
  
    _data: any;
    @Input()
    set data(value: any) {
      if (!value) {
        return;
      }
      this._data = value;
    }
    get data() {
      return this._data;
    }
    
    @Input() isVisible: boolean;
    @Output() isVisibleChange: EventEmitter <any> = new EventEmitter<any>();
    @Output() handleOkChange: EventEmitter <any> = new EventEmitter<any>();
  
    form:FormGroup;
    constructor(
      public http: _HttpClient,
      private msg: NzMessageService,
      private cdf: ChangeDetectorRef,
      private fb:FormBuilder
    ) {
    }
    ngOnInit() {
      this.form = this.fb.group({
  
      });
    }
  
    handleOk() {
      let id;
      this.<%=camelize(module) %>.put(id, {}).subscribe(res => {
        if (res.EffectCount) {
          this.msg.success(`编辑成功！`);
          this.handleModalVisible();
          this.handleOkChange.emit(true);
        } else {
          this.msg.error(`编辑失败`);
        }
      });
    }
  
    handleCancel() {
      this.handleModalVisible();
    }
  
    handleModalVisible() {
      this.isVisible = !this.isVisible;
      this.isVisibleChange.emit(this.isVisible);
    }
  
    handleAfterOpen() {
  
    }
  
}
<% } else { %>
import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectionStrategy, ChangeDetectorRef, ViewChild } from '@angular/core';
import { NzMessageService} from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { SFSchema, SFComponent } from '@delon/form';
import { DynamicView } from 'src/app/restful/dynamic-view';
import { <%=classify(module) %> } from 'src/app/biz/restful/<%=module%>';

@Component({
  selector: 'app-<%=dasherize(name)%>-edit',
  templateUrl: './<%=dasherize(name)%>-edit.component.html',
  //styleUrls: ['./<%=dasherize(name)%>.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class <%=classify(name) %>EditComponent implements OnInit {
    @ViewChild('sf', { static: false }) sf: SFComponent;
    <%=module %> = new <%=classify(module) %> (this.http);
    dynamicView = new DynamicView(this.http);
    _data: any;
    @Input()
    set data(value: any) {
      if (!value) {
        return;
      }
      this._data = value;
    }
    get data() {
      return this._data;
    }
    schema: SFSchema={};
    @Input() isVisible: boolean;
    @Output() isVisibleChange: EventEmitter <any> = new EventEmitter<any>();
    @Output() handleOkChange: EventEmitter <any> = new EventEmitter<any>();
  
    constructor(
      public http: _HttpClient,
      private msg: NzMessageService,
      private cdf: ChangeDetectorRef,
    ) {
    }

    ngOnInit() {
      this.dynamicView.getForm("表单名称").subscribe(res => {
        this.schema = JSON.parse(res.Columns);
        this.cdf.detectChanges();
      });
    }
  
    handleOk(value) {
      let id;
      this.<%=camelize(module) %>.put(id, value).subscribe(res => {
        if (res.EffectCount) {
          this.msg.success(`编辑成功！`);
          this.handleModalVisible();
          this.handleOkChange.emit(true);
        } else {
          this.msg.error(`编辑失败`);
        }
      });
    }
  
    handleCancel() {
      this.handleModalVisible();
    }
  
    handleModalVisible() {
      this.isVisible = !this.isVisible;
      this.isVisibleChange.emit(this.isVisible);
    }
  
    handleAfterOpen() {
  
    }
}
<% } %>