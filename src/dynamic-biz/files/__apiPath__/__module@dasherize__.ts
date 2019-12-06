import { _HttpClient } from '@delon/theme';
import { Restful } from 'src/app/restful/restful';
import { Observable } from 'rxjs';

export class <%=classify(module) %> extends Restful {
    constructor(
        public http: _HttpClient
    ) {
        super("<%=classify(module) %>", http);
    }

    /**
     * 分页
     * @param num 页面
     * @param size 每页数量
     * @param params 查询参数
     */
    paging(num: number, size: number, params?: any): Observable<any> {
        return this.http.get(`${this.baseController}?Num=${num}&Size=${size}`, params);
    }

    /**
    * 新增
    * @param params 实体参数
    */
    add(params: any): Observable<any> {
        return this.http.post(`${this.baseController}`, params);
    }

    /**
     * 删除
     * @param Id Id
     */
    del(id: string | any): Observable<any> {
        return this.http.delete(`${this.baseController}/${id}`)
    }

    /**
     * 编辑
     * @param id id
     * @param param 参数
     */
    edit(id: string | any, param: any): Observable<any> {
        return this.http.put(`${this.baseController}/${id}`, param)
    }
}