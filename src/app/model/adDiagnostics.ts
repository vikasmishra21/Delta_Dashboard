import { Chart } from '../shell/models/chart';
import { Measure } from '../shell/enums/measure';
import { ChartTypes } from '../shell/enums/chart.types';
import { ChartProvider } from '../shell/enums/chart.provider';
import { TimePeriod } from '../shell/models/time.period';
import { RoundOffStrategy } from '../shell/enums/round.off.strategy';
import { BreakType, show } from '../shell/operators/chart.operators';

export class adDiagnostics {

  private readonly variableOptionForSideBreak = {
    'sideBreakVariableDiagnostic': ['derotationAd1', 'derotationAd2', 'derotationAd3', 'derotationAd13', 'derotationAd16', 'derotationAd10',
      'derotationAd11', 'derotationAd12', 'derotationAd14', 'derotationAd15', 'derotationAd19', 'derotationAd20', 'derotationAd7',
      'derotationAd8', 'derotationAd9', 'derotationAd18', 'derotationAd4', 'derotationAd5', 'derotationAd6', 'derotationAd17'],

    'sideBreakVariableCalltoAction': ['adcalltoactionAd1', 'adcalltoactionAd2', 'adcalltoactionAd3', 'adcalltoactionAd13', 'adcalltoactionAd16',
      'adcalltoactionAd10', 'adcalltoactionAd11', 'adcalltoactionAd12', 'adcalltoactionAd14',
      'adcalltoactionAd15', 'adcalltoactionAd19', 'adcalltoactionAd20', 'adcalltoactionAd7', 'adcalltoactionAd8', 'adcalltoactionAd9',
      'adcalltoactionAd18', 'adcalltoactionAd4', 'adcalltoactionAd5', 'adcalltoactionAd6', 'adcalltoactionAd17'],

    // tslint:disable-next-line: max-line-length // variable location according to Brand's Add
    'sideBreakvariableAdRecall': ['brandingAd1', 'brandingAd2', 'brandingAd3', 'brandingAd13', 'brandingAd16', 'brandingAd4', 'brandingAd5', 'brandingAd6', 'brandingAd17', 'brandingAd7', 'brandingAd8',
      'brandingAd9', 'brandingAd18', 'brandingAd10', 'brandingAd11', 'brandingAd12', 'brandingAd14', 'brandingAd15', 'brandingAd19', 'brandingAd20'],

    // tslint:disable-next-line: max-line-length // variable location according to Brand's Add
    'topBreakvariableAdRecall': ['adRecallAd1', 'adRecallAd2', 'adRecallAd3', 'adRecallAd13', 'adRecallAd16', 'adRecallAd4', 'adRecallAd5', 'adRecallAd6', 'adRecallAd17', 'adRecallAd7', 'adRecallAd8',
      'adRecallAd9', 'adRecallAd18', 'adRecallAd10', 'adRecallAd11', 'adRecallAd12', 'adRecallAd14', 'adRecallAd15', 'adRecallAd19', 'adRecallAd20']
  }


  private readonly selectedAdMappingForAdSelector = {
    'The Perfect Touch': 'derotationAd1',
    'Hydrorain One': 'derotationAd2',
    'Shield Yourself': 'derotationAd3',
    'In2ition Two-In-One': 'derotationAd13',
    'Water Dog': 'derotationAd16',
    'The Design': 'derotationAd10',
    'Life Designs/ Water is Life': 'derotationAd11',
    'Perfect Fit/In Control': 'derotationAd12',
    'Rough Water/In Control': 'derotationAd14',
    'Moen Flow': 'derotationAd15',
    'U-Smart Faucet': 'derotationAd19',
    'Life Worth': 'derotationAd20',
    'Mother Nature': 'derotationAd7',
    'Konnect-Pouring Made Easy': 'derotationAd8',
    'Verdera Voice Mirror': 'derotationAd9',
    'Hungry Pet': 'derotationAd18',
    'Quality Product Touchless KF': 'derotationAd4',
    'Lysol ActiClean Self-Clean': 'derotationAd5',
    'Innovative': 'derotationAd6',
    'Automatic': 'derotationAd17'
  }

