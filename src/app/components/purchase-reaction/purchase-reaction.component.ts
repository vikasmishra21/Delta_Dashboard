import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FilterService } from 'src/app/shell/services/filter.service';
import { ActivatedRoute } from '@angular/router';
import { FilterConfigService } from 'src/app/service/filter-config.service';
import { Brands } from 'src/app/model/brands';
import { Purchasereaction } from 'src/app/model/purchasereaction';
import { Chart } from 'src/app/shell/models/chart';
import { AssetMappings } from 'src/app/model/asset.mappings';
import { AngularCsv } from 'angular7-csv/dist/Angular-csv';
import { ScoreAndBasePipe } from 'src/app/pipe/score-and-base.pipe';
import { isNumber } from 'util';
import { SatisfactionT3Btrends } from './Trends/satisfactionT3BTrends';
import { PurchaseAgainT3Btrends } from './Trends/purchaseAgainT3Btrends';
import { RecommandationT3BTrends } from './Trends/recommandationT3BTrends';
import { SocialMediaTrends } from './Trends/socialMediaTrends';
import { FilterOption } from 'src/app/shell/models/filterOption';
import { PptExportService } from 'src/app/service/ppt-export.service';
import { FilterHideService } from 'src/app/service/filter-hide.service';
import { AppliedFilterSetService } from 'src/app/service/applied-filter-set.service';
@Component({
  selector: 'app-purchase-reaction',
  templateUrl: './purchase-reaction.component.html',
  styleUrls: ['./purchase-reaction.component.css'],
  providers: [ScoreAndBasePipe]
})
export class PurchaseReactionComponent implements OnInit {
  showLoader: boolean;
  brandlist: any;

  optionSelectionUnsubscribe: Subject<any> = new Subject<any>();
  onDataUpdate: Subject<any> = new Subject();
  categoryHeading: string;
  Category: string;
  brandcodes: Array<string>;

  PurchaseAgainT3: Chart;
  SatisfactionT3: Chart;
  RecommandationT3: Chart;
  SocialMediaChart: Chart;

  SocialMediadata: Array<any> = new Array<any>();
  Recommanddata: Array<any> = new Array<any>();
  Satisfactiondata: Array<any> = new Array<any>();
  Purchasedata: Array<any> = new Array<any>();

  positiveSocial: Array<any> = new Array<any>();
  negetiveSocial: Array<any> = new Array<any>();
  nuetralSocial: Array<any> = new Array<any>();
  nothingSocial: Array<any> = new Array<any>();
  socialBase: Array<any> = new Array<any>();

  positiveSocialCompare: Array<any> = new Array<any>();
  negetiveSocialCompare: Array<any> = new Array<any>();
  nuetralSocialCompare: Array<any> = new Array<any>();
  nothingSocialCompare: Array<any> = new Array<any>();

  socialMainDataArray: Array<any> = new Array<any>();

  purchaseloader: boolean;
  satloader: boolean;
  recomLoader: boolean;
  socialloader: boolean;

  dtPurchaseReaction: Array<{ type: string, Data: Array<number> }>;
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
  BrandCodewiseMapping = AssetMappings.brandNameAndCodes;

