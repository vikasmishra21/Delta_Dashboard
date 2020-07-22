import { Component, OnInit } from '@angular/core';
import { FilterService } from 'src/app/shell/services/filter.service';
import { ActivatedRoute } from '@angular/router';
import { FilterConfigService } from 'src/app/service/filter-config.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Brands } from 'src/app/model/brands';
import { ConversionRecursion } from 'src/app/model/Conversion';
import { Chart } from 'src/app/shell/models/chart';
import { TableOutput } from 'src/app/shell/interfaces/table-output';
import { AssetMappings } from 'src/app/model/asset.mappings';
import { AngularCsv } from 'angular7-csv/dist/Angular-csv';
import { base } from 'src/app/shell/operators/chart.operators';
import { ScoreAndBasePipe } from 'src/app/pipe/score-and-base.pipe';
import { FilterOption } from 'src/app/shell/models/filterOption';
import { PptExportService } from 'src/app/service/ppt-export.service';
import { AppliedFilterSetService } from 'src/app/service/applied-filter-set.service';
import { FilterHideService } from 'src/app/service/filter-hide.service';

@Component({
  selector: 'app-conversion',
  templateUrl: './conversion.component.html',
  styleUrls: ['./conversion.component.css'],
  providers: [ScoreAndBasePipe]
})
export class ConversionComponent implements OnInit {
  selectedTab: string;
  viewMode: string;
  Category: string;
  categoryHeading: string;
  Brandlist: any;
  optionSelectionUnsubscribe: Subject<any> = new Subject<any>();
  onDataUpdate: Subject<any> = new Subject();
  Retentionchart: Array<Chart> = new Array<any>();
  Conversionchart: Array<Chart> = new Array<any>();
  brandcodes: Array<string>;
  ConversionData: Array<any> = new Array<any>();

  ConversionData1: Array<any> = new Array<any>();
  ConversionCodeRepeat: Array<number>;
  RetentionCodeRepeat: Array<number>;
  check: boolean;
  checkRetention: boolean;
  RetentionData: Array<any> = new Array<any>();
  RetentionData1: Array<any> = new Array<any>();
  logoByBrandCode = AssetMappings.logoByBrandCode;
  dtRecentPurchase: Array<{ type: string, Data: Array<number> }>;
  dtConversion: Array<{ type: string, Data: Array<any> }>;
  dtRetention: Array<{ type: string, Data: Array<any> }>;
  showLoader: boolean;
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
  filter:string;
  pptDownloadObjectConversion = {
    'brands': [],
    'serieswisedata': [],
    'category': '',
    'filter': '',
    'bases': []
  };
  pptDownloadObjectRetention = {
    'brands': [],
    'serieswisedata': [],
    'category': '',
    'filter': '',
    'bases': []
  };
  BrandCodewiseMapping = AssetMappings.brandNameAndCodes;

  brandMapping = AssetMappings.brandCodeByName;

