import { ChartTypes } from 'src/app/shell/enums/chart.types';
import { Measure } from 'src/app/shell/enums/measure';
import { ChartProvider } from 'src/app/shell/enums/chart.provider';
import { TimePeriod } from 'src/app/shell/models/time.period';
import { RoundOffStrategy } from 'src/app/shell/enums/round.off.strategy';
import { BreakType, show } from 'src/app/shell/operators/chart.operators';
import { Chart } from 'src/app/shell/models/chart';
import { FilterCondition } from 'src/app/shell/enums/filter-condition.enum';

export class AdDetails {

  calltoActionBrandmaaping = {
    1: 'adcalltoactionAd1', 2: 'adcalltoactionAd2', 3: 'adcalltoactionAd3', 4: 'adcalltoactionAd4',
    5: 'adcalltoactionAd5', 6: 'adcalltoactionAd6', 7: 'adcalltoactionAd7', 8: 'adcalltoactionAd8',
    9: 'adcalltoactionAd9', 10: 'adcalltoactionAd10', 11: 'adcalltoactionAd11', 12: 'adcalltoactionAd12',
    13: 'adcalltoactionAd13', 14: 'adcalltoactionAd14', 15: 'adcalltoactionAd15', 16: 'adcalltoactionAd16',
    17: 'adcalltoactionAd17', 18: 'adcalltoactionAd18', 19: 'adcalltoactionAd19', 20: 'adcalltoactionAd20'
  };

  adDiagnosticBrandmaaping = {
    1: 'derotationAd1', 2: 'derotationAd2', 3: 'derotationAd3', 4: 'derotationAd4', 5: 'derotationAd5',
    6: 'derotationAd6', 7: 'derotationAd7', 8: 'derotationAd8', 9: 'derotationAd9', 10: 'derotationAd10',
    11: 'derotationAd11', 12: 'derotationAd12', 13: 'derotationAd13', 14: 'derotationAd14', 15: 'derotationAd15',
    16: 'derotationAd16', 17: 'derotationAd17', 18: 'derotationAd18', 19: 'derotationAd19', 20: 'derotationAd20'
  };

  adRecallBrandmaaping = {
    1: 'adRecallAd1', 2: 'adRecallAd2', 3: 'adRecallAd3', 4: 'adRecallAd4', 5: 'adRecallAd5',
    6: 'adRecallAd6', 7: 'adRecallAd7', 8: 'adRecallAd8', 9: 'adRecallAd9',
    10: 'adRecallAd10', 11: 'adRecallAd11', 12: 'adRecallAd12', 13: 'adRecallAd13', 14: 'adRecallAd14', 15: 'adRecallAd15',
    16: 'adRecallAd16', 17: 'adRecallAd17', 18: 'adRecallAd18', 19: 'adRecallAd19', 20: 'adRecallAd20'
  };

  brandRecallQuesMap = {
    1: 'brandingAd1',
    2: 'brandingAd2',
    3: 'brandingAd3',
    4: 'brandingAd4',
    5: 'brandingAd5',
    6: 'brandingAd6',
    7: 'brandingAd7',
    8: 'brandingAd8',
    9: 'brandingAd9',
    10: 'brandingAd10',
    11: 'brandingAd11',
    12: 'brandingAd12',
    13: 'brandingAd13',
    14: 'brandingAd14',
    15: 'brandingAd15',
    16: 'brandingAd16',
    17: 'brandingAd17',
    18: 'brandingAd18',
    19: 'brandingAd19',
    20: 'brandingAd20',
  };

  Ad = {
    1: 'The Perfect Touch',
    2: 'Hydrorain One',
    3: 'Shield Yourself',
    4: 'Quality Product Touchless KF',
    5: 'Lysol ActiClean Self-Clean',
    6: 'Innovative',
    7: 'Mother Nature',
    8: 'Konnect-Pouring Made Easy',
    9: 'Verdera Voice Mirror',
    10: 'The Design',
    11: 'Life Designs/ Water is Life',
    12: 'Perfect Fit/In Control',
    13: 'In2ition Two-In-One',
    14: 'Rough Water/In Control',
    15: 'Moen Flow',
    16: 'Water Dog',
    17: 'Automatic',
    18: 'Hungry Pet',
    19: 'U-Smart Faucet',
    20: 'Life Worth',
  };

  variableINdex: number;
  brand: '';

  getId(adname) {
    for (let index = 0; index < 20; index++) {
      if (this.Ad[index + 1] === adname) {
        this.variableINdex = index + 1;
      }
    }
  }

  callToAction(adname): Chart {
    this.getId(adname);
    const config = new Chart({
      SideBreak: [this.calltoActionBrandmaaping[this.variableINdex]],
      TopBreak: [TimePeriod.Variable],
      Type: ChartTypes.Table,
      Measure: Measure.ColumnPercent
    }, 'Ad Call To Action', ChartProvider.ECharts);
    config.showSideBreakOptions(0, [5, 3, 1, 7, 9, 4, 6, 2, 8]);
    config.enableTimeComparison(RoundOffStrategy.BeforeBinding);
    if (TimePeriod.PreviousPeriod) {
      config.showTopBreakOptions(0, [TimePeriod.PreviousPeriod, TimePeriod.CurrentPeriod]);
    } else {
      config.showTopBreakOptions(0, [TimePeriod.CurrentPeriod]);
    }
    config.showSideBreakBase(0, true);
    config.addShowAllSeries(true);
    config.addCalculationLogic(output => {
      return output;
    });
    return config;
  }