  private readonly selectedAdMappingCallToAction = {
    'The Perfect Touch': 'adcalltoactionAd1',
    'Hydrorain One': 'adcalltoactionAd2',
    'Shield Yourself': 'adcalltoactionAd3',
    'In2ition Two-In-One': 'adcalltoactionAd13',
    'The Design': 'adcalltoactionAd10',
    'Life Designs/ Water is Life': 'adcalltoactionAd11',
    'Perfect Fit/In Control': 'adcalltoactionAd12',
    'Rough Water/In Control': 'adcalltoactionAd14',
    'Moen Flow': 'adcalltoactionAd15',
    'U-Smart Faucet': 'adcalltoactionAd19',
    'Life Worth': 'adcalltoactionAd20',
    'Mother Nature': 'adcalltoactionAd7',
    'Konnect-Pouring Made Easy': 'adcalltoactionAd8',
    'Verdera Voice Mirror': 'adcalltoactionAd9',
    'Hungry Pet': 'adcalltoactionAd18',
    'Quality Product Touchless KF': 'adcalltoactionAd4',
    'Lysol ActiClean Self-Clean': 'adcalltoactionAd5',
    'Innovative': 'adcalltoactionAd6',
    'Automatic': 'adcalltoactionAd17',
    'Water Dog': 'adcalltoactionAd16'
  }
  private readonly adTypeECR = {
    0: 'The Perfect Touch',
    1: 'Hydrorain One',
    2: 'Shield Yourself',
    3: 'In2ition Two-In-One',
    4: 'Water Dog',
    5: 'The Design',
    6: 'Life Designs/ Water is Life',
    7: 'Perfect Fit/In Control',
    8: 'Rough Water/In Control',
    9: 'Moen Flow',
    10: 'Mother Nature',
    11: 'Konnect-Pouring Made Easy',
    12: 'Verdera Voice Mirror',
    13: 'Quality Product Touchless KF',
    14: 'Lysol ActiClean Self-Clean',
    15: 'Innovative',
    16: 'Automatic'
  }

  bubbleRecallMapping = {
    'brandingAd1': 'The Perfect Touch',
    'brandingAd2': 'Hydrorain One',
    'brandingAd3': 'Shield Yourself',
    'brandingAd13': 'In2ition Two-In-One',
    'brandingAd16': 'Water Dog',
    'brandingAd4': 'Quality Product Touchless KF',
    'brandingAd5': 'Lysol ActiClean Self-Clean',
    'brandingAd6': 'Innovative',
    'brandingAd17': 'Automatic',
    'brandingAd7': 'Mother Nature',
    'brandingAd8': 'Konnect-Pouring Made Easy',
    'brandingAd9': 'Verdera Voice Mirror',
    'brandingAd18': 'Hungry Pet',
    'brandingAd10': 'The Design',
    'brandingAd11': 'Life Designs/ Water is Life',
    'brandingAd12': 'Perfect Fit/In Control',
    'brandingAd14': 'Rough Water/In Control',
    'brandingAd15': 'Moen Flow',
    'brandingAd19': 'U-Smart Faucet',
    'brandingAd20': 'Life Worth',
    'adRecallAd1': 'The Perfect Touch',
    'adRecallAd2': 'Hydrorain One',
    'adRecallAd3': 'Shield Yourself',
    'adRecallAd13': 'In2ition Two-In-One',
    'adRecallAd16': 'Water Dog',
    'adRecallAd4': 'Quality Product Touchless KF',
    'adRecallAd5': 'Lysol ActiClean Self-Clean',
    'adRecallAd6': 'Innovative',
    'adRecallAd17': 'Automatic',
    'adRecallAd7': 'Mother Nature',
    'adRecallAd8': 'Konnect-Pouring Made Easy',
    'adRecallAd9': 'Verdera Voice Mirror',
    'adRecallAd18': 'Hungry Pet',
    'adRecallAd10': 'The Design',
    'adRecallAd11': 'Life Designs/ Water is Life',
    'adRecallAd12': 'Perfect Fit/In Control',
    'adRecallAd14': 'Rough Water/In Control',
    'adRecallAd15': 'Moen Flow',
    'adRecallAd19': 'U-Smart Faucet',
    'adRecallAd20': 'Life Worth'
  }