  brandNameCsv: Array<string>;
  public showChart = false;
  public showTrends = false;
  selectedTab: any;
  period = 'Quarterly';
  periodSeclected = 'tab1';
  satisfactionT3BTrends: any;
  purchaseAgainT3BTrends: any;
  recommandationT3BTrends: any;
  socialMediaPositiveTrends: any;
  socialMediaNegativeTrends: any;
  socialMediaNeutralTrends: any;
  socialMediaNoPostTrends: any;
  pptDownloadPurchaseReactionObject = {
    'PurchaseAgainT3': [],
    'SatisfactionT3': [],
    'RecommandationT3': [],
    'positiveSocial': [],
    'negetiveSocial': [],
    'nuetralSocial': [],
    'nothingSocial': [],
    'bases': [],
    'Brands': [],
    'categoryname': "",
    'filter': ""
  }
  timePeriodChips: Map<string, Array<FilterOption>> = new Map<string, Array<FilterOption>>();
  hideFilterForTrends: boolean = false;
  filter: string;
  purchaseReactionTrendsPPTData: Array<any> = new Array<any>();
  purchaseReactionSocialMediaTrendsPPTData: Array<any> = new Array<any>();
  constructor(private filterService: FilterService, private pptexport: PptExportService, private route: ActivatedRoute,
    private filterConfigService: FilterConfigService, private socreAndBase: ScoreAndBasePipe,private scoreAndBase: ScoreAndBasePipe,
    private hideFilterTrends: FilterHideService, private appliedFilterSet: AppliedFilterSetService) {
    this.route.params.subscribe(params => {
      this.Category = params.order;
      this.categoryHeading = this.Category;
      if (this.Category == "Faucet") {
        this.filterConfigService.initializePurchaseReactionwithFaucet();
      }
      if (this.Category == "Showerhead") {
        this.filterConfigService.initializePurchaseReactionwithShowerhead();
      }
      if (this.Category == "Toilet") {
        this.filterConfigService.initializePurchaseReactionwithToilet();
      }
      if (this.Category == "TubShowerUnit") {
        this.filterConfigService.initializeRecentpurchasewithTUB();
      }
    });
  }

