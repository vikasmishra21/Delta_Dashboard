import { Component, OnInit } from '@angular/core';
import { Chart } from '../../shell/models/chart';
import { OverallSnapshot } from '../../model/overallSnapshot';
import { Subject } from 'rxjs';
import { TableOutput } from '../../shell/interfaces/table-output';
import { FilterService } from 'src/app/shell/services/filter.service';
import { Imagry } from 'src/app/model/Imagenary'
import { AwarenessMetrics } from '../overall-snapshot/exceldownload/Awarenessmetrics';
import { BrandImagery } from '../overall-snapshot/exceldownload/BrandImaginaryExcel';
import { Touchpoint } from './exceldownload/Touchpoint';
import { AngularCsv } from 'angular7-csv/dist/Angular-csv'
import { FilterConfigService } from 'src/app/service/filter-config.service';
import { TimePeriod } from 'src/app/shell/models/time.period';
import { FilterType } from 'src/app/shell/enums/filter-type';
import { CollectionOutput } from 'src/app/shell/models/collectionOutput';
import { takeUntil } from 'rxjs/operators';
import { UploadAdDetailService } from 'src/app/service/upload-ad-detail.service';
import { PptExportService } from 'src/app/service/ppt-export.service';

import { ScoreAndBasePipe } from 'src/app/pipe/score-and-base.pipe';
import { OverAllSnapshotTrends } from './overallSnapshotTrends';
import { AssetMappings } from 'src/app/model/asset.mappings';
import { FilterOption } from 'src/app/shell/models/filterOption';
import { FilterHideService } from 'src/app/service/filter-hide.service';
import { AppliedFilterSetService } from 'src/app/service/applied-filter-set.service';
import { ActivatedRoute } from '@angular/router';
import { isString } from 'util';
@Component({
  selector: 'app-overall-snapshot',
  templateUrl: './overall-snapshot.component.html',
  styleUrls: ['./overall-snapshot.component.css'],
  providers: [ScoreAndBasePipe]
})
export class OverallSnapshotComponent implements OnInit {

  showLoader: boolean;
  onDataUpdate: Subject<any> = new Subject();
  updateDataUnsubscribe: Subject<any> = new Subject<any>();

  private brandname: any;
  unaided: Chart;
  unaidedData: Array<TableOutput> = new Array<any>();
  unaidedBases: number;
  unaidedScore: any;
  comparedScoreUnaided: any;
  compareBaseUnaided: any;
  showUnaidedSigArraow: boolean = false;

  totalBrand: Chart;
  totalBrandData: Array<TableOutput> = new Array<any>();
  TotalBases: number;
  Totalscore: any;
  comparedScoreTotal: any;
  compareBaseTotal: any;
  showTotalAdSigArray: boolean = false;

  advertising: Chart;
  advertisingData: Array<TableOutput> = new Array<any>();
  advertisingBases: number;
  advertisingscore: any;
  comparedScoreAdver: any;
  compareBaseAdver: any;
  showAdvSigArray: boolean = false;

  touchpointRecall: Chart;
  touchpointData: Array<TableOutput> = new Array<any>();
  touchpointScore: number[];
  touchpointBases: number[];
  touchcheck: boolean;
  comparedScoreTouch: Array<number> = new Array<number>();
  comparedBaseTouch: Array<any> = new Array<any>();
  showTouchSigArray: Array<boolean> = new Array<boolean>();

  brandImagery: Chart;
  imageryData: Array<TableOutput> = new Array<any>();
  imageryDataFinal: Array<TableOutput> = new Array<any>();
  brandImageryBases: number[];
  brandimaginarycheck: boolean;
  compareBaseImaginary: Array<any> = new Array<any>();
  showImaginarySigArray: Array<boolean> = new Array<boolean>();

  cosnsumerBrandRelation: Chart;
  cosnsumerBrandRelationBase: Chart;
  consumerRelationBase: number;
  CBRBases: number;

  cosnsumerBrandRelation1: Array<Chart> = new Array<Chart>();
  cbrSigTestingShowArrow: [{
    'isStrongSig': number, 'strongScore': number, 'strongCompareScore': number,
    'isWeakSig': number, 'weakScore': number, 'weakCompareScore': number, 'isRiskSig': number, 'atRiskScore': number, 'atRiskCompareScore': number, 'compareBase': any
  }];

  dtAwareness: Array<{ type?: string, score?: any, base?: any }>;
  dtBrandImagery: Array<{ driver?: any, type?: string, score?: any, base?: any }>;
  dtTouchpoint: Array<{ type?: string, score?: any, base?: any }>;
  dtCBR: Array<{ type?: string, score?: any, base?: any }>;
  timePeriodChips: Map<string, Array<FilterOption>> = new Map<string, Array<FilterOption>>();

  csvOptions = {
    fieldSeparator: ',',
    quoteStrings: '"',
    decimalseparator: '.',
    showLabels: true,
    showTitle: true,
    title: 'Delta',
    useBom: true,
    noDownload: false,
    headers: [],
    headers1:[]
  };

  ImageryData1: Array<any> = new Array<any>();
  // KDA = {
  //   v558: 115,
  //   v559: 8,
  //   v560: 222,
  //   v561: 99,
  //   v562: 84,
  //   v563: 117,
  //   v564: 20,
  //   v565: 0,
  //   v566: 19,
  //   v567: 188,
  //   v568: 251,
  //   v569: 41,
  //   v570: 27,
  //   v571: 39,
  //   v572: 68,
  //   v573: 101,
  //   v574: 110,
  //   v575: 141,
  //   v576: 151
  // };
  KDA2020= {
    v558: 139,
    v559: 11,
    v560: 187,
    v561: 106,
    v562: 108,
    v563: 145,
    v564: 28,
    v565: 0,
    v566: 21,
    v567: 119,
    v568: 178,
    v569: 86,
    v570: 38,
    v571: 46,
    v572: 93,
    v573: 111,
    v574: 89,
    v575: 135,
    v576: 161,
    v1323: 0,
    v1324: 0,
    v1325: 0

  }

