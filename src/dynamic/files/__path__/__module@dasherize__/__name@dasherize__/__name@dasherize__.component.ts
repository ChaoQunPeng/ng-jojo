import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { NzMessageService,} from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { <%=classify(name)%>ApiService } from '../<%=module%>-api.service';
import { <%=classify(name)%>NewComponent } from './<%=name%>-new/<%=name%>-new.component';
import { <%=classify(name)%>EditComponent } from './<%=name%>-edit/<%=name%>-edit.component';
import { <%=classify(name)%>Service } from "../<%=module%>.service";

@Component({
  selector: 'app-<%=name%>',
  templateUrl: './<%=name%>.component.html',
  // styleUrls: ['./<%=name%>.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class <%=classify(name)%>Component implements OnInit {

  loading = false;

  constructor(
    private msg: NzMessageService,
    private cdr: ChangeDetectorRef,
    private <%=camelize(module)%>ApiService: <%=classify(module)%>ApiService,
    private <%=camelize(module)%>Service: <%=classify(module)%>Service
  ) { }

  ngOnInit() {

  }

  add() {
    const drawerRef = this.<%=camelize(module)%>ServiceService.createNewDrawer();

    drawerRef.afterClose.subscribe(res => {
      if (res) {
        
      }
    });
  }

  edit(item) {
    const drawerRef = this.<%=camelize(module)%>Service.createEditDrawer(item);

    drawerRef.afterClose.subscribe(res => {
      if (res) {
        
      }
    });
  }

  del(item) {
    this.loading = true;
    this.<%=camelize(module)%>ApiService.del(item.<%=classify(module)%>ID).subscribe(res => {
      this.msg.success(`删除成功！`);
      this.loading = false;
    });
  }

  reload() {
    
  }
}