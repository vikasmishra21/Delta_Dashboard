import { Component, OnInit } from '@angular/core';
import { FilterConfigService } from 'src/app/service/filter-config.service';
import { ActivatedRoute } from '@angular/router';
import { FilterService } from 'src/app/shell/services/filter.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Brands } from 'src/app/model/brands';
import { Chart } from 'src/app/shell/models/chart';
import { RecentPurchase } from 'src/app/model/RecentPurchase';
import { element } from 'protractor';
import { TableOutput } from 'src/app/shell/interfaces/table-output';
import { AssetMappings } from 'src/app/model/asset.mappings';
import { AngularCsv } from 'angular7-csv/dist/Angular-csv';
import { PptExportService } from 'src/app/service/ppt-export.service';
import { ScoreAndBasePipe } from 'src/app/pipe/score-and-base.pipe';
import { RecentPurchaseFunnelTrends } from './recentPurchaseFunnelTrends';
import { FilterOption } from 'src/app/shell/models/filterOption';
import { FilterHideService } from 'src/app/service/filter-hide.service';
import { AppliedFilterSetService } from 'src/app/service/applied-filter-set.service';

@Component({
  selector: 'app-recent-purchase',
  templateUrl: './recent-purchase.component.html',
  styleUrls: ['./recent-purchase.component.css'],
  providers: [ScoreAndBasePipe]
})
export class RecentPurchaseComponent implements OnInit {
  showLoader: boolean;
  Category: string;
  categoryHeading: string;
  optionSelectionUnsubscribe: Subject<any> = new Subject<any>();
  onDataUpdate: Subject<any> = new Subject();
  brandcodes: string[];
  TotalAwareness: Array<Chart> = new Array<any>();
  SeriouslyConsider: Array<Chart> = new Array<any>();
  Purchased: Array<Chart> = new Array<any>();
  TotalAwarenessData: Array<TableOutput> = new Array<any>();
  SeriouslyConsiderData: Array<TableOutput> = new Array<any>();
  PurchasedData: Array<TableOutput> = new Array<any>();
  logoByBrandCode = AssetMappings.logoByBrandCode;
  TotalAwareness1: Array<any> = new Array<any>();
  SerioslyConsider1: Array<any> = new Array<any>();
  Purchase1: Array<any> = new Array<any>();
  awareloader: boolean;
  seriouslyconsiderloader: boolean;
  purchaseloader: boolean;
  seriesAwareName: Array<String> = new Array<any>();
  awarenesscount: number;
  seriesConsiderName: Array<String> = new Array<any>();
  seriesConsidercount: number;
  PurchasedAwareName: Array<String> = new Array<any>();
  brandList: Array<string>;
  dtRecentPurchase: Array<{ type: string, Data: Array<number> }>;
  purchasedcount: number;
  totalawarecheck: boolean;
  purchasecheck: boolean;
  purchaseExcellCheck: boolean;
  totalawareExcellCheck: boolean;
  seriousExcellCheck: boolean;
  seriousconsidercheck: boolean;
  CompTotalAndSeriously: Array<number>;
  CompSeriousAndPurchase: Array<number>;
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
  brandMapping = AssetMappings.brandCodeByName;
  pptDownloadPurchaseFunnelObject = {
    'Total_Awareness': [],
    'Seriously_Consider': [],
    'Puchased': [],
    'CompTotalSerious': [],
    'CompSeriousPurchased': [],
    'Brands': [],
    'categoryname': "",
    'bases': [],
    'filter': ''
  }
  BrandCodewiseMapping = AssetMappings.brandNameAndCodes;
  filter:string;
  isAwareCount: number = 0;
  isPurchaseCount: number = 0;
  isSeriousCount: number = 0;
  awarenessData: Array<any> = new Array<any>();
  considrationData: Array<any> = new Array<any>();
  purchaseData: Array<any> = new Array<any>();
  public showChart = false;
  public showTrends = false;
  selectedTab: any;
  period = 'Quarterly';
  periodSeclected = 'tab1';
  brandCodes: any;
  totalAwareNessTrends: any;
  seriouslyConsiderTrends: any;
  purchasedTrends: any;
  timePeriodChips: Map<string, Array<FilterOption>> = new Map<string, Array<FilterOption>>();
  hideFilterForTrends: boolean = false;
  recentPurchaseFunnelTrendsPPTData: Array<any> = new Array<any>();
  constructor(private filterService: FilterService, private route: ActivatedRoute, private filterConfigService: FilterConfigService,
    private pptexport: PptExportService, private scoreAndBase: ScoreAndBasePipe,
    private hideFilterTrends: FilterHideService, private appliedFilterSet: AppliedFilterSetService) {
    this.route.params.subscribe(params => {
      this.Category = params.order;
      this.categoryHeading = this.Category;
      if (this.Category == "Faucet") {
        this.filterConfigService.initializeRecentpurchasewithFaucet();
      }
      if (this.Category == "Showerhead") {
        this.filterConfigService.initializeRecentpurchasewithShowerhead();
      }
      if (this.Category == "Toilet") {
        this.filterConfigService.initializeRecentpurchasewithToilet();
      }
      if (this.Category == "TubShowerUnit") {
        this.filterConfigService.initializeRecentpurchasewithTUB();
      }
    });
  }

