import { Component, OnInit } from '@angular/core';
import { Chart } from 'src/app/shell/models/chart';
import { CategoryBrandHealth } from '../../model/CategoryBrandHealth';
import { TableOutput } from 'src/app/shell/interfaces/table-output';
import { Subject } from 'rxjs';
import { FilterService } from 'src/app/shell/services/filter.service';
import { FilterConfigService } from 'src/app/service/filter-config.service';
import { Brands } from 'src/app/model/brands';
import { AssetMappings } from 'src/app/model/asset.mappings';
import { ActivatedRoute } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { AngularCsv } from 'angular7-csv/dist/Angular-csv';
import { ScoreAndBasePipe } from 'src/app/pipe/score-and-base.pipe';
import { CategoryBrandHealthTrends } from './categoryBrandHealthTrends';
import { FilterOption } from 'src/app/shell/models/filterOption';
import { PptExportService } from 'src/app/service/ppt-export.service';
import { FilterHideService } from 'src/app/service/filter-hide.service';
import { AppliedFilterSetService } from 'src/app/service/applied-filter-set.service';
@Component({
  selector: 'app-category-brand-health',
  templateUrl: './category-brand-health.component.html',
  styleUrls: ['./category-brand-health.component.css'],
  providers: [ScoreAndBasePipe]
})

export class CategoryBrandHealthComponent implements OnInit {

  categoryHeaderName: string
  Category: string;
  showLoader: boolean;
  updateDataUnsubscribe: Subject<any> = new Subject<any>();

  unaided: Chart;
  unaidedBases: number;
  unadedBrand = ['Delta', 'American Standard', 'Kohler', 'Moen', 'Peerless', 'Pfister', 'Waterpik'];
  unaidedData: Array<any> = new Array<any>();

  onDataUpdate: Subject<any> = new Subject();
  brandList: Array<string>;
  brandname: any;
  UnaidedScore: number;

  totalBrand: Chart;
  totalBrandData: Array<any> = new Array<any>();
  totalBrandBase: number;
  totalbrandcheck: Array<boolean> = new Array<boolean>();

  considerationChart: Array<Chart> = new Array<Chart>();
  IndexArrayBrandSidebreak: Array<any> = new Array<any>();
  ConsiderationBases: Array<any> = new Array<any>();
  ConsiderationOutput: Array<any> = new Array<any>();
  ConsiderationDataTable: Array<any> = new Array<any>();
  FisrtChoice: Array<any> = new Array<any>();
  considerChoiceHeights: Array<any> = new Array<any>();
  FirstChoice1: Array<any> = new Array<any>();
  SecondChoice: Array<any> = new Array<any>();
  SecondChoice1: Array<any> = new Array<any>();
  Consider: Array<any> = new Array<any>();
  Consider1: Array<any> = new Array<any>();
  NotConsider: Array<any> = new Array<any>();
  NotConsider1: Array<any> = new Array<any>();
  Choices: Array<any> = new Array<any>();
  ChoisesBase: Array<number> = new Array<number>();
  ChoisesCompareScore: any;

  equitychartArray: Array<Chart> = new Array<any>();
  eqcount: number;
  relcount: number;
  equitydata: any[];
  equitydatawithbrandcode: any[];
  equitydatawithbrandcode1: any[];
  data1: Array<any> = new Array<any>();
  equityBase: Array<any> = new Array<any>();
  equitydataOutput: Array<TableOutput> = new Array<any>();
  countEquitytimes: number;
  baseeq: number;

  strongChartArray: Array<Chart> = new Array<any>();
  //strongdata: Array<TableOutput> = new Array<TableOutput>();
  IndexArrayOfStrongRelation: Array<any> = new Array<any>();
  StrongBases: Array<any> = new Array<any>();

  eqcheck: boolean;
  strongCode: Array<string> = new Array<any>();
  strongdata: Array<{ Code: number, Score: any, base: any, compareScore: any, compareBase: any, isSignificance: boolean }>;
  strongdata1: Array<{ Code: number, Score: any, base: any, compareScore: any, compareBase: any, isSignificance: boolean }>;
  strongdata2: Array<{ Code: number, Score: any, base: any, compareScore: any, compareBase: any, isSignificance: boolean }>;
  relcheck: boolean;
  basere: number;
  showloader: boolean;
  equityloder: boolean;
  strongloader: boolean;
  brandArray: Array<string> = new Array<string>();
  brandStrongArray: Array<string> = new Array<string>();
  countstrongtimes: number;
  check: boolean;
  brands: any;
  baseArrayUnaidedData: Array<any> = new Array<any>();
  baseArrayTotalBrand: Array<any> = new Array<any>();
  baseArrayChoices: Array<any> = new Array<any>();
  baseArrayEquity: Array<any> = new Array<any>();
  baseArrayStrong: Array<any> = new Array<any>();

  isUnaidedLoader: boolean = false;
  isTotalLoader: boolean = false;
  isConsiderationLoader: boolean = false;
  isEquityLoader: boolean = false;
  isStrongLoader: boolean = false;
  StrongScore=[];
  brandMapping = AssetMappings.brandCodeByName;
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
  brandNameCsv: Array<string>;
  brandNameCodes = AssetMappings.brandNameAndCodes;
  public showChart = false;
  public showTrends = false;
  selectedTab: any;
  period = 'Quarterly';
  periodSeclected = 'tab1';
  filter: string;
  brandsToGo: any;
  unaidedTrends: any;
  totalBrandsTrends: any;
  considerationFirstTrends: any;
  considerationSecondTrends: any;
  considerationConsiderTrends: any;
  considerationNotConsiderTrends: any;
  brandEquityActiveTrends: any;
  brandEquityLatentTrends: any;
  pptDownloadCategorybrandhealthObject = {
    'Brands': [],
    'UnaidedBrand': [],
    'TotalBrand': [],
    'firstsecondchoice': [],
    'FirstChoice': [],
    'SecondChoice': [],
    'Consider': [],
    'NotConsider': [],
    'StrongRelationship': [],
    'Active': [],
    'Latent': [],
    'Bases': [],
    'filter': '',
    'category': "",
  };
  hideFilterForTrends: boolean = false;
  categoryBrandHealthTrendsPPTData: Array<any> = new Array<any>();
  constructor(private filterService: FilterService, private route: ActivatedRoute, private filterConfigService: FilterConfigService,
    private pptexport1: PptExportService, private scoreAndBase: ScoreAndBasePipe, private hideFilterTrends: FilterHideService,
    private appliedFilterSet: AppliedFilterSetService) {
    this.route.params.subscribe(params => {
      this.Category = params.order;
      if (this.Category == "Faucet") {
        this.filterConfigService.initializeCateogryBrandHealthFaucet();
      }
      if (this.Category == "Showerhead") {
        this.filterConfigService.initializeCateogryBrandHealthShowerhead();
      }
      if (this.Category == "Toilet") {
        this.filterConfigService.initializeCateogryBrandHealthToilet();
      }
      if (this.Category == "TubShowerUnit") {
        this.filterConfigService.initializeCateogryBrandHealthTubShowerUnit();
      }
    });
    this.eqcount = 0;
    this.relcount = 0;
  }

