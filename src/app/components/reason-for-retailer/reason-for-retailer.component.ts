import { Retailers } from './../../model/retailers';
import { ReasonforRetailer } from './../../model/reasonfor.retailer';
import { Component, OnInit, OnDestroy, AfterContentInit } from '@angular/core';
import { FilterService } from 'src/app/shell/services/filter.service';
import { FilterConfigService } from 'src/app/service/filter-config.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AssetMappings } from 'src/app/model/asset.mappings';
import { ActivatedRoute } from '@angular/router';
import { Chart } from 'src/app/shell/models/chart';
import { AngularCsv } from 'angular7-csv/dist/Angular-csv';
import { FilterOption } from 'src/app/shell/models/filterOption';
import { PptExportService } from 'src/app/service/ppt-export.service';
import { ReasonForRetailerTrends } from './reasonForRetailerTrends';
import { FilterHideService } from 'src/app/service/filter-hide.service';
import { AppliedFilterSetService } from 'src/app/service/applied-filter-set.service';
import { TimePeriod } from 'src/app/shell/models/time.period';
import { ScoreAndBasePipe } from 'src/app/pipe/score-and-base.pipe';

@Component({
  selector: 'app-reason-for-retailer',
  templateUrl: './reason-for-retailer.component.html',
  styleUrls: ['./reason-for-retailer.component.css'],
  providers: [ScoreAndBasePipe]
})
export class ReasonForRetailerComponent implements OnInit, OnDestroy, AfterContentInit {

  dataShow: Chart;
  dataShowTotalAvg: Chart;
  inPageVisited: boolean = false;
  dataShowBases: Array<any>;
  dataShowTotalAvgBases: Array<any>;
  retailersList: Array<string>;
  onDataUpdate: Subject<any> = new Subject();
  showloader: boolean;
  showDropdown: boolean;
  updateDataUnsubscribe: Subject<any> = new Subject<any>();
  retailersNameCsv: Array<string>;
  retailersNameCodes = AssetMappings.retailersList;
  Category: string;
  dataShowData: Array<any> = new Array<any>();
  dataShowTotalAvgData: Array<any> = new Array<any>();
  data = false;
  table: any;
  overallavg: boolean;
  avgnew: boolean;
  checkdouble: number;
  checkdouble1: number;
  categoryHeaderName: string;
  sum = 0;
  retailer: Array<any> = new Array<any>();
  dtRetailer: Array<{ ques?: string, score?: Array<any>, avg?: any, totavg?: any, base?: any }>;
  csvOptions = {
    fieldSeparator: ',',
    quoteStrings: '"',
    decimalseparator: '.',
    showLabels: true,
    showTitle: true,
    title: '',
    useBom: true,
    noDownload: false,
    headers: []
  };
  public showChart = false;
  public showTrends = false;
  selectedTab: any;
  period = 'Quarterly';
  periodSeclected = 'tab1';
  filter:string;
  reasonForRetailerTrendsHomeDepot: any;
  reasonForRetailerTrendsLowes: any;
  reasonForRetailerTrendsMenards: any;
  reasonForRetailerTrendsKitchen: any;
  reasonForRetailerTrendsPlumbing: any;
  reasonForRetailerTrendsKmart: any;
  reasonForRetailerTrendsTarget: any;
  reasonForRetailerTrendsWalmart: any;
  reasonForRetailerTrendsBed: any;
  reasonForRetailerTrendsSams: any;
  reasonForRetailerTrendsCostco: any;
  reasonForRetailerTrendsAmazon: any;
  reasonForRetailerTrendsBuild: any;
  reasonForRetailerTrendsEbay: any;
  reasonForRetailerTrendsEFaucets: any;
  reasonForRetailerTrendsFaucetDirect: any;
  retailers: any;
  pptDownloadObjectForReasonforretailer = {
    'retailers': [],
    'category': '',
    'serieswisedata': [],
    'filter': '',
    'bases': []
  };
  timePeriodChips: Map<string, Array<FilterOption>> = new Map<string, Array<FilterOption>>();
  hideFilterForTrends: boolean = false;
  retailerListCode: any;
  retailersTrendsPPTData: Array<any> = new Array<any>();
  constructor(private filterService: FilterService, private filterConfigService: FilterConfigService, private route: ActivatedRoute,
    private pptexport1: PptExportService, private hideFilterTrends: FilterHideService, private scoreAndBase: ScoreAndBasePipe,
    private appliedFilterSet: AppliedFilterSetService) {
    this.route.params.subscribe(params => {
      if (this.inPageVisited) {
        this.updateDataUnsubscribe.next();
        this.updateDataUnsubscribe.complete();
      }
      this.Category = params.order;
      if (this.Category === 'Faucet') {
        this.filterConfigService.initializeCateogryReasonRetailerFaucet();
      }
      if (this.Category === 'Showerhead') {
        this.filterConfigService.initializeCateogryReasonRetailerShowerhead();
      }
      if (this.Category === 'Toilet') {
        this.filterConfigService.initializeCateogryReasonRetailerToilet();
      }
      if (this.Category === 'TubShowerUnit') {
        this.filterConfigService.initializeCateogryReasonRetailerTubShowerUnit();
      }

      this.filterService.optionSelectionCallback$
        .pipe(takeUntil(this.updateDataUnsubscribe))
        .subscribe(value => {
          this.createTables(this.Category);
          setTimeout(() => {
            this.onDataUpdate.next();
          });
        });
      this.showloader = true;
    });
  }

