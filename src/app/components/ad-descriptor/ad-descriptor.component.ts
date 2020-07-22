import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { Subject } from 'rxjs';
import { Brands } from 'src/app/model/brands';
import { FilterService } from 'src/app/shell/services/filter.service';
import { ActivatedRoute } from '@angular/router';
import { FilterConfigService } from 'src/app/service/filter-config.service';
import { Discriptor } from 'src/app/model/Discriptor-caller';
import { Chart } from 'src/app/shell/models/chart';
import { element } from 'protractor';
import { TableOutput } from 'src/app/shell/interfaces/table-output';
import { UploadAdDetailService } from 'src/app/service/upload-ad-detail.service';
import { AdDetailsNew } from 'src/app/model/addDetalisnew';
import { takeUntil } from 'rxjs/operators';
import { AngularCsv } from 'angular7-csv/dist/Angular-csv';
import { AssetMappings } from 'src/app/model/asset.mappings';
import { ScoreAndBasePipe } from 'src/app/pipe/score-and-base.pipe';
import { FilterOption } from 'src/app/shell/models/filterOption';
import { PptExportService } from 'src/app/service/ppt-export.service';

@Component({
  selector: 'app-ad-descriptor',
  templateUrl: './ad-descriptor.component.html',
  styleUrls: ['./ad-descriptor.component.css'],
  providers: [ScoreAndBasePipe]
})
export class AdDescriptorComponent implements OnInit, OnDestroy, AfterViewInit {