  BrandMapping = {
    1: "Delta",
    2: "American Standard",
    3: "Kohler",
    4: "Moen",
    5: "Peerless",
    6: "Pfister",
    23: "Waterpik"
  };

  BrandMappingTrends = {
    1: "Delta",
    2: "American",
    3: "Kohler",
    4: "Moen",
    5: "Peerless",
    6: "Pfister",
    23: "Waterpik"
  };
  addLists: Array<any> = new Array<any>();
  ercValues = {
    'Delta': [],
    'American_Standard': [],
    'Kohler': [],
    'Moen': [],
    'filter': '',
    'bases': 0
  }
  pptDownloadTotalAwarenessObject = {
    'Unaided_Brand': 0,
    'Totalbrand': 0,
    'Advertising': 0,
    'Brandname': "",
    'filter': '',
    'bases': 0
  };
  pptDownloadTouchpointObject = {
    'Brandname': "",
    'TouchpointImagery': [],
    'filter': '',
    'bases': 0
  };
  pptConsumerBrandRelationshipObject = {
    'Strong': 0,
    'Weak': 0,
    'AtRisk': 0,
    'Brandname': "",
    'filter': '',
    'bases': 0
  };
  pptDownloadImageryObject = {
    'Brandname': "",
    'BrandImagery': [],
    'filter': '',
    'bases': 0
  };
  Ad = {
    'The Perfect Touch': 0,
    'Hydrorain One': 1,
    'Shield Yourself': 2,
    'Quality Product Touchless KF': 0,
    'Lysol ActiClean Self-Clean': 1,
    'Innovative': 2,
    'Mother Nature': 0,
    'Konnect-Pouring Made Easy': 1,
    'Verdera Voice Mirror': 2,
    'The Design': 0,
    'Life Designs/ Water is Life': 1,
    'Perfect Fit/In Control': 2,
    'In2ition Two-In-One': 3,
    'Rough Water/In Control': 3,
    'Moen Flow': 4
  };
  private readonly consumerBrandVariableMapping = {
    1: 'RelationshipDelta',
    2: 'RelationshipAmerican',
    3: 'RelationshipKohler',
    4: 'RelationshipMoen',
    5: 'RelationshipPeerless',
    6: 'RelationshipPfister',
    23: 'RelationshipWaterpik'
  };
  ApiCall: boolean = true;
  public showChart = false;
  public showTrends = false;
  selectedTab: any;
  awarenessMatrixTrendsChart: any;
  cbrTrendsChart: any;
  touchpointrecallTrendsChart: any;
  brandImageryTrendsChart: any;
  period = 'Quarterly';
  periodSeclected = 'tab1';
  brandNameTrends: string;
  hideFilterForTrends: boolean = false;
  getOverallSnapshotTrendsPptData: Array<any> = new Array<any>();
 filter:string;
  constructor(private addDetailsService: UploadAdDetailService, private filterService: FilterService,
    private filterConfigService: FilterConfigService, private pptexport: PptExportService,
    private scoreAndBase: ScoreAndBasePipe, private hideFilterTrends: FilterHideService,
    private appliedFilterSet: AppliedFilterSetService, private route: ActivatedRoute) {

    this.filterConfigService.initializeOverallSnapshot();
  }

  ngOnInit() {
    this.brandname = 1;
   // localStorage.removeItem("ECR");

    this.updateData(this.brandname);

    this.route.params.subscribe(params => {
      if(this.filterService.getAppliedFilters().size===0){
        localStorage.removeItem('filterapp');
      }
      if (this.filterService.getAppliedFilters().size !== 0 ||
        this.filterService.getAppliedSeriesSelectors().size !== 0 ||
        this.filterService.getAppliedTimePeriods().size !== 0) {

        this.updateData(this.brandname);
        setTimeout(() => {
          this.onDataUpdate.next();
        });
      }
    });

    this.filterService.optionSelectionCallback$
      .pipe(takeUntil(this.updateDataUnsubscribe))
      .subscribe(value => {
        // if(this.filterService.selectedChoices!=undefined){
        //   this.filterService.selectedChoices .forEach((value, key) => this.setTimePeriodChips(key, value));

        // }
        // this.appliedFilterSet.selectedChoicesFilterTransfer(value);
        // value = this.appliedFilterSet.returnIt();
        this.updateData(this.brandname);
        setTimeout(() => {
          this.onDataUpdate.next();
        });
        // this.toggle(event, this.BrandMappingTrends[this.brandname], 1);
      });
  }

