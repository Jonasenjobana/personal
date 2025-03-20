import { Directive, InputSignal, input } from "@angular/core";
import { SlDateFormate } from "./model";

@Directive()
export class DateBaseProp {
    formater: InputSignal<string> = input('YYYY-MM-DD');
}