import { ReasonforRecentPurchase } from './../../model/reasonforrecent.purchase';
import { Component, OnInit, OnDestroy, AfterContentInit } from '@angular/core';
import { FilterService } from 'src/app/shell/services/filter.service';
import { FilterConfigService } from 'src/app/service/filter-config.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Brands } from 'src/app/model/brands';
import { AssetMappings } from 'src/app/model/asset.mappings';
import { ActivatedRoute } from '@angular/router';
import { Chart } from 'src/app/shell/models/chart';
import { AngularCsv } from 'angular7-csv/dist/Angular-csv';
import { ScoreAndBasePipe } from 'src/app/pipe/score-and-base.pipe';
import { FilterOption } from 'src/app/shell/models/filterOption';
import { PptExportService } from 'src/app/service/ppt-export.service';
import { ReasonForRecentPurchaseTrends } from './reasonForRecentPurchaseTrends';
import { FilterHideService } from 'src/app/service/filter-hide.service';
import { AppliedFilterSetService } from 'src/app/service/applied-filter-set.service';

@Component({
  selector: 'app-reason-recent-purchase',
  templateUrl: './reason-recent-purchase.component.html',
  styleUrls: ['./reason-recent-purchase.component.css'],
  providers: [ScoreAndBasePipe]
})
export class ReasonRecentPurchaseComponent implements OnInit, OnDestroy, AfterContentInit {

  dataShow: Chart;
  dataShowTotalAvg: Chart;
  isPageVisited: boolean = false;
  dataShowBases: Array<any>;
  brandList: Array<string>;
  onDataUpdate: Subject<any> = new Subject();
  showloader: boolean;
  updateDataUnsubscribe: Subject<any> = new Subject<any>();
  brandNameCodes = AssetMappings.brandNameAndCodes;
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
  brandNameCsv: Array<string>;
  timePeriodChips: Map<string, Array<FilterOption>> = new Map<string, Array<FilterOption>>();
  dtResent: Array<{ ques: string, score: Array<number>, base?: number, avg?: any }>;
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
  reasonForRecentPurchaseTrendsQues1: any;
  reasonForRecentPurchaseTrendsQues2: any;
  reasonForRecentPurchaseTrendsQues3: any;
  reasonForRecentPurchaseTrendsQues4: any;
  reasonForRecentPurchaseTrendsQues5: any;
  reasonForRecentPurchaseTrendsQues6: any;
  reasonForRecentPurchaseTrendsQues7: any;
  brandForTrends: any;
  pptDownloadreasonrecentpurchaseObject = {
    'brands': [],
    'serieswisescore': [],
    'bases': [],
    'filter': '',
    'category': '',
  };
  hideFilterForTrends: boolean = false;
  brandcode: any;
  filter:string;
  reasonForRecentPurchaseTrendsPPTData: Array<any> = new Array<any>();
  constructor(private filterService: FilterService, private filterConfigService: FilterConfigService,
    private pptexport1: PptExportService, private route: ActivatedRoute, private scoreAndBase: ScoreAndBasePipe,
    private hideFilterTrends: FilterHideService, private appliedFilterSet: AppliedFilterSetService) {
    this.route.params.subscribe(params => {
      if (this.isPageVisited) {
        this.updateDataUnsubscribe.next();
        this.updateDataUnsubscribe.complete();
      }
      this.Category = params.order;
      if (this.Category === 'Faucet') {
        this.filterConfigService.initializeCateogryBrandHealthFaucet();
      }
      if (this.Category === 'Showerhead') {
        this.filterConfigService.initializeCateogryBrandHealthShowerhead();
      }
      if (this.Category === 'Toilet') {
        this.filterConfigService.initializeCateogryBrandHealthToilet();
      }
      if (this.Category === 'TubShowerUnit') {
        this.filterConfigService.initializeCateogryBrandHealthTubShowerUnit();
      }
      this.filterService.optionSelectionCallback$
        .pipe(takeUntil(this.updateDataUnsubscribe))
        .subscribe(value => {
          this.updateData(this.Category);
          setTimeout(() => {
            this.onDataUpdate.next();
          });
        });
    });
  }
  ngAfterContentInit(): void {
    this.route.params.subscribe(params => {
      this.Category = params.order;
      this.categoryHeaderName = this.Category;
      if (this.Category) {
        this.Category = params.order;
        this.updateData(this.Category);
      } else {
        this.Category = params.order;
        this.createTables(this.Category);
      }
    });
  }

