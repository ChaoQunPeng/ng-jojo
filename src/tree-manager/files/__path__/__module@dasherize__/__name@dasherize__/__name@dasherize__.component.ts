import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef,ViewChild } from '@angular/core';
import { NzMessageService, NzFormatEmitEvent, } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { DynamicViewApiService } from 'src/app/routes/dynamic/dynamic-view-api.service';
import { TreeManagerService } from '@shared/components/tree-manager/tree-manager.service';
import { <%=classify(module) %>ApiService } from '../<%=module%>-api.service';
import { <%=classify(module) %>Service } from "../<%=module%>.service";
import { <%=classify(name) %>EditComponent } from './<%=name%>-edit/<%=name%>-edit.component';


@Component({
  selector: 'app-<%=name%>',
  templateUrl: './<%=name%>.component.html',
  // styleUrls: ['./<%=name%>.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class <%=classify(name) %>Component implements OnInit {
  treeDataList: any[] = [];
  tableDataList: any[] = [];
  expandKeys = []; // 保存展开的节点的key
  loading = false;

  constructor(
    private msg: NzMessageService,
    private cdr: ChangeDetectorRef,
    private treeManagerService: TreeManagerService,
    private dynamicViewApiService: DynamicViewApiService,
    private <%=camelize(module) %>ApiService: <%=classify(module) %>ApiService,
    private <%=camelize(module) %>Service: <%=classify(module) %>Service
  ) { }

  ngOnInit() {
    this.getTreeDataList();
  }

  /**
   * 获取tree组件的数据
   */
  getTreeDataList() {
    this.loading = true;
    this.cdr.detectChanges();
    this.<%=camelize(module) %>ApiService.get<%=classify(module)%>OfTree().subscribe(res => {
      this.treeDataList = res;
      this.expandKeys = [...this.expandKeys];
      if (this.tableDataList.length) { // 右侧表格有显示数据则刷新
        this.refreshRightTable(this.treeDataList, this.tableDataList[0].<%=classify(module) %>ID); // 这里记得换成实际的Id
      }
      this.loading = false;
      this.cdr.detectChanges();
    });
  }

   /**
   * 刷新右侧表格
   * @param treeDataList tree数据数组
   * @param tableDataListFirstId 右侧表格数组第一个对象的id
   */
  refreshRightTable(treeDataList, tableDataListFirstId) {
    this.tableDataList = this.treeManagerService.refreshRightTable(treeDataList, tableDataListFirstId);
  }

  /**
   * tree-manager单击树回调事件
   * @param nodes NzFormatEmitEvent
   */
  treeManageClickChange(nodes: NzFormatEmitEvent) {
    this.tableDataList = this.treeManagerService.showTableData(nodes);
  }

  /**
   * tree-manager节点展开回调事件
   * @param $event NzFormatEmitEvent
   */
  treeManageExpandChange($event: NzFormatEmitEvent) {
    this.expandKeys = $event.keys;
  }

  add() {
    const drawerRef = this.<%=camelize(module) %>Service.createNewDrawer();

    drawerRef.afterClose.subscribe(res => {
      if (res) {
        this.getTreeDataList();
      }
    });
  }

   /**
   * 打开编辑抽屉
   * @param item 编辑对象
   */
  edit(item: any) {
    const drawerRef = this.<%=camelize(module) %>Service.createEditDrawer(item);

    drawerRef.afterClose.subscribe(res => {
      if (res) {
        this.getTreeDataList()
      }
    });
  }

  del(item) {
    this.<%=camelize(module) %>ApiService.del(item.<%=classify(module) %>ID).subscribe(res => {
      this.msg.success(`删除成功！`);
      this.getTreeDataList();
    });
  }

  reload() {
    this.getTreeDataList();
  }
}