  adDiagnostic(adname): Chart {
    this.getId(adname);
    const config = new Chart({
      SideBreak: [this.adDiagnosticBrandmaaping[this.variableINdex]],
      TopBreak: [TimePeriod.Variable],
      Type: ChartTypes.Table,
      Measure: Measure.ColumnPercent
    }, 'Ad Diagnostic', ChartProvider.ECharts);
    config.showSideBreakOptions(0, [1, 4, 9, 6, 8, 2, 3, 10, 11, 5, 7]);
    config.enableTimeComparison(RoundOffStrategy.BeforeBinding);
    if (TimePeriod.PreviousPeriod) {
      config.showTopBreakOptions(0, [TimePeriod.PreviousPeriod, TimePeriod.CurrentPeriod]);
    } else {
      config.showTopBreakOptions(0, [TimePeriod.CurrentPeriod]);
    }
    config.showSideBreakBase(0, true);
    config.addCalculationLogic(output => {
      return output;
    });
    return config;
  }

  adRecall(adname): Chart {
    this.getId(adname);
    const chart = new Chart({
      SideBreak: [this.adRecallBrandmaaping[this.variableINdex]],
      TopBreak: [TimePeriod.Variable],
      Type: ChartTypes.Gauge,
      Measure: Measure.ColumnPercent
    }, 'Ad Recall', ChartProvider.ECharts);

    chart.showSideBreakOptions(0, [1]);
    chart.enableTimeComparison(RoundOffStrategy.BeforeBinding);
    if (TimePeriod.PreviousPeriod) {
      chart.showTopBreakOptions(0, [TimePeriod.PreviousPeriod, TimePeriod.CurrentPeriod]);
    } else {
      chart.showTopBreakOptions(0, [TimePeriod.CurrentPeriod]);
    }
    chart.showSideBreakBase(0, true);
    chart.addChartConfigChange((output, chartConfig) => {
      chartConfig.height = '200px';
      chartConfig.width = '250px';
      chartConfig.series[0].label.normal.textStyle.fontSize = 15;
      chartConfig.series[0].label.normal.textStyle.fontWeight = 'bold';
      chartConfig.series[0].labelLine.normal.length = 1;
      chartConfig.series[0].startAngle = -90;
      chartConfig.series[0].endAngle = 90;
      chartConfig.series[0].center[0] = '80%';
      const colors = this.getCustomerBRColors();
      const m = 100 - (chartConfig.series[0].data[0].value);
      chartConfig.series[0].data[2] = { name: m, value: m };
      chartConfig.series[0].data.forEach((val, i) => {
        val.itemStyle = {
          color: colors[i]
        };
      });

      return chartConfig;
    });
    chart.addCalculationLogic(output => {
      return output;
    }, RoundOffStrategy.AfterCalculation);
    return chart;
  }

  getCustomerBRColors() {
    return ['#fff', '#969595', '#fff'];
  }

  brandLinkage(adname): Chart {
    this.getId(adname);
    const config = new Chart({
      SideBreak: [this.brandRecallQuesMap[this.variableINdex]],
      TopBreak: [TimePeriod.Variable],
      Measure: Measure.ColumnPercent,
      Type: ChartTypes.Table
    }, 'Brand Linkage', ChartProvider.ECharts);
    if (this.brandRecallQuesMap[this.variableINdex] === '') {
      config.showLoader = false;
    }
    config.showSideBreakBase(0, true);
    config.enableTimeComparison(RoundOffStrategy.BeforeBinding);
    if (TimePeriod.PreviousPeriod) {
      config.enableSigTest();
      config.showTopBreakOptions(0, [TimePeriod.PreviousPeriod, TimePeriod.CurrentPeriod]);
    } else {
      config.showTopBreakOptions(0, [TimePeriod.CurrentPeriod]);
    }
    config.addCalculationLogic(output => {
      return output;
    }, RoundOffStrategy.AfterCalculation);
    return config;
  }

  brandLinkageAdRecalled(adname): Chart {
    this.getId(adname);
    const config = new Chart({
      SideBreak: [this.brandRecallQuesMap[this.variableINdex]],
      TopBreak: [TimePeriod.Variable],
      Measure: Measure.ColumnPercent,
      Type: ChartTypes.Table
    }, 'Brand Linkage (Ad Recalled)', ChartProvider.ECharts);
    if (this.brandRecallQuesMap[this.variableINdex] === '') {
      config.showLoader = false;
    }
    config.setSideBreakFilter(this.brandRecallQuesMap[this.variableINdex], this.adRecallBrandmaaping[this.variableINdex],
      [1], FilterCondition.AnyItemSelected);
    config.showSideBreakBase(0, true);
    config.enableTimeComparison(RoundOffStrategy.BeforeBinding);
    if (TimePeriod.PreviousPeriod) {
      config.enableSigTest();
      config.showTopBreakOptions(0, [TimePeriod.PreviousPeriod, TimePeriod.CurrentPeriod]);
    } else {
      config.showTopBreakOptions(0, [TimePeriod.CurrentPeriod]);
    }
    config.addCalculationLogic(output => {
      return output;
    }, RoundOffStrategy.AfterCalculation);
    return config;
  }

}
