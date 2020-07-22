import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Chart } from 'src/app/shell/models/chart';
import { Snapshot } from 'src/app/model/snapshot';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { FilterService } from 'src/app/shell/services/filter.service';
import { Subject } from 'rxjs';
import { OnDestroy } from '@angular/core';
import { TableOutput } from 'src/app/shell/interfaces/table-output';
import { Imagry } from 'src/app/model/Imagenary'
import { Consideration } from './ExcellClasses/Consideration';
import { BrandImagery } from './ExcellClasses/BrandImagery';
import { element } from 'protractor';
import { AngularCsv } from 'angular7-csv/dist/Angular-csv'
import { FilterConfigService } from 'src/app/service/filter-config.service';
import { takeUntil } from 'rxjs/operators';
import { PptExportService } from 'src/app/service/ppt-export.service';
import { SnapshotTrends } from './snapshotTrends';
import { FilterOption } from 'src/app/shell/models/filterOption';
import { FilterHideService } from 'src/app/service/filter-hide.service';
import { AppliedFilterSetService } from 'src/app/service/applied-filter-set.service';
@Component({
  selector: 'app-snapshot',
  templateUrl: './snapshot.component.html',
  styleUrls: ['./snapshot.component.css']
})
export class SnapshotComponent implements OnInit, OnDestroy {
  onDataUpdate: Subject<any> = new Subject();
  unSubscribe: Subject<any> = new Subject<any>();

  showLoader: boolean;
  FinalKDA: number[];

  Unaided: Chart;
  unaidedTrend: Chart;
  UnaidedData: Array<TableOutput> = new Array<any>();
  UnaidedScore: number;
  UnaidedBase: number;
  unaidedComparisionData: any;
  compareBaseUnaided: any;
  showUnaidedSigArraow: boolean = false;

  TotalBrand: Chart;
  TotalBrandData: Array<TableOutput> = new Array<any>();
  TotalScore: number;
  Totalbase: number;
  totalComparisionData: any;
  compareBaseTotal: any;
  showTotalAdSigArray: boolean = false;

  Equity: Chart;
  EquityData: Array<TableOutput> = new Array<any>();
  equitybase: number[];
  Active: number;
  Latent: number;
  showWquityActiveSigArrow: boolean = false;
  showWquityLatentSigArrow: boolean = false;

  activeCompareData: any;
  latentComapareData: any;
  equityCompareBase: any;

  Consideration: Chart;
  ConsiderationData: Array<TableOutput> = new Array<any>();
  strongScore: number;
  firstChoice: any;
  SecondChoice: any;
  Consider: any;
  NotConsider: any;
  Choices: any;
  ConsiderationBases: number[];

  firstChoiceComparision: any;
  secondChoiceComparision: any;
  considerChoiceComparision: any;
  notConsiderChoiceComparision: any;
  choicesCompareData: number;
  ConsiderationCompareBase: any;


  showFirstConsiSigArrow: boolean = false;
  showSecondConsiSigArrow: boolean = false;
  showConsiderConsiSigArrow: boolean = false;
  showNotConsiderConsiSigArrow: boolean = false;
  choicesSigArrow: boolean = false;

  Strong: Chart;
  StrongData: Array<TableOutput> = new Array<any>();
  StrongBase: number;
  strongCompareScore: any;
  strongCompareBase: any;
  showStrongSigArrow: boolean = false;

  isCompareEnabled: boolean;
  brandname: string;
  timeperiod: any;
  Category: string;
  brandImagery: Chart;