  ngAfterContentInit(): void {
    this.route.params.subscribe(params => {
      this.Category = params.order;
      this.categoryHeaderName = this.Category;
      if (this.Category) {
        this.Category = params.order;
        this.createTables(this.Category);
      } else {
        this.Category = params.order;
        this.createTables(this.Category);
      }
    });
  }

  ngOnInit() {
    this.inPageVisited = true;
    this.showloader = true;
    this.createTables(this.Category);

    this.route.params.subscribe(params => {
      if(this.filterService.getAppliedFilters().size===0){
        localStorage.removeItem('filterapp');
      }
      if (this.filterService.getAppliedFilters().size !== 0 ||
        this.filterService.getAppliedSeriesSelectors().size !== 0 ||
        this.filterService.getAppliedTimePeriods().size !== 0) {

        this.createTables(this.Category);
        setTimeout(() => {
          this.onDataUpdate.next();
        });
      }
    });

    this.filterService.optionSelectionCallback$
      .pipe(takeUntil(this.updateDataUnsubscribe))
      .subscribe(value => {
        //   if(this.filterService.selectedChoices!=undefined){
        //     this.filterService.selectedChoices .forEach((value, key) => this.setTimePeriodChips(key, value));
        // // for(var i=0;i<this.filterService.selectedChoices.size;i++){
        // //       this.pptDownloadPurchaseFunnelObject.filter.push(this.filterService.selectedChoices[i].key);
        // // }

        //   }
        // this.appliedFilterSet.selectedChoicesFilterTransfer(value);
        // value = this.appliedFilterSet.returnIt();
        this.createTables(this.Category);
        setTimeout(() => {
          this.onDataUpdate.next();
        });
      });
    // if (this.appliedFilterSet.choices.length > 0) {
    //   // console.log(TimePeriod.CurrentPeriod,TimePeriod.Variable);
    //   this.filterService.setChoices(this.appliedFilterSet.variable, this.appliedFilterSet.choices);
    // }
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
          this.filter = this.filter + ' Side Filter(s): ';
          this.filter = this.filter + " " + element;
        }
        else {
          this.filter = this.filter + "| " + element;
        }
      });
    };
  }
  getfilterTrends() {
    this.filter = "";
    let filter = JSON.parse(localStorage.getItem('filterappTime'));
    let filterSide = JSON.parse(localStorage.getItem('filterapp'));
    

    if (filterSide != null) {
      filterSide.forEach((element, i) => {
        if (i == 0) {
         // this.filter = this.filter + ' Side filter(s) :';
          this.filter = this.filter + " " + element;
        }
        else {
          this.filter = this.filter + "| " + element;
        }
      });
    };
  }
  pptexport(pptName) {
    this.getfilter();
    this.pptDownloadObjectForReasonforretailer.filter=this.filter;
    this.pptDownloadObjectForReasonforretailer.category = this.Category;
    this.showloader = true;
    const obj = JSON.stringify(this.pptDownloadObjectForReasonforretailer);
    this.pptexport1.postPPTForReasonForRetailerDownload(JSON.stringify(obj)).subscribe((data) => {
      let blob = new Blob([data], { type: "application/octet-stream" });
      let url = window.URL.createObjectURL(blob);
      let a = document.createElement("a");
      document.body.appendChild(a);
      a.href = url;
      a.download = this.Category + "_" + pptName;
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
      this.showloader = false;
    }, error => {
      console.log(error);
      this.showloader = false;
    });
  }
  private setTimePeriodChips(variable, choices) {
    if (this.timePeriodChips.has(variable) && choices.length === 0) {
      this.timePeriodChips.delete(variable);
    } else {
      this.timePeriodChips.set(variable, [...choices]);
    }
    for (var i = 0; i < this.timePeriodChips.size; i++) {
      if (variable != "Allbrands") {
        this.pptDownloadObjectForReasonforretailer.filter = this.pptDownloadObjectForReasonforretailer.filter + " " + variable + " " + choices[0].text;
      }
    }
  }
  createTables(Category) {
    this.showloader = true;
    this.toggleChart('chartsTabs');
    this.retailers = new Retailers(this.filterService, Category);
    this.retailerListCode = this.retailers.getRetailersCode();
    const reasonforRetailer: ReasonforRetailer = new ReasonforRetailer(Category);

    this.overallavg = false;
    this.checkdouble1 = 0;
    if (this.retailerListCode.length) {
      this.dataShowTotalAvg = reasonforRetailer.totalAvg(Category);
      this.dataShowTotalAvg.addTableDataReady((output, dataTable) => {
        this.overallavg = true;
        this.checkdouble1++;
        if (this.checkdouble1 <= 1) {
          this.dataShowTotalAvgData = [];
          // this.hideloader();
          dataTable.rows.forEach((element, index) => {
            const obj = {
              name: index,
              score: element[0]
            };
            this.dataShowTotalAvgData.push(obj);
          });
          this.retailerDataShow();
        }
      });
    }

    this.avgnew = false;
    this.checkdouble = 0;
    this.retailersList = this.retailers.getRetailersCode().map(val => AssetMappings.retailersList[val]);
    this.retailersNameCsv = this.retailers.getRetailersCode().map((val) => this.retailersNameCodes[val]);
    this.pptDownloadObjectForReasonforretailer.retailers = this.retailers.getRetailersCode().map((val) => this.retailersNameCodes[val]);
    if (this.retailerListCode.length) {
      this.dataShow = reasonforRetailer.simpleTable(Category, this.retailers.getRetailersCode());
      this.dataShow.addTableDataReady((output, dataTable) => {
        this.checkdouble++;
        if (this.checkdouble <= 1) {
          this.avgnew = true;
          this.dataShowData = [];
          this.dtRetailer = [];
          // this.hideloader();
          this.showloader = false;
          this.dataShowBases = dataTable.bases.get('Base').map(value => Math.round(value));
          this.pptDownloadObjectForReasonforretailer.bases = this.dataShowBases;
          this.table = dataTable;
          this.retailerDataShow();
        }
      });
    }
  }

  downloadPptTrends() {
    this.showloader = true;
    const objnew = JSON.stringify(this.retailersTrendsPPTData[0]);
    this.pptexport1.postPPTForTrends(objnew).subscribe((data) => {
      const blob = new Blob([data], { type: 'application/octet-stream' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      document.body.appendChild(a);
      a.href = url;
      a.download = 'ReasonForRetailers_Trends_PPT.zip';
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
      this.showloader = false;
    }, error => {
      console.log(error);
      this.showloader = false;
    });
  }

  updateDataTrends() {
    this.retailersTrendsPPTData = [];
    const reasonForRetailertrends: ReasonForRetailerTrends = new ReasonForRetailerTrends(this.Category);
    if (this.period === 'Quarterly' || this.periodSeclected === 'tab1') {
      this.chartMap(this.period, reasonForRetailertrends);
    } else if (this.period === 'Annually' || this.periodSeclected === 'tab3') {
      this.period = 'Yearly';
      this.chartMap(this.period, reasonForRetailertrends);
    } else if (this.period === 'SemiAnnually' || this.periodSeclected === 'tab2') {
      this.period = 'Semiannual';
      this.chartMap(this.period, reasonForRetailertrends);
    }
    this.retailersTrendsPPTData.push(reasonForRetailertrends.retailersTrendsPPTData);
  }

  chartMap(period, ref) {
    this.getfilterTrends();
    this.reasonForRetailerTrendsHomeDepot = ref.retailersTable(period, 'Home Depot', '1',this.filter);
    this.reasonForRetailerTrendsLowes = ref.retailersTable(period, "Lowe's", '2',this.filter);
    this.reasonForRetailerTrendsMenards = ref.retailersTable(period, 'Menards', '3',this.filter);
    this.reasonForRetailerTrendsKitchen = ref.retailersTable(period, 'Kitchen and bath speciality store/showroom', '4',this.filter);
    this.reasonForRetailerTrendsPlumbing = ref.retailersTable(period, 'Plumbing supply store/showroom', '5',this.filter);
    this.reasonForRetailerTrendsKmart = ref.retailersTable(period, 'Kmart', '6',this.filter);
    this.reasonForRetailerTrendsTarget = ref.retailersTable(period, 'Target', '7',this.filter);
    this.reasonForRetailerTrendsWalmart = ref.retailersTable(period, 'Walmart', '8',this.filter);
    this.reasonForRetailerTrendsBed = ref.retailersTable(period, 'Bed Bath & Beyond', '9',this.filter);
    this.reasonForRetailerTrendsSams = ref.retailersTable(period, 'Sams Club', '10',this.filter);
    this.reasonForRetailerTrendsCostco = ref.retailersTable(period, 'Costco', '11',this.filter);
    this.reasonForRetailerTrendsAmazon = ref.retailersTable(period, 'Amazon.com', '12',this.filter);
    this.reasonForRetailerTrendsBuild = ref.retailersTable(period, 'Build.com', '13',this.filter);
    this.reasonForRetailerTrendsEbay = ref.retailersTable(period, 'Ebay.com', '14',this.filter);
    this.reasonForRetailerTrendsEFaucets = ref.retailersTable(period, 'eFaucets.com', '15',this.filter);
    this.reasonForRetailerTrendsFaucetDirect = ref.retailersTable(period, 'FaucetDirect.com', '16',this.filter);
  }

  toggleChart(tab) {
    this.hideFilterForTrends = false;
    this.hideFilterTrends.sendBooleanFlag(this.hideFilterForTrends);
    this.selectedTab = tab;
    this.showChart = false;
    this.showTrends = false;
  }

  toggleTrends(tab) {
    this.selectedTab = tab;
    this.hideFilterForTrends = true;
    this.hideFilterTrends.sendBooleanFlag(this.hideFilterForTrends);
    this.showTrends = true;
    this.showChart = true;
    if (this.selectedTab === 'trendsTabs') {
      this.showloader = true;
      this.updateDataTrends();
      setTimeout(() => {
        this.onDataUpdate.next();
      });
      setTimeout(() => {
        this.showloader = false;
      }, 10000);
    }
  }

  changeTimePeriod(period, periodSeclected) {
    this.period = period;
    this.periodSeclected = periodSeclected;
    if (this.selectedTab === 'trendsTabs') {
      this.showloader = true;
      this.updateDataTrends();
      setTimeout(() => {
        this.onDataUpdate.next();
      });
      setTimeout(() => {
        this.showloader = false;
      }, 10000);
    }
  }

  retailerDataShow() {
    if (this.avgnew && this.overallavg) {
      var base1: Array<{ ques: string, score: Array<number>, totavg?: any, avg?: any, base?: number }>;
      base1 = [];
      this.table.rows.forEach((score, ques) => {
        let compareBase = [];
        if (this.table.comparisonBases.get("Base") != undefined) {
          compareBase = this.table.comparisonBases.get("Base");
        }
        let avg = 0;
        let compareScore = [];
        let sum = 0;
        this.dataShowTotalAvgData.forEach(val => {
          if (val.name === ques) {
            avg = val.score;
          }
        });
        score.forEach((element, scoreIndex) => {
          if (element !== 'NaN') {
            sum = sum + element;
            // this.table.comparisonRows.forEach((valComp, camparisonText) => {
            //   if (camparisonText == ques) {
            //     if (valComp[scoreIndex] && valComp[scoreIndex] != undefined) {
            //       compareScore.push(Math.round(element - (valComp[scoreIndex])));
            //     }
            //     else {
            //       compareScore.push(0);
            //     }
            //   }
            // });
            this.table.previousScoreRows.forEach((valComp, camparisonText) => {
              if (camparisonText == ques) {
                if (valComp[scoreIndex] && valComp[scoreIndex] != undefined) {
                  compareScore.push(Math.round(valComp[scoreIndex]));
                }
                else {
                  compareScore.push(0);
                }
              }
            });
          }
          else {
            compareScore.push(0);
          }
        });
        const isSignificance = this.table.significance.get(ques);
        let obj = {
          question: ques,
          Score: score,
          Average: sum / score.length,
          TotalAverage: avg,
          compareScore: compareScore,
          compareBase: compareBase,
          isSignificance: isSignificance
        };
        this.dtRetailer.push({ ques: obj.question, totavg: obj.TotalAverage, avg: obj.Average, score: obj.Score });
        base1.push({ ques: 'Bases', totavg: '', avg: '', score: this.dataShowBases });
        this.pptDownloadObjectForReasonforretailer.serieswisedata.push({ 'seriesname': obj.question, 'totalaverage': obj.TotalAverage, 'selectedaverage': obj.Average, 'data': obj.Score })

        this.data = true;
        this.dataShowData.push(obj);
      });
      this.dtRetailer.push(base1[0]);
    }
  }
  downloadExcelFile() {
    this.csvOptions.title = 'Reason for retailer (%) - ' + this.Category;
    this.getfilter();
    this.csvOptions.headers = ['Filter(s)', this.filter];
    //this.csvOptions.headers = [' ', 'Average(Total Retailers)', 'Average(Selected Retailers)', this.retailersNameCsv];
    const data = Array.from(this.dtRetailer);
    const bases = this.dtRetailer[this.dtRetailer.length-1].score;
    data.forEach((val, index)=>{
      if(index < this.dtRetailer.length-1){
        val.totavg = this.scoreAndBase.transform(val.totavg);
        val.avg = this.scoreAndBase.transform(val.avg);
        val.score.forEach((score, i)=>{
          val.score[i] = this.scoreAndBase.transform(score, bases[i]);
        });
      }
    });
    let newdt=[];
    newdt.push({ques:'Retailers', totavg:'Average(Total Retailers)', avg: 'Average(Selected Retailers)', score:this.retailersNameCsv})
    data.forEach(el=>{
      newdt.push({ques:el.ques, totavg:el.totavg, avg:el.avg, score:el.score})
    })
    
    new AngularCsv(newdt, 'Reason For Retailer', this.csvOptions);
  }

  hideloader() {
    const loader = [this.dataShow.showLoader];
    if (loader.reduce((prev, curr) => prev || curr, false) === false) {
      this.showloader = false;
    }
  }

  ngOnDestroy(): void {
    this.updateDataUnsubscribe.next();
    this.updateDataUnsubscribe.complete();
  }

  toggleDropdown() {
    this.showDropdown = !this.showDropdown;
  }
}