  private readonly selectedCallToActionNet = {
    'The Perfect Touch': 1,
    'Hydrorain One': 2,
    'Shield Yourself': 3,
    'In2ition Two-In-One': 13,
    'Water Dog': 16,
    'The Design': 10,
    'Life Designs/ Water is Life': 11,
    'Perfect Fit/In Control': 12,
    'Rough Water/In Control': 14,
    'Moen Flow': 15,
    'Mother Nature': 7,
    'Konnect-Pouring Made Easy': 8,
    'Verdera Voice Mirror': 9,
    'Quality Product Touchless KF': 4,
    'Lysol ActiClean Self-Clean': 5,
    'Innovative': 6
  };

  mapppingTime: any;
  newECRValuesTooltip: any;
  ECRPPTData: Array<any> = new Array<any>();
  newECRValues = {};

  struct = {
    "Delta": [
      'The Perfect Touch',
      'Hydrorain One',
      'Shield Yourself',
      'In2ition Two-In-One',
      'Water Dog'
    ],
    "American Standard": [
      'Quality Product Touchless KF',
      'Lysol ActiClean Self-Clean',
      'Innovative',
      'Automatic'
    ],
    "Kohler": [
      'Mother Nature',
      'Konnect-Pouring Made Easy',
      'Verdera Voice Mirror',
      "Hungry Pet"
    ],
    "Moen": [
      'The Design',
      'Life Designs/ Water is Life',
      'Perfect Fit/In Control',
      'Rough Water/In Control',
      'Moen Flow',
      "U-Smart Faucet",
      "Life Worth",
    ]
  }

  constructor() { }
  // ad Diagnostic functionality configuration
  getAdDiagnosticsForAllBrands(selectedAd): Chart {
    let sideBreakVariableArray = [];
    if (selectedAd.length !== 0) {
      selectedAd.forEach((val, index) => {
        sideBreakVariableArray.push(this.selectedAdMappingForAdSelector[val]);
      });
    } else {
      sideBreakVariableArray = this.variableOptionForSideBreak.sideBreakVariableDiagnostic;
    }
    const config = new Chart({
      SideBreak: sideBreakVariableArray,
      TopBreak: [TimePeriod.Variable],
      Measure: Measure.ColumnPercent,
      Type: ChartTypes.Table
    }, 'All Ad Diagnostic', ChartProvider.ECharts);
    sideBreakVariableArray.forEach((val, i) => {
      config.showSideBreakBase(i, true);
      config.showSideBreakOptions(i, [1, 4, 9, 6, 8, 2, 3, 10, 11, 5, 7]);
    });
    config.enableTimeComparison(RoundOffStrategy.BeforeBinding);
    if (TimePeriod.PreviousPeriod) {
      config.showTopBreakOptions(0, [TimePeriod.PreviousPeriod, TimePeriod.CurrentPeriod]);

    } else {
      config.showTopBreakOptions(0, [TimePeriod.CurrentPeriod]);
    }
    config.addShowAllSeries(true);
    config.addCalculationLogic(output => {
      return output;
    });
    return config;
  }

  // ad call to action functionality configuration

  getAdCallToActionForAllBrands(selectedAd): Chart {
    let sideBreakVariableArray = [];
    if (selectedAd.length !== 0) {
      selectedAd.forEach((val, index) => {
        sideBreakVariableArray.push(this.selectedAdMappingCallToAction[val]);
      });
    } else {
      sideBreakVariableArray = this.variableOptionForSideBreak.sideBreakVariableCalltoAction;
    }
    const config = new Chart({
      SideBreak: sideBreakVariableArray,
      TopBreak: [TimePeriod.Variable],
      Measure: Measure.ColumnPercent,
      Type: ChartTypes.Table
    }, 'All Ad Call To Action', ChartProvider.ECharts);

    sideBreakVariableArray.forEach((val, i) => {
      config.showSideBreakBase(i, true);
      config.combineSideBreakOptions(val, [5, 3, 1, 7, 9, 4, 6, 2, 8], "totalRowNet")
      config.showSideBreakOptions(i, [100001]);
    });
    config.enableTimeComparison(RoundOffStrategy.BeforeBinding);
    if (TimePeriod.PreviousPeriod) {
      config.showTopBreakOptions(0, [TimePeriod.PreviousPeriod, TimePeriod.CurrentPeriod]);
    } else {
      config.showTopBreakOptions(0, [TimePeriod.CurrentPeriod]);
    }
    config.enableSigTest();
    config.addShowAllSeries(true);
    config.addCalculationLogic(output => {
      return output;
    });
    return config;
  }