  initpara() {
    this.touchpointScore = [];
    this.advertisingscore = null;
    this.Totalscore = null;
    this.unaidedScore = 0;
    this.ImageryData1 = [];
    this.touchcheck = false;
    this.brandimaginarycheck = false;
    this.dtAwareness = [];
    this.dtBrandImagery = [];
    this.dtTouchpoint = [];
    this.comparedScoreUnaided = 0;
    this.comparedScoreAdver = 0;
    this.comparedScoreTotal = 0;
    this.CBRBases = 0;
    this.showUnaidedSigArraow = false;
    this.showTouchSigArray = [];
    this.showImaginarySigArray = [];
    this.showTotalAdSigArray = false;
    this.showAdvSigArray = false;
    this.cbrSigTestingShowArrow = [{
      'isStrongSig': 0, 'strongScore': 0, 'strongCompareScore': 0,
      'isWeakSig': 0, 'weakScore': 0, 'weakCompareScore': 0, 'isRiskSig': 0, 'atRiskScore': 0, 'atRiskCompareScore': 0, 'compareBase': 0
    }];
  }
  private setTimePeriodChips(variable, choices) {
    if (this.timePeriodChips.has(variable) && choices.length === 0) {
      this.timePeriodChips.delete(variable);
    } else {
      this.timePeriodChips.set(variable, [...choices]);
    }
    for (var i = 0; i < this.timePeriodChips.size; i++) {
      if (variable != "Allbrands")
        this.pptConsumerBrandRelationshipObject.filter = this.pptConsumerBrandRelationshipObject.filter + " " + variable + " " + choices[i].text;
      this.pptDownloadImageryObject.filter = this.pptDownloadImageryObject.filter + " " + variable + " " + choices[i].text;
      this.pptDownloadTotalAwarenessObject.filter = this.pptDownloadTotalAwarenessObject.filter + " " + variable + " " + choices[i].text;
      this.pptDownloadTouchpointObject.filter = this.pptDownloadTouchpointObject.filter + " " + variable + " " + choices[i].text;
    }
  }
  updateData(brandCode) {
    // this.toggleChart('chartsTabs');
    this.hideFilterForTrends = false;
    this.hideFilterTrends.sendBooleanFlag(this.hideFilterForTrends);
    const snapshot: OverallSnapshot = new OverallSnapshot(brandCode);
    this.brandNameTrends = this.BrandMapping[this.brandname].toUpperCase();
    this.initpara();
    this.showLoader = true;
    this.dtAwareness = [];
    this.brandNameTrends = this.BrandMappingTrends[this.brandname];
    this.pptDownloadTotalAwarenessObject.Brandname = this.BrandMapping[this.brandname];
    this.pptConsumerBrandRelationshipObject.Brandname = this.BrandMapping[this.brandname];
    this.pptDownloadTouchpointObject.Brandname = this.BrandMapping[this.brandname];
    this.pptDownloadImageryObject.Brandname = this.BrandMapping[this.brandname];
    this.unaided = snapshot.getUnaided();

    this.unaided.addTableDataReady((output, dataTable) => {
      this.unaidedScore = 0;
      this.unaidedData = [];
      this.comparedScoreUnaided = 0;
      this.compareBaseUnaided = 0
      this.hideloader();
      this.unaidedBases = dataTable.bases.get('Base').map(value => Math.round(value))[0];
      this.pptDownloadTotalAwarenessObject.bases = this.unaidedBases;
      this.unaidedData = output.sort((a, b) => b.Score - a.Score);
      this.unaidedData.forEach((val, i) => {
        if (val.SeriesName == this.BrandMapping[brandCode]) {
          this.unaidedScore = val.Score;
          this.comparedScoreUnaided = val.previousScore === undefined ? 'NA' : val.previousScore;
          if(dataTable.comparisonBases.has("Base")){
            this.compareBaseUnaided = dataTable.comparisonBases.get("Base")[0];
          }
          if(val.SignificanceSign && val.SignificanceSign !== undefined && val.SignificanceSign !== 0){
            this.showUnaidedSigArraow = true;
          }
          this.pptDownloadTotalAwarenessObject.Unaided_Brand = this.unaidedScore;
          this.dtAwareness.push({ type: this.unaided.Name, score: Math.round(this.unaidedScore) });
        }
      });
      // if (dataTable.comparisonBases.get("Base") != undefined) {
      //   // dataTable.comparisonRows.forEach((value, index) => {
      //   //   if (index == this.BrandMapping[brandCode] && value[0] != undefined) {
      //   //     this.comparedScoreUnaided = Math.round(this.unaidedScore - (value[0]));
      //   //     this.compareBaseUnaided = dataTable.comparisonBases.get("Base");
      //   //   }
      //   // });
      //   dataTable.comparisonRows.forEach((value, index) => {
      //     if (index == this.BrandMapping[brandCode] && value[0] != undefined) {
      //       this.comparedScoreUnaided = Math.round(this.unaidedScore - (value[0]));
      //       this.compareBaseUnaided = dataTable.comparisonBases.get("Base");
      //     }
      //   });
      //   dataTable.significance.forEach((val, indexx) => {
      //     if (indexx === this.BrandMapping[brandCode] && val[0] != undefined) {
      //       this.showUnaidedSigArraow = true;
      //     }
      //   });
      // }
    });

    this.totalBrand = snapshot.getTotalBrand();
    this.totalBrand.addTableDataReady((output, dataTable) => {
      this.comparedScoreTotal = 0;
      this.compareBaseTotal = 0;
      this.totalBrandData = [];
      this.hideloader();
      this.TotalBases = dataTable.bases.get('Base').map(value => Math.round(value))[0];
      this.totalBrandData = output.sort((a, b) => b.Score - a.Score);
      this.totalBrandData.forEach((val, index)=>{
        if (val.SeriesName == this.BrandMapping[brandCode]) {
          this.Totalscore = val.Score;
          this.comparedScoreTotal = val.previousScore === undefined ? 'NA' : val.previousScore;
          if(dataTable.comparisonBases.has("Base")){
            this.compareBaseTotal = dataTable.comparisonBases.get("Base")[0];
          }
          if(val.SignificanceSign && val.SignificanceSign !== undefined && val.SignificanceSign !== 0){
            this.showTotalAdSigArray = true;
          }
          this.pptDownloadTotalAwarenessObject.Totalbrand = this.Totalscore;
          this.dtAwareness.push({ type: this.totalBrand.Name, score: Math.round(this.Totalscore) });
        }
      });

      // if (dataTable.comparisonBases.get("Base") != undefined) {
      //   dataTable.comparisonRows.forEach((value, index) => {
      //     if (index == this.BrandMapping[brandCode] && value[0] != undefined) {
      //       this.comparedScoreTotal = Math.round(this.Totalscore - (value[0]));
      //       this.compareBaseTotal = dataTable.comparisonBases.get("Base");
      //     }
      //   });
      //   dataTable.significance.forEach((val, indexx) => {
      //     if (indexx === this.BrandMapping[brandCode] && val[0] != undefined) {
      //       this.showTotalAdSigArray = true;
      //     }
      //   });
      // }
    });

    this.advertising = snapshot.getAdvertising();
    this.advertising.addTableDataReady((output, dataTable) => {
      this.comparedScoreAdver = 0;
      this.compareBaseAdver = 0;
      this.advertisingData = [];
      this.hideloader();
      this.advertisingBases = dataTable.bases.get('Base').map(value => Math.round(value))[0];
      this.advertisingData = output.sort((a, b) => b.Score - a.Score);
      this.advertisingData.forEach((val, index)=>{
        if (val.SeriesName == this.BrandMapping[brandCode]) {
          this.advertisingscore = val.Score;
          this.comparedScoreAdver = val.previousScore === undefined ? 'NA' : val.previousScore;
          if(dataTable.comparisonBases.has("Base")){
            this.compareBaseAdver = dataTable.comparisonBases.get("Base")[0];
          }
          if(val.SignificanceSign && val.SignificanceSign !== undefined && val.SignificanceSign !== 0){
            this.showAdvSigArray = true;
          }
          this.pptDownloadTotalAwarenessObject.Advertising = this.advertisingscore;
          this.pptDownloadTotalAwarenessObject.bases = this.advertisingBases;
          this.dtAwareness.push({ type: this.advertising.Name, score: this.advertisingscore });
        }
      });

      // if (dataTable.comparisonBases.get("Base") != undefined) {
      //   dataTable.comparisonRows.forEach((value, index) => {
      //     if (index == this.BrandMapping[brandCode] && value[0] != undefined) {
      //       this.comparedScoreAdver = Math.round(this.advertisingscore - (value[0]));
      //       this.compareBaseAdver = dataTable.comparisonBases.get("Base");
      //     }
      //   });
      //   dataTable.significance.forEach((val, indexx) => {
      //     if (indexx === this.BrandMapping[brandCode] && val[0] != undefined) {
      //       this.showAdvSigArray = true;
      //     }
      //   });
      // }

    });


    this.touchpointRecall = snapshot.getTouchpointRecall();
    if (this.brandname <= 4 && this.brandname != 2) {
      this.touchpointScore = [];
      this.dtTouchpoint = [];
      this.comparedScoreTouch = [];
      this.touchpointBases = [];
      this.comparedBaseTouch = [];
      this.pptDownloadTouchpointObject.TouchpointImagery=[];
      this.touchpointRecall.addTableDataReady((output, dataTable) => {
        this.dtTouchpoint = [];
        this.hideloader();
        const bases = dataTable.bases.get('Base').map(value => Math.round(value));
        this.comparedBaseTouch = [];
        if (dataTable.comparisonBases.get("Base") != undefined) {
          this.comparedBaseTouch = dataTable.comparisonBases.get("Base");
        }
        this.touchpointData = output.slice().sort((a, b) => b.Score - a.Score);
        this.touchpointData.forEach((element, index) => {
          let indexOfBase = -1;
          output.forEach((x, i) => {
            if (x.SeriesName === element.SeriesName) {
              indexOfBase = i;
            }
          });
          this.touchpointBases[index] = bases[indexOfBase];
          this.touchpointScore[index] = element.Score;
          this.comparedScoreTouch[index] = 0;
          this.showTouchSigArray[index] = false;
          if( dataTable.previousScoreRows.has(element.SeriesName)){
            this.comparedScoreTouch[index] = dataTable.previousScoreRows.get(element.SeriesName)[0];
          }
          // const prevPeriodVal = dataTable.comparisonRows.get(element.SeriesName)[0];
          // if (prevPeriodVal != undefined) {
          //   this.comparedScoreTouch[index] = (Math.round(element.Score - (prevPeriodVal)));
          // }
          if(dataTable.significance.has(element.SeriesName)){
            const showSig = dataTable.significance.get(element.SeriesName)[0];
            if (showSig != undefined && showSig !== 0) {
              this.showTouchSigArray[index] = true;
            }
          }
          this.dtTouchpoint.push({ type: element.SeriesName, score: element.Score });
          var dt1 = {
            'seriesname': element.SeriesName,
            'score': Math.round(element.Score)
          }
          this.pptDownloadTouchpointObject.TouchpointImagery.push(dt1);
        });

        this.dtTouchpoint.sort((a, b) => b.score - a.score);
        this.pptDownloadTouchpointObject.bases = bases[0];
      });
    }
    else {
      this.touchpointData = new Array<any>();
      this.touchcheck = true;
      this.hideloader();
    }


    this.brandImagery = snapshot.getBrandImagery(brandCode);
    this.brandImagery.addTableDataReady((output, dataTable) => {
      if (output != null) {
        this.hideloader();
        let comparisionRow = [];
        let significanceRow = [];
        this.dtBrandImagery = [];
        this.compareBaseImaginary = [];
        this.ImageryData1 = []
        this.pptDownloadImageryObject.BrandImagery = [];
        this.brandImageryBases = dataTable.bases.get('Base').map(value => Math.round(value));
        this.compareBaseImaginary = [];
        if (dataTable.comparisonBases.get("Base") != undefined) {
          this.compareBaseImaginary = dataTable.comparisonBases.get("Base");
        }
        dataTable.previousScoreRows.forEach((data, element) => {
          const dValue = {
            'SeriesName': element,
            'Score': data[0]
          }
          comparisionRow.push(dValue);
        });
        dataTable.significance.forEach((sigdata, signame) => {
          const dValue = {
            'SeriesName': signame,
            'Score': sigdata[0]
          }
          significanceRow.push(dValue);
        });

        this.imageryData = output.sort((a, b) => b.Score - a.Score);
        this.imageryDataFinal = this.imageryData.filter((data) => {
          return data.SeriesCode != "na"
          })
        this.imageryDataFinal.forEach((v, valindexname) => {
          let compData = 0;
          let showSig = false;
          comparisionRow.forEach((val, j) => {
            if (v.SeriesName == val.SeriesName && val.Score != undefined) {
              compData = val.Score;
            }
          });
          significanceRow.forEach((val, j) => {
            if (v.SeriesName == val.SeriesName && val.Score !== undefined && val.Score !== 0) {
              showSig = true;
            }
          });
          let KDAScore:any

            KDAScore=this.KDA2020[v.SeriesVariableID];

          // else if (v.CategoryName.includes("2019")) {
          //   KDAScore=this.KDA[v.SeriesVariableID];
          // }
          var myobj = {
            'sereiesname': v.SeriesName,
            'score': v.Score,
            'KDA': KDAScore,
            'compareScore': compData,
            'isSignificance': showSig
          };
          var myobj1 = {
            'seriesname': v.SeriesName,
            'score': v.Score,
            'KDA': KDAScore
          };
          this.dtBrandImagery.push({ driver: KDAScore, type: v.SeriesName, score: v.Score });
          this.pptDownloadImageryObject.BrandImagery.push(myobj1);
          this.ImageryData1.push(myobj);
        });
        this.dtBrandImagery.push({ driver: '', type: 'Base', score: this.brandImageryBases[0] });
        this.dtBrandImagery.sort((a, b) => b.driver - a.driver);
        this.ImageryData1.sort((a, b) => b.KDA - a.KDA);
        this.pptDownloadImageryObject.BrandImagery.sort((a, b) => b.KDA - a.KDA);
        this.pptDownloadImageryObject.bases = this.brandImageryBases[0];
      }
      else {
        this.ImageryData1 = new Array<any>();
        this.brandimaginarycheck = true;
        this.hideloader();
      }
    });

    this.cosnsumerBrandRelation = snapshot.getCustomerBrandRelationship();
    this.dtCBR = [];
    this.dtCBR.push({ type:"Chart Name", score: "Percentage"})
    this.cosnsumerBrandRelation.addCalculationLogic((output: CollectionOutput) => {
      const bases = output.Bases.get(this.cosnsumerBrandRelation.Name);
      if (bases != undefined || bases != null) {
        bases.map(val => {
          if (parseInt(val.CategoryCode, 10) === TimePeriod.CurrentPeriod) {
            this.consumerRelationBase = val.Score;
          }
        });
        output.TableOutput.forEach(val => {
          val.forEach((value, index) => {
            value.Score = Math.round(value.Score);
            if (value.SeriesName == 'At Risk (NET)') {
              this.dtCBR.push({ type: value.SeriesName, score: value.Score });
              this.pptConsumerBrandRelationshipObject.AtRisk = Math.round(value.Score);
            }
            if (value.SeriesName == 'Weak (NET)') {
              this.dtCBR.push({ type: value.SeriesName, score: value.Score });
              this.pptConsumerBrandRelationshipObject.Weak = Math.round(value.Score);
            }
            if (value.SeriesName == 'STRONG (NET)') {
              value.SeriesName = 'Strong (NET)';
              this.dtCBR.push({ type: value.SeriesName, score: value.Score });
              this.pptConsumerBrandRelationshipObject.Strong = Math.round(value.Score);
            }
          });
          if (output.Bases.get('Consumer Brand Relationship')[0]) {
            this.pptConsumerBrandRelationshipObject.bases = output.Bases.get('Consumer Brand Relationship')[0].Score;
            this.dtCBR.push({ type: 'Base', base: output.Bases.get('Consumer Brand Relationship')[0].Score });
          }
        });
      }
      return output;
    });

    this.cosnsumerBrandRelation1 = snapshot.getCustomerBrandRelationship1();
    this.cosnsumerBrandRelation1.forEach(element => {
      element.addTableDataReady((Output, DataTable) => {
        let compareObject = {
          'isStrongSig': 0,
          'strongScore': 0,
          'strongCompareScore': 0,
          'isWeakSig': 0,
          'weakScore': 0,
          'weakCompareScore': 0,
          'isRiskSig': 0,
          'atRiskScore': 0,
          'atRiskCompareScore': 0,
          'compareBase': 0
        }
        if(DataTable.comparisonBases.get("Base") !== undefined){
          compareObject.compareBase = DataTable.comparisonBases.get("Base")[0];
        }
        Output.forEach((val, index) => {
          if (val.SeriesName == "STRONG (NET)") {
            compareObject.strongScore = Math.round(val.Score);
            if (!isNaN(val.previousScore) && val.previousScore != undefined && val.SignificanceSign != undefined && val.SignificanceSign !== 0) {
              compareObject.strongCompareScore = val.previousScore;
              compareObject.isStrongSig = val.SignificanceSign;
            }
            else {
              compareObject.strongCompareScore = 0;
              compareObject.isStrongSig = 0;
            }
          }
          if (val.SeriesName == "Weak (NET)") {
            compareObject.weakScore = Math.round(val.Score);
            if (!isNaN(val.previousScore) && val.previousScore != undefined && val.SignificanceSign != undefined && val.SignificanceSign !== 0) {
              compareObject.weakCompareScore = val.previousScore;
              compareObject.isWeakSig = val.SignificanceSign;
            }
            else {
              compareObject.weakCompareScore = 0;
              compareObject.isWeakSig = 0;
            }
          }
          if (val.SeriesName == "At Risk (NET)") {
            compareObject.atRiskScore = Math.round(val.Score);
            if (!isNaN(val.previousScore) && val.previousScore != undefined && val.SignificanceSign !== undefined && val.SignificanceSign !== 0) {
              compareObject.atRiskCompareScore = val.previousScore;
              compareObject.isRiskSig = val.SignificanceSign;
            }
            else {
              compareObject.atRiskCompareScore = 0;
              compareObject.isRiskSig = 0;
            }
          }
        });
        this.cbrSigTestingShowArrow = [compareObject];
      });
    });
  }

