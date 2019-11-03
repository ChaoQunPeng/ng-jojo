import { Component, OnInit, EventEmitter, ChangeDetectionStrategy, ChangeDetectorRef,Input,Output } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';

@Component({
  selector: 'app-<%=dasherize(name)%>',
  templateUrl: './<%=dasherize(name)%>.component.html',
  //styleUrls: ['./<%=dasherize(name)%>.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class <%=classify(name) %>Component implements OnInit {
  @Input() isVisible: boolean;
  @Output() isVisibleChange: EventEmitter <boolean> = new EventEmitter<boolean>();
  @Output() handleOkChange: EventEmitter <boolean> = new EventEmitter<boolean>();

  constructor(
    public http: _HttpClient,
    private msg: NzMessageService,
    private cdf: ChangeDetectorRef
  ) {
  }
  ngOnInit() {

  }

  // #region modal basic function

  handleOk() {
    this.handleIsVisible();
  }

  handleOnCancel() {
    this.handleIsVisible();
  }

  handleIsVisible() {
    this.isVisible = !this.isVisible;
    this.isVisibleChange.emit(this.isVisible);
  }

  // #endregion
}
