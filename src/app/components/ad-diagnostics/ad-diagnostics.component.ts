import { AdService } from "src/app/service/ad-service";
import { Component, OnInit, OnDestroy } from "@angular/core";
import { AD } from "./../../model/ad";
import { Chart } from "src/app/shell/models/chart";
import { FilterService } from "src/app/shell/services/filter.service";
import { takeUntil } from "rxjs/operators";
import { Subject, Subscription } from "rxjs";
import { FilterConfigService } from "src/app/service/filter-config.service";
import { adDiagnostics } from "src/app/model/adDiagnostics";
import { AssetMappings } from "src/app/model/asset.mappings";
import { DataTable } from "src/app/shell/models/dataTable";
import { UploadAdDetailService } from "src/app/service/upload-ad-detail.service";
import { AdDetailsSchema } from "src/app/model/addetails";
import { Brands } from "src/app/model/brands";
import { ActivatedRoute } from "@angular/router";
import { AngularCsv } from "angular7-csv/dist/Angular-csv";
import { isString } from "util";
import { ScoreAndBasePipe } from "src/app/pipe/score-and-base.pipe";
import { element } from "protractor";
import { FilterOption } from "src/app/shell/models/filterOption";
import { PptExportService } from "src/app/service/ppt-export.service";
import { AppliedFilterSetService } from "src/app/service/applied-filter-set.service";
import { TimePeriod } from "src/app/shell/models/time.period";
import { FilterHideService } from "src/app/service/filter-hide.service";
import { adVariableModal } from "./ad-variable-modal";

@Component({
  selector: "app-ad-diagnostics",
  templateUrl: "./ad-diagnostics.component.html",
  styleUrls: ["./ad-diagnostics.component.css"],
  providers: [ScoreAndBasePipe],
})
export class AdDiagnosticsComponent implements OnInit, OnDestroy {
  selectedTab = "Recall";
  viewMode = "tab1";
  showPopup: boolean;
  showLoader: boolean;
  updateDataUnsubscribe: Subject<any> = new Subject<any>();
  onDataUpdate: Subject<any> = new Subject();
  onDataUpdateBubble: Subject<any> = new Subject();
  brandList: any;
  netActionAverage: number;
  totalaverageOfRow: number;

  overallBaseDiagnostic: Array<any> = new Array<any>();
  overallBaseCallToAction: Array<any> = new Array<any>();

  adDiagnosticChartForAllBrands: Chart;
  adDiagnosticTableDelta: Array<any> = new Array<any>();
  adDiagnosticTableMoen: Array<any> = new Array<any>();
  adDiagnosticTableKohler: Array<any> = new Array<any>();
  adDiagnosticTableAmerican: Array<any> = new Array<any>();
  adDiagnosticAverageChart: Chart;
  adDiagnosticAverageArray: Array<any> = new Array<any>();

  adCallToActionChartAllBrands: Chart;
  adCallToActionTableDelta: Array<any> = new Array<any>();
  adCallToActionTableMoen: Array<any> = new Array<any>();
  adCallToActionTableKohler: Array<any> = new Array<any>();
  adCallToActionTableAmerican: Array<any> = new Array<any>();
  adCallActionRowAverageChart: Chart;
  adCallActionRowAverageArray: Array<any> = new Array<any>();
  adCallActionColAverageChart: Chart;
  adCallActionColAverageArray: Array<any> = new Array<any>();

  addLists: Array<AdDetailsSchema> = new Array<AdDetailsSchema>();

  adRecallDataChart: Chart;
  recallBases: Array<any>;
  adRecallDataArray: Array<any> = new Array<any>();
  detalAdSelector: Array<any> = new Array<any>();
  aSAdSelector: Array<any> = new Array<any>();
  kohlerAdSelector: Array<any> = new Array<any>();
  moenAdSelector: Array<any> = new Array<any>();
  AllSelectedAds: Array<any> = new Array<any>();

  data = false;
  table: any;
  dtRetailer: Array<{ ques: string; score: Array<number>; base?: number }>;
  dtECR: Array<Array<any>>;
  isCallAdDiagnostics: boolean = false;
  isCallCallToAction: boolean = false;
  isCallTotalAvgDiagnostic: boolean = false;
  isCallTotalAvgCallAction: boolean = false;
  isCallApi: boolean = false;
  isDiagnosticTotal: boolean = false;
  isCallToActionTotal: boolean = false;
  isCallToActionNet: boolean = false;

  adDiagnosticTotalAverageChart: Chart;
  bubblechart3: Chart;
  adDiagnosticTotalAverage: Array<any> = new Array<any>();
  adCallToActionTotalAverageChart: Chart;
  adCallToActionTotalAverage: Array<any> = new Array<any>();
  adCallToActionTakeSomeActionNetChart: Chart;
  filter: string;
  public showChart = false;
  public showTrends = false;

  adDiagnosticMap: Map<string, {}> = new Map<string, {}>();
  adCallToActionMap: Map<string, {}> = new Map<string, {}>();

  DiagnosticDeviderArray: Array<number> = new Array<number>();
  adCalltoActionDeviderArray: Array<number> = new Array<number>();

  adRecallBrandingGridData: Map<string, any> = new Map<string, any>();

  subsDelta: Subscription;
  subsAs: Subscription;
  subsKohler: Subscription;
  subsMoen: Subscription;
  idDelta: any;
  idMoen: any;
  idKohler: any;
  idAs: any;
  selectedBrandsCode: Array<number> = [1, 4, 3, 2];
  subsAllBrand: Subscription;
  isDeltaTrue: boolean = false;
  isMoenTrue: boolean = false;
  isKohlerTrue: boolean = false;
  isAmericanTrue: boolean = false;
  timePeriodChips: Map<string, Array<FilterOption>> = new Map<
    string,
    Array<FilterOption>
  >();

  adDiagnosticTestMapping: string[] = [
    "I enjoyed the ad",
    "I would like to see the ad again",
    "I am getting tired of seeing this ad",
    "The ad made me more likely to buy the brand",
    "The ad made the brand seem more appealing",
    "The ad contained information that is important to me",
    "The ad told me something new",
    "The information in the ad was believable",
    "I found the ad easy to understand",
    "The ad was original",
    "The ad is different from other ads I have seen for kitchen or bath plumbing products",
  ];

  adCallToActionTextMapping: string[] = [
    "totalRowNet",
    "Look for the brand/product in store",
    "Visit the brand/products website",
    "Search for the brand/product online",
    "Click on the ad for more info",
    "Get more information about the brand/product",
    "Talk about the brand/product with friends, family or co-workers",
    "Recommend the brand/product to a friend, family or co-worker",
    "Talk about the brand/product on social media (e.g., Facebook, Twitter)",
    "Write a blog entry",
  ];

  adCallToActionTextMappingTotalAverage: string[] = [
    "combineCallToActionAverage",
    "Look for the brand/product in store",
    "Visit the brand/products website",
    "Search for the brand/product online",
    "Click on the ad for more info",
    "Get more information about the brand/product",
    "Talk about the brand/product with friends, family or co-workers",
    "Recommend the brand/product to a friend, family or co-worker",
    "Talk about the brand/product on social media (e.g., Facebook, Twitter)",
    "Write a blog entry",
  ];

  csvOptions = {
    fieldSeparator: ",",
    quoteStrings: '"',
    decimalseparator: ".",
    showLabels: true,
    showTitle: true,
    title: "Delta",
    useBom: true,
    noDownload: false,
    headers: [],
  };