  downloadCBRPPT(pptName) {
    this.showLoader = true;
    this.getfilter();
    this.pptConsumerBrandRelationshipObject.filter=this.filter;
    var objnew = JSON.stringify(this.pptConsumerBrandRelationshipObject);
    this.pptexport.postPPTForCBRDownload(JSON.stringify(objnew)).subscribe((data) => {
      let blob = new Blob([data], { type: "application/octet-stream" });
      let url = window.URL.createObjectURL(blob);
      let a = document.createElement("a");
      document.body.appendChild(a);
      a.href = url;
      a.download = "Overall_Snapshop_" + pptName;
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
      this.showLoader = false;
    }, error => {
      console.log(error);
      this.showLoader = false;
    });
  }
  downloadAwarenessMetricPPT(pptName) {
    this.showLoader = true;
    this.getfilter();
    this.pptDownloadTotalAwarenessObject.filter=this.filter;
    var objnew = JSON.stringify(this.pptDownloadTotalAwarenessObject);

    this.pptexport.postPPTForOverallAwarenessDownload(JSON.stringify(objnew)).subscribe((data) => {
      let blob = new Blob([data], { type: "application/octet-stream" });
      let url = window.URL.createObjectURL(blob);
      let a = document.createElement("a");
      document.body.appendChild(a);
      a.href = url;
      a.download = "Overall_Snapshop_" + pptName;
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
      this.showLoader = false;
    }, error => {
      console.log(error);
      this.showLoader = false;
    });
  }
  downloadpptDownloadTouchpointObjectPPT(pptName) {
    this.showLoader = true;
    this.getfilter();
    this.pptDownloadTouchpointObject.filter=this.filter;
    var objnew = JSON.stringify(this.pptDownloadTouchpointObject);
    this.pptexport.postPPTForOverallTouchpointRecallDownload(JSON.stringify(objnew)).subscribe((data) => {
      let blob = new Blob([data], { type: "application/octet-stream" });
      let url = window.URL.createObjectURL(blob);
      let a = document.createElement("a");
      document.body.appendChild(a);
      a.href = url;
      a.download = "Overall_Snapshop_" + pptName;
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
      this.showLoader = false;
    }, error => {
      console.log(error);
      this.showLoader = false;
    });
  }
  downloadpptDownloadImageryObjectPPT(pptName) {
    this.showLoader = true;
    this.getfilter();
    this.pptDownloadImageryObject.filter=this.filter;
    var objnew = JSON.stringify(this.pptDownloadImageryObject);
    this.pptexport.postPPTForOverallImageryDownload(JSON.stringify(objnew)).subscribe((data) => {
      let blob = new Blob([data], { type: "application/octet-stream" });
      let url = window.URL.createObjectURL(blob);
      let a = document.createElement("a");
      document.body.appendChild(a);
      a.href = url;
      a.download = "Overall_Snapshop_" + pptName;
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
      this.showLoader = false;
    }, error => {
      console.log(error);
      this.showLoader = false;
    });
  }

