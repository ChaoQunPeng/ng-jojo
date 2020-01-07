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

}