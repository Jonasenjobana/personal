import { Subject } from 'rxjs';
import { Injectable } from "@angular/core";

@Injectable()
export class ZqSelectService {
    public valueSub$: Subject<string> = new Subject()
    constructor() {

    }
}