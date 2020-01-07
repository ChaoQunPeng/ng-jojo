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
   * 获取分页数据
   * @param num 当前页码
   * @param size 每页条数
   * @param body 查询参数
   */
  getPaging(num: number, size: number, params?: any): Observable<any> {
    return this.http.get(`${this.baseController}?Num=${num}&Size=${size}`, params);
  }
}