  getAdDiagnosticsTotalAverage(): Chart {
    const sideBreakVariableArray = this.variableOptionForSideBreak.sideBreakVariableDiagnostic;
    const config = new Chart({
      SideBreak: sideBreakVariableArray,
      TopBreak: [TimePeriod.Variable],
      Measure: Measure.ColumnPercent,
      Type: ChartTypes.Table
    }, 'All Ad Diagnostic Total Average', ChartProvider.ECharts);

    sideBreakVariableArray.forEach((val, i) => {
      config.showSideBreakBase(i, true);
      config.showSideBreakOptions(i, [1, 4, 9, 6, 8, 2, 3, 10, 11, 5, 7]);
    });
    config.enableTimeComparison(RoundOffStrategy.BeforeBinding);
    if (TimePeriod.PreviousPeriod) {
      config.showTopBreakOptions(0, [TimePeriod.PreviousPeriod, TimePeriod.CurrentPeriod]);
    } else {
      config.showTopBreakOptions(0, [TimePeriod.CurrentPeriod]);
    }
    config.addShowAllSeries(true);
    config.addCalculationLogic(output => {
      return output;
    });
    return config;
  }

  // ad call to action functionality configuration

  getAdCallToActionTotalAverage(): Chart {
    const sideBreakVariableArray = this.variableOptionForSideBreak.sideBreakVariableCalltoAction;
    const config = new Chart({
      SideBreak: sideBreakVariableArray,
      TopBreak: [TimePeriod.Variable],
      Measure: Measure.ColumnPercent,
      Type: ChartTypes.Table
    }, 'All call to action Total average', ChartProvider.ECharts);

    sideBreakVariableArray.forEach((val, i) => {
      config.showSideBreakBase(i, true);
      config.combineSideBreakOptions(val, [5, 3, 1, 7, 9, 4, 6, 2, 8], 'combineCallToActionAverage');
      config.showSideBreakOptions(i, [100001]);
    });
    config.enableTimeComparison(RoundOffStrategy.BeforeBinding);
    if (TimePeriod.PreviousPeriod) {
      config.showTopBreakOptions(0, [TimePeriod.PreviousPeriod, TimePeriod.CurrentPeriod]);
    } else {
      config.showTopBreakOptions(0, [TimePeriod.CurrentPeriod]);
    }
    config.enableSigTest();
    config.addShowAllSeries(true);
    config.addCalculationLogic(output => {
      return output;
    });
    return config;
  }

  getCallToActionNet(selectedAd): Chart {
    let sideBreakVariableArray = [];
    if (selectedAd.length !== 0) {
      selectedAd.forEach((val, index) => {
        sideBreakVariableArray.push(this.selectedAdMappingCallToAction[val]);
      });
    } else {
      sideBreakVariableArray = this.variableOptionForSideBreak.sideBreakVariableCalltoAction;
    }
    const config = new Chart({
      SideBreak: sideBreakVariableArray,
      TopBreak: [TimePeriod.Variable],
      Measure: Measure.ColumnPercent,
      Type: ChartTypes.Table
    }, 'All Ad Call To Action', ChartProvider.ECharts);

    sideBreakVariableArray.forEach((val, i) => {
      config.showSideBreakBase(i, true);
      config.combineSideBreakOptions(val, [5, 3, 1, 7, 9, 4, 6, 2, 8], 'CallToActionNet');
      config.showSideBreakOptions(i, [100001]);
    });
    config.enableTimeComparison(RoundOffStrategy.BeforeBinding);
    if (TimePeriod.PreviousPeriod) {
      config.showTopBreakOptions(0, [TimePeriod.PreviousPeriod, TimePeriod.CurrentPeriod]);
    } else {
      config.showTopBreakOptions(0, [TimePeriod.CurrentPeriod]);
    }
    config.enableSigTest();
    config.addShowAllSeries(true);
    config.addCalculationLogic(output => {
      return output;
    });
    return config;
  }