  Ad = {
    "The Perfect Touch": 0,
    "Hydrorain One": 1,
    "Shield Yourself": 2,
    "In2ition Two-In-One": 3,
    "Water Dog": 4,
    "Quality Product Touchless KF": 0,
    "Lysol ActiClean Self-Clean": 1,
    "Innovative": 2,
    "Automatic": 3,
    "Mother Nature": 0,
    "Konnect-Pouring Made Easy": 1,
    "Verdera Voice Mirror": 2,
    "Hungry Pet": 3,
    "The Design": 0,
    "Life Designs/ Water is Life": 1,
    "Perfect Fit/In Control": 2,
    "Rough Water/In Control": 3,
    "Moen Flow": 4,
    "U-Smart Faucet": 5,
    "Life Worth": 6,
  };
  private readonly variableOptionForSideBreak = {
    sideBreakVariableDiagnostic: [
      "derotationAd1",
      "derotationAd2",
      "derotationAd3",
      "derotationAd13",
      "derotationAd16",
      "derotationAd10",
      "derotationAd11",
      "derotationAd12",
      "derotationAd14",
      "derotationAd15",
      "derotationAd19",
      "derotationAd20",
      "derotationAd7",
      "derotationAd8",
      "derotationAd9",
      "derotationAd18",
      "derotationAd4",
      "derotationAd5",
      "derotationAd6",
      "derotationAd17",
    ],

    sideBreakVariableCalltoAction: [
      "adcalltoactionAd1",
      "adcalltoactionAd2",
      "adcalltoactionAd3",
      "adcalltoactionAd13",
      "adcalltoactionAd16",
      "adcalltoactionAd10",
      "adcalltoactionAd11",
      "adcalltoactionAd12",
      "adcalltoactionAd14",
      "adcalltoactionAd15",
      "adcalltoactionAd19",
      "adcalltoactionAd20",
      "adcalltoactionAd7",
      "adcalltoactionAd8",
      "adcalltoactionAd9",
      "adcalltoactionAd18",
      "adcalltoactionAd4",
      "adcalltoactionAd5",
      "adcalltoactionAd6",
      "adcalltoactionAd17",
    ],

    // tslint:disable-next-line: max-line-length
    sideBreakvariableAdRecall: [
      "brandingAd1",
      "brandingAd2",
      "brandingAd3",
      "brandingAd13",
      "brandingAd4",
      "brandingAd5",
      "brandingAd6",
      "brandingAd7",
      "brandingAd8",
      "brandingAd9",
      "brandingAd10",
      "brandingAd11",
      "brandingAd12",
      "brandingAd14",
      "brandingAd15",
      "brandingAd16",
      "brandingAd17",
      "brandingAd18",
      "brandingAd19",
      "brandingAd20",
    ],

    // tslint:disable-next-line: max-line-length
    topBreakvariableAdRecall: [
      "adRecallAd1",
      "adRecallAd2",
      "adRecallAd3",
      "adRecallAd13",
      "adRecallAd4",
      "adRecallAd5",
      "adRecallAd6",
      "adRecallAd7",
      "adRecallAd8",
      "adRecallAd9",
      "adRecallAd10",
      "adRecallAd11",
      "adRecallAd12",
      "adRecallAd14",
      "adRecallAd15",
      "adRecallAd16",
      "adRecallAd17",
      "adRecallAd18",
      "adRecallAd19",
      "adRecallAd20",
    ],
  };
  bubbleRecallMapping = {
    brandingAd1: "Delta",
    brandingAd2: "Delta",
    brandingAd3: "Delta",
    brandingAd4: "American_Standard",
    brandingAd5: "American_Standard",
    brandingAd6: "American_Standard",
    brandingAd7: "Kohler",
    brandingAd8: "Kohler",
    brandingAd9: "Kohler",
    brandingAd10: "Moen",
    brandingAd11: "Moen",
    brandingAd12: "Moen",
    brandingAd13: "Delta",
    brandingAd14: "Moen",
    brandingAd15: "Moen",
    brandingAd16: "Delta",
    brandingAd17: "American_Standard",
    brandingAd18: "Kohler",
    brandingAd19: "Moen",
    brandingAd20: "Moen",

    adRecallAd1: "Delta",
    adRecallAd2: "Delta",
    adRecallAd3: "Delta",
    adRecallAd4: "American_Standard",
    adRecallAd5: "American_Standard",
    adRecallAd6: "American_Standard",
    adRecallAd7: "Kohler",
    adRecallAd8: "Kohler",
    adRecallAd9: "Kohler",
    adRecallAd10: "Moen",
    adRecallAd11: "Moen",
    adRecallAd12: "Moen",
    adRecallAd13: "Delta",
    adRecallAd14: "Moen",
    adRecallAd15: "Moen",
    adRecallAd16: "Delta",
    adRecallAd17: "American_Standard",
    adRecallAd18: "Kohler",
    adRecallAd19: "Moen",
    adRecallAd20: "Moen",
  };
  brandsVariableIndexing = {
    Delta: [
      "The Perfect Touch",
      "Hydrorain One",
      "Shield Yourself",
      "In2ition Two-In-One",
      "Water Dog",
    ],
    Moen: [
      "The Design",
      "Life Designs/ Water is Life",
      "Perfect Fit/In Control",
      "Rough Water/In Control",
      "Moen Flow",
      "U-Smart Faucet",
      "Life Worth",
    ],
    Kohler: [
      "Mother Nature",
      "Konnect-Pouring Made Easy",
      "Verdera Voice Mirror",
      "Hungry Pet",
    ],
    "American Standard": [
      "Quality Product Touchless KF",
      "Lysol ActiClean Self-Clean",
      "Innovative",
      "Automatic",
    ],
  };

  brandColorGroup = {
    "#C80000": "Delta",
    "#FFD400": "American Standard",
    "#000000": "Kohler",
    "#00B7F9": "Moen",
  };

  brandViseAdIndexMappingDiagnostic = {
    Delta: [
      "derotationAd1",
      "derotationAd2",
      "derotationAd3",
      "derotationAd13",
      "derotationAd16",
    ],
    Moen: [
      "derotationAd10",
      "derotationAd11",
      "derotationAd12",
      "derotationAd14",
      "derotationAd15",
      "derotationAd19",
      "derotationAd20",
    ],
    Kohler: ["derotationAd7", "derotationAd8", "derotationAd9", "derotationAd18"],
    AmericanStandard: [
      "derotationAd4",
      "derotationAd5",
      "derotationAd6",
      "derotationAd17",
    ],
  };

  brandViseAdIndexMappingCallToAction = {
    Delta: [
      "adcalltoactionAd1",
      "adcalltoactionAd2",
      "adcalltoactionAd3",
      "adcalltoactionAd13",
      "adcalltoactionAd16",
    ],
    Moen: [
      "adcalltoactionAd10",
      "adcalltoactionAd11",
      "adcalltoactionAd12",
      "adcalltoactionAd14",
      "adcalltoactionAd15",
      "adcalltoactionAd19",
      "adcalltoactionAd20",
    ],
    Kohler: ["adcalltoactionAd7", "adcalltoactionAd8", "adcalltoactionAd9", "adcalltoactionAd18"],
    AmericanStandard: [
      "adcalltoactionAd4",
      "adcalltoactionAd5",
      "adcalltoactionAd6",
      "adcalltoactionAd17",
    ],
  };

  callToActionAdNameMapping = {
    adcalltoactionAd1: "The Perfect Touch",
    adcalltoactionAd2: "Hydrorain One",
    adcalltoactionAd3: "Shield Yourself",
    adcalltoactionAd13: "In2ition Two-In-One",
    adcalltoactionAd16: "Water Dog",
    adcalltoactionAd10: "The Design",
    adcalltoactionAd11: "Life Designs/ Water is Life",
    adcalltoactionAd12: "Perfect Fit/In Control",
    adcalltoactionAd14: "Rough Water/In Control",
    adcalltoactionAd15: "Moen Flow",
    adcalltoactionAd19: "U-Smart Faucet",
    adcalltoactionAd20: "Life Worth",
    adcalltoactionAd7: "Mother Nature",
    adcalltoactionAd8: "Konnect-Pouring Made Easy",
    adcalltoactionAd9: "Verdera Voice Mirror",
    adcalltoactionAd18: "Hungry Pet",
    adcalltoactionAd4: "Quality Product Touchless KF",
    adcalltoactionAd5: "Lysol ActiClean Self-Clean",
    adcalltoactionAd6: "Innovative",
    adcalltoactionAd17: "Automatic",
  };

  Delta = [
    "The Perfect Touch",
    "Hydrorain One",
    "Shield Yourself",
    "In2ition Two-In-One",
    "Water Dog",
  ];
  Moen = [
    "The Design",
    "Life Designs/ Water is Life",
    "Perfect Fit/In Control",
    "Rough Water/In Control",
    "Moen Flow",
    "U-Smart Faucet",
    "Life Worth",
  ];
  Kohler = [
    "Mother Nature",
    "Konnect-Pouring Made Easy",
    "Verdera Voice Mirror",
    "Hungry Pet",
  ];
  American = [
    "Quality Product Touchless KF",
    "Lysol ActiClean Self-Clean",
    "Innovative",
    "Automatic",
  ];

  deltaArrayLength: number = 5;
  moenArrayLength: number = 7;
  KohlerArrayLength: number = 4;
  americanArrayLength: number = 4;

  // tslint:disable-next-line: max-line-length
  listOfEcr: Array<any> = new Array<any>();
  adrecalAndBrandingArray: Chart;
  ercValues = {
    Delta: [],
    "American Standard": [],
    Kohler: [],
    Moen: [],
    filter: "",
    bases: 0,
  };
  ecrCallComp: boolean = false;
  pptAdDiagnostic = {
    seriesname: [],
    AverageAllAds: [],
    AverageSelectedAd: [],
    Deltatable: [],
    Moentable: [],
    Kohlertable: [],
    Americantable: [],
    filter: "",
  };
  pptAdcalltoaction = {
    seriesname: [],
    AverageAllAds: [],
    AverageSelectedAd: [],
    Deltatable: [],
    Moentable: [],
    Kohlertable: [],
    Americantable: [],
    filter: "",
  };
  hideFilterForTrends: boolean = false;
  constructor(
    private filterService: FilterService,
    private route: ActivatedRoute,
    private pptexport1: PptExportService,
    private addDetailsService: UploadAdDetailService,
    private filterConfigService: FilterConfigService,
    private adselector: AdService,
    private scoreandBase: ScoreAndBasePipe,
    private appliedFilterSet: AppliedFilterSetService,
    private hideFilterTrends: FilterHideService
  ) {
    this.subsAllBrand = this.adselector.getAllData().subscribe((data) => {
      this.showLoader = true;
      this.isCallAdDiagnostics = true;
      this.AllSelectedAds = data;
      if (this.AllSelectedAds.length > 0) {
        this.deltaArrayLength = 0;
        this.moenArrayLength = 0;
        this.KohlerArrayLength = 0;
        this.americanArrayLength = 0;
        this.Delta.forEach((val, i) => {
          if (this.AllSelectedAds.indexOf(val) > -1) {
            this.deltaArrayLength++;
          }
        });
        this.Moen.forEach((val, i) => {
          if (this.AllSelectedAds.indexOf(val) > -1) {
            this.moenArrayLength++;
          }
        });
        this.Kohler.forEach((val, i) => {
          if (this.AllSelectedAds.indexOf(val) > -1) {
            this.KohlerArrayLength++;
          }
        });
        this.American.forEach((val, i) => {
          if (this.AllSelectedAds.indexOf(val) > -1) {
            this.americanArrayLength++;
          }
        });
        this.isCallAdDiagnostics = true;
        this.isCallCallToAction = true;
        this.isCallTotalAvgDiagnostic = true;
        this.isCallTotalAvgCallAction = true;
        this.isCallApi = true;
        this.isDiagnosticTotal = true;
        this.isCallToActionTotal = true;
        this.isCallToActionNet = true;
        this.createCharts();
        setTimeout(() => {
          this.onDataUpdate.next();
        });
      }
    });
  }

