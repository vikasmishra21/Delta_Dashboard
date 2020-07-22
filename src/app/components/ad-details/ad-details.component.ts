import { Component, OnInit, OnDestroy } from '@angular/core';
import { AdDetails } from '../ad-details/Ad_Details/adDetails';
import { Chart } from 'src/app/shell/models/chart';
import { FilterService } from 'src/app/shell/services/filter.service';
import { takeUntil, switchMap } from 'rxjs/operators';
import { Subject, Subscription } from 'rxjs';
import { UploadAdDetailService } from 'src/app/service/upload-ad-detail.service';
import { ActivatedRoute, RouterState } from '@angular/router';
import { BrandRecall } from './Ad_Details/brandRecall';
import { AngularCsv } from 'angular7-csv/dist/Angular-csv';
import { AdService } from 'src/app/service/ad-service';
import { CollectionOutput } from 'src/app/shell/models/collectionOutput';
import { ScoreAndBasePipe } from 'src/app/pipe/score-and-base.pipe';
import { FilterOption } from 'src/app/shell/models/filterOption';
import { PptExportService } from 'src/app/service/ppt-export.service';
import { AdDetailsTrends } from './Ad_Details/adDetailsTrends';
import { FilterHideService } from 'src/app/service/filter-hide.service';
import { AppliedFilterSetService } from 'src/app/service/applied-filter-set.service';
import { AdDetailsSchema } from 'src/app/model/addetails';

@Component({
  selector: 'app-ad-details',
  templateUrl: './ad-details.component.html',
  styleUrls: ['./ad-details.component.css'],
  providers: [ScoreAndBasePipe]
})
export class AdDetailsComponent implements OnInit, OnDestroy {

  dataShowCallToAction: Chart;
  dataShowCallToActionBases: any = [];
  dataShowCallToActionData: Array<any> = new Array<any>();
  dataShowAddiagnostics: Chart;
  dataShowAddiagnosticsBases: any = [];
  dataShowAddiagnosticsData: Array<any> = new Array<any>();
  dataShowAdRecall: Chart;
  dataShowAdRecallBases: any = [];
  dataShowAdRecallData: Array<any> = new Array<any>();
  dataShowBrandRecall: Chart;
  dataShowBrandRecallLink: Chart;
  dataShowBrandRecallBases: Array<any> = [];
  dataShowBrandRecallBases1: Array<any> = [];
  dataShowBrandRecallData: Array<any> = new Array<any>();
  dataShowBrandRecallData1: Array<any> = new Array<any>();
  dataShowAdDiagShow: Array<any> = new Array<any>();
  dataShowAdCalltoActionShow: Array<any> = new Array<any>();
  onDataUpdate: Subject<any> = new Subject();
  updateDataUnsubscribe: Subject<any> = new Subject<any>();
  addDet = [];
  data = false;
  table: any;
  adName: string = '';
  adid: number = null;
  dtForCSVCallToAction: Array<{ ques: string, score: number }>;
  dtForCSVAddiagnostics: Array<{ ques: string, score: number }>;
  dtForCSVBrandRecall: Array<{ ques: string, score: number }>;
  dtForCSVBrandRecall1: Array<{ ques: string, score: number }>;
  dtForCSVAdRecall: Array<{ ques: string, score: number }>;
  showLoader: boolean;
  selectedAds: Array<AdDetailsSchema> = new Array<AdDetailsSchema>();
  addLists: Array<AdDetailsSchema> = new Array<AdDetailsSchema>();
  dtBrandRecall: Array<BrandRecall> = new Array<BrandRecall>();
  dtBrandRecall1: Array<BrandRecall> = new Array<BrandRecall>();
  firstOpt: number;
  secondOpt: number;
  thirdOpt: number;
  fourthOpt: number;
  fifthOpt: number;
  firstOpt1: number;
  secondOpt1: number;
  thirdOpt1: number;
  fourthOpt1: number;
  fifthOpt1: number;
  brand: any;
  filter: string;
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

