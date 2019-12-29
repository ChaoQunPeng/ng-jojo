import { _HttpClient } from '@delon/theme';
import { Restful } from 'src/app/restful/restful';
import { Observable } from 'rxjs';

export class <%=classify(module) %> extends Restful {
    constructor(
        public http: _HttpClient
    ) {
        super("<%=classify(module) %>", http);
    }
    // 分页
    paging(num: number, size: number, body?: any): Observable<any> {
        return this.http.get(`${this.baseController}?Num=${num}&Size=${size}`, body);
    }
}