import {AfterContentInit, AfterViewInit, ChangeDetectorRef, Component, Input, OnDestroy, OnInit} from '@angular/core';
import {FilterOption} from '../../models/filterOption';
import {FilterService} from '../../services/filter.service';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {FilterType} from '../../enums/filter-type';
import { element } from 'protractor';
import { FilterConfig } from '../../models/filterConfig';

@Component({
  selector: 'app-filter-chip-list',
  templateUrl: './filter-chip-list.component.html',
  styleUrls: ['./filter-chip-list.component.css']
})
export class FilterChipListComponent implements OnInit, OnDestroy, AfterContentInit {

  @Input() hideDelete: boolean;

  seriesSelectorChips: Map<string, Array<FilterOption>> = new Map<string, Array<FilterOption>>();
  timePeriodChips: Map<string, Array<FilterOption>> = new Map<string, Array<FilterOption>>();
  // timeFilterOption1: FilterOption;
  // timeFilterOption2: FilterOption;
  // timeperiodvariable:string;
  filterDoubleCheck:Boolean=false;
  filterChips: Map<string, Array<FilterOption>> = new Map<string, Array<FilterOption>>();
  choicesValue: any;
  config: FilterConfig;
  private unSubscribe = new Subject();

  constructor(private filterService: FilterService, private ref: ChangeDetectorRef) {
  }

  ngOnInit() {
    const allSeriesSelectors = this.filterService.getAppliedSeriesSelectors();
    const allFilters = this.filterService.getAppliedFilters();
    const allTimePeriods = this.filterService.getAppliedTimePeriods();

    allSeriesSelectors.forEach((value, key) => this.setSeriesSelectorChips(key, value));
    allFilters.forEach((value, key) => this.setFilterChips(key, value));
    allTimePeriods.forEach((value, key) => this.setTimePeriodChips(key, value));
  }

  ngOnDestroy(): void {
    this.unSubscribe.next();
    this.unSubscribe.complete();
  }

  ngAfterContentInit(): void {
    this.filterService.uiUpdaterCallback$.pipe(takeUntil(this.unSubscribe)).subscribe(selectedFilter => {
      const variable = selectedFilter.keys().next().value;
      const config = this.filterService.getFilterConfig(variable);
      if (config.actAs === FilterType.Filter) {
        this.setFilterChips(variable, selectedFilter.get(variable));
      } else if (config.actAs === FilterType.SeriesSelector) {
        this.setSeriesSelectorChips(variable, selectedFilter.get(variable));
      } else if (config.actAs === FilterType.TimePeriod) {
        this.setTimePeriodChips(variable, selectedFilter.get(variable));
      }

      this.ref.detectChanges();
    });
  }

  private setFilterChips(variable, choices) {
    if (this.filterChips.has(variable) && choices.length === 0) {
      this.filterChips.delete(variable);
    } else {
      this.filterChips.set(variable, [...choices]);
    }
    //for export only
    this.config = this.filterService.getFilterConfig(variable);
    var dt=[];
    this.filterChips.forEach((element,key)=>{
      this.config = this.filterService.getFilterConfig(key);
     element.forEach(el=>{
     dt.push(this.config.placeHolder+": "+ el.text);
     })

   
    })
    localStorage.setItem('filterapp',JSON.stringify(dt));
  }

  private setSeriesSelectorChips(variable, choices) {
    if (this.seriesSelectorChips.has(variable) && choices.length === 0) {
      this.seriesSelectorChips.delete(variable);
    } else {
      this.seriesSelectorChips.set(variable, [...choices]);
    }
  }

  private setTimePeriodChips(variable, choices) {
    if (this.timePeriodChips.has(variable) && choices.length === 0) {
      this.timePeriodChips.delete(variable);
    } else {
      this.choicesValue = choices;
      this.timePeriodChips.set(variable, [...choices]);
    }
    //for export only
    var dt=[];
    this.timePeriodChips.forEach(element=>{
     element.forEach(el=>{
     dt.push(el.text);
     })

   
    })
    localStorage.setItem('filterappTime',JSON.stringify(dt));
  }

}
