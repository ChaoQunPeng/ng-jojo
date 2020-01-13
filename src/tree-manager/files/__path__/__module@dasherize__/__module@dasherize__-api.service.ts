import { Injectable } from '@angular/core';
import { BaseApiService } from '@core/net/base-api.service';
import { _HttpClient } from '@delon/theme';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class <%=classify(module)%>ApiService extends BaseApiService {
  constructor(
    public http: _HttpClient
  ) {
    super('<%=classify(module)%>', http);
  }

 /**
  * 获取 - Tree组件数据结构
  */
  get<%=classify(module)%>OfTree() {
    return this.http.get(`${this.baseController}/tree`);
  }
}