  initPara() {
    this.brandList = [];
    this.selectedBrandsCode = [1, 4, 3, 2];
    this.netActionAverage = 0;
    this.adDiagnosticTableDelta = [];
    this.adDiagnosticTableMoen = [];
    this.adDiagnosticTableKohler = [];
    this.adDiagnosticTableAmerican = [];
    this.adCallToActionTableDelta = [];
    this.adCallToActionTableMoen = [];
    this.adCallToActionTableKohler = [];
    this.adCallToActionTableAmerican = [];
    this.adDiagnosticAverageArray = [];
    this.adCallActionColAverageArray = [];
    this.adCallActionRowAverageArray = [];
    this.overallBaseDiagnostic = [];
    this.overallBaseCallToAction = [];
    this.adDiagnosticTotalAverage = [];
    this.adCallToActionTotalAverage = [];
    this.totalaverageOfRow = 0;
    this.adRecallDataArray = [];
    this.detalAdSelector = [];
    this.aSAdSelector = [];
    this.kohlerAdSelector = [];
    this.moenAdSelector = [];
    this.isCallToActionNet = false;
    this.adCalltoActionDeviderArray = [];
    this.DiagnosticDeviderArray = [];
    //this.adRecallBrandingGridData = new Map<string, any>();
  }

  ngOnInit() {
    this.showLoader = true;
    this.ecrCallComp = false;

    //this.getAds();
    this.createCharts();
    //this.bubblechart();
    this.route.params.subscribe((params) => {
      if (this.filterService.getAppliedFilters().size === 0) {
        localStorage.removeItem("filterapp");
      }
      if (
        this.filterService.getAppliedFilters().size !== 0 ||
        this.filterService.getAppliedSeriesSelectors().size !== 0 ||
        this.filterService.getAppliedTimePeriods().size !== 0
      ) {
        this.createCharts();
        //this.bubblechart();
        setTimeout(() => {
          this.onDataUpdate.next();
        });
      }
    });
    // if(this.filterService.selectedChoices!=undefined){
    //   this.filterService.selectedChoices .forEach((value, key) => this.setTimePeriodChips(key, value));
    // }
    this.getAds();
    this.filterService.optionSelectionCallback$
      .pipe(takeUntil(this.updateDataUnsubscribe))
      .subscribe((value) => {
        // this.appliedFilterSet.selectedChoicesFilterTransfer(value);
        // value = this.appliedFilterSet.returnIt();
        this.createCharts();

        this.bubblechart();
        setTimeout(() => {
          this.onDataUpdate.next();
          this.onDataUpdateBubble.next();
        });
      });
    // if (this.appliedFilterSet.choices.length > 0) {
    //     this.filterService.setChoices(this.appliedFilterSet.variable, this.appliedFilterSet.choices);
    //   }
  }
  bubblechart() {
    //this.adrecalAndBrandingArray = [];
    const diagnostic: adDiagnostics = new adDiagnostics();
    //let valueECR = JSON.parse(localStorage.getItem('ECR'));
    // this.ercValues = valueECR;
    let Recalldata = [];
    let Branding = [];
    let ecrdt = [];
    if (this.ecrCallComp) {
      this.adrecalAndBrandingArray = diagnostic.getAddRecallandBrand(
        "BubbleECRChart",
        this.ercValues,
        this.brandsVariableIndexing,
        this.brandColorGroup
      );
    }
    //const adBrandingChart  = diagnostic.getAddRecallandBrand('AdBrandingY');
    if (this.ecrCallComp) {
      this.bubblechart3 = diagnostic.getAddRecallandBrand1(
        "Bubble",
        this.ercValues,
        this.brandsVariableIndexing
      );
    }
    this.bubblechart3.addCalculationLogic((output) => {
      ecrdt = [];
      let Recalldata = [];
      let Branding = [];
      let xandYLength = this.variableOptionForSideBreak.topBreakvariableAdRecall
        .length;
      let table = output.TableOutput.get(this.bubblechart3.Name);
      table.forEach((value) => {
        value.CategoryName = this.bubbleRecallMapping[value.SeriesVariableID];
      });
      table.forEach((element) => {
        if (element.SeriesName == "Yes") {
          var obj = {
            SeriesVariableID: this.bubbleRecallMapping[
              element.SeriesVariableID
            ],
            Brand: element.CategoryName,
            data: element.Score,
            CategoryCode: element.CategoryCode,
            CategoryVariableID: element.CategoryVariableID,
          };
          Recalldata.push(obj);
        } else {
          var obj = {
            SeriesVariableID: this.bubbleRecallMapping[
              element.SeriesVariableID
            ],
            Brand: element.CategoryName,
            data: element.Score,
            CategoryCode: element.CategoryCode,
            CategoryVariableID: element.CategoryVariableID,
          };
          Branding.push(obj);
        }
      });
      // console.log(Recalldata);
      // console.log(Branding);
      let series = [];
      let counter = 0;
      const brands = {
        Delta: 0,
        American_Standard: 1,
        Kohler: 2,
        Moen: 3,
      };
      // console.log(table);
      // console.log(this.ercValues);
      let AMCount = 0;
      let KhC = 0;
      let mCount = 0;

      Recalldata.forEach((el, i) => {
        if (el.SeriesVariableID == "Delta") {
          let sumcount: any;
          var adname;

          adname = this.brandsVariableIndexing[el.SeriesVariableID][i];
          sumcount = 0;
          for (var l = 0; l < this.ercValues["Delta"][i].length; l++) {
            let quarStr = this.ercValues["Delta"][i][l].quar.split("_");
            let quar = parseInt(quarStr[0].substr(1));
            let year = Math.abs(parseInt(quarStr[1]) - 2019) * 4;
            let num = quar + year;
            if (el.CategoryVariableID === "Quarterly") {
              if (num <= parseInt(el.CategoryCode)) {
                sumcount = sumcount + this.ercValues["Delta"][i][l].score;
              }
            } else if (el.CategoryVariableID === "Semiannual") {
              let updatedCatCode;
              if (el.CategoryCode === "1") {
                updatedCatCode = parseInt(el.CategoryCode) * 2;
              } else if (el.CategoryCode === "2") {
                updatedCatCode = parseInt(el.CategoryCode) * 2;
              }
              if (num <= updatedCatCode) {
                sumcount = sumcount + this.ercValues["Delta"][i][l].score;
              }
            } else if (el.CategoryVariableID === "Yearly") {
              sumcount = sumcount + this.ercValues["Delta"][i][l].score;
            }
          }
          // if (isNaN(el.data) || isNaN(Branding[i].data)) {
          // }
          // else {
          var obj2 = {
            brand: el.SeriesVariableID,
            Recallscore: isNaN(el.data) ? "NA" : Math.round(el.data),
            Brandingcore: isNaN(Branding[i].data)
              ? "NA"
              : Math.round(Branding[i].data),
            Adname: adname,
            sum: sumcount,
          };
          ecrdt.push(obj2);
          //}
        } else if (el.SeriesVariableID == "American_Standard") {
          let sum1 = [];
          var adname1 = [];

          for (var n = 0; n < this.ercValues["American Standard"].length; n++) {
            adname1.push(
              this.brandsVariableIndexing[
                el.SeriesVariableID.replace("_", " ")
              ][n]
            );
            var sumcount = 0;
            for (
              var l = 0;
              l < this.ercValues["American Standard"][n].length;
              l++
            ) {
              let quarStr = this.ercValues["American Standard"][n][
                l
              ].quar.split("_");
              let quar = parseInt(quarStr[0].substr(1));
              let year = Math.abs(parseInt(quarStr[1]) - 2019) * 4;
              let num = quar + year;
              if (el.CategoryVariableID === "Quarterly") {
                if (num <= parseInt(el.CategoryCode)) {
                  sumcount =
                    sumcount + this.ercValues["American Standard"][n][l].score;
                }
              } else if (el.CategoryVariableID === "Semiannual") {
                let updatedCatCode;
                if (el.CategoryCode === "1") {
                  updatedCatCode = parseInt(el.CategoryCode) * 2;
                } else if (el.CategoryCode === "2") {
                  updatedCatCode = parseInt(el.CategoryCode) * 2;
                }
                if (num <= updatedCatCode) {
                  sumcount =
                    sumcount + this.ercValues["American Standard"][n][l].score;
                }
              } else if (el.CategoryVariableID === "Yearly") {
                sumcount =
                  sumcount + this.ercValues["American Standard"][n][l].score;
              }
            }
            sum1.push(sumcount);
          }
          // if (isNaN(el.data) || isNaN(Branding[i].data)) {
          // }
          // else{
          var obj2 = {
            brand: el.SeriesVariableID,
            Recallscore: isNaN(el.data) ? "NA" : Math.round(el.data),
            Brandingcore: isNaN(Branding[i].data)
              ? "NA"
              : Math.round(Branding[i].data),
            Adname: adname1[AMCount],
            sum: sum1[AMCount],
          };
          ecrdt.push(obj2);
          //}

          AMCount++;
        } else if (el.SeriesVariableID == "Kohler") {
          let sum1 = [];

          var adname1 = [];
          for (var n = 0; n < this.ercValues["Kohler"].length; n++) {
            var sumcount = 0;
            adname1.push(this.brandsVariableIndexing[el.SeriesVariableID][n]);
            for (var l = 0; l < this.ercValues["Kohler"][n].length; l++) {
              let quarStr = this.ercValues["Kohler"][n][l].quar.split("_");
              let quar = parseInt(quarStr[0].substr(1));
              let year = Math.abs(parseInt(quarStr[1]) - 2019) * 4;
              let num = quar + year;
              if (el.CategoryVariableID === "Quarterly") {
                if (num <= parseInt(el.CategoryCode)) {
                  sumcount = sumcount + this.ercValues["Kohler"][n][l].score;
                }
              } else if (el.CategoryVariableID === "Semiannual") {
                let updatedCatCode;
                if (el.CategoryCode === "1") {
                  updatedCatCode = parseInt(el.CategoryCode) * 2;
                } else if (el.CategoryCode === "2") {
                  updatedCatCode = parseInt(el.CategoryCode) * 2;
                }
                if (num <= updatedCatCode) {
                  sumcount = sumcount + this.ercValues["Kohler"][n][l].score;
                }
              } else if (el.CategoryVariableID === "Yearly") {
                sumcount = sumcount + this.ercValues["Kohler"][n][l].score;
              }
            }
            sum1.push(sumcount);
          }
          // if (isNaN(el.data) || isNaN(Branding[i].data)) {
          // }
          //else{
          var obj2 = {
            brand: el.SeriesVariableID,
            Recallscore: isNaN(el.data) ? "NA" : Math.round(el.data),
            Brandingcore: isNaN(Branding[i].data)
              ? "NA"
              : Math.round(Branding[i].data),
            Adname: adname1[KhC],
            sum: sum1[KhC],
          };
          ecrdt.push(obj2);
          //}

          KhC++;
        } else if (el.SeriesVariableID == "Moen") {
          var adname1 = [];
          let sum1 = [];
          for (var n = 0; n < this.ercValues["Moen"].length; n++) {
            var sumcount = 0;
            adname1.push(this.brandsVariableIndexing[el.SeriesVariableID][n]);
            for (var l = 0; l < this.ercValues["Moen"][n].length; l++) {
              let quarStr = this.ercValues["Moen"][n][l].quar.split("_");
              let quar = parseInt(quarStr[0].substr(1));
              let year = Math.abs(parseInt(quarStr[1]) - 2019) * 4;
              let num = quar + year;
              if (el.CategoryVariableID === "Quarterly") {
                if (num <= parseInt(el.CategoryCode)) {
                  sumcount = sumcount + this.ercValues["Moen"][n][l].score;
                }
              } else if (el.CategoryVariableID === "Semiannual") {
                let updatedCatCode;
                if (el.CategoryCode === "1") {
                  updatedCatCode = parseInt(el.CategoryCode) * 2;
                } else if (el.CategoryCode === "2") {
                  updatedCatCode = parseInt(el.CategoryCode) * 2;
                }
                if (num <= updatedCatCode) {
                  sumcount = sumcount + this.ercValues["Moen"][n][l].score;
                }
              } else if (el.CategoryVariableID === "Yearly") {
                sumcount = sumcount + this.ercValues["Moen"][n][l].score;
              }
            }
            sum1.push(sumcount);
          }
          // if (isNaN(el.data) || isNaN(Branding[i].data)) {
          // }
          // else{
          var obj2 = {
            brand: el.SeriesVariableID,
            Recallscore: isNaN(el.data) ? "NA" : Math.round(el.data),
            Brandingcore: isNaN(Branding[i].data)
              ? "NA"
              : Math.round(Branding[i].data),
            Adname: adname1[mCount],
            sum: sum1[mCount],
          };
          ecrdt.push(obj2);

          //}
          mCount++;
        }
      });
      //console.log(ecrdt)
      this.dtECR = [];
      this.dtECR = ecrdt;
      this.adRecallBrandingGridData = new Map<string, []>();
      ecrdt.forEach((val, index) => {
        const idofAds = this.getIdOfAds(val.Adname);
        const tableArray = {
          id: idofAds,
          Adname: val.Adname,
          Recallscore: val.Recallscore,
          Brandingcore: val.Brandingcore,
          CummulativeECR: val.sum,
          url: val.Adname.replace("/", "-") + "_" + idofAds,
        };
        if (!this.adRecallBrandingGridData.has(val.brand)) {
          this.adRecallBrandingGridData.set(val.brand, [tableArray]);
        } else {
          this.adRecallBrandingGridData.get(val.brand).push(tableArray);
        }
      });
      return output;
    });
    //this.adrecalAndBrandingArray.push(adRecalChart);
    //this.adrecalAndBrandingArray.push(adBrandingChart);
    let isCallAdRecalChart: boolean = false;

    // this.adrecalAndBrandingArray.forEach(element => {
    //   element.addTableDataReady((output, datatable) => {
    //     console.log(output);
    //   })
    // })
  }
  private setTimePeriodChips(variable, choices) {
    if (this.timePeriodChips.has(variable) && choices.length === 0) {
      this.timePeriodChips.delete(variable);
    } else {
      this.timePeriodChips.set(variable, [...choices]);
    }
    for (var i = 0; i < this.timePeriodChips.size; i++) {
      if (variable != "Allbrands") {
        this.pptAdDiagnostic.filter =
          this.pptAdDiagnostic.filter + " " + variable + " " + choices[0].text;
        this.pptAdcalltoaction.filter =
          this.pptAdcalltoaction.filter +
          " " +
          variable +
          " " +
          choices[0].text;
      }
    }
  }

  //write this line of code to optimize ad diagnotic table
  pptExportBubbleChart() {
    let ECRData = JSON.parse(localStorage.getItem("ecrPPtobj"));
    this.pptexport1.postPPTForTrends(JSON.stringify(ECRData)).subscribe(
      (data) => {
        const blob = new Blob([data], { type: "application/octet-stream" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        document.body.appendChild(a);
        a.href = url;
        a.download = "OverallBrandHealth_Trends_PPT.zip";
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove();
        this.showLoader = false;
      },
      (error) => {
        console.log(error);
        this.showLoader = false;
      }
    );
  }

  createDiagnosticObject(
    adVariableObject,
    valueArray,
    dataTable,
    tableBase,
    compareBase,
    overallBaseDiagnostic
  ) {
    adVariableObject.counter++;
    const indexofText = this.adDiagnosticTestMapping.indexOf(
      valueArray.SeriesName
    );
    if (indexofText > -1) {
      adVariableObject.arrayOfTableData[indexofText] = valueArray.Score;
      if (valueArray.previousScore && valueArray.previousScore != undefined) {
        adVariableObject.compareScores[indexofText] = valueArray.previousScore;
      } else {
        adVariableObject.compareScores[indexofText] = 0;
      }
      // const sigData = dataTable.significance.get(valueArray.SeriesName);
      // adVariableObject.isSignificance[indexofText] = this.calculateSigTestArrowShowHide(sigData, adVariableObject.tableBase, valueArray);
      if (valueArray.SignificanceSign != undefined) {
        adVariableObject.isSignificance[indexofText] =
          valueArray.SignificanceSign;
      } else {
        adVariableObject.isSignificance[indexofText] = undefined;
      }
    }
    if (adVariableObject.counter == 11) {
      const tableArray = this.returnObjectOfDiagnostic(
        valueArray,
        tableBase,
        compareBase,
        adVariableObject.arrayOfTableData,
        adVariableObject.compareScores,
        overallBaseDiagnostic,
        adVariableObject.isSignificance
      );

      if (
        this.brandViseAdIndexMappingDiagnostic.Delta.indexOf(
          valueArray.SeriesVariableID
        ) > -1
      ) {
        this.adDiagnosticTableDelta.push(tableArray);
      } else if (
        this.brandViseAdIndexMappingDiagnostic.Moen.indexOf(
          valueArray.SeriesVariableID
        ) > -1
      ) {
        this.adDiagnosticTableMoen.push(tableArray);
      } else if (
        this.brandViseAdIndexMappingDiagnostic.Kohler.indexOf(
          valueArray.SeriesVariableID
        ) > -1
      ) {
        this.adDiagnosticTableKohler.push(tableArray);
      } else if (
        this.brandViseAdIndexMappingDiagnostic.AmericanStandard.indexOf(
          valueArray.SeriesVariableID
        ) > -1
      ) {
        this.adDiagnosticTableAmerican.push(tableArray);
      } else {
      }
      this.adDiagnosticAverageArray = this.calculateColAverageOfColumn(
        this.adDiagnosticAverageArray,
        adVariableObject.arrayOfTableData,
        this.DiagnosticDeviderArray
      );
    }
  }
  createCallToActionObject(
    adVariableObject,
    valueArray,
    dataTable,
    tableBase,
    compareBase,
    overallBaseDiagnostic
  ) {
    adVariableObject.counter++;
    const indexofText = this.adCallToActionTextMapping.indexOf(
      valueArray.SeriesName
    );
    if (adVariableObject.counter == 1 || adVariableObject.counter <= 10) {
      if (indexofText > -1) {
        adVariableObject.arrayOfTableData[indexofText] = valueArray.Score;
        if (valueArray.previousScore && valueArray.previousScore != undefined) {
          adVariableObject.compareScores[indexofText] =
            valueArray.previousScore;
        } else {
          adVariableObject.compareScores[indexofText] = 0;
        }
        // const sigData = dataTable.significance.get(valueArray.SeriesName);
        // adVariableObject.isSignificance[indexofText] = this.calculateSigTestArrowShowHide(sigData, tableBase, valueArray);
        if (valueArray.SignificanceSign != undefined) {
          adVariableObject.isSignificance[indexofText] =
            valueArray.SignificanceSign;
        } else {
          adVariableObject.isSignificance[indexofText] = undefined;
        }
      }
    }
    if (adVariableObject.counter == 10) {
      const textName = this.callToActionAdNameMapping[
        valueArray.SeriesVariableID
      ];
      const tableArray = this.returnObjectOfCallAction(
        textName,
        valueArray,
        tableBase,
        compareBase,
        adVariableObject.arrayOfTableData,
        adVariableObject.compareScores,
        this.overallBaseCallToAction,
        adVariableObject.isSignificance
      );

      if (
        this.brandViseAdIndexMappingCallToAction.Delta.indexOf(
          valueArray.SeriesVariableID
        ) > -1
      ) {
        this.adCallToActionTableDelta.push(tableArray);
      } else if (
        this.brandViseAdIndexMappingCallToAction.Moen.indexOf(
          valueArray.SeriesVariableID
        ) > -1
      ) {
        this.adCallToActionTableMoen.push(tableArray);
      } else if (
        this.brandViseAdIndexMappingCallToAction.Kohler.indexOf(
          valueArray.SeriesVariableID
        ) > -1
      ) {
        this.adCallToActionTableKohler.push(tableArray);
      } else if (
        this.brandViseAdIndexMappingCallToAction.AmericanStandard.indexOf(
          valueArray.SeriesVariableID
        ) > -1
      ) {
        this.adCallToActionTableAmerican.push(tableArray);
      } else {
      }
      this.adCallActionColAverageArray = this.calculateColAverageOfColumn(
        this.adCallActionColAverageArray,
        adVariableObject.arrayOfTableData,
        this.adCalltoActionDeviderArray
      );
    }
  }

  // end of this code block

  createCharts() {
    this.showLoader = true;
    this.initPara();
    this.hideFilterTrends.sendBooleanFlag(this.hideFilterForTrends);
    //const brands = new Brands(this.filterService);
    this.selectedBrandsCode.forEach((val, i) => {
      this.brandList.push(AssetMappings.logoByBrandCode[val]);
    });

    //tedBrandCode = brands.getBrandsCode();
    const diagnostic: adDiagnostics = new adDiagnostics();

    this.adDiagnosticTotalAverageChart = diagnostic.getAdDiagnosticsTotalAverage();
    this.adCallToActionTotalAverageChart = diagnostic.getAdCallToActionTotalAverage();
    this.adRecallDataChart = diagnostic.getAdBubbleRecall();

    this.adDiagnosticChartForAllBrands = diagnostic.getAdDiagnosticsForAllBrands(
      this.AllSelectedAds
    );
    this.adCallToActionChartAllBrands = diagnostic.getAdCallToActionForAllBrands(
      this.AllSelectedAds
    );
    this.adCallToActionTakeSomeActionNetChart = diagnostic.getCallToActionNet(
      this.AllSelectedAds
    );

    if (this.selectedBrandsCode.length > 0) {
      //ad diagnostic average all Ads
      this.adDiagnosticTotalAverageChart.addTableDataReady(
        (output, dataTable) => {
          this.adDiagnosticTotalAverage = [];
          dataTable.rows.forEach((valueArray, element) => {
            const indexOfElement = this.adDiagnosticTestMapping.indexOf(
              element
            );
            this.adDiagnosticTotalAverage[
              indexOfElement
            ] = this.calTotalAverageArray(valueArray);
          });
          this.calculateIndexColorForDiagnostic();
          this.isDiagnosticTotal = true;
          this.isConfigCallComplete();
        }
      );

      // ad call to action Average all ads
      this.adCallToActionTotalAverageChart.addTableDataReady(
        (output, dataTable) => {
          this.adCallToActionTotalAverage = [];
          dataTable.rows.forEach((valueArray, element) => {
            const indexOfElement = this.adCallToActionTextMappingTotalAverage.indexOf(
              element
            );
            this.adCallToActionTotalAverage[
              indexOfElement
            ] = this.calTotalAverageArray(valueArray);
          });
          this.calculateIndexColorForCallToAction();
          this.isCallToActionTotal = true;
          this.isConfigCallComplete();
        }
      );

      // take some action net
      this.adCallToActionTakeSomeActionNetChart.addTableDataReady(
        (output, dataTable) => {
          this.adCallActionRowAverageArray = [];
          let rowNet = 0;
          if (dataTable.rows.get("CallToActionNet") != undefined) {
            dataTable.rows.get("CallToActionNet").forEach((val, vindex) => {
              if (isNaN(val)) {
                this.adCallActionRowAverageArray.push("NA");
              } else if (val.toString() === "NaN") {
                this.adCallActionRowAverageArray.push("NA");
              } else {
                this.adCallActionRowAverageArray.push(Math.round(val));
                if (!isNaN(val) && val !== undefined) {
                  rowNet += val;
                }
              }
            });
            this.isCallToActionNet = true;
            this.isConfigCallComplete();
          }
          this.netActionAverage = Math.round(
            rowNet / this.adCallActionRowAverageArray.length
          );
        }
      );

      //*ad diagnostic chart data*//
      this.adDiagnosticChartForAllBrands.addTableDataReady(
        (output, dataTable) => {
          this.adDiagnosticMap = new Map<string, {}>();
          this.adDiagnosticTableDelta = [];
          this.adDiagnosticTableMoen = [];
          this.adDiagnosticTableKohler = [];
          this.adDiagnosticTableAmerican = [];
          this.adDiagnosticAverageArray = [];
          this.detalAdSelector = [];
          this.aSAdSelector = [];
          this.kohlerAdSelector = [];
          this.moenAdSelector = [];
          this.DiagnosticDeviderArray = [];

          let compareBase = [];
          this.overallBaseDiagnostic = dataTable.bases.get("Base");
          if (dataTable.comparisonBases.get("Base") != undefined) {
            compareBase = dataTable.comparisonBases.get("Base");
          }
          let tableBase = [];
          output.forEach((valueArray, index) => {
            if (tableBase.length == 0) {
              tableBase.push(valueArray.SeriesVariableID);
            } else {
              if (tableBase.indexOf(valueArray.SeriesVariableID) == -1) {
                tableBase.push(valueArray.SeriesVariableID);
              }
            }
          });
          // Edited by R - optimize code for ad diagnostic grid
          output.forEach((valueArray, index) => {
            const sereiseVariableId = valueArray.SeriesVariableID;
            if (!this.adDiagnosticMap.has(sereiseVariableId)) {
              let adObject = new adVariableModal();
              this.adDiagnosticMap.set(sereiseVariableId, adObject);
              this.createDiagnosticObject(
                adObject,
                valueArray,
                dataTable,
                tableBase,
                compareBase,
                this.overallBaseDiagnostic
              );
            } else {
              this.createDiagnosticObject(
                this.adDiagnosticMap.get(sereiseVariableId),
                valueArray,
                dataTable,
                tableBase,
                compareBase,
                this.overallBaseDiagnostic
              );
            }
          });
          this.calculateIndexColorForDiagnostic();
          this.isCallAdDiagnostics = true;
          this.isConfigCallComplete();
        }
      );

      // ad call to action data
      this.adCallToActionChartAllBrands.addTableDataReady(
        (output, dataTable) => {
          this.adCallToActionMap = new Map<string, {}>();
          this.adCallToActionTableDelta = [];
          this.adCallToActionTableMoen = [];
          this.adCallToActionTableKohler = [];
          this.adCallToActionTableAmerican = [];
          // this.adCallActionRowAverageArray = [];
          this.adCallActionColAverageArray = [];
          this.adCalltoActionDeviderArray = [];

          this.overallBaseCallToAction = dataTable.bases.get("Base");
          let compareBase = [];

          if (dataTable.comparisonBases.get("Base") != undefined) {
            compareBase = dataTable.comparisonBases.get("Base");
          }
          let tableBase = [];
          output.forEach((valueArray, index) => {
            if (tableBase.length == 0) {
              tableBase.push(valueArray.SeriesVariableID);
            } else {
              if (tableBase.indexOf(valueArray.SeriesVariableID) == -1) {
                tableBase.push(valueArray.SeriesVariableID);
              }
            }
          });
          // Edited by R - optimize code for ad diagnostic grid
          output.forEach((valueArray, index) => {
            const sereiseVariableId = valueArray.SeriesVariableID;
            if (!this.adCallToActionMap.has(sereiseVariableId)) {
              let adObject = new adVariableModal();
              this.adCallToActionMap.set(sereiseVariableId, adObject);
              this.createCallToActionObject(
                adObject,
                valueArray,
                dataTable,
                tableBase,
                compareBase,
                this.overallBaseDiagnostic
              );
            } else {
              this.createCallToActionObject(
                this.adCallToActionMap.get(sereiseVariableId),
                valueArray,
                dataTable,
                tableBase,
                compareBase,
                this.overallBaseDiagnostic
              );
            }
          });
          // column average
          const totalrowlength =
            this.deltaArrayLength +
            this.moenArrayLength +
            this.KohlerArrayLength +
            this.americanArrayLength;
          if (
            this.adCallActionColAverageArray.length == 10 &&
            this.adCallActionColAverageArray.length ==
              this.adCalltoActionDeviderArray.length
          ) {
            // if (this.AllSelectedAds.length > 0) {
            //   this.adCallActionColAverageArray.forEach((val, valindex) => {
            //     this.adCallActionColAverageArray[valindex] = (val / this.AllSelectedAds.length);
            //   });
            // }
            // else {
            //   this.adCallActionColAverageArray.forEach((val, valindex) => {
            //     this.adCallActionColAverageArray[valindex] = (val / 15);
            //   });
            // }
            this.adCallActionColAverageArray.forEach((val, valindex) => {
              this.adCallActionColAverageArray[valindex] =
                val / this.adCalltoActionDeviderArray[valindex];
            });
          }
          this.calculateIndexColorForCallToAction();
          this.isCallCallToAction = true;
          this.isConfigCallComplete();
        }
      );
    }
  }

  calculateIndexColorForDiagnostic() {
    if (this.adDiagnosticTotalAverage.length > 0) {
      const lengthOfArrays =
        this.adDiagnosticTableDelta.length +
        this.adDiagnosticTableMoen.length +
        this.adDiagnosticTableAmerican.length +
        this.adDiagnosticTableKohler.length;
      if (lengthOfArrays > 0) {
        if (
          this.adDiagnosticAverageArray.length == 11 &&
          this.adDiagnosticAverageArray.length ==
            this.DiagnosticDeviderArray.length
        ) {
          // if (this.AllSelectedAds.length > 0) {
          //   this.adDiagnosticAverageArray.forEach((val, valindex) => {
          //     this.adDiagnosticAverageArray[valindex] = (this.adDiagnosticAverageArray[valindex] / this.AllSelectedAds.length);
          //   });
          // }
          // else {
          //   this.adDiagnosticAverageArray.forEach((val, valindex) => {
          //     this.adDiagnosticAverageArray[valindex] = (this.adDiagnosticAverageArray[valindex] / 15);
          //   });
          // }
          this.adDiagnosticAverageArray.forEach((val, valindex) => {
            this.adDiagnosticAverageArray[valindex] =
              this.adDiagnosticAverageArray[valindex] /
              this.DiagnosticDeviderArray[valindex];
          });
        }
        if (this.adDiagnosticTableDelta.length == this.deltaArrayLength) {
          this.adDiagnosticTableDelta = this.colorIndexing(
            this.adDiagnosticTableDelta,
            this.adDiagnosticTotalAverage
          );
        }
        if (this.adDiagnosticTableMoen.length == this.moenArrayLength) {
          this.adDiagnosticTableMoen = this.colorIndexing(
            this.adDiagnosticTableMoen,
            this.adDiagnosticTotalAverage
          );
        }
        if (this.adDiagnosticTableKohler.length == this.KohlerArrayLength) {
          this.adDiagnosticTableKohler = this.colorIndexing(
            this.adDiagnosticTableKohler,
            this.adDiagnosticTotalAverage
          );
        }
        if (this.adDiagnosticTableAmerican.length == this.americanArrayLength) {
          this.adDiagnosticTableAmerican = this.colorIndexing(
            this.adDiagnosticTableAmerican,
            this.adDiagnosticTotalAverage
          );
        }
      }
    }
  }

  calculateIndexColorForCallToAction() {
    if (this.adCallToActionTotalAverage.length > 0) {
      const indexCount =
        this.adCallToActionTableDelta.length +
        this.adCallToActionTableMoen.length +
        this.adCallToActionTableKohler.length +
        this.adCallToActionTableAmerican.length;
      if (indexCount > 0) {
        if (this.adCallToActionTableDelta.length == this.deltaArrayLength) {
          this.adCallToActionTableDelta = this.colorIndexingCallToAction(
            this.adCallToActionTableDelta,
            this.adCallToActionTotalAverage
          );
        }
        if (this.adCallToActionTableMoen.length == this.moenArrayLength) {
          this.adCallToActionTableMoen = this.colorIndexingCallToAction(
            this.adCallToActionTableMoen,
            this.adCallToActionTotalAverage
          );
        }
        if (this.adCallToActionTableKohler.length == this.KohlerArrayLength) {
          this.adCallToActionTableKohler = this.colorIndexingCallToAction(
            this.adCallToActionTableKohler,
            this.adCallToActionTotalAverage
          );
        }
        if (
          this.adCallToActionTableAmerican.length == this.americanArrayLength
        ) {
          this.adCallToActionTableAmerican = this.colorIndexingCallToAction(
            this.adCallToActionTableAmerican,
            this.adCallToActionTotalAverage
          );
        }
        if (this.adCallToActionTotalAverage.length == 9) {
          this.totalaverageOfRow = 0;
          this.adCallToActionTotalAverage.forEach((val, index) => {
            this.totalaverageOfRow = this.totalaverageOfRow + val;
          });
          this.totalaverageOfRow = Math.round(this.totalaverageOfRow / 9);
        }
      }
    }
  }
  colorIndexing(adDiagnosticObject, avgArray) {
    let colorCode: String;
    adDiagnosticObject.forEach((val, i) => {
      let num = 0;
      val.serieseData.forEach((value, index) => {
        if (index == 2) {
          if (value !== "NaN" || !isNaN(value)) {
            const colorValue = value;
            const colorIndexValue = Math.round(
              (colorValue / avgArray[index]) * 100
            );
            if (colorIndexValue >= 120) {
              colorCode = "#FF656D";
            } else if (colorIndexValue <= 119 && colorIndexValue >= 110) {
              colorCode = "#FFCCCE";
            } else if (colorIndexValue <= 109 && colorIndexValue >= 91) {
              colorCode = "#fff";
            } else if (colorIndexValue <= 90 && colorIndexValue >= 81) {
              colorCode = "#E5F995";
            } else {
              colorCode = "#92D050";
            }
            adDiagnosticObject[i].serieseColor.push(colorCode);
          } else {
            adDiagnosticObject[i].serieseColor.push("#fff");
          }
        } else {
          if (value !== "NaN" || !isNaN(value)) {
            const colorValue = value;
            const colorIndexValue = Math.round(
              (colorValue / avgArray[index]) * 100
            );
            if (colorIndexValue >= 120) {
              colorCode = "#92D050";
            } else if (colorIndexValue <= 119 && colorIndexValue >= 110) {
              colorCode = "#E5F995";
            } else if (colorIndexValue <= 109 && colorIndexValue >= 91) {
              colorCode = "#fff";
            } else if (colorIndexValue <= 90 && colorIndexValue >= 81) {
              colorCode = "#FFCCCE";
            } else {
              colorCode = "#FF656D";
            }
            adDiagnosticObject[i].serieseColor.push(colorCode);
          } else {
            adDiagnosticObject[i].serieseColor.push("#fff");
          }
        }
      });
    });
    return adDiagnosticObject;
  }

  colorIndexingCallToAction(adCallToActionObject, avgArray) {
    let colorCode: String;
    adCallToActionObject.forEach((val, i) => {
      let num = 0;
      val.serieseData.forEach((value, index) => {
        if (value !== "NaN" || !isNaN(value)) {
          const colorValue = value;
          const colorIndexValue = Math.round(
            (colorValue / avgArray[index]) * 100
          );
          if (colorIndexValue >= 120) {
            colorCode = "#92D050";
          } else if (colorIndexValue <= 119 && colorIndexValue >= 110) {
            colorCode = "#E5F995";
          } else if (colorIndexValue <= 109 && colorIndexValue >= 91) {
            colorCode = "#fff";
          } else if (colorIndexValue <= 90 && colorIndexValue >= 81) {
            colorCode = "#FFCCCE";
          } else {
            colorCode = "#FF656D";
          }
          adCallToActionObject[i].serieseColor.push(colorCode);
        } else {
          adCallToActionObject[i].serieseColor.push("#fff");
        }
      });
    });
    return adCallToActionObject;
  }

  changeTable(tabName, tab) {
    this.selectedTab = tabName;
    this.viewMode = tab;
  }

  returnObjectOfDiagnostic(
    valueArray,
    tableBase,
    compareBase,
    arrayOfTableData,
    compareScores,
    overallBaseDiagnostic,
    isSignificance
  ) {
    const textName = valueArray.SeriesTree.split(">");
    const id = this.getIdOfAds(textName[0]);
    this.detalAdSelector.push(textName[0]);
    let indexOfBase = 0;
    let cbase = 0;
    if (tableBase.indexOf(valueArray.SeriesVariableID) > -1) {
      indexOfBase = tableBase.indexOf(valueArray.SeriesVariableID);
      if (compareBase[indexOfBase] != undefined) {
        cbase = compareBase[indexOfBase];
      }
    }
    const tableArray = {
      id: id,
      serieseName: textName[0],
      serieseData: arrayOfTableData,
      serieseColor: [],
      seriesBase: this.overallBaseDiagnostic[indexOfBase],
      url: textName[0].replace("/", "-") + "_" + id,
      compareScore: compareScores,
      compareBase: cbase,
      isSignificance: isSignificance,
    };
    return tableArray;
  }

  returnObjectOfCallAction(
    textName,
    valueArray,
    tableBase,
    compareBase,
    arrayOfTableData,
    compareScores,
    overallBaseDiagnostic,
    isSignificance
  ) {
    const id = this.getIdOfAds(textName);
    let indexOfBase = 0;
    let cbase = 0;
    if (tableBase.indexOf(valueArray.SeriesVariableID) > -1) {
      indexOfBase = tableBase.indexOf(valueArray.SeriesVariableID);
      if (compareBase[indexOfBase] != undefined) {
        cbase = compareBase[indexOfBase];
      }
    }
    const tableArray = {
      id: id,
      serieseName: textName,
      serieseData: arrayOfTableData,
      serieseColor: [],
      seriesBase: this.overallBaseCallToAction[indexOfBase],
      url: textName.replace("/", "-") + "_" + id,
      compareScore: compareScores,
      compareBase: cbase,
      isSignificance: isSignificance,
    };
    return tableArray;
  }
  getfilter() {
    this.filter = "";
    let filter = JSON.parse(localStorage.getItem("filterappTime"));
    let filterSide = JSON.parse(localStorage.getItem("filterapp"));
    this.filter = "Time Period: ";
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
          this.filter = this.filter + " Side Filter(s): ";
          this.filter = this.filter + " " + element;
        } else {
          this.filter = this.filter + "| " + element;
        }
      });
    }
  }
  downloadCSV() {
    this.getfilter();
    this.csvOptions.title = "Ad Recall & Brand Attribution";
    this.csvOptions.headers = [];
    this.csvOptions.headers.push("Filter(s)");
    this.csvOptions.headers.push(this.filter);
    let dt = [];
    dt.push({
      brand: "Brand",
      Recallscore: "Recall Score",
      Brandingcore: "Branding Score",
      Adname: "Ad Name",
      sum: "ECR",
    });
    this.dtECR.forEach((el) => {
      dt.push(el);
    });
    new AngularCsv(dt, "ECR", this.csvOptions);
  }
  downloadECRTableCSV() {
    this.getfilter();
    this.csvOptions.title = "Ad Recall & Brand Attribution";
    this.csvOptions.headers = [];
    this.csvOptions.headers.push("Filter(s)");
    this.csvOptions.headers.push(this.filter);
    let dt = [];
    dt.push({
      brand: "Brand",
      AdName: "Ad Name",
      Recallscore: "Ad Recall %",
      Brandingcore: "Branding % (Couldn’t help but remember brand)",
      sum: "Cumulative ECRs",
    });
    this.adRecallBrandingGridData.forEach((element, i) => {
      element.forEach((el) => {
        dt.push({
          brand: i,
          AdName: el.Adname,
          Recallscore: el.Recallscore,
          Brandingcore: el.Brandingcore,
          sum: el.CummulativeECR,
        });
      });
      //  dt.push({brand:el.Adname,AdName:el.Adname,Recallscore:el.Recallscore,Brandingcore:el.Brandingcore,sum:el.CummulativeECR});
    });
    new AngularCsv(dt, "ECR", this.csvOptions);
  }
  calculateSigTestArrowShowHide(sigData, tableBase, valueArray) {
    let sig = undefined;
    if (valueArray.SeriesVariableID != undefined) {
      const indexOfSigData = tableBase.indexOf(valueArray.SeriesVariableID);
      if (indexOfSigData > -1) {
        sig = sigData[indexOfSigData];
      }
    }
    return sig;
  }

  downloadExcelFile() {
    const HeaderArrayDiagnostic = [
      "Enjoyment",
      "See Again",
      "Tired of Seeing",
      "More likely to buy",
      "More Appealing",
      "Important Info",
      "New News",
      "Believable",
      "Easy to understand",
      "Original",
      "Different",
      "Base",
    ];

    const HeaderArrayAction = [
      "Take Some Action(net)",
      "Look in-store",
      "Visit Brand Website",
      "Search Online",
      "Click Ad",
      "More Info",
      "Talk with Friends/Family",
      "Recommended to Friends/Family",
      "Talk on Social Media",
      "Write Blog Entry",
      "Base",
    ];

    if (this.selectedTab === "Diagnostics") {
      this.downloadDiagnosticsData(
        "Ad Perception",
        HeaderArrayDiagnostic,
        this.adDiagnosticAverageArray,
        this.adDiagnosticTableDelta,
        this.adDiagnosticTableMoen,
        this.adDiagnosticTableKohler,
        this.adDiagnosticTableAmerican,
        this.overallBaseDiagnostic
      );
    } else if (this.selectedTab === "CallToAction") {
      this.downloadCallToActionData(
        "Ad Call To Action",
        HeaderArrayAction,
        this.netActionAverage,
        this.adCallActionColAverageArray,
        this.adCallActionRowAverageArray,
        this.adCallToActionTableDelta,
        this.adCallToActionTableMoen,
        this.adCallToActionTableKohler,
        this.adCallToActionTableAmerican,
        this.overallBaseCallToAction
      );
    } else if (this.selectedTab === "Recall") {
      this.downloadECRTableCSV();
    }
  }
  pptexport(pptName) {
    this.getfilter();
    this.showLoader = true;
    const HeaderArrayDiagnostic = [
      "Enjoyment",
      "See Again",
      "Tired of Seeing",
      "More likely to buy",
      "More Appealing",
      "Important Info",
      "New News",
      "Believable",
      "Easy to understand",
      "Original",
      "Different",
      "Base",
    ];

    const HeaderArrayAction = [
      "Take Some Action(net)",
      "Look in-store",
      "Visit Brand Website",
      "Search Online",
      "Click Ad",
      "More Info",
      "Talk with Friends/Family",
      "Recommended to Friends/Family",
      "Talk on Social Media",
      "Write Blog Entry",
      "Base",
    ];

    if (this.selectedTab === "Diagnostics") {
      this.pptAdDiagnostic.seriesname = [];
      this.pptAdDiagnostic.AverageSelectedAd = [];
      this.pptAdDiagnostic.AverageAllAds = this.adDiagnosticTotalAverage;
      this.pptAdDiagnostic.AverageSelectedAd = this.adDiagnosticAverageArray;
      this.pptAdDiagnostic.seriesname = HeaderArrayDiagnostic;
      this.pptAdDiagnostic.Americantable = [];
      this.pptAdDiagnostic.Deltatable = [];
      this.pptAdDiagnostic.Kohlertable = [];
      this.pptAdDiagnostic.Moentable = [];
      this.adDiagnosticTableAmerican.forEach((element) => {
        this.pptAdDiagnostic.Americantable.push({
          seriesname: element.serieseName,
          data: element.serieseData,
        });
      });
      this.adDiagnosticTableDelta.forEach((element) => {
        this.pptAdDiagnostic.Deltatable.push({
          seriesname: element.serieseName,
          data: element.serieseData,
        });
      });
      this.adDiagnosticTableKohler.forEach((element) => {
        this.pptAdDiagnostic.Kohlertable.push({
          seriesname: element.serieseName,
          data: element.serieseData,
        });
      });
      this.adDiagnosticTableMoen.forEach((element) => {
        this.pptAdDiagnostic.Moentable.push({
          seriesname: element.serieseName,
          data: element.serieseData,
        });
      });
      this.pptAdDiagnostic.filter = this.filter;
      var obj = JSON.stringify(this.pptAdDiagnostic);
      obj = JSON.stringify(obj);
      this.pptexport1.postaddiag(obj).subscribe(
        (data) => {
          let blob = new Blob([data], { type: "application/octet-stream" });
          let url = window.URL.createObjectURL(blob);
          let a = document.createElement("a");
          document.body.appendChild(a);
          a.href = url;
          a.download = pptName + ".zip";
          a.click();
          window.URL.revokeObjectURL(url);
          a.remove();
          this.showLoader = false;
        },
        (error) => {
          console.log(error);
          this.showLoader = false;
        }
      );
    } else if (this.selectedTab === "CallToAction") {
      this.pptAdcalltoaction.AverageAllAds = [];
      this.pptAdcalltoaction.Deltatable = [];
      this.pptAdcalltoaction.Kohlertable = [];
      this.pptAdcalltoaction.Moentable = [];
      this.pptAdcalltoaction.filter = this.filter;
      //this.pptAdcalltoaction.AverageAllAds.push(this.totalaverageOfRow);
      this.adCallToActionTotalAverage.forEach((element) => {
        this.pptAdcalltoaction.AverageAllAds.push(element);
      });
      // this.pptAdcalltoaction.AverageSelectedAd.push(this.netActionAverage);
      this.adCallActionColAverageArray.forEach((element) => {
        this.pptAdcalltoaction.AverageSelectedAd.push(element);
      });
      // this.pptAdcalltoaction.AverageSelectedAd=this.netActionAverage;
      this.adCallToActionTableAmerican.forEach((element, index) => {
        var dt = [];

        //dt.push(this.adCallActionRowAverageArray[12 + index])
        element.serieseData.forEach((element) => {
          dt.push(element);
        });

        this.pptAdcalltoaction.Americantable.push({
          seriesname: element.serieseName,
          data: dt,
        });
      });
      this.adCallToActionTableDelta.forEach((element, index) => {
        var dt = [];

        //dt.push(this.adCallActionRowAverageArray[0 + index])
        element.serieseData.forEach((element) => {
          dt.push(element);
        });
        this.pptAdcalltoaction.Deltatable.push({
          seriesname: element.serieseName,
          data: dt,
        });
      });
      this.adCallToActionTableKohler.forEach((element, index) => {
        var dt = [];

        // dt.push(this.adCallActionRowAverageArray[9 + index])
        element.serieseData.forEach((element) => {
          dt.push(element);
        });
        this.pptAdcalltoaction.Kohlertable.push({
          seriesname: element.serieseName,
          data: dt,
        });
      });
      this.adCallToActionTableMoen.forEach((element, index) => {
        var dt = [];

        // dt.push(this.adCallActionRowAverageArray[4 + index])
        element.serieseData.forEach((element) => {
          dt.push(element);
        });
        this.pptAdcalltoaction.Moentable.push({
          seriesname: element.serieseName,
          data: dt,
        });
      });

      this.pptAdcalltoaction.seriesname = HeaderArrayAction;
      var obj = JSON.stringify(this.pptAdcalltoaction);
      this.pptexport1.postaddCalltoAction(JSON.stringify(obj)).subscribe(
        (data) => {
          let blob = new Blob([data], { type: "application/octet-stream" });
          let url = window.URL.createObjectURL(blob);
          let a = document.createElement("a");
          document.body.appendChild(a);
          a.href = url;
          a.download = pptName + ".zip";
          a.click();
          window.URL.revokeObjectURL(url);
          a.remove();
          this.showLoader = false;
        },
        (error) => {
          console.log(error);
          this.showLoader = false;
        }
      );
    } else if (this.selectedTab === "Recall") {
      this.pptExportBubbleChart();
    }
  }
  downloadDiagnosticsData(
    titleOfFile,
    headerRow,
    averageRow,
    delta,
    moen,
    kohler,
    american,
    base
  ) {
    let csvData = [];
    this.getfilter();
    let totalAvgArr = [];
    let selectedAverageArr = [];
    totalAvgArr.push(" Average (All Ads)");
    selectedAverageArr.push(" Average (Selected Ads)");
    averageRow.forEach((val, valI) => {
      totalAvgArr.push(this.scoreandBase.transform(val));
      selectedAverageArr.push(
        this.scoreandBase.transform(this.adDiagnosticAverageArray[valI])
      );
    });
    csvData.push(
      Object.assign({}, this.csvDetailCreation(totalAvgArr, "", []))
    );
    csvData.push(
      Object.assign({}, this.csvDetailCreation(selectedAverageArr, "", []))
    );
    const totalRowOfData =
      delta.length + moen.length + kohler.length + american.length;
    delta.forEach((val, i) => {
      let arr = this.getsereideDataDiagnostic(val, base[i]);
      if (arr.length > 0) {
        csvData.push(
          Object.assign({}, this.csvDetailCreation(arr, "Delta", base[i]))
        );
      }
    });
    moen.forEach((val, i) => {
      let arr = this.getsereideDataDiagnostic(val, base[delta.length + i]);
      if (arr.length > 0) {
        csvData.push(
          Object.assign(
            {},
            this.csvDetailCreation(arr, "Moen", base[delta.length + i])
          )
        );
      }
    });
    kohler.forEach((val, i) => {
      let arr = this.getsereideDataDiagnostic(
        val,
        base[delta.length + moen.length + i]
      );
      if (arr.length > 0) {
        csvData.push(
          Object.assign(
            {},
            this.csvDetailCreation(
              arr,
              "Kohler",
              base[delta.length + moen.length + i]
            )
          )
        );
      }
    });
    american.forEach((val, i) => {
      let arr = this.getsereideDataDiagnostic(
        val,
        base[delta.length + moen.length + kohler.length + i]
      );
      if (arr.length > 0) {
        csvData.push(
          Object.assign(
            {},
            this.csvDetailCreation(
              arr,
              "American Standard",
              base[delta.length + moen.length + kohler.length + i]
            )
          )
        );
      }
    });
    this.csvOptions.title = titleOfFile;
    // this.csvOptions.headers = [" ", " ", headerRow];
    this.csvOptions.headers = [];
    this.csvOptions.headers = ["Filter", this.filter];
    let addiag = [];
    addiag.push([]);
    addiag[0].push("");
    addiag[0].push("");
    headerRow.forEach((el) => {
      addiag[0].push(el);
    });
    csvData.forEach((val1, i) => {
      addiag.push(val1);
    });
    this.csvOptions.headers = ["Filter(s)", this.filter];
    new AngularCsv(addiag, "Ad Perception", this.csvOptions);
  }

  downloadCallToActionData(
    titleOfFile,
    headerRow,
    avgNet,
    colAverage,
    rowAverage,
    delta,
    moen,
    kohler,
    american,
    base
  ) {
    let csvData = [];
    let avgArr = [];
    this.getfilter();
    let selectedAverageArr = [];
    let counter = 0;
    avgArr.push("Average (All Ads)");
    selectedAverageArr.push(" Average (Selected Ads)");
    colAverage.forEach((val, valI) => {
      avgArr.push(this.scoreandBase.transform(val));
      selectedAverageArr.push(
        this.scoreandBase.transform(this.adCallActionColAverageArray[valI])
      );
    });
    csvData.push(Object.assign({}, this.csvDetailCreation(avgArr, "", [])));
    csvData.push(
      Object.assign({}, this.csvDetailCreation(selectedAverageArr, "", []))
    );
    const totalRowOfData =
      delta.length + moen.length + kohler.length + american.length;
    delta.forEach((val, i) => {
      let arr = this.getsereideDataCallToAction(
        val,
        rowAverage[counter],
        base[i]
      );
      if (arr.length > 0) {
        csvData.push(
          Object.assign({}, this.csvDetailCreation(arr, "Delta", base[i]))
        );
        counter++;
      }
    });
    moen.forEach((val, i) => {
      let arr = this.getsereideDataCallToAction(
        val,
        rowAverage[counter],
        base[delta.length + i]
      );
      if (arr.length > 0) {
        csvData.push(
          Object.assign(
            {},
            this.csvDetailCreation(arr, "Moen", base[delta.length + i])
          )
        );
        counter++;
      }
    });
    kohler.forEach((val, i) => {
      let arr = this.getsereideDataCallToAction(
        val,
        rowAverage[counter],
        base[delta.length + moen.length + i]
      );
      if (arr.length > 0) {
        csvData.push(
          Object.assign(
            {},
            this.csvDetailCreation(
              arr,
              "Kohler",
              base[delta.length + moen.length + i]
            )
          )
        );
        counter++;
      }
    });
    american.forEach((val, i) => {
      let arr = this.getsereideDataCallToAction(
        val,
        rowAverage[counter],
        base[delta.length + moen.length + kohler.length + i]
      );
      if (arr.length > 0) {
        csvData.push(
          Object.assign(
            {},
            this.csvDetailCreation(
              arr,
              "American Standard",
              base[delta.length + moen.length + kohler.length + i]
            )
          )
        );
        counter++;
      }
    });
    this.csvOptions.headers = [];
    this.csvOptions.headers = ["Filter", this.filter];
    let addiag = [];
    addiag.push([]);
    addiag[0].push("");
    addiag[0].push("");
    headerRow.forEach((el) => {
      addiag[0].push(el);
    });
    csvData.forEach((val1, i) => {
      addiag.push(val1);
    });
    this.csvOptions.title = titleOfFile;
    this.csvOptions.headers = ["Filter(s)", this.filter];
    new AngularCsv(addiag, "Ad Call To Action", this.csvOptions);
  }
  csvDetailCreation(chartData, sideBreak, base) {
    let csvDetail = [];
    csvDetail.push(sideBreak);
    chartData.forEach((val, index) => {
      csvDetail.push(val);
    });
    csvDetail.push(base);
    return csvDetail;
  }

  getAds() {
    this.addDetailsService.getAllAds().subscribe(
      (data) => {
        this.addLists = data;
        let counter = 1;
        const maxCount = this.addLists.length;
        this.isCallApi = true;
        this.ercValues["American Standard"] = [];
        this.ercValues["Delta"] = [];
        this.ercValues["Kohler"] = [];
        this.ercValues["Moen"] = [];
        this.addLists.forEach((val, i) => {
          const brand = val.brand.replace("_", " ");
          this.GetEcr(val.adid, brand, val.adname, counter, maxCount);
          counter++;
        });
        this.isConfigCallComplete();
      },
      (error) => {
        console.log(error);
      }
    );
  }

  calculateColAverageOfColumn(mainAverageArray, toBeAddArray, deviderArray) {
    const tobeAddArray1 = toBeAddArray;
    if (tobeAddArray1.length > 0) {
      if (mainAverageArray.length == 0) {
        tobeAddArray1.forEach((val, i) => {
          if (!isNaN(val)) {
            mainAverageArray[i] = val;
            deviderArray[i] = 1;
          } else {
            mainAverageArray[i] = 0;
            deviderArray[i] = 0;
          }
        });
      } else {
        tobeAddArray1.forEach((val, i) => {
          if (!isNaN(tobeAddArray1[i])) {
            mainAverageArray[i] = mainAverageArray[i] + tobeAddArray1[i];
            deviderArray[i] = deviderArray[i] + 1;
          } else {
            mainAverageArray[i] = mainAverageArray[i] + 0;
          }
        });
      }
    }
    return mainAverageArray;
  }

  getIdOfAds(adName) {
    let adId;
    var keepGoing = true;
    if (adName != "" || adName != undefined) {
      if (this.addLists.length > 0) {
        this.addLists.forEach((val, index) => {
          if (keepGoing) {
            if (val.adname === adName) {
              adId = val.adid;
              keepGoing = false;
            }
          }
        });
      }
    }
    return adId;
  }

  getsereideDataDiagnostic(arrayOfObject, base) {
    let arr = [];
    if (arrayOfObject.serieseData.length > 0) {
      arr.push(arrayOfObject.serieseName);
      arrayOfObject.serieseData.forEach((val) => {
        const value = this.scoreandBase.transform(val, base);
        arr.push(value);
      });
    }
    return arr;
  }

  getsereideDataCallToAction(arrayOfObject, rowAvgValue, base) {
    let arr = [];
    if (arrayOfObject.serieseData.length > 0) {
      arr.push(arrayOfObject.serieseName);
      // arr.push(rowAvgValue);
      arrayOfObject.serieseData.forEach((val) => {
        const value = this.scoreandBase.transform(val, base);
        arr.push(value);
      });
    }
    return arr;
  }

  OpenPopup() {
    this.showPopup = !this.showPopup;
  }
  close() {
    this.showPopup = !this.showPopup;
  }

  calTotalAverageArray(addArrayToAverage) {
    let sumOfArray = 0;
    let counter = 0;
    if (addArrayToAverage.length > 0) {
      addArrayToAverage.forEach((value, index) => {
        if (!isString(value)) {
          if (!Number.isNaN(value)) {
            sumOfArray += value;
            counter++;
          }
        }
      });
      if (sumOfArray > 0) {
        sumOfArray = sumOfArray / counter;
      }
    }
    return sumOfArray;
  }

  isConfigCallComplete() {
    if (
      this.isCallAdDiagnostics &&
      this.isCallCallToAction &&
      this.isCallApi &&
      this.isDiagnosticTotal &&
      this.isCallToActionTotal &&
      this.isCallToActionNet
    ) {
      this.showLoader = false;
    }
  }
  ngOnDestroy(): void {
    this.updateDataUnsubscribe.next();
    this.updateDataUnsubscribe.complete();
  }
  GetEcr(id, brand, adName, counter, maxCount) {
    this.addDetailsService.getAdEcr(id).subscribe(
      (data) => {
        let ecr: Array<{ score?: number; quar?: string }>;
        ecr = [];
        data.forEach((element, i) => {
          ecr.push({ score: Number(element.ecr), quar: element.quarter });
        });
        if (adName && this.ercValues[brand][this.Ad[adName]] === undefined) {
          this.ercValues[brand][this.Ad[adName]] = ecr;
        }
        if (maxCount === counter) {
          // localStorage.setItem('ECR', JSON.stringify(this.ercValues));
          this.ecrCallComp = true;
          this.bubblechart();
          //this.hideloader();
          setTimeout(() => {
            this.onDataUpdateBubble.next();
          });
        }
      },
      (error) => {
        console.log(error);
        this.showLoader = false;
      }
    );
  }

  toggleChart() {
    this.showChart = false;
    this.showTrends = false;
    setTimeout(() => {
      this.onDataUpdateBubble.next();
    });
  }
  toggleTrends() {
    this.showTrends = true;
    this.showChart = true;
  }
}
