import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { NzMessageService, NzFormatEmitEvent } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { TreeManagerService } from '@shared/components/tree-manager/tree-manager.service';
import { <%=classify(name)%>Service } from './<%=name%>.service';
import { <%=classify(name)%>NewService  } from '<%=SharedComponentDirTsConfig%>/<%=module%>/<%=name%>-new/<%=name%>-new.service';
import { <%=classify(name)%>EditService } from '<%=SharedComponentDirTsConfig%>/<%=module%>/<%=name%>-edit/<%=name%>-edit.service';

@Component({
  selector: 'app-<%=dasherize(name)%>',
  templateUrl: './<%=dasherize(name)%>.component.html',
  //styleUrls: ['./<%=dasherize(name)%>.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class <%=classify(name) %>Component implements OnInit {
  treeDataList: any[] = [];
  tableDataList: any[] = [];
  loading = false;
  expandKeys = []; // 保存展开的节点的key


  constructor(
    private msg: NzMessageService,
    private cdr: ChangeDetectorRef,
    private treeManagerService: TreeManagerService,
    private <%=camelize(name) %>Service: <%=classify(name) %>Service,
    private <%=camelize(name) %>NewService: <%=classify(name) %>NewService,
    private <%=camelize(name) %>EditService: <%=classify(name) %>EditService
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
    this.<%=camelize(name) %>Service.getTreeDataList().subscribe(res => {
      this.treeDataList = res;
      this.expandKeys = [...this.expandKeys];
      if (this.tableDataList.length) { // 右侧表格有显示数据则刷新
        this.refreshRightTable(this.treeDataList, this.tableDataList[0].Id); // 这里记得换成实际的Id
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

    /**
   * 打开新增抽屉
   */
  add() {
    const drawerRef = this.<%=camelize(name)%>NewService.createNewDrawer();

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
  edit(item) {
    const drawerRef = this.<%=camelize(name)%>EditService.createDrawer({
      nzTitle: ``,
      nzContentParams: item
    });

    drawerRef.afterClose.subscribe(res => {
      if (res) {
        this.getTreeDataList();
      }
    });
  }

  /**
   * 删除
   * @param item 待删除的对象
   */
  del(item) {
    this.<%=camelize(name) %>Service.del(item.id).subscribe(res => {
      if (res.EffectCount) {
        this.msg.success(`删除成功！`);
        this.getTreeDataList();
      }
    });
  }

  /**
   * 刷新，保留参数
   */
  reload() {
    this.getTreeDataList();
  }
}