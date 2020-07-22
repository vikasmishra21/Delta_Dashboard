import { Component, OnInit } from '@angular/core';
import { Chart } from 'src/app/shell/models/chart';
import { Subject } from 'rxjs';
import { TouchpointRecall } from './table/touchpoint-recall';
import { FilterService } from 'src/app/shell/services/filter.service';
import { TouchpointRecallCsv } from './table/touchpoint-recal-csv';
import { AngularCsv } from 'angular7-csv/dist/Angular-csv';
import { FilterConfigService } from 'src/app/service/filter-config.service';
import { Brands } from 'src/app/model/brands';
import { AssetMappings } from 'src/app/model/asset.mappings';
import { takeUntil } from 'rxjs/operators';
import { ScoreAndBasePipe } from 'src/app/pipe/score-and-base.pipe';
import { TouchPointRecallTrends } from './touchpointRecallTrends';
import { PptExportService } from 'src/app/service/ppt-export.service';
import { FilterOption } from 'src/app/shell/models/filterOption';
import { FilterHideService } from 'src/app/service/filter-hide.service';
import { AppliedFilterSetService } from 'src/app/service/applied-filter-set.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-touchpoint-recall',
  templateUrl: './touchpoint-recall.component.html',
  styleUrls: ['./touchpoint-recall.component.css'],
  providers: [ScoreAndBasePipe]
})
export class TouchpointRecallComponent implements OnInit {
  onDataUpdate: Subject<any> = new Subject;
  optionSelectionUnsubscribe: Subject<any> = new Subject<any>();
  touchpointRecallArray: Array<any>;
  touchpointRecall: Chart;
  touchpointRecallData: Array<any> = new Array<any>();
  showLoader: boolean;
  dtTouchPointRecallCsv = new Array<any>();
  csvOptions = {
    fieldSeparator: ',',
    quoteStrings: '"',
    decimalseparator: '.',
    showLabels: true,
    showTitle: true,
    title: 'Delta',
    useBom: true,
    noDownload: false,
    headers: []
  };
  brandList: any;
  brandCodes = AssetMappings.brandNameAndCodes;
  brandNameCsv: Array<string>
  brandLogos = AssetMappings.logoByBrandCode;
  public showChart = false;
  public showTrends = false;
  selectedTab: any;
  period = 'Quarterly';
  periodSeclected = 'tab1';
  touchPointTrendsDelta: any;
  touchPointTrendsMoen: any;
  touchPointTrendsKohler: any;
  pptDownloadObject = {
    'brands': [],
    'serieswisescore': [],
    'filter': '',
    'bases': []
  };
  filter: string;
  timePeriodChips: Map<string, Array<FilterOption>> = new Map<string, Array<FilterOption>>();
  hideFilterForTrends: boolean = false;
  touchPointRecallTrendsPptData: Array<any> = new Array<any>();
  constructor(private filterService: FilterService, private filterConfigService: FilterConfigService,
    private pptexport: PptExportService, private scoreAndBase: ScoreAndBasePipe,
    private hideFilterTrends: FilterHideService, private appliedFilterSet: AppliedFilterSetService,
    private route: ActivatedRoute) {
    this.filterConfigService.initializeOverallTouchPointRecall();
  }

  ngOnInit() {
    this.updateTouchPointRecall();
    this.route.params.subscribe(params => {
      if(this.filterService.getAppliedFilters().size===0){
        localStorage.removeItem('filterapp');
      }
      if (this.filterService.getAppliedFilters().size !== 0 ||
        this.filterService.getAppliedSeriesSelectors().size !== 0 ||
        this.filterService.getAppliedTimePeriods().size !== 0) {

        this.updateTouchPointRecall();
        setTimeout(() => {
          this.onDataUpdate.next();
        });
      }
    });
    //let oneTime= true;
    this.filterService.optionSelectionCallback$
      .pipe(takeUntil(this.optionSelectionUnsubscribe))
      .subscribe(value => {
        //if(oneTime){
        //oneTime = false;
        //   if(this.filterService.selectedChoices!=undefined){
        //     this.filterService.selectedChoices .forEach((value, key) => this.setTimePeriodChips(key, value));
        // // for(var i=0;i<this.filterService.selectedChoices.size;i++){
        // //       this.pptDownloadPurchaseFunnelObject.filter.push(this.filterService.selectedChoices[i].key);
        // // }

        //   }
       // localStorage.setItem('filterapp',JSON.stringify(dt));
        // this.appliedFilterSet.selectedChoicesFilterTransfer(value);
        // value = this.appliedFilterSet.returnIt();
        //localStorage.setItem('filterapplied',JSON.stringify(value.get))

        // this.pptDownloadObject.filter=  ;
        this.updateTouchPointRecall();

        //}
        setTimeout(() => {
          this.onDataUpdate.next();
        });
      });

    // if (this.appliedFilterSet.choices.length > 0) {
    //   this.filterService.setChoices(this.appliedFilterSet.variable, this.appliedFilterSet.choices);
    // }
  }