  initpara() {
    this.equitydatawithbrandcode = [];
    this.equitydatawithbrandcode1 = [];
    this.brandArray = [];
    this.countEquitytimes = 0;
    this.strongdata = [];
    this.strongdata1 = [];
    this.brandArray = [];
    this.brandStrongArray = [];
    this.check = false;
    this.countstrongtimes = 0;
    this.strongChartArray = [];
    this.unaidedData = [];
    this.totalBrandData = [];
    this.considerationChart = [];
    this.equitychartArray = [];
    this.baseArrayUnaidedData = [];
    this.baseArrayTotalBrand = [];
    this.baseArrayChoices = [];
    this.baseArrayEquity = [];
    this.baseArrayStrong = [];
    this.ChoisesBase = [];
    this.isUnaidedLoader = false;
    this.isTotalLoader = false;
    this.isConsiderationLoader = false;
    this.isEquityLoader = false;
    this.isStrongLoader = false;
  };

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
        // this.appliedFilterSet.selectedChoicesFilterTransfer(value);
        // value = this.appliedFilterSet.returnIt();
        this.updateData(this.Category);
        //   if(this.filterService.selectedChoices!=undefined){
        //     this.filterService.selectedChoices .forEach((value, key) => this.setTimePeriodChips(key, value));
        // // for(var i=0;i<this.filterService.selectedChoices.size;i++){
        // //       this.pptDownloadPurchaseFunnelObject.filter.push(this.filterService.selectedChoices[i].key);
        // // }