  ngOnInit() {
    this.showLoader = true;
    this.createTables(this.Category);

    this.route.params.subscribe(params => {
      if(this.filterService.getAppliedFilters().size===0){
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

    this.filterService.optionSelectionCallback$.pipe(takeUntil(this.optionSelectionUnsubscribe))
      .subscribe(value => {
        // this.appliedFilterSet.selectedChoicesFilterTransfer(value);
        // value = this.appliedFilterSet.returnIt();
        this.createTables(this.Category);
        // if(this.filterService.selectedChoices!=undefined){
        //   this.filterService.selectedChoices .forEach((value, key) => this.setTimePeriodChips(key, value));
        // // for(var i=0;i<this.filterService.selectedChoices.size;i++){
        // //       this.pptDownloadPurchaseFunnelObject.filter.push(this.filterService.selectedChoices[i].key);
        // // }
        // }
        setTimeout(() => {
          this.onDataUpdate.next();
        });
      });
    // if (this.appliedFilterSet.choices.length > 0) {
    //   this.filterService.setChoices(this.appliedFilterSet.variable, this.appliedFilterSet.choices);
    // }
  }

  initPara() {
    this.showLoader = true;
    this.brandlist = [];
    this.SocialMediadata = [];
    this.Recommanddata = [];
    this.Satisfactiondata = [];
    this.Purchasedata = [];

    this.positiveSocial = [];
    this.negetiveSocial = [];
    this.nuetralSocial = [];
    this.nothingSocial = [];
    this.socialBase = [];

    this.positiveSocialCompare = [];
    this.negetiveSocialCompare = [];
    this.nuetralSocialCompare = [];
    this.nothingSocialCompare = [];

    this.socialMainDataArray = [];

    this.dtPurchaseReaction = [];
    this.purchaseloader = false;
    this.recomLoader = false;
    this.satloader = false;
    this.socialloader = false;
  }

  pptexport1(pptName) {
    this.getfilter();
    this.pptDownloadPurchaseReactionObject.categoryname=this.Category;
    this.pptDownloadPurchaseReactionObject.filter=this.filter;
    this.showLoader = true;
    const obj1 = JSON.stringify(this.pptDownloadPurchaseReactionObject);

    this.pptexport.postPPTForPurchaseReactionDownload(JSON.stringify(obj1)).subscribe((data) => {
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
  // private setTimePeriodChips(variable, choices) {
  //   if (this.timePeriodChips.has(variable) && choices.length === 0) {
  //     this.timePeriodChips.delete(variable);
  //   } else {
  //     this.timePeriodChips.set(variable, [...choices]);
  //   }
  //   for (var i = 0; i < this.timePeriodChips.size; i++) {
  //     if (variable != "Allbrands" && choices[i] != undefined) {
  //       this.pptDownloadPurchaseReactionObject.filter = this.pptDownloadPurchaseReactionObject.filter + " " + variable + " " + choices[i].text;
  //     }
  //   }
  // }
  createTables(Category) {
    this.toggleChart('chartsTabs');
    this.initPara();
    const brands = new Brands(this.filterService);
    this.brandcodes = brands.getBrandsCode();
    // this.brandcodes = ['1', '4', '3', '5', '2','6'];
    this.brandNameCsv = brands.getBrandsCode().map((val) => this.brandcodes[val]);
    this.brandlist = brands.getBrandsCode().map(val => AssetMappings.logoByBrandCode[val]);

    const PurchaseReac = new Purchasereaction();
    if (this.brandcodes.length) {
      this.PurchaseAgainT3 = PurchaseReac.getPurchaseAgainT3B(this.brandcodes, Category);
      this.RecommandationT3 = PurchaseReac.getRecommandationT3B(this.brandcodes, Category);
      this.SatisfactionT3 = PurchaseReac.getSatisfactionT3B(this.brandcodes, Category);
      this.SocialMediaChart = PurchaseReac.getSocialMedia(this.brandcodes, Category);
    }

    this.csvOptions.headers = [];
    var copybrandlist = []
    this.brandcodes.forEach(element => {
      copybrandlist.push(parseInt(element));
    });
    this.csvOptions.headers = []
    this.pptDownloadPurchaseReactionObject.Brands = [];
    
    copybrandlist.forEach(element => {
//this.csvOptions.headers.push(this.BrandCodewiseMapping[element]);
      this.pptDownloadPurchaseReactionObject.Brands.push(this.BrandCodewiseMapping[element]);
    });

    if (this.brandcodes.length) {
      this.PurchaseAgainT3.addTableDataReady((output, datatable) => {
        if (output.length > 0) {
          this.Purchasedata = [];
          this.purchaseloader = true;
          let purchaseScore = [];
          let compareBase = [];
          let compareScoreT3B = [];
          let compareScore = [];
          let isSignificance = [];

          if (datatable.rows.get("combinePurchaseAgain") != undefined) {
            purchaseScore = datatable.rows.get("combinePurchaseAgain");
          }
          if (datatable.comparisonBases.get("Base") != undefined) {
            compareBase = datatable.comparisonBases.get("Base");
            if (datatable.previousScoreRows.get("combinePurchaseAgain") != undefined) {
              compareScore = datatable.previousScoreRows.get("combinePurchaseAgain");
            }
          }
          // if (purchaseScore.length > 0) {
          //   purchaseScore.forEach((val, indexval) => {
          //     if (compareScoreT3B[indexval] != undefined) {
          //       if (isNaN(val) || val == "NaN" || val == undefined) {
          //         if (isNaN(compareScoreT3B[indexval]) || compareScoreT3B[indexval] == "NaN") {
          //           compareScore.push(0);
          //         }
          //         else {
          //           compareScore.push(Math.round(compareScoreT3B[indexval]));
          //         }
          //       }
          //       else {
          //         if (isNaN(compareScoreT3B[indexval]) || compareScoreT3B[indexval] == "NaN") {
          //           compareScore.push(0);
          //         }
          //         else {
          //           compareScore.push(Math.round(val - (compareScoreT3B[indexval])));
          //         }
          //       }
          //     }
          //     else {
          //       compareScore.push(0);
          //     }
          //   });
          // }
          if (datatable.significance.get("combinePurchaseAgain") != undefined) {
            isSignificance = datatable.significance.get("combinePurchaseAgain");
          }

          if (purchaseScore.length == this.brandcodes.length) {
            this.Purchasedata = [];
            const obj = {
              'Score': purchaseScore,
              'base': datatable.bases.get('Base'),
              'compareScore': compareScore,
              'compareBase': compareBase,
              'isSignificance': isSignificance
            }
            this.Purchasedata.push(obj);
            this.dtPurchaseReaction.push({ 'type': "PurchaseAgain", 'Data': purchaseScore });
            this.pptDownloadPurchaseReactionObject.PurchaseAgainT3 = purchaseScore;
            this.dtPurchaseReaction.push({ 'type': "Base", 'Data': datatable.bases.get('Base') });
            this.CallLoader();
          }
        }
      });

      this.SatisfactionT3.addTableDataReady((output, datatable) => {
        if (output.length > 0) {
          let compareBase = [];
          let satisfactionScore = [];
          let compareScore = [];
          this.satloader = true;
          let compareScoreT3B = [];
          let isSignificance = [];

          if (datatable.rows.get("combineSatisfaction") != undefined) {
            satisfactionScore = datatable.rows.get("combineSatisfaction");
          }
          if (datatable.comparisonBases.get("Base") != undefined) {
            compareBase = datatable.comparisonBases.get("Base");
            if (datatable.previousScoreRows.get("combineSatisfaction") != undefined) {
              compareScore = datatable.previousScoreRows.get("combineSatisfaction");
            }
          }
          // if (satisfactionScore.length > 0) {
          //   satisfactionScore.forEach((val, indexval) => {
          //     if (compareScoreT3B[indexval] != undefined) {
          //       if (isNaN(val) || val == "NaN" || val == undefined) {
          //         if (isNaN(compareScoreT3B[indexval]) || compareScoreT3B[indexval] == "NaN") {
          //           compareScore.push(0);
          //         }
          //         else {
          //           compareScore.push(Math.round(compareScoreT3B[indexval]));
          //         }
          //       }
          //       else {
          //         if (isNaN(compareScoreT3B[indexval]) || compareScoreT3B[indexval] == "NaN") {
          //           compareScore.push(0);
          //         }
          //         else {
          //           compareScore.push(Math.round(val - (compareScoreT3B[indexval])));
          //         }
          //       }
          //     }
          //     else {
          //       compareScore.push(0);
          //     }
          //   });
          // }
          if (datatable.significance.get("combineSatisfaction") != undefined) {
            isSignificance = datatable.significance.get("combineSatisfaction");
          }

          if (satisfactionScore.length == this.brandcodes.length) {
            this.Satisfactiondata = [];
            const obj = {
              'Score': satisfactionScore,
              'base': datatable.bases.get('Base'),
              'compareScore': compareScore,
              'compareBase': compareBase,
              'isSignificance': isSignificance
            }
            this.Satisfactiondata.push(obj);
            this.dtPurchaseReaction.push({ 'type': "SatisfactionT3", 'Data': satisfactionScore });
            this.pptDownloadPurchaseReactionObject.SatisfactionT3 = satisfactionScore;
            this.dtPurchaseReaction.push({ 'type': "Base", 'Data': datatable.bases.get('Base') });
            this.CallLoader();
          }
        }
      });

      this.RecommandationT3.addTableDataReady((output, datatable) => {
        if (output.length > 0) {
          let compareBase = [];
          this.recomLoader = true;
          let recommendScore = [];
          let compareScore = [];
          let compareScoreT3B = [];
          let isSignificance = [];

          if (datatable.rows.get("combineRecommended") != undefined) {
            recommendScore = datatable.rows.get("combineRecommended");
          }
          if (datatable.comparisonBases.get("Base") != undefined) {
            compareBase = datatable.comparisonBases.get("Base");
            if (datatable.previousScoreRows.get("combineRecommended") != undefined) {
              compareScore = datatable.previousScoreRows.get("combineRecommended");
            }
          }
          // if (recommendScore.length > 0) {
          //   recommendScore.forEach((val, indexval) => {
          //     if (compareScoreT3B[indexval] != undefined) {
          //       if (isNaN(val) || val == "NaN" || val == undefined) {
          //         if (isNaN(compareScoreT3B[indexval]) || compareScoreT3B[indexval] == "NaN") {
          //           compareScore.push(0);
          //         }
          //         else {
          //           compareScore.push(Math.round(compareScoreT3B[indexval]));
          //         }
          //       }
          //       else {
          //         if (isNaN(compareScoreT3B[indexval]) || compareScoreT3B[indexval] == "NaN") {
          //           compareScore.push(0);
          //         }
          //         else {
          //           compareScore.push(Math.round(val - (compareScoreT3B[indexval])));
          //         }
          //       }
          //     }
          //     else {
          //       compareScore.push(0);
          //     }
          //   });
          // }
          if (datatable.significance.get("combineRecommended") != undefined) {
            isSignificance = datatable.significance.get("combineRecommended");
          }

          if (recommendScore.length == this.brandcodes.length) {
            this.Recommanddata = [];
            const obj = {
              'Score': recommendScore,
              'base': datatable.bases.get('Base'),
              'compareScore': compareScore,
              'compareBase': compareBase,
              'isSignificance': isSignificance
            }
            this.Recommanddata.push(obj);
            this.dtPurchaseReaction.push({ 'type': "Recommended", 'Data': recommendScore });
            this.pptDownloadPurchaseReactionObject.RecommandationT3 = recommendScore;
            this.dtPurchaseReaction.push({ 'type': "Base", 'Data': datatable.bases.get('Base') });
            this.CallLoader();
          }
        }
      });

      this.SocialMediaChart.addTableDataReady((output, dataTable) => {
        this.socialMainDataArray = [];
        this.positiveSocialCompare = [];
        this.negetiveSocialCompare = [];
        this.nuetralSocialCompare = [];
        this.nothingSocialCompare = [];

        let positiveSocialSignificance = [];
        let negetiveSocialSignificance = [];
        let nuetralSocialSignificance = [];
        let nothingSocialSignificance = [];

        this.positiveSocial = [];
        this.positiveSocialCompare = [];
        this.negetiveSocial = [];
        this.negetiveSocialCompare = [];
        this.nuetralSocial = [];
        this.nuetralSocialCompare = [];
        this.nothingSocial = [];
        this.nothingSocialCompare = [];

        if (output.length > 0) {
          let compareBase = [];
          if (dataTable.comparisonBases.get("Base") != undefined) {
            compareBase = dataTable.comparisonBases.get("Base");
          }

          this.socialloader = true;
          this.socialBase = dataTable.bases.get("Base");
          output.forEach((value, valueIndex) => {
            if (value.SeriesCode === "1") {
              this.positiveSocial.push(value.Score);
              let compare = 0;
              if (value.previousScore && value.previousScore != undefined) {
                compare = value.previousScore;
              }
              this.positiveSocialCompare.push(compare);
            }
            if (value.SeriesCode === "2") {
              this.negetiveSocial.push(value.Score);
              let compare = 0;
              if (value.previousScore && value.previousScore !== undefined) {
                compare = value.previousScore;
              }
              this.negetiveSocialCompare.push(compare);
            }
            if (value.SeriesCode === "3") {
              this.nuetralSocial.push(value.Score);
              let compare = 0;
              if (value.previousScore && value.previousScore != undefined) {
                compare = value.previousScore;
              }
              this.nuetralSocialCompare.push(compare);
            }
            if (value.SeriesCode === "4") {
              this.nothingSocial.push(value.Score);
              let compare = 0;
              if (value.previousScore && value.previousScore != undefined) {
                compare = value.previousScore;
              }
              this.nothingSocialCompare.push(compare);
            }
          });

          positiveSocialSignificance = dataTable.significance.get("Yes, and it was positive");
          negetiveSocialSignificance = dataTable.significance.get("Yes, and it was negative");
          nuetralSocialSignificance = dataTable.significance.get("Yes, and it was neutral");
          nothingSocialSignificance = dataTable.significance.get("No, I did not post anything");

          if (this.positiveSocial.length > 0 && this.positiveSocial.length == this.negetiveSocial.length && this.negetiveSocial.length == this.nothingSocial.length) {
            this.socialMainDataArray.push({
              'rowLabel': 'Positive Posts', 'rowVariable': 'RPF_FAU_RECENT_FAU7', 'Score': this.positiveSocial,
              'compareScore': this.positiveSocialCompare, 'compareBase': compareBase, 'isSignificance': positiveSocialSignificance
            });
            this.socialMainDataArray.push({
              'rowLabel': 'Negative Posts', 'rowVariable': 'RPF_FAU_RECENT_FAU7', 'Score': this.negetiveSocial,
              'compareScore': this.negetiveSocialCompare, 'compareBase': compareBase, 'isSignificance': negetiveSocialSignificance
            });
            this.socialMainDataArray.push({
              'rowLabel': 'Neutral Posts', 'rowVariable': 'RPF_FAU_RECENT_FAU7', 'Score': this.nuetralSocial,
              'compareScore': this.nuetralSocialCompare, 'compareBase': compareBase, 'isSignificance': nuetralSocialSignificance
            });
            this.socialMainDataArray.push({
              'rowLabel': 'No Posts', 'rowVariable': 'RPF_FAU_RECENT_FAU7', 'Score': this.nothingSocial,
              'compareScore': this.nothingSocialCompare, 'compareBase': compareBase, 'isSignificance': nothingSocialSignificance
            });

            this.dtPurchaseReaction.push({ 'type': "Positive Posts", 'Data': this.positiveSocial });
            this.pptDownloadPurchaseReactionObject.positiveSocial = this.positiveSocial;
            this.dtPurchaseReaction.push({ 'type': "Negative Posts", 'Data': this.negetiveSocial });
            this.pptDownloadPurchaseReactionObject.negetiveSocial = this.negetiveSocial;
            this.dtPurchaseReaction.push({ 'type': "Neutral Posts", 'Data': this.nuetralSocial });
            this.pptDownloadPurchaseReactionObject.nuetralSocial = this.nuetralSocial;
            this.dtPurchaseReaction.push({ 'type': "No Posts", 'Data': this.nothingSocial });
            this.pptDownloadPurchaseReactionObject.nothingSocial = this.nothingSocial;
            this.dtPurchaseReaction.push({ 'type': "Base", 'Data': this.socialBase });
            this.pptDownloadPurchaseReactionObject.bases = this.socialBase;
            this.CallLoader();
          }
        }
      });
    }
  }

  downloadPptTrends() {
    const purchaseReactionFinalTrendsPPTData: Array<any> = new Array<any>();
    for (const purchaseReactionTrendsPPT of this.purchaseReactionTrendsPPTData) {
      purchaseReactionFinalTrendsPPTData.push(purchaseReactionTrendsPPT[0]);
    }
    for (const purchaseReactionSocialMediaTrendsPPT of this.purchaseReactionSocialMediaTrendsPPTData[0]) {
      purchaseReactionFinalTrendsPPTData.push(purchaseReactionSocialMediaTrendsPPT);
    }
    this.showLoader = true;
    const objnew = JSON.stringify(purchaseReactionFinalTrendsPPTData);
    this.pptexport.postPPTForTrends(objnew).subscribe((data) => {
      const blob = new Blob([data], { type: 'application/octet-stream' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      document.body.appendChild(a);
      a.href = url;
      a.download = 'PurchaseReaction_Trends_PPT.zip';
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
      this.showLoader = false;
    }, error => {
      console.log(error);
      this.showLoader = false;
    });
  }
  updateDataTrends(codes) {
    this.purchaseReactionTrendsPPTData = [];
    this.purchaseReactionSocialMediaTrendsPPTData = [];
    const satisfactionT3Btrends: SatisfactionT3Btrends = new SatisfactionT3Btrends(this.Category);
    const purchaseAgainT3Btrends: PurchaseAgainT3Btrends = new PurchaseAgainT3Btrends(this.Category);
    const recommandationT3Btrends: RecommandationT3BTrends = new RecommandationT3BTrends(this.Category);
    const socialMediatrends: SocialMediaTrends = new SocialMediaTrends(this.Category);
    if (this.period === 'Quarterly' || this.periodSeclected === 'tab1') {
      this.satisfactionT3BTrends = satisfactionT3Btrends.SatisfactionT3B('Quarterly', 'SATISFACTION T3B', codes);
      this.purchaseAgainT3BTrends = purchaseAgainT3Btrends.PurchaseAgainT3B('Quarterly', 'PURCHASE AGAIN T3B', codes);
      this.recommandationT3BTrends = recommandationT3Btrends.RecommandationT3B('Quarterly', 'RECOMMEND T3B', codes);
      this.socialMediaPositiveTrends = socialMediatrends.SocialMediaPositive('Quarterly', 'SOCIAL MEDIA - POSITIVE POSTS', codes);
      this.socialMediaNegativeTrends = socialMediatrends.SocialMediaNegative('Quarterly', 'SOCIAL MEDIA - NEGATIVE POSTS', codes);
      this.socialMediaNeutralTrends = socialMediatrends.SocialMediaNeutral('Quarterly', 'SOCIAL MEDIA - NEUTRAL POSTS', codes);
      this.socialMediaNoPostTrends = socialMediatrends.SocialMediaNoPost('Quarterly', 'SOCIAL MEDIA - NO POSTS', codes);
    } else if (this.period === 'Annually' || this.periodSeclected === 'tab3') {
      this.satisfactionT3BTrends = satisfactionT3Btrends.SatisfactionT3B('Yearly', 'SATISFACTION T3B', codes);
      this.purchaseAgainT3BTrends = purchaseAgainT3Btrends.PurchaseAgainT3B('Yearly', 'PURCHASE AGAIN T3B', codes);
      this.recommandationT3BTrends = recommandationT3Btrends.RecommandationT3B('Yearly', 'RECOMMEND T3B', codes);
      this.socialMediaPositiveTrends = socialMediatrends.SocialMediaPositive('Yearly', 'SOCIAL MEDIA - POSITIVE POSTS', codes);
      this.socialMediaNegativeTrends = socialMediatrends.SocialMediaNegative('Yearly', 'SOCIAL MEDIA - NEGATIVE POSTS', codes);
      this.socialMediaNeutralTrends = socialMediatrends.SocialMediaNeutral('Yearly', 'SOCIAL MEDIA - NEUTRAL POSTS', codes);
      this.socialMediaNoPostTrends = socialMediatrends.SocialMediaNoPost('Yearly', 'SOCIAL MEDIA - NO POSTS', codes);
    } else if (this.period === 'SemiAnnually' || this.periodSeclected === 'tab2') {
      this.satisfactionT3BTrends = satisfactionT3Btrends.SatisfactionT3B('Semiannual', 'SATISFACTION T3B', codes);
      this.purchaseAgainT3BTrends = purchaseAgainT3Btrends.PurchaseAgainT3B('Semiannual', 'PURCHASE AGAIN T3B', codes);
      this.recommandationT3BTrends = recommandationT3Btrends.RecommandationT3B('Semiannual', 'RECOMMEND T3B', codes);
      this.socialMediaPositiveTrends = socialMediatrends.SocialMediaPositive('Semiannual', 'SOCIAL MEDIA - POSITIVE POSTS', codes);
      this.socialMediaNegativeTrends = socialMediatrends.SocialMediaNegative('Semiannual', 'SOCIAL MEDIA - NEGATIVE POSTS', codes);
      this.socialMediaNeutralTrends = socialMediatrends.SocialMediaNeutral('Semiannual', 'SOCIAL MEDIA - NEUTRAL POSTS', codes);
      this.socialMediaNoPostTrends = socialMediatrends.SocialMediaNoPost('Semiannual', 'SOCIAL MEDIA - NO POSTS', codes);
    }
    this.purchaseReactionTrendsPPTData.push(satisfactionT3Btrends.satisfactionT3BTrendsPPTData,
      purchaseAgainT3Btrends.purchaseAgainT3BTrendsPPTData,
      recommandationT3Btrends.recommandationT3BTrendsPPTData);
    this.purchaseReactionSocialMediaTrendsPPTData.push(socialMediatrends.socialMediaTrendsPPTData);
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
      this.updateDataTrends(this.brandcodes);
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
      this.updateDataTrends(this.brandcodes);
      setTimeout(() => {
        this.onDataUpdate.next();
      });
      setTimeout(() => {
        this.showLoader = false;
      }, 5000);
    }
  }

  ngOnDestroy(): void {
    this.optionSelectionUnsubscribe.next();
    this.optionSelectionUnsubscribe.complete();
  }

  ExcellExport() {
    this.getfilter();
    let csvData = [];
    let Brands=[];
    this.pptDownloadPurchaseReactionObject.Brands.forEach(element => {
      Brands.push(element);
    });
    csvData.push(Object.assign({}, this.csvDetailCreation(Brands, ' ', [0])));      
    csvData.push(Object.assign({}, this.csvDetailCreation(this.Satisfactiondata[0].Score, 'Satisfaction T3B', this.Satisfactiondata[0].base)));
    csvData.push(Object.assign({}, this.csvDetailCreation(this.Satisfactiondata[0].base, 'Satisfaction T3B Base', [])));
    csvData.push(Object.assign({}, this.csvDetailCreation(this.Purchasedata[0].Score, 'Purchase Again T3B', this.Purchasedata[0].base)));
    csvData.push(Object.assign({}, this.csvDetailCreation(this.Purchasedata[0].base, 'Purchase Again T3B Base', [])));
    csvData.push(Object.assign({}, this.csvDetailCreation(this.Recommanddata[0].Score, 'Recommend T3B', this.Recommanddata[0].base)));
    csvData.push(Object.assign({}, this.csvDetailCreation(this.Recommanddata[0].base, 'Recommend T3B Base',this.Recommanddata[0].base)));
    csvData.push(Object.assign({}, this.csvDetailCreation(this.positiveSocial, 'Positive Posts', this.socialBase)));
    csvData.push(Object.assign({}, this.csvDetailCreation(this.negetiveSocial, 'Negative Posts', this.socialBase)));
    csvData.push(Object.assign({}, this.csvDetailCreation(this.nuetralSocial, 'Neutral Posts', this.socialBase)));
    csvData.push(Object.assign({}, this.csvDetailCreation(this.nothingSocial, 'No Posts',  this.socialBase)));
    csvData.push(Object.assign({}, this.csvDetailCreation(this.socialBase, 'Base', [])));

    this.csvOptions.title = "Purchase Reaction - "+ this.Category;
    this.csvOptions.headers=[];
     this.csvOptions.headers = ["Filter(s)", this.filter];
    new AngularCsv(csvData, "Purchase Reaction "+ this.Category, this.csvOptions);
  }

  csvDetailCreation(data, sideBreak, base?) {
    let csvDetail = [];
    if(sideBreak==' '){
      csvDetail.push(sideBreak);
      csvDetail.push(data);
    }
    else{
    csvDetail.push(sideBreak);
    data.forEach((val, index) => {
      if (base.length && sideBreak.indexOf("Base") === (-1)) {
        val = this.scoreAndBase.transform(val , base[index]);
        csvDetail.push(val);
      } else {
        csvDetail.push(val);
      }
    });}
    return csvDetail;
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
  CallLoader() {
    if (this.socialloader && this.recomLoader && this.satloader && this.purchaseloader) {
      this.showLoader = false;
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
