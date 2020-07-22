import { Component, OnInit, OnDestroy } from '@angular/core';
import { DemographicsTable } from './table/demographics';
import { DataTable } from 'src/app/shell/models/dataTable';
import { Chart } from 'src/app/shell/models/chart';
import { Subject } from 'rxjs';
import { FilterConfigService } from 'src/app/service/filter-config.service';
import { FilterService } from 'src/app/shell/services/filter.service';
import { takeUntil } from 'rxjs/operators';
import { AngularCsv } from 'angular7-csv/dist/Angular-csv';
import { RoundOffStrategy } from 'src/app/shell/enums/round.off.strategy';
import { parse } from 'querystring';
import { ScoreAndBasePipe } from 'src/app/pipe/score-and-base.pipe';
import { element } from 'protractor';
import { PptExportService } from 'src/app/service/ppt-export.service';
import { FilterOption } from 'src/app/shell/models/filterOption';
import { AppliedFilterSetService } from 'src/app/service/applied-filter-set.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-demographics',
  templateUrl: './demographics.component.html',
  styleUrls: ['./demographics.component.css'],
  providers: [ScoreAndBasePipe]
})
export class DemographicsComponent implements OnInit, OnDestroy {
  selectedTab = 'Demographics';
  viewMode = 'tab1';
  demographicChartConfigArray: Array<Chart> = new Array<Chart>();
  showLoader: boolean;
  onDataUpdate: Subject<any> = new Subject<any>();
  unsubscribedemographic: Subject<any> = new Subject<any>();
  genderData: Array<any> = new Array<any>();
  ageData: Array<any> = new Array<any>();
  incomeData: Array<any> = new Array<any>();
  martialData: Array<any> = new Array<any>();
  martialDataExcel: Array<any> = new Array<any>();
  demographicPieChartConfigArray: Array<Chart> = new Array<Chart>();
  areaPieChartConfig: Chart;
  childrenPieChartConfig: Chart;
  areaData: Array<any> = new Array<any>();
  regionData: Array<any> = new Array<any>();
  kidsHouseHoldData: Array<any> = new Array<any>();
  recentBuyerData: Array<any> = new Array<any>();
  intenderBuyerData: Array<any> = new Array<any>();
  houseHoldData: { Score: any, Base: number, SeriesName: String };
  averageIncomeData: { Score: number, Base: number, SeriesName: String };
  OpinionsData: Array<any> = new Array<any>();
  SecondOpinionsData: Array<any> = new Array<any>();
  mriOpinionMapping = ['Agree mostly', 'Agree somewhat', 'Disagree somewhat', 'Disagree mostly']
  mriSecondOpinionMapping = ['Agree completely', 'Agree somewhat', 'Disagree somewhat', 'Disagree completely']
  HouseHoldfactor: Array<number> = [1, 2, 4, 6];
  Incomefactor: Array<number> = [45, 63, 88, 125, 200, 300];

  mriOpinionBase: any;
  mriSecondOpinionBase: any;
  mriknowledgeSharingBase: any;
  mriAdviceOnTopicBase: any;

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
  pptDownloadIncomeDemographicObject = {
    'serieswisedata': [],
    'filter': ''
  }
  pptDownloadAgeDemographicObject = {
    'serieswisedata': [],
    'filter': ''
  }
  pptDownloadGenderDemographicObject = {
    'Malescore': 0,
    'MaleBase': 0,
    'Femalescore': 0,
    'FemaleBase': 0,
    'filter': ''
  }
  pptDownloadDemographicAverageObject = {
    'average': 0,
    'bases': 0,
    'filter': ''
  }
  pptDownloadMaritalObject = {
    'serieswisedata': [],
    'filter': ''
  }
  pptRecentBuyer = {
    'serieswisedata': [],
    'filter': ''
  }
  pptIntenderBuyer = {
    'serieswisedata': [],
    'filter': ''
  }
  pptArea = {
    'serieswisedata': [],
    'filter': ''
  }
  pptOpiniondt = {
    'serieswisedata': [],
    'filter': ''
  }
  pptSecondOpinionsDatadt = {
    'serieswisedata': [],
    'filter': ''
  }
  pptAveragepeople = {
    'score': 0,
    'bases': 0,
    'filter': ''
  }
  pptAverageincomeob = {
    'score': 0,
    'bases': 0,
    'filter': ''
  }
  pptKidsHousehold = {
    'serieswisedata': [],
    'filter': ''
  }
  pptRegionobj = {
    'serieswisedata': [],
    'filter': ''
  }
  pptknowledgeArea = {
    'serieswisedata': [],
    'filter': ''
  }
  pptadviceOnTopicsDataob = {
    'serieswisedata': [],
    'filter': ''
  }
  opinionChartConfig: Chart;
  secondOpinionChartConfig: Chart;
  knowledgeAreaChart: Chart;
  adviceOnTopicsChart: Chart;
  knowledgeAreaData: Array<any> = new Array<any>();
  adviceOnTopicsData: Array<any> = new Array<any>();
  averageIncomeDataExcel = [];
  houseHoldDataExcel = [];
  filter: string;
  timePeriodChips: Map<string, Array<FilterOption>> = new Map<string, Array<FilterOption>>();
  constructor(private filterService: FilterService,
    private filterConfigService: FilterConfigService,
    private scoreAndBase: ScoreAndBasePipe,
    private pptexport: PptExportService,
    private appliedFilterSet: AppliedFilterSetService, private route: ActivatedRoute) {
    this.houseHoldData = { Score: 0, Base: 0, SeriesName: '' };
    this.averageIncomeData = { Score: 0, Base: 0, SeriesName: '' };
    this.showLoader = true;
  }