  selectedTab = 'Descriptor';
  viewMode = 'tab1';
  checknew: boolean;
  AdChart: Array<Chart> = new Array<any>();
  AdChart1: Array<Chart> = new Array<any>();
  AdTrendChart: Chart;
  updateDataUnsubscribe: Subject<any> = new Subject<any>();
  onDataUpdate: Subject<any> = new Subject();
  AddData: Array<{
    code: number, addname: string, data: Array<TableOutput>, base: Array<number>, comapreScore: Array<TableOutput>,
    comapreBase: Array<number>, isSignificance: Array<any>
  }>;
  AddData1: Array<{
    code: number, addname: string, data: Array<TableOutput>, base: Array<number>, comapreScore: Array<TableOutput>,
    comapreBase: Array<number>, isSignificance: Array<any>
  }>;
  addLists: Array<AdDetailsNew> = new Array<AdDetailsNew>();
  ids: Array<string>;
  addCodes: Array<number>;
  showloader: boolean;
  dtDescriptor: Array<{ type: string, Data: Array<number> }>;
  dtCallToAction: Array<{ type: string, Data: Array<number> }>;
  logoByAddsCode = AssetMappings.logobyAdds;
  error: boolean;
  checknew1: boolean;
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
  csvOptions1 = {
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
  timePeriodChips: Map<string, Array<FilterOption>> = new Map<string, Array<FilterOption>>();
  addvidiopath = {
    "The Perfect Touch": "",
    "Hydrorain One": "",
    "Shield Yourself": "",
    "Quality Product Touchless KF": "",
    "Lysol ActiClean Self-Clean": "",
    "Innovative": "",
    "Mother Nature": "",
    "Konnect-Pouring Made Easy": "",
    "Verdera Voice Mirror": "",
    "The Design": "",
    "Life Designs/ Water is Life": "",
    "Perfect Fit/In Control": "",
    "In2ition Two-In-One": "",
    "Rough Water/In Control": "",
    "Moen Flow": ""
  }
  adcalltoactionAd1Name = {
    "adcalltoactionAd1": "The Perfect Touch",
    "adcalltoactionAd2": "Hydrorain One",
    "adcalltoactionAd3": "Shield Yourself",
    "adcalltoactionAd4": "Quality Product Touchless KF",
    "adcalltoactionAd5": "Lysol ActiClean Self-Clean",
    "adcalltoactionAd6": "Innovative",
    "adcalltoactionAd7": "Mother Nature",
    "adcalltoactionAd8": "Konnect-Pouring Made Easy",
    "adcalltoactionAd9": "Verdera Voice Mirror",
    "adcalltoactionAd10": "The Design",
    "adcalltoactionAd11": "Life Designs/ Water is Life",
    "adcalltoactionAd12": "Perfect Fit/In Control",
    "adcalltoactionAd13": "In2ition Two-In-One",
    "adcalltoactionAd14": "Rough Water/In Control",
    "adcalltoactionAd15": "Moen Flow"
  }
  adcalltoactionAd1NameCode = {
    "adcalltoactionAd1": 1,
    "adcalltoactionAd2": 2,
    "adcalltoactionAd3": 3,
    "adcalltoactionAd4": 4,
    "adcalltoactionAd5": 5,
    "adcalltoactionAd6": 6,
    "adcalltoactionAd7": 7,
    "adcalltoactionAd8": 8,
    "adcalltoactionAd9": 9,
    "adcalltoactionAd10": 10,
    "adcalltoactionAd11": 11,
    "adcalltoactionAd12": 12,
    "adcalltoactionAd13": 13,
    "adcalltoactionAd14": 14,
    "adcalltoactionAd15": 15
  }
  adderotationAd1Name1 = {
    "derotationAd1": "The Perfect Touch",
    "derotationAd2": "Hydrorain One",
    "derotationAd3": "Shield Yourself",
    "derotationAd4": "Quality Product Touchless KF",
    "derotationAd5": "Lysol ActiClean Self-Clean",
    "derotationAd6": "Innovative",
    "derotationAd7": "Mother Nature",
    "derotationAd8": "Konnect-Pouring Made Easy",
    "derotationAd9": "Verdera Voice Mirror",
    "derotationAd10": "The Design",
    "derotationAd11": "Life Designs/ Water is Life",
    "derotationAd12": "Perfect Fit/In Control",
    "derotationAd13": "In2ition Two-In-One",
    "derotationAd14": "Rough Water/In Control",
    "derotationAd15": "Moen Flow"
  }
  adderotationAd1Name1Code = {
    "derotationAd1": 1,
    "derotationAd2": 2,
    "derotationAd3": 3,
    "derotationAd4": 4,
    "derotationAd5": 5,
    "derotationAd6": 6,
    "derotationAd7": 7,
    "derotationAd8": 8,
    "derotationAd9": 9,
    "derotationAd10": 10,
    "derotationAd11": 11,
    "derotationAd12": 12,
    "derotationAd13": 13,
    "derotationAd14": 14,
    "derotationAd15": 15
  }
  addName = {
    "The Perfect Touch": 1,
    "Hydrorain One": 2,
    "Shield Yourself": 3,
    "Quality Product Touchless KF": 4,
    "Lysol ActiClean Self-Clean": 5,
    "Innovative": 6,
    "Mother Nature": 7,
    "Konnect-Pouring Made Easy": 8,
    "Verdera Voice Mirror": 9,
    "The Design": 10,
    "Life Designs/ Water is Life": 11,
    "Perfect Fit/In Control": 12,
    "In2ition Two-In-One": 13,
    "Rough Water/In Control": 14,
    "Moen Flow": 15
  }
  pptAddiscriptor = {
    'serieswisedata': [],
    'filter': ""
  }
  pptAdCalltoAction = {
    'serieswisedata': [],
    'filter': ""
  }
  discripterBase: any;
  callActionBase: any;
  constructor(private filterService: FilterService, private addDetailsService: UploadAdDetailService, private route: ActivatedRoute, private filterConfigService: FilterConfigService, private socreAndBase: ScoreAndBasePipe, private pptexport1: PptExportService) {
    this.filterConfigService.initializediscriptor();
  }

  ngOnInit() {
    // this.updateData();
    this.getAds();
    this.ids = [];
    this.addCodes = [];
    this.checknew = false;
    this.updateData();
    // if(this.filterService.selectedChoices!=undefined){
    //   this.filterService.selectedChoices .forEach((value, key) => this.setTimePeriodChips(key, value));
    // }
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
        this.updateData();
      });

  }
  ngOnDestroy(): void {
    this.updateDataUnsubscribe.next();
    this.updateDataUnsubscribe.complete();
  }

  ngAfterContentInit(): void {

  }
  ngAfterViewInit(): void {


  }
  updateData() {
    this.createTables();
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
        this.pptAdCalltoAction.filter = this.pptAdCalltoAction.filter + " " + variable + " " + choices[0].text;
        this.pptAddiscriptor.filter = this.pptAddiscriptor.filter + " " + variable + " " + choices[0].text;
      }
    }

  }
  createTables() {
    const brands = new Brands(this.filterService);
    const DiscriptorCall = new Discriptor();
    this.AdChart = DiscriptorCall.DiscriptorChart(this.addCodes);
    this.AddData = [];
    this.AddData1 = [];
    this.showloader = true;
    var addchartcalltoaction = [];
    var addchartAddiscriptor = [];
    this.dtCallToAction = [];
    this.dtDescriptor = [];

    this.AdChart.forEach(element => {
      element.addTableDataReady((output, datatable) => {
        this.showloader = false;
        var count1 = 0;
        let compareScore = [];
        let compareBase = [];
        let significance = [];
        addchartcalltoaction.push(output[0].SeriesVariableID);
        var base = datatable.bases.get('Base').map(value => Math.round(value));
        this.callActionBase = base;
        count1 = addchartcalltoaction.filter(item => item == output[0].SeriesVariableID).length;
        var code = output[0].SeriesVariableID;
        var dt = [];
        var dt1 = [];
        if (count1 == 1) {
          output.forEach(element => {
            dt.push(element.Score);
            dt1.push(element.SeriesName);
          });
          dt1.push('base');
          dt.push(base[0]);
          this.csvOptions.headers = [];
          this.csvOptions.headers.push('');
          dt1.forEach(el => {
            this.csvOptions.headers.push(el);
          });

          if (datatable.comparisonBases.get("Base") != undefined) {
            compareBase = datatable.comparisonBases.get("Base");
          }

          if (output.length > 0) {
            output.forEach((val, vindex) => {
              if (val.Difference && val.Difference != undefined && !isNaN(val.Difference)) {
                compareScore.push(Math.round(val.Score - (val.Difference)));
              }
              else {
                compareScore.push(0);
              }
              if (val.SignificanceSign != undefined && val.SignificanceSign !== 0) {
                significance.push(val.SignificanceSign);
              }
              else {
                significance.push(undefined);
              }
              // const isSignificance = datatable.significance.get(val.SeriesName)[0];
            });
          }

          this.dtCallToAction.push({ 'type': this.adcalltoactionAd1Name[code], 'Data': dt })
          this.AddData.push({
            'code': this.adcalltoactionAd1NameCode[code], 'addname': this.adcalltoactionAd1Name[code],
            'data': output, 'base': base, 'comapreScore': compareScore, 'comapreBase': compareBase, 'isSignificance': significance
          });
          this.AddData.sort((a, b) => b.code - a.code);
        }
      });
    })


    this.AdChart1 = DiscriptorCall.DiscriptorTrendChart(this.addCodes);
    this.AdChart1.forEach(element => {
      element.addTableDataReady((output, datatable) => {
        let compareScore = [];
        let compareBase = [];
        var count2 = 0;
        let significance = [];
        addchartAddiscriptor.push(output[0].SeriesVariableID);
        var base = datatable.bases.get('Base').map(value => Math.round(value));
        this.discripterBase = base;
        count2 = addchartAddiscriptor.filter(item => item == output[0].SeriesVariableID).length;
        var code = output[0].SeriesVariableID;
        var dt = [];
        var dt1 = [];
        if (count2 == 1) {
          output.forEach(element => {
            dt.push(element.Score);
            dt1.push(element.SeriesName);
          });
          dt1.push('base');
          dt.push(base[0]);
          this.csvOptions1.headers = [];
          this.csvOptions1.headers.push('');
          dt1.forEach(el => {
            this.csvOptions1.headers.push(el);
          })

          this.dtDescriptor.push({ 'type': this.adderotationAd1Name1[code], 'Data': dt });

          if (datatable.comparisonBases.get("Base") != undefined) {
            compareBase = datatable.comparisonBases.get("Base");
          }
          if (output.length > 0) {
            output.forEach((val, vindex) => {
              if (val.Difference && val.Difference != undefined && !isNaN(val.Difference)) {
                compareScore.push(Math.round(val.Score - (val.Difference)));
              }
              else {
                compareScore.push(0);
              }
              if (val.SignificanceSign != undefined && val.SignificanceSign !== 0) {
                significance.push(val.SignificanceSign);
              }
              else {
                significance.push(undefined);
              }
            });
          }
          this.AddData1.push({
            'code': this.adderotationAd1Name1Code[code], 'addname': this.adderotationAd1Name1[code],
            'data': output, 'base': base, 'comapreScore': compareScore, 'comapreBase': compareBase, 'isSignificance': significance
          });
          this.AddData1.sort((a, b) => b.code - a.code);
        }
      });
    })

  }

  hiddenalert() {
    const icon = document.getElementById('alert');
    if (icon != null) {
      icon.classList.add('hidden');
    }
  }
  showalert() {
    const icon = document.getElementById('alert');
    icon.classList.remove('hidden');
  }
  pptexport(pptName) {
    this.pptAddiscriptor.serieswisedata = [];
    this.pptAdCalltoAction.serieswisedata = [];
    if (this.selectedTab == 'Descriptor') {
      this.AddData1.forEach((element, i) => {
        var dt = []
        element.data.forEach(el => {
          dt.push(el.Score);
        });
        this.pptAddiscriptor.serieswisedata.push({ 'seriesname': element.addname, 'data': dt, 'bases': element.base[0] });
      })
      var obj = JSON.stringify(this.pptAddiscriptor);

      this.pptexport1.postAddiscriptor(JSON.stringify(obj)).subscribe((data) => {
        let blob = new Blob([data], { type: "application/octet-stream" });
        let url = window.URL.createObjectURL(blob);
        let a = document.createElement("a");
        document.body.appendChild(a);
        a.href = url;
        a.download = pptName + "_AdDiagnostic.zip";
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove();
        this.showloader = false;
      }, error => {
        console.log(error);
        this.showloader = false;
      });
    }
    else if (this.selectedTab == 'CallToAction') {
      this.AddData.forEach((element, i) => {
        var dt = []
        element.data.forEach(el => {
          dt.push(el.Score);
        });
        this.pptAdCalltoAction.serieswisedata.push({ 'seriesname': element.addname, 'data': dt, 'bases': element.base[0] })
      })
      var obj1 = JSON.stringify(this.pptAdCalltoAction);
      this.pptexport1.postaddCalltoAction2(JSON.stringify(obj1)).subscribe((data) => {
        let blob = new Blob([data], { type: "application/octet-stream" });
        let url = window.URL.createObjectURL(blob);
        let a = document.createElement("a");
        document.body.appendChild(a);
        a.href = url;
        a.download = pptName + "_CallToActionPPT.zip";
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
  getAds() {
    this.addDetailsService.getAllAds().subscribe((data) => {
      this.addLists = [];
      this.addLists = data;
      this.addLists.forEach((item, index) => {
        if (index !== this.addLists.findIndex(i => i.adname === item.adname)) {
          this.addLists.splice(index, 1);
        }

      });

      this.addLists.forEach(el => {
        this.addvidiopath[el.adname] = el.videopath;
      });

      this.addCodes.push(this.addName[this.addLists[0].adname]);
      this.addCodes.push(this.addName[this.addLists[1].adname]);
      this.addCodes.push(this.addName[this.addLists[2].adname]);
      this.updateData();

    }, error => {
      console.log(error);

    });
  }
  videoSelected1(id: string) {
    if ((id == '0' || id == '1' || id == '2') && this.checknew == false) {
      var icon = document.getElementById(id);
      if (icon) {
        if (!this.ids.includes(id)) {
          this.ids.push(id);
          icon.classList.add('selected');
        }
      }
    }
  }
  changeTable(tabName, tab) {
    this.selectedTab = tabName;
    this.viewMode = tab;
  }
  ExcellExport() {
    if (this.selectedTab == 'Descriptor') {
      const data = this.dtDescriptor;
      data.forEach((element, i) => {
        if (i <= element.Data.length - 1) {
          element.Data.forEach((ele, k) => {
            this.dtDescriptor[i].Data[k] = this.socreAndBase.transform(ele, this.discripterBase[0]);
          });
        }
      });
      this.csvOptions1.title = "Descriptor";
      new AngularCsv(this.dtDescriptor, "Descriptor", this.csvOptions1);
    }
    if (this.selectedTab == 'CallToAction') {
      const data = this.dtCallToAction;
      data.forEach((element, i) => {
        if (i <= element.Data.length - 1) {
          element.Data.forEach((ele, k) => {
            this.dtCallToAction[i].Data[k] = this.socreAndBase.transform(ele, this.callActionBase[0]);
          });
        }
      });
      this.csvOptions.title = "CallToAction";
      new AngularCsv(this.dtCallToAction, "CallToAction", this.csvOptions);
    }
  }

  videoSelected($event, id: string, el: any) {
    const allIcons = document.getElementsByClassName('video');
    var icon = document.getElementById(id);

    var check: boolean;
    this.checknew = true;
    if (this.ids.length > 2) {
      this.ids.forEach(element => {
        if (id == element) {

          icon.classList.remove('selected');
          if (this.ids.length == 3) {
            this.hiddenalert();
          }
          this.ids = this.ids.filter(obj => obj !== id);

          check = true;
          this.addCodes = this.addCodes.filter(obj => obj !== this.addName[el]);
          this.updateData();


        }
      })
    }
    if (this.ids.length == 3) {
      this.error = true;
      this.showalert();
    }
    if (check == undefined && this.ids.length < 3 && this.ids.length >= 2) {
      if (!this.ids.includes(id)) {
        this.ids.push(id);
        if (this.ids.length == 3) {
          icon.classList.add('selected');
        }

        this.checknew1 = true;

        this.addCodes.push(this.addName[el]);
        this.updateData();
      }
    }
  }
  // if (check == true && this.ids.length <= 3&&this.ids.length>1) {
  //   this.addCodes = this.addCodes.filter(obj => obj !== this.addName[el]);
  //   this.updateData();
  // }

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