  // ad recall chart
  getAddRecallandBrand1(chartName, ecrValue, brandsVarIndex): Chart {
    let xandYLength = this.variableOptionForSideBreak.topBreakvariableAdRecall.length;
    let sideBreak = this.variableOptionForSideBreak.topBreakvariableAdRecall.concat(this.variableOptionForSideBreak.sideBreakvariableAdRecall);
    const config = new Chart({
      SideBreak: sideBreak,
      TopBreak: [TimePeriod.Variable],
      Measure: Measure.ColumnPercent,
      Type: ChartTypes.Table
    }, chartName, ChartProvider.ECharts);
    if (TimePeriod.PreviousPeriod) {
      config.showTopBreakOptions(0, [TimePeriod.PreviousPeriod, TimePeriod.CurrentPeriod]);
    } else {
      config.showTopBreakOptions(0, [TimePeriod.CurrentPeriod]);
    }
    config.SideBreak.forEach((val, i) => {
      config.showSideBreakOptions(i, [1]);
    });
    config.addShowAllSeries(true);
    // config.TopBreak.forEach((val, i) => {
    //   config.showTopBreakOptions(i, [1]);
    // });

    return config;
  }
  getAddRecallandBrand(chartName, ecrValue, brandsVarIndex, brandColorGroup): Chart {
    const xandYLength = this.variableOptionForSideBreak.topBreakvariableAdRecall.length;
    // tslint:disable-next-line: max-line-length
    const sideBreak = this.variableOptionForSideBreak.topBreakvariableAdRecall.concat(this.variableOptionForSideBreak.sideBreakvariableAdRecall);
    const config = new Chart({
      SideBreak: sideBreak,
      TopBreak: [TimePeriod.Variable],
      Type: ChartTypes.Scatter,
      Measure: Measure.ColumnPercent
    }, chartName, ChartProvider.ECharts);
    config.showTopBreakOptions(0, [TimePeriod.CurrentPeriod]);
    config.addShowAllSeries(true);
    config.SideBreak.forEach((val, i) => {
      config.showSideBreakOptions(i, [1]);
    });
    config.addCalculationLogic(output => {
      // category name mapping in output
      const table = output.TableOutput.get(config.Name);
      table.forEach(value => {
        value.CategoryName = this.bubbleRecallMapping[value.SeriesVariableID];
      });
      return output;
    }, RoundOffStrategy.AfterCalculation);

    Object.keys(this.struct).map((brand, index) => {
      this.struct[brand].map((key, indexKey) => {
        this.newECRValues[key] = ecrValue[brand][indexKey]
      })
    })
    config.addChartConfigChange((output, chartConfig) => {
      this.mapppingTime = output[0].CategoryCode;
      this.newECRValuesTooltip = this.newECRValues;
      const adsName = {
        'The Perfect Touch': 0,
        'Hydrorain One': 1,
        'Shield Yourself': 2,
        'In2ition Two-In-One': 3,
        'Water Dog': 4,
        'Quality Product Touchless KF': 5,
        'Lysol ActiClean Self-Clean': 6,
        'Innovative': 7,
        'Automatic': 8,
        'Mother Nature': 9,
        'Konnect-Pouring Made Easy': 10,
        'Verdera Voice Mirror': 11,
        'Hungry Pet': 12,
        'The Design': 13,
        'Life Designs/ Water is Life': 14,
        'Perfect Fit/In Control': 15,
        'Rough Water/In Control': 16,
        'Moen Flow': 17,
        'U-Smart Faucet': 18,
        'Life Worth': 19
      };
      let color = {
        'The Perfect Touch': '#C80000',
        'Hydrorain One': '#C80000',
        'Shield Yourself': '#C80000',
        'In2ition Two-In-One': '#C80000',
        'Water Dog': '#C80000',
        'Quality Product Touchless KF': '#FFD400',
        'Lysol ActiClean Self-Clean': '#FFD400',
        'Innovative': '#FFD400',
        'Automatic': '#FFD400',
        'Mother Nature': '#000000',
        'Konnect-Pouring Made Easy': '#000000',
        'Verdera Voice Mirror': '#000000',
        'Hungry Pet': '#000000',
        'The Design': '#00B7F9',
        'Life Designs/ Water is Life': '#00B7F9',
        'Perfect Fit/In Control': '#00B7F9',
        'Rough Water/In Control': '#00B7F9',
        'Moen Flow': '#00B7F9',
        'U-Smart Faucet': '#00B7F9',
        'Life Worth': '#00B7F9'
      };

      const series = [];
      let counter = 0;
      const dataForMinMax = [];
      chartConfig.series = [];
      this.ECRPPTData = [];
      chartConfig.height = '560px';
      chartConfig.width = '1200px';
      chartConfig.grid = [
        { x: '10%', y: '10%', width: '60%', height: '65%', top: '4%' }
      ];
      chartConfig.legend = {
        type: "plain",
        data: [],
        itemGap: 9,
        orient: 'verticle',
        left: '80%',
        top: '4%',
      }

      // category name is being change in ad calculation logic
      output.forEach((val, i) => {
        // val.CategoryName = val.CategoryName.replace('_', ' ');
        if (i == 27) {

        }
        if (i >= xandYLength) {
          if (adsName[val.CategoryName] == 0 && series[adsName[val.CategoryName]].data[0][1] == undefined) {
            counter = 0;
            chartConfig.legend.data.push(val.CategoryName);
          }
          else if (adsName[val.CategoryName] == 1 && series[adsName[val.CategoryName]].data[0][1] == undefined) {
            counter = 0;
            chartConfig.legend.data.push(val.CategoryName);
          }
          else if (adsName[val.CategoryName] == 2 && series[adsName[val.CategoryName]].data[0][1] == undefined) {
            counter = 0;
            chartConfig.legend.data.push(val.CategoryName);
          }
          else if (adsName[val.CategoryName] == 3 && series[adsName[val.CategoryName]].data[0][1] == undefined) {
            counter = 0;
            chartConfig.legend.data.push(val.CategoryName);
          }
          else if (adsName[val.CategoryName] == 4 && series[adsName[val.CategoryName]].data[0][1] == undefined) {
            counter = 0;
            chartConfig.legend.data.push(val.CategoryName);
          }
          else if (adsName[val.CategoryName] == 5 && series[adsName[val.CategoryName]].data[0][1] == undefined) {
            counter = 0;
            chartConfig.legend.data.push(val.CategoryName);
          }
          else if (adsName[val.CategoryName] == 6 && series[adsName[val.CategoryName]].data[0][1] == undefined) {
            counter = 0;
            chartConfig.legend.data.push(val.CategoryName);
          }
          else if (adsName[val.CategoryName] == 7 && series[adsName[val.CategoryName]].data[0][1] == undefined) {
            counter = 0;
            chartConfig.legend.data.push(val.CategoryName);
          }
          else if (adsName[val.CategoryName] == 8 && series[adsName[val.CategoryName]].data[0][1] == undefined) {
            counter = 0;
            chartConfig.legend.data.push(val.CategoryName);
          }
          else if (adsName[val.CategoryName] == 9 && series[adsName[val.CategoryName]].data[0][1] == undefined) {
            counter = 0;
            chartConfig.legend.data.push(val.CategoryName);
          }
          else if (adsName[val.CategoryName] == 10 && series[adsName[val.CategoryName]].data[0][1] == undefined) {
            counter = 0;
            chartConfig.legend.data.push(val.CategoryName);
          }
          else if (adsName[val.CategoryName] == 11 && series[adsName[val.CategoryName]].data[0][1] == undefined) {
            counter = 0;
            chartConfig.legend.data.push(val.CategoryName);
          }
          else if (adsName[val.CategoryName] == 12 && series[adsName[val.CategoryName]].data[0][1] == undefined) {
            counter = 0;
            chartConfig.legend.data.push(val.CategoryName);
          }
          else if (adsName[val.CategoryName] == 13 && series[adsName[val.CategoryName]].data[0][1] == undefined) {
            counter = 0;
            chartConfig.legend.data.push(val.CategoryName);
          }
          else if (adsName[val.CategoryName] == 14 && series[adsName[val.CategoryName]].data[0][1] == undefined) {
            counter = 0;
            chartConfig.legend.data.push(val.CategoryName);
          }
          else if (adsName[val.CategoryName] == 15 && series[adsName[val.CategoryName]].data[0][1] == undefined) {
            counter = 0;
            chartConfig.legend.data.push(val.CategoryName);
          }
          else if (adsName[val.CategoryName] == 16 && series[adsName[val.CategoryName]].data[0][1] == undefined) {
            counter = 0;
            chartConfig.legend.data.push(val.CategoryName);
          }
          else if (adsName[val.CategoryName] == 17 && series[adsName[val.CategoryName]].data[0][1] == undefined) {
            counter = 0;
            chartConfig.legend.data.push(val.CategoryName);
          }
          else if (adsName[val.CategoryName] == 18 && series[adsName[val.CategoryName]].data[0][1] == undefined) {
            counter = 0;
            chartConfig.legend.data.push(val.CategoryName);
          }
          else if (adsName[val.CategoryName] == 19 && series[adsName[val.CategoryName]].data[0][1] == undefined) {
            counter = 0;
            chartConfig.legend.data.push(val.CategoryName);
          }
          series[adsName[val.CategoryName]].data[counter][1] = val.Score;
          counter++;
          dataForMinMax[i - xandYLength].push(val.Score);
        } else {
          dataForMinMax.push([val.Score]);
          if (series[adsName[val.CategoryName]] !== undefined) {
            series[adsName[val.CategoryName]].data.push([val.Score]);
          } else {
            const self = this;
            series.push({
              symbolSize(data, i) {
                let sum = 0;
                // if (self.newECRValues[val.CategoryName].length !== 0) {
                  if (self.newECRValues[val.CategoryName] !== undefined) {
                    self.newECRValues[val.CategoryName].forEach((a, b) => {
                      let quarStr = a.quar.split('_');
                      let quar = parseInt(quarStr[0].substr(1))
                      let year = Math.abs((parseInt(quarStr[1]) - 2019)) * 4
                      let num = (quar + year)
                      if (TimePeriod.Variable === 'Quarterly') {
                        if (num <= parseInt(val.CategoryCode)) {
                          sum += a.score;
                        }
                      } else if (TimePeriod.Variable === 'Semiannual') {
                        let updatedCatCode;
                        if (val.CategoryCode === '1') {
                          updatedCatCode = parseInt(val.CategoryCode) * 2;
                        } else if (val.CategoryCode === '2') {
                          updatedCatCode = parseInt(val.CategoryCode) * 2;
                        }
                        if (num <= updatedCatCode) {
                          sum += a.score;
                        }
                      } else if (TimePeriod.Variable === 'Yearly') {
                        sum += a.score;
                      }
                    });
                  }
                // }
                return sum == 0 ? 10 : 10 + (Math.sqrt(sum));
              },
              data: [[val.Score]],
              type: 'scatter',
              itemStyle: {
                normal: {
                  color: color[val.CategoryName]
                }
              },
              name: val.CategoryName
            });
          }
        }
      });
      chartConfig.series = series;

      const arrX = [];
      const arrY = [];
      dataForMinMax.forEach((val, i) => {
        if (val.includes('NaN') || val.includes(NaN)) {

        } else {
          arrX.push(val[0]);
          arrY.push(val[1]);
        }
      });
      const minValX = Math.min(...arrX);
      const maxValX = Math.max(...arrX);
      const minValY = Math.min(...arrY);
      const maxValY = Math.max(...arrY);

      chartConfig.xAxis = {
        gridIndex: 0,
        min: Math.round(minValX) < 15 ? 0 : Math.round(minValX - 5),
        max: Math.round(maxValX + 10),
        name: 'Recall',
        nameGap: 30,
        nameLocation: 'middle',
        nameTextStyle: {
          color: '#808080',
          fontSize: 14,
          fontWeight: 800
        },
        splitLine: {
          show: true,
          lineStyle: {
            type: 'dotted'
          }
        }
      };
      chartConfig.yAxis = {
        gridIndex: 0,
        min: Math.round(minValY) < 15 ? 0 : Math.round(minValY - 5),
        max: Math.round(maxValY + 10),
        name: 'Branding',
        nameGap: 30,
        nameLocation: 'middle',
        nameTextStyle: {
          color: '#808080',
          fontSize: 14,
          fontWeight: 800
        },
        splitLine: {
          show: true,
          lineStyle: {
            type: 'dotted'
          }
        }
      };

      chartConfig.series.forEach((val, i) => {
        val.data[0].forEach(element => {
          if (element === 'NaN') {
            delete chartConfig.legend.data[i];
          }
        });
      });

      const quarterValue = this.mapppingTime;
      const ecrValue = this.newECRValuesTooltip;
      chartConfig.tooltip = {
        padding: 10,
        backgroundColor: '#222',
        borderColor: '#777',
        borderWidth: 1,
        formatter(obj, a, b) {
          const value = obj.value;
          let sumOfECR = 0;
          ecrValue[obj.seriesName].forEach((a, b) => {
            let quarStr = a.quar.split('_');
            let quar = parseInt(quarStr[0].substr(1))
            let year = Math.abs((parseInt(quarStr[1]) - 2019)) * 4
            let num = (quar + year)
            if (TimePeriod.Variable === 'Quarterly') {
              if (num <= parseInt(quarterValue)) {
                sumOfECR += a.score;
              }
            } else if (TimePeriod.Variable === 'Semiannual') {
              let updatedCatCode;
              if (quarterValue === '1') {
                updatedCatCode = parseInt(quarterValue) * 2;
              } else if (quarterValue === '2') {
                updatedCatCode = parseInt(quarterValue) * 2;
              }
              if (num <= updatedCatCode) {
                sumOfECR += a.score;
              }
            } else if (TimePeriod.Variable === 'Yearly') {
              sumOfECR += a.score;
            }
          });
          return '<div style="border-bottom: 1px solid rgba(255,255,255,.3); font-size: 14px;padding-bottom: 7px;margin-bottom: 7px">'
            + brandColorGroup[obj.color]
            + '</div>'
            + obj.seriesName + ' (ECR) ：' + sumOfECR + '<br>'
            + 'Recall：' + value[0] + ' <br>'
            + 'Branding : ' + value[1] + '<br>';
        }
      };
      this.ECRPPTData.push(chartConfig);
      localStorage.setItem('ecrPPtobj', JSON.stringify(this.ECRPPTData));
      return chartConfig;


    });
    return config;
  }
  getAdBubbleRecall(): Chart {
    const sideBreakVar = this.variableOptionForSideBreak.sideBreakvariableAdRecall;
    const topBreakVar = this.variableOptionForSideBreak.topBreakvariableAdRecall;

    const config = new Chart({
      SideBreak: sideBreakVar,
      TopBreak: topBreakVar,
      Type: ChartTypes.Scatter,
      Measure: Measure.ColumnPercent
    }, 'Ad Recall', ChartProvider.ECharts);

    config.showSideBreakBase(0, true);
    config.SideBreak.forEach((val, i) => {
      config.showSideBreakOptions(i, [1]);
    });
    config.TopBreak.forEach((val, i) => {
      config.showTopBreakOptions(i, [1]);
    });
    if (TimePeriod.Variable) {
      config.enableTimeComparison(RoundOffStrategy.BeforeBinding);
      config.TopBreak.forEach((val, i) => {
        if (TimePeriod.PreviousPeriod) {
          // tslint:disable-next-line: max-line-length
          config.for(BreakType.TopBreak).nest(i, [TimePeriod.Variable]).pipe(show(0, [TimePeriod.PreviousPeriod, TimePeriod.CurrentPeriod]));
        } else {
          config.for(BreakType.TopBreak).nest(i, [TimePeriod.Variable]).pipe(show(0, [TimePeriod.CurrentPeriod]));
        }
      });
    }
    config.addChartConfigChange((output, chartConfig) => {
      chartConfig.height = '420px';
      chartConfig.width = '250%';
      chartConfig.grid.width = '80%';
      chartConfig.grid.height = '90%';
      chartConfig.grid.y = '8%';
      chartConfig.series[0].data.forEach((val, i) => {
        console.log(val, i);
      });
      // output.forEach(element => {
      //   console.log(element.SeriesName);
      // });
      return chartConfig;
    });
    return config;
  }
}
