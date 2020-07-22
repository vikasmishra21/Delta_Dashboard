import { Component, OnInit } from '@angular/core';
import { FilterService } from 'src/app/shell/services/filter.service';
import { FilterConfigService } from 'src/app/service/filter-config.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { CategoryDisposition } from 'src/app/model/categoryDisposition';
import { ActivatedRoute } from '@angular/router';
import { Brands } from 'src/app/model/brands';
import { Chart } from 'src/app/shell/models/chart';
import { AssetMappings } from 'src/app/model/asset.mappings';
import { element } from 'protractor';
import { AngularCsv } from 'angular7-csv/dist/Angular-csv';
import { truncate } from 'fs';
import { ScoreAndBasePipe } from 'src/app/pipe/score-and-base.pipe';
import { PptExportService } from 'src/app/service/ppt-export.service';
import { FilterOption } from 'src/app/shell/models/filterOption';
import { DispositionTrends } from './dispositionTrends';
import { FilterHideService } from 'src/app/service/filter-hide.service';
import { AppliedFilterSetService } from 'src/app/service/applied-filter-set.service';

@Component({
  selector: 'app-disposition',
  templateUrl: './disposition.component.html',
  styleUrls: ['./disposition.component.css'],
  providers: [ScoreAndBasePipe]
})
export class DispositionComponent implements OnInit {
  selectedTab = 'Influenced';
  viewMode = 'tab1';
  ShowData: string = 'Total';
  pageVisited: boolean = false;
  showLoader: boolean;
  onDataUpdate:  Subject<any> = new Subject();
  onDataUpdateInfluence: Subject<any> = new Subject();
  onDataUpdateBoughtShopped: Subject<any> = new Subject();
  onDataUpdateInstalled : Subject<any> = new Subject();
  onDataUpdatePurchasePrice : Subject<any> = new Subject();
  onDataUpdateReasonForChoice : Subject<any> = new Subject();
  updateDataUnsubscribe: Subject<any> = new Subject<any>();
  brandList: Array<string>;
  Category: string;
  brandNameCsv: Array<string>;
  brandCodesCsv = AssetMappings.brandNameAndCodes;

  InfluencedDataChart: Chart;
  InfluencedDataArray: Array<any> = new Array<any>();
  InfluencedBase: Array<any> = new Array<any>();
  installedDataChart: Chart;
  InstalledBase: Array<any> = new Array<any>();
  InstalledDataArray: Array<any> = new Array<any>();
  purchasePriceChart: Chart;
  PurchasePriceBase: Array<any> = new Array<any>();
  purchasePriceArray: Array<any> = new Array<any>();
  purchaseAverageChart: Chart;
  purchaseMedianChart: Chart;
  purchaseAverageArray: Array<number> = new Array<number>();
  purchaseMedianArray: Array<any> = new Array<any>();
  purchaseMedianArrayResult: Array<any> = new Array<any>();

  reasonForCategoryChoice: Chart;
  ReasonForChoiceBase: Array<any> = new Array<any>();
  reasonfForBrandChoiceArray: Array<any> = new Array<any>();

  reasonForBrandAverageChart: Chart;
  totalBrandsAverageForChoice: Array<any> = new Array<any>();

  whereBoughtChartTotal: Chart;
  whereShoppedChartTotal: Chart;
  whereBoughtChartInstoreOnline: Chart;
  whereShoppedChartInstoreOnline: Chart;
  // whereBoughtChartOnline: Chart;
  // whereShoppedChartOnline: Chart;

  totalBoughtChartInstore: Chart;
  totalBoughtChartOnline: Chart;
  totalShoppedChartInstore: Chart;
  totalShoppedChartOnline: Chart;

  TotalBought: Array<any> = new Array<any>();
  TotalShopped: Array<any> = new Array<any>();
  InstoreBought: Array<any> = new Array<any>();
  InstoreShopped: Array<any> = new Array<any>();
  OnlineBought: Array<any> = new Array<any>();
  OnlineShopped: Array<any> = new Array<any>();

  OnlineTotalBought: Array<any> = new Array<any>();
  OnlineTotalShopped: Array<any> = new Array<any>();
  InstoreTotalBought: Array<any> = new Array<any>();
  InstoreTotalShopped: Array<any> = new Array<any>();

  TotalInstoreBoughtBase: Array<any> = new Array<any>();
  TotalInstoreShoppedBase: Array<any> = new Array<any>();
  TotalOnlineBoughtBase: Array<any> = new Array<any>();
  TotalOnlineShoppedBase: Array<any> = new Array<any>();

  TotalBoughtBase: Array<any> = new Array<any>();
  TotalShoppedBase: Array<any> = new Array<any>();
  instoreBoughtBase: Array<any> = new Array<any>();
  instoreShoppedBase: Array<any> = new Array<any>();
  onlineBoughtBase: Array<any> = new Array<any>();
  onlineShoppedBase: Array<any> = new Array<any>();

  netIBoughtCompareScore: Array<any> = new Array<any>();
  netIShoppedCompareScore: Array<any> = new Array<any>();
  netOBoughtCompareScore: Array<any> = new Array<any>();
  netOShoppedCompareScore: Array<any> = new Array<any>();

  totalBoughtCompareScore: Array<any> = new Array<any>();
  totalShoppedCompareScore: Array<any> = new Array<any>();
  instoreBoughtCompareScore: Array<any> = new Array<any>();
  instoreShoppedCompareScore: Array<any> = new Array<any>();
  onlineBoughtCompareScore: Array<any> = new Array<any>();
  onlineShoppedCompareScore: Array<any> = new Array<any>();

  netIBoughtCompareBase: Array<any> = new Array<any>();
  netIShoppedCompareBase: Array<any> = new Array<any>();
  netOBoughtCompareBase: Array<any> = new Array<any>();
  netOShoppedCompareBase: Array<any> = new Array<any>();

  totalBoughtCompareBase: Array<any> = new Array<any>();
  totalShoppedCompareBase: Array<any> = new Array<any>();
  instoreBoughtCompareBase: Array<any> = new Array<any>();
  instoreShoppedCompareBase: Array<any> = new Array<any>();
  onlineBoughtCompareBase: Array<any> = new Array<any>();
  onlineShoppedCompareBase: Array<any> = new Array<any>();

  netIBoughtSig: Array<any> = new Array<any>();
  netIShoppedSig: Array<any> = new Array<any>();
  netOBoughtSig: Array<any> = new Array<any>();
  netOShoppedSig: Array<any> = new Array<any>();
  totalBoughtSig: Array<any> = new Array<any>();
  totalShoppedSig: Array<any> = new Array<any>();
  instoreBoughtSig: Array<any> = new Array<any>();
  instoreShoppedSig: Array<any> = new Array<any>();
  onlineBoughtSig: Array<any> = new Array<any>();
  onlineShoppedSig: Array<any> = new Array<any>();

  periodSeclected: any = 'tab1Trends';

  isPurchaseAverageLoader: boolean = false;
  isPurchaseMedianLoader: boolean = false;
  isPurchaseDataLoader: boolean = false;

  isnetInstoreBought: boolean = false;
  isnetInstoreShopped: boolean = false;
  isnetOnlineBought: boolean = false;
  isnetOnlineShopped: boolean = false;
  isTotalBoughtLoader: boolean = false;
  isTotalShoppedLoader: boolean = false;
  isInstoreBoughtLoader: boolean = false;
  isInstoreShoppedLoader: boolean = false;
  isOnlineBoughtLoader: boolean = false;
  isOnlioneShoppedLoader: boolean = false;

  boughtInstoreOnlineObj: Array<any> = new Array<any>();
  dataTableOfTable: any;