  converstionBase: Array<number> = new Array<number>();
  retentionBase: Array<number> = new Array<number>();
  timePeriodChips: Map<string, Array<FilterOption>> = new Map<string, Array<FilterOption>>();
  hideFilterForTrends: boolean = false;
  constructor(private filterService: FilterService, private pptexport: PptExportService, private route: ActivatedRoute,
    private filterConfigService: FilterConfigService, private socreAndBase: ScoreAndBasePipe,
    private appliedFilterSet: AppliedFilterSetService, private hideFilterTrends: FilterHideService) {
    this.route.params.subscribe(params => {
      this.Category = params.order;
      this.categoryHeading = this.Category;
      if (this.Category == "Faucet") {
        this.filterConfigService.initializeRecentpurchasewithFaucet();
        this.changeTable('Conversion', 'tab1');
      }
      if (this.Category == "Showerhead") {
        this.filterConfigService.initializeRecentpurchasewithShowerhead();
        this.changeTable('Conversion', 'tab1');
      }
      if (this.Category == "Toilet") {
        this.filterConfigService.initializeRecentpurchasewithToilet();
        this.changeTable('Conversion', 'tab1');
      }
      if (this.Category == "TubShowerUnit") {
        this.filterConfigService.initializeRecentpurchasewithTUB();
        this.changeTable('Conversion', 'tab1');
      }
    });
  }
  ngAfterContentInit(): void {
    this.route.params.subscribe(params => {
      this.Category = params.order;
      this.categoryHeading = this.Category;
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

    this.filterService.optionSelectionCallback$.pipe(takeUntil(this.optionSelectionUnsubscribe))
      .subscribe(value => {
        // this.appliedFilterSet.selectedChoicesFilterTransfer(value);
        // value = this.appliedFilterSet.returnIt();
        //   if(this.filterService.selectedChoices!=undefined){
        //     this.filterService.selectedChoices .forEach((value, key) => this.setTimePeriodChips(key, value));
        // // for(var i=0;i<this.filterService.selectedChoices.size;i++){
        // //       this.pptDownloadPurchaseFunnelObject.filter.push(this.filterService.selectedChoices[i].key);
        // // }

        //   }
        this.updateData(this.Category);
        setTimeout(() => {
          this.onDataUpdate.next();
        });
      });
    // if (this.appliedFilterSet.choices.length > 0) {
    //   this.filterService.setChoices(this.appliedFilterSet.variable, this.appliedFilterSet.choices);
    // }
  }

  initPara() {
    this.Brandlist = [];
    this.brandcodes = [];
    this.csvOptions.headers = []
    this.csvOptions.headers.push("");
    this.dtConversion = [];
    this.dtRetention = [];
  }
  updateData(Category) {
    this.createTables(Category);
    setTimeout(() => {
      this.onDataUpdate.next();
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
        this.pptDownloadObjectConversion.filter = this.pptDownloadObjectConversion.filter + " " + variable + " " + choices[0].text;
        this.pptDownloadObjectRetention.filter = this.pptDownloadObjectRetention.filter + " " + variable + " " + choices[0].text;
      }
    }

  }
  getfilter() {
    this.filter = "";
    let filter = JSON.parse(localStorage.getItem('filterappTime'));
    let filterSide = JSON.parse(localStorage.getItem('filterapp'));
    this.filter = 'Time Period :';
    filter.forEach((element, i) => {
      if (i == 0) {
        this.filter = this.filter + element;
      }
      else if (i == 1) {
        this.filter = this.filter + " Compare with :" + element;
      }
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
  createTables(Category) {
    this.hideFilterTrends.sendBooleanFlag(this.hideFilterForTrends);
    this.showLoader = true;
    this.initPara();
    const brands = new Brands(this.filterService);
    this.brandcodes = brands.getBrandsCode();
    this.Brandlist = brands.getBrandsCode().map(val => AssetMappings.logoByBrandCode[val]);
    var copybrandlist = []
    this.brandcodes.forEach(element => {
      copybrandlist.push(parseInt(element));
    });
    this.pptDownloadObjectRetention.brands = [];
    this.pptDownloadObjectConversion.brands = [];
    copybrandlist.forEach(element => {
     
      this.pptDownloadObjectConversion.brands.push(this.BrandCodewiseMapping[element]);
      this.pptDownloadObjectRetention.brands.push(this.BrandCodewiseMapping[element]);
    });
    const RecentPur = new ConversionRecursion(this.Category);

    if (this.selectedTab == 'Conversion') {
      this.ConversionData = [];
      this.ConversionData1 = [];
      this.ConversionCodeRepeat = [];
      this.check = false;
      this.pptDownloadObjectRetention.category = this.Category;
      this.pptDownloadObjectConversion.category = this.Category;
      this.pptDownloadObjectConversion.serieswisedata=[];
      this.Conversionchart = RecentPur.getConvertion(this.brandcodes);
      this.Conversionchart.forEach(element => {
        element.addTableDataReady((output, datatable) => {
          if (output.length != 0) {
            let compareBase = [];
            if (datatable.comparisonBases.get("Base") != undefined) {
              compareBase = datatable.comparisonBases.get("Base");
            }
            var base = datatable.bases.get('Base').map(value => Math.round(value));
            var dataArray = [];
            let compareScore = [];
            let isSignificance = [];
            output.forEach((element, index) => {
              if (element.SeriesName !== "No Answer") {
                if (element.Score == null) {
                  element.Score = 0;
                }
                dataArray.push(element.Score);
                var code = this.getCode(element.SeriesName);
                this.ConversionCodeRepeat.push(code);
                let count = this.ConversionCodeRepeat.filter(item => item == code).length;
                compareScore[index] = 0;
                if (element.previousScore && element.previousScore != undefined) {
                  compareScore[index] = Math.round(element.previousScore);
                }
                const isSignificance = datatable.significance.get(element.SeriesName);
                if (count == 1) {
                  this.ConversionData.push({
                    'code': code, 'Data': dataArray, 'base': base, 'compareScore': compareScore,
                    'compareBase': compareBase, 'isSignificance': isSignificance
                  });
                }
              }
            });
            if (this.ConversionData.length == this.brandcodes.length && this.check == false) {
              var dt = [];
              this.brandcodes.forEach(element => {
                var dt1 = [];
                this.ConversionData.forEach(el => {
                  if (parseInt(element) == el.code) {
                    this.ConversionData1.push({
                      'code': el.code, 'Data': el.Data, 'base': el.base, 'compareScore': el.compareScore,
                      'compareBase': el.compareBase, 'isSignificance': el.isSignificance
                    });
                    el.Data.forEach(el => {
                      if (el == "NaN") {
                        el = 0;
                      }
                      dt1.push(Math.round(el));
                    })
                    dt.push(dt1);
                  }
                })
              })
             
              dt.forEach((element, index) => {
                this.dtConversion.push({ 'type': this.BrandCodewiseMapping[parseInt(this.brandcodes[index])], 'Data': element });
                this.pptDownloadObjectConversion.serieswisedata.push({ 'seriesname': this.BrandCodewiseMapping[parseInt(this.brandcodes[index])], 'data': element });
              });
              this.converstionBase = base;
              this.pptDownloadObjectConversion.bases = base;
              this.dtConversion.push({ type: 'Base', Data: base });
              this.showLoader = false;
              this.check = true;
            }
          }
        });
      });
    }
    if (this.selectedTab == 'Retention') {
      this.RetentionData = [];
      this.RetentionData1 = [];
      this.RetentionCodeRepeat = [];
      this.checkRetention = false;
      this.pptDownloadObjectRetention.category = this.Category;
      this.pptDownloadObjectRetention.serieswisedata=[];
      this.Retentionchart = RecentPur.getRetention(this.brandcodes);
      this.Retentionchart.forEach(element => {
        element.addTableDataReady((output, datatable) => {
          if (output.length != 0) {
            let compareBase = [];
            if (datatable.comparisonBases.get("Base") != undefined) {
              compareBase = datatable.comparisonBases.get("Base");
            }
            var base = datatable.bases.get('Base').map(value => Math.round(value));
            var dataArray = [];
            let compareScore = [];
            output.forEach((element, index) => {
              if (element.SeriesName !== "No Answer") {
                if (element.Score == null) {
                  element.Score = 0;
                }
                dataArray.push(element.Score);
                var code = this.getCode(element.SeriesName);
                this.RetentionCodeRepeat.push(code);
                var count = this.RetentionCodeRepeat.filter(item => item == code).length;
                compareScore[index] = 0;
                if (element.previousScore && element.previousScore != undefined) {
                  compareScore[index] = Math.round(element.previousScore);
                }
                const isSignificance = datatable.significance.get(element.SeriesName);
                if (count == 1) {
                  this.RetentionData.push({
                    'code': code, 'Data': dataArray, 'base': base, 'compareScore': compareScore,
                    'compareBase': compareBase, 'isSignificance': isSignificance
                  });
                }
              }
            });
            if (this.RetentionData.length == this.brandcodes.length && this.checkRetention == false) {
              var dt = [];
              this.brandcodes.forEach(element => {
                var dt1 = [];
                this.RetentionData.forEach(el => {
                  if (parseInt(element) == el.code) {
                    this.RetentionData1.push({
                      'code': el.code, 'Data': el.Data, 'base': el.base, 'compareScore': el.compareScore,
                      'compareBase': el.compareBase, 'isSignificance': el.isSignificance
                    });
                    el.Data.forEach(el => {
                      if (el == "NaN") {
                        el = 0;
                      }
                      dt1.push(Math.round(el));
                    })
                    dt.push(dt1);
                  }
                })
              })
              
              dt.forEach((element, index) => {
                this.dtRetention.push({ 'type': this.BrandCodewiseMapping[parseInt(this.brandcodes[index])], 'Data': element });
                this.pptDownloadObjectRetention.serieswisedata.push({ 'seriesname': this.BrandCodewiseMapping[parseInt(this.brandcodes[index])], 'data': element });
              });
              this.retentionBase = base;
              this.pptDownloadObjectRetention.bases = base;
              this.dtRetention.push({ type: 'Base', Data: base });
              this.showLoader = false;
              this.checkRetention = true;
            }
          }
        });
      });
    }


  }
  changeTable(tabName, tab) {
    this.selectedTab = tabName;
    this.viewMode = tab;
    this.updateData(this.Category);

  }

  getWidth() {
    var width = document.getElementById("mydiv").offsetWidth;
    return width;
  }

  getWidthBlank() {
    var width = document.getElementById("blankdiv").offsetWidth;
    return width;

  }
  ngOnDestroy(): void {
    this.optionSelectionUnsubscribe.next();
    this.optionSelectionUnsubscribe.complete();
  }
  getCode(bramdname: string): number {
    return this.brandMapping[bramdname];
  }
  pptdownload(pptName) {
    this.getfilter();
    if (this.selectedTab == 'Conversion') {
      this.pptDownloadObjectConversion.filter=this.filter;
      this.showLoader = true;
      const objnew = JSON.stringify(this.pptDownloadObjectConversion);
      this.pptexport.postPPTForConversionDownload(JSON.stringify(objnew)).subscribe((data) => {
        let blob = new Blob([data], { type: "application/octet-stream" });
        let url = window.URL.createObjectURL(blob);
        let a = document.createElement("a");
        document.body.appendChild(a);
        a.href = url;
        a.download = this.selectedTab + '_PPT.zip';
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove();
        this.showLoader = false;
      }, error => {
        console.log(error);
        this.showLoader = false;
      });

    }
    else if (this.selectedTab == 'Retention') {
      this.pptDownloadObjectRetention.filter=this.filter;
      this.showLoader = true;
      const objnew = JSON.stringify(this.pptDownloadObjectRetention);
      this.pptexport.postPPTForRetentionDownload(JSON.stringify(objnew)).subscribe((data) => {
        let blob = new Blob([data], { type: "application/octet-stream" });
        let url = window.URL.createObjectURL(blob);
        let a = document.createElement("a");
        document.body.appendChild(a);
        a.href = url;
        a.download = this.selectedTab + '_PPT.zip';
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
  ExcellExport() {
    this.getfilter();
    this.csvOptions.headers=[];
    this.csvOptions.headers.push('Filter(s)',this.filter);
    if (this.selectedTab == 'Conversion') {
      this.csvOptions.title = this.Category+" Conversion";
      const data = Array.from(this.dtConversion);
      this.dtConversion=[];
      
      data.forEach((element, i) => {
        if (i <= element.Data.length - 1) {
          element.Data.forEach((ele, k) => {
            data[i].Data[k] = this.socreAndBase.transform(ele, this.converstionBase[k]);
          });
        }
      });
      let Allbrands=[];
      this.brandcodes.forEach(el=>{
        Allbrands.push(this.BrandCodewiseMapping[parseInt(el)]);
      })
      this.dtConversion.push({ 'type': '', 'Data': Allbrands });
      data.forEach(el=>{
        this.dtConversion.push({ 'type': el.type, 'Data': el.Data });
      });
      new AngularCsv(this.dtConversion, this.Category+" Conversion", this.csvOptions);
    }
    if (this.selectedTab == 'Retention') {
      this.csvOptions.title = this.Category+" Recent Purchase";
      const data = Array.from(this.dtRetention);
      this.dtRetention=[];
      data.forEach((element, i) => {
        if (i <= element.Data.length - 1) {
          element.Data.forEach((ele, k) => {
            data[i].Data[k] = this.socreAndBase.transform(ele, this.retentionBase[k]);
          });
        }
      });
      let Allbrands=[];
      this.brandcodes.forEach(el=>{
        Allbrands.push(this.BrandCodewiseMapping[parseInt(el)]);
      })
      this.dtRetention.push({ 'type': '', 'Data': Allbrands });
      data.forEach(el=>{
        this.dtRetention.push({ 'type': el.type, 'Data': el.Data });
      });
      new AngularCsv(this.dtRetention, this.Category+" Retention", this.csvOptions);
    }
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