  message: any;
  subs: Subscription;
  subsSingleAdd: Subscription;
  idAdd: any;
  isApiCall: boolean = false;
  firstrundate: any;
  lastrundate: any;
  quarterstartdate: any;
  quarterenddate: any;
  timePeriodChips: Map<string, Array<FilterOption>> = new Map<string, Array<FilterOption>>();
  adRecallValue: number;
  adRecallValueCircle: any;
  adRecallBase: number;
  pptAddiscriptor = {
    'serieswisedata': [],
    'filter': "",
    'bases': [],
    'category': ''
  }
  pptAdCalltoAction = {
    'serieswisedata': [],
    'filter': "",
    'bases': [],
    'category': ''
  }
  pptBRANDLINKAGEADRECALLED = {
    'serieswisedata': [],
    'filter': "",
    'bases': [],
    'category': ''
  }
  pptBRANDLINKAGE = {
    'serieswisedata': [],
    'filter': "",
    'bases': [],
    'category': ''
  }
  pptAdRecalldt = {
    'score': 0,
    'filter': "",
    'bases': 0,
    'category': ''
  }

  public showChart = false;
  public showTrends = false;
  selectedTab: any;
  period = 'Quarterly';
  periodSeclected = 'tab1';

  addDiagTrends: any;
  callToActionTrends: any;
  adRecallTrends: any;
  brandLinkageTrends: any;
  brandLinkageAdRecalledTrends: any;
  hideFilterForTrends: boolean = false;
  adDetailsTrendsPptData: Array<any> = new Array<any>();
  adRecallDataPresent: boolean;
  constructor(private addDetailsService: UploadAdDetailService, private filterService: FilterService,
    private route: ActivatedRoute,
    private pptexport1: PptExportService, private idData: AdService, private scoreAndBase: ScoreAndBasePipe,
    private hideFilterTrends: FilterHideService, private appliedFilterSet: AppliedFilterSetService) {
    // this.filterConfigService.initializeADSelector();
    this.route.params.subscribe(params => {
      const nameAndId = params.order.split('_');
      if (nameAndId[0] === 'Lysol ActiClean Self-Clean' || nameAndId[0] === 'Konnect-Pouring Made Easy' ||
        nameAndId[0] === 'In2ition Two-In-One' || nameAndId[0] === 'U-Smart Faucet') {
        this.adName = nameAndId[0];
      } else {
        this.adName = nameAndId[0].replace('-', '/');
      }
      this.updateData();
      setTimeout(() => {
        this.onDataUpdate.next();
      });
      this.subsSingleAdd = this.idData.getSingleAd1().subscribe(data => {
        let adlist1 = data.split('_');
        this.adName = adlist1[0];
        this.selectedAd(adlist1[1]);
        this.updateData();
        setTimeout(() => {
          this.onDataUpdate.next();
        });
      });
      this.selectedAd(nameAndId[1]);
    });
  }

