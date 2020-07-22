import { Component, OnInit, Output } from '@angular/core';
import { Chart } from '../../shell/models/chart';
import { OverallSnapshot } from '../../model/overallSnapshot';
import { Subject } from 'rxjs';
import { TableOutput } from '../../shell/interfaces/table-output';
import { FilterService } from 'src/app/shell/services/filter.service';
import { OverallBrandHealth } from 'src/app/model/OverallBrandHealth';
import { FilterConfigService } from 'src/app/service/filter-config.service';
import { Brands } from 'src/app/model/brands';
import { AssetMappings } from 'src/app/model/asset.mappings';
import { takeUntil } from 'rxjs/operators';
import { AngularCsv } from 'angular7-csv/dist/Angular-csv';
import { element } from 'protractor';
import { Collection } from 'src/app/shell/models/collection';
import { CollectionOutput } from 'src/app/shell/models/collectionOutput';
import { DataTable } from 'src/app/shell/models/dataTable';
import { PptExportService } from 'src/app/service/ppt-export.service';
import { OverallBrandHealthTrends } from './overallBrandHealthTrends';
import { FilterHideService } from 'src/app/service/filter-hide.service';
import { AppliedFilterSetService } from 'src/app/service/applied-filter-set.service';
import { ActivatedRoute } from '@angular/router';
import { ScoreAndBasePipe } from 'src/app/pipe/score-and-base.pipe';

@Component({
  selector: 'app-brand-health',
  templateUrl: './brand-health.component.html',
  styleUrls: ['./brand-health.component.css'],
  providers: [ScoreAndBasePipe]
})
export class BrandHealthComponent implements OnInit {
  private brandname: Number;
  brandSequenceArray: Array<string> = new Array<string>();
  unaided: Chart;
  unaidedBases: number;
  updateDataUnsubscribe: Subject<any> = new Subject<any>();

  unaidedData: Array<any> = new Array<any>();
  dtunaidedDataCsv: Array<any> = new Array<any>();
  unaidedCompareBase: any;
  showUnaidedSigArraow: Array<boolean> = new Array<boolean>();

  totalBrand: Chart;
  totalBrandData: Array<any> = new Array<any>();
  TotalBases: number;
  totalCompareBase: any;
  showTotalAdSigArray: Array<boolean> = new Array<boolean>();

  advertising: Chart;
  advertisingData: Array<any> = new Array<any>();
  advertisingBases: number;
  adverCompareBase: any;
  showAdvSigArray: Array<boolean> = new Array<boolean>();

  cosnsumerBrandRelationBase: Array<any> = new Array<any>();
  cosnsumerBrandRelation: Array<Chart> = new Array<any>();
  cosnsumerBrandRelation1: Array<Chart> = new Array<any>();

  customerRelationData: Array<TableOutput> = new Array<any>();
  STRONGData: Array<TableOutput> = new Array<any>();
  WeakData: Array<TableOutput> = new Array<any>();
  AtRisk: Array<TableOutput> = new Array<any>();

  strongExcelData: Array<any> = new Array<any>();
  weakExcelData: Array<any> = new Array<any>();
  atRiskExcelData: Array<any> = new Array<any>();

  brandList: Array<string>;
  onDataUpdate: Subject<any> = new Subject();
  showloader: boolean;
  brandCodes = AssetMappings.brandNameAndCodes;
  CBRBases: Number;
  urlfile: any;
  filter: string;
  public showChart = false;
  public showTrends = false;
  selectedTab: any;
  period = 'Quarterly';
  periodSeclected = 'tab1';
  brandsToGo: any;
  unaidedTrends: any;
  totalBrandsTrends: any;
  advertisingTrends: any;
  strongCbrTrends: any;
  weakCbrTrends: any;
  riskCbrTrends: any;