  /**
   * Get Data for All Brand
   * Calculate and transform data into table array form
   */
  pptexport1(pptName) {
   this.getfilter();
   this.pptDownloadObject.filter=this.filter;
    this.showLoader = true;
    var dt = {
      'brandname': '',
      'series': []
    };
    var dt1 = {
      'brandname': '',
      'series': []
    };
    var dt2 = {
      'brandname': '',
      'series': []
    };
    this.pptDownloadObject.serieswisescore=[];
    this.pptDownloadObject.brands=[];
    this.pptDownloadObject.brands.push("Delta");
    this.pptDownloadObject.brands.push("Moen");
    this.pptDownloadObject.brands.push("Kohler");
    this.touchpointRecallData.forEach((el,n)=>{
      el.brandValues.forEach((element,i) => {
        if(i==0){
        var myobj = {
          'seriesname': el.question,
          'score': Math.round(element.Score),
        };
        dt.brandname= "Delta" ;
        dt.series.push(myobj);
        if(n==0){
          this.pptDownloadObject.bases.push(element.Base);
        }
        this.pptDownloadObject.serieswisescore.push(dt);

      }
      else if(i==1){
        var myobj = {
          'seriesname': el.question,
          'score': Math.round(element.Score),
        };
       // dt1.series=[];
        dt1.brandname= "Moen" ;
        dt1.series.push(myobj);
        if(n==0){
          this.pptDownloadObject.bases.push(element.Base);
        }
        this.pptDownloadObject.serieswisescore.push(dt1);

        }
        else if(i==2){
          var myobj = {
            'seriesname': el.question,
            'score': Math.round(element.Score),
          };


          dt2.brandname= "Kohler" ;
          dt2.series.push(myobj);
          if(n==0){
            this.pptDownloadObject.bases.push(element.Base);
          }
        this.pptDownloadObject.serieswisescore.push(dt2);

    }
      });

    })
    // this.pptDownloadObject.serieswisescore.push(dt);
    // this.pptDownloadObject.serieswisescore.push(dt1);
    // this.pptDownloadObject.serieswisescore.push(dt2);
    var aware = JSON.stringify(this.pptDownloadObject);
    this.pptexport.postPPTForTouchPointDownload(JSON.stringify(aware)).subscribe((data) => {
      let blob = new Blob([data], { type: "application/octet-stream" });
      let url = window.URL.createObjectURL(blob);
      let a = document.createElement("a");
      document.body.appendChild(a);
      a.href = url;
      a.download = pptName;
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
      this.showLoader = false;
    }, error => {
      console.log(error);
      this.showLoader = false;
    });
  }

