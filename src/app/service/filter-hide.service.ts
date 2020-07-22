import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FilterHideService {

  private hideAllFilter: Subject<any> = new Subject<any>();
  constructor() { }

  sendBooleanFlag(flag: any) {
    this.hideAllFilter.next(flag);
  }
  getBooleanFlag(): Observable<any> {
    return this.hideAllFilter.asObservable();
  }
}