  ngOnInit() {
    this.showLoader = true;
    this.demographicCharts();
    this.MRIdemographicCharts();
    this.route.params.subscribe(params => {
      if (this.filterService.getAppliedFilters().size === 0) {
        localStorage.removeItem('filterapp');
      }
      if (this.filterService.getAppliedFilters().size !== 0 ||
        this.filterService.getAppliedSeriesSelectors().size !== 0 ||
        this.filterService.getAppliedTimePeriods().size !== 0) {

        this.demographicCharts();
        this.MRIdemographicCharts();
        setTimeout(() => {
          this.onDataUpdate.next();
        });
      }
    });


    //   if(this.filterService.selectedChoices!=undefined){
    //     this.filterService.selectedChoices .forEach((value, key) => this.setTimePeriodChips(key, value));
    // // for(var i=0;i<this.filterService.selectedChoices.size;i++){
    // //       this.pptDownloadPurchaseFunnelObject.filter.push(this.filterService.selectedChoices[i].key);
    // // }

    //   }
    // let appliedFiltes = this.filterService.getAppliedFilters();

    this.filterService.optionSelectionCallback$
      .pipe(takeUntil(this.unsubscribedemographic))
      .subscribe(value => {
        this.demographicCharts();
        this.MRIdemographicCharts();
        // let timePeriodConfig = this.filterService.getFilterConfig('timeperiod');
        // let appliedTimePeriods = this.filterService.getAppliedTimePeriods();
        // this.filterService.setChoices('timeperiod', [])
        // this.appliedFilterSet.selectedChoicesFilterTransfer(value);
        // value = this.appliedFilterSet.returnIt();
        setTimeout(() => {
          this.onDataUpdate.next();
        });
      });

    // if (this.appliedFilterSet.choices.length > 0) {
    //   this.filterService.setChoices(this.appliedFilterSet.variable, this.appliedFilterSet.choices);
    // }
  }
  /**
   * Change table according to tab
   */
  changeTable(tabName, tab) {
    this.selectedTab = tabName;
    this.viewMode = tab;
  }

