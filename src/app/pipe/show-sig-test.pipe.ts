import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'showSigTest'
})
export class ShowSigTestPipe implements PipeTransform {

  transform(currentScore: any, compareScore?: any): any {
    let current = currentScore;
    let previous = compareScore;
    if(isNaN(currentScore) || currentScore === 'NaN'){
      return 0;
    }
    else{
      if(compareScore === 'NaN' || isNaN(compareScore)){
        previous = 0;
      }
      // if(currentScore === 'NaN' || isNaN(currentScore)){
      //   current = 0;
      // }
      if(current > previous){
        return 1;
      }
      if(current < previous){
        return -1;
      }
      else{
        return 0;
      }
    }
  }
}
