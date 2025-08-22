import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })

export class LinkStateService {

  static triggerRefresh(triggerRefresh: any) {
      throw new Error('Method not implemented.');
    }

    private _refreshLink$ = new BehaviorSubject<boolean>(false);

    ///private refreshSubject = new Subject<void>();

    refreshLink$ = this._refreshLink$.asObservable();
    
    ///refresh$ = this.refreshSubject.asObservable();

    triggerRefresh() {

        this._refreshLink$.next(true);

        ///this.refreshSubject.next();

    }

}