  ngOnInit() {
    this.showLoader = true;
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
    this.filterService.optionSelectionCallback$.pipe(takeUntil(this.optionSelectionUnsubscribe))
      .subscribe(value => {
        // this.appliedFilterSet.selectedChoicesFilterTransfer(value);
        // value = this.appliedFilterSet.returnIt();
        this.updateData(this.Category);
        setTimeout(() => {
          this.onDataUpdate.next();
        });
        //   if(this.filterService.selectedChoices!=undefined){
        //     this.filterService.selectedChoices .forEach((value, key) => this.setTimePeriodChips(key, value));
        // // for(var i=0;i<this.filterService.selectedChoices.size;i++){
        // //       this.pptDownloadPurchaseFunnelObject.filter.push(this.filterService.selectedChoices[i].key);
        // // }

        //   }
      });
    // if (this.appliedFilterSet.choices.length > 0 && (this.appliedFilterSet.variable === 'Yearly' || this.appliedFilterSet.variable === 'Quarterly' ||
    // this.appliedFilterSet.variable === 'Semiannual')) {
    // this.filterService.setChoices(this.appliedFilterSet.variable, this.appliedFilterSet.choices);
    // }
  }

  updateData(Category) {
    this.createTables(Category);
    setTimeout(() => {
      this.onDataUpdate.next();
    });
  }

  // seriuouslyCIndexMapping = {
  //   Faucet: { '1': '1', '2': '2', '3': '3', '4': '4', '5': '5', '6': '6', '7': '7', '8': '8', '9': '10', '10': '10', '11': '11', '19': '19' },
  //   Showerhead: { '1': '1', '2': '2', '3': '3', '4': '4', '5': '5', '6': '6', '7': '7', '8': '8', '10': '10', '11': '11', '11': '22', '12': '23', '13': '24', '14': '32', '15': '41' },
  //   Toilet: { '1': '1', '2': '2', '3': '3', '4': '4', '5': '5', '6': '6', '7': '7', '8': '8', '9': '12', '10': '14', '11': '15', '12': '16', '13': '17', '14': '18', '15': '19', '16': '20' },
  // }
  private setTimePeriodChips(variable, choices) {
    if (this.timePeriodChips.has(variable) && choices.length === 0) {
      this.timePeriodChips.delete(variable);
    } else {
      this.timePeriodChips.set(variable, [...choices]);
    }
    for (var i = 0; i < this.timePeriodChips.size; i++) {
      if (variable != "Allbrands")
        this.pptDownloadPurchaseFunnelObject.filter = this.pptDownloadPurchaseFunnelObject.filter + " " + variable + " " + choices[0].text;
    }
  }

