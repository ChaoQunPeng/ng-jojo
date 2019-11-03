import { _HttpClient } from '@delon/theme';
import { Restful } from 'src/app/restful/restful';
import { Observable } from 'rxjs';

export class <%=classify(module) %> extends Restful {
    constructor(
        public http: _HttpClient
    ) {
        super("<%=classify(module) %>", http);
    }

    // 框架分页
    // paging(num: number, size: number, body?: any): Observable<any> {
    //     return this.http.get(`${this.baseController}/num/${num}/size/${size}`, body);
    // }
    
    // 业务分页
    // paging(num: number, size: number, body?: any): Observable<any> {
    //     return this.http.get(`${this.baseController}?Num=${num}&Size=${size}`, body);
    // }
}