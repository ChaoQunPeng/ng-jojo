<% if(newComponentType=='static') { %>
  import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
  import { NzMessageService } from 'ng-zorro-antd';
  import { _HttpClient } from '@delon/theme';
  import { FormGroup, FormBuilder, Validators } from '@angular/forms';
  import { <%=classify(module) %> } from 'src/app/biz/restful/<%=module%>';
  
  @Component({
    selector: 'app-<%=dasherize(name)%>-new',
    templateUrl: './<%=dasherize(name)%>-new.component.html',
    //styleUrls: ['./<%=dasherize(name)%>.component.less'],
    changeDetection: ChangeDetectionStrategy.OnPush
  })
  export class <%=classify(name) %>NewComponent implements OnInit {
    @Input() isVisible: boolean;
    @Output() isVisibleChange: EventEmitter <any> = new EventEmitter<any>();
    @Output() handleOkChange: EventEmitter <any> = new EventEmitter<any>();
  
    <%=camelize(module) %> = new <%=classify(module) %> (this.http);
  
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
      this.<%=camelize(module) %>.post({}).subscribe(res => {
        if (res.EffectCount) {
          this.msg.success(`新增成功！`);
          this.handleVisible();
          this.handleOkChange.emit(true);
        } else {
          this.msg.error(`新增失败！`);
        }
      });
    }
  
    handleCancel() {
      this.handleVisible();
    }
  
    handleVisible() {
      this.isVisible = !this.isVisible;
      this.isVisibleChange.emit(this.isVisible);
    }
  
    handleAfterOpen() {
  
    }
  }
<% } else { %>
  import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectionStrategy, ChangeDetectorRef, ViewChild } from '@angular/core';
  import { NzMessageService } from 'ng-zorro-antd';
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
    @Input() isVisible: boolean;
    @Output() isVisibleChange: EventEmitter <any> = new EventEmitter<any>();
    @Output() handleOkChange: EventEmitter <any> = new EventEmitter<any>();
  
    <%=camelize(module) %> = new <%=classify(module) %>(this.http);
    schema: SFSchema={};
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
      this.<%=camelize(module) %>.post(value).subscribe(res => {
        if (res.EffectCount) {
          this.msg.success(`新增成功！`);
          this.handleVisible();
          this.handleOkChange.emit(true);
        } else {
          this.msg.error(`新增失败！`);
        }
      });
    }
  
    handleCancel() {
      this.handleVisible();
    }
  
    handleVisible() {
      this.isVisible = !this.isVisible;
      this.isVisibleChange.emit(this.isVisible);
    }
  
    handleAfterOpen() {
  
    }
  }
<% } %>