        //   }
        setTimeout(() => {
          this.onDataUpdate.next();
        });
      });
    // if (this.appliedFilterSet.choices.length > 0) {
    //   this.filterService.setChoices(this.appliedFilterSet.variable, this.appliedFilterSet.choices);
    // }
  }

  updateData(Category) {
    this.showLoader = true;
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
        this.pptDownloadCategorybrandhealthObject.filter = this.pptDownloadCategorybrandhealthObject.filter + " " + variable + " " + choices[0].text;
      }
    }

  }
  getCode(bramdname: string): number {
    return this.brandMapping[bramdname];
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
          this.filter = this.filter + ' Side Filter(s) :';
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
          this.filter = this.filter + ' Side Filter(s): ';
          this.filter = this.filter + " " + element;
        }
        else {
          this.filter = this.filter + "| " + element;
        }
      });
    };
  }
  pptexport(pptName) {
    this.showLoader = true;
    this.getfilter();
    this.pptDownloadCategorybrandhealthObject.filter=this.filter;
  this.pptDownloadCategorybrandhealthObject.category = this.Category;
    var obj = JSON.stringify(this.pptDownloadCategorybrandhealthObject);
    obj = JSON.stringify(obj);
    this.pptexport1.postPPTForCategoryBrandHealthDownload(obj).subscribe((data) => {
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

  downloadPptTrends() {
    if (this.unaidedTrends && this.totalBrandsTrends && this.considerationFirstTrends && this.considerationSecondTrends
      && this.considerationConsiderTrends && this.considerationNotConsiderTrends && this.brandEquityActiveTrends
      && this.brandEquityLatentTrends) {
      this.showLoader = true;
      const objnew = JSON.stringify(this.categoryBrandHealthTrendsPPTData[0]);
      this.pptexport1.postPPTForTrends(objnew).subscribe((data) => {
        const blob = new Blob([data], { type: 'application/octet-stream' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        document.body.appendChild(a);
        a.href = url;
        a.download = 'CategoryBrandHealth_Trends_PPT.zip';
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
  createTables(Category) {
    this.initpara();
    this.showLoader = true;
    this.toggleChart('chartsTabs');
    this.strongCode = [];

    this.brands = new Brands(this.filterService);
    const brandcodes = this.brands.getBrandsCode();

    if (brandcodes.length != 0) {
      this.strongCode = this.CategaryMapCodes(brandcodes);
    }
    this.brandNameCsv = this.brands.getBrandsCode().map((val) => this.brandNameCodes[val]);
    this.pptDownloadCategorybrandhealthObject.Brands = this.brands.getBrandsCode().map((val) => this.brandNameCodes[val]);
    this.brandList = this.brands.getBrandsCode().map(val => AssetMappings.logoByBrandCode[val]);

    const categoryBrandHealth: CategoryBrandHealth = new CategoryBrandHealth(Category);
    this.unaided = categoryBrandHealth.getUnaided(Category, brandcodes);
    this.totalBrand = categoryBrandHealth.getTotalAided(Category, brandcodes);
    this.considerationChart = categoryBrandHealth.getConsideration(Category, brandcodes);
    this.equitychartArray = categoryBrandHealth.getEquity(Category, brandcodes);
    this.strongChartArray = categoryBrandHealth.getStrongrelation(Category, this.strongCode);

    if (brandcodes.length > 0) {
      for (let i = 0; i < brandcodes.length; i++) {
        this.FisrtChoice[i] = 0;
        this.SecondChoice[i] = 0;
        this.Consider[i] = 0;
        this.NotConsider[i] = 0;
      }
      this.unaided.addTableDataReady((output, dataTable) => {
        this.baseArrayUnaidedData = [];
        // this.hideloader();
        this.isUnaidedLoader = true;
        this.unaidedData = [];
        output.forEach((val, ind) => {
          if(val.SeriesName !== "No Answer"){
            this.unaidedBases = dataTable.bases.get('Base').map(value => Math.round(value))[0];
            let compareBase = 0;
            if (dataTable.comparisonBases.get('Base') != undefined) {
              compareBase = dataTable.comparisonBases.get('Base').map(value => Math.round(value))[0];
            }
            let unaidDataObject = {
              'Score': 0,
              'base': 0,
              'compareScore': 0,
              'compareBase': compareBase,
              'isSignificance': false
            }
            const indexToAdd = brandcodes.indexOf(val.SeriesCode);
            if (brandcodes.indexOf(val.SeriesCode) > -1) {
              unaidDataObject.Score = val.Score;
              unaidDataObject.base = this.unaidedBases;
              if(val.SignificanceSign != undefined){
                unaidDataObject.isSignificance = true;
              }
              if (val.previousScore && val.previousScore != undefined) {
                unaidDataObject.compareScore = Math.round(val.previousScore);
              }
            }
            if (dataTable.significance.get(val.SeriesName) != undefined && dataTable.significance.get(val.SeriesName)[0] != undefined) {
              unaidDataObject.isSignificance = true;
            }
            this.unaidedData[indexToAdd] = unaidDataObject;
            if(isNaN(unaidDataObject.Score)){
              this.pptDownloadCategorybrandhealthObject.UnaidedBrand[indexToAdd] = 'NaN';
            }
            else {
              this.pptDownloadCategorybrandhealthObject.UnaidedBrand[indexToAdd] = unaidDataObject.Score;
            }

            this.baseArrayUnaidedData.push(this.unaidedBases);
          }
        });
        this.hideLoader();
      });

      this.totalBrand.addTableDataReady((output, dataTable) => {
        this.baseArrayTotalBrand = [];
        this.totalBrandData = [];
        this.isTotalLoader = true;
        this.totalBrandData = [];
        output.forEach((val, ind) => {
          if(val.SeriesName !== "No Answer"){
            this.totalBrandBase = dataTable.bases.get('Base').map(value => Math.round(value))[0];
            let compareBase = 0;
            if (dataTable.comparisonBases.get('Base') != undefined) {
              compareBase = dataTable.comparisonBases.get('Base').map(value => Math.round(value))[0];
            }
            let totalDataObject = {
              'Score': 0,
              'base': 0,
              'compareScore': 0,
              'compareBase': compareBase,
              'isSignificance': false
            }
            const indexToAdd = brandcodes.indexOf(val.SeriesCode);
            if (brandcodes.indexOf(val.SeriesCode) > -1) {
              totalDataObject.Score = val.Score;
              totalDataObject.base = this.totalBrandBase;
              if (val.previousScore && val.previousScore != undefined) {
                totalDataObject.compareScore = Math.round(val.previousScore);
              }
            }
            if (dataTable.significance.get(val.SeriesName) != undefined && dataTable.significance.get(val.SeriesName)[0] != undefined) {
              totalDataObject.isSignificance = true;
            }
            this.totalBrandData[indexToAdd] = totalDataObject;
            if(isNaN(totalDataObject.Score)){
              this.pptDownloadCategorybrandhealthObject.TotalBrand[indexToAdd] = 'NaN';
            }
            else{
              this.pptDownloadCategorybrandhealthObject.TotalBrand[indexToAdd] = totalDataObject.Score;
            }

            this.pptDownloadCategorybrandhealthObject.Bases[indexToAdd] = totalDataObject.base;
            this.baseArrayTotalBrand.push(this.totalBrandBase);
          }
        });
        this.hideLoader();
      });

      this.ConsiderationBases = [];
      this.FisrtChoice = [];
      this.FirstChoice1=[];
      this.SecondChoice = [];
      this.SecondChoice1=[];
      this.Consider = [];
      this.Consider1=[];
      this.NotConsider = [];
      this.NotConsider1=[];
      this.Choices = [];
      this.ChoisesBase = [];
      this.IndexArrayBrandSidebreak = [];
      this.considerChoiceHeights = [];
      for (let i = 0; i < this.considerationChart.length; i++) {
        this.IndexArrayBrandSidebreak.push(this.considerationChart[i].SideBreak[0]);
        this.FisrtChoice[i] = { 'Score': 0, 'base': 0, 'compareScore': 0, 'compareBase': 0, 'isSignificance': false };
        this.FirstChoice1[i] = { 'Score': 0, 'base': 0, 'compareScore': 0, 'compareBase': 0, 'isSignificance': false };
        this.SecondChoice[i] = { 'Score': 0, 'base': 0, 'compareScore': 0, 'compareBase': 0, 'isSignificance': false };
        this.SecondChoice1[i] = { 'Score': 0, 'base': 0, 'compareScore': 0, 'compareBase': 0, 'isSignificance': false };
        this.Consider[i] = { 'Score': 0, 'base': 0, 'compareScore': 0, 'compareBase': 0, 'isSignificance': false };
        this.Consider1[i] = { 'Score': 0, 'base': 0, 'compareScore': 0, 'compareBase': 0, 'isSignificance': false };
        this.NotConsider[i] = { 'Score': 0, 'base': 0, 'compareScore': 0, 'compareBase': 0, 'isSignificance': false };
        this.NotConsider1[i] = { 'Score': 0, 'base': 0, 'compareScore': 0, 'compareBase': 0, 'isSignificance': false };
        this.Choices[i] = { 'Score': 0, 'base': 0, 'compareScore': 0, 'compareBase': 0, 'isSignificance': false };
        // this.considerChoiceHeights.push(100);
      }
      let count=0;
      this.ConsiderationOutput = [];
      this.ConsiderationDataTable = [];
      this.considerationChart.forEach((val, index) => {
        val.addTableDataReady((output, dataTable) => {
          let sidebreakVar = output[0].SeriesVariableID;
          let ind = -1;
          this.ConsiderationOutput.forEach((ele,i)=>{
            if(sidebreakVar == ele[0].SeriesVariableID){
              ind = i;
            }
          });
          if(ind > -1){
            this.ConsiderationOutput[ind] = output;
            this.ConsiderationDataTable[ind] = dataTable;
          }else{
            this.ConsiderationOutput.push(output);
            this.ConsiderationDataTable.push(dataTable);
          }
          if (this.ConsiderationOutput.length  == this.considerationChart.length) {
            this.ConsiderationOutput.forEach((outputSeries, indChar) => {
              this.isConsiderationLoader = true;
              this.baseArrayChoices = [];
              let outputSideBreak = outputSeries[0].SeriesVariableID;
              let indexofBrandData = this.IndexArrayBrandSidebreak.indexOf(outputSideBreak);
              this.ConsiderationBases.push(this.ConsiderationDataTable[indChar].bases.get('Base').map(value => Math.round(value)));
              for (let index = 0; index < brandcodes.length; index++) {
                this.baseArrayChoices.push(this.ConsiderationBases[0]);
              }
              let compareBase = 0;
              if (this.ConsiderationDataTable[indChar].comparisonBases.get('Base') != undefined) {
                compareBase = this.ConsiderationDataTable[indChar].comparisonBases.get('Base').map(value => Math.round(value))[0];
              }
              outputSeries.forEach((element,indEle) => {
                switch (element.SeriesName) {
                  case "First choice":
                    count++;
                    this.FisrtChoice[indexofBrandData].Score = element.Score;
                    if(isNaN(element.Score)){
                      this.pptDownloadCategorybrandhealthObject.FirstChoice[indexofBrandData] ='NaN';
                    }
                    else {
                    this.pptDownloadCategorybrandhealthObject.FirstChoice[indexofBrandData] = element.Score;
                    }
                    //this.pptDownloadCategorybrandhealthObject.FirstChoice[indexofBrandData] = element.Score;
                    this.FisrtChoice[indexofBrandData].base = this.ConsiderationBases[0];
                    if (element.previousScore && element.previousScore != undefined) {
                      this.FisrtChoice[indexofBrandData].compareScore = Math.round(element.previousScore);
                      this.FisrtChoice[indexofBrandData].compareBase = compareBase;
                    }
                    const showSig = this.ConsiderationDataTable[indChar].significance.get(element.SeriesName)[0];
                    if (showSig != undefined) {
                      this.FisrtChoice[indexofBrandData].isSignificance = true;
                    }
                    break;
                  case "Second choice":
                    this.SecondChoice[indexofBrandData].Score = element.Score;
                    if(isNaN(element.Score)){
                      this.pptDownloadCategorybrandhealthObject.SecondChoice[indexofBrandData] ='NaN';
                    }
                    else {
                    this.pptDownloadCategorybrandhealthObject.SecondChoice[indexofBrandData] = element.Score;
                    }
                   // this.pptDownloadCategorybrandhealthObject.SecondChoice[indexofBrandData] = element.Score;
                    this.SecondChoice[indexofBrandData].base = this.ConsiderationBases[0];
                    if (element.previousScore && element.previousScore != undefined) {
                      this.SecondChoice[indexofBrandData].compareScore = Math.round(element.previousScore);
                      this.SecondChoice[indexofBrandData].compareBase = compareBase;
                    }
                    const showSig0 = this.ConsiderationDataTable[indChar].significance.get(element.SeriesName)[0];
                    if (showSig0 != undefined) {
                      this.SecondChoice[indexofBrandData].isSignificance = true;
                    }
                    break;
                  case "Consider":
                    this.Consider[indexofBrandData].Score = element.Score;
                    if(isNaN(element.Score)){
                      this.pptDownloadCategorybrandhealthObject.Consider[indexofBrandData] ='NaN';
                    }
                    else {
                    this.pptDownloadCategorybrandhealthObject.Consider[indexofBrandData] = element.Score;
                    }
                    this.Consider[indexofBrandData].base = this.ConsiderationBases[0];
                    if (element.previousScore && element.previousScore != undefined) {
                      this.Consider[indexofBrandData].compareScore = Math.round(element.previousScore);
                      this.Consider[indexofBrandData].compareBase = compareBase;
                    }
                    const showSig1 = this.ConsiderationDataTable[indChar].significance.get(element.SeriesName)[0];
                    if (showSig1 != undefined) {
                      this.Consider[indexofBrandData].isSignificance = true;
                    }
                    break;
                  case "Not consider":
                    this.NotConsider[indexofBrandData].Score = element.Score;
                    if(isNaN(element.Score)){
                      this.pptDownloadCategorybrandhealthObject.NotConsider[indexofBrandData] ='NaN';
                    }
                    else{
                    this.pptDownloadCategorybrandhealthObject.NotConsider[indexofBrandData] = element.Score;
                    }
                    this.NotConsider[indexofBrandData].base = this.ConsiderationBases[0];
                    if (element.previousScore && element.previousScore != undefined) {
                      this.NotConsider[indexofBrandData].compareScore = Math.round(element.previousScore);
                      this.NotConsider[indexofBrandData].compareBase = compareBase;
                    }
                    const showSig2 = this.ConsiderationDataTable[indChar].significance.get(element.SeriesName)[0];
                    if (showSig2 != undefined) {
                      this.NotConsider[indexofBrandData].isSignificance = true;
                    }
                    break;
  
                  case "1st/2nd Choice (net)":
                    this.Choices[indexofBrandData].Score = element.Score;
                    if(isNaN(element.Score)){
                      this.pptDownloadCategorybrandhealthObject.firstsecondchoice[indexofBrandData] ='NaN';
                    }
                    else{
                    this.pptDownloadCategorybrandhealthObject.firstsecondchoice[indexofBrandData] = element.Score;
                    }
                   // this.pptDownloadCategorybrandhealthObject.firstsecondchoice[indexofBrandData] = Math.round(element.Score);
                    this.Choices[indexofBrandData].base = this.ConsiderationBases[0];
                    if (element.previousScore && element.previousScore != undefined) {
                      this.Choices[indexofBrandData].compareScore = Math.round(element.previousScore);
                      this.Choices[indexofBrandData].compareBase = compareBase;
                    }
                    const showSig3 = this.ConsiderationDataTable[indChar].significance.get(element.SeriesName)[0];
                    if (showSig3 != undefined) {
                      this.Choices[indexofBrandData].isSignificance = true;
                    }
                    break;
                }
              });
              // if(this.FisrtChoice.length != 0 && this.SecondChoice.length != 0){
              //   this.Choices[indexofBrandData] = Math.round(this.FisrtChoice[indexofBrandData].Score) + (this.SecondChoice[indexofBrandData].Score);
              // }
            });
          if(brandcodes.length==count){
            this.considerChoiceHeights = [];
            this.FisrtChoice.forEach((el,i)=>{
              this.considerChoiceHeights.push(100);
            });
            this.FisrtChoice.forEach((el,i)=>{
              if(isNaN(el.Score)){
                this.FirstChoice1[i].Score=0;
              }
              else{
                this.FirstChoice1[i].Score=el.Score;
                this.considerChoiceHeights[i] = this.considerChoiceHeights[i] - el.Score; 
              }
              
            })
            this.SecondChoice.forEach((el,i)=>{
              if(isNaN(el.Score)){
                this.SecondChoice1[i].Score=0;
              }
              else{
                this.SecondChoice1[i].Score=el.Score;
                this.considerChoiceHeights[i] = this.considerChoiceHeights[i] - el.Score; 
              }
              
            })
            this.Consider.forEach((el,i)=>{
              if(isNaN(el.Score)){
                this.Consider1[i].Score=0;
              }
              else{
                this.Consider1[i].Score=el.Score;
                this.considerChoiceHeights[i] = this.considerChoiceHeights[i] - el.Score; 
              }
              
            })
            this.NotConsider.forEach((el,i)=>{
              if(isNaN(el.Score)){
                this.NotConsider1[i].Score=0;
              }
              else{
                this.NotConsider1[i].Score=el.Score;
                this.considerChoiceHeights[i] = this.considerChoiceHeights[i] - el.Score; 
              }
              
            })
          }
          }
        });
        this.hideLoader();
      });


      this.equitydata = [];
      this.equitydatawithbrandcode = [];
      this.equitydatawithbrandcode1 = [];
      this.equitychartArray.forEach(element => {
        element.addTableDataReady((output, datatable) => {
          this.isEquityLoader = true;
          this.equityBase.push(datatable.bases.get('Base').map(value => Math.round(value)));
          if (output.length == 3) {
            this.equitydataOutput = [];
            this.baseArrayEquity = [];
            this.baseeq = null;
            this.equitydataOutput.push(output[0]);
            this.equitydataOutput.push(output[1]);
            this.baseeq = datatable.bases.get('Base').map(value => Math.round(value))[0];
            for (let index = 0; index < brandcodes.length; index++) {
              this.baseArrayEquity.push(this.baseeq);
            }
            this.data1 = [];
            var code = 0;
            this.equitydataOutput.forEach(eqdt => {
              let compareScore = 0;
              let compareBase = 0;
              if (eqdt.previousScore && eqdt.previousScore != undefined) {
                compareScore = Math.round(eqdt.previousScore);
                compareBase = datatable.comparisonBases.get("Base")[0];
              }
              let showSig = false;
              if (datatable.significance.get(eqdt.SeriesName)[0] != undefined) {
                showSig = true;
              }
              this.equitydata.push({ 'Brandname': eqdt.SeriesName.split('-')[2].trim(), 'score': eqdt.Score, 'option': eqdt.SeriesName.split('-')[0].trim(), 'compareScore': compareScore, 'compareBase': compareBase, 'isSignificance': showSig })
              code = this.getCode(eqdt.SeriesName.split('-')[2].trim());
              this.brandArray.push(eqdt.SeriesName.split('-')[2].trim());
              this.countEquitytimes = this.brandArray.filter(item => item == eqdt.SeriesName.split('-')[2].trim()).length;
              if (this.countEquitytimes > 2) {

              }
              else {
                this.data1.push({ 'Brandname': eqdt.SeriesName.split('-')[2].trim(), 'score': Math.round(eqdt.Score), 'option': eqdt.SeriesName.split('-')[0].trim(), 'compareScore': compareScore, 'compareBase': compareBase, 'isSignificance': showSig });
              }
            })
          }
          else {
            code = 0;
            this.data1 = [];
          }
          if (this.countEquitytimes <= 2) {
            this.equitydatawithbrandcode.push({ 'Code': code, Data: this.data1, 'base': this.baseeq });
            this.equitydatawithbrandcode.sort((a, b) => b.Code - a.Code);
          }

          if ((this.equitydatawithbrandcode.length == brandcodes.length) && (this.equitydatawithbrandcode1.length < brandcodes.length)) {
            this.showLoader = false;
            var arr = [];
            this.equitydatawithbrandcode.forEach(element => {
              arr.push(element.Code);
            });

            brandcodes.forEach(el => {
              this.eqcheck = false;
              this.equitydatawithbrandcode.forEach(element => {
                this.eqcount++;
                var def = 0;
                if (parseInt(el) == element.Code) {
                  let indexofCodesInBrandMapping = brandcodes.indexOf(String(element.Code));
                  this.eqcheck = true;
                  this.equitydatawithbrandcode1[indexofCodesInBrandMapping] = ({ 'Code': element.Code, 'Data': element.Data, 'base': element.base });
                  if(isNaN(element.Data[0].score)){
                    this.pptDownloadCategorybrandhealthObject.Active[indexofCodesInBrandMapping] = 'NaN';
                  }
                  else{
                    this.pptDownloadCategorybrandhealthObject.Active[indexofCodesInBrandMapping] = element.Data[0].score;
                  }
                  if(isNaN(element.Data[1].score)){
                    this.pptDownloadCategorybrandhealthObject.Latent[indexofCodesInBrandMapping] = 'NaN';
                  }
                  else{
                    this.pptDownloadCategorybrandhealthObject.Latent[indexofCodesInBrandMapping] = element.Data[0].score;            
                  }
                   }
                else if (!arr.includes(parseInt(el)) && this.eqcount == this.equitydatawithbrandcode.length && this.eqcheck == false) {
                  element.Data.push({ 'Brandname': "", 'option': "", 'score': 0, 'compareScore': 0, 'compareBase': 0, 'isSignificance': false });
                  element.Data.push({ 'Brandname': "", 'option': "", 'score': 0, 'compareScore': 0, 'compareBase': 0, 'isSignificance': false });
                  element.Data[1].score = 0;
                  let indexofNotfoundData = brandcodes.indexOf(String(el));
                  this.equitydatawithbrandcode1[indexofNotfoundData] = { 'Code': parseInt(el), 'Data': element.Data, 'base': 0 };
                }
              })
              this.eqcheck = false;
              this.eqcount = 0;
            });
          }
          this.hideLoader();
        });
      });

      if(this.strongChartArray.length >0){
        this.strongdata = [];
        this.strongdata1 = [];
        this.strongdata2 = [];
        this.StrongScore=[];
        this.baseArrayStrong = [];
        this.strongloader = true;
        this.pptDownloadCategorybrandhealthObject.StrongRelationship = [];
        for(let i = 0; i < brandcodes.length; i++){
          this.strongdata.push({ 'Code': brandcodes[i], 'Score': 'NA', 'base': '', 'compareScore': 'NA', 'compareBase': '', 'isSignificance': false });
          this.pptDownloadCategorybrandhealthObject.StrongRelationship.push('NaN');   
          this.StrongScore.push('NA');     
        }
        this.strongChartArray.forEach(element => {
          element.addTableDataReady((output, datatable) => {
            this.isStrongLoader = true;
            var brandn = output[0].SeriesVariableID.replace('Relationship', '');
            if (brandn == "American") {
              brandn = "American Standard";
            }
            if(brandn == "Glaicer"){
              brandn = "Glacier Bay";
            }
            if(brandn == "Aqua"){
              brandn = "Aqua Source";
            }
            this.basere = null;
            this.brandStrongArray.push(brandn);
            this.basere = datatable.bases.get('Base').map(value => Math.round(value))[0];
            this.baseArrayStrong.push(this.basere)
            let bcode = this.getCode(brandn);
            let indexOfBrand = brandcodes.indexOf(bcode.toString());
            this.strongdata[indexOfBrand].Score = output[0].Score;
            this.strongdata[indexOfBrand].base = this.basere;
            this.strongdata[indexOfBrand].compareScore = output[0].previousScore == undefined ? 'NA': output[0].previousScore;
            this.strongdata[indexOfBrand].isSignificance = output[0].SignificanceSign == undefined || output[0].SignificanceSign == 0 ? false : true;
            this.check = true;          
            if(isNaN(output[0].Score)){
              this.pptDownloadCategorybrandhealthObject.StrongRelationship[indexOfBrand]='NaN';
            }
            else{
              this.pptDownloadCategorybrandhealthObject.StrongRelationship[indexOfBrand]=output[0].Score;
            }
           
            //this.pptDownloadCategorybrandhealthObject.StrongRelationship.push(output[0].Score);
            this.StrongScore[indexOfBrand]=Math.round(output[0].Score);
           // console.log(this.pptDownloadCategorybrandhealthObject);


            // this.countstrongtimes = this.brandStrongArray.filter(item => item == brandn).length;
            // if (this.countstrongtimes > 1) {
  
            // }
            // else {              
            //   this.baseArrayStrong.push(this.basere);
            //   let compareScore = 0;
            //   let compareBase = 0;
            //   if (datatable.comparisonBases.get("Base") != undefined) {
            //     compareBase = datatable.comparisonBases.get("Base")[0];
            //   }
            //   if (output[0].previousScore && output[0].previousScore != undefined) {
            //     compareScore = Math.round(output[0].previousScore)
            //   }
            //   let showSig = false;
            //   if (datatable.significance.get(output[0].SeriesName)[0] != undefined) {
            //     showSig = true;
            //   }
            //   this.strongdata.push({ 'Code': this.getCode(brandn), 'Score': output[0].Score, 'base': this.basere, 'compareScore': compareScore, 'compareBase': compareBase, 'isSignificance': showSig })
  
            //   this.strongdata.sort((a, b) => b.Code - a.Code);
            // }
            // if ((this.strongdata.length == this.strongCode.length) && (this.strongdata1.length < this.strongCode.length)) {
  
            //   var arr = [];
            //   this.strongloader = false;
            //   this.strongdata.forEach(element => {
            //     arr.push(element.Code);
            //   })
            //   this.strongCode.forEach(el => {
            //     this.strongdata.forEach(element => {
  
            //       if (element.Code == undefined) {
            //         element.Code = 0;
            //       }
            //       this.relcount++;
            //       if (parseInt(el) == element.Code) {
            //         this.relcheck == true;
            //         this.StrongBases.push(element.base);
            //         this.strongdata1.push({ 'Code': element.Code, 'Score': Math.round(element.Score), 'base': element.base, 'compareScore': element.compareScore, 'compareBase': element.compareBase, isSignificance: element.isSignificance });
            //       }
            //       else if (!arr.includes(parseInt(el)) && this.relcount == this.strongdata.length && this.relcheck == false) {
            //         this.strongdata1.push({ 'Code': parseInt(el), 'Score': element.Score, 'base': 0, 'compareScore': 0, 'compareBase': 0, isSignificance: false });
            //         this.StrongBases.push(0);
            //       }
            //     })
            //     this.relcheck = false;
            //     this.relcount = 0;
            //   })
            // }
            // if ((this.strongdata.length == this.strongCode.length) && (this.strongdata1.length == this.strongCode.length) && this.check == false) {
            //   brandcodes.forEach(element => {
            //     var count = this.strongCode.filter(item => item == element).length;
            //     if (count == 0) {
            //       this.strongdata2.push({ 'Code': parseInt(element), 'Score': 0, 'base': 0, 'compareScore': 0, 'compareBase': 0, isSignificance: false });
            //       this.pptDownloadCategorybrandhealthObject.StrongRelationship.push(0);
            //     }
            //     else {
            //       this.strongdata1.forEach(elementstrong => {
            //         if (elementstrong.Code == parseInt(element)) {
            //           this.strongdata2.push({ 'Code': elementstrong.Code, 'Score': elementstrong.Score, 'base': elementstrong.base, 'compareScore': elementstrong.compareScore, 'compareBase': elementstrong.compareBase, isSignificance: elementstrong.isSignificance });
            //           this.pptDownloadCategorybrandhealthObject.StrongRelationship.push(elementstrong.Score);
            //         }
            //       })
            //     }
            //   })
            //   this.check = true;
            // }
          });
          this.strongdata2 = this.strongdata;
            // if(this.pptDownloadCategorybrandhealthObject.StrongRelationship.length == 0){
            //   this.strongdata2.forEach((val, index)=>{
            //     this.pptDownloadCategorybrandhealthObject.StrongRelationship.push(val.Score == 'NA'? 0 : val.Score);
            //   });
            // }
        });
        this.hideLoader();
      }
      else{
        if(brandcodes.length > 0){
          this.pptDownloadCategorybrandhealthObject.StrongRelationship = [];
          this.strongdata2 = [];
          for(let i = 0; i < brandcodes.length; i++){
            this.strongdata2.push({ 'Code': brandcodes[i], 'Score': 'NA', 'base': '', 'compareScore': 'NA', 'compareBase': '', 'isSignificance': false });
            this.pptDownloadCategorybrandhealthObject.StrongRelationship.push(0);
          }
        }
        this.hideLoader();
      }
    }
  }

  hideLoader() {
    if (this.isUnaidedLoader == true && this.isTotalLoader == true && this.isConsiderationLoader == true && this.isEquityLoader == true && this.isStrongLoader == true) {
      setTimeout(function () { this.showLoader = false; }, 2000);
    }
  }
  updateDataTrends(category, brandsCode) {
    this.categoryBrandHealthTrendsPPTData = [];
    const categoryBrandHealthTrends: CategoryBrandHealthTrends = new CategoryBrandHealthTrends();
    if (this.period === 'Quarterly' || this.periodSeclected === 'tab1') {
      this.period = 'Quarterly';
      this.chartMap(categoryBrandHealthTrends, this.period, brandsCode, category);
    } else if (this.period === 'Annually' || this.periodSeclected === 'tab3') {
      this.period = 'Yearly';
      this.chartMap(categoryBrandHealthTrends, this.period, brandsCode, category);
    } else if (this.period === 'SemiAnnually' || this.periodSeclected === 'tab2') {
      this.period = 'Semiannual';
      this.chartMap(categoryBrandHealthTrends, this.period, brandsCode, category);
    }
    if (this.unaidedTrends && this.totalBrandsTrends && this.considerationFirstTrends && this.considerationSecondTrends
      && this.considerationConsiderTrends && this.considerationNotConsiderTrends && this.brandEquityActiveTrends
      && this.brandEquityLatentTrends) { }
    this.categoryBrandHealthTrendsPPTData.push(categoryBrandHealthTrends.categoryBrandHealthTrendsPPTData);
  }

  chartMap(ref, topBrake, brandsCode, category) {
    this.getfilterTrends();
    this.unaidedTrends = ref.getUnaided(topBrake, 'UNAIDED BRAND AWARENESS', brandsCode, category,this.filter);
    this.totalBrandsTrends = ref.getTotalBrand(topBrake, 'TOTAL BRAND AWARENESS', brandsCode, category,this.filter);
    this.considerationFirstTrends = ref.getConsiderationFirst(topBrake, 'CONSIDERATION - FIRST CHOICE', brandsCode, category,this.filter);
    this.considerationSecondTrends = ref.getConsiderationSecond(topBrake, 'CONSIDERATION - SECOND CHOICE', brandsCode, category,this.filter);
    this.considerationConsiderTrends = ref.getConsiderationConsider(topBrake, 'CONSIDERATION - CONSIDER', brandsCode, category,this.filter);
    this.considerationNotConsiderTrends = ref.getConsiderationNotConsider(topBrake, 'CONSIDERATION - NOT CONSIDER', brandsCode, category,this.filter);
    this.brandEquityActiveTrends = ref.getEquityActive(topBrake, 'BRAND EQUITY - ACTIVE', brandsCode, category,this.filter);
    this.brandEquityLatentTrends = ref.getEquityLatent(topBrake, 'BRAND EQUITY - LATENT', brandsCode, category,this.filter);
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
      this.showLoader = true;
      this.updateDataTrends(this.Category, this.brands.getBrandsCode());
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
      this.updateDataTrends(this.Category, this.brands.getBrandsCode());
      setTimeout(() => {
        this.onDataUpdate.next();
      });
      setTimeout(() => {
        this.showLoader = false;
      }, 5000);
    }
  }

  /**
   * To Convert Data into CSV Form
   */
  downloadExcelFile() {
    let csvData = [];
    this.getfilter();
    csvData.push(Object.assign({}, this.csvDetailCreation(this.brandNameCsv, ' ',[0])));
    csvData.push(Object.assign({}, this.csvDetailCreation(this.unaidedData, 'Unaided Brand Awareness', this.baseArrayUnaidedData)));
    csvData.push(Object.assign({}, this.csvDetailCreation(this.baseArrayUnaidedData, 'Base', [])));
    csvData.push(Object.assign({}, this.csvDetailCreation(this.totalBrandData, 'Total Brand (Aided + Unaided) Awareness', this.baseArrayTotalBrand)));
    csvData.push(Object.assign({}, this.csvDetailCreation(this.baseArrayTotalBrand, 'Base', [])));
    csvData.push(Object.assign({}, this.csvDetailCreation(this.Choices, '1st/2nd Choice(net)', this.baseArrayChoices)));
    csvData.push(Object.assign({}, this.csvDetailCreation(this.FisrtChoice, 'First Choice', this.baseArrayChoices)));
    csvData.push(Object.assign({}, this.csvDetailCreation(this.SecondChoice, 'Second Choice', this.baseArrayChoices)));
    csvData.push(Object.assign({}, this.csvDetailCreation(this.Consider, 'Consider', this.baseArrayChoices)));
    csvData.push(Object.assign({}, this.csvDetailCreation(this.NotConsider, 'Not Consider', this.baseArrayChoices)));
    csvData.push(Object.assign({}, this.csvDetailCreation(this.baseArrayChoices, 'Base', [])));
    csvData.push(Object.assign({}, this.csvDetailCreation(this.StrongScore, 'Strong Relationship', this.baseArrayChoices)));
    csvData.push(Object.assign({}, this.csvDetailCreation(this.baseArrayChoices, 'Base', [])));
    csvData.push(Object.assign({}, this.csvDetailCreation(this.equitydatawithbrandcode1, 'Equity Active', this.baseArrayEquity)));
    csvData.push(Object.assign({}, this.csvDetailCreation(this.equitydatawithbrandcode1, 'Equity Latent', this.baseArrayEquity)));
    csvData.push(Object.assign({}, this.csvDetailCreation(this.baseArrayEquity, 'Base', [])));
    this.csvOptions.headers=[];
    this.csvOptions.title = "Category Brand Health (%)";
    //this.csvOptions.headers = [" ", this.brandNameCsv];
    this.csvOptions.headers = ["Filter(s)", this.filter];
    // this.csvOptions.headers.push('Base');
    new AngularCsv(csvData, "Category Brand Health", this.csvOptions);
  }
  csvDetailCreation(data, sideBreak, base?) {
    let csvDetail = [];
    csvDetail.push(sideBreak);
    if(sideBreak===' '){
      csvDetail.push(data);
    }
    else{
    data.forEach((val, index) => {
      let value = null;
      if (base.length) {
        if (sideBreak == 'Equity Active') {
          value = this.scoreAndBase.transform(val.Data[0].score, base[index])
        }
        else if (sideBreak == 'Equity Latent') {
          value = this.scoreAndBase.transform(val.Data[1].score, base[index])
        } else {
          const score = val.Score ? val.Score : val
          value = this.scoreAndBase.transform(score, base[index])
        }
        csvDetail.push(value);
      } else {
        csvDetail.push(val);
      }
    })
  }
    // csvDetail.push(base);
    return csvDetail;
  }
  ngOnDestroy(): void {
    this.updateDataUnsubscribe.next();
    this.updateDataUnsubscribe.complete();
  }
  // hideloader() {
  //   const loader = [this.unaided.showLoader];
  //   if (loader.reduce((prev, curr) => prev || curr, false) === false) {
  //     this.showLoader = false;
  //   }
  // }
  CategaryMapCodes(codes): any {
    if (this.Category == "Faucet") {
      var excludecodes = ['9', '10', '11', '19'];
      var newcodelist = [];
      newcodelist = Array.from(codes);
      excludecodes.forEach(element => {
        codes.forEach((codeel, index) => {
          if (element == codeel) {
            newcodelist = newcodelist.filter(obj => obj !== codeel);
          }
        });
      })
      return newcodelist;
    }
    else if (this.Category == "Showerhead") {
      var excludecodes = ['10', '22', '24', '32', '41'];
      var newcodelist = [];
      newcodelist = Array.from(codes);
      excludecodes.forEach((element, index) => {
        codes.forEach(codeel => {
          if (element == codeel) {
            newcodelist = newcodelist.filter(obj => obj !== codeel);
          }
        });

      })
      return newcodelist;
    }
    else if (this.Category == "Toilet") {
      var excludecodes = ['12', '14', '15', '16', '17', '18', '20', '19'];
      var newcodelist = [];
      newcodelist = Array.from(codes);
      excludecodes.forEach((element, index) => {
        codes.forEach(codeel => {
          if (element == codeel) {
            newcodelist = newcodelist.filter(obj => obj !== codeel);
          }
        });

      })
      return newcodelist;
    }
    else if (this.Category == "TubShowerUnit") {
      var excludecodes = ['18', '25', '26', '27', '30', '31'];
      var newcodelist = [];
      newcodelist = Array.from(codes);
      excludecodes.forEach((element, index) => {
        codes.forEach(codeel => {
          if (element == codeel) {
            newcodelist = newcodelist.filter(obj => obj !== codeel);
          }
        });
      })
    }
    return newcodelist;
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
  /**
   * Set Consider's score stack height
   */
  // setConsiderStackHeight(FirstChoice,SecondChoice,Consider,NotConsider){
  //   let height = 100;
  //   // if(FirstChoice >= 0 && SecondChoice >= 0 && Consider >= 0 && NotConsider >= 0 ){
  //   //   height = 100-(FirstChoice+SecondChoice+Consider+NotConsider)
  //   // }
  //   if(FirstChoice==0 &&SecondChoice==0 &&Consider==0 && NotConsider==0){
  //     height = 20;
  //   }
  //   if(!isNaN(FirstChoice) && FirstChoice > 0){
  //     height = height-FirstChoice
  //   }
  //   if(!isNaN(SecondChoice) && SecondChoice > 0){
  //     height = height-SecondChoice
  //   }
  //   if(!isNaN(Consider) && Consider > 0){
  //     height = height-Consider
  //   }
  //   if(!isNaN(NotConsider) && NotConsider > 0){
  //     height = height-NotConsider;
  //   }
    
  //   return height;
  // }
}