  init() {
    this.brandList = [];
    this.TotalAwareness1 = [];
    this.SerioslyConsider1 = [];
    this.brandcodes = [];
    this.Purchase1 = [];
    this.showLoader = true;
    this.awareloader = true;
    this.purchaseloader = true;
    this.seriouslyconsiderloader = true;
    this.seriesAwareName = [];
    this.seriesConsiderName = [];
    this.PurchasedAwareName = [];
    this.dtRecentPurchase = [];
    this.purchasecheck = false;
    this.seriousconsidercheck = false;
    this.totalawarecheck = false;
    this.purchaseExcellCheck = false;
    this.seriousExcellCheck = false;
    this.totalawareExcellCheck = false;
    this.isAwareCount = 0;
    this.isPurchaseCount = 0;
    this.isSeriousCount = 0;
    this.awarenessData = [];
    this.considrationData = [];
    this.purchaseData = [];
  }
  LoaderCall() {
    if (this.purchaseloader == false && this.seriouslyconsiderloader == false && this.awareloader == false) {
      this.showLoader = false;
    }
  }
  CompareseriesCall() {
    if (this.seriousconsidercheck && this.purchasecheck && this.awarenesscount) {
      this.CompTotalAndSeriously = [];
      this.CompSeriousAndPurchase = [];
      this.pptDownloadPurchaseFunnelObject.CompTotalSerious=[];
      this.pptDownloadPurchaseFunnelObject.CompSeriousPurchased=[];
      if (this.awarenessData.length == this.considrationData.length && this.considrationData.length == this.purchaseData.length) {
        for (var i = 0; i < this.awarenessData.length; i++) {
          var measure = (this.considrationData[i].score / this.awarenessData[i].score) * 100;
          if(isNaN(measure)){
            this.pptDownloadPurchaseFunnelObject.CompTotalSerious.push('NA'); 
          }
          else{
            this.pptDownloadPurchaseFunnelObject.CompTotalSerious.push(Math.round(measure));
          }
          this.CompTotalAndSeriously.push(Math.round(measure));
          
        }
        for (var i = 0; i < this.considrationData.length; i++) {
          var measure = (this.purchaseData[i].score / this.considrationData[i].score) * 100;
          if(isNaN(measure)){
            this.pptDownloadPurchaseFunnelObject.CompSeriousPurchased.push('NA'); 
          }
          else{
            this.pptDownloadPurchaseFunnelObject.CompSeriousPurchased.push(Math.round(measure));
          }
          this.CompSeriousAndPurchase.push(Math.round(measure));
          
        }
        this.TotalAwareness1 = this.awarenessData;
        this.SerioslyConsider1 = this.considrationData;
        this.Purchase1 = this.purchaseData;
      }

    }
  }
  PPtExport() {
    this.showLoader = true;
   this.getfilter();
   this.pptDownloadPurchaseFunnelObject.filter=this.filter;
    this.pptDownloadPurchaseFunnelObject.categoryname = this.Category;
    var objnew = JSON.stringify(this.pptDownloadPurchaseFunnelObject);
    this.pptexport.postPPTForRecentPurchaseDownload(JSON.stringify(objnew)).subscribe((data) => {
      let blob = new Blob([data], { type: "application/octet-stream" });
      let url = window.URL.createObjectURL(blob);
      let a = document.createElement("a");
      document.body.appendChild(a);
      a.href = url;
      a.download = 'Recent_Purchase_Funnel_' + this.Category + '.zip';
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
      this.showLoader = false;
    }, error => {
      console.log(error);
      this.showLoader = false;
    });
  }
  createTables(Category) {
    this.toggleChart('chartsTabs');
    this.init();
    const brands = new Brands(this.filterService);
    this.brandCodes = brands;
    this.brandcodes = brands.getBrandsCode();
    this.pptDownloadPurchaseFunnelObject.categoryname = this.Category;
    this.brandList = brands.getBrandsCode().map(val => AssetMappings.logoByBrandCode[val]);
    this.csvOptions.headers = [];
    this.pptDownloadPurchaseFunnelObject.Total_Awareness=[];
    this.pptDownloadPurchaseFunnelObject.Puchased=[];
    this.pptDownloadPurchaseFunnelObject.Seriously_Consider=[];
    this.pptDownloadPurchaseFunnelObject.bases=[];
    var copybrandlist = [];
    this.pptDownloadPurchaseFunnelObject.Brands = [];
    this.brandcodes.forEach(element => {
      this.pptDownloadPurchaseFunnelObject.Brands.push(AssetMappings.brandNameAndCodes[element]);
    });

    this.isAwareCount = 0;
    this.isPurchaseCount = 0;
    this.isSeriousCount = 0;

    const reecentPur = new RecentPurchase(this.Category);
    this.TotalAwareness = reecentPur.getAwareness(this.brandcodes, Category);
    this.SeriouslyConsider = reecentPur.SeriouslyConsider(this.brandcodes, Category);
    this.Purchased = reecentPur.getPurchased(this.brandcodes, Category);

    if (this.brandcodes.length > 0) {
      this.TotalAwareness.forEach(element => {
        element.addTableDataReady((output, datatable) => {
          this.awareloader = false;
          this.LoaderCall();
          if (output.length > 0) {
            output.forEach((val, valindex) => {
              if (val.SeriesName != "No Answer") {
                this.TotalAwarenessData.push(val);
                this.seriesAwareName.push(val.SeriesName);
                this.awarenesscount = this.seriesAwareName.filter(item => item == val.SeriesName).length;
                if (this.awarenesscount == 1) {
                  const indextoBeAdd = this.brandcodes.indexOf(val.SeriesCode);
                  var base = datatable.bases.get('Base')[0];
                  let compareScore = 0;
                  if (val.previousScore && val.previousScore != undefined) {
                    compareScore = Math.round(val.previousScore);
                  }
                  let compareBase = 0;
                  if (datatable.comparisonBases.get("Base") != undefined) {
                    compareBase = datatable.comparisonBases.get("Base")[0];
                  }
                  let showSig = false;
                  if (val.SignificanceSign != undefined && val.SignificanceSign != 0) {
                    showSig = true;
                  }
                  this.awarenessData[indextoBeAdd] = ({
                    'Code': parseInt(val.SeriesCode), 'score': val.Score, 'base': base,
                    'compareScore': compareScore, 'compareBase': compareBase, 'isSignificance': showSig
                  })
                  this.isAwareCount++;
                  //this.TotalAwareness1.sort((a, b) => b.Code - a.Code).reverse();
                }
                if (this.isAwareCount == this.brandcodes.length && this.totalawareExcellCheck == false) {
                  this.totalawareExcellCheck = true;
                  this.totalawarecheck = true;
                  this.CompareseriesCall();
                  this.awarenessData.forEach(element => {
                    if(isNaN(element.score)){
                      this.pptDownloadPurchaseFunnelObject.Total_Awareness.push('NaN');
                    }
                    else
                    {
                      this.pptDownloadPurchaseFunnelObject.Total_Awareness.push(Math.round(element.score));   
                    }
                  
                  })
                  //this.TotalAwareness1 = awarenessData;
                }
              }
            });
          }
        });
      });

      this.SeriouslyConsider.forEach(element => {
        element.addTableDataReady((output, datatable) => {
          this.seriouslyconsiderloader = false;
          this.LoaderCall();
          if (output.length > 0) {
            output.forEach((val, valindex) => {
              if (val.SeriesName !== "No Answer") {
                this.SeriouslyConsiderData.push(val);
                this.seriesConsiderName.push(val.SeriesName);
                this.seriesConsidercount = this.seriesConsiderName.filter(item => item == val.SeriesName).length;
                if (this.seriesConsidercount == 1) {
                  const indextoBeAdd = this.brandcodes.indexOf(val.SeriesCode);
                  var base = datatable.bases.get('Base')[0];
                  let compareScore = 0;
                  if (val.previousScore && val.previousScore != undefined) {
                    compareScore = Math.round(val.previousScore);
                  }
                  let compareBase = 0;
                  if (datatable.comparisonBases.get("Base") != undefined) {
                    compareBase = datatable.comparisonBases.get("Base")[0];
                  }
                  let showSig = false;
                  if (val.SignificanceSign != undefined && val.SignificanceSign != 0) {
                    showSig = true;
                  }
                  this.considrationData[indextoBeAdd] = ({
                    'Code': parseInt(val.SeriesCode), 'score': val.Score, 'base': base,
                    'compareScore': compareScore, 'compareBase': compareBase, 'isSignificance': showSig
                  })
                  // this.SerioslyConsider1.sort((a, b) => b.Code - a.Code).reverse();
                  this.isSeriousCount++;
                }
                if (this.isSeriousCount == this.brandcodes.length && this.seriousExcellCheck == false) {
                  this.seriousExcellCheck = true;
                  this.seriousconsidercheck = true;
                  this.CompareseriesCall();
                  this.considrationData.forEach(element => {
                    if(isNaN(element.score)){
                      this.pptDownloadPurchaseFunnelObject.Seriously_Consider.push('NaN');
                    }
                    else{
                      this.pptDownloadPurchaseFunnelObject.Seriously_Consider.push(Math.round(element.score));
                    }
                   
                    this.pptDownloadPurchaseFunnelObject.bases.push(Math.round(element.base))
                  })
                  //this.SerioslyConsider1 = considrationData;
                }
              }
            });
          }
        });
      });

      this.Purchased.forEach(element => {
        element.addTableDataReady((output, datatable) => {
          this.purchaseloader = false;
          this.LoaderCall();
          if (output.length > 0) {
            output.forEach((val, valindex) => {
              if (val.SeriesName != "No Answer") {
                this.PurchasedData.push(val);
                this.PurchasedAwareName.push(val.SeriesName);
                this.purchasedcount = this.PurchasedAwareName.filter(item => item == val.SeriesName).length;
                if (this.purchasedcount == 1) {
                  const indextoBeAdd = this.brandcodes.indexOf(val.SeriesCode);
                  var base = datatable.bases.get('Base')[0];
                  let compareScore = 0;
                  if (val.previousScore && val.previousScore != undefined) {
                    compareScore = Math.round(val.previousScore);
                  }
                  let compareBase = 0;
                  if (datatable.comparisonBases.get("Base") != undefined) {
                    compareBase = datatable.comparisonBases.get("Base")[0];
                  }
                  let showSig = false;
                  if (val.SignificanceSign != undefined && val.SignificanceSign != 0) {
                    showSig = true;
                  }
                  this.purchaseData[indextoBeAdd] = ({
                    'Code': parseInt(val.SeriesCode), 'score': val.Score, 'base': base,
                    'compareScore': compareScore, 'compareBase': compareBase, 'isSignificance': showSig
                  })
                  // this.Purchase1.sort((a, b) => b.Code - a.Code).reverse();
                  this.isPurchaseCount++
                }
                if (this.isPurchaseCount == this.brandcodes.length && this.purchaseExcellCheck == false) {
                  this.purchaseExcellCheck = true;
                  this.purchasecheck = true;
                  this.CompareseriesCall();
                  this.purchaseData.forEach(element => {
                    if(isNaN(element.score)){
                      this.pptDownloadPurchaseFunnelObject.Puchased.push('NaN')
                    }
                    else{
                      this.pptDownloadPurchaseFunnelObject.Puchased.push(Math.round(element.score))
                    }
                    
                    this.pptDownloadPurchaseFunnelObject.bases.push(Math.round(element.base))
                  })
                  //this.Purchase1 = purchaseData;
                }
              }
            });
          }
        });
      });
    }
  }