  private setTimePeriodChips(variable, choices) {
    if (this.timePeriodChips.has(variable) && choices.length === 0) {
      this.timePeriodChips.delete(variable);
    } else {
      this.timePeriodChips.set(variable, [...choices]);
    }
    for (var i = 0; i < this.timePeriodChips.size; i++) {
      if (variable != "Allbrands")
        this.pptDownloadObject.filter = this.pptDownloadObject.filter + " " + variable + " " + choices[i].text;
    }
  }
  updateTouchPointRecall() {
    this.toggleChart('chartsTabs');
    const brands = ["1", "4", "3"];
    this.brandList = brands.map((val) => this.brandLogos[val]);
    this.brandNameCsv = brands.map((val) => this.brandCodes[val]);
    if (this.brandList.length) {
      const Touchpoint: TouchpointRecall = new TouchpointRecall();
      this.showLoader = true;
      this.touchpointRecallData = [];
      this.touchpointRecallArray = Touchpoint.getTouchpointRecallData(brands);
      const data = [];

      this.touchpointRecallArray.forEach((value) => {
        value.addTableDataReady((output, dataTable) => {


          data.push(dataTable);
          if (this.touchpointRecallArray.length == data.length) {
            const chartLength = data.length - 1;
            let baseValueData = Array<any>();

            data.forEach((table, i) => {
            //  this.pptDownloadObject.bases=[]
              if (table.headers[0] != "No Answer") {
              //  this.pptDownloadObject.brands.push(table.headers[0])
                table.bases.forEach((value) => {
                  baseValueData = value[0];
                //  this.pptDownloadObject.bases.push(value[0]);
                });
              //  dt.brandname = table.headers[0];


                let compareBase = 0;
                table.comparisonBases.forEach((val, valindex) => {
                  if (val[0] != undefined) {
                    compareBase = val[0];
                  }
                });

                const headerName = table.headers[0];
                const totalLenght = table.rows.size - 1;
                let counter = 0;
                var base;
                table.rows.forEach((val, question) => {
                  let brandValues = [];
                  const score = val[0];
                  let valueAndBase = {
                    'Score': Math.round(score),
                    'Base': baseValueData,
                    'previousScore': 0,
                    'compareBase': compareBase,
                    'isSignificance': false
                  }
                  var myobj = {
                    'seriesname': question,
                    'score': Math.round(score),
                  };
                  base = baseValueData;
                 // dt.series.push(myobj);

                  table.comparisonRows.forEach((compval, compIndex) => {
                    if (compIndex === question && compval[0] != undefined) {
                      valueAndBase.previousScore = Math.round(score - (compval[0]));
                    }
                  });
                  const showSig = table.significance.get(question)[0];
                  if (showSig != undefined) {
                    valueAndBase.isSignificance = true;
                  }
                  if (i == 0) {
                    this.touchpointRecallData.push({ question, brandValues });
                  }
                  this.touchpointRecallData[counter].brandValues[this.brandNameCsv.indexOf(headerName)] = valueAndBase;
                  if (totalLenght == counter && chartLength == i) {
                    //Sorting according to Delta value
                    this.touchpointRecallData.sort((a, b) => b.brandValues[0].Score - a.brandValues[0].Score);
                    this.showLoader = false;
                  }
                  counter++;
                });
              //dt.series=  dt.series.sort((a, b) => b.Score - a.Score);
               // this.pptDownloadObject.serieswisescore.push(dt);
                //this.pptDownloadObject.bases.push(base)
              }
            });
            // this.pptDownloadObject.serieswisescore.push(dt);
          }
        });
      });
    }
  }
  getfilter() {
    this.filter = "";
    let filter = JSON.parse(localStorage.getItem('filterappTime'));
    let filterSide = JSON.parse(localStorage.getItem('filterapp'));
    this.filter = 'Time Period: ';
    filter.forEach((element, i) => {
      if (i == 0) {
        this.filter = this.filter + element;
      }
      // else if (i == 1) {
      //   this.filter = this.filter + " Compare with: " + element;
      // }
    });

    if (filterSide != null) {
      filterSide.forEach((element, i) => {
        if (i == 0) {
          this.filter = this.filter + ' Side filter(s): ';
          this.filter = this.filter + " " + element;
        }
        else {
          this.filter = this.filter + "| " + element;
        }
      });
    };
  }
  downloadPptTrends() {
    if (this.touchPointTrendsDelta && this.touchPointTrendsMoen && this.touchPointTrendsKohler) {
      this.showLoader = true;
      const objnew = JSON.stringify(this.touchPointRecallTrendsPptData[0]);
      this.pptexport.postPPTForTrends(objnew).subscribe((data) => {
        const blob = new Blob([data], { type: 'application/octet-stream' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        document.body.appendChild(a);
        a.href = url;
        a.download = 'TouchPoint_Recall_Trends_PPT.zip';
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove();
        this.showLoader = false;
      }, error => {
        console.log(error);
        this.showLoader = false;
      });
    }
  }

  updateDataTrends() {
    this.touchPointRecallTrendsPptData = [];
    const touchPointRecallTrends: TouchPointRecallTrends = new TouchPointRecallTrends();
    if (this.period === 'Quarterly' || this.periodSeclected === 'tab1') {
      this.period = 'Quarterly';
      this.chartMap(touchPointRecallTrends, this.period, 'Touchpoint Recall');
    } else if (this.period === 'Annually' || this.periodSeclected === 'tab3') {
      this.period = 'Yearly';
      this.chartMap(touchPointRecallTrends, this.period, 'Touchpoint Recall');
    } else if (this.period === 'SemiAnnually' || this.periodSeclected === 'tab2') {
      this.period = 'Semiannual';
      this.chartMap(touchPointRecallTrends, this.period, 'Touchpoint Recall');
    }
    if (this.touchPointTrendsDelta && this.touchPointTrendsMoen && this.touchPointTrendsKohler) {
      this.touchPointRecallTrendsPptData.push(touchPointRecallTrends.touchPointRecallTrendsPptData);
    }
  }

  chartMap(ref, topbreak, title) {
    this.getfilterTrends();
    this.touchPointTrendsDelta = ref.getTouchPointRecallData(topbreak, title, 1,this.filter);
    this.touchPointTrendsMoen = ref.getTouchPointRecallData(topbreak, title, 4,this.filter);
    this.touchPointTrendsKohler = ref.getTouchPointRecallData(topbreak, title, 3,this.filter);
  }
  getfilterTrends() {
    this.filter = "";
    let filter = JSON.parse(localStorage.getItem('filterappTime'));
    let filterSide = JSON.parse(localStorage.getItem('filterapp'));
    

    if (filterSide != null) {
      filterSide.forEach((element, i) => {
        if (i == 0) {
          this.filter = this.filter + ' Side filter(s) :';
          this.filter = this.filter + " " + element;
        }
        else {
          this.filter = this.filter + "| " + element;
        }
      });
    };
  }
  toggleChart(tab) {
    this.hideFilterForTrends = false;
    this.hideFilterTrends.sendBooleanFlag(this.hideFilterForTrends);
    this.selectedTab = tab;
    this.showChart = false;
    this.showTrends = false;
  }

  toggleTrends(tab) {
    this.hideFilterForTrends = true;
    this.hideFilterTrends.sendBooleanFlag(this.hideFilterForTrends);
    this.selectedTab = tab;
    this.showTrends = true;
    this.showChart = true;
    if (this.selectedTab === 'trendsTabs') {
      this.showLoader = true;
      this.updateDataTrends();
      setTimeout(() => {
        this.onDataUpdate.next();
      });
      setTimeout(() => {
        this.showLoader = false;
      }, 3000);
    }
  }

  changeTimePeriod(period, periodSeclected) {
    this.period = period;
    this.periodSeclected = periodSeclected;
    if (this.selectedTab === 'trendsTabs') {
      this.showLoader = true;
      this.updateDataTrends();
      setTimeout(() => {
        this.onDataUpdate.next();
      });
      setTimeout(() => {
        this.showLoader = false;
      }, 3000);
    }
  }

  /**
   * To Download Data into CSV format
   */
  downloadExcelFile() {
    let csvData = [];
    this.getfilter();
    this.dtTouchPointRecallCsv = this.touchpointRecallData;
    var cavBaseValues = [];
    this.dtTouchPointRecallCsv[0].brandValues.forEach((element, index) => {
      cavBaseValues.push(element.Base);
    });
    csvData.push(Object.assign({}, this.csvDetailCreation(this.brandNameCsv, "Series Name", [0])));
    this.dtTouchPointRecallCsv.forEach((val, index) => {
      let data = [];
      val.brandValues.forEach((value, index) => {
        data.push(value.Score);
      });
      csvData.push(Object.assign({}, this.csvDetailCreation(data, val.question, cavBaseValues)));
    });
    csvData.push(Object.assign({}, this.csvDetailCreation(cavBaseValues, 'Base', cavBaseValues)));

    this.csvOptions.title = "Touchpoint Recall";
    //this.csvOptions.headers = ["Series Name", this.brandNameCsv];
    this.csvOptions.headers = ["filter", this.filter];
    new AngularCsv(csvData, "Touchpoint Recall", this.csvOptions);
  }

  csvDetailCreation(chartData, sideBreak, base) {
    let csvDetail = [];
    csvDetail.push(sideBreak);
    if(sideBreak==="Series Name"){
      csvDetail.push(chartData);
    }
    else{
    chartData.forEach((val, index) => {
      if (sideBreak !== 'Base') {
        const scoreInExcel = this.scoreAndBase.transform(val, base[index]);
        csvDetail.push(scoreInExcel);
      }
      else {
        csvDetail.push(val);
      }
    });
  }
  
    return csvDetail;
  }

  ngOnDestroy(): void {
    this.optionSelectionUnsubscribe.next();
    this.optionSelectionUnsubscribe.complete();
  }

  isCompare(compare, compareBase, current, currentBase) {
    if (isNaN(compare) || compare == "NaN" || compare == '') {
      // compare = 0;
      return false;
    }
    else {
      if (isNaN(current) || current == "NaN" || current == '') {
        current = 0;
      }
      const prevData = Math.round(compare);
      const currData = Math.round(current);
      const prevBase = compareBase;
      const currBase = currentBase;

      // let sig = 0;
      // var diff = currData - (prevData);
      // var sigDiff = Math.sqrt((currData * (1 - currData) / currBase) + (prevData * (1 - prevData) / prevBase));
      // var value = diff / sigDiff;
      // if (value >= 1.96){
      //   sig = 1;
      // }
      // else if (value <= -1.96){
      //   sig = -1;
      // }
      // && (sig == 1 || (sig = -1))
      if (prevData != currData && prevData != 0) {
        return true
      }
      else {
        return false;
      }
    }
  }
}
