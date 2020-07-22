import { Pipe, PipeTransform, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { isArray } from 'util';

@Pipe({
  name: 'scoreAndBase'
})

export class ScoreAndBasePipe implements PipeTransform {
  pageName1: string = "";
  route: ActivatedRoute;
  transform(value: any,base?: any, noRoundOff?): any {
    // for addetails page only, as we are getting values in array
    if (base instanceof Array) {
      base = base[0]
    } 
    if (value instanceof Array){
      value = value[0]
    }
    if(!isNaN(value) || base !== 0){
      if(value < 0.5 && value > 0){
        if(base && base < 75){
          return 'Low base';
        }else{
          return '<1';
        }
      }else if(base && base < 75){
        return 'Low base';
      }else if(base === 0 && (isNaN(value) || value === 'NaN')) {
        return 'Low base';
      }
      else{
        if(location.hash.split("/")[2] === "AdDiagnostics" || location.hash.split("/")[2] === "AdDetails"){
          return isNaN(value) || value === 'NaN' ? 'NA' : (noRoundOff == true ? value : Math.round(value));
        }
        return isNaN(value) || value === 'NaN' ? '0' : (noRoundOff == true ? value : Math.round(value));
      }
    }
    else{
      if(location.hash.split("/")[2] === "AdDiagnostics" || location.hash.split("/")[2] === "AdDetails" || location.hash.split("/")[2]== "Conversion"){
        return "NA";
      }
      return "0";
    }
  }
}