  downloadPptTrends() {
    const overAllSnapshotTrends: OverAllSnapshotTrends = new OverAllSnapshotTrends();
    if (this.awarenessMatrixTrendsChart && this.cbrTrendsChart && this.touchpointrecallTrendsChart
      && this.brandImageryTrendsChart) {
      this.showLoader = true;
      const objnew = JSON.stringify(this.getOverallSnapshotTrendsPptData[0]);
      this.pptexport.postPPTForTrends(objnew).subscribe((data) => {
        const blob = new Blob([data], { type: 'application/octet-stream' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        document.body.appendChild(a);
        a.href = url;
        a.download = 'OverallSnapshot_Trends_PPT.zip';
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
  getfilterTrends() {
    this.filter = "";
    let filter = JSON.parse(localStorage.getItem('filterappTime'));
    let filterSide = JSON.parse(localStorage.getItem('filterapp'));


    if (filterSide != null) {
      filterSide.forEach((element, i) => {
        if (i == 0) {
          //this.filter = this.filter + ' Side filter(s) :';
          this.filter = this.filter + " " + element;
        }
        else {
          this.filter = this.filter + "| " + element;
        }
      });
    };
  }
  updateDataTrends(brandId) {
    this.getfilterTrends();
    this.getOverallSnapshotTrendsPptData = [];
    const overAllSnapshotTrends: OverAllSnapshotTrends = new OverAllSnapshotTrends();
    if (this.period === 'Quarterly' || this.periodSeclected === 'tab1') {
      this.awarenessMatrixTrendsChart = overAllSnapshotTrends.getAwarenessMatrixTrends('Quarterly',
        ['unaided', 'Allbrands', 'v468'], 'AWARENESS METRICS', brandId,this.filter);

      this.cbrTrendsChart = overAllSnapshotTrends.getCBRTrends('Quarterly', [this.consumerBrandVariableMapping[brandId]],
        'CONSUMER BRAND RELATIONSHIPS', brandId,this.filter);

      this.touchpointrecallTrendsChart = overAllSnapshotTrends.getTouchpointRecall('Quarterly', ['v482', 'v483', 'v484', 'v485',
        'v486', 'v487', 'v488', 'v489', 'v490', 'v491', 'v492', 'v493', 'v494', 'v495', 'v496', 'v497'], 'TOUCHPOINT RECALL', brandId,this.filter);

      this.brandImageryTrendsChart = overAllSnapshotTrends.getBrandImagery('Quarterly', ['v558', 'v559', 'v560', 'v561', 'v562',
        'v563', 'v564', 'v565', 'v566', 'v567', 'v568', 'v569', 'v570', 'v571', 'v572', 'v573', 'v574', 'v575', 'v576', 'v1323', 'v1324', 'v1325'],
        'OVERALL BRAND IMAGERY', brandId,this.filter);

    } else if (this.period === 'Annually' || this.periodSeclected === 'tab3') {
      this.awarenessMatrixTrendsChart = overAllSnapshotTrends.getAwarenessMatrixTrends('Yearly',
        ['unaided', 'Allbrands', 'v468'], 'AWARENESS METRICS', brandId,this.filter);

      this.cbrTrendsChart = overAllSnapshotTrends.getCBRTrends('Yearly', [this.consumerBrandVariableMapping[brandId]],
        'CONSUMER BRAND RELATIONSHIPS', brandId,this.filter);

      this.touchpointrecallTrendsChart = overAllSnapshotTrends.getTouchpointRecall('Yearly', ['v482', 'v483', 'v484', 'v485',
        'v486', 'v487', 'v488', 'v489', 'v490', 'v491', 'v492', 'v493', 'v494', 'v495', 'v496', 'v497'], 'TOUCHPOINT RECALL', brandId,this.filter);

      this.brandImageryTrendsChart = overAllSnapshotTrends.getBrandImagery('Yearly', ['v558', 'v559', 'v560', 'v561', 'v562',
        'v563', 'v564', 'v565', 'v566', 'v567', 'v568', 'v569', 'v570', 'v571', 'v572', 'v573', 'v574', 'v575', 'v576', 'v1323', 'v1324', 'v1325'],
        'OVERALL BRAND IMAGERY', brandId,this.filter);

    } else if (this.period === 'SemiAnnually' || this.periodSeclected === 'tab2') {
      this.awarenessMatrixTrendsChart = overAllSnapshotTrends.getAwarenessMatrixTrends('Semiannual',
        ['unaided', 'Allbrands', 'v468'], 'AWARENESS METRICS', brandId,this.filter);

      this.cbrTrendsChart = overAllSnapshotTrends.getCBRTrends('Semiannual', [this.consumerBrandVariableMapping[brandId]],
        'CONSUMER BRAND RELATIONSHIPS', brandId,this.filter);

      this.touchpointrecallTrendsChart = overAllSnapshotTrends.getTouchpointRecall('Semiannual', ['v482', 'v483', 'v484', 'v485',
        'v486', 'v487', 'v488', 'v489', 'v490', 'v491', 'v492', 'v493', 'v494', 'v495', 'v496', 'v497'], 'TOUCHPOINT RECALL', brandId,this.filter);

      this.brandImageryTrendsChart = overAllSnapshotTrends.getBrandImagery('Semiannual', ['v558', 'v559', 'v560', 'v561', 'v562',
        'v563', 'v564', 'v565', 'v566', 'v567', 'v568', 'v569', 'v570', 'v571', 'v572', 'v573', 'v574', 'v575', 'v576', 'v1323', 'v1324', 'v1325'],
        'OVERALL BRAND IMAGERY', brandId,this.filter);
    }
    if (this.awarenessMatrixTrendsChart && this.cbrTrendsChart && this.touchpointrecallTrendsChart
      && this.brandImageryTrendsChart) {
      this.getOverallSnapshotTrendsPptData.push(overAllSnapshotTrends.getOverallSnapshotTrendsPptData);
    }
  }

  toggleChart(tab) {
    this.hideFilterForTrends = false;
    this.hideFilterTrends.sendBooleanFlag(this.hideFilterForTrends);
    this.selectedTab = tab;
    this.showChart = false;
    this.showTrends = false;
    if (this.selectedTab === 'chartsTabs') {
      this.updateData(this.brandname);
      setTimeout(() => {
        this.onDataUpdate.next();
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
      //   this.filter = this.filter + " Compare with:" + element;
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
  toggleTrends(tab) {
    this.selectedTab = tab;
    this.hideFilterForTrends = true;
    this.hideFilterTrends.sendBooleanFlag(this.hideFilterForTrends);
    this.showTrends = true;
    this.showChart = true;
    if (this.selectedTab === 'trendsTabs') {
      this.showLoader = true;
      this.updateDataTrends(this.brandname);
      setTimeout(() => {
        this.onDataUpdate.next();
      });
      setTimeout(() => {
        this.showLoader = false;
      }, 4000);
    }
  }

  changeTimePeriod(period, periodSeclected) {
    this.period = period;
    this.periodSeclected = periodSeclected;
    if (this.selectedTab === 'trendsTabs') {
      this.showLoader = true;
      this.updateDataTrends(this.brandname);
      setTimeout(() => {
        this.onDataUpdate.next();
      });
      setTimeout(() => {
        this.showLoader = false;
      }, 4000);
    }
  }

  csvDetailCreationAwareness(score, sideBreak, base) {
    let csvDetail = [];
    csvDetail.push(sideBreak);
    if(score !== "Low base" && !isString(score)  ){

      csvDetail.push(Math.round(score));
    }
    else{
      csvDetail.push(score);
    }
    csvDetail.push(base);
    return csvDetail;
  }

  downloadAwarenessCSV() {
    let csvData = [];
    this.getfilter();
    this.csvOptions.headers=[];
    this.unaidedScore = this.scoreAndBase.transform(this.unaidedScore, this.unaidedBases);
    this.Totalscore = this.scoreAndBase.transform(this.Totalscore, this.TotalBases);
    this.advertisingscore = this.scoreAndBase.transform(this.advertisingscore, this.advertisingBases);
    csvData.push(Object.assign({}, this.csvDetailCreationAwareness( "Percentage",'Chart Name',"Bases")));
    csvData.push(Object.assign({}, this.csvDetailCreationAwareness(this.unaidedScore, 'Unaided Brand Awareness', this.unaidedBases)));
    csvData.push(Object.assign({}, this.csvDetailCreationAwareness(this.Totalscore, 'Total Brand (Aided + Unaided) Awareness', this.TotalBases)));
    csvData.push(Object.assign({}, this.csvDetailCreationAwareness(this.advertisingscore, 'Advertising', this.advertisingBases)));
    this.csvOptions.title = "Awareness Metrics" + " " + this.BrandMapping[this.brandname];
    this.csvOptions.headers.push("Filter(s)");
    this.csvOptions.headers.push(this.filter);
    // this.csvOptions.headers1.push(this.filter);
    new AngularCsv(csvData, "Overall Snapshot Awareness Metrics", this.csvOptions);
  }
  downloadBrandImageryCSV() {
    this.getfilter();
    this.csvOptions.headers=[];
    this.dtBrandImagery.map(val => {
      return val.score = val.type == 'Base' ? this.brandImageryBases[0] : this.scoreAndBase.transform(val.score, this.brandImageryBases[0]);
    });
    let dt=[];
    dt.push({ driver: "Driver", type:"Chart Name", score: "Percentage" });
    this.dtBrandImagery.forEach(el=>{
       dt.push({ driver: el.driver, type:el.type, score: Math.round(el.score) })
    })
    this.csvOptions.title = "Brand Imagery" + " " + this.BrandMapping[this.brandname];
    this.csvOptions.headers.push("Filters");
    this.csvOptions.headers.push(this.filter);
    //this.csvOptions.headers = ["Driver", "Chart Name", "Percentage"];
    new AngularCsv(dt, "Brand Imagery", this.csvOptions);
  }
  downloadTouchpointCSV() {
    this.getfilter();
    let dt=[];
    this.csvOptions.headers=[];
    dt.push({ type:"Chart Name", score: "Percentage" });
    this.dtTouchpoint.forEach(el=>{
      return el.score = el.type == "base" ? el.score : this.scoreAndBase.transform(el.score, this.touchpointBases[0]);
   });
   this.dtTouchpoint.push({type: "base", score:this.touchpointBases[0]});
    this.csvOptions.title = "Touchpoint Recall" + " " + this.BrandMapping[this.brandname];
    this.csvOptions.headers.push("Filters");
    this.csvOptions.headers.push(this.filter);
    new AngularCsv(this.dtTouchpoint, "Touchpoint", this.csvOptions);
  }

  downloadCBRCSV() {
    this.getfilter();
    this.csvOptions.headers=[];
    this.csvOptions.headers.push("Filters");
    this.csvOptions.headers.push(this.filter);
    this.csvOptions.title = "Overall Snapshot CBR -"+ this.BrandMapping[this.brandname] ;
   // this.csvOptions.headers = ["Chart Name", "Percentage"];
    new AngularCsv(this.dtCBR, "Overall Snapshot CBR", this.csvOptions);
  }

  hideloader() {
    const loader = [this.brandImagery.showLoader, this.advertising.showLoader, this.totalBrand.showLoader, this.unaided.showLoader];

    if (loader.reduce((prev, curr) => prev || curr, false) === false) {
      this.showLoader = false;
    }
  };
  toggle($event, id, index) {
    const allIcons = document.getElementsByClassName('icon');
    // const a = this.BrandMappingTrends[id];
    for (let i = 0; i < allIcons.length; i++) {
      allIcons[i].classList.remove('selected');
    }
    var icon = document.getElementById(id);
    icon.classList.add('selected');
    this.brandname = index;
    this.brandNameTrends = id;
    this.updateData(index);
    setTimeout(() => {
      this.onDataUpdate.next();
    });
  }

  getContentHeight() {
    return window.innerHeight - 270;
  }
  getBgColor(kda) {
    if (kda <= 75) {
      return "Grey";
    }
    else if (kda >= 76 && kda <= 124) {
      return "#ffcc00";
    }
    else { return "#0095d9" }

  }


  ngOnDestroy(): void {
    this.updateDataUnsubscribe.next();
    this.updateDataUnsubscribe.complete();
  }

}