  CategoryBrand = {
    Faucet: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '19'],
    Showerhead: ['1', '2', '3', '4', '5', '6', '7', '8', '10', '11', '22', '23','24','32', '41'],
    Toilet: ['1', '2', '3', '4', '5', '6', '7', '8', '12', '14','15', '16','17','18', '19','20'],
  }

  reasonMapping = {
    serieseName: '',
    dataArray: [],
    average: [],
    median: [],
  }
  pptDownloadObjectForInfluenced = {
    'brands': [],
    'category': '',
    'serieswisescore': [],
    'bases': [],
    'filter': ''
  };
  pptDownloadObjectForInstalled = {
    'brands': [],
    'category': '',
    'serieswisescore': [],
    'bases': [],
    'filter': ''
  };
  pptDownloadObjectForPurchased = {
    'brands': [],
    'category': '',
    'serieswisescore': [],
    'average': [],
    'median': [],
    'filter': '',
    'bases': []
  };
  pptDownloadObjectForBought = {
    'brands': [],
    'category': '',
    'boughtserieswisescore': [],
    'shoppedserieswisescore': [],
    'InstoreTotalBought': [],
    'InstoreTotalShopped': [],
    'OnlineTotalShopped': [],
    'OnlineTotalBought': [],
    'TotalInstoreBoughtBase': [],
    'TotalInstoreShoppedBase': [],
    'TotalOnlineBoughtBase': [],
    'TotalOnlineShoppedBase': [],
    'filter': ''
  };
  pptDownloadObjectForBrand = {
    'brands': [],
    'category': '',
    'ReasonData': [],
    'filter': '',
    'bases': []
  };
  timePeriodChips: Map<string, Array<FilterOption>> = new Map<string, Array<FilterOption>>();
  selectedOnPageLoad: string;

  public showChart = false;
  public showTrends = false;
  selectedTab1: any;
  period = 'Quarterly';
  // periodSeclected = 'tab1Trends';
  isShownInfluenced: boolean = false;
  isShownInstalled: boolean = false;
  isShownPurchasePrice: boolean = false;
  isShownBrandChoice: boolean = false;
  brandCodesTrends: any;

  whoInfluencedtrendsDelta: any;
  whoInfluencedtrendsMoen: any;
  whoInfluencedtrendsKohler: any;
  whoInfluencedtrendsPeerless: any;
  whoInfluencedtrendsAS: any;
  whoInfluencedtrendsPfister: any;
  whoInfluencedtrendsAquaS: any;
  whoInfluencedtrendsBrizo: any;
  whoInfluencedtrendsGlacier: any;
  whoInfluencedtrendsGrohe: any;
  whoInfluencedtrendsHansgrohe: any;
  whoInfluencedtrendsToto: any;

  whoInstalledtrendsDelta: any;
  whoInstalledtrendsMoen: any;
  whoInstalledtrendsKohler: any;
  whoInstalledtrendsPeerless: any;
  whoInstalledtrendsAS: any;
  whoInstalledtrendsPfister: any;
  whoInstalledtrendsAquaS: any;
  whoInstalledtrendsBrizo: any;
  whoInstalledtrendsGlacier: any;
  whoInstalledtrendsGrohe: any;
  whoInstalledtrendsHansgrohe: any;
  whoInstalledtrendsToto: any;

  getPurchasePricetrendsDelta: any;
  getPurchasePricetrendsMoen: any;
  getPurchasePricetrendsKohler: any;
  getPurchasePricetrendsPeerless: any;
  getPurchasePricetrendsAS: any;
  getPurchasePricetrendsPfister: any;
  getPurchasePricetrendsAquaS: any;
  getPurchasePricetrendsBrizo: any;
  getPurchasePricetrendsGlacier: any;
  getPurchasePricetrendsGrohe: any;
  getPurchasePricetrendsHansgrohe: any;
  getPurchasePricetrendsToto: any;

  getReasonBrandChoicetrendsDelta: any;
  getReasonBrandChoicetrendsMoen: any;
  getReasonBrandChoicetrendsKohler: any;
  getReasonBrandChoicetrendsPeerless: any;
  getReasonBrandChoicetrendsAS: any;
  getReasonBrandChoicetrendsPfister: any;
  getReasonBrandChoicetrendsAquaS: any;
  getReasonBrandChoicetrendsBrizo: any;
  getReasonBrandChoicetrendsGlacier: any;
  getReasonBrandChoicetrendsGrohe: any;
  getReasonBrandChoicetrendsHansgrohe: any;
  getReasonBrandChoicetrendsToto: any;
  hideFilterForTrends: boolean = false;
  ListOfBrands: any;
  whoInfluencedTrendsPptData: Array<any> = new Array<any>();
  whoInstalledTrendsPptData: Array<any> = new Array<any>();
  purchasePriceTrendsPptData: Array<any> = new Array<any>();
  reasonBrandChoiceTrendsPptData: Array<any> = new Array<any>();
  globalCounterForTrends: boolean = false;

  filter: string;
  InstoreBoughtshoppedMap : Map<string, Map<string, {}>> = new Map<string, Map<string, {}>>();
  OnlineBoughShoppedMap : Map<string, Map<string, {}>> = new Map<string, Map<string, {}>>();



  constructor(private filterService: FilterService, private pptexport: PptExportService, private route: ActivatedRoute,
    private filterConfigService: FilterConfigService, private scoreAndBase: ScoreAndBasePipe,
    private hideFilterTrends: FilterHideService, private appliedFilterSet: AppliedFilterSetService) {
    this.route.params.subscribe(params => {
      if(this.filterService.getAppliedFilters().size===0){
        localStorage.removeItem('filterapp');
      }
      if (this.filterService.getAppliedFilters().size !== 0 ||
        this.filterService.getAppliedSeriesSelectors().size !== 0 ||
        this.filterService.getAppliedTimePeriods().size !== 0) {

        //this.updateData(this.Category);
        // setTimeout(() => {
        //   this.onDataUpdate.next();
        // });
      }
      if (this.pageVisited) {
        this.updateDataUnsubscribe.next();
        this.updateDataUnsubscribe.complete();
      }
      this.Category = params.order;
      if (this.Category == "Faucet") {
        this.filterConfigService.initializeCateogryBrandHealthFaucet();
        this.selectedOnPageLoad = 'Total';
      }
      if (this.Category == "Showerhead") {
        this.filterConfigService.initializeCateogryBrandHealthShowerhead();
        this.selectedOnPageLoad = 'Total';
      }
      if (this.Category == "Toilet") {
        this.filterConfigService.initializeCateogryBrandHealthToilet();
        this.selectedOnPageLoad = 'Total';
      }
      if (this.Category == "TubShowerUnit") {
        this.filterConfigService.initializeCateogryBrandHealthTubShowerUnit();
        this.selectedOnPageLoad = 'Total';
      }
      this.filterService.optionSelectionCallback$
        .pipe(takeUntil(this.updateDataUnsubscribe))
        .subscribe(value => {
          this.selectedTab = this.selectedTab ?this.selectedTab : 'Influenced';
          this.viewMode = this.viewMode? this.viewMode : 'tab1';
         
          this.changeTable(this.selectedTab, this.viewMode);
          //this.createCharts(this.Category);
          // setTimeout(() => {
          //   this.onDataUpdateInfluence.next();
          // });
        });
      this.showLoader = true;
    });
  }

  initpara() {
    this.ShowData = 'Total';
    this.InfluencedDataArray = [];
    this.InstalledDataArray = [];
    this.purchaseAverageArray = [];
    this.purchaseMedianArray = [];

    this.TotalBought = [];
    this.TotalShopped = [];

    this.InstoreTotalBought = [];
    this.InstoreTotalShopped = [];
    this.InstoreBought = [];
    this.InstoreShopped = [];

    this.OnlineTotalBought = [];
    this.OnlineTotalShopped = [];
    this.OnlineBought = [];
    this.OnlineShopped = [];

    this.InfluencedBase = [];
    this.InstalledBase = [];
    this.PurchasePriceBase = [];
    this.ReasonForChoiceBase = [];

    this.TotalOnlineBoughtBase = [];
    this.TotalInstoreBoughtBase = [];
    this.TotalOnlineShoppedBase = [];
    this.TotalInstoreShoppedBase = [];
    this.TotalBoughtBase = [];
    this.TotalShoppedBase = [];
    this.instoreBoughtBase = [];
    this.instoreShoppedBase = [];
    this.onlineBoughtBase = [];
    this.onlineShoppedBase = [];
    this.totalBrandsAverageForChoice = [];

    this.netIBoughtCompareScore = [];
    this.netIShoppedCompareScore = [];
    this.netOBoughtCompareScore = [];
    this.netOShoppedCompareScore = [];
    this.totalBoughtCompareScore = [];
    this.totalShoppedCompareScore = [];
    this.instoreBoughtCompareScore = [];
    this.instoreShoppedCompareScore = [];
    this.onlineBoughtCompareScore = [];
    this.onlineShoppedCompareScore = [];

    this.netIBoughtCompareBase = [];
    this.netIShoppedCompareBase = [];
    this.netOBoughtCompareBase = [];
    this.netOShoppedCompareBase = [];
    this.totalBoughtCompareBase = [];
    this.totalShoppedCompareBase = [];
    this.instoreBoughtCompareBase = [];
    this.instoreShoppedCompareBase = [];
    this.onlineBoughtCompareBase = [];
    this.onlineShoppedCompareBase = [];

    this.netIBoughtSig = [];
    this.netIShoppedSig = [];
    this.netOBoughtSig = [];
    this.netOShoppedSig = [];
    this.totalBoughtSig = [];
    this.totalShoppedSig = [];
    this.instoreBoughtSig = [];
    this.instoreShoppedSig = [];
    this.onlineBoughtSig = [];
    this.onlineShoppedSig = [];

    this.isPurchaseAverageLoader = false;
    this.isPurchaseMedianLoader = false;
    this.isPurchaseDataLoader = false;

    this.isnetInstoreBought = false;
    this.isnetInstoreShopped = false;
    this.isnetOnlineBought = false;
    this.isnetOnlineShopped = false;
    this.isTotalBoughtLoader = false;
    this.isTotalShoppedLoader = false;
    this.isInstoreBoughtLoader = false;
    this.isInstoreShoppedLoader = false;
    this.isOnlineBoughtLoader = false;
    this.isOnlioneShoppedLoader = false;


    this.InstoreBoughtshoppedMap.set("BoughtInstore", new Map<string, {}>());
    this.InstoreBoughtshoppedMap.set("ShoppedInstore", new Map<string, {}>());
    this.OnlineBoughShoppedMap.set("BoughtOnline", new Map<string, {}>());
    this.OnlineBoughShoppedMap.set("ShoppedOnline", new Map<string, {}>());
  };

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

  ngAfterContentInit(): void {
    this.Category = '';
    this.route.params.subscribe(params => {
      this.Category = params.order;
      if (this.Category) {
        this.Category = params.order;
        this.createCharts(this.Category);
      } else {
        this.Category = params.order;
        this.createCharts(this.Category);
      }
    });
  }

  ngOnInit() {
    this.pageVisited = true;
    this.showLoader = true;
    // this.updateData(this.Category);
    // this.route.params.subscribe(params => {
    //   // if(this.filterService.getAppliedFilters().size===0){
    //   //   localStorage.removeItem('filterapp');
    //   // }
    //   // if (this.filterService.getAppliedFilters().size !== 0 ||
    //   //   this.filterService.getAppliedSeriesSelectors().size !== 0 ||
    //   //   this.filterService.getAppliedTimePeriods().size !== 0) {

    //   //   //this.updateData(this.Category);
    //   //   // setTimeout(() => {
    //   //   //   this.onDataUpdate.next();
    //   //   // });
    //   // }
    // });

    // this.filterService.optionSelectionCallback$
    //   .pipe(takeUntil(this.updateDataUnsubscribe))
    //   .subscribe(value => {
    //     // this.updateData(this.Category);
    //     // setTimeout(() => {
    //     //   this.onDataUpdateInfluence.next();
    //     // });
    //     this.changeTable('Influenced', 'tab1');
    //   });
  }

  updateData(Category) {
    this.createCharts(Category);
    setTimeout(() => {
      if(this.viewMode == 'tab2'){
        this.onDataUpdateInstalled.next();
      }
      else if(this.viewMode == 'tab3'){
        this.onDataUpdatePurchasePrice.next();
      }else if(this.viewMode == 'tab4'){
        this.onDataUpdateBoughtShopped.next();
      }else if(this.viewMode == 'tab5'){
        this.onDataUpdateReasonForChoice.next();
      }else{
        this.onDataUpdateInfluence.next();
      }
  });
    
  }

  calculateCompareScore(compareWithScore, Score) {
    let compareScore = [];
    if (compareWithScore != undefined) {
      if (Score.length == compareWithScore.length) {
        compareWithScore.forEach((val, index) => {
          if (val != undefined && !isNaN(val) && val != '') {
            compareScore.push(Math.round(Score[index] - (val)));
          }
          else {
            compareScore.push(0);
          }
        });
      }
    }
    return compareScore;
  }

  hidePurchaseLoader(average, median, data) {
    if (average == true && median == true && data == true) {
      this.showLoader = false;
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
  calculateReasonChoiceAverage(overallMarketAverageArray){
    let sumOfArray = 0;
    if(overallMarketAverageArray.length > 0){
      let counter = 0;
      overallMarketAverageArray.forEach((val, index)=>{
        if(!isNaN(val) && val !== undefined && val !== "NaN"){
          sumOfArray += val;
        }
        counter++;
      });
      sumOfArray = sumOfArray/counter;
    }
    return sumOfArray;
  }

  calculateReasonBrandChoice(totalBrandsAverageForChoice, dataTable){
    if(totalBrandsAverageForChoice.length > 0 && dataTable.rows.size > 0){
      const dataArray = [];
      let counter = 0;
      if (dataTable.bases.get('Base') != undefined) {
        this.ReasonForChoiceBase = dataTable.bases.get('Base');
        if (this.totalBrandsAverageForChoice.length > 0) {
          let avg = 0;
          dataTable.rows.forEach((element, index) => {
            if(index.toString().indexOf('[SKIPPED]') === (-1) && index.toString().indexOf('[HIDDEN]') === (-1) && index.toString().indexOf('[HIDDEN') === (-1)){
              this.totalBrandsAverageForChoice.forEach(val => {
                if (val.name == index) {
                  avg = val.score;
                }
              });     
              let reasonObject = {
                'sereiseName': '',
                'seriesdata': [],
                'average': 0,
                'unroundedaverage':0,
                'seriesColor': [],
                'compareBase': [],
                'compareScore': [],
                'isSignificance': []
              }
              if (index === 'Other reason [O]') {
                let arr = index.split(" ");
                reasonObject.sereiseName = arr[0] + " " + arr[1];
              }
              else {
                reasonObject.sereiseName = index;
              }
              reasonObject.seriesdata = element;
              reasonObject.average = avg;
              reasonObject.unroundedaverage=avg;
  
              let compareScore = [];
              let compareBase = [];
  
              if (dataTable.comparisonBases.get("Base") != undefined) {
                compareBase = dataTable.comparisonBases.get("Base");
                dataTable.previousScoreRows.forEach((compareData, compareIndex) => {
                  if (compareIndex === reasonObject.sereiseName) {
                    //compareScore = this.calculateCompareScore(compareData, reasonObject.seriesdata);
                    compareScore = compareData;
                  }
                });
              }
              reasonObject.compareScore = compareScore;
              reasonObject.compareBase = compareBase;
              reasonObject.isSignificance = dataTable.significance.get(reasonObject.sereiseName);
              dataArray.push(reasonObject);
              counter++;
            }
          });
        }
        if (counter >= 10) {
          this.reasonfForBrandChoiceArray = this.colorIndexing(dataArray);
          this.reasonfForBrandChoiceArray.sort((a, b) => b.average - a.average);
          this.showLoader = false;
        }
      }
    }
  }

  createDataArrayForInstoreTable(InstoreBoughtshoppedMap, OnlineBoughShoppedMap){
    if(this.InstoreBoughtshoppedMap.get("BoughtInstore").size >0 && this.InstoreBoughtshoppedMap.get("ShoppedInstore").size>0){
      this.InstoreBought = [];
      this.InstoreShopped = [];
      let iShopped = [];
      let iBought = [];
      this.InstoreBoughtshoppedMap.get("ShoppedInstore").forEach((val, index)=>{
        let InstoreShopped = {
          'sereiesName': index,
          'score': val["score"],
          'base': val["base"],
          'compareScore': val["compareScore"],
          'compareBase': val["compareBase"],
          'isSignificance': val["isSignificance"] 
        }
        // this.InstoreShopped.push(InstoreShopped);
        iShopped.push(InstoreShopped);
        let InstoreBought = {
          'sereiesName': index,
          'score': [],
          'base': [],
          'compareScore': [],
          'compareBase': [],
          'isSignificance': []
        } 
        if(this.InstoreBoughtshoppedMap.get("BoughtInstore").get(index) !== undefined){
          InstoreBought = {
            'sereiesName': index,
            'score': this.InstoreBoughtshoppedMap.get("BoughtInstore").get(index)["score"],
            'base': this.InstoreBoughtshoppedMap.get("BoughtInstore").get(index)["base"],
            'compareScore': this.InstoreBoughtshoppedMap.get("BoughtInstore").get(index)["compareScore"],
            'compareBase': this.InstoreBoughtshoppedMap.get("BoughtInstore").get(index)["compareBase"],
            'isSignificance': this.InstoreBoughtshoppedMap.get("BoughtInstore").get(index)["isSignificance"] 
          } 
        }
        // this.InstoreBought.push(InstoreBought);
        iBought.push(InstoreBought);
      });
      this.InstoreShopped = iShopped;
      this.InstoreBought = iBought;   
      this.InstoreShopped.forEach((val, index)=>{
          if(!this.InstoreBought[index].score.length){
            val.score.forEach((el, i)=>{
              this.InstoreBought[index].score[i] = "NA";
              // this.InstoreBought[index].base[i] = "NA";
            });
          }
      });
    }
    if(this.OnlineBoughShoppedMap.get("BoughtOnline").size >0 && this.OnlineBoughShoppedMap.get("ShoppedOnline").size >0){
      this.OnlineBought = [];
      this.OnlineShopped = [];
      let ONShopped = [];
      let ONBought = [];
      this.OnlineBoughShoppedMap.get("ShoppedOnline").forEach((val, index)=>{
        let OShopped = {
          'sereiesName': index,
          'score': val["score"],
          'base': val["base"],
          'compareScore': val["compareScore"],
          'compareBase': val["compareBase"],
          'isSignificance': val["isSignificance"] 
        }
        // this.InstoreShopped.push(InstoreShopped);
        ONShopped.push(OShopped);
        let OBought = {
          'sereiesName': index,
          'score': [],
          'base': [],
          'compareScore': [],
          'compareBase': [],
          'isSignificance': []
        } 
        if(this.OnlineBoughShoppedMap.get("BoughtOnline").get(index) !== undefined){
          OBought = {
            'sereiesName': index,
            'score': this.OnlineBoughShoppedMap.get("BoughtOnline").get(index)["score"],
            'base': this.OnlineBoughShoppedMap.get("BoughtOnline").get(index)["base"],
            'compareScore': this.OnlineBoughShoppedMap.get("BoughtOnline").get(index)["compareScore"],
            'compareBase': this.OnlineBoughShoppedMap.get("BoughtOnline").get(index)["compareBase"],
            'isSignificance': this.OnlineBoughShoppedMap.get("BoughtOnline").get(index)["isSignificance"] 
          } 
        }
        // this.InstoreBought.push(InstoreBought);
        ONBought.push(OBought);
      });
      this.OnlineShopped = ONShopped;
      this.OnlineBought = ONBought;   
      this.OnlineShopped.forEach((val, index)=>{
          if(!this.OnlineBought[index].score.length){
            val.score.forEach((el, i)=>{
              this.OnlineBought[index].score[i] = "NA";
              // this.OnlineBought[index].base[i] = "NA";
            });
          }
      });
    }
    // this.InstoreBoughtshoppedMap.set("BoughtInstore", new Map<string, {}>());
    // this.InstoreBoughtshoppedMap.set("ShoppedInstore", new Map<string, {}>());
    // this.OnlineBoughShoppedMap.set("BoughtOnline", new Map<string, {}>());
    // this.OnlineBoughShoppedMap.set("ShoppedOnline", new Map<string, {}>());
  }



  createCharts(category) {
    this.showLoader = true;
    this.toggleChart('chartsTabs');
    this.initpara();
    const disposition: CategoryDisposition = new CategoryDisposition();
    const brands = new Brands(this.filterService);
    this.brandList = brands.getBrandsCode().map(val => AssetMappings.logoByBrandCode[val]);
    const brandcodes = brands.getBrandsCode();
    this.ListOfBrands = brandcodes;
    this.brandCodesTrends = brandcodes;
    this.brandNameCsv = brands.getBrandsCode().map((val) => this.brandCodesCsv[val]);
    this.pptDownloadObjectForInstalled.brands = this.brandNameCsv;
    this.pptDownloadObjectForPurchased.brands = this.brandNameCsv;
    this.pptDownloadObjectForInfluenced.brands = this.brandNameCsv;
    this.pptDownloadObjectForBought.brands = this.brandNameCsv;
    this.pptDownloadObjectForBrand.brands = this.brandNameCsv;
    this.purchaseAverageArray = [];
    if (brandcodes.length != 0) {
      brandcodes.forEach(val => {
        this.purchaseAverageArray.push(0);
      })
    }

    if (this.ListOfBrands.length) {
      if (this.selectedTab == "Influenced") {
        this.showLoader = true;
        this.InfluencedDataChart = disposition.getWhoInfluenced(category, brandcodes);
        this.InfluencedDataChart.addTableDataReady((output, dataTable) => {
          this.InfluencedDataArray = [];
          this.InfluencedBase = [];
          this.pptDownloadObjectForInfluenced.serieswisescore = [];
          this.InfluencedBase = dataTable.bases.get('Base');

          let compareBase = [];
          let yourselfCompare = [];
          let spouseCompare = [];
          let familyCompare = [];
          let PlumberCompare = [];

          if (dataTable.comparisonBases.get("Base") != undefined) {
            compareBase = dataTable.comparisonBases.get("Base");
            yourselfCompare = dataTable.previousScoreRows.get("Yourself");
            spouseCompare = dataTable.previousScoreRows.get("Spouse");
            familyCompare = dataTable.previousScoreRows.get("Other family member or friend");
            if (category == 'Faucet') {
              PlumberCompare = dataTable.previousScoreRows.get("Plumber / contractor")
            }
            else {
              PlumberCompare = dataTable.previousScoreRows.get("Plumber/contractor")
            }
            // yourselfCompare = this.calculateCompareScore(dataTable.comparisonRows.get("Yourself"), dataTable.rows.get('Yourself'));
            // spouseCompare = this.calculateCompareScore(dataTable.comparisonRows.get("Spouse"), dataTable.rows.get('Spouse'));
            // familyCompare = this.calculateCompareScore(dataTable.comparisonRows.get("Other family member or friend"), dataTable.rows.get('Other family member or friend'));
            // if (category == 'Faucet') {
            //   PlumberCompare = this.calculateCompareScore(dataTable.comparisonRows.get("Plumber / contractor"), dataTable.rows.get('Plumber / contractor'));
            // }
            // else {
            //   PlumberCompare = this.calculateCompareScore(dataTable.comparisonRows.get("Plumber/contractor"), dataTable.rows.get('Plumber/contractor'));
            // }
          }

          this.InfluencedDataArray.push({
            'sereiseName': 'Self', 'sereiseData': dataTable.rows.get('Yourself'), 'compareScore': yourselfCompare,
            'compareBase': compareBase, 'isSignificance': dataTable.significance.get('Yourself')
          });
          this.pptDownloadObjectForInfluenced.serieswisescore.push({ 'seriesname': 'Self', 'data': dataTable.rows.get('Yourself') });
          this.InfluencedDataArray.push({
            'sereiseName': 'Spouse', 'sereiseData': dataTable.rows.get('Spouse'), 'compareScore': spouseCompare,
            'compareBase': compareBase, 'isSignificance': dataTable.significance.get('Spouse')
          });
          this.pptDownloadObjectForInfluenced.serieswisescore.push({ 'seriesname': 'Spouse', 'data': dataTable.rows.get('Spouse') });
          this.InfluencedDataArray.push({
            'sereiseName': 'Other family member or friend', 'sereiseData': dataTable.rows.get('Other family member or friend'),
            'compareScore': familyCompare, 'compareBase': compareBase, 'isSignificance': dataTable.significance.get('Other family member or friend')
          });
          this.pptDownloadObjectForInfluenced.serieswisescore.push({ 'seriesname': 'Other family member or friend', 'data': dataTable.rows.get('Other family member or friend') });
          this.pptDownloadObjectForInfluenced.bases = this.InfluencedBase; this.pptDownloadObjectForInfluenced.bases = this.InfluencedBase;
          if (category == 'Faucet') {
            this.pptDownloadObjectForInfluenced.serieswisescore.push({ 'seriesname': 'Plumber / contractor', 'data': dataTable.rows.get('Plumber / contractor') });
            this.InfluencedDataArray.push({
              'sereiseName': 'Plumber / contractor', 'sereiseData': dataTable.rows.get('Plumber / contractor'),
              'compareScore': PlumberCompare, 'compareBase': compareBase, 'isSignificance': dataTable.significance.get('Plumber / contractor')
            });
            this.pptDownloadObjectForInfluenced.serieswisescore.push({ 'sereiseName': 'Plumber / contractor', 'sereiseData': dataTable.rows.get('Plumber / contractor') });
          }
          else {
            this.InfluencedDataArray.push({
              'sereiseName': 'Plumber / contractor', 'sereiseData': dataTable.rows.get('Plumber/contractor'),
              'compareScore': PlumberCompare, 'compareBase': compareBase, 'isSignificance': dataTable.significance.get('Plumber/contractor')
            });
            this.pptDownloadObjectForInfluenced.serieswisescore.push({ 'seriesname': 'Plumber / contractor', 'data': dataTable.rows.get('Plumber/contractor') });
          }
          this.pptDownloadObjectForInfluenced.serieswisescore.push({ 'sereiseName': 'Self', 'sereiseData': dataTable.rows.get('Yourself') });
          this.pptDownloadObjectForInfluenced.serieswisescore.push({ 'sereiseName': 'Spouse', 'sereiseData': dataTable.rows.get('Spouse') });
          this.pptDownloadObjectForInfluenced.serieswisescore.push({ 'sereiseName': 'Other family member or friend', 'sereiseData': dataTable.rows.get('Other family member or friend') });
          setTimeout(() => {
            this.showLoader = false;
          }, 3000);
        });
      }

      if (this.selectedTab == "Installed") {
        this.showLoader = true;
        this.installedDataChart = disposition.getWhoInstalled(category, brandcodes);
        this.installedDataChart.addTableDataReady((output, dataTable) => {
          this.InstalledDataArray = [];
          this.InstalledBase = [];
          this.pptDownloadObjectForInstalled.serieswisescore = [];
          this.InstalledBase = dataTable.bases.get('Base');

          let compareBase = [];
          let yourselfCompare = [];
          let spouseCompare = [];
          let familyCompare = [];
          let PlumberCompare = [];

          if (dataTable.comparisonBases.get("Base") != undefined) {
            compareBase = dataTable.comparisonBases.get("Base");
            yourselfCompare = dataTable.previousScoreRows.get("Yourself");
            spouseCompare = dataTable.previousScoreRows.get("Spouse");
            familyCompare = dataTable.previousScoreRows.get("Other family member or friend");
            PlumberCompare = dataTable.previousScoreRows.get("Plumber/contractor");

            // yourselfCompare = this.calculateCompareScore(dataTable.comparisonRows.get("Yourself"), dataTable.rows.get('Yourself'));
            // spouseCompare = this.calculateCompareScore(dataTable.comparisonRows.get("Spouse"), dataTable.rows.get('Spouse'));
            // familyCompare = this.calculateCompareScore(dataTable.comparisonRows.get("Other family member or friend"), dataTable.rows.get('Other family member or friend'));
            // PlumberCompare = this.calculateCompareScore(dataTable.comparisonRows.get("Plumber/contractor"), dataTable.rows.get('Plumber/contractor'));
          }

          this.InstalledDataArray.push({
            'sereiseName': 'Self', 'sereiseData': dataTable.rows.get('Yourself'), 'compareScore': yourselfCompare,
            'compareBase': compareBase, 'isSignificance': dataTable.significance.get('Yourself')
          });
          this.InstalledDataArray.push({
            'sereiseName': 'Spouse', 'sereiseData': dataTable.rows.get('Spouse'), 'compareScore': spouseCompare,
            'compareBase': compareBase, 'isSignificance': dataTable.significance.get('Spouse')
          });
          this.InstalledDataArray.push({
            'sereiseName': 'Other family member or friend', 'sereiseData': dataTable.rows.get('Other family member or friend'),
            'compareScore': familyCompare, 'compareBase': compareBase, 'isSignificance': dataTable.significance.get('Other family member or friend')
          });
          this.InstalledDataArray.push({
            'sereiseName': 'Plumber/contractor', 'sereiseData': dataTable.rows.get('Plumber/contractor'),
            'compareScore': PlumberCompare, 'compareBase': compareBase, 'isSignificance': dataTable.significance.get('Plumber/contractor')
          });

          this.pptDownloadObjectForInstalled.bases = this.InstalledBase;
          this.pptDownloadObjectForInstalled.serieswisescore.push({ 'seriesname': 'Self', 'data': dataTable.rows.get('Yourself') });
          this.pptDownloadObjectForInstalled.serieswisescore.push({ 'seriesname': 'Spouse', 'data': dataTable.rows.get('Spouse') });
          this.pptDownloadObjectForInstalled.serieswisescore.push({ 'seriesname': 'Other family member or friend', 'data': dataTable.rows.get('Other family member or friend') });
          this.pptDownloadObjectForInstalled.serieswisescore.push({ 'seriesname': 'Plumber/contractor', 'data': dataTable.rows.get('Plumber/contractor') });
          this.showLoader = false;
        });
      }

      if (this.selectedTab == "Purchase") {
        this.showLoader = true;
        this.isPurchaseAverageLoader = false;
        this.isPurchaseMedianLoader = false;
        this.isPurchaseDataLoader = false;
        this.purchasePriceChart = disposition.getPurchasePrice(category, brandcodes);
        this.purchaseAverageChart = disposition.getPurchasePriceAverage(category, brandcodes);
        this.purchaseMedianChart = disposition.getPurchasePriceMedian(category, brandcodes);

        this.purchaseAverageChart.addTableDataReady((output, dataTable) => {
          this.purchaseAverageArray = [];
          this.isPurchaseAverageLoader = true;
          this.pptDownloadObjectForPurchased.average = [];
          var avg = [];
          dataTable.rows.forEach((element, index) => {
            this.purchaseAverageArray = element;
            avg.push(element);
          });
          this.pptDownloadObjectForPurchased.average = avg;
          this.hidePurchaseLoader(this.isPurchaseAverageLoader, this.isPurchaseMedianLoader, this.isPurchaseDataLoader);
        });
        
        this.purchaseAverageChart.addTableDataReady((output, dataTable) => {
          this.purchaseAverageArray = [];
          this.pptDownloadObjectForPurchased.average = [];
          var avg = [];
          dataTable.rows.forEach((element, index) => {
            this.purchaseAverageArray = element;
            avg.push(element);
          });
          this.pptDownloadObjectForPurchased.average = avg[0];
        });

        this.purchaseMedianChart.addTableDataReady((output, dataTable) => {
          this.purchaseMedianArray = [];
          this.isPurchaseMedianLoader = true;
          this.pptDownloadObjectForPurchased.median = [];
          var med = [];
          dataTable.rows.forEach((element, index) => {
            this.purchaseMedianArray = element;
            med.push(element);
          });
          this.pptDownloadObjectForPurchased.median = med;
          this.hidePurchaseLoader(this.isPurchaseAverageLoader, this.isPurchaseMedianLoader, this.isPurchaseDataLoader);
        });

        this.purchaseMedianChart.addTableDataReady((output, dataTable) => {
          this.purchaseMedianArray = [];
          this.pptDownloadObjectForPurchased.median = [];
          var med = [];
          dataTable.rows.forEach((element, index) => {
            this.purchaseMedianArray = element;
            med.push(element);
          });
          this.pptDownloadObjectForPurchased.median = med[0];
        });

        this.purchasePriceChart.addTableDataReady((output, dataTable) => {
          this.isPurchaseDataLoader = true;
          this.purchasePriceArray = [];
          this.PurchasePriceBase = [];
          this.pptDownloadObjectForPurchased.serieswisescore = [];
          this.pptDownloadObjectForPurchased.bases = [];
          this.PurchasePriceBase = dataTable.bases.get('Base');
          this.pptDownloadObjectForPurchased.bases = dataTable.bases.get('Base');
          dataTable.rows.forEach((element, index) => {
            const priceObject = {
              'sereiseName': '',
              'seriesdata': [],
              'compareScore': [],
              'compareBase': [],
              'isSignificance': []
            }
            let compareScore = [];
            let compareBase = [];

            if (dataTable.comparisonBases.get("Base") != undefined) {
              compareBase = dataTable.comparisonBases.get("Base");
              // dataTable.comparisonRows.forEach((compareDiff, comparename) => {
              //   if (comparename === index) {
              //     compareScore = this.calculateCompareScore(compareDiff, element);
              //   }
              // });
              dataTable.previousScoreRows.forEach((compareDiff, comparename) => {
                if (comparename === index) {
                  compareScore = compareDiff;
                }
              });
            }
            const priceObjectforppt = {
              'seriesname': '',
              'data': []
            }
            priceObject.sereiseName = index;
            priceObject.seriesdata = element;
            priceObject.compareScore = compareScore;
            priceObject.compareBase = compareBase;
            priceObject.isSignificance = dataTable.significance.get(priceObject.sereiseName);
            priceObjectforppt.data = element;

            this.purchasePriceArray.push(priceObject);
            priceObjectforppt.seriesname = index;
            this.pptDownloadObjectForPurchased.serieswisescore.push(priceObjectforppt);
          });
          this.showLoader = false;
          this.hidePurchaseLoader(this.isPurchaseAverageLoader, this.isPurchaseMedianLoader, this.isPurchaseDataLoader);
        });
      }

      if (this.selectedTab == "Bought") {
        this.showLoader = true;
        this.isnetInstoreBought = false;
        this.isnetInstoreShopped = false;
        this.isnetOnlineBought = false;
        this.isnetOnlineShopped = false;
        this.isTotalBoughtLoader = false;
        this.isTotalShoppedLoader = false;
        this.isInstoreBoughtLoader = false;
        this.isInstoreShoppedLoader = false;
        this.isOnlineBoughtLoader = false;
        this.isOnlioneShoppedLoader = false;

        this.whereBoughtChartTotal = disposition.getWhereBoughtTotal(category, brandcodes);
        this.whereShoppedChartTotal = disposition.getWhereShoppedTotal(category, brandcodes);
        this.whereBoughtChartInstoreOnline = disposition.getWhereBoughtInstoreOnline(category, brandcodes);
        this.whereShoppedChartInstoreOnline = disposition.getWhereShoppedInstoreOnline(category, brandcodes);
        // this.whereBoughtChartOnline = disposition.getWhereBoughtOnline(category, brandcodes);
        // this.whereShoppedChartOnline = disposition.getWhereShoppedOnline(category, brandcodes);

        this.totalBoughtChartInstore = disposition.getTotalBoughtInstore(category, brandcodes);
        this.totalShoppedChartInstore = disposition.getTotalShoppedInstore(category, brandcodes);
        this.totalBoughtChartOnline = disposition.getTotalBoughtOnline(category, brandcodes);
        this.totalShoppedChartOnline = disposition.getTotalShoppedOnline(category, brandcodes);

        this.totalBoughtChartInstore.addTableDataReady((output, dataTable) => {
          this.InstoreTotalBought = [];
          this.netIBoughtCompareScore = [];
          let compare = [];
          this.netIBoughtSig = [];
          this.isnetInstoreBought = true;
          this.TotalInstoreBoughtBase = dataTable.bases.get('Base');
          dataTable.rows.forEach((element, index) => {
            this.InstoreTotalBought = element;
          });
          if (dataTable.comparisonBases.get("Base") != undefined) {
            this.netIBoughtCompareBase = dataTable.comparisonBases.get("Base");
            if (dataTable.previousScoreRows.get("Total In Store(net)") != undefined) {
              compare = dataTable.previousScoreRows.get("Total In Store(net)");
            }
            if (this.InstoreTotalBought.length == compare.length) {
              this.netIBoughtCompareScore = this.calculateCompareScore(compare, this.InstoreTotalBought)
            }
          }
          this.netIBoughtSig = dataTable.significance.get("Total In Store(net)");
          this.hideBoughtShoppedLoader(this.isnetInstoreBought, this.isnetInstoreShopped, this.isnetOnlineBought, this.isnetOnlineShopped,
            this.isTotalBoughtLoader, this.isTotalShoppedLoader, this.isInstoreBoughtLoader,
            this.isInstoreShoppedLoader);
            //, this.isOnlineBoughtLoader, this.isOnlioneShoppedLoader
        });

        this.totalShoppedChartInstore.addTableDataReady((output, dataTable) => {
          this.InstoreTotalShopped = [];
          this.netIShoppedCompareScore = [];
          let compare = [];
          this.netIShoppedSig = [];
          this.isnetInstoreShopped = true;
          this.TotalInstoreShoppedBase = dataTable.bases.get('Base');
          dataTable.rows.forEach((element, index) => {
            this.InstoreTotalShopped = element;
          });
          if (dataTable.comparisonBases.get("Base") != undefined) {
            this.netIShoppedCompareBase = dataTable.comparisonBases.get("Base");
            if (dataTable.previousScoreRows.get("Total In Store(net)") != undefined) {
              compare = dataTable.previousScoreRows.get("Total In Store(net)");
            }
            if (this.InstoreTotalShopped.length == compare.length) {
              this.netIShoppedCompareScore = this.calculateCompareScore(compare, this.InstoreTotalShopped)
            }
          }
          this.netIShoppedSig = dataTable.significance.get("Total In Store(net)");
          this.hideBoughtShoppedLoader(this.isnetInstoreBought, this.isnetInstoreShopped, this.isnetOnlineBought, this.isnetOnlineShopped,
            this.isTotalBoughtLoader, this.isTotalShoppedLoader, this.isInstoreBoughtLoader,
            this.isInstoreShoppedLoader);
            //, this.isOnlineBoughtLoader, this.isOnlioneShoppedLoader
        });

        this.totalBoughtChartOnline.addTableDataReady((output, dataTable) => {
          this.OnlineTotalBought = [];
          this.netOBoughtCompareScore = [];
          let compare = [];
          this.netOBoughtSig = [];
          this.isnetOnlineBought = true;
          this.TotalOnlineBoughtBase = dataTable.bases.get('Base');
          dataTable.rows.forEach((element, index) => {
            this.OnlineTotalBought = element;
          });
          if (dataTable.comparisonBases.get("Base") != undefined) {
            this.netOBoughtCompareBase = dataTable.comparisonBases.get("Base");
            if (dataTable.previousScoreRows.get("Total Online(net)") != undefined) {
              compare = dataTable.previousScoreRows.get("Total Online(net)");
            }
            if (this.OnlineTotalBought.length == compare.length) {
              this.netOBoughtCompareScore = this.calculateCompareScore(compare, this.OnlineTotalBought)
            }
          }
          this.netOBoughtSig = dataTable.significance.get("Total Online(net)");
          this.hideBoughtShoppedLoader(this.isnetInstoreBought, this.isnetInstoreShopped, this.isnetOnlineBought, this.isnetOnlineShopped,
            this.isTotalBoughtLoader, this.isTotalShoppedLoader, this.isInstoreBoughtLoader,
            this.isInstoreShoppedLoader);
            //, this.isOnlineBoughtLoader, this.isOnlioneShoppedLoader
        });

        this.totalShoppedChartOnline.addTableDataReady((output, dataTable) => {
          this.OnlineTotalShopped = [];
          this.netOShoppedCompareScore = [];
          let compare = [];
          this.netOShoppedSig = [];
          this.isnetOnlineShopped = true;
          this.TotalOnlineShoppedBase = dataTable.bases.get('Base');
          dataTable.rows.forEach((element, index) => {
            this.OnlineTotalShopped = element;
          });
          if (dataTable.comparisonBases.get("Base") != undefined) {
            this.netOShoppedCompareBase = dataTable.comparisonBases.get("Base");
            if (dataTable.previousScoreRows.get("Total Online(net)") != undefined) {
              compare = dataTable.previousScoreRows.get("Total Online(net)");
            }
            if (this.OnlineTotalShopped.length == compare.length) {
              this.netOShoppedCompareScore = this.calculateCompareScore(compare, this.OnlineTotalShopped)
            }
          }
          this.netOShoppedSig = dataTable.significance.get("Total Online(net)");
          this.hideBoughtShoppedLoader(this.isnetInstoreBought, this.isnetInstoreShopped, this.isnetOnlineBought, this.isnetOnlineShopped,
            this.isTotalBoughtLoader, this.isTotalShoppedLoader, this.isInstoreBoughtLoader,
            this.isInstoreShoppedLoader);
            //, this.isOnlineBoughtLoader, this.isOnlioneShoppedLoader
        });

        this.whereBoughtChartTotal.addTableDataReady((output, dataTable) => {
          this.TotalBought = [];
          this.totalBoughtCompareScore = [];
          this.totalBoughtCompareBase = [];
          let compare = [];
          this.isTotalBoughtLoader = true;
          this.TotalBoughtBase = dataTable.bases.get('Base');
          if (this.TotalBoughtBase != undefined && this.TotalBoughtBase.length > 0) {
            dataTable.rows.forEach((element, index) => {
              let total = {
                'sereiesNameTotal': index,
                'sereiseDataTotal': element,
                'totalBoughtBase': this.TotalBoughtBase,
                'compareScore': [],
                'compareBase': [],
                'isSignificance': dataTable.significance.get(index)
              }
              if (dataTable.comparisonBases.get("Base") != undefined) {
                total.compareBase = dataTable.comparisonBases.get("Base");
                dataTable.previousScoreRows.forEach((value, valindex) => {
                  if (valindex === index) {
                    if (value != undefined) {
                      // total.compareScore = this.calculateCompareScore(value, element);
                      total.compareScore = value;
                    }
                  }
                });
              }
              this.TotalBought.push(total);
            });
          }
          this.hideBoughtShoppedLoader(this.isnetInstoreBought, this.isnetInstoreShopped, this.isnetOnlineBought, this.isnetOnlineShopped,
            this.isTotalBoughtLoader, this.isTotalShoppedLoader, this.isInstoreBoughtLoader,
            this.isInstoreShoppedLoader);
            //, this.isOnlineBoughtLoader, this.isOnlioneShoppedLoader
        });

        this.whereShoppedChartTotal.addTableDataReady((output, dataTable) => {
          this.TotalShopped = [];
          this.isTotalShoppedLoader = true;
          this.TotalShoppedBase = dataTable.bases.get('Base');
          if (this.TotalShoppedBase != undefined && this.TotalShoppedBase.length > 0) {
            dataTable.rows.forEach((element, index) => {
              let total = {
                'sereiesName': index,
                'score': element,
                'base': this.TotalShoppedBase,
                'compareScore': [],
                'compareBase': [],
                'isSignificance': dataTable.significance.get(index)
              }
              if (dataTable.comparisonBases.get("Base") != undefined) {
                total.compareBase = dataTable.comparisonBases.get("Base");
                dataTable.previousScoreRows.forEach((value, valindex) => {
                  if (valindex === index) {
                    if (value != undefined) {
                      //total.compareScore = this.calculateCompareScore(value, element);
                      total.compareScore = value;
                    }
                  }
                });
              }
              this.TotalShopped.push(total);
            });
          }
          this.hideBoughtShoppedLoader(this.isnetInstoreBought, this.isnetInstoreShopped, this.isnetOnlineBought, this.isnetOnlineShopped,
            this.isTotalBoughtLoader, this.isTotalShoppedLoader, this.isInstoreBoughtLoader,
            this.isInstoreShoppedLoader);
            //, this.isOnlineBoughtLoader, this.isOnlioneShoppedLoader
        });

        this.whereBoughtChartInstoreOnline.addTableDataReady((output, dataTable) => {
          this.boughtInstoreOnlineObj = [];
          this.InstoreBought = [];
          this.isInstoreBoughtLoader = true;
          this.instoreBoughtBase = dataTable.bases.get('Base');

          this.InstoreBoughtshoppedMap.set("BoughtInstore", new Map<string, {}>());
          this.OnlineBoughShoppedMap.set("BoughtOnline", new Map<string, {}>());

          output.forEach((valueObject, valIndex)=>{
            if(valueObject.SeriesCode === "1"){
              if(!this.InstoreBoughtshoppedMap.get("BoughtInstore").get(valueObject.SeriesTree.split(">")[0])){
                let obj = {
                  score: [valueObject.Score],
                  base: [valueObject.base],
                  compareScore: [valueObject.previousScore === undefined? 0 : valueObject.previousScore],
                  compareBase: [valueObject.PreviousBase === undefined? 0 : valueObject.PreviousBase],
                  isSignificance: [valueObject.SignificanceSign === undefined? undefined : valueObject.SignificanceSign]
                }
                this.InstoreBoughtshoppedMap.get("BoughtInstore").set(valueObject.SeriesTree.split(">")[0], obj);
              }
              else{
                this.InstoreBoughtshoppedMap.get("BoughtInstore").get(valueObject.SeriesTree.split(">")[0])['score'].push(valueObject.Score);
                this.InstoreBoughtshoppedMap.get("BoughtInstore").get(valueObject.SeriesTree.split(">")[0])['base'].push(valueObject.base);
                this.InstoreBoughtshoppedMap.get("BoughtInstore").get(valueObject.SeriesTree.split(">")[0])['compareBase'].push(valueObject.PreviousBase === undefined? 0 : valueObject.PreviousBase);
               // if(valueObject.Difference !== undefined){
                  this.InstoreBoughtshoppedMap.get("BoughtInstore").get(valueObject.SeriesTree.split(">")[0])['compareScore'].push(Math.round(valueObject.previousScore === undefined? 0 : valueObject.previousScore));
               // }
                //if(valueObject.SignificanceSign !== undefined){
                  this.InstoreBoughtshoppedMap.get("BoughtInstore").get(valueObject.SeriesTree.split(">")[0])['isSignificance'].push(valueObject.SignificanceSign === undefined? undefined : valueObject.SignificanceSign);
                //}
              }
            }
            if(valueObject.SeriesCode === "2"){
              if(!this.OnlineBoughShoppedMap.get("BoughtOnline").get(valueObject.SeriesTree.split(">")[0])){
                let obj = {
                  score: [valueObject.Score],
                  base: [valueObject.base],
                  compareScore: [valueObject.previousScore === undefined? 0 : valueObject.previousScore],
                  compareBase: [valueObject.PreviousBase === undefined? 0 : valueObject.PreviousBase],
                  isSignificance: [valueObject.SignificanceSign === undefined? undefined : valueObject.SignificanceSign]
                }
                this.OnlineBoughShoppedMap.get("BoughtOnline").set(valueObject.SeriesTree.split(">")[0], obj);
              }
              else{
                this.OnlineBoughShoppedMap.get("BoughtOnline").get(valueObject.SeriesTree.split(">")[0])['score'].push(valueObject.Score);
                this.OnlineBoughShoppedMap.get("BoughtOnline").get(valueObject.SeriesTree.split(">")[0])['base'].push(valueObject.base);
                this.OnlineBoughShoppedMap.get("BoughtOnline").get(valueObject.SeriesTree.split(">")[0])['compareBase'].push(valueObject.PreviousBase === undefined? 0 : valueObject.PreviousBase);
                if(valueObject.Difference !== undefined){
                  this.OnlineBoughShoppedMap.get("BoughtOnline").get(valueObject.SeriesTree.split(">")[0])['compareScore'].push(Math.round(valueObject.previousScore === undefined? 0 : valueObject.previousScore));
                }
                if(valueObject.SignificanceSign !== undefined){
                  this.OnlineBoughShoppedMap.get("BoughtOnline").get(valueObject.SeriesTree.split(">")[0])['isSignificance'].push(valueObject.SignificanceSign === undefined? undefined : valueObject.SignificanceSign);
                }
              }
            }
          });

          this.createDataArrayForInstoreTable(this.InstoreBoughtshoppedMap, this.OnlineBoughShoppedMap);
          this.hideBoughtShoppedLoader(this.isnetInstoreBought, this.isnetInstoreShopped, this.isnetOnlineBought, this.isnetOnlineShopped,
            this.isTotalBoughtLoader, this.isTotalShoppedLoader, this.isInstoreBoughtLoader,
            this.isInstoreShoppedLoader);
            //, this.isOnlineBoughtLoader, this.isOnlioneShoppedLoader
        });

        this.whereShoppedChartInstoreOnline.addTableDataReady((output, dataTable) => {
          this.InstoreShopped = [];
          this.isInstoreShoppedLoader = true;
          this.instoreShoppedBase = dataTable.bases.get('Base');

          this.InstoreBoughtshoppedMap.set("ShoppedInstore", new Map<string, {}>());
          this.OnlineBoughShoppedMap.set("ShoppedOnline", new Map<string, {}>());
          
          // let shoppedInstoreMap : Map<string, Map<string, {}>> = new Map<string, Map<string, {}>>();
          // let shoppedMapOnline : Map<string, Map<string, {}>> = new Map<string, Map<string, {}>>();
          output.forEach((valueObject, valIndex)=>{
            if(valueObject.SeriesCode === "1"){
              if(!this.InstoreBoughtshoppedMap.get("ShoppedInstore").get(valueObject.SeriesTree.split(">")[0])){
                let obj = {
                  score: [valueObject.Score],
                  base: [valueObject.base],
                  compareScore: [valueObject.previousScore === undefined? 0 : valueObject.previousScore],
                  compareBase: [valueObject.PreviousBase === undefined? 0 : valueObject.PreviousBase],
                  isSignificance: [valueObject.SignificanceSign === undefined? undefined : valueObject.SignificanceSign] 
                }
                this.InstoreBoughtshoppedMap.get("ShoppedInstore").set(valueObject.SeriesTree.split(">")[0], obj);
              }
              else{
                this.InstoreBoughtshoppedMap.get("ShoppedInstore").get(valueObject.SeriesTree.split(">")[0])['score'].push(valueObject.Score);
                this.InstoreBoughtshoppedMap.get("ShoppedInstore").get(valueObject.SeriesTree.split(">")[0])['base'].push(valueObject.base);
                this.InstoreBoughtshoppedMap.get("ShoppedInstore").get(valueObject.SeriesTree.split(">")[0])['compareBase'].push(valueObject.PreviousBase === undefined? 0 : valueObject.PreviousBase);
                // if(valueObject.Difference !== undefined){
                  this.InstoreBoughtshoppedMap.get("ShoppedInstore").get(valueObject.SeriesTree.split(">")[0])['compareScore'].push(Math.round(valueObject.previousScore === undefined? 0 : valueObject.previousScore));
                // }
                // if(valueObject.SignificanceSign !== undefined){
                  this.InstoreBoughtshoppedMap.get("ShoppedInstore").get(valueObject.SeriesTree.split(">")[0])['isSignificance'].push(valueObject.SignificanceSign === undefined? undefined : valueObject.SignificanceSign);
                // }
              }
            }
            if(valueObject.SeriesCode === "2"){
              if(!this.OnlineBoughShoppedMap.get("ShoppedOnline").get(valueObject.SeriesTree.split(">")[0])){
                let obj = {
                  score: [valueObject.Score],
                  base: [valueObject.base],
                  compareScore: [valueObject.previousScore === undefined? 0 : valueObject.previousScore],
                  compareBase: [valueObject.PreviousBase === undefined? 0 : valueObject.PreviousBase],
                  isSignificance: [valueObject.SignificanceSign === undefined? undefined : valueObject.SignificanceSign] 
                }
                this.OnlineBoughShoppedMap.get("ShoppedOnline").set(valueObject.SeriesTree.split(">")[0], obj);
              }
              else{
                this.OnlineBoughShoppedMap.get("ShoppedOnline").get(valueObject.SeriesTree.split(">")[0])['score'].push(valueObject.Score);
                this.OnlineBoughShoppedMap.get("ShoppedOnline").get(valueObject.SeriesTree.split(">")[0])['base'].push(valueObject.base);
                this.OnlineBoughShoppedMap.get("ShoppedOnline").get(valueObject.SeriesTree.split(">")[0])['compareBase'].push(valueObject.PreviousBase === undefined? 0 : valueObject.PreviousBase);
                //if(valueObject.Difference !== undefined){
                  this.OnlineBoughShoppedMap.get("ShoppedOnline").get(valueObject.SeriesTree.split(">")[0])['compareScore'].push(Math.round(valueObject.previousScore === undefined? 0 : valueObject.previousScore));
                //}
                //if(valueObject.SignificanceSign !== undefined){
                  this.OnlineBoughShoppedMap.get("ShoppedOnline").get(valueObject.SeriesTree.split(">")[0])['isSignificance'].push(valueObject.SignificanceSign === undefined? undefined : valueObject.SignificanceSign);
                //}
              }
            }
          });
          this.createDataArrayForInstoreTable(this.InstoreBoughtshoppedMap, this.OnlineBoughShoppedMap);
          this.hideBoughtShoppedLoader(this.isnetInstoreBought, this.isnetInstoreShopped, this.isnetOnlineBought, this.isnetOnlineShopped,
            this.isTotalBoughtLoader, this.isTotalShoppedLoader, this.isInstoreBoughtLoader,
            this.isInstoreShoppedLoader);
            //, this.isOnlineBoughtLoader, this.isOnlioneShoppedLoader
        });
      }

      
      if (this.selectedTab == "Reasons") {
        this.showLoader = true;
        this.reasonForCategoryChoice = disposition.getReasonCategoryChoice(category, brandcodes);
        this.reasonForBrandAverageChart = disposition.getReasonCategoryChoiceTotalAverage(category, brandcodes, this.CategoryBrand[category]);
        this.reasonForBrandAverageChart.addTableDataReady((output, dataTable) => {
          dataTable.rows.forEach((element, index) => {
            const OverallMarketAverage = this.calculateReasonChoiceAverage(element);
            const obj = {
              'name': index,
              'score': OverallMarketAverage
            }
            this.totalBrandsAverageForChoice.push(obj);
          });
          this.calculateReasonBrandChoice(this.totalBrandsAverageForChoice, this.dataTableOfTable);
        });

        this.reasonForCategoryChoice.addTableDataReady((output, dataTable) => {
          this.reasonfForBrandChoiceArray = [];
          this.ReasonForChoiceBase = [];
          const dataArray = [];
          let counter = 0;
          this.dataTableOfTable = [];
          this.dataTableOfTable = dataTable;
          this.calculateReasonBrandChoice(this.totalBrandsAverageForChoice, this.dataTableOfTable);
        });
      }
    }
  }

  hideBoughtShoppedLoader(netInstoreBought, netInstoreShopped, netOnlineBought, netOnlineShopped, totalBought, totalShopped, instoreBought,
    instoreShopped) {
      //, onlineBought, onlineShopped
    if (netInstoreBought == true && netInstoreShopped == true && netOnlineBought == true && netOnlineShopped == true && totalBought == true &&
      totalShopped == true && instoreBought == true && instoreShopped == true) {
        // && onlineBought == true && onlineShopped
      this.showLoader = false;
    }
  }

  downloadPptWhoInfluencedTrendsPptDataTrends() {
    this.showLoader = true;
    const objnew = JSON.stringify(this.whoInfluencedTrendsPptData[0]);
    this.pptexport.postPPTForTrends(objnew).subscribe((data) => {
      const blob = new Blob([data], { type: 'application/octet-stream' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      document.body.appendChild(a);
      a.href = url;
      a.download = 'WhoInfluenced_Trends_PPT.zip';
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
      this.showLoader = false;
    }, error => {
      console.log(error);
      this.showLoader = false;
    });
  }

  downloadPptWhoInstalledTrendsPptDataTrendsPptDataTrends() {
    this.showLoader = true;
    const objnew = JSON.stringify(this.whoInstalledTrendsPptData[0]);
    this.pptexport.postPPTForTrends(objnew).subscribe((data) => {
      const blob = new Blob([data], { type: 'application/octet-stream' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      document.body.appendChild(a);
      a.href = url;
      a.download = 'WhoInstalled_Trends_PPT.zip';
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
      this.showLoader = false;
    }, error => {
      console.log(error);
      this.showLoader = false;
    });
  }

  downloadPptPurchasePriceTrendsPptDataTrends() {
    this.showLoader = true;
    const objnew = JSON.stringify(this.purchasePriceTrendsPptData[0]);
    this.pptexport.postPPTForTrends(objnew).subscribe((data) => {
      const blob = new Blob([data], { type: 'application/octet-stream' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      document.body.appendChild(a);
      a.href = url;
      a.download = 'PurchasePrice_Trends_PPT.zip';
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
      this.showLoader = false;
    }, error => {
      console.log(error);
      this.showLoader = false;
    });
  }

  downloadPptReasonBrandChoiceTrendsPptDataTrends() {
    this.showLoader = true;
    const objnew = JSON.stringify(this.reasonBrandChoiceTrendsPptData[0]);
    this.pptexport.postPPTForTrends(objnew).subscribe((data) => {
      const blob = new Blob([data], { type: 'application/octet-stream' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      document.body.appendChild(a);
      a.href = url;
      a.download = 'ReasonBrandChoice_Trends_PPT.zip';
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
      this.showLoader = false;
    }, error => {
      console.log(error);
      this.showLoader = false;
    });
  }

  updateDataTrends() {
    this.whoInfluencedTrendsPptData = [];
    this.whoInstalledTrendsPptData = [];
    this.purchasePriceTrendsPptData = [];
    this.reasonBrandChoiceTrendsPptData = [];
    const dispositionTrends: DispositionTrends = new DispositionTrends();
    if (this.period === 'Quarterly' || this.periodSeclected === 'tab1Trends') {
      this.chartMap(this.period, dispositionTrends);
    } else if (this.period === 'Annually' || this.periodSeclected === 'tab3Trends') {
      this.period = 'Yearly';
      this.chartMap(this.period, dispositionTrends);
    } else if (this.period === 'SemiAnnually' || this.periodSeclected === 'tab2Trends') {
      this.period = 'Semiannual';
      this.chartMap(this.period, dispositionTrends);
    }
    this.whoInfluencedTrendsPptData.push(dispositionTrends.whoInfluencedTrendsPptData);
    this.whoInstalledTrendsPptData.push(dispositionTrends.whoInstalledTrendsPptData);
    this.purchasePriceTrendsPptData.push(dispositionTrends.purchasePriceTrendsPptData);
    this.reasonBrandChoiceTrendsPptData.push(dispositionTrends.reasonBrandChoiceTrendsPptData);
  }

  chartMap(period, ref) {
    this.getfilterTrends();
    this.whoInfluencedtrendsDelta = ref.getWhoInfluenced(period, 'Delta', this.Category, '1',this.filter);
    this.whoInfluencedtrendsMoen = ref.getWhoInfluenced(period, 'Moen', this.Category, '4',this.filter);
    this.whoInfluencedtrendsKohler = ref.getWhoInfluenced(period, 'Kohler', this.Category, '3',this.filter);
    this.whoInfluencedtrendsPeerless = ref.getWhoInfluenced(period, 'Peerless', this.Category, '5',this.filter);
    this.whoInfluencedtrendsAS = ref.getWhoInfluenced(period, 'American Standard', this.Category, '2',this.filter);
    this.whoInfluencedtrendsPfister = ref.getWhoInfluenced(period, 'Pfister', this.Category, '6',this.filter);
    this.whoInfluencedtrendsAquaS = ref.getWhoInfluenced(period, 'Aqua Source', this.Category, '7',this.filter);
    this.whoInfluencedtrendsBrizo = ref.getWhoInfluenced(period, 'Brizo', this.Category, '9',this.filter);
    this.whoInfluencedtrendsGlacier = ref.getWhoInfluenced(period, 'Glacier Bay', this.Category, '8',this.filter);
    this.whoInfluencedtrendsGrohe = ref.getWhoInfluenced(period, 'Grohe', this.Category, '10',this.filter);
    this.whoInfluencedtrendsHansgrohe = ref.getWhoInfluenced(period, 'Hansgrohe', this.Category, '11',this.filter);
    this.whoInfluencedtrendsToto = ref.getWhoInfluenced(period, 'Toto', this.Category, '19',this.filter);

    this.whoInstalledtrendsDelta = ref.getWhoInstalled(period, 'Delta', this.Category, '1',this.filter);
    this.whoInstalledtrendsMoen = ref.getWhoInstalled(period, 'Moen', this.Category, '4',this.filter);
    this.whoInstalledtrendsKohler = ref.getWhoInstalled(period, 'Kohler', this.Category, '3',this.filter);
    this.whoInstalledtrendsPeerless = ref.getWhoInstalled(period, 'Peerless', this.Category, '5',this.filter);
    this.whoInstalledtrendsAS = ref.getWhoInstalled(period, 'American Standard', this.Category, '2',this.filter);
    this.whoInstalledtrendsPfister = ref.getWhoInstalled(period, 'Pfister', this.Category, '6',this.filter);
    this.whoInstalledtrendsAquaS = ref.getWhoInstalled(period, 'Aqua Source', this.Category, '7',this.filter);
    this.whoInstalledtrendsBrizo = ref.getWhoInstalled(period, 'Brizo', this.Category, '9',this.filter);
    this.whoInstalledtrendsGlacier = ref.getWhoInstalled(period, 'Glacier Bay', this.Category, '8',this.filter);
    this.whoInstalledtrendsGrohe = ref.getWhoInstalled(period, 'Grohe', this.Category, '10',this.filter);
    this.whoInstalledtrendsHansgrohe = ref.getWhoInstalled(period, 'Hansgrohe', this.Category, '11',this.filter);
    this.whoInstalledtrendsToto = ref.getWhoInstalled(period, 'Toto', this.Category, '19',this.filter);

    this.getPurchasePricetrendsDelta = ref.getPurchasePrice(period, 'Delta', this.Category, '1',this.filter);
    this.getPurchasePricetrendsMoen = ref.getPurchasePrice(period, 'Moen', this.Category, '4',this.filter);
    this.getPurchasePricetrendsKohler = ref.getPurchasePrice(period, 'Kohler', this.Category, '3',this.filter);
    this.getPurchasePricetrendsPeerless = ref.getPurchasePrice(period, 'Peerless', this.Category, '5',this.filter);
    this.getPurchasePricetrendsAS = ref.getPurchasePrice(period, 'American Standard', this.Category, '2',this.filter);
    this.getPurchasePricetrendsPfister = ref.getPurchasePrice(period, 'Pfister', this.Category, '6',this.filter);
    this.getPurchasePricetrendsAquaS = ref.getPurchasePrice(period, 'Aqua Source', this.Category, '7',this.filter);
    this.getPurchasePricetrendsBrizo = ref.getPurchasePrice(period, 'Brizo', this.Category, '9',this.filter);
    this.getPurchasePricetrendsGlacier = ref.getPurchasePrice(period, 'Glacier Bay', this.Category, '8',this.filter);
    this.getPurchasePricetrendsGrohe = ref.getPurchasePrice(period, 'Grohe', this.Category, '10',this.filter);
    this.getPurchasePricetrendsHansgrohe = ref.getPurchasePrice(period, 'Hansgrohe', this.Category, '11',this.filter);
    this.getPurchasePricetrendsToto = ref.getPurchasePrice(period, 'Toto', this.Category, '19',this.filter);

    this.getReasonBrandChoicetrendsDelta = ref.getReasonBrandChoice(period, 'Delta', this.Category, '1',this.filter);
    this.getReasonBrandChoicetrendsMoen = ref.getReasonBrandChoice(period, 'Moen', this.Category, '4',this.filter);
    this.getReasonBrandChoicetrendsKohler = ref.getReasonBrandChoice(period, 'Kohler', this.Category, '3',this.filter);
    this.getReasonBrandChoicetrendsPeerless = ref.getReasonBrandChoice(period, 'Peerless', this.Category, '5',this.filter);
    this.getReasonBrandChoicetrendsAS = ref.getReasonBrandChoice(period, 'American Standard', this.Category, '2',this.filter);
    this.getReasonBrandChoicetrendsPfister = ref.getReasonBrandChoice(period, 'Pfister', this.Category, '6',this.filter);
    this.getReasonBrandChoicetrendsAquaS = ref.getReasonBrandChoice(period, 'Aqua Source', this.Category, '7',this.filter);
    this.getReasonBrandChoicetrendsBrizo = ref.getReasonBrandChoice(period, 'Brizo', this.Category, '9',this.filter);
    this.getReasonBrandChoicetrendsGlacier = ref.getReasonBrandChoice(period, 'Glacier Bay', this.Category, '8',this.filter);
    this.getReasonBrandChoicetrendsGrohe = ref.getReasonBrandChoice(period, 'Grohe', this.Category, '10',this.filter);
    this.getReasonBrandChoicetrendsHansgrohe = ref.getReasonBrandChoice(period, 'Hansgrohe', this.Category, '11',this.filter);
    this.getReasonBrandChoicetrendsToto = ref.getReasonBrandChoice(period, 'Toto', this.Category, '19',this.filter);
  }

  toggleChart(tab) {
    this.hideFilterForTrends = false;
    this.hideFilterTrends.sendBooleanFlag(this.hideFilterForTrends);
    this.selectedTab1 = tab;
    this.showChart = false;
    this.showTrends = false;
  }

  toggleTrends(tab) {
    this.selectedTab1 = tab;
    this.hideFilterForTrends = true;
    this.hideFilterTrends.sendBooleanFlag(this.hideFilterForTrends);
    this.showTrends = true;
    this.showChart = true;
    if (this.selectedTab1 === 'trendsTabs') {
      if (this.globalCounterForTrends === true) {
        this.showLoader = true;
      } else {
        this.isShownInfluenced = true;
        this.showLoader = true;
      }
      this.updateDataTrends();
      setTimeout(() => {
        this.onDataUpdate.next();
      });
      if (this.globalCounterForTrends === true) {
        setTimeout(() => {
          this.showLoader = false;
        }, 7000);
      } else {
        setTimeout(() => {
          this.showLoader = false;
        }, 7000);
      }
    }
  }

  changeTimePeriod(period, periodSeclected) {
    this.period = period;
    this.periodSeclected = periodSeclected;
    if (this.selectedTab1 === 'trendsTabs') {
      this.showLoader = true;
      this.updateDataTrends();
      setTimeout(() => {
        this.onDataUpdate.next();
      });
      setTimeout(() => {
        this.showLoader = false;
      }, 7000);
    }
  }

  toggleShowInfluenced() {
    this.isShownInfluenced = !this.isShownInfluenced;
    this.isShownInstalled = false;
    this.isShownPurchasePrice = false;
    this.isShownBrandChoice = false;
    this.globalCounterForTrends = true;
    this.toggleTrends(this.selectedTab1);
  }

  toggleShowInstalled() {
    this.isShownInstalled = !this.isShownInstalled;
    this.isShownInfluenced = false;
    this.isShownPurchasePrice = false;
    this.isShownBrandChoice = false;
    this.globalCounterForTrends = true;
    this.toggleTrends(this.selectedTab1);
  }

  toggleShowPurchasePrice() {
    this.isShownPurchasePrice = !this.isShownPurchasePrice;
    this.isShownInstalled = false;
    this.isShownInfluenced = false;
    this.isShownBrandChoice = false;
    this.globalCounterForTrends = true;
    this.toggleTrends(this.selectedTab1);
  }

  toggleShowBrandChoice() {
    this.isShownBrandChoice = !this.isShownBrandChoice;
    this.isShownInstalled = false;
    this.isShownPurchasePrice = false;
    this.isShownInfluenced = false;
    this.globalCounterForTrends = true;
    this.toggleTrends(this.selectedTab1);
  }
  getfilterTrends() {
    this.filter = "";
    let filter = JSON.parse(localStorage.getItem('filterappTime'));
    let filterSide = JSON.parse(localStorage.getItem('filterapp'));
    

    if (filterSide != null) {
      filterSide.forEach((element, i) => {
        if (i == 0) {
         // this.filter = this.filter + ' Side Filter(s) :';
          this.filter = this.filter + " " + element;
        }
        else {
          this.filter = this.filter + "| " + element;
        }
      });
    };
  }

  changeTable(tabName, tab) {
    this.showLoader = true;
    this.selectedTab = tabName;
    this.viewMode = tab;
    this.updateData(this.Category);
  }
  private setTimePeriodChips(variable, choices) {
    if (this.timePeriodChips.has(variable) && choices.length === 0) {
      this.timePeriodChips.delete(variable);
    } else {
      this.timePeriodChips.set(variable, [...choices]);
    }
    for (var i = 0; i < this.timePeriodChips.size; i++) {
      if (variable != "Allbrands") {
        this.pptDownloadObjectForInfluenced.filter = this.pptDownloadObjectForInfluenced.filter + " " + variable + " " + choices[0].text;
        this.pptDownloadObjectForInstalled.filter = this.pptDownloadObjectForInstalled.filter + " " + variable + " " + choices[0].text;
        this.pptDownloadObjectForPurchased.filter = this.pptDownloadObjectForPurchased.filter + " " + variable + " " + choices[0].text;
        this.pptDownloadObjectForBrand.filter = this.pptDownloadObjectForBrand.filter + " " + variable + " " + choices[0].text;
        this.pptDownloadObjectForBought.filter = this.pptDownloadObjectForBought.filter + " " + variable + " " + choices[0].text;
      }
    }
  }
  colorIndexing(reasonObject) {
    let colorCode: String;
    reasonObject.forEach((val, i) => {
      const average = reasonObject[i].average;
      if(isNaN(average)) {
        reasonObject[i].average = 'NA';
      } else if(average.toString() === 'NaN') {
        reasonObject[i].average = 'NA';
      } else {
        reasonObject[i].average = Math.round(average);
      }
      // reasonObject[i].average = Math.round(average);
      val.seriesdata.forEach((value) => {
        if(!isNaN(value) && value !== "NaN"){
          const colorValue = value;
          const colorIndexValue = Math.round(colorValue / average * 100);
          if (colorIndexValue >= 120) {
            colorCode = '#92D050';
          } else if (colorIndexValue <= 119 && colorIndexValue >= 110) {
            colorCode = '#E5F995';
          } else if (colorIndexValue <= 109 && colorIndexValue >= 91) {
            colorCode = '#fff';
          } else if (colorIndexValue <= 90 && colorIndexValue >= 81) {
            colorCode = '#FFCCCE';
          } else {
            colorCode = '#FF656D';
          }
          reasonObject[i].seriesColor.push(colorCode);
        }
        else{
          reasonObject[i].seriesColor.push("#fff");
        }
      });
    })
    return reasonObject;
  }

  downloadExcelFile() {
    if (this.selectedTab === 'Influenced') {
      this.downloadInfluencedInstallData('Who Influenced-'+this.Category, this.InfluencedDataArray, this.InfluencedBase);
    }
    else if (this.selectedTab === 'Installed') {
      this.downloadInfluencedInstallData('Who Installed-'+this.Category, this.InstalledDataArray, this.InstalledBase);
    }
    else if (this.selectedTab === 'Purchase') {
      this.downloadPurchasePriceData('Purchase Price-'+this.Category, this.purchasePriceArray, this.purchaseAverageArray, this.purchaseMedianArray, this.PurchasePriceBase)
    }
    else if (this.selectedTab === 'Reasons') {
      this.downloadReasonForBrandChoice('Reason For Brand Choice-'+this.Category, this.reasonfForBrandChoiceArray, this.ReasonForChoiceBase);
    }
    else if (this.selectedTab === 'Bought') {
      if (this.ShowData === 'Total') {
        this.downloadBoughtShoppedData('Where Bought/Shopped Total-'+this.Category, this.InstoreTotalBought, this.InstoreTotalShopped, this.OnlineTotalBought, this.OnlineTotalShopped,
          this.TotalInstoreBoughtBase, this.TotalInstoreShoppedBase, this.TotalBought, this.TotalShopped, this.TotalBoughtBase, this.TotalShoppedBase);
      }
      if (this.ShowData === 'Instore') {
        this.downloadBoughtShoppedData('Where Bought/Shopped Instore-'+this.Category, this.InstoreTotalBought, this.InstoreTotalShopped, this.OnlineTotalBought, this.OnlineTotalShopped,
          this.TotalInstoreBoughtBase, this.TotalInstoreShoppedBase, this.InstoreBought, this.InstoreShopped, this.instoreBoughtBase, this.instoreShoppedBase);
      }
      if (this.ShowData === 'Online') {
        this.downloadBoughtShoppedData('Where Bought/Shopped Online-'+this.Category, this.InstoreTotalBought, this.InstoreTotalShopped, this.OnlineTotalBought, this.OnlineTotalShopped,
          this.TotalInstoreBoughtBase, this.TotalInstoreShoppedBase, this.OnlineBought, this.OnlineShopped, this.onlineBoughtBase, this.onlineShoppedBase);
      }
    }
  }

  downloadInfluencedInstallData(titleOfFile, tableData, baseData) {
    let csvData = [];
    this.getfilter();
    tableData.forEach((val, index) => {
      csvData.push(Object.assign({}, this.csvDetailCreation(val.sereiseData, val.sereiseName, baseData)));
    });
    csvData.push(Object.assign({}, this.csvDetailCreation(baseData, 'Base', baseData)));
    this.csvOptions.title = titleOfFile;
    this.csvOptions.headers=[];
    this.csvOptions.headers = ["Filter(s)", this.filter];
   // this.csvOptions.headers = [" ", this.brandNameCsv];
   let Infiluencedt=[];
   Infiluencedt.push([]);
   Infiluencedt[0].push('');
   this.brandNameCsv.forEach(el=>{
    Infiluencedt[0].push(el);
   })
   
   csvData.forEach((val1,i)=>{
    Infiluencedt.push(val1);
   })
  
    new AngularCsv(Infiluencedt, "Purchase Disposition", this.csvOptions);
  }

  downloadPurchasePriceData(titleOfFile, priceData, average, median, baseData) {
    let csvData = [];
    this.getfilter();
    priceData.forEach((element, index) => {
      csvData.push(Object.assign({}, this.csvDetailCreation(element.seriesdata, element.sereiseName, baseData)));
    })
    csvData.push(Object.assign({}, this.csvDetailCreation(average, 'Average', baseData)));
    csvData.push(Object.assign({}, this.csvDetailCreation(median, 'Median', baseData)));
    csvData.push(Object.assign({}, this.csvDetailCreation(baseData, 'Base', baseData)));
    this.csvOptions.title = titleOfFile;
    this.csvOptions.headers=[];
    this.csvOptions.headers = ["Filter(s)", this.filter];
    let PurchasePricedt=[];
    PurchasePricedt.push([]);
    PurchasePricedt[0].push('');
    this.brandNameCsv.forEach(el=>{
      PurchasePricedt[0].push(el);
    })
    
    csvData.forEach((val1,i)=>{
      PurchasePricedt.push(val1);
    })
   // this.csvOptions.headers = [" ", this.brandNameCsv];
    new AngularCsv(PurchasePricedt, "Purchase Disposition", this.csvOptions);
  }

  downloadPPT() {
    this.getfilter();
    if (this.selectedTab === 'Influenced') {
      this.pptDownloadObjectForInfluenced.category = this.Category;
     this.pptDownloadObjectForInfluenced.filter=this.filter;
      this.showLoader = true;
      var obj1 = JSON.stringify(this.pptDownloadObjectForInfluenced);
      this.pptexport.postPPTForInfluencedsDownload(JSON.stringify(obj1)).subscribe((data) => {
        let blob = new Blob([data], { type: "application/octet-stream" });
        let url = window.URL.createObjectURL(blob);
        let a = document.createElement("a");
        document.body.appendChild(a);
        a.href = url;
        a.download = 'Disposition_' + this.selectedTab + '_PPT.zip';
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove();
        this.showLoader = false;
      }, error => {
        console.log(error);
        this.showLoader = false;
      });
    }
    else if (this.selectedTab === 'Installed') {
      this.pptDownloadObjectForInstalled.category = this.Category;
      this.pptDownloadObjectForInstalled.filter=this.filter;
    this.showLoader = true;
    var obj2 = JSON.stringify(this.pptDownloadObjectForInstalled);
      this.pptexport.postPPTForInstalledDownload(JSON.stringify(obj2)).subscribe((data) => {
        let blob = new Blob([data], { type: "application/octet-stream" });
        let url = window.URL.createObjectURL(blob);
        let a = document.createElement("a");
        document.body.appendChild(a);
        a.href = url;
        a.download = 'Disposition_' + this.selectedTab + '_PPT.zip';
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove();
        this.showLoader = false;
      }, error => {
        console.log(error);
        this.showLoader = false;
      });

    }
    else if (this.selectedTab === 'Purchase') {
      this.pptDownloadObjectForPurchased.filter=this.filter;
      this.pptDownloadObjectForPurchased.category = this.Category;      
    this.showLoader = true;
    var obj3 = JSON.stringify(this.pptDownloadObjectForPurchased);
      this.pptexport.postPPTForPurchasePriceDownload(JSON.stringify(obj3)).subscribe((data) => {
        let blob = new Blob([data], { type: "application/octet-stream" });
        let url = window.URL.createObjectURL(blob);
        let a = document.createElement("a");
        document.body.appendChild(a);
        a.href = url;
        a.download = 'Disposition_' + this.selectedTab + '_PPT.zip';
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove();
        this.showLoader = false;
      }, error => {
        console.log(error);
        this.showLoader = false;
      });
    }
    else if (this.selectedTab === 'Reasons') {
      this.pptDownloadObjectForBrand.ReasonData = [];
      this.pptDownloadObjectForBrand.category = this.Category;
      this.reasonfForBrandChoiceArray.forEach(val => {
        var pptob = {
          'average': 0,
          'seriesname': '',
          'data': []
        }
        pptob.average = val.unroundedaverage;
        pptob.seriesname = val.sereiseName;
        pptob.data = val.seriesdata;
        this.pptDownloadObjectForBrand.ReasonData.push(pptob);
      })
      this.pptDownloadObjectForBrand.filter=this.filter;
    this.showLoader = true;
    var objnew = JSON.stringify(this.pptDownloadObjectForBrand);
      objnew = JSON.stringify(objnew);
      this.pptexport.postPPTForReasonDownload(objnew).subscribe((data) => {
        let blob = new Blob([data], { type: "application/octet-stream" });
        let url = window.URL.createObjectURL(blob);
        let a = document.createElement("a");
        document.body.appendChild(a);
        a.href = url;
        a.download = 'Disposition_' + this.selectedTab + '_PPT.zip';
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove();
        this.showLoader = false;
      }, error => {
        console.log(error);
        this.showLoader = false;
      });
    }

    else if (this.selectedTab === 'Bought') {
      var boughtob = [];
      this.TotalBought.forEach(val => {
        var obj = {
          'seriesname': val.sereiesNameTotal,
          'data': val.sereiseDataTotal,
          'bases': val.totalBoughtBase
        }
        boughtob.push(obj);
      })
      var TotalShopped2 = [];
      this.TotalShopped.forEach(val => {
        var obj1 = {
          'seriesname': val.sereiesName,
          'data': val.score,
          'bases': val.base
        }
        TotalShopped2.push(obj1);
      })
      this.pptDownloadObjectForBought.boughtserieswisescore = boughtob;
      this.pptDownloadObjectForBought.shoppedserieswisescore = TotalShopped2;
      this.pptDownloadObjectForBought.OnlineTotalBought = this.OnlineTotalBought;
      this.pptDownloadObjectForBought.InstoreTotalBought = this.InstoreTotalBought;
      this.pptDownloadObjectForBought.InstoreTotalShopped = this.InstoreTotalShopped;
      this.pptDownloadObjectForBought.OnlineTotalShopped = this.OnlineTotalShopped;
      this.pptDownloadObjectForBought.category = this.Category;
      this.pptDownloadObjectForBought.TotalInstoreBoughtBase = this.TotalInstoreBoughtBase;
      this.pptDownloadObjectForBought.TotalInstoreShoppedBase = this.TotalInstoreShoppedBase;
      this.pptDownloadObjectForBought.TotalOnlineShoppedBase = this.TotalOnlineShoppedBase;
      this.pptDownloadObjectForBought.TotalOnlineBoughtBase = this.TotalOnlineBoughtBase;
      this.pptDownloadObjectForBought.category = this.Category;
      this.pptDownloadObjectForBought.filter=this.filter;
    this.showLoader = true;
    var obj4 = JSON.stringify(this.pptDownloadObjectForBought);
      this.pptexport.postPPTForBoughtDownload(JSON.stringify(obj4)).subscribe((data) => {
        let blob = new Blob([data], { type: "application/octet-stream" });
        let url = window.URL.createObjectURL(blob);
        let a = document.createElement("a");
        document.body.appendChild(a);
        a.href = url;
        a.download = 'Disposition_' + this.selectedTab + '_PPT.zip';
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

  downloadReasonForBrandChoice(titleOfFile, reasonForChoiceData, baseData) {
    let csvData = [];
    
    reasonForChoiceData.forEach((element, index) => {
      csvData.push(Object.assign({}, this.csvDetailCreationForReasons(element.seriesdata, element.sereiseName, element.average, baseData)));
    });
    csvData.push(Object.assign({}, this.csvDetailCreationForReasons(baseData, 'Base', 0, baseData)));
    this.csvOptions.title = titleOfFile;
    this.brandNameCsv.push('Average');
   // this.csvOptions.headers = [" ", this.brandNameCsv];
    this.csvOptions.headers=[];
    this.csvOptions.headers = ["Filter(s)", this.filter];
    let reasonForBrandChoice=[];
    reasonForBrandChoice.push([]);
    reasonForBrandChoice[0].push('');
    this.brandNameCsv.forEach(el=>{
      reasonForBrandChoice[0].push(el);
    })
    
    csvData.forEach((val1,i)=>{
      reasonForBrandChoice.push(val1);
    })
    new AngularCsv(reasonForBrandChoice, "Reason for brand choice", this.csvOptions);
  }

  downloadBoughtShoppedData(titleOfFile, tboughInstoreHead, tShoppedInstoreHead, tBoughtOnlineHead, tShoppedOnlineHead, headBaseBought, headBaseShopped,
    tboughtData, tshoppedData, tBTotalDataBase, tSTotalDataBase) {
    let modifiedBrandList = [];
    let subHeaderRow = [];
    let tempArrayInstoreHead = [];
    let tempArrayOnlineHead = [];

    let tBoughtShoppedHeadBase = [];
    let dataTotalBase = [];
    this.getfilter();
    let csvData = [];
    this.brandNameCsv.forEach((value) => {
      modifiedBrandList.push(value);
      modifiedBrandList.push(value);
    });
    this.brandNameCsv.forEach((val) => {
      subHeaderRow.push('Bought');
      subHeaderRow.push('Shopped');
    });

    tboughInstoreHead.forEach((element, index) => {
      tempArrayInstoreHead.push(element);
      tempArrayInstoreHead.push(tShoppedInstoreHead[index]);
      tempArrayOnlineHead.push(tBoughtOnlineHead[index]);
      tempArrayOnlineHead.push(tShoppedOnlineHead[index]);
      tBoughtShoppedHeadBase.push(headBaseBought[index]);
      tBoughtShoppedHeadBase.push(headBaseShopped[index]);
      dataTotalBase.push(tBTotalDataBase[index]);
      dataTotalBase.push(tSTotalDataBase[index]);
    })
    csvData.push(Object.assign({}, this.csvDetailCreation(subHeaderRow, ' ', 0)));

    if (this.ShowData === 'Total') {
      csvData.push(Object.assign({}, this.csvDetailCreation(tempArrayInstoreHead, 'Total In Store(net)', tBoughtShoppedHeadBase)));
      csvData.push(Object.assign({}, this.csvDetailCreation(tempArrayOnlineHead, 'Total Online(net)', tBoughtShoppedHeadBase)));
      csvData.push(Object.assign({}, this.csvDetailCreation(tBoughtShoppedHeadBase, 'Total Base(net)', tBoughtShoppedHeadBase)));
      tboughtData.forEach((element, i) => {
        let rowdata = [];
        element.sereiseDataTotal.forEach((val, index) => {
          if (val) {
            rowdata.push(val);
          }
          else {
            rowdata.push('NA');
          }
          if (tshoppedData[i] != undefined) {
            if (tshoppedData[i].score[index]) {
              rowdata.push(tshoppedData[i].score[index]);
            }
            else {
              rowdata.push('NA');
            }
          }
          else {
            rowdata.push('NA');
          }
        });
        csvData.push(Object.assign({}, this.csvDetailCreation(rowdata, element.sereiesNameTotal, dataTotalBase)));
      });
      csvData.push(Object.assign({}, this.csvDetailCreation(dataTotalBase, 'Base', dataTotalBase)));
    }

    if (this.ShowData === 'Instore') {
      csvData.push(Object.assign({}, this.csvDetailCreation(tempArrayInstoreHead, 'Total In Store(net)', tBoughtShoppedHeadBase)));
      csvData.push(Object.assign({}, this.csvDetailCreation(tBoughtShoppedHeadBase, 'Base', tBoughtShoppedHeadBase)));
      tboughtData.forEach((element, i) => {
        let rowdata = [];
        let rowBase = [];
        element.score.forEach((val, index) => {
          if (val) {
            rowdata.push(val);
            rowBase.push(element.base[index]);
          }
          else {
            rowdata.push('NA');
          }
          if (tshoppedData[i] != undefined) {
            if (tshoppedData[i].score[index]) {
              rowdata.push(tshoppedData[i].score[index]);
              rowBase.push(tshoppedData[i].base[index]);
            }
            else {
              rowdata.push('NA');
            }
          }
          else {
            rowdata.push('NA');
          }
        });
        csvData.push(Object.assign({}, this.csvDetailCreation(rowdata, element.sereiesName, rowBase)));
        csvData.push(Object.assign({}, this.csvDetailCreation(rowBase, 'Base', rowBase)));
      });
    }

    if (this.ShowData === 'Online') {
      csvData.push(Object.assign({}, this.csvDetailCreation(tempArrayOnlineHead, 'Total Online(net)', tBoughtShoppedHeadBase)));
      csvData.push(Object.assign({}, this.csvDetailCreation(tBoughtShoppedHeadBase, 'Base', tBoughtShoppedHeadBase)));
      tboughtData.forEach((element, i) => {
        let rowdata = [];
        let rowBase = [];
        element.score.forEach((val, index) => {
          if (val) {
            rowdata.push(val);
            rowBase.push(element.base[index]);
          }
          else {
            rowdata.push('NA');
          }
          if (tshoppedData[i] != undefined) {
            if (tshoppedData[i].score[index]) {
              rowdata.push(tshoppedData[i].score[index]);
              rowBase.push(tshoppedData[i].base[index]);
            }
            else {
              rowdata.push('NA');
            }
          }
          else {
            rowdata.push('NA');
          }
        });
        csvData.push(Object.assign({}, this.csvDetailCreation(rowdata, element.sereiesName, rowBase)));
        csvData.push(Object.assign({}, this.csvDetailCreation(rowBase, 'Base', rowBase)));
      });
    }
    this.csvOptions.headers=[];
    this.csvOptions.headers = ["Filter(s)", this.filter];
    let BoughtSought=[];
    BoughtSought.push([]);
    BoughtSought[0].push('');
    this.brandNameCsv.forEach(el=>{
      BoughtSought[0].push(el);
      BoughtSought[0].push('');
    })
    csvData.forEach((val1,i)=>{
      BoughtSought.push(val1);
    })
    this.csvOptions.title = titleOfFile;
    //this.csvOptions.headers = [" ", modifiedBrandList];

    new AngularCsv(BoughtSought, "Purchase Disposition", this.csvOptions);
  }

  csvDetailCreation(chartData, sideBreak, base) {
    let csvDetail = [];
    csvDetail.push(sideBreak);
    chartData.forEach((val, index) => {
      if (sideBreak !== 'Base' && sideBreak !== 'Total Base(net)' && sideBreak != " ") {
        const scoreInExcel = this.scoreAndBase.transform(val, base[index]);
        csvDetail.push(scoreInExcel);
      }
      else {
        csvDetail.push(val);
      }
    });
    return csvDetail;
  }

  csvDetailCreationForReasons(chartData, sideBreak, average, base) {
    let csvDetail = [];
    csvDetail.push(sideBreak);
    chartData.forEach((val, index) => {
      if (sideBreak !== 'Base') {
        const scoreInExcel = this.scoreAndBase.transform(val, base[index]);
        csvDetail.push(scoreInExcel);
      }
      else {
        csvDetail.push(val);
      }
    });
    csvDetail.push(average);
    return csvDetail;
  }

  selectChangeHandler(event: any) {
    this.ShowData = event.target.value;
  }

  getContentHeight() {
    return window.innerHeight - 320;
  }

  getContentWidth() {
    var width = document.getElementById("brandData").offsetWidth;
    return width;
  }

  getContentWidthNew() {
    var width = document.getElementById("brandData1").offsetWidth;
    return width;
  }

  ngOnDestroy(): void {
    this.updateDataUnsubscribe.next();
    this.updateDataUnsubscribe.complete();
  }
}
