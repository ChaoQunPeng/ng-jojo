import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef,ViewChild } from '@angular/core';
import { NzMessageService, } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { <%=classify(module) %>ApiService } from '../<%=module%>-api.service';


@Component({
  selector: 'app-<%=name%>',
  templateUrl: './<%=name%>.component.html',
  // styleUrls: ['./<%=name%>.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class <%=classify(name) %>Component implements OnInit {
  
  constructor(
    private msg: NzMessageService,
    private cdr: ChangeDetectorRef,
    private <%=camelize(module) %>ApiService: <%=classify(module) %>ApiService,
  ) { }

  ngOnInit() {
 
  }
}