import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { Chart } from 'src/app/shell/models/chart';
import { DataTable } from 'src/app/shell/models/dataTable';
import { BrandPerception } from './tables/brand-perception';
import { FilterService } from 'src/app/shell/services/filter.service';
import { variable } from '@angular/compiler/src/output/output_ast';
import { BrandPreceptionCsv } from './tables/brand-perception-csv';
import { AngularCsv } from 'angular7-csv/dist/Angular-csv';
import { FilterConfigService } from 'src/app/service/filter-config.service';
import { Brands } from 'src/app/model/brands';
import { AssetMappings } from 'src/app/model/asset.mappings';
import { takeUntil } from 'rxjs/operators';
import { ScoreAndBasePipe } from 'src/app/pipe/score-and-base.pipe';
import { BrandPerceptionTrends } from './brandPerceptionTrends';
import { element } from 'protractor';
import { FilterOption } from 'src/app/shell/models/filterOption';
import { PptExportService } from 'src/app/service/ppt-export.service';
import { FilterHideService } from 'src/app/service/filter-hide.service';
import { AppliedFilterSetService } from 'src/app/service/applied-filter-set.service';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-brand-perceptions',
  templateUrl: './brand-perceptions.component.html',
  styleUrls: ['./brand-perceptions.component.css'],
  providers: [ScoreAndBasePipe]
})
export class BrandPerceptionsComponent implements OnInit {
  onDataUpdate: Subject<any> = new Subject;
  optionSelectionUnsubscribe: Subject<any> = new Subject<any>();
  brandPerceptions: Chart;
  brandPerceptionsArray: Array<any> = new Array<any>();
  branPerceptionTableData: Array<any> = new Array<any>();
  //baseValueData: number[];
  showLoader: boolean;
  //colorIndex =[{'color':'green','value':120},{'color':'lightgreen','value':119},{'color':'white','value':109},{'color':'pink','value':90},{'color':'red','value':}];
  brands = ["Delta", "Moen", "Kohler", "Peerless", "American Standard", "Pfister", "Waterpik"];
  brandList: any;
  brandCodes = {
    1: 'Delta',
    2: 'American Standard',
    3: 'Kohler',
    4: 'Moen',
    5: 'Peerless',
    6: 'Pfister',
    23: 'Waterpik',
  };
  brandName = {
    'Delta': '',
    'American Standard': '',
    'Kohler': '',
    'Moen': '',
    'Peerless': '',
    'Pfister': '',
    'Waterpik': ''
  };
  // KDA = {
  //   'Is a brand I trust': 115,
  //   'Has products that are a good value for the money': 8,
  //   'Is a leader': 222,
  //   'Is innovative': 99,
  //   'Is creative': 84,
  //   'Is a brand you can be proud to own': 117,
  //   'Is a brand that plays it safe': 20,
  //   'Offers products designed to be practical and functional': 19,
  //   'Is a high quality brand': 188,
  //   'Is a brand worth paying more for': 251,
  //   'Is a reliable, dependable brand': 41,
  //   'Meets a true need': 27,
  //   'Is a respectable brand': 39,
  //   'Provides products that are well thought out': 68,
  //   'Makes a bit of a statement about you': 101,
  //   'Tends to have more higher-price products than lower-price products': 110,
  //   'Has products you would see in a high-end home': 141,
  //   'Has designs that are new / up-to-date': 151,
  // }
  KDA2020 = {
    'Is a brand I trust': 139,
    'Has products that are a good value for the money':11,
    'Is a leader': 187,
    'Is innovative': 106,
    'Is creative (Removed 2Q20)': 108,
    'Is a brand you can be proud to own': 145,
    'Is a brand that plays it safe': 28,
    'Offers products designed to be practical and functional': 21,
    'Is a high quality brand': 119,
    'Is a brand worth paying more for': 178,
    'Is a reliable, dependable brand': 86,
    'Meets a true need (Removed 2Q20)': 38,
    'Is a respectable brand (Removed 2Q20)': 46,
    'Provides products that are well thought out': 93,
    'Makes a bit of a statement about you': 111,
    'Tends to have more higher-price products than lower-price products': 89,
    'Has products you would see in a high-end home': 135,
    'Has designs that are new / up-to-date': 161,
    'Provides well designed products at affordable price points (Added 2Q20)': 0,
    'Helps my space look good within my budget (Added 2Q20)': 0,
    'Is for the budget conscious buyer (Added 2Q20)': 0
  }
  dtBrandPreceptionCsv = new Array<any>();
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
  brandLogos = AssetMappings.logoByBrandCode;
  perceptionTrendsDelta: any;
  perceptionTrendsMoen: any;
  perceptionTrendsKohler: any;
  perceptionTrendsPeerless: any;
  perceptionTrendsAS: any;
  perceptionTrendsPfister: any;
  perceptionTrendsWaterpik: any;
  public showChart = false;
  public showTrends = false;
  selectedTab: any;
  period = 'Quarterly';
  periodSeclected = 'tab1';
  filter: string;
  pptDownloadCategoryPerception = {
    'Brands': [],
    'Serieswisescore': [],
    'filter': ''
  }
  timePeriodChips: Map<string, Array<FilterOption>> = new Map<string, Array<FilterOption>>();
  hideFilterForTrends: boolean = false;
  brandPerceptionTrendsPptData: Array<any> = new Array<any>();
  constructor(private filterService: FilterService,
    private filterConfigService: FilterConfigService,
    private pptexport1: PptExportService,
    private scoreAndBase: ScoreAndBasePipe,
    private hideFilterTrends: FilterHideService,
    private appliedFilterSet: AppliedFilterSetService, private route: ActivatedRoute) {
    this.filterConfigService.initializeOverallBrandPereception();
  }

  ngOnInit() {
    this.updateBrandPerception();

    this.route.params.subscribe(params => {
      if (this.filterService.getAppliedFilters().size === 0) {
        localStorage.removeItem('filterapp');
      }
      if (this.filterService.getAppliedFilters().size !== 0 ||
        this.filterService.getAppliedSeriesSelectors().size !== 0 ||
        this.filterService.getAppliedTimePeriods().size !== 0) {

        this.updateBrandPerception();
        setTimeout(() => {
          this.onDataUpdate.next();
        });
      }
    });

    this.filterService.optionSelectionCallback$
      .pipe(takeUntil(this.optionSelectionUnsubscribe))
      .subscribe(value => {
        // if(this.filterService.selectedChoices!=undefined){
        //   this.filterService.selectedChoices .forEach((value, key) => this.setTimePeriodChips(key, value));
        // }
        // this.appliedFilterSet.selectedChoicesFilterTransfer(value);
        // value = this.appliedFilterSet.returnIt();
        // this.filterService.selectedChoices[0] = value;
        this.updateBrandPerception();
        setTimeout(() => {
          this.onDataUpdate.next();
        });
      });

    // if (this.appliedFilterSet.choices.length > 0) {
    //   this.filterService.setChoices(this.appliedFilterSet.variable, this.appliedFilterSet.choices);
    // }
  }
  /**
   * To Get Data of all Brand
   * Calculate and Set into table form
   */
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
  updateBrandPerception() {
    this.toggleChart('chartsTabs');
    this.getfilter();
    let year:any;
    if(this.filter.includes("2019")){
    year="2019"
    }
    else if(this.filter.includes("2020")){
year="2020";
    }
    const brands = ['1', '4', '3', '5', '2', '6', '23'];
    this.brandList = brands.map((val) => this.brandLogos[val]);
    this.brandNameCsv = brands.map((val) => this.brandCodes[val]);
    this.pptDownloadCategoryPerception.Brands = brands.map((val) => this.brandCodes[val]);
    const Perception: BrandPerception = new BrandPerception();
    this.showLoader = true;
    this.branPerceptionTableData = [];
    this.brandPerceptionsArray = Perception.getbrandPerceptionData(brands);
    const data = [];
    this.brandPerceptionsArray.forEach((value, index) => {
      //Call Each Brand Data
      value.addTableDataReady((output, dataTable) => {

        data.push(dataTable);
        if (this.brandPerceptionsArray.length == data.length) {
          const perceptionData = [];
          const chartLength = data.length - 1;
          data.forEach((table, i) => {
            let baseValueData: any;
            table.bases.forEach((value, index) => {
              baseValueData = value[0];
            });
            let compareBase = 0;
            table.comparisonBases.forEach((val, valindex) => {
              if (val[0] != undefined) {
                compareBase = val[0];
              }
            });
            const headerName = table.headers[0];
            const totalLenght = table.rows.size - 1;
            let counter = 0;
            table.rows.forEach((val, question) => {
              let avg = 0;
              const score = val[0];
              let valueAndBase = {
                'Score': score,
                'Base': baseValueData,
                'previousScore': 0,
                'compareBase': compareBase,
                'isSignificance': false
              }
              if (table.previousScoreRows.get(question)[0] !== undefined) {
                valueAndBase.previousScore = table.previousScoreRows.get(question)[0];
              }
              // table.previousScoreRows.forEach((compval, compIndex) => {
              //   if (compIndex === question && compval != undefined) {
              //     valueAndBase.previousScore = Math.round(score - (compval[0]));
              //   }
              // });
              const showSig = table.significance.get(question)[0];
              if (showSig != undefined) {
                valueAndBase.isSignificance = true;
              }
              if (i == 0) {
                //brandValues[i] = valueAndBase;
                let KDAscore:any;

                  KDAscore= this.KDA2020[question];

                let perceptionObj = {
                  "productValues": [],
                  'question': question,
                  "avg": 0,
                  "colorCode": '',
                  "KDA": KDAscore
                }
                perceptionData.push(perceptionObj);
              }
              perceptionData[counter].productValues[this.brandNameCsv.indexOf(headerName)] = valueAndBase;
              if (totalLenght == counter && chartLength == i) {
                this.branPerceptionTableData = this.colorIndexing(perceptionData)
                this.branPerceptionTableData.sort((a, b) => b.KDA - a.KDA);
                this.showLoader = false;
              }
              counter++;
            });

          });
        }
      });
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
        this.pptDownloadCategoryPerception.filter = this.pptDownloadCategoryPerception.filter + " " + variable + " " + choices[0].text;
      }
    }

  }
  /**
   * To calclate Color indexing and Average
   * @param perceptionData Table Data of Pereception
   */
  pptexport(pptName) {
    this.getfilter();
    this.pptDownloadCategoryPerception.filter = this.filter;
    this.branPerceptionTableData.forEach(element => {

      var Score = [];
      var Bases = [];

      element.productValues.forEach(subel => {
        Score.push(subel.Score);
        Bases.push(subel.Base);
      })

      this.pptDownloadCategoryPerception.Serieswisescore.push({ 'seriesname': element.question, 'data': Score, 'bases': Bases, 'KDA': element.KDA, 'avg': element.avg });
    })
    this.pptDownloadCategoryPerception;
    var obj = JSON.stringify(this.pptDownloadCategoryPerception);

    this.pptexport1.postPPTForPerceptionDownload(JSON.stringify(obj)).subscribe((data) => {
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
  colorIndexing(perceptionData) {
    let colorCode: String;
    let avg = 0
    perceptionData.forEach((val, i) => {
      let num = 0
      // let counter = 0;
      val.productValues.forEach((a, b) => {
        if (!isNaN(a.Score) && a.Score !== "NaN") {
          num += a.Score;
          // counter++
        }
      });
      const avg = num / val.productValues.length;
      perceptionData[i].avg = Math.round(avg);
      val.productValues.forEach((a, b) => {
        if (!isNaN(a.Score) && a.Score !== "NaN") {
          const colorValue = a.Score;
          const colorIndexValue = Math.round(colorValue / avg * 100);
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
          perceptionData[i].productValues[b].colorCode = colorCode;
        }
        else {
          perceptionData[i].productValues[b].colorCode = "#fff";
        }
      });
    });
    return perceptionData;
  }

  // dataSend(sideBreakText) {
  //   this.updateTable(sideBreakText);
  //   setTimeout(() => {
  //     this.onDataUpdate.next();
  //   });
  //   this.updateTable(sideBreakText);
  // }

  // updateTable(sideBreakText) {
  //   this.showLoader = false;
  //   const brands = ['1', '4', '3', '5', '2', '6', '23'];
  //   const brandPerceptionTrends: BrandPerceptionTrends = new BrandPerceptionTrends();
  //   this.perceptionTrendsDelta = brandPerceptionTrends.getbrandPerceptionData('Quarterly', sideBreakText, '', brands);
  //   // this.perceptionYearlyTrends = brandPerceptionTrends.getbrandPerceptionData('Yearly', sideBreakText, '', brands);
  //   // this.perceptionSemiAnnuallyTrends = brandPerceptionTrends.getbrandPerceptionData('Semiannual', sideBreakText, '', brands);
  //   console.log(sideBreakText);
  // }

  downloadPptTrends() {
    if (this.perceptionTrendsDelta && this.perceptionTrendsMoen && this.perceptionTrendsKohler
      && this.perceptionTrendsAS && this.perceptionTrendsPeerless && this.perceptionTrendsPfister
      && this.perceptionTrendsWaterpik) {
      this.showLoader = true;
      const objnew = JSON.stringify(this.brandPerceptionTrendsPptData[0]);
      this.pptexport1.postPPTForTrends(objnew).subscribe((data) => {
        const blob = new Blob([data], { type: 'application/octet-stream' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        document.body.appendChild(a);
        a.href = url;
        a.download = 'BrandPerception_Trends_PPT.zip';
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

  updateDataTrends() {
    this.brandPerceptionTrendsPptData = [];
    const brandPerceptionTrends: BrandPerceptionTrends = new BrandPerceptionTrends();
    if (this.period === 'Quarterly' || this.periodSeclected === 'tab1') {
      this.period = 'Quarterly';
      this.chartMap(brandPerceptionTrends, this.period, 'BRAND PERCEPTIONS');
    } else if (this.period === 'Annually' || this.periodSeclected === 'tab3') {
      this.period = 'Yearly';
      this.chartMap(brandPerceptionTrends, this.period, 'BRAND PERCEPTIONS');
    } else if (this.period === 'SemiAnnually' || this.periodSeclected === 'tab2') {
      this.period = 'Semiannual';
      this.chartMap(brandPerceptionTrends, this.period, 'BRAND PERCEPTIONS');
    }
    if (this.perceptionTrendsDelta && this.perceptionTrendsMoen && this.perceptionTrendsKohler
      && this.perceptionTrendsAS && this.perceptionTrendsPeerless && this.perceptionTrendsPfister
      && this.perceptionTrendsWaterpik) {
      this.brandPerceptionTrendsPptData.push(brandPerceptionTrends.brandPerceptionTrendsPptData);
    }
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
  chartMap(ref, topbreak, title) {
    this.getfilterTrends();
    this.perceptionTrendsDelta = ref.getbrandPerceptionData(topbreak, title, 1,this.filter);
    this.perceptionTrendsMoen = ref.getbrandPerceptionData(topbreak, title, 4,this.filter);
    this.perceptionTrendsKohler = ref.getbrandPerceptionData(topbreak, title, 3,this.filter);
    this.perceptionTrendsAS = ref.getbrandPerceptionData(topbreak, title, 2,this.filter);
    this.perceptionTrendsPeerless = ref.getbrandPerceptionData(topbreak, title, 5,this.filter);
    this.perceptionTrendsPfister = ref.getbrandPerceptionData(topbreak, title, 6,this.filter);
    this.perceptionTrendsWaterpik = ref.getbrandPerceptionData(topbreak, title, 23,this.filter);
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
      this.updateDataTrends();
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
      this.updateDataTrends();
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
    this.dtBrandPreceptionCsv = this.branPerceptionTableData;
    this.dtBrandPreceptionCsv.forEach((val, index) => {
      let csvDetail = [];
      if (index == 0) {
        csvDetail.push("Driver");
        csvDetail.push("Series Name");
        csvDetail.push("Average Selected Brands");
        csvDetail.push(this.brands);
        csvData.push(Object.assign({}, csvDetail));
      }
      csvDetail = [];
      csvDetail.push(val.KDA);
      csvDetail.push(val.question);
      csvDetail.push(val.avg);

      val.productValues.forEach((a) => {
        const val = this.scoreAndBase.transform(a.score, a.base)
        csvDetail.push(Math.round(a.Score));
      });
      csvData.push(Object.assign({}, csvDetail));
    });
    var cavBaseValues = ['', 'Base', ''];
    this.dtBrandPreceptionCsv[0].productValues.forEach((element, index) => {
      cavBaseValues.push(element.Base);
    });
    csvData.push(Object.assign({}, cavBaseValues));
    this.csvOptions.title = "Overall Brand Perception";
    //this.csvOptions.headers = ["Driver", "Series Name", "Average Selected Brands", this.brands];
    this.csvOptions.headers = [];
    //this.csvOptions.headers = ["Driver", "Series Name", "Average Selected Brands", this.brands];
    this.csvOptions.headers = ["Filters", this.filter];
    new AngularCsv(csvData, "Overall Brand Perception", this.csvOptions);
  }

  getContentHeight() {
    return window.innerHeight - 280;
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
    this.optionSelectionUnsubscribe.next();
    this.optionSelectionUnsubscribe.complete();
  }

  getContentWidth() {
    var width = document.getElementById("brandData").offsetWidth;
    return width;
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