  ngOnInit() {
    this.showLoader = true;
    this.route.params.subscribe(params => {
      if (this.filterService.getAppliedFilters().size === 0) {
        localStorage.removeItem('filterapp');
      }
      if (this.filterService.getAppliedFilters().size !== 0 ||
        this.filterService.getAppliedSeriesSelectors().size !== 0 ||
        this.filterService.getAppliedTimePeriods().size !== 0) {

        this.updateData();
        setTimeout(() => {
          this.onDataUpdate.next();
        });
      }
    });

    this.filterService.optionSelectionCallback$
      .pipe(takeUntil(this.updateDataUnsubscribe))
      .subscribe(value => {
        this.updateData();
        setTimeout(() => {
          this.onDataUpdate.next();
        });
      });
  }
  sendAddName(adname: any) {
    this.idData.sendSingleAd(adname);
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
          this.filter = this.filter + ' Side Filter(s): ';
          this.filter = this.filter + " " + element;
        }
        else {
          this.filter = this.filter + "| " + element;
        }
      });
    };
  }
  selectedAd(id) {
    if (id !== 'undefined') {
      this.showLoader = true;
      this.addDetailsService.getAds(id).subscribe((data) => {
        this.selectedAds = [];
        this.selectedAds.push(data);
        this.selectedAds.forEach((val, i) => {
          if (this.selectedAds[i].product_category.startsWith(',')) {
            this.selectedAds[i].product_category = this.selectedAds[i].product_category.slice(1);
          }
        });
        this.addLists = data;
        this.brand = data.brand;
        this.getDate();
        this.isApiCall = true;
      }, error => {
        console.log(error);
        this.isApiCall = true;
      });
    }
  }

  getDate() {
    // tslint:disable-next-line: forin
    for (const key in this.addLists) {
      switch (key) {
        case 'firstrundate': {
          const stringFullDateTime = new Date(this.addLists[key].toString());
          // const stringFullDate = stringFullDateTime.slice(0, 10);
          this.firstrundate = this.dateConversion(stringFullDateTime);
          break;
        }
        case 'lastrundate': {
          const stringFullDateTime = new Date(this.addLists[key].toString());
          // const stringFullDate = stringFullDateTime.slice(0, 10);
          this.lastrundate = this.dateConversion(stringFullDateTime);
          break;
        }
      }
    }

  }

  dateConversion(dateValue) {
    const date: Date = new Date(dateValue);
    const month = date.getMonth() + 1 >= 10 ? date.getMonth() + 1 : '0' + (date.getMonth() + 1);
    const year = date.getFullYear();
    const newdate = date.getDate() >= 10 ? date.getDate() : '0' + date.getDate();
    return month + '/' + newdate + '/' + year;
  }

  updateData() {
    // const ads = new AD(this.filterService);
    this.toggleChart('chartsTabs');
    const adDetails: AdDetails = new AdDetails();
    this.showLoader = true;

    // call to action
    this.dataShowCallToAction = adDetails.callToAction(this.adName);
    this.dataShowCallToAction.addTableDataReady((output, dataTable) => {
      this.dataShowCallToActionData = [];
      this.dtForCSVCallToAction = [];
      this.dataShowAdCalltoActionShow = output;
      this.dataShowCallToActionBases = dataTable.bases.get('Base');
      this.table = dataTable;
      this.table.rows.forEach((score, ques) => {
        const isSignificance = this.table.significance.get(ques)[0];
        let obj = {
          question: ques,
          Score: score,
          compareScore: 0,
          compareBase: [],
          isSignificance: isSignificance
        };
        if (dataTable.comparisonBases.get("Base") != undefined) {
          obj.compareBase = dataTable.comparisonBases.get("Base");

          // dataTable.comparisonRows.forEach((val, valindex) => {
          //   if (valindex === ques && val[0] != undefined && !isNaN(val[0])) {
          //     obj.compareScore = Math.round(score - (val[0]))
          //   }
          // });
          dataTable.previousScoreRows.forEach((val, valindex) => {
            if (valindex === ques && val[0] != undefined) {
              obj.compareScore = val[0];
            }
          });
        }
        this.dtForCSVCallToAction.push({ ques: obj.question, score: obj.Score });
        this.data = true;
        this.dataShowCallToActionData.push(obj);
        this.pptAdCalltoAction.serieswisedata.push({ 'seriesname': obj.question, 'data': obj.Score[0] });
      });
      this.dtForCSVCallToAction.push({ ques: 'Base', score: this.dataShowCallToActionBases });
      if (this.dataShowCallToActionBases) {
        this.pptAdCalltoAction.bases = this.dataShowCallToActionBases[0];
      }
      this.sendAddName(this.adName);
      this.hideloader();
    });

    // Addiagnostics
    this.dataShowAddiagnostics = adDetails.adDiagnostic(this.adName);
    this.dataShowAddiagnostics.addTableDataReady((output, dataTable) => {
      this.dataShowAddiagnosticsData = [];
      this.dtForCSVAddiagnostics = [];
      this.dataShowAdDiagShow = output;
      this.dataShowAddiagnosticsBases = dataTable.bases.get('Base');
      this.table = dataTable;
      this.table.rows.forEach((score, ques) => {
        if (ques !== 'Not answered any top2box') {
          const isSignificance = this.table.significance.get(ques)[0];
          let obj = {
            question: ques,
            Score: score,
            compareScore: 0,
            compareBase: [],
            isSignificance: isSignificance
          };
          if (dataTable.comparisonBases.get("Base") != undefined) {
            obj.compareBase = dataTable.comparisonBases.get("Base");

            // dataTable.comparisonRows.forEach((val, valindex) => {
            //   if (valindex === ques && val[0] != undefined && !isNaN(val[0])) {
            //     obj.compareScore = Math.round(score - (val[0]))
            //   }
            // });
            dataTable.previousScoreRows.forEach((val, valindex) => {
              if (valindex === ques && val[0] != undefined) {
                obj.compareScore = val[0];
              }
            });
          }
          this.dtForCSVAddiagnostics.push({ ques: obj.question, score: obj.Score });
          this.data = true;
          this.dataShowAddiagnosticsData.push(obj);
          this.pptAddiscriptor.serieswisedata.push({ "seriesname": obj.question, 'data': obj.Score[0] });
          this.hideloader();
        }
      });
      this.dtForCSVAddiagnostics.push({ ques: 'Base', score: this.dataShowAddiagnosticsBases });
      if (this.dataShowAddiagnosticsBases) {
        this.pptAddiscriptor.bases = this.dataShowAddiagnosticsBases[0];
      }
    });

    // Ad-Recall
    this.dtForCSVAdRecall = [];
    this.dataShowAdRecall = adDetails.adRecall(this.adName);
    let count = 0;
    this.dataShowAdRecall.addCalculationLogic((output: CollectionOutput) => {
      count++;
      if (count === 1) {
        if (output.TableOutput.get('Ad Recall').length !== 0) {
          this.adRecallDataPresent = true;
          this.adRecallValue = Math.round(output.TableOutput.get('Ad Recall')[0].Score);
          this.adRecallValueCircle = (this.adRecallValue / 200);
          if (output.Bases.get('Ad Recall')[0]) {
            this.adRecallBase = output.Bases.get('Ad Recall')[0].Score;
          }
          output.TableOutput.forEach(val => {
            val.forEach(value => {
              value.Score = Math.round(value.Score);
              this.dtForCSVAdRecall.push({ ques: 'Percentage', score: value.Score });
            });
          });
          if (output.Bases.get('Ad Recall')[0]) {
            // this.adRecallBase = output.Bases.get('Ad Recall')[0].Score;
            this.dtForCSVAdRecall.push({ ques: 'Base', score: output.Bases.get('Ad Recall')[0].Score });
          }
          return output;
        } else {
          this.adRecallDataPresent = false;
        }
      }
    });

    // Brand-Recall
    this.dataShowBrandRecall = adDetails.brandLinkage(this.adName);
    this.firstOpt = null;
    this.secondOpt = null;
    this.thirdOpt = null;
    this.fourthOpt = null;
    this.fifthOpt = null;
    this.dataShowBrandRecall.addTableDataReady((output, dataTable) => {
      this.showLoader = false;
      this.dtBrandRecall = [];
      this.dtForCSVBrandRecall = [];
      this.dataShowBrandRecallData = output;
      this.dataShowBrandRecallBases = dataTable.bases.get('Base');
      this.dataShowBrandRecallData.forEach(element => {
        switch (element.SeriesName) {
          case 'You could not help but remember it is for':
            this.firstOpt = Math.round(element.Score);
            const myobj1 = {
              option: 'You could not help but remember it is for',
              score: [this.firstOpt, this.dataShowBrandRecallBases]
            };
            this.dtBrandRecall.push(myobj1);
            this.dtForCSVBrandRecall.push({ ques: myobj1.option, score: this.firstOpt });
            break;
          case 'It is pretty good at making you remember it is for':
            this.secondOpt = Math.round(element.Score);
            const myobj2 = {
              option: 'It is pretty good at making you remember it is for',
              score: [this.secondOpt, this.dataShowBrandRecallBases]
            };
            this.dtBrandRecall.push(myobj2);
            this.dtForCSVBrandRecall.push({ ques: myobj2.option, score: this.secondOpt });
            break;
          case 'It is just okay at making you remember it is for':
            this.thirdOpt = Math.round(element.Score);
            const myobj3 = {
              option: 'It is just okay at making you remember it is for',
              score: [this.thirdOpt, this.dataShowBrandRecallBases]
            };
            this.dtBrandRecall.push(myobj3);
            this.dtForCSVBrandRecall.push({ ques: myobj3.option, score: this.thirdOpt });
            break;
          case 'It could be for any brand of kitchen or bath plumbing products':
            this.fourthOpt = Math.round(element.Score);
            const myobj4 = {
              option: 'It could be for any brand of kitchen or bath plumbing products',
              score: [this.fourthOpt, this.dataShowBrandRecallBases]
            };
            this.dtBrandRecall.push(myobj4);
            this.dtForCSVBrandRecall.push({ ques: myobj4.option, score: this.fourthOpt });
            break;
          case 'It could be for almost anything':
            this.fifthOpt = Math.round(element.Score);
            const myobj5 = {
              option: 'It could be for almost anything',
              score: [this.fifthOpt, this.dataShowBrandRecallBases]
            };
            this.dtBrandRecall.push(myobj5);
            this.dtForCSVBrandRecall.push({ ques: myobj5.option, score: this.fifthOpt });
            break;
        }
        let dt = [];
        this.dtBrandRecall.forEach(element => {
          dt.push(element);
        });
        this.dtBrandRecall = [];
        this.dtBrandRecall.push(dt[0]);
        this.dtBrandRecall.push(dt[1]);
        this.dtBrandRecall.push(dt[2]);
        this.dtBrandRecall.push(dt[3]);
      });
      if (this.dataShowBrandRecallBases) {
        this.dtForCSVBrandRecall.push({ ques: 'Base', score: this.dataShowBrandRecallBases[0] });
      }
    });

    this.dataShowBrandRecallLink = adDetails.brandLinkageAdRecalled(this.adName);
    this.firstOpt1 = null;
    this.secondOpt1 = null;
    this.thirdOpt1 = null;
    this.fourthOpt1 = null;
    this.fifthOpt1 = null;
    this.dataShowBrandRecallLink.addTableDataReady((output, dataTable) => {
      this.showLoader = false;
      this.dtBrandRecall1 = [];
      this.dtForCSVBrandRecall1 = [];
      this.dataShowBrandRecallData1 = output;
      this.dataShowBrandRecallBases1 = dataTable.bases.get('Base');
      this.dataShowBrandRecallData1.forEach(element => {
        switch (element.SeriesName) {
          case 'You could not help but remember it is for':
            this.firstOpt1 = Math.round(element.Score);
            const myobj1 = {
              option: 'You could not help but remember it is for',
              score: [this.firstOpt1, this.dataShowBrandRecallBases1]
            };
            this.dtBrandRecall1.push(myobj1);
            this.dtForCSVBrandRecall1.push({ ques: myobj1.option, score: this.firstOpt1 });
            break;
          case 'It is pretty good at making you remember it is for':
            this.secondOpt1 = Math.round(element.Score);
            const myobj2 = {
              option: 'It is pretty good at making you remember it is for',
              score: [this.secondOpt1, this.dataShowBrandRecallBases1]
            };
            this.dtBrandRecall1.push(myobj2);
            this.dtForCSVBrandRecall1.push({ ques: myobj2.option, score: this.secondOpt1 });
            break;
          case 'It is just okay at making you remember it is for':
            this.thirdOpt1 = Math.round(element.Score);
            const myobj3 = {
              option: 'It is just okay at making you remember it is for',
              score: [this.thirdOpt1, this.dataShowBrandRecallBases1]
            };
            this.dtBrandRecall1.push(myobj3);
            this.dtForCSVBrandRecall1.push({ ques: myobj3.option, score: this.thirdOpt1 });
            break;
          // case 'It could be for any brand of kitchen or bath plumbing products':
          //   this.fourthOpt1 = Math.round(element.Score);
          //   const myobj4 = {
          //     option: 'It could be for any brand of kitchen or bath plumbing products',
          //     score: [this.fourthOpt1, this.dataShowBrandRecallBases1]
          //    };
          //   this.dtBrandRecall1.push(myobj4);
          //   this.dtForCSVBrandRecall1.push({ques: myobj4.option, score: this.fourthOpt1});
          //   break;
          case 'It could be for almost anything':
            this.fifthOpt1 = Math.round(element.Score);
            const myobj5 = {
              option: 'It could be for almost anything',
              score: [this.fifthOpt1, this.dataShowBrandRecallBases1]
            };
            this.dtBrandRecall1.push(myobj5);
            this.dtForCSVBrandRecall1.push({ ques: myobj5.option, score: this.fifthOpt1 });
            break;
        }
        let dt1 = [];
        this.dtBrandRecall1.forEach(element => {
          dt1.push(element);
        });
        this.dtBrandRecall1 = [];
        this.dtBrandRecall1.push(dt1[0]);
        this.dtBrandRecall1.push(dt1[1]);
        this.dtBrandRecall1.push(dt1[2]);
        this.dtBrandRecall1.push(dt1[3]);
      });
      if (this.dataShowBrandRecallBases1) {
        this.dtForCSVBrandRecall1.push({ ques: 'Base', score: this.dataShowBrandRecallBases1[0] });
      }
    });
  }

  downloadPptTrends() {
    this.showLoader = true;
    const objnew = JSON.stringify(this.adDetailsTrendsPptData[0]);
    this.pptexport1.postPPTForTrends(objnew).subscribe((data) => {
      const blob = new Blob([data], { type: 'application/octet-stream' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      document.body.appendChild(a);
      a.href = url;
      a.download = 'AdDetails_Trends_PPT.zip';
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
      this.showLoader = false;
    }, error => {
      console.log(error);
      this.showLoader = false;
    });
  }

  updateDataTrends(adName) {
    this.adDetailsTrendsPptData = [];
    const adDetailsTrends: AdDetailsTrends = new AdDetailsTrends();
    if (this.period === 'Quarterly') {
      this.chartMap(this.period, adDetailsTrends, adName);
    } else if (this.period === 'Annually') {
      this.period = 'Yearly';
      this.chartMap(this.period, adDetailsTrends, adName);
    } else if (this.period === 'SemiAnnually') {
      this.period = 'Semiannual';
      this.chartMap(this.period, adDetailsTrends, adName);
    }
    this.adDetailsTrendsPptData.push(adDetailsTrends.adDetailsTrendsPptData);
  }

  chartMap(period, ref, adName) {
    this.addDiagTrends = ref.adDiagnosticTrends(period, 'AD PERCEPTIONS (% TOP 2 BOX)', adName);
    this.callToActionTrends = ref.callToActionTrends(period, 'CALL TO ACTION', adName);
    this.adRecallTrends = ref.adRecallTrends(period, 'AD RECALL', adName);
    this.brandLinkageTrends = ref.brandLinkageTrends(period, 'BRAND LINKAGE', adName);
    this.brandLinkageAdRecalledTrends = ref.brandLinkageAdRecalledTrends(period, 'BRAND LINKAGE AD RECALLED', adName);
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
      this.updateDataTrends(this.adName);
      setTimeout(() => {
        this.onDataUpdate.next();
      });
      setTimeout(() => {
        this.showLoader = false;
      }, 5000);
    }
  }

  changeTimePeriod(period, periodSeclected) {
    this.period = period;
    this.periodSeclected = periodSeclected;
    if (this.selectedTab === 'trendsTabs') {
      this.showLoader = true;
      this.updateDataTrends(this.adName);
      setTimeout(() => {
        this.onDataUpdate.next();
      });
      setTimeout(() => {
        this.showLoader = false;
      }, 5000);
    }
  }

  downloadExcelFileCallToAction() {
    const data = this.dtForCSVCallToAction;
    this.getfilter();
    data.forEach((val, i) => {
      this.dtForCSVCallToAction[i].score[0] = this.scoreAndBase.transform(val.score[0], this.dataShowCallToActionBases[0]);
    });
    this.csvOptions.title = 'Call To Action';
    this.csvOptions.headers=[];
    this.csvOptions.headers = ['Filter(s)', this.filter];
    let dt = [];
    dt.push({ ques: ' ', score: 'Percentage' })
    this.dtForCSVCallToAction.forEach(el => {
      dt.push(el);
    })
    new AngularCsv(dt, 'Call To Action', this.csvOptions);
  }

  downloadExcelFileAdDiagnostic() {
    const data = this.dtForCSVAddiagnostics;
    this.getfilter();
    data.forEach((val, i) => {
      this.dtForCSVAddiagnostics[i].score[0] = this.scoreAndBase.transform(val.score[0], this.dataShowAddiagnosticsBases[0]);
    });
    this.csvOptions.title = 'Ad Perceptions (% Top 2 Box)';
    this.csvOptions.headers=[];
    this.csvOptions.headers = ['Filter(s)', this.filter];
    let dt = [];
    dt.push({ ques: ' ', score: 'Percentage' })
    this.dtForCSVAddiagnostics.forEach(el => {
      dt.push(el);
    })
    // tslint:disable-next-line: no-unused-expression
    new AngularCsv(dt, 'Ad Perceptions (% Top 2 Box)', this.csvOptions);
  }

  downloadExcelFileBrandLinkage() {
    const data = this.dtForCSVBrandRecall;
    this.getfilter();
    data.forEach((val, i) => {
      this.dtForCSVBrandRecall[i].score = this.scoreAndBase.transform(val.score, this.dataShowBrandRecallBases[0]);
    });
    this.csvOptions.title = 'Brand Linkage';
    this.csvOptions.headers=[];
    this.csvOptions.headers = ['Filter(s)', this.filter];
    let dt = [];
    dt.push({ ques: ' ', score: 'Percentage' })
    this.dtForCSVBrandRecall.forEach(el => {
      dt.push(el);
    })
    // tslint:disable-next-line: no-unused-expression
    new AngularCsv(dt, 'Brand Linkage', this.csvOptions);
  }

  downloadExcelFileBrandLinkageAdRecall() {
    const data = this.dtForCSVBrandRecall1;
    this.getfilter();
    data.forEach((val, i) => {
      this.dtForCSVBrandRecall1[i].score = this.scoreAndBase.transform(val.score, this.dataShowBrandRecallBases1[0]);
    });
    this.csvOptions.title = 'Brand Linkage (Ad Recalled)';
    //this.csvOptions.headers = [' ', 'Percentage'];
    this.csvOptions.headers=[];
    this.csvOptions.headers = ['Filter(s)', this.filter];
    let dt = [];
    dt.push({ ques: ' ', score: 'Percentage' })
    this.dtForCSVBrandRecall1.forEach(el => {
      dt.push(el);
    })
    // tslint:disable-next-line: no-unused-expression
    new AngularCsv(dt, 'Brand Linkage (Ad Recalled)', this.csvOptions);
  }
  pptexportAddiagnostic() {
    this.pptAddiscriptor.category = this.adName;
    this.getfilter();
    this.pptAddiscriptor.filter = this.filter;
    this.showLoader = true;
    let obj = JSON.stringify(this.pptAddiscriptor);
    this.pptexport1.postaddiag2(JSON.stringify(obj)).subscribe((data) => {
      let blob = new Blob([data], { type: "application/octet-stream" });
      let url = window.URL.createObjectURL(blob);
      let a = document.createElement("a");
      document.body.appendChild(a);
      a.href = url;
      a.download = 'Ad Perceptions_' + this.adName + '.zip';
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
      this.showLoader = false;
    }, error => {
      console.log(error);
      this.showLoader = false;
    });

  }
  pptAdRecall() {
    this.pptAdRecalldt.category = this.adName;
    this.getfilter();
    this.pptAdRecalldt.filter = this.filter;
    this.pptAdRecalldt.score = this.adRecallValue;
    this.pptAdRecalldt.bases = this.adRecallBase;
    this.showLoader = true;
    let obj1 = JSON.stringify(this.pptAdRecalldt);
    this.pptexport1.postaddetailsAdrecalled(JSON.stringify(obj1)).subscribe((data) => {
      let blob = new Blob([data], { type: "application/octet-stream" });
      let url = window.URL.createObjectURL(blob);
      let a = document.createElement("a");
      document.body.appendChild(a);
      a.href = url;
      a.download = 'Ad Recall_' + this.adName + '.zip';
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
      this.showLoader = false;
    }, error => {
      console.log(error);
      this.showLoader = false;
    });
  }
  pptBRANDLINKAGEADRECALLEDexport() {
    this.pptBRANDLINKAGEADRECALLED.serieswisedata = [];
    this.getfilter();
    this.dtForCSVBrandRecall1.forEach(element => {
      this.pptBRANDLINKAGEADRECALLED.serieswisedata.push({ 'seriesname': element.ques, 'data': element.score });
    })
    this.pptBRANDLINKAGEADRECALLED.filter = this.filter;
    this.pptBRANDLINKAGEADRECALLED.category = this.adName;
    this.pptBRANDLINKAGEADRECALLED.bases = this.dataShowBrandRecallBases1[0];
    this.showLoader = true;
    let obj = JSON.stringify(this.pptBRANDLINKAGEADRECALLED);
    this.pptexport1.postadLinkageadrecalled(JSON.stringify(obj)).subscribe((data) => {
      let blob = new Blob([data], { type: "application/octet-stream" });
      let url = window.URL.createObjectURL(blob);
      let a = document.createElement("a");
      document.body.appendChild(a);
      a.href = url;
      a.download = 'Brand Linkage (Ad Recalled)_' + this.adName + '.zip';
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
      this.showLoader = false;
    }, error => {
      console.log(error);
      this.showLoader = false;
    });

  }
  pptBRANDLINKAGEexport() {
    this.pptBRANDLINKAGE.serieswisedata = [];
    this.getfilter();
    this.dtForCSVBrandRecall.forEach(element => {
      this.pptBRANDLINKAGE.serieswisedata.push({ 'seriesname': element.ques, 'data': element.score });
    })
    this.pptBRANDLINKAGE.filter = this.filter;

    this.pptBRANDLINKAGE.category = this.adName;
    this.pptBRANDLINKAGE.bases = this.dataShowBrandRecallBases[0];
    this.showLoader = true;
    let obj = JSON.stringify(this.pptBRANDLINKAGE);
    this.pptexport1.postadLinkage(JSON.stringify(obj)).subscribe((data) => {
      let blob = new Blob([data], { type: "application/octet-stream" });
      let url = window.URL.createObjectURL(blob);
      let a = document.createElement("a");
      document.body.appendChild(a);
      a.href = url;
      a.download = 'Brand Linkage_' + this.adName + '.zip';
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
      this.showLoader = false;
    }, error => {
      console.log(error);
      this.showLoader = false;
    });
  }
  pptexportAddcalltoaction() {
    this.pptAdCalltoAction.category = this.adName;
    this.getfilter();
    this.pptAdCalltoAction.filter = this.filter;
    this.showLoader = true;
    let obj = JSON.stringify(this.pptAdCalltoAction);
    this.pptexport1.postadrecalltoaction2(JSON.stringify(obj)).subscribe((data) => {
      let blob = new Blob([data], { type: "application/octet-stream" });
      let url = window.URL.createObjectURL(blob);
      let a = document.createElement("a");
      document.body.appendChild(a);
      a.href = url;
      a.download = 'Ad Call to Action_' + this.adName + '.zip';
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
      this.showLoader = false;
    }, error => {
      console.log(error);
      this.showLoader = false;
    });
  }
  downloadExcelFileAdRecall() {
    this.getfilter();
    this.csvOptions.title = 'Ad Recall';
    this.csvOptions.headers=[];
    this.csvOptions.headers = ['Filter(s)', this.filter];
    // tslint:disable-next-line: no-unused-expression
    new AngularCsv(this.dtForCSVAdRecall, 'Ad Recall', this.csvOptions);
  }

  hideloader() {
    // tslint:disable-next-line: max-line-length
    if (this.isApiCall && this.dataShowCallToActionData.length && this.selectedAds.length && this.dataShowAddiagnosticsData.length && this.dataShowCallToActionData.length) {
      this.showLoader = false;
    }
  }

  ngOnDestroy(): void {
    this.updateDataUnsubscribe.next();
    this.updateDataUnsubscribe.complete();
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
