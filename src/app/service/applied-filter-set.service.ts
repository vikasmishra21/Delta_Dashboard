import { Injectable } from '@angular/core';
import { TimePeriod } from '../shell/models/time.period';

@Injectable({
  providedIn: 'root'
})
export class AppliedFilterSetService {

  public appliedChoices: any;
  public choices: any[];
  public variable: string;

  constructor() {
    this.choices = [];
    this.variable = '';
  }

  selectedChoicesFilterTransfer(value) {
    this.appliedChoices = value;
    this.appliedChoices.forEach((choices, variable) => {
      if(TimePeriod.Variable == variable){
        this.choices = choices;
        this.variable = variable;
      }
  });
  // this.chip.setTimePeriodChips(this.variable, this.choices);
  // this.filterService.setChoices(k, val);
  // this.filterService.getAppliedTimePeriods();
    // console.log(this.c[0].keys);
    // this.filterService.setChoices(this.c[0].value, this.c[0].value);
    // this.filterService.selectedChoices[0] = [];
    // this.filterService.selectedChoices[0] = a;
  }

  returnIt() {
    return this.appliedChoices;
  }
}