  downloadPptTrends() {
    if (this.totalAwareNessTrends && this.seriouslyConsiderTrends && this.purchasedTrends) {
      this.showLoader = true;

      const objnew = JSON.stringify(this.recentPurchaseFunnelTrendsPPTData[0]);
      this.pptexport.postPPTForTrends(objnew).subscribe((data) => {
        const blob = new Blob([data], { type: 'application/octet-stream' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        document.body.appendChild(a);
        a.href = url;
        a.download = 'RecentPurchaseFunnel_Trends_PPT.zip';
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
  updateDataTrends(codes) {
    this.recentPurchaseFunnelTrendsPPTData = [];
    const recentPurchaseFunnelTrends: RecentPurchaseFunnelTrends = new RecentPurchaseFunnelTrends(this.Category);
    if (this.period === 'Quarterly' || this.periodSeclected === 'tab1') {
      this.period = 'Quarterly';
      this.chartMap(recentPurchaseFunnelTrends, this.period, codes);
    } else if (this.period === 'Annually' || this.periodSeclected === 'tab3') {
      this.period = 'Yearly';
      this.chartMap(recentPurchaseFunnelTrends, this.period, codes);
    } else if (this.period === 'SemiAnnually' || this.periodSeclected === 'tab2') {
      this.period = 'Semiannual';
      this.chartMap(recentPurchaseFunnelTrends, this.period, codes);
    }
    if (this.totalAwareNessTrends && this.seriouslyConsiderTrends && this.purchasedTrends) {
      this.recentPurchaseFunnelTrendsPPTData.push(recentPurchaseFunnelTrends.recentPurchaseFunnelTrendsPPTData);
    }
  }

  chartMap(ref, topBrake, codes) {
    this.getfilterTrends();
    this.totalAwareNessTrends = ref.getAwareness(topBrake, 'TOTAL AWARENESS', codes,this.filter);
    this.seriouslyConsiderTrends = ref.SeriouslyConsider(topBrake, 'SERIOUSLY CONSIDER', codes,this.filter);
    this.purchasedTrends = ref.getPurchased(topBrake, 'PURCHASED', codes,this.filter);
  }
  getfilterTrends() {
    this.filter = "";
    let filter = JSON.parse(localStorage.getItem('filterappTime'));
    let filterSide = JSON.parse(localStorage.getItem('filterapp'));
    

    if (filterSide != null) {
      filterSide.forEach((element, i) => {
        if (i == 0) {
          //this.filter = this.filter + ' Side Filter(s) :';
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
      this.updateDataTrends(this.brandCodes.getBrandsCode());
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
      this.updateDataTrends(this.brandCodes.getBrandsCode());
      setTimeout(() => {
        this.onDataUpdate.next();
      });
      setTimeout(() => {
        this.showLoader = false;
      }, 3000);
    }
  }



  ExcellExport() {
    let csvData = [];
    let awareData = [];
    let seriousData = [];
    let purchaseData = [];
    let chartBase = [];
    this.getfilter();
    this.TotalAwareness1.forEach((value) => {
      awareData.push(value.score);
      chartBase.push(value.base);
    });
    this.SerioslyConsider1.forEach((value) => {
      seriousData.push(value.score);
    });
    this.Purchase1.forEach((value) => {
      purchaseData.push(value.score);
    });
    let branddt=[];
    this.brandcodes.forEach(element => {
      branddt.push(AssetMappings.brandNameAndCodes[element]);
      });
    csvData.push(Object.assign({}, this.csvDetailCreation(branddt, ' ', [0])));
    csvData.push(Object.assign({}, this.csvDetailCreation(awareData, 'Total Awareness', chartBase)));
    csvData.push(Object.assign({}, this.csvDetailCreation(seriousData, 'Seriously Considered', chartBase)));
    csvData.push(Object.assign({}, this.csvDetailCreation(purchaseData, 'Purchased', chartBase)));
    csvData.push(Object.assign({}, this.csvDetailCreation(chartBase, 'Base', chartBase)));

    this.csvOptions.title = "Recent Purchase Funnel -"+ this.Category;
    this.csvOptions.headers=[];
    this.csvOptions.headers.push("Filter(s)",this.filter);
    this.brandcodes.forEach(element => {
    //  this.csvOptions.headers.push(AssetMappings.brandNameAndCodes[element]);
    });
    new AngularCsv(csvData, "Recent Purchase Funnel", this.csvOptions);
  }

  csvDetailCreation(chartData, sideBreak, base) {
    let csvDetail = [];
   
    csvDetail.push(sideBreak);
    if(sideBreak==' '){
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