  /**
   * Create Tables and Chart
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
  demographicCharts() {
    this.showLoader = true;
    this.demographicChartConfigArray = new Array<Chart>();
    const demographics: DemographicsTable = new DemographicsTable();
    const genderChartConfig: Chart = demographics.demographicsChartConfigration('Gender', ['v102'], "");
    const ageChartConfig: Chart = demographics.demographicsChartConfigration('Age', ['v103'], "");
    const incomeChartConfig: Chart = demographics.demographicsChartConfigration('Income Break', ['v264'], "");
    const incomeAvgChartConfig: Chart = demographics.demographicsChartConfigration('Average Income Break', ['v264'], "");
    const maritalChartConfig: Chart = demographics.demographicsChartConfigration('Marital Status', ['v782'], "");
    const regionChartConfig: Chart = demographics.demographicsChartConfigration('Region', ['v104'], "");
    const houseHoldChartConfig: Chart = demographics.demographicsChartConfigration('House Hold', ['v783'], "");
    const recentBuyerChartConfig: Chart = demographics.demographicsChartConfigration('Recent Buyer', ['v297', 'v298', 'v300', 'v302', 'v303'], [2]);
    const intenderChartConfig: Chart = demographics.demographicsChartConfigration('Intender', ['v297', 'v298', 'v300', 'v302', 'v303'], [3]);

    this.areaPieChartConfig = demographics.demographicsPieChartConfigration('Area', 'v781');
    this.childrenPieChartConfig = demographics.demographicsPieChartConfigration('Kids in Household', 'v784');

    this.demographicChartConfigArray.push(genderChartConfig);
    this.demographicChartConfigArray.push(ageChartConfig);
    this.demographicChartConfigArray.push(incomeChartConfig);
    this.demographicChartConfigArray.push(incomeAvgChartConfig);
    this.demographicChartConfigArray.push(maritalChartConfig);
    this.demographicChartConfigArray.push(regionChartConfig);
    this.demographicChartConfigArray.push(houseHoldChartConfig);
    this.demographicChartConfigArray.push(recentBuyerChartConfig);
    this.demographicChartConfigArray.push(intenderChartConfig);


    //Gender Chart
    genderChartConfig.addTableDataReady((output, dataTable) => {
      this.genderData = this.genderChart(output, dataTable);
      this.showLoader = false;
    });

    //Age Chart
    ageChartConfig.addTableDataReady((output, dataTable) => {
      this.ageData = this.ageChart(output, dataTable);
      this.showLoader = false;
    });

    //Income Chart
    incomeChartConfig.addTableDataReady((output, dataTable) => {
      this.incomeData = this.incomeChart(output, dataTable);
      this.showLoader = false;
    });
    //Marital Status Chart
    maritalChartConfig.addTableDataReady((output, dataTable) => {
      this.martialData = this.martialChart(output, dataTable);
      this.martialDataExcel = this.martialData;
      this.showLoader = false;
    });

    //Recent Buyer Chart
    recentBuyerChartConfig.addTableDataReady((output, dataTable) => {
      this.recentBuyerData = this.recentAndIntenderBuyerChart(output, dataTable);
      this.showLoader = false;
    });
    //Intender Chart
    intenderChartConfig.addTableDataReady((output, dataTable) => {
      this.intenderBuyerData = this.recentAndIntenderBuyerChart(output, dataTable);
      this.showLoader = false;
    });

    // Region Status Chart
    regionChartConfig.addTableDataReady((output, dataTable) => {
      this.regionData = this.regionChart(output, dataTable);
      this.showLoader = false;
    });

    incomeAvgChartConfig.addTableDataReady((output, dataTable) => {
      const baseValue = dataTable.bases.get('Base')[0];
      let totalValue = 0;
      let data = []
      output.forEach((val, index) => {
        totalValue += val.Score * this.Incomefactor[index];
        const object = {
          Score: val.Score,
          SeriesName: val.SeriesName,
          Base: baseValue
        }
        data.push(object);
      });
      this.averageIncomeData = {
        Score: parseFloat((totalValue / baseValue).toFixed(2)),
        Base: baseValue,
        SeriesName: 'Average'
      };
      this.pptDownloadDemographicAverageObject.average = parseFloat((totalValue / baseValue).toFixed(2));
      this.pptDownloadDemographicAverageObject.bases = baseValue;
      this.averageIncomeDataExcel = data;
      this.averageIncomeDataExcel.unshift(this.averageIncomeData);
      this.showLoader = false;
    });

    // //House Hold Status Chart
    houseHoldChartConfig.addTableDataReady((output, dataTable) => {
      const baseValue = dataTable.bases.get('Base')[0];
      let totalValue = 0;
      let data = [];
      output.forEach((val, index) => {
        totalValue += val.Score * this.HouseHoldfactor[index];
        const object = {
          Score: val.Score,
          SeriesName: val.SeriesName,
          Base: baseValue
        }
        data.push(object);
      });
      this.houseHoldData = {
        Score: parseFloat((totalValue / baseValue).toFixed(2)),
        Base: baseValue,
        SeriesName: 'Average'
      }
      this.houseHoldDataExcel = data;
      this.pptAveragepeople.score = parseFloat((totalValue / baseValue).toFixed(2));
      this.pptAveragepeople.bases = baseValue;
      this.houseHoldDataExcel.unshift(this.houseHoldData);
      this.showLoader = false;
    });

    //Area Status Chart For Excel Data
    this.areaPieChartConfig.addCalculationLogic(output => {
      let table = output.TableOutput.get('Area');
      if (table.length && output.Bases.has("Area")) {
        let Base = 0;
        if (output.Bases.has("Area") && output.Bases.get("Area")[0] != undefined) {
          Base = output.Bases.get("Area")[0].Score
        }
        let data = [];
        table.forEach(value => {
          const object = {
            Score: value.Score,
            SeriesName: value.SeriesName,
            Base: Base
          }
          data.push(object);
        });
        if (data.length) this.areaData = data
      }
      return output;
    }, RoundOffStrategy.AfterCalculation);

    //Kids House Hold Status Chart For Excel Data
    this.childrenPieChartConfig.addCalculationLogic(output => {
      let table = output.TableOutput.get('Kids in Household');
      if (table.length) {
        let Base = 0;
        // this.kidsHouseHoldData = [];
        if (output.Bases.has("Kids in Household") && output.Bases.get("Kids in Household")[0].Score != undefined) {
          Base = output.Bases.get("Kids in Household")[0].Score
        }
        let data = [];
        table.forEach(value => {
          const object = {
            Score: value.Score,
            SeriesName: value.SeriesName,
            Base: Base
          }
          data.push(object);
        });
        if (data.length) this.kidsHouseHoldData = data;
      }
      return output;
    }, RoundOffStrategy.AfterCalculation);
  }
  // private setTimePeriodChips(variable, choices) {
  //   if (this.timePeriodChips.has(variable) && choices.length === 0) {
  //     this.timePeriodChips.delete(variable);
  //   } else {
  //     this.timePeriodChips.set(variable, [...choices]);
  //   }
  //   for (var i = 0; i < this.timePeriodChips.size; i++) {
  //     if (variable != "Allbrands") {
  //       this.pptadviceOnTopicsDataob.filter = this.pptadviceOnTopicsDataob.filter + " " + variable + " " + choices[0].text;
  //       this.pptArea.filter = this.pptArea.filter + " " + variable + " " + choices[0].text;
  //       this.pptadviceOnTopicsDataob.filter = this.pptadviceOnTopicsDataob.filter + " " + variable + " " + choices[0].text;
  //       this.pptknowledgeArea.filter = this.pptknowledgeArea.filter + " " + variable + " " + choices[0].text;
  //       this.pptAveragepeople.filter = this.pptAveragepeople.filter + " " + variable + " " + choices[0].text;
  //       this.pptDownloadAgeDemographicObject.filter = this.pptDownloadAgeDemographicObject.filter + " " + variable + " " + choices[0].text;
  //       this.pptDownloadDemographicAverageObject.filter = this.pptDownloadDemographicAverageObject.filter + " " + variable + " " + choices[0].text;
  //       this.pptDownloadGenderDemographicObject.filter = this.pptDownloadGenderDemographicObject.filter + " " + variable + " " + choices[0].text;
  //       this.pptDownloadIncomeDemographicObject.filter = this.pptDownloadIncomeDemographicObject.filter + " " + variable + " " + choices[0].text;
  //       this.pptDownloadMaritalObject.filter = this.pptDownloadMaritalObject.filter + " " + variable + " " + choices[0].text;
  //       this.pptSecondOpinionsDatadt.filter = this.pptSecondOpinionsDatadt.filter + " " + variable + " " + choices[0].text;
  //     }
  //   }

  // }
  /**
   * functionality for Gender Chart
   * @param output Array of object of Gender chart
   * @param dataTable  All Gender chart detail in table form with base
   */
  genderChart(output, dataTable) {
    let baseValue = "NA";
    if (dataTable.bases.has('Base')) {
      baseValue = dataTable.bases.get('Base')[0];
    }
    let data = [];
    output.forEach(value => {
      let object = {
        Score: value.Score,
        SeriesName: value.SeriesName,
        Base: baseValue,
        compareScore: 0,
        compareBase: 0,
        isSignificance: dataTable.significance.get(value.SeriesName)[0]
      }
      if (dataTable.comparisonBases.get("Base") != undefined) {
        object.compareBase = dataTable.comparisonBases.get("Base")[0];
        dataTable.previousScoreRows.forEach((val, valindex) => {
          if (valindex === value.SeriesName && val[0] != undefined && !isNaN(val[0])) {
            object.compareScore = Math.round(value.Score - (val[0]));
          }
        });
      }
      data.push(object);
    });
    return data;
  }
  pptexporIncome(pptName) {
    this.getfilter();
    this.incomeData.forEach(element => {
      this.pptDownloadIncomeDemographicObject.serieswisedata.push({ 'seriesname': element.SeriesName, 'data': element.Score, 'bases': element.Base });
    })
    this.pptDownloadIncomeDemographicObject.filter = this.filter;
    this.showLoader = true;
    let obj = JSON.stringify(this.pptDownloadIncomeDemographicObject);
    obj = JSON.stringify(obj);
    this.pptexport.postPPTForIncomeDownload(obj).subscribe((data) => {
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
  pptexportRecentBuyer(pptName) {
    this.getfilter();
    this.recentBuyerData.forEach(element => {
      this.pptRecentBuyer.serieswisedata.push({ 'seriesname': element.SeriesName, 'data': element.Score, 'bases': element.Base });
    })
    this.pptRecentBuyer.filter = this.filter;
    this.showLoader = true;
    let obj = JSON.stringify(this.pptRecentBuyer);
    obj = JSON.stringify(obj);
    this.pptexport.postPPTForRecentDownload(obj).subscribe((data) => {
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
  pptexportIntenderBuyer(pptName) {
    this.getfilter();
    this.intenderBuyerData.forEach(element => {
      this.pptIntenderBuyer.serieswisedata.push({ 'seriesname': element.SeriesName, 'data': element.Score, 'bases': element.Base });
    })
    this.pptIntenderBuyer.filter = this.filter;
    this.showLoader = true;
    let obj = JSON.stringify(this.pptIntenderBuyer);
    obj = JSON.stringify(obj);
    this.pptexport.postPPTForintenderDownload(obj).subscribe((data) => {
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
  pptexportgender(pptName) {
    this.genderData.forEach(element => {
      if (element.SeriesName == 'Male') {
        this.pptDownloadGenderDemographicObject.Malescore = element.Score;
        this.pptDownloadGenderDemographicObject.MaleBase = element.Base
      }
      if (element.SeriesName == 'Female') {
        this.pptDownloadGenderDemographicObject.Femalescore = element.Score;
        this.pptDownloadGenderDemographicObject.FemaleBase = element.Base
      }
    })
    this.getfilter()
    this.pptDownloadGenderDemographicObject.filter = this.filter;
    this.showLoader = true;
    let obj = JSON.stringify(this.pptDownloadGenderDemographicObject);
    obj = JSON.stringify(obj);

    this.pptexport.postPPTForgenderDownload(obj).subscribe((data) => {
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
  pptMaritalstatus(pptName) {
    this.martialData.forEach(element => {
      this.pptDownloadMaritalObject.serieswisedata.push({ 'seriesname': element.SeriesName, 'data': element.Score, 'bases': element.Base })
    })
    this.getfilter()
    this.pptDownloadMaritalObject.filter = this.filter;
    this.showLoader = true;
    let obj = JSON.stringify(this.pptDownloadMaritalObject);
    obj = JSON.stringify(obj);
    this.pptexport.postPPTForMaritalStatusDownload(obj).subscribe((data) => {
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
  pptAge(pptName) {
    this.pptDownloadAgeDemographicObject.serieswisedata=[];
    this.ageData.forEach(element => {
      this.pptDownloadAgeDemographicObject.serieswisedata.push({ 'seriesname': element.SeriesName, 'data': element.Score, 'bases': element.Base });
    })

    this.getfilter()
    this.pptDownloadAgeDemographicObject.filter = this.filter;
    this.showLoader = true;
    let obj = JSON.stringify(this.pptDownloadAgeDemographicObject);
    obj = JSON.stringify(obj);
    this.pptexport.postPPTForAgeDownload(obj).subscribe((data) => {
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
  pptAreaexport(pptName) {
    this.pptArea.serieswisedata=[];
    this.areaData.forEach(element => {
      this.pptArea.serieswisedata.push({ 'seriesname': element.SeriesName, 'data': element.Score, 'bases': element.Base });
    })
    this.getfilter()
    this.pptArea.filter = this.filter;
    this.showLoader = true;
    let obj = JSON.stringify(this.pptArea);
    obj = JSON.stringify(obj);
    this.pptexport.postPPTAreaForDownload(obj).subscribe((data) => {
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
  pptOpinion(pptName) {
    this.OpinionsData.forEach(element => {
      this.pptOpiniondt.serieswisedata.push({ "seriesname": element.question, "data": element.values, "bases": element.Base })
    })
    this.getfilter()
    this.pptOpiniondt.filter = this.filter;
    this.showLoader = true;
    let obj = JSON.stringify(this.pptOpiniondt);
    obj = JSON.stringify(obj);
    this.pptexport.postPPTOpenionForDownload(obj).subscribe((data) => {
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
  pptSecondOpinionsData(pptName) {
    this.SecondOpinionsData.forEach(element => {
      this.pptSecondOpinionsDatadt.serieswisedata.push({ "seriesname": element.question, "data": element.values, "bases": this.mriSecondOpinionBase })
    })
    this.getfilter()
    this.pptSecondOpinionsDatadt.filter = this.filter;
    this.showLoader = true;
    let obj = JSON.stringify(this.pptSecondOpinionsDatadt);
    obj = JSON.stringify(obj);
    this.pptexport.postPPTSecondOpinionsForDownload(obj).subscribe((data) => {
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
  pptSecondknowledgeAreaData(pptName) {
    this.pptknowledgeArea.serieswisedata = [];
    this.knowledgeAreaData.forEach(element => {
      this.pptknowledgeArea.serieswisedata.push({ "SeriesName": element.SeriesName, "data": element.Score, "bases": this.mriknowledgeSharingBase })
    })
    this.getfilter()
    this.pptknowledgeArea.filter = this.filter;
    this.showLoader = true;
    let obj = JSON.stringify(this.pptknowledgeArea);
    obj = JSON.stringify(obj);
    this.pptexport.postPPTSecondknowledgeForDownload(obj).subscribe((data) => {
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
  pptadviceOnTopicsDataAreaData(pptName) {
    this.pptadviceOnTopicsDataob.serieswisedata = [];
    this.adviceOnTopicsData.forEach(element => {
      this.pptadviceOnTopicsDataob.serieswisedata.push({ 'seriesname': element.SeriesName, 'data': element.Score, 'bases': this.mriAdviceOnTopicBase });
    })
    this.getfilter()
    this.pptadviceOnTopicsDataob.filter = this.filter;
    this.showLoader = true;
    let obj = JSON.stringify(this.pptadviceOnTopicsDataob);
    obj = JSON.stringify(obj);
    this.pptexport.postPPTOnTopicsDataForDownload(obj).subscribe((data) => {
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
  pptkidshousehold(pptName) {
    this.kidsHouseHoldData.forEach(element => {
      this.pptKidsHousehold.serieswisedata.push({ 'seriesname': element.SeriesName, 'data': element.Score });
    })
    this.getfilter()
    this.pptKidsHousehold.filter = this.filter;
    this.showLoader = true;
    let obj = JSON.stringify(this.pptKidsHousehold);
    obj = JSON.stringify(obj);
    this.pptexport.postPPTForkidshouseholdDownload(obj).subscribe((data) => {
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
  pptadviceOnTopicsData() {
    this.adviceOnTopicsData.forEach(element => {

    })
  }
  pptRegion(pptName) {
    this.regionData.forEach(element => {
      this.pptRegionobj.serieswisedata.push({ 'seriesname': element.SeriesName, 'data': element.Score, 'bases': element.Base });
    })
    this.getfilter();
    this.pptRegionobj.filter = this.filter;
    this.showLoader = true;
    let obj = JSON.stringify(this.pptRegionobj);
    obj = JSON.stringify(obj);
    this.pptexport.postPPTForRegionDownload(obj).subscribe((data) => {
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
  /**
   * functionality for Age Chart
   * @param output Array of object of Age chart
   * @param dataTable  All Age chart detail in table form with base
   */
  ageChart(output, dataTable) {
    let baseValue = 'NA';
    if (dataTable.bases.has('Base')) {
      baseValue = dataTable.bases.get('Base')[0];
    }
    let data = [];
    output.forEach(value => {
      let compareScore = 0;
      let compareBase = 0;
      if (dataTable.comparisonBases.has("Base") && dataTable.comparisonBases.get("Base") != undefined) {
        compareBase = dataTable.comparisonBases.get('Base')[0];
      }
      if (value.previousScore) {
        compareScore = isNaN(value.previousScore) ? 'Na' : value.previousScore;
      }
      // if (value.Difference && value.Difference != undefined && !isNaN(value.Difference)) {
      //   compareScore = this.calculateCompareScore(value.Difference, value.Score);
      // }
      const isSig = dataTable.significance.get(value.SeriesName)[0];
      const object = {
        Score: value.Score,
        SeriesName: value.SeriesName,
        Base: baseValue,
        compareScore: compareScore,
        compareBase: compareBase,
        isSignificance: isSig
      }
      data.push(object);
    });
    return data;
  }

  /**
   * functionality for Age Chart
   * @param output Array of object of Age chart
   * @param dataTable  All Age chart detail in table form with base
   */
  incomeChart(output, dataTable) {
    let baseValue = 'NA';
    if (dataTable.bases.has('Base')) {
      baseValue = dataTable.bases.get('Base')[0];
    }
    let data = [];
    output.forEach(value => {
      let compareScore = 0;
      let compareBase = 0;
      if (dataTable.comparisonBases.has("Base") && dataTable.comparisonBases.get("Base") != undefined) {
        compareBase = dataTable.comparisonBases.get('Base')[0];
      }
      if (value.previousScore) {
        compareScore = isNaN(value.previousScore) ? 'Na' : value.previousScore;
      }
      // if (value.Difference && value.Difference != undefined && !isNaN(value.Difference)) {
      //   compareScore = this.calculateCompareScore(value.Difference, value.Score);
      // }
      const isSig = dataTable.significance.get(value.SeriesName)[0];
      const object = {
        Score: value.Score,
        SeriesName: value.SeriesName,
        Base: baseValue,
        compareScore: compareScore,
        compareBase: compareBase,
        isSignificance: isSig
      }
      data.push(object);
    });
    return data;
  }

  /**
   * functionality for Age Chart
   * @param output Array of object of Age chart
   * @param dataTable  All Age chart detail in table form with base
   */
  martialChart(output, dataTable) {
    let baseValue = 'NA';
    if (dataTable.bases.has('Base')) {
      baseValue = dataTable.bases.get('Base')[0];
    }
    let data = [];
    output.forEach(value => {
      let compareScore = 0;
      let compareBase = 0;
      if (dataTable.comparisonBases.has("Base") && dataTable.comparisonBases.get("Base") != undefined) {
        compareBase = dataTable.comparisonBases.get('Base')[0];
        // if (value.Difference && value.Difference != undefined && !isNaN(value.Difference)) {
        //   compareScore = this.calculateCompareScore(value.Difference, value.Score);
        // }
      }
      if (value.previousScore) {
        compareScore = isNaN(value.previousScore) ? 'Na' : value.previousScore;
      }
      const isSig = dataTable.significance.get(value.SeriesName)[0];
      const object = {
        Score: value.Score,
        SeriesName: value.SeriesName,
        Base: baseValue,
        compareScore: compareScore,
        compareBase: compareBase,
        isSignificance: isSig
      }
      data.push(object);
    });
    return data;
  }


  /**
   * functionality for Age Chart
   * @param output Array of object of Age chart
   * @param dataTable  All Age chart detail in table form with base
   */
  regionChart(output, dataTable) {
    let baseValue = 'NA';
    if (dataTable.bases.has('Base')) {
      baseValue = dataTable.bases.get('Base')[0];
    }
    let data = [];
    output.forEach(value => {
      let compareScore = 0;
      let compareBase = 0;
      if (dataTable.comparisonBases.has("Base") && dataTable.comparisonBases.get("Base") != undefined) {
        compareBase = dataTable.comparisonBases.get('Base')[0];
      }
      // if (value.Difference && value.Difference != undefined && !isNaN(value.Difference)) {
      //   compareScore = this.calculateCompareScore(value.Difference, value.Score);
      // }
      if (value.previousScore) {
        compareScore = isNaN(value.previousScore) ? 'Na' : value.previousScore;
      }
      const isSig = dataTable.significance.get(value.SeriesName)[0];
      const object = {
        Score: value.Score,
        SeriesName: value.SeriesName,
        Base: baseValue,
        compareScore: compareScore,
        compareBase: compareBase,
        isSignificance: isSig
      }
      data.push(object);
    });
    return data;
  }


  /**
   * functionality for Age Chart
   * @param output Array of object of Age chart
   * @param dataTable  All Age chart detail in table form with base
   */
  recentAndIntenderBuyerChart(output, dataTable) {
    let baseValue = 'NA';
    if (dataTable.bases.has('Base')) {
      baseValue = dataTable.bases.get('Base')[0];
    }
    let data = [];
    output.forEach(value => {
      let compareScore = 0;
      let compareBase = 0;
      if (dataTable.comparisonBases.has("Base") && dataTable.comparisonBases.get("Base") != undefined) {
        compareBase = dataTable.comparisonBases.get('Base')[0];
      }
      // if (value.Difference && value.Difference != undefined && !isNaN(value.Difference)) {
      //   compareScore = this.calculateCompareScore(value.Difference, value.Score);
      // }
      if (value.previousScore) {
        compareScore = isNaN(value.previousScore) ? 'Na' : value.previousScore;
      }
      const isSig = dataTable.significance.get(value.SeriesName)[0];
      const object = {
        Score: value.Score,
        SeriesName: value.SeriesName,
        Base: baseValue,
        compareScore: compareScore,
        compareBase: compareBase,
        isSignificance: isSig
      }
      data.push(object);
    });
    return data;
  }



  MRIdemographicCharts() {
    const demographics: DemographicsTable = new DemographicsTable();
    this.opinionChartConfig = demographics.MRIMostlyOpinionsChartConfigration('Opinions', ['v755', 'v756', 'v757', 'v758', 'v759', 'v760', 'v761', 'v762', 'v763', 'v764', 'v765', 'v766', 'v767', 'v768', 'v769', 'v770', 'v771']);
    this.secondOpinionChartConfig = demographics.MRICompletelyOpinionsChartConfigration('SecondOpinions', ['v773', 'v774', 'v775', 'v776', 'v777', 'v778', 'v779', 'v780',]);
    this.knowledgeAreaChart = demographics.MRIRadarRoseChartConfigration('Knowledge Area', ['v754'], '#2EA8DF');
    this.adviceOnTopicsChart = demographics.MRIRadarRoseChartConfigration('Advice on Topics', ['v772'], '#EC75D1');

    let questionMapping = demographics.MRIOPINIONLIFEMAPPING;
    this.opinionChartConfig.addCalculationLogic(output => {
      if (output.Bases.has("Opinions") && output.Bases.get("Opinions") != undefined) {
        this.mriOpinionBase = output.Bases.get("Opinions")[0].Score;
      }
      let table = output.TableOutput.get('Opinions');
      if (table.length) {
        this.OpinionsData = this.OpinionsOnLifeChart(output, 'Opinions', questionMapping);
      }
      return output;
    }, RoundOffStrategy.AfterCalculation);


    this.secondOpinionChartConfig.addCalculationLogic(output => {
      if (output.Bases.has("SecondOpinions") && output.Bases.get("SecondOpinions") != undefined) {
        this.mriSecondOpinionBase = output.Bases.get("SecondOpinions")[0].Score;
      }
      let table = output.TableOutput.get('SecondOpinions');
      if (table.length) {
        this.SecondOpinionsData = this.OpinionsOnLifeChart(output, 'SecondOpinions', questionMapping);
      }
      return output;
    }, RoundOffStrategy.AfterCalculation);


    this.knowledgeAreaChart.addCalculationLogic(output => {
      if (output.Bases.has("Knowledge Area") && output.Bases.get("Knowledge Area") != undefined) {
        this.mriknowledgeSharingBase = output.Bases.get("Knowledge Area")[0].Score;
      }
      let table = output.TableOutput.get('Knowledge Area');
      if (table.length) {
        const Base = output.Bases.get("Knowledge Area")[0].Score
        let data = [];
        table.forEach(value => {
          const object = {
            Score: value.Score,
            SeriesName: value.SeriesName,
            Base: Base
          }
          data.push(object);
        });
        if (data.length) this.knowledgeAreaData = data;
      }
      return output;
    }, RoundOffStrategy.AfterCalculation);


    this.adviceOnTopicsChart.addCalculationLogic(output => {
      if (output.Bases.has("Advice on Topics") && output.Bases.get("Advice on Topics") != undefined) {
        this.mriAdviceOnTopicBase = output.Bases.get("Advice on Topics")[0].Score;
      }
      let table = output.TableOutput.get('Advice on Topics');
      if (table.length) {
        const Base = output.Bases.get("Advice on Topics")[0].Score
        let data = [];
        table.forEach(value => {
          const object = {
            Score: value.Score,
            SeriesName: value.SeriesName,
            Base: Base
          }
          data.push(object);
          value.Score = Math.round(value.Score);
        });
        if (data.length) this.adviceOnTopicsData = data;
      }
      return output;
    }, RoundOffStrategy.AfterCalculation, 0);
  }

  /**
   * functionality for Opinions Chart
   * @param output Array of object of Opinions chart
   */
  OpinionsOnLifeChart(output, ChartName, questionMapping) {
    let table = output.TableOutput.get(ChartName);

    let data = [];
    let baseValue = 'NA';
    if (output.Bases.has(ChartName)) {
      baseValue = output.Bases.get(ChartName)[0].Score;
    }
    let counter = 0;

    table.forEach((value, i) => {
      let object = {
        "values": [Math.round(value.Score)],
        'question': questionMapping[value.SeriesVariableID],
        // 'SeriesName'  : value.SeriesName,
        'Base': baseValue,
      }
      let index = null;
      data.forEach((val, i) => {
        if (val.question == object.question) {
          index = i;
        }
      });
      if (index != null) {
        data[index].values.push(Math.round(value.Score));
      } else {
        data.push(object);
      }
    });
    return data;

  }

  /**
   * To Convert Data into CSV Form For Demographics
   */
  downloadExcelFile(excelData: Array<any>, chartName) {
    this.getfilter();
    let data: Array<any> = excelData;
    // data.forEach((element,ind) => {
    //   let dd = element;
    //   if(dd.Score >0 && dd.Score< 0.5){
    //     dd.Score = '0*';
    //   }
    //   data.push(dd);
    // });
    let csvData = [];
    this.csvOptions.headers=[];
    this.csvOptions.headers = ["Filter(s)",this.filter];
    csvData.push(Object.assign({}, this.csvDetailCreation(data, chartName)));
    let dataCsv=[];
    dataCsv.push('');
    data.forEach((val, index) => {
      const socre = this.scoreAndBase.transform(val.Score, data[0].Base)
      dataCsv.push(socre);
     // csvDetail.push(val.SeriesName.replace(/,/g, ''));
    });
  
    dataCsv.push(data[0].Base);
    csvData.push(dataCsv);
    this.csvOptions.title = "Demographics";

    new AngularCsv(csvData, "Demographics-" + chartName, this.csvOptions);
  }
  csvDetailCreation(data, sideBreak) {
    let csvDetail = [];
    csvDetail.push(sideBreak);
    data.forEach((val, index) => {
      csvDetail.push(val.SeriesName.replace(/,/g, ''));
    });
    csvDetail.push('Base');
    
    
    return csvDetail;
  }
  /**
   * To Convert Data into CSV Form For Demographics
   */
  MriDownloadExcelFile(data, chartName, opinions) {
    let csvData = [];
    let csvData1 = [];
    let csvnew=[];
    this.getfilter();
    this.csvOptions.headers=[];
    this.csvOptions.headers = ["Filter(s)",this.filter];
    csvData=this.MriCsvDetailCreation(opinions, 'Base');
    csvData1=this.MriCsvDetailCreation(data, chartName);
    csvnew.push(csvData[0]);
    csvData1.forEach(el=>{
      csvnew.push(el); 
    })
    this.csvOptions.title = "Demographics";
    // this.csvOptions.headers.push(opinions);
    // this.csvOptions.headers.push('Base');
    new AngularCsv(csvnew, "Demographics-" + chartName, this.csvOptions);
  }
  MriCsvDetailCreation(data, chartName) {
    let csvDetail = [];
    if(chartName=='Base'){
      let csvRowDetail = {
        question: "",
        values: data,
        base:chartName
  }
  csvDetail.push(csvRowDetail);
}
else{
    let dLength = data.length;
    data.forEach((obj, index) => {
      let csvRowDetail = {
        question: obj.question,
        values: [],
        base: this.mriOpinionBase
      };
      obj.values.forEach((value) => {
        const socre = this.scoreAndBase.transform(value, data[0].Base);
        csvRowDetail.values.push(socre);
      });
      csvRowDetail.values.reverse();
      csvDetail.push(csvRowDetail);
      //csvRowDetail.values.push(obj.Base);
      if (index == dLength) {
        csvRowDetail.question = 'Base';
        obj.values.forEach((value) => {
          csvRowDetail.values.push(data[0].Base);
        });
        csvDetail.push(csvRowDetail);
      }
    });
  }
    //csvDetail.push(data[0].Base);
    return csvDetail;
  }


  ngOnDestroy() {
    this.unsubscribedemographic.next();
    this.unsubscribedemographic.complete();
  }

  // calculateCompareScore(comparisionValue, realValue) {
  //   let compareScore
  //   if (comparisionValue != undefined) {
  //     if (isNaN(realValue) || realValue == "NaN" || realValue == undefined) {
  //       if (isNaN(comparisionValue) || comparisionValue == "NaN") {
  //         compareScore = 0;
  //       }
  //       else {
  //         compareScore = (Math.round(comparisionValue));
  //       }
  //     }
  //     else {
  //       if (isNaN(comparisionValue) || comparisionValue == "NaN") {
  //         compareScore = 0;
  //       }
  //       else {
  //         compareScore = (Math.round(realValue - (comparisionValue)));
  //       }
  //     }
  //   }
  //   else {
  //     compareScore = 0;
  //   }
  //   return compareScore;
  // }

}