  imageryData: Array<TableOutput> = new Array<any>();
  imageryDataFinal: Array<TableOutput> = new Array<any>();
  imageryBases: number[];
  imageryScore: number[];
  ImageryData1: Array<any> = new Array<any>();
  compareBaseImaginary: Array<any> = new Array<any>();
  showImaginarySigArray: Array<boolean> = new Array<boolean>();
  filter: string;
  dtConsideration: Array<Consideration> = new Array<Consideration>();
  dtConsiderationCSV: Array<{ ques: string, score: any }>;
  dtBrandImagery: Array<{ driver?: any, type?: string, score?: number, base?: number }>;
  dtEquity: Array<{ type?: string, score?: any, base?: number }>;
  dtAwareness: Array<{ type?: string, score?: any, base?: number }>;
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
    headers: []
  };
  pptDownloadObject = {
    'categoryname': "",
    'Brandname': "",
    'BrandImagery': [],
    'filter': '',
    'bases': 0
  };
  pptDownloadEquityObject = {
    'Latent': 0,
    'Active': 0,
    'categoryname': "",
    'Brandname': "",
    'Strongrelationship': 0,
    'filter': '',
    'bases': 0
  }
  pptDownloadTotalAwarenessObject = {
    'Unaided_Brand': 0,
    'Totalbrand': 0,
    'categoryname': "",
    'Brandname': "",
    'filter': '',
    'bases': 0
  };
  pptDownloadConsiderationObject = {
    'firstandsecondchoice': 0,
    'First_Choice': 0,
    'Second_Choice': 0,
    'Consider': 0,
    'Not_Consider': 0,
    'Brandname': "",
    'categoryname': "",
    'filter': '',
    'bases': 0
  };


  KDAScores = {
    Faucet: {
      v558: 115,
      v559: 8,
      v560: 222,
      v561: 99,
      v562: 84,
      v563: 117,
      v564: 20,
      v565: 0,
      v566: 19,
      v567: 188,
      v568: 251,
      v569: 41,
      v570: 27,
      v571: 39,
      v572: 68,
      v573: 101,
      v574: 110,
      v575: 141,
      v576: 151,
      v1323: 0,
      v1324: 0,
      v1325: 0
    },
    Faucet2020: {
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
    },
    Showerhead: {
      v558: 155,
      v559: 13,
      v560: 206,
      v561: 104,
      v562: 75,
      v563: 107,
      v564: 13,
      v565: 0,
      v566: 21,
      v567: 172,
      v568: 202,
      v569: 53,
      v570: 34,
      v571: 46,
      v572: 79,
      v573: 118,
      v574: 106,
      v575: 141,
      v576: 154,
      v1323: 0,
      v1324: 0,
      v1325: 0
    },
    Showerhead2020: {
      v558: 155,
      v559: 13,
      v560: 188,
      v561: 111,
      v562: 95,
      v563: 132,
      v564: 19,
      v565: 0,
      v566: 25,
      v567: 147,
      v568: 161,
      v569: 84,
      v570: 44,
      v571: 45,
      v572: 89,
      v573: 130,
      v574: 78,
      v575: 129,
      v576: 152,
      v1323: 0,
      v1324: 0,
      v1325: 0
    },
    Toilet: {
      v558: 274,
      v559: 119,
      v560: 202,
      v561: 59,
      v562: 34,
      v563: 110,
      v564: 105,
      v565: 0,
      v566: 48,
      v567: 104,
      v568: 144,
      v569: 104,
      v570: 127,
      v571: 84,
      v572: 83,
      v573: 83,
      v574: 31,
      v575: 39,
      v576: 52,
      v1323: 0,
      v1324: 0,
      v1325: 0
    },
    Toilet2020: {
      v558: 214,
      v559: 132,
      v560: 244,
      v561: 33,
      v562: 31,
      v563: 165,
      v564: 123,
      v565: 0,
      v566: 100,
      v567: 89,
      v568: 90,
      v569: 158,
      v570: 109,
      v571: 92,
      v572: 90,
      v573: 37,
      v574: 17,
      v575: 38,
      v576: 37,
      v1323: 0,
      v1324: 0,
      v1325: 0
    }

  };
  period = 'Quarterly';
  periodSeclected = 'tab1';
  public showChart = false;
  public showTrends = false;
  selectedTab: string = '';
  awarenessMatrixTrendsChart: any;
  EquityTrendsChart: any;
  brandImageryTrendsChart: any;
  inPageVisited: boolean = false;
  considerationTrendsChart: any;
  strongRelationshipTrendsChart: any;
  isSelected: boolean = false;
  hideFilterForTrends: boolean = false;

  constructor(private filterService: FilterService, private route: ActivatedRoute, private filterConfigService: FilterConfigService,
    private pptexport: PptExportService, private hideFilterTrends: FilterHideService,
    private appliedFilterSet: AppliedFilterSetService) {
    this.brandname = 'Delta';

    this.route.params.subscribe(params => {
      //   if(this.inPageVisited){
      // this.unSubscribe.next();
      // this.unSubscribe.complete();
      //   }
      if (this.Category) {
        this.filterConfigService.initializeCategorySnapshot();
        this.Category = params.order;
        this.brandname = 'Delta';
      } else {
        this.filterConfigService.initializeCategorySnapshot();
        this.Category = params.order;
        this.brandname = 'Delta';
      }
    });
  }

  ngOnInit() {
    this.inPageVisited = true;
    this.createTables(this.Category);

    this.route.params.subscribe(params => {
      if (this.filterService.getAppliedFilters().size === 0) {
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

    this.filterService.optionSelectionCallback$.pipe(takeUntil(this.unSubscribe))
      .subscribe(value => {
        this.updateData(this.Category);
        // if(this.filterService.selectedChoices!=undefined){
        //   this.filterService.selectedChoices .forEach((value, key) => this.setTimePeriodChips(key, value));

        // }
        // this.appliedFilterSet.selectedChoicesFilterTransfer(value);
        // value = this.appliedFilterSet.returnIt();
        setTimeout(() => {
          this.onDataUpdate.next();
        });
        this.toggle(event, this.brandname, 1);

      });
    // if (this.appliedFilterSet.choices.length > 0) {
    //   this.filterService.setChoices(this.appliedFilterSet.variable, this.appliedFilterSet.choices);
    // }
    // if (this.selectedTab === 'trendsTabs') {

    //   } else {
    //   this.filterService.optionSelectionCallback$.pipe(takeUntil(this.unSubscribe))
    //     .subscribe(value => {
    //       this.updateData(this.Category);
    //     });
    //   }
  }

  ngOnDestroy(): void {
    this.unSubscribe.next();
    this.unSubscribe.complete();
  }

  ngAfterContentInit(): void {
  }
  private setTimePeriodChips(variable, choices) {
    if (this.timePeriodChips.has(variable) && choices.length === 0) {
      this.timePeriodChips.delete(variable);
    } else {
      this.timePeriodChips.set(variable, [...choices]);
    }
    for (var i = 0; i < this.timePeriodChips.size; i++) {
      if (variable != "Allbrands")
        this.pptDownloadConsiderationObject.filter = this.pptDownloadConsiderationObject.filter + " " + variable + " " + choices[i].text;
      this.pptDownloadEquityObject.filter = this.pptDownloadEquityObject.filter + " " + variable + " " + choices[i].text;
      this.pptDownloadObject.filter = this.pptDownloadObject.filter + " " + variable + " " + choices[i].text;
      this.pptDownloadTotalAwarenessObject.filter = this.pptDownloadTotalAwarenessObject.filter + " " + variable + " " + choices[i].text;

    }
  }
  BrandCaller(Brand: string) {
  }
  initScores() {
    this.UnaidedScore = null;
    this.showUnaidedSigArraow = false;
    this.Active = null;
    this.Latent = null;
    this.strongScore = null;
    this.firstChoice = null;
    this.SecondChoice = null;
    this.Consider = null;
    this.NotConsider = null;
    this.Choices = null;
    this.TotalScore = null;
    this.UnaidedBase = null;
    this.StrongBase = null;
    this.Totalbase = null;
    this.imageryBases = [];
    this.ConsiderationBases = [];
    this.equitybase = [];
    this.imageryScore = [];
    this.FinalKDA = [];
    this.imageryData = [];
    this.ImageryData1 = [];
    this.showLoader = true;
    this.dtConsideration = [];
    this.dtConsiderationCSV = [];
    this.dtBrandImagery = [];
    this.dtEquity = [];
    this.dtAwareness = [];
    this.unaidedComparisionData = 0;
    this.firstChoiceComparision = 0;
    this.secondChoiceComparision = 0;
    this.considerChoiceComparision = 0;
    this.notConsiderChoiceComparision = 0;
    this.activeCompareData = 0;
    this.latentComapareData = 0;
    this.strongCompareScore = 0;
    this.strongCompareBase = 0;
    this.choicesCompareData = 0;
    this.showTotalAdSigArray = false;
    this.showWquityActiveSigArrow = false;
    this.showWquityLatentSigArrow = false;
    this.showStrongSigArrow = false;
    this.showFirstConsiSigArrow = false;
    this.showSecondConsiSigArrow = false;
    this.showConsiderConsiSigArrow = false;
    this.showNotConsiderConsiSigArrow = false;
    this.showImaginarySigArray = [];
    this.choicesSigArrow = false;
  }
  createTables(Category) {
    this.toggleChart('chartsTabs');
    this.initScores();
    this.showLoader = true;
    const snapshot: Snapshot = new Snapshot(Category, this.brandname);
    this.pptDownloadObject.Brandname = this.brandname;

    this.pptDownloadObject.categoryname = this.Category;
    this.pptDownloadTotalAwarenessObject.categoryname = this.Category;
    this.pptDownloadTotalAwarenessObject.Brandname = this.brandname;
    this.pptDownloadConsiderationObject.Brandname = this.brandname;
    this.pptDownloadConsiderationObject.categoryname = this.Category;
    this.pptDownloadEquityObject.Brandname = this.brandname;
    this.pptDownloadEquityObject.categoryname = this.Category;
    if (this.brandname == 'American') {
      this.pptDownloadObject.Brandname = 'American Standard';
      this.pptDownloadTotalAwarenessObject.Brandname = 'American Standard';
      this.pptDownloadConsiderationObject.Brandname = 'American Standard';
      this.pptDownloadEquityObject.Brandname = 'American Standard';
    }
    this.initScores();
    this.dtAwareness = [];
    this.brandImagery = snapshot.getBrandImagery();
    this.Consideration = snapshot.getConsideration();
    this.Unaided = snapshot.getUnaided();
    this.TotalBrand = snapshot.getTotalBrand();
    this.Equity = snapshot.getEquity();
    this.Strong = snapshot.getStrongRelation();
    this.unaidedTrend = snapshot.getUnaidedTrend();


    this.Unaided.addTableDataReady((output, dataTable) => {
      this.hideloader();
      this.unaidedComparisionData = 0;
      this.compareBaseUnaided = 0;
      this.showUnaidedSigArraow = false;
      this.UnaidedBase = dataTable.bases.get('Base').map(value => Math.round(value))[0];
      output.forEach((val, valindex) => {

        if (val.SeriesName != 'No Answer') {
          this.UnaidedScore = output[0].Score;
        }
      });
      dataTable.comparisonRows.forEach((val, index) => {
        if (index !== "No Answer" && val[0] != undefined) {
          this.unaidedComparisionData = Math.round(this.UnaidedScore - (val[0]));
          this.compareBaseUnaided = dataTable.comparisonBases.get("Base");
        }
      });
      dataTable.significance.forEach((val, indexx) => {
        if (indexx !== "No Answer" && val[0] != undefined) {
          this.showUnaidedSigArraow = true;
        }
      });
      this.pptDownloadTotalAwarenessObject.Unaided_Brand = this.UnaidedScore;
      // this.dtAwareness.push({ type: 'Unaided', score: Math.round(this.UnaidedScore) });
    });

    this.TotalBrand.addTableDataReady((output, dataTable) => {
      this.hideloader();
      this.totalComparisionData = 0;
      this.compareBaseTotal = 0;
      this.showTotalAdSigArray = false;
      this.Totalbase = dataTable.bases.get('Base').map(value => Math.round(value))[0];
      this.pptDownloadTotalAwarenessObject.bases = this.Totalbase;
      this.TotalBrandData = output.sort((a, b) => b.Score - a.Score);
      this.TotalBrandData.forEach((val, i) => {
        if (val.SeriesName != 'No Answer') {
          this.TotalScore = Math.round(this.TotalBrandData[i].Score);
          this.pptDownloadTotalAwarenessObject.Totalbrand = this.TotalScore;
        }
      });
      dataTable.comparisonRows.forEach((val, index) => {
        if (index !== "No Answer" && val[0] != undefined) {
          this.totalComparisionData = Math.round(this.TotalScore - (val[0]));
          this.compareBaseTotal = dataTable.comparisonBases.get("Base");
        }
      });
      dataTable.significance.forEach((val, indexx) => {
        if (indexx !== "No Answer" && val[0] != undefined) {
          this.showTotalAdSigArray = true;
        }
      });
      // this.dtAwareness.push({ type: 'TotalBrand', score: Math.round(this.TotalScore) });
    });


    this.Strong.addTableDataReady((output, datatable) => {
      this.hideloader();
      this.StrongData = output;
      this.strongCompareScore = 0;
      this.strongCompareBase = 0;
      this.showStrongSigArrow = false;
      this.StrongBase = datatable.bases.get('Base').map(value => Math.round(value))[0];
      this.strongCompareBase = datatable.comparisonBases.get("Base");
      datatable.previousScoreRows.forEach((val, index) => {
        if (index == "STRONG (NET)" && val[0] != undefined) {
          this.strongCompareScore = val[0];
        }
      });
      datatable.significance.forEach((val, index) => {
        if (index == "STRONG (NET)" && val[0] !== undefined && val[0] !== 0) {
          this.showStrongSigArrow = true;
        }
      });
      this.StrongData.forEach((val, index) => {
        if (val.SeriesName == "STRONG (NET)") {
          this.strongScore = Math.round(val.Score);
          this.strongCompareScore = Math.round(val.Score - (this.strongCompareScore));
        }
      });

      // this.dtEquity.push({ type: 'strongRelations', score: this.strongScore });
      this.pptDownloadEquityObject.Strongrelationship = this.strongScore;
      this.pptDownloadEquityObject.bases = this.StrongBase;
    });

    this.Equity.addTableDataReady((output, dataTable) => {
      this.hideloader();
      this.EquityData = output;
      this.activeCompareData = 0;
      this.latentComapareData = 0;
      this.showWquityActiveSigArrow = false;;
      this.showWquityLatentSigArrow = false;

      this.equitybase = dataTable.bases.get('Base').map(value => Math.round(value));
      this.equityCompareBase = dataTable.comparisonBases.get('Base');
      dataTable.previousScoreRows.forEach((val, index) => {
        if (index.indexOf("Active") > -1 && val[0] != undefined) {
          this.activeCompareData = Math.round(val[0]);
        }
        if (index.indexOf("Latent") > -1 && val[0] != undefined) {
          this.latentComapareData = Math.round(val[0]);
        }
      });
      dataTable.significance.forEach((val, index) => {
        if (index.indexOf("Active") > -1 && val[0] != undefined) {
          this.showWquityActiveSigArrow = true;
        }
        if (index.indexOf("Latent") > -1 && val[0] != undefined) {
          this.showWquityLatentSigArrow = true;
        }
      });
      this.EquityData.forEach((val, index) => {
        if (val.SeriesName.indexOf("Active") > -1) {
          this.Active = Math.round(val.Score);
          this.activeCompareData = Math.round(this.activeCompareData);
        }
        if (val.SeriesName.indexOf("Latent") > -1) {
          this.Latent = Math.round(val.Score);
          this.latentComapareData = Math.round(this.latentComapareData);
        }
      });
      // this.dtEquity.push({ type: 'Active', score: this.Active });
      // this.dtEquity.push({ type: 'Latent', score: this.Latent });
      this.pptDownloadEquityObject.Active = this.Active;
      this.pptDownloadEquityObject.Latent = this.Latent;
    });

    this.Consideration.addTableDataReady((output, dataTable) => {
      this.hideloader();
      this.dtConsideration = [];
      this.dtConsiderationCSV = [];
      this.ConsiderationData = output;
      this.firstChoiceComparision = 0;
      this.secondChoiceComparision = 0;
      this.considerChoiceComparision = 0;
      this.notConsiderChoiceComparision = 0;
      this.choicesCompareData = 0;
      this.showFirstConsiSigArrow = false;
      this.showSecondConsiSigArrow = false;
      this.showConsiderConsiSigArrow = false;
      this.showNotConsiderConsiSigArrow = false;
      this.choicesSigArrow = false;
      this.dtConsiderationCSV.push({ ques: "Chart Name", score: "Percentage" });
      this.ConsiderationBases = dataTable.bases.get('Base').map(value => Math.round(value));
      this.ConsiderationCompareBase = dataTable.comparisonBases.get('Base');
      this.ConsiderationData.forEach(element => {
        switch (element.SeriesName) {
          case 'First choice':
            this.firstChoice = Math.round(element.Score);
            if (!isNaN(element.Score) && element.previousScore != undefined) {
              this.firstChoiceComparision = Math.round(element.previousScore);
            }
            if (element.SignificanceSign && element.SignificanceSign != undefined && element.SignificanceSign !== 0) {
              this.showFirstConsiSigArrow = true;
            }
            var myobj = {
              'option': 'First choice',
              'score': [this.firstChoice, this.ConsiderationBases]
            }
            this.dtConsideration.push(myobj);
            if (isNaN(this.firstChoice)) {
              this.dtConsiderationCSV.push({ ques: 'First choice', score: 'NA' });
            }
            else {
              this.dtConsiderationCSV.push({ ques: 'First choice', score: this.firstChoice });
            }

            this.pptDownloadConsiderationObject.First_Choice = this.firstChoice;
            break;
          case 'Second choice':
            this.SecondChoice = Math.round(element.Score);
            if (element.previousScore != undefined) {
              this.secondChoiceComparision = Math.round(element.previousScore);
            }
            if (element.SignificanceSign && element.SignificanceSign != undefined && element.SignificanceSign !== 0) {
              this.showSecondConsiSigArrow = true;
            }
            var myobj = {
              'option': 'Second choice',
              'score': [this.SecondChoice, this.ConsiderationBases]
            }
            this.dtConsideration.push(myobj);
            if (isNaN(this.SecondChoice)) {
              this.dtConsiderationCSV.push({ ques: 'Second choice', score: 'NA' });
            }
            else {
              this.dtConsiderationCSV.push({ ques: 'Second choice', score: this.SecondChoice });
            }


            break;
          case 'Consider':
            this.Consider = Math.round(element.Score);
            if (element.previousScore != undefined) {
              this.considerChoiceComparision = Math.round(element.previousScore);
            }
            if (element.SignificanceSign && element.SignificanceSign != undefined && element.SignificanceSign !== 0) {
              this.showConsiderConsiSigArrow = true;
            }
            var myobj = {
              'option': 'Consider',
              'score': [this.Consider, this.ConsiderationBases]
            }
            this.dtConsideration.push(myobj);

            this.pptDownloadConsiderationObject.Consider = this.Consider;
            if (isNaN(this.Consider)) {
              this.dtConsiderationCSV.push({ ques: 'Consider', score: 'NA' });
            }
            else {
              this.dtConsiderationCSV.push({ ques: 'Consider', score: this.Consider });
            }
            break;
          case 'Not consider':
            this.NotConsider = Math.round(element.Score);
            if (element.previousScore != undefined) {
              this.notConsiderChoiceComparision = Math.round(element.previousScore);
            }
            if (element.SignificanceSign && element.SignificanceSign != undefined && element.SignificanceSign !== 0) {
              this.showNotConsiderConsiSigArrow = true;
            }
            var myobj = {
              'option': 'Not consider',
              'score': [this.NotConsider, this.ConsiderationBases]
            }
            this.dtConsideration.push(myobj);
            this.pptDownloadConsiderationObject.Not_Consider = this.NotConsider;
            if (isNaN(this.NotConsider)) {
              this.dtConsiderationCSV.push({ ques: 'Not consider', score: 'NA' });
            }
            else {
              this.dtConsiderationCSV.push({ ques: 'Not consider', score: this.NotConsider });
            }

            break;

          case '1st/2nd Choice (net)':
            this.Choices = Math.round(element.Score);
            if (element.previousScore != undefined) {
              this.choicesCompareData = Math.round(element.previousScore);
            }
            if (element.SignificanceSign && element.SignificanceSign != undefined && element.SignificanceSign !== 0) {
              this.choicesSigArrow = true;
            }
            if (isNaN(element.Score)) {
              this.dtConsiderationCSV.push({ ques: '1st/2nd Choice (net)', score: 'NA' });
            }
            else {
              this.dtConsiderationCSV.push({ ques: '1st/2nd Choice (net)', score: Math.round(element.Score) });
            }

            break;
        }
        // this.Choices = this.firstChoice + this.SecondChoice;
        this.pptDownloadConsiderationObject.firstandsecondchoice = this.Choices;
        this.pptDownloadConsiderationObject.bases = this.ConsiderationBases[0];
        // this.choicesCompareData = this.firstChoiceComparision + this.secondChoiceComparision;
      });
      // var myobj = {
      //   'option': '1st/2nd Choice (net)',
      //   'score': [this.Choices, this.ConsiderationBases]
      // }
      // this.dtConsideration.push(myobj);
      // var dt = [];
      // var dt2 = [];
      // this.dtConsideration.forEach(element => {
      //   if (element.option == '1st/2nd Choice (net)') {
      //     dt.push(element);
      //   }
      //   else {
      //     dt2.push(element);
      //   }
      // });
      // this.dtConsideration = [];
      // this.dtConsideration.push(dt[0]);
      // this.dtConsideration.push(dt2[0]);
      // this.dtConsideration.push(dt2[1]);
      // this.dtConsideration.push(dt2[2]);
      // this.dtConsideration.push(dt2[3]);
      this.dtConsiderationCSV.push({ ques: 'Base', score: this.ConsiderationBases[0] });
    });

    this.brandImagery.addTableDataReady((output, dataTable) => {
      this.hideloader();
      this.imageryData = [];
      this.ImageryData1 = [];
      this.dtBrandImagery = [];
      this.compareBaseImaginary = [];
      this.pptDownloadObject.BrandImagery = [];
      let comparisionRow = [];
      this.showImaginarySigArray = [];
      let significanceRow = [];

      this.imageryData = output.sort((a, b) => b.Score - a.Score);

      this.imageryBases = dataTable.bases.get('Base').map(value => Math.round(value));
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

      this.imageryDataFinal = this.imageryData.filter((data) => {
        return data.SeriesCode != "na"
        })
      this.imageryDataFinal.forEach((v, i) => {
        let compData = 0;
        let showSig = false;
        comparisionRow.forEach((val, j) => {
          if (v.SeriesName == val.SeriesName && val.Score != undefined) {
            compData = Math.round(val.Score);
          }
        });
        significanceRow.forEach((val, j) => {
          if (v.SeriesName == val.SeriesName && val.Score != undefined) {
            showSig = true;
          }
        });
        switch (this.Category) {
          case 'Faucet':
            let driverScoreFaucet:any;

              driverScoreFaucet=this.KDAScores.Faucet2020[v.SeriesVariableID];



            var myobj = {
              'seriesname': v.SeriesName,
              'score': Math.round(v.Score),
              'KDA': driverScoreFaucet,
              'sigData': compData,
              'isSignificance': showSig
            };
            this.pptDownloadObject.BrandImagery.push(myobj);

              this.dtBrandImagery.push({ driver: driverScoreFaucet, type: v.SeriesName, score: Math.round(v.Score) });


            this.ImageryData1.push(myobj);
            break;
          case 'Showerhead':
            let driverScoreShowerhead:any;

              driverScoreShowerhead= this.KDAScores.Showerhead2020[v.SeriesVariableID]


            var myobj = {
              'seriesname': v.SeriesName,
              'score': Math.round(v.Score),
              'KDA':driverScoreShowerhead,
              'sigData': compData,
              'isSignificance': showSig
            };
            // tslint:disable-next-line: max-line-length
            this.pptDownloadObject.BrandImagery.push(myobj);

              this.dtBrandImagery.push({ driver: driverScoreShowerhead, type: v.SeriesName, score: Math.round(v.Score) });

            this.ImageryData1.push(myobj);
            break;
          case 'Toilet':
            let driverScoreToilet:any;

              driverScoreToilet= this.KDAScores.Toilet2020[v.SeriesVariableID]


            var myobj = {
              'seriesname': v.SeriesName,
              'score': Math.round(v.Score),
              'KDA': driverScoreToilet,
              'sigData': compData,
              'isSignificance': showSig
            };
            this.pptDownloadObject.BrandImagery.push(myobj);

              this.dtBrandImagery.push({ driver: driverScoreToilet, type: v.SeriesName, score: Math.round(v.Score) });

            this.ImageryData1.push(myobj);
            break;
          case 'TubShowerUnit':
            let driverScoreTubShowerUnit:any;

              driverScoreTubShowerUnit= this.KDAScores.Faucet2020[v.SeriesVariableID]


            var myobj = {
              'seriesname': v.SeriesName,
              'score': Math.round(v.Score),
              'KDA': driverScoreTubShowerUnit,
              'sigData': compData,
              'isSignificance': showSig
            };
            this.pptDownloadObject.BrandImagery.push(myobj);

              this.dtBrandImagery.push({ driver: driverScoreTubShowerUnit, type: v.SeriesName, score: Math.round(v.Score) });


            this.ImageryData1.push(myobj);
            break;
        }
      });
      this.dtBrandImagery.push({ driver: '', type: 'Base', score: this.imageryBases[0] });
      this.dtBrandImagery.sort((a, b) => b.driver - a.driver);
      this.ImageryData1.sort((a, b) => b.KDA - a.KDA);
      this.pptDownloadObject.bases = this.imageryBases[0];
      this.pptDownloadObject.BrandImagery.sort((a, b) => b.KDA - a.KDA);
    });
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
  updateDataTrends(category) {
    this.getfilterTrends();
    const snapshotTrends: SnapshotTrends = new SnapshotTrends(category, this.brandname);
    if (this.period === 'Quarterly' || this.periodSeclected === 'tab1') {
      this.awarenessMatrixTrendsChart = snapshotTrends.getAwarenessMatrix('Quarterly', 'AWARENESS METRICS', this.filter);

      this.EquityTrendsChart = snapshotTrends.getBrandEquity('Quarterly', 'BRAND EQUITY', this.filter);

      this.strongRelationshipTrendsChart = snapshotTrends.getStrongRelationship('Quarterly', 'STRONG RELATIONSHIP', this.filter);

      this.brandImageryTrendsChart = snapshotTrends.getBrandImagery('Quarterly', ['v558', 'v559', 'v560', 'v561', 'v562', 'v563', 'v564',
        'v565', 'v566', 'v567', 'v568', 'v569', 'v570', 'v571', 'v572', 'v573', 'v574', 'v575', 'v576', 'v1323', 'v1324', 'v1325'], 'OVERALL BRAND IMAGERY', this.filter);

      this.considerationTrendsChart = snapshotTrends.getConsideration('Quarterly', 'CONSIDERATION', this.filter);
    } else if (this.period === 'Annually' || this.periodSeclected === 'tab3') {
      this.awarenessMatrixTrendsChart = snapshotTrends.getAwarenessMatrix('Yearly', 'AWARENESS METRICS', this.filter);

      this.EquityTrendsChart = snapshotTrends.getBrandEquity('Yearly', 'BRAND EQUITY', this.filter);

      this.strongRelationshipTrendsChart = snapshotTrends.getStrongRelationship('Yearly', 'STRONG RELATIONSHIP', this.filter);

      this.brandImageryTrendsChart = snapshotTrends.getBrandImagery('Yearly', ['v558', 'v559', 'v560', 'v561', 'v562', 'v563', 'v564',
        'v565', 'v566', 'v567', 'v568', 'v569', 'v570', 'v571', 'v572', 'v573', 'v574', 'v575', 'v576', 'v1323', 'v1324', 'v1325'], 'OVERALL BRAND IMAGERY', this.filter);

      this.considerationTrendsChart = snapshotTrends.getConsideration('Yearly', 'CONSIDERATION', this.filter);
    } else if (this.period === 'SemiAnnually' || this.periodSeclected === 'tab2') {
      this.awarenessMatrixTrendsChart = snapshotTrends.getAwarenessMatrix('Semiannual', 'AWARENESS METRICS', this.filter);

      this.EquityTrendsChart = snapshotTrends.getBrandEquity('Semiannual', 'BRAND EQUITY', this.filter);

      this.strongRelationshipTrendsChart = snapshotTrends.getStrongRelationship('Semiannual', 'STRONG RELATIONSHIP', this.filter);

      this.brandImageryTrendsChart = snapshotTrends.getBrandImagery('Semiannual', ['v558', 'v559', 'v560', 'v561', 'v562', 'v563', 'v564',
        'v565', 'v566', 'v567', 'v568', 'v569', 'v570', 'v571', 'v572', 'v573', 'v574', 'v575', 'v576', 'v1323', 'v1324', 'v1325'], 'OVERALL BRAND IMAGERY', this.filter);

      this.considerationTrendsChart = snapshotTrends.getConsideration('Semiannual', 'CONSIDERATION', this.filter);
    }
  }

  toggleChart(tab) {
    this.selectedTab = tab;
    this.hideFilterForTrends = false;
    this.hideFilterTrends.sendBooleanFlag(this.hideFilterForTrends);
    this.showChart = false;
    this.showTrends = false;
    if (this.brandname === 'Delta') {
      this.isSelected = false;
    } else {
      this.isSelected = true;
    }
  }

  toggleTrends(tab) {
    this.selectedTab = tab;
    this.hideFilterForTrends = true;
    this.hideFilterTrends.sendBooleanFlag(this.hideFilterForTrends);
    this.showTrends = true;
    this.showChart = true;
    if (this.selectedTab === 'trendsTabs') {
      this.showLoader = true;
      this.updateDataTrends(this.Category);
      setTimeout(() => {
        this.onDataUpdate.next();
      });
      setTimeout(() => {
        this.showLoader = false;
      }, 15000);
    }
  }

  changeTimePeriod(period, periodSeclected) {
    this.period = period;
    this.periodSeclected = periodSeclected;
    if (this.selectedTab === 'trendsTabs') {
      this.showLoader = true;
      this.updateDataTrends(this.Category);
      setTimeout(() => {
        this.onDataUpdate.next();
      });
      setTimeout(() => {
        this.showLoader = false;
      }, 15000);
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
          this.filter = this.filter + ' Side Filter(s): ';
          this.filter = this.filter + " " + element;
        }
        else {
          this.filter = this.filter + "| " + element;
        }
      });
    };
  }
  pptEquity(pptName) {
    this.showLoader = true;
    this.getfilter();
    this.pptDownloadEquityObject.filter = this.filter;
    var objnew = JSON.stringify(this.pptDownloadEquityObject);
    this.pptexport.postPPTForEquityDownload(JSON.stringify(objnew)).subscribe((data) => {
      let blob = new Blob([data], { type: "application/octet-stream" });
      let url = window.URL.createObjectURL(blob);
      let a = document.createElement("a");
      document.body.appendChild(a);
      a.href = url;
      a.download = this.Category + "_" + pptName;
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
      this.showLoader = false;
    }, error => {
      console.log(error);
      this.showLoader = false;
    });
  }
  pptBrandImaginary(pptName) {
    this.showLoader = true;
    this.getfilter();
    this.pptDownloadObject.filter = this.filter;
    var ppt = JSON.stringify(this.pptDownloadObject);
    this.pptexport.postPPTForImageryDownload(JSON.stringify(ppt)).subscribe((data) => {
      let blob = new Blob([data], { type: "application/octet-stream" });
      let url = window.URL.createObjectURL(blob);
      let a = document.createElement("a");
      document.body.appendChild(a);
      a.href = url;
      a.download = this.Category + "_" + pptName;;
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
      this.showLoader = false;
    }, error => {
      console.log(error);
      this.showLoader = false;
    });
  }
  pptConsideration(pptName) {
    this.showLoader = true;
    this.getfilter();
    this.pptDownloadConsiderationObject.filter = this.filter;
    var consiob = JSON.stringify(this.pptDownloadConsiderationObject);
    this.pptexport.postPPTForConsiderationDownload(JSON.stringify(consiob)).subscribe((data) => {
      let blob = new Blob([data], { type: "application/octet-stream" });
      let url = window.URL.createObjectURL(blob);
      let a = document.createElement("a");
      document.body.appendChild(a);
      a.href = url;
      a.download = this.Category + "_" + pptName;;
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
      this.showLoader = false;
    }, error => {
      console.log(error);
      this.showLoader = false;
    });
  }
  pptTotalAwareness(pptName) {
    this.getfilter();
    this.showLoader = true;
    this.pptDownloadTotalAwarenessObject.filter = this.filter;
    var aware = JSON.stringify(this.pptDownloadTotalAwarenessObject);
    this.pptexport.postPPTForTotalAwarenessDownload(JSON.stringify(aware)).subscribe((data) => {
      let blob = new Blob([data], { type: "application/octet-stream" });
      let url = window.URL.createObjectURL(blob);
      let a = document.createElement("a");
      document.body.appendChild(a);
      a.href = url;
      a.download = this.Category + "_" + pptName;;
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
      this.showLoader = false;
    }, error => {
      console.log(error);
      this.showLoader = false;
    });
  }

  downloadConsiderationCSV() {
    this.getfilter();
    this.csvOptions.headers = [];
    if (this.brandname == 'American') {
      this.csvOptions.title = 'Consideration' + ' ' + this.brandname + ' ' + 'Standard';
    }
    else {
      this.csvOptions.title = 'Consideration' + ' ' + this.brandname;
    }
    this.csvOptions.headers.push("Filter(s)");
    this.csvOptions.headers.push(this.filter);

    new AngularCsv(this.dtConsiderationCSV, 'Consideration', this.csvOptions);
  }
  downloadBrandImageryCSV() {
    this.getfilter();
    this.csvOptions.headers = [];
    if (this.brandname == 'American') {
      this.csvOptions.title = 'Brand Imagery' + ' ' + this.brandname + ' ' + 'Standard';
    }
    else {
      this.csvOptions.title = 'Brand Imagery' + ' ' + this.brandname;
    }
    let dt = [];
    dt.push({ 'driver': "Driver", 'type': 'Series Name', 'score': 'Percentage' });
    this.dtBrandImagery.forEach(el => {
      dt.push({ 'driver': el.driver, 'type': el.type, 'score': el.score });
    });
    // this.csvOptions.headers = ['Driver', 'Series Name', 'Percentage'];
    this.csvOptions.headers.push("Filter(s)");
    this.csvOptions.headers.push(this.filter);
    new AngularCsv(dt, 'Brand Imagery', this.csvOptions);
  }
  downloadEquityCSV() {
    this.getfilter();
    this.dtEquity = [];
    this.csvOptions.headers = [];
    if (this.brandname == 'American') {
      this.dtEquity.push({ type: 'Chart Name', score: 'Percentage' });

      if (isNaN(this.Active)) {
        this.dtEquity.push({ type: 'Active', score: 'NA' });
      }
      else {
        this.dtEquity.push({ type: 'Active', score: this.Active });
      }
      if (isNaN(this.Latent)) {
        this.dtEquity.push({ type: 'Latent', score: 'NA' });
      }
      else {
        this.dtEquity.push({ type: 'Latent', score: this.Latent });
      }
      if (isNaN(this.strongScore)) {
        this.dtEquity.push({ type: 'Strong Relationship', score: 'NA' });
      }
      else {
        this.dtEquity.push({ type: 'Strong Relationship', score: this.strongScore });
      }


      this.csvOptions.title = 'Brand Equity' + ' ' + this.brandname + ' ' + 'Standard';
    }
    else {
      this.dtEquity.push({ type: 'Chart Name', score: 'Percentage' });
      if (isNaN(this.Active)) {
        this.dtEquity.push({ type: 'Active', score: 'NA' });
      }
      else {
        this.dtEquity.push({ type: 'Active', score: this.Active });
      }
      if (isNaN(this.Latent)) {
        this.dtEquity.push({ type: 'Latent', score: 'NA' });
      }
      else {
        this.dtEquity.push({ type: 'Latent', score: this.Latent });
      }
      if (isNaN(this.strongScore)) {
        this.dtEquity.push({ type: 'Strong Relationship', score: 'NA' });
      }
      else {
        this.dtEquity.push({ type: 'Strong Relationship', score: this.strongScore });
      }
      this.csvOptions.title = 'Brand Equity' + ' ' + this.brandname + ' Filter:';
    }
    this.dtEquity.push({ type: 'Base', base: this.StrongBase });
    //this.csvOptions.headers = ['Chart Name', 'Percentage'];
    this.csvOptions.headers.push("Filter(s)");
    this.csvOptions.headers.push(this.filter);
    new AngularCsv(this.dtEquity, 'Brand Equity', this.csvOptions);
  }

  downloadAwarenesCSV() {
    this.getfilter();
    this.dtAwareness = [];
    this.csvOptions.headers = [];
    this.dtAwareness.push({ type: 'Chart Name', score: 'Percentage' });
    this.dtAwareness.push({ type: 'Unaided Brand Awareness', score: Math.round(this.UnaidedScore) });
    this.dtAwareness.push({ type: 'Total Brand (Unaided + Aided) Awareness', score: Math.round(this.TotalScore) });
    this.dtAwareness.push({ type: 'Base', base: this.Totalbase });
    if (this.brandname == 'American') {
      this.csvOptions.title = 'Awareness Metrics' + ' ' + this.brandname + ' ' + 'Standard';
    }
    else {
      this.csvOptions.title = 'Awareness Metrics' + ' ' + this.brandname;
    }
    // this.csvOptions.headers = ['Chart Name', 'Percentage'];
    this.csvOptions.headers.push("Filter(s)");
    this.csvOptions.headers.push(this.filter);
    new AngularCsv(this.dtAwareness, 'Awareness Metrics', this.csvOptions);
  }

  hideloader() {
    const loader = [this.brandImagery.showLoader, this.Consideration.showLoader, this.Strong.showLoader, this.Equity.showLoader,
    this.Unaided.showLoader, this.TotalBrand.showLoader];

    if (loader.reduce((prev, curr) => prev || curr, false) === false) {
      this.showLoader = false;
    }
  }
  updateData(Category) {
    this.createTables(Category);
    setTimeout(() => {
      this.onDataUpdate.next();
    });
  }


  toggle($event, id, check) {
    const allIcons = document.getElementsByClassName('icon');
    for (let i = 0; i < allIcons.length; i++) {
      allIcons[i].classList.remove('selected');
    }
    var icon = document.getElementById(id);
    icon.classList.add('selected');
    this.brandname = id;
    if (check == 1) {
      this.updateData(this.Category);
    }
    else if (check == 2) {
      this.createTables(this.Category);
    }
    else if (check == 3) {
      this.updateData(this.Category);
    }

  }

  getBgColor(kda) {
    if (kda <= 75) {
      return 'Grey';
    }
    else if (kda >= 76 && kda <= 124) {
      return '#ffcc00';
    }
    else { return '#0095d9' }

  }

  getContentHeight() {
    return window.innerHeight - 270;
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