  pptDownloadObject = {
    'Brand': [],
    'filter':'',
    'Unaided_Brand': [],
    'Totalbrand': [],
    'Advertising': [],
    'CBR': [],
    'Bases':[]
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

  brandMapping = AssetMappings.brandCodeByName;
  baseArrayUnaidedData: Array<any> = new Array<any>();

  unaidedComparisionData: Array<any> = new Array<any>();
  totalComparisionData: Array<any> = new Array<any>();
  advComparisionData: Array<any> = new Array<any>();

  cbrSigTestingShowArrow: Array<any> = new Array<any>();

  initPara() {
    this.STRONGData = [];
    this.WeakData = [];
    this.AtRisk = [];
    this.cosnsumerBrandRelation = [];
    this.totalBrandData = [];
    this.unaidedData = [];
    this.advertisingData = [];
    this.baseArrayUnaidedData = [];
    this.atRiskExcelData = [];
    this.strongExcelData = [];
    this.weakExcelData = [];
    this.pptDownloadObject = {
      'Brand': [],
      'filter':'',
      'Unaided_Brand': [],
      'Totalbrand': [],
      'Advertising': [],
      'CBR': [],
      'Bases':[]
    };
    this.brandSequenceArray = [];
    this.unaidedComparisionData = [];
    this.totalComparisionData = [];
    this.advComparisionData = [];
    this.showUnaidedSigArraow = [];
    this.showTotalAdSigArray = [];
    this.showAdvSigArray = [];
    this.cbrSigTestingShowArrow = [];
  }
  hideFilterForTrends: boolean = false;

  brandNameCsv: Array<string>;
  overallBrandHealthTrendsPPTData: Array<any> = new Array<any>();
  constructor(private filterService: FilterService, private pptexport: PptExportService,
    private filterConfigService: FilterConfigService, private hideFilterTrends: FilterHideService, private scoreAndBase: ScoreAndBasePipe,
    private appliedFilterSet: AppliedFilterSetService, private route: ActivatedRoute) {
    this.filterConfigService.initializeOverallBrandHealth();
  }

  ngOnInit() {
    this.updateData();

    this.route.params.subscribe(params => {
      if(this.filterService.getAppliedFilters().size===0){
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
        // this.appliedFilterSet.selectedChoicesFilterTransfer(value);
        // value = this.appliedFilterSet.returnIt();
        this.updateData();
        setTimeout(() => {
          this.onDataUpdate.next();
        });
      });
    // if (this.appliedFilterSet.choices.length > 0) {
    //   this.filterService.setChoices(this.appliedFilterSet.variable, this.appliedFilterSet.choices);
    // }
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
  downloadPPT() {
    this.showloader = true;
    this.getfilter();
  this.pptDownloadObject.filter=this.filter;  
  if(this.pptDownloadObject.Brand.length!=this.pptDownloadObject.CBR.length){
  this.pptDownloadObject.Brand.forEach((el,i)=>{
    if(this.pptDownloadObject.CBR[i]){

    }
    else{
     let obj = [0,0,0];
      this.pptDownloadObject.CBR[i]=obj;
    }
  })
}
if(this.pptDownloadObject.Brand.length!=this.pptDownloadObject.Advertising.length){
  this.pptDownloadObject.Brand.forEach((el,i)=>{
    if(this.pptDownloadObject.Advertising[i]){

    }
    else{
     let obj = 0;
      this.pptDownloadObject.Advertising[i]=obj;
    }
  })
}
  let obj1=JSON.stringify(this.pptDownloadObject);
    this.pptexport.postPPTForDownload(JSON.stringify(obj1)).subscribe((data) => {
      let blob = new Blob([data], { type: "application/octet-stream" });
      let url = window.URL.createObjectURL(blob);
      let a = document.createElement("a");
      document.body.appendChild(a);
      a.href = url;
      a.download = 'OverallBrandHealth_PPT.zip';
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
      this.showloader = false;
    }, error => {
      console.log(error);
      this.showloader = false;
    });
  }

  downloadPptTrends() {
    const overallBrandHealthTrends: OverallBrandHealthTrends = new OverallBrandHealthTrends();
    if (this.unaidedTrends && this.totalBrandsTrends && this.advertisingTrends
      && this.strongCbrTrends && this.weakCbrTrends && this.riskCbrTrends) {
      this.showloader = true;
      const objnew = JSON.stringify(this.overallBrandHealthTrendsPPTData[0]);
      this.pptexport.postPPTForTrends(objnew).subscribe((data) => {
        const blob = new Blob([data], { type: 'application/octet-stream' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        document.body.appendChild(a);
        a.href = url;
        a.download = 'OverallBrandHealth_Trends_PPT.zip';
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove();
        this.showloader = false;
      }, error => {
        console.log(error);
        this.showloader = false;
      });
    }
  }

  updateData() {
    // this.toggleChart('chartsTabs');
    this.hideFilterForTrends = false;
    this.hideFilterTrends.sendBooleanFlag(this.hideFilterForTrends);
    this.initPara();
    this.showloader = true;
    const brands = new Brands(this.filterService);
    this.brandsToGo = brands;
    this.brandList = brands.getBrandsCode().map(val => AssetMappings.logoByBrandCode[val]);
    this.brandNameCsv = brands.getBrandsCode().map((val) => this.brandCodes[val]);
    this.brandSequenceArray = brands.getBrandsCode();
    this.brandSequenceArray.forEach(element => {
      this.pptDownloadObject.Brand.push(AssetMappings.brandNameAndCodes[element]);
    });

    const snapshot: OverallBrandHealth = new OverallBrandHealth();
    this.unaided = snapshot.getUnaided(brands.getBrandsCode());
    this.unaided.addTableDataReady((output, dataTable) => {
      this.baseArrayUnaidedData = [];
      this.hideloader();
      this.unaidedCompareBase = 0;
      this.showUnaidedSigArraow = [];
      this.pptDownloadObject.Bases=[];
      this.unaidedBases = dataTable.bases.get('Base').map(value => Math.round(value))[0];
     // this.pptDownloadObject.Bases.push(dataTable.bases.get('Base').map(value => Math.round(value))[0]);
      if (dataTable.comparisonBases.get('Base') != undefined) {
        this.unaidedCompareBase = dataTable.comparisonBases.get('Base');
      }
      this.unaidedData = [];
      output.forEach((val, ind) => {
        if(val.SeriesName !== "No Answer"){
          if (this.brandSequenceArray.indexOf(val.SeriesCode) > -1) {
            this.baseArrayUnaidedData.push(this.unaidedBases);
            const indexToBeAdd = this.brandSequenceArray.indexOf(val.SeriesCode);
            // let unaidData = 0;
            // if (!isNaN(val.Score) && !(typeof val.Score === 'string')) {
            //   unaidData = val.Score;
            // }
            this.unaidedData[indexToBeAdd] = val.Score;
            this.pptDownloadObject.Bases.push(dataTable.bases.get('Base').map(value => Math.round(value))[0]);
            this.unaidedComparisionData[indexToBeAdd] = 0;
            this.showUnaidedSigArraow[indexToBeAdd] = false;
            if (val.previousScore && val.previousScore != undefined) {
              this.unaidedComparisionData[indexToBeAdd] = Math.round(val.previousScore);
            }
            if(val.SignificanceSign && val.SignificanceSign !== undefined && val.SignificanceSign !== 0){
              // const showSig = dataTable.significance.get(val.SeriesName)[0];
              if ( val.SignificanceSign !== undefined) {
                this.showUnaidedSigArraow[indexToBeAdd] = true;
              }
            }
          }
        }
      });
      if (this.unaidedData.length > 0) {
        this.unaidedData.forEach((val, index) => {
          this.pptDownloadObject.Unaided_Brand.push(val);
        });
      }
    });

    this.totalBrand = snapshot.getTotalBrand(brands.getBrandsCode());
    this.totalBrand.addTableDataReady((output, dataTable) => {
      this.hideloader();
      this.totalBrandData = [];
      this.totalCompareBase = 0;
      this.showTotalAdSigArray = [];
      if (dataTable.comparisonBases.get('Base') != undefined) {
        this.totalCompareBase = dataTable.comparisonBases.get('Base');
      }
      this.TotalBases = dataTable.bases.get('Base').map(value => Math.round(value))[0];
      output.forEach((val, ind) => {
        if (this.brandSequenceArray.indexOf(val.SeriesCode) > -1) {
          const indexToBeAdd = this.brandSequenceArray.indexOf(val.SeriesCode);
          // let totData = 0;
          // if (!isNaN(val.Score) && !(typeof val.Score === 'string')) {
          //   totData = val.Score;
          // }
          this.totalBrandData[indexToBeAdd] = val.Score;
          this.totalComparisionData[indexToBeAdd] = 0;
          this.showTotalAdSigArray[indexToBeAdd] = false;
          if (val.previousScore && val.previousScore !== undefined) {
            this.totalComparisionData[indexToBeAdd] = Math.round(val.previousScore);
          }
          if(val.SignificanceSign && val.SignificanceSign !== undefined && val.SignificanceSign !== 0){
            if ( val.SignificanceSign !== undefined) {
              this.showTotalAdSigArray[indexToBeAdd] = true;
            }
          }
          // const showSig = dataTable.significance.get(val.SeriesName)[0];
          // if (showSig != undefined && showSig !== 0) {
          //   this.showTotalAdSigArray[indexToBeAdd] = true;
          // }
        }
      });
      if (this.totalBrandData.length > 0) {
        this.totalBrandData.forEach((val, index) => {
          this.pptDownloadObject.Totalbrand.push(val);
        });
      }
    });

    this.advertising = snapshot.getAdvertising(brands.getBrandsCode());
    this.advertising.addTableDataReady((output, dataTable) => {
      this.hideloader();
      this.advertisingData = [];
      this.adverCompareBase = 0;
      this.showAdvSigArray = [];
      this.advertisingBases = dataTable.bases.get('Base').map(value => Math.round(value))[0];
      if (dataTable.comparisonBases.get('Base') != undefined) {
        this.adverCompareBase = dataTable.comparisonBases.get('Base');
      }
      output.forEach((val, ind) => {
        if (this.brandSequenceArray.indexOf(val.SeriesCode) > -1) {
          const indexToBeAdd = this.brandSequenceArray.indexOf(val.SeriesCode);
          // let advData = 0;
          // if (!isNaN(val.Score) && !(typeof val.Score === 'string')) {
          //   advData = val.Score;
          // }
          this.advertisingData[indexToBeAdd] = val.Score;
          this.advComparisionData[indexToBeAdd] = 0;
          this.showAdvSigArray[indexToBeAdd] = false;
          if (val.previousScore && val.previousScore !== undefined) {
            this.advComparisionData[indexToBeAdd] = Math.round(val.previousScore);
          }
          if(val.SignificanceSign && val.SignificanceSign !== undefined && val.SignificanceSign !== 0){
            if ( val.SignificanceSign !== undefined) {
              this.showAdvSigArray[indexToBeAdd] = true;
            }
          }
          // const showSig = dataTable.significance.get(val.SeriesName)[0];
          // if (showSig != undefined) {
          //   this.showAdvSigArray[indexToBeAdd] = true;
          // }
        }
      });
      if (this.advertisingData.length > 0) {
        this.advertisingData.forEach((val, index) => {
          this.pptDownloadObject.Advertising.push(val);
        });
      }
    });

    this.cosnsumerBrandRelation = snapshot.getCustomerBrandRelationship(brands.getBrandsCode());
    this.cosnsumerBrandRelationBase = [];
    if (this.cosnsumerBrandRelation.length > 0) {
      this.cosnsumerBrandRelation.forEach((val, index) => {
        if (val) {
          val.addCalculationLogic((output: CollectionOutput) => {
            output.TableOutput.forEach(val => {
              val.forEach(value => {
                value.Score = Math.round(value.Score);
              });
            });
            if (output.Bases.get("Consumer Brand Relationship") != undefined) {
              this.cosnsumerBrandRelationBase.push(output.Bases.get("Consumer Brand Relationship")[0].Score);
            }
            return output;
          })
        }
      })
    }

    if (brands.getBrandsCode().length > 0) {
      this.cbrSigTestingShowArrow = [];
      for (let i = 0; i < brands.getBrandsCode().length; i++) {
        this.cbrSigTestingShowArrow.push({
          'isStrongSig': 0, 'strongScore': 0, 'strongCompareScore': 0,
          'isWeakSig': 0, 'weakScore': 0, 'weakCompareScore': 0, 'isRiskSig': 0, 'atRiskScore': 0, 'atRiskCompareScore': 0
        })
      }
    }
    this.cosnsumerBrandRelation1 = snapshot.getCustomerBrandRelationship1(brands.getBrandsCode());
    var brandStrongArray = [];
    // this.cbrSigTestingShowArrow = [{'isStrongSig': 0, 'strongScore':0,'strongCompareScore':0,
    // 'isWeakSig': 0, 'weakScore': 0,'weakCompareScore':0, 'isRiskSig': 0, 'atRiskScore': 0, 'atRiskCompareScore': 0}];
    this.cosnsumerBrandRelation1.forEach(element => {
      element.addTableDataReady((Output, DataTable) => {
        const arrayData = [];
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
        this.CBRBases = DataTable.bases.get('Base').map(value => Math.round(value))[0];
        var brandn = Output[0].SeriesVariableID.replace('Relationship', '');
        this.hideloader();
        if (brandn == 'American') {
          brandn = "American Standard";
        }
        if( brandn == 'Aqua'){
          brandn = "Aqua Source";
        }
        if(brandn == "Glaicer"){
          brandn = "Glacier Bay";
        }
        var code = this.getCode(brandn);
        brandStrongArray.push(brandn);
        const indextobeAdd = this.brandSequenceArray.indexOf(code.toString());
        Output.forEach((val, index) => {
          if (val.SeriesName == "STRONG (NET)") {
            this.strongExcelData[indextobeAdd] = Math.round(val.Score);
            arrayData.push(val.Score);
            compareObject.strongScore = Math.round(val.Score);
            if (val.previousScore && val.previousScore != undefined && val.SignificanceSign && val.SignificanceSign != undefined) {
              compareObject.strongCompareScore = Math.round(val.previousScore);
              compareObject.isStrongSig = val.SignificanceSign;
            }
            else {
              compareObject.strongCompareScore = 0;
              compareObject.isStrongSig = 0;
            }
          }
          if (val.SeriesName == "Weak (NET)") {
            this.weakExcelData[indextobeAdd] = Math.round(val.Score);
            arrayData.push(val.Score);
            compareObject.weakScore = Math.round(val.Score);
            if (val.previousScore && val.previousScore != undefined && val.SignificanceSign && val.SignificanceSign != undefined) {
              compareObject.weakCompareScore = Math.round(val.previousScore);
              compareObject.isWeakSig = val.SignificanceSign;
            }
            else {
              compareObject.weakCompareScore = 0;
              compareObject.isWeakSig = 0;
            }
          }
          if (val.SeriesName == "At Risk (NET)") {
            this.atRiskExcelData[indextobeAdd] = Math.round(val.Score);
            arrayData.push(val.Score);
            compareObject.atRiskScore = Math.round(val.Score);
            if (val.previousScore && val.previousScore != undefined && val.SignificanceSign && val.SignificanceSign != undefined) {
              compareObject.atRiskCompareScore = Math.round(val.previousScore);
              compareObject.isRiskSig = val.SignificanceSign;
            }
            else {
              compareObject.atRiskCompareScore = 0;
              compareObject.isRiskSig = 0;
            }
          }
          if(DataTable.comparisonBases.get('Base') !== undefined){
            compareObject.compareBase = DataTable.comparisonBases.get('Base')[0];
          }
        });
        this.cbrSigTestingShowArrow[indextobeAdd] = compareObject;
        const indexOfBrandArrayData = this.pptDownloadObject.Brand.indexOf(brandn);
        this.pptDownloadObject.CBR[indexOfBrandArrayData] = arrayData;
      });
    });
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
  updateDataTrends(brands) {
    this.overallBrandHealthTrendsPPTData = [];
    this.getfilterTrends()
    const overallBrandHealthTrends: OverallBrandHealthTrends = new OverallBrandHealthTrends();
    if (this.period === 'Quarterly' || this.periodSeclected === 'tab1') {
      this.unaidedTrends = overallBrandHealthTrends.getUnaided('Quarterly', 'UNAIDED BRAND AWARENESS', brands,this.filter);
      this.totalBrandsTrends = overallBrandHealthTrends.getTotalBrand('Quarterly', 'TOTAL BRAND AWARENESS', brands,this.filter);
      this.advertisingTrends = overallBrandHealthTrends.getAdvertising('Quarterly', 'ADVERTISING AWARENESS', brands,this.filter);
      this.strongCbrTrends = overallBrandHealthTrends.getStrongCustomerBrandRelationship('Quarterly', 'CUSTOMER BRAND RELATIONSHIP (CBR) - STRONG (NET)', brands,this.filter);
      this.weakCbrTrends = overallBrandHealthTrends.getWeakCustomerBrandRelationship('Quarterly', 'CUSTOMER BRAND RELATIONSHIP (CBR) - WEAK (NET)', brands,this.filter);
      this.riskCbrTrends = overallBrandHealthTrends.getRiskCustomerBrandRelationship('Quarterly', 'CUSTOMER BRAND RELATIONSHIP (CBR) - AT RISK (NET)', brands,this.filter);
    } else if (this.period === 'Annually' || this.periodSeclected === 'tab3') {
      this.unaidedTrends = overallBrandHealthTrends.getUnaided('Yearly', 'UNAIDED BRAND AWARENESS', brands,this.filter);
      this.totalBrandsTrends = overallBrandHealthTrends.getTotalBrand('Yearly', 'TOTAL BRAND AWARENESS', brands,this.filter);
      this.advertisingTrends = overallBrandHealthTrends.getAdvertising('Yearly', 'ADVERTISING AWARENESS', brands,this.filter);
      this.strongCbrTrends = overallBrandHealthTrends.getStrongCustomerBrandRelationship('Yearly', 'CUSTOMER BRAND RELATIONSHIP (CBR) - STRONG (NET)', brands,this.filter);
      this.weakCbrTrends = overallBrandHealthTrends.getWeakCustomerBrandRelationship('Yearly', 'CUSTOMER BRAND RELATIONSHIP (CBR) - WEAK (NET)', brands,this.filter);
      this.riskCbrTrends = overallBrandHealthTrends.getRiskCustomerBrandRelationship('Yearly', 'CUSTOMER BRAND RELATIONSHIP (CBR) - AT RISK (NET)', brands,this.filter);
    } else if (this.period === 'SemiAnnually' || this.periodSeclected === 'tab2') {
      this.unaidedTrends = overallBrandHealthTrends.getUnaided('Semiannual', 'UNAIDED BRAND AWARENESS', brands,this.filter);
      this.totalBrandsTrends = overallBrandHealthTrends.getTotalBrand('Semiannual', 'TOTAL BRAND AWARENESS', brands,this.filter);
      this.advertisingTrends = overallBrandHealthTrends.getAdvertising('Semiannual', 'ADVERTISING AWARENESS', brands,this.filter);
      this.strongCbrTrends = overallBrandHealthTrends.getStrongCustomerBrandRelationship('Semiannual', 'CUSTOMER BRAND RELATIONSHIP (CBR) - STRONG (NET)', brands,this.filter);
      this.weakCbrTrends = overallBrandHealthTrends.getWeakCustomerBrandRelationship('Semiannual', 'CUSTOMER BRAND RELATIONSHIP (CBR) - WEAK (NET)', brands,this.filter);
      this.riskCbrTrends = overallBrandHealthTrends.getRiskCustomerBrandRelationship('Semiannual', 'CUSTOMER BRAND RELATIONSHIP (CBR) - AT RISK (NET)', brands,this.filter);
    }
    if (this.unaidedTrends && this.totalBrandsTrends && this.advertisingTrends
      && this.strongCbrTrends && this.weakCbrTrends && this.riskCbrTrends) {
      this.overallBrandHealthTrendsPPTData.push(overallBrandHealthTrends.overallBrandHealthTrendsPPTData);
    }
  }

  toggleChart(tab) {
    this.hideFilterForTrends = false;
    this.hideFilterTrends.sendBooleanFlag(this.hideFilterForTrends);
    this.selectedTab = tab;
    this.showChart = false;
    this.showTrends = false;
    if (this.selectedTab === 'chartsTabs') {
      this.updateData();
      setTimeout(() => {
        this.onDataUpdate.next();
      });
    }
  }

  toggleTrends(tab) {
    this.selectedTab = tab;
    this.hideFilterForTrends = true;
    this.hideFilterTrends.sendBooleanFlag(this.hideFilterForTrends);
    this.showTrends = true;
    this.showChart = true;
    if (this.selectedTab === 'trendsTabs') {
      this.showloader = true;
      this.updateDataTrends(this.brandsToGo.getBrandsCode());
      setTimeout(() => {
        this.onDataUpdate.next();
      });
      setTimeout(() => {
        this.showloader = false;
      }, 5000);
    }
  }

  changeTimePeriod(period, periodSeclected) {
    this.period = period;
    this.periodSeclected = periodSeclected;
    if (this.selectedTab === 'trendsTabs') {
      this.showloader = true;
      this.updateDataTrends(this.brandsToGo.getBrandsCode());
      setTimeout(() => {
        this.onDataUpdate.next();
      });
      setTimeout(() => {
        this.showloader = false;
      }, 5000);
    }
  }

  hideloader() {
    const loader = [this.advertising.showLoader, this.totalBrand.showLoader, this.unaided.showLoader];
    if (loader.reduce((prev, curr) => prev || curr, false) === false) {
      setTimeout(() => {
        this.showloader = false;
      }, 2500);
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
    csvData.push(Object.assign({}, this.csvDetailCreation(this.totalBrandData, 'Total Brand (Aided + Unaided) Awareness', this.baseArrayUnaidedData)));
    csvData.push(Object.assign({}, this.csvDetailCreation(this.advertisingData, 'Advertising Awareness', this.baseArrayUnaidedData)));
    csvData.push(Object.assign({}, this.csvDetailCreation(this.strongExcelData, 'Strong (NET)', this.baseArrayUnaidedData)));
    csvData.push(Object.assign({}, this.csvDetailCreation(this.weakExcelData, 'Weak (NET)', this.baseArrayUnaidedData)));
    csvData.push(Object.assign({}, this.csvDetailCreation(this.atRiskExcelData, 'At Risk (NET)', this.baseArrayUnaidedData)));
    csvData.push(Object.assign({}, this.csvDetailCreation(this.baseArrayUnaidedData, 'Base', this.baseArrayUnaidedData)));
    this.csvOptions.title = "Brand Health";
    this.csvOptions.headers = ["Filters", this.filter];
  //  this.csvOptions.headers = [" ", this.brandNameCsv];
    new AngularCsv(csvData, "Brand Health", this.csvOptions);
  }
  csvDetailCreation(data, sideBreak, base) {
    let csvDetail = [];
    csvDetail.push(sideBreak);
     if(sideBreak === ' '){
      csvDetail.push(data);
    }
    else{
    data.forEach((val, index) => {
      if (sideBreak === 'Base') {
        csvDetail.push(val);
      }
     
       else {
        val = this.scoreAndBase.transform(val, base[index]);
        csvDetail.push(val);
      }
    });
  }
    return csvDetail;
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