  ngOnInit() {
    this.isPageVisited = true;
    this.updateData(this.Category);
    this.route.params.subscribe(params => {
      if(this.filterService.getAppliedFilters().size===0){
        localStorage.removeItem('filterapp');
      }
      if (this.filterService.getAppliedFilters().size !== 0 ||
        this.filterService.getAppliedSeriesSelectors().size !== 0 ||
        this.filterService.getAppliedTimePeriods().size !== 0) {

        this.updateData(this.Category);
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
        this.updateData(this.Category);
        setTimeout(() => {
          this.onDataUpdate.next();
        });
      });
    // if (this.appliedFilterSet.choices.length > 0) {
    //   this.filterService.setChoices(this.appliedFilterSet.variable, this.appliedFilterSet.choices);
    // }
  }

  updateData(Category) {
    this.showloader = true;
    this.createTables(Category);
  }
  private setTimePeriodChips(variable, choices) {
    if (this.timePeriodChips.has(variable) && choices.length === 0) {
      this.timePeriodChips.delete(variable);
    } else {
      this.timePeriodChips.set(variable, [...choices]);
    }
    for (var i = 0; i < this.timePeriodChips.size; i++) {
      if (variable != "Allbrands") {
        this.pptDownloadreasonrecentpurchaseObject.filter = this.pptDownloadreasonrecentpurchaseObject.filter + " " + variable + " " + choices[0].text;
      }
    }
  }
  createTables(Category) {
    this.toggleChart('chartsTabs');
    const brands = new Brands(this.filterService);
    this.brandcode = brands.getBrandsCode();
    this.brandForTrends = this.brandcode;
    this.brandList = brands.getBrandsCode().map(val => AssetMappings.logoByBrandCode[val]);
    this.brandNameCsv = brands.getBrandsCode().map((val) => this.brandNameCodes[val]);
    this.pptDownloadreasonrecentpurchaseObject.brands = brands.getBrandsCode().map((val) => this.brandNameCodes[val]);
    const reasonforRecentPurchase: ReasonforRecentPurchase = new ReasonforRecentPurchase(Category);
    this.overallavg = false;
    this.checkdouble1 = 0;

    this.dataShowTotalAvg = reasonforRecentPurchase.totalAvg(Category);
    this.dataShowTotalAvg.addTableDataReady((output, dataTable) => {
      this.overallavg = true;
      this.checkdouble1++;
      if (this.checkdouble1 <= 1) {
        this.dataShowTotalAvgData = [];
        this.hideloader();
        dataTable.rows.forEach((element, index) => {
          const obj = {
            name: index,
            score: element[0]
          };
          this.dataShowTotalAvgData.push(obj);
        });
        this.recPurchaseDataShow();
      }
    });

    this.avgnew = false;
    this.checkdouble = 0;
    if (this.brandcode.length) {
      this.dataShow = reasonforRecentPurchase.simpleTable(Category, this.brandcode);
      this.dataShow.addTableDataReady((output, dataTable) => {
        this.checkdouble++;
        if (this.checkdouble <= 1) {
          this.avgnew = true;
          this.dataShowData = [];
          this.dtResent = [];
          this.hideloader();
          this.dataShowBases = dataTable.bases.get('Base');
          this.table = dataTable;
          this.recPurchaseDataShow();
        }
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
      //   this.filter = this.filter + " Compare with :" + element;
      // }
    });

    if (filterSide != null) {
      filterSide.forEach((element, i) => {
        if (i == 0) {
          this.filter = this.filter + ' Filter(s): ';
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
  downloadPptTrends() {
    this.showloader = true;
    const objnew = JSON.stringify(this.reasonForRecentPurchaseTrendsPPTData[0]);
    this.pptexport1.postPPTForTrends(objnew).subscribe((data) => {
      const blob = new Blob([data], { type: 'application/octet-stream' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      document.body.appendChild(a);
      a.href = url;
      a.download = 'ReasonForRecentPurchase_Trends_PPT.zip';
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
      this.showloader = false;
    }, error => {
      console.log(error);
      this.showloader = false;
    });
  }
  updateDataTrends(codes) {
    this.reasonForRecentPurchaseTrendsPPTData = [];
    const reasonForRecentPurchasetrends: ReasonForRecentPurchaseTrends = new ReasonForRecentPurchaseTrends(this.Category);
    if (this.period === 'Quarterly' || this.periodSeclected === 'tab1') {
      if (this.Category === 'Faucet') {
        this.chartMap(this.period, reasonForRecentPurchasetrends, codes);
      } else if (this.Category === 'Showerhead') {
        this.chartMap(this.period, reasonForRecentPurchasetrends, codes);
      } else if (this.Category === 'Toilet') {
        this.chartMap(this.period, reasonForRecentPurchasetrends, codes);
      } else if (this.Category === 'TubShowerUnit') {

      }
    } else if (this.period === 'Annually' || this.periodSeclected === 'tab3') {
      this.period = 'Yearly';
      if (this.Category === 'Faucet') {
        this.chartMap(this.period, reasonForRecentPurchasetrends, codes);
      } else if (this.Category === 'Showerhead') {
        this.chartMap(this.period, reasonForRecentPurchasetrends, codes);
      } else if (this.Category === 'Toilet') {
        this.chartMap(this.period, reasonForRecentPurchasetrends, codes);
      } else if (this.Category === 'TubShowerUnit') {

      }
    } else if (this.period === 'SemiAnnually' || this.periodSeclected === 'tab2') {
      this.period = 'Semiannual';
      if (this.Category === 'Faucet') {
        this.chartMap(this.period, reasonForRecentPurchasetrends, codes);
      } else if (this.Category === 'Showerhead') {
        this.chartMap(this.period, reasonForRecentPurchasetrends, codes);
      } else if (this.Category === 'Toilet') {
        this.chartMap(this.period, reasonForRecentPurchasetrends, codes);
      } else if (this.Category === 'TubShowerUnit') {

      }
    }
    this.reasonForRecentPurchaseTrendsPPTData.push(reasonForRecentPurchasetrends.reasonForRecentPurchaseTrendsPPTData);
  }

  chartMap(period, ref, codes) {
    this.getfilterTrends();
    if (this.Category === 'Faucet') {
      this.reasonForRecentPurchaseTrendsQues1 = ref.reasonForRPTable(period, 'To replace a leaky or malfunctioning faucet', codes,this.filter);
      this.reasonForRecentPurchaseTrendsQues2 = ref.reasonForRPTable(period, 'To replace a faucet with a cracked or peeling finish', codes,this.filter);
      this.reasonForRecentPurchaseTrendsQues3 = ref.reasonForRPTable(period, "Didn't like the old faucet / wanted a new one", codes,this.filter);
    } else if (this.Category === 'Showerhead') {
      this.reasonForRecentPurchaseTrendsQues1 = ref.reasonForRPTable(period, 'To replace a leaky or malfunctioning showerhead', codes,this.filter);
      this.reasonForRecentPurchaseTrendsQues2 = ref.reasonForRPTable(period, 'To replace a showerhead with a cracked or peeling finish', codes,this.filter);
      this.reasonForRecentPurchaseTrendsQues3 = ref.reasonForRPTable(period, "Didn't like the old showerhead / wanted a new one", codes,this.filter);
    } else if (this.Category === 'Toilet') {
      this.reasonForRecentPurchaseTrendsQues1 = ref.reasonForRPTable(period, 'To replace a leaky or malfunctioning toilet', codes,this.filter);
      this.reasonForRecentPurchaseTrendsQues2 = ref.reasonForRPTable(period, 'To replace a cracked or chipped toilet', codes,this.filter);
      this.reasonForRecentPurchaseTrendsQues3 = ref.reasonForRPTable(period, "Didn't like the old toilet / wanted a new one", codes,this.filter);
    }
    this.reasonForRecentPurchaseTrendsQues4 = ref.reasonForRPTable(period, 'As part of a redecorating project of less than $1000, where you were updating the look of the room by painting and changing out items like shower curtains, towels, faucets, accessories, etc.', codes,this.filter);
    this.reasonForRecentPurchaseTrendsQues5 = ref.reasonForRPTable(period, 'As part of a remodeling project of $1000 or more, which involved structural change or replacement of fixtures like toilets, tubs, cabinets, or sinks', codes,this.filter);
    this.reasonForRecentPurchaseTrendsQues6 = ref.reasonForRPTable(period, 'As part of new construction work where you built an addition to your existing home', codes,this.filter);
    this.reasonForRecentPurchaseTrendsQues7 = ref.reasonForRPTable(period, 'As part of new construction work where you built a new house', codes,this.filter);
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
      this.showloader = true;
      this.updateDataTrends(this.brandForTrends);
      setTimeout(() => {
        this.onDataUpdate.next();
      });
      setTimeout(() => {
        this.showloader = false;
      }, 4000);
    }
  }

  changeTimePeriod(period, periodSeclected) {
    this.period = period;
    this.periodSeclected = periodSeclected;
    if (this.selectedTab === 'trendsTabs') {
      this.showloader = true;
      this.updateDataTrends(this.brandForTrends);
      setTimeout(() => {
        this.onDataUpdate.next();
      });
      setTimeout(() => {
        this.showloader = false;
      }, 4000);
    }
  }

  recPurchaseDataShow() {
    if (this.avgnew && this.overallavg) {
      var base1: Array<{ ques: string, score: Array<number>, avg?: any, base?: number }>;
      base1 = [];
      this.table.rows.forEach((score, ques) => {
        let compareBase = [];
        if (this.table.comparisonBases.get("Base") != undefined) {
          compareBase = this.table.comparisonBases.get("Base");
        }
        let avg = 0;
        let i = 0;
        let compareScore = [];
        this.dataShowTotalAvgData.forEach(val => {
          if (val.name === ques) {
            avg = val.score;
          }
        });
        score.forEach((element, scoreIndex) => {
          if (element !== 'NaN') {
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
        if (ques === 'Some other reason [O]') {
          ques = 'Some other reason';
        }
        let obj = {
          question: ques,
          Score: score,
          Avg: avg,
          compareScore: compareScore,
          compareBase: compareBase,
          isSignificance: isSignificance
        };
        this.dtResent.push({ ques: obj.question, avg: obj.Avg, score: obj.Score });
        base1.push({ ques: 'Bases', avg: '', score: this.dataShowBases });
        this.data = true;
        this.dataShowData.push(obj);
        this.pptDownloadreasonrecentpurchaseObject.serieswisescore.push({ 'seriesname': obj.question, 'data': obj.Score, 'overallaverage': obj.Avg });

      });
      this.pptDownloadreasonrecentpurchaseObject.bases = this.dataShowBases;
      this.dtResent.push(base1[0]);
    }
  }

  /**
   * To Convert Data into CSV Form
   */
  pptexport(pptName) {
    this.pptDownloadreasonrecentpurchaseObject.category = this.Category;
  this.getfilter();
  this.pptDownloadreasonrecentpurchaseObject.filter=this.filter;
    this.showloader = true;
    var obj = JSON.stringify(this.pptDownloadreasonrecentpurchaseObject);
    this.pptexport1.postPPTForReasonForRecentPurchaserDownload(JSON.stringify(obj)).subscribe((data) => {
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
  downloadExcelFile() {
    const data = this.dtResent;
    this.getfilter();
    
    data.forEach((val, ind) => {
      if (val.ques !== 'Bases') {
        val.score.forEach((element, i) => {
          this.dtResent[ind].score[i] = this.scoreAndBase.transform(element, this.dataShowBases[i]);
        });
      }
    });
    this.csvOptions.title = 'Reason for recent purchase (%) - ' + this.Category;
    this.csvOptions.headers = ['Filter(s)',this.filter];
    let newdt=[];
    newdt.push({ques:' ', avg:'Overall Market Average', score:this.brandNameCsv});

    data.forEach(el=>{
      newdt.push({ques:el.ques, avg:el.avg, score:el.score});
    })
    //this.csvOptions.headers = [' ', 'Average (Total Brands)', this.brandNameCsv];
    // tslint:disable-next-line:no-unused-expression
    new AngularCsv(newdt, 'Reason For Recent Purchase', this.csvOptions);
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
}
