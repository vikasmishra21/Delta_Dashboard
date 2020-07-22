import { Chart } from 'src/app/shell/models/chart';
import { ChartTypes } from 'src/app/shell/enums/chart.types';
import { Measure } from 'src/app/shell/enums/measure';
import { ChartProvider } from 'src/app/shell/enums/chart.provider';
import { FilterCondition } from 'src/app/shell/enums/filter-condition.enum';

export class AdDetailsTrends {

  calltoActionBrandmaaping = {
    1: 'adcalltoactionAd1',
    2: 'adcalltoactionAd2',
    3: 'adcalltoactionAd3',
    4: 'adcalltoactionAd4',
    5: 'adcalltoactionAd5',
    6: 'adcalltoactionAd6',
    7: 'adcalltoactionAd7',
    8: 'adcalltoactionAd8',
    9: 'adcalltoactionAd9',
    10: 'adcalltoactionAd10',
    11: 'adcalltoactionAd11',
    12: 'adcalltoactionAd12',
    13: 'adcalltoactionAd13',
    14: 'adcalltoactionAd14',
    15: 'adcalltoactionAd15',
    16: 'adcalltoactionAd16',
    17: 'adcalltoactionAd17',
    18: 'adcalltoactionAd18',
    19: 'adcalltoactionAd19',
    20: 'adcalltoactionAd20',
  };

  adDiagnosticBrandmaaping = {
    1: 'derotationAd1',
    2: 'derotationAd2',
    3: 'derotationAd3',
    4: 'derotationAd4',
    5: 'derotationAd5',
    6: 'derotationAd6',
    7: 'derotationAd7',
    8: 'derotationAd8',
    9: 'derotationAd9',
    10: 'derotationAd10',
    11: 'derotationAd11',
    12: 'derotationAd12',
    13: 'derotationAd13',
    14: 'derotationAd14',
    15: 'derotationAd15',
    16: 'derotationAd16',
    17: 'derotationAd17',
    18: 'derotationAd18',
    19: 'derotationAd19',
    20: 'derotationAd20',
  };

  adRecallBrandmaaping = {
    1: 'adRecallAd1',
    2: 'adRecallAd2',
    3: 'adRecallAd3',
    4: 'adRecallAd4',
    5: 'adRecallAd5',
    6: 'adRecallAd6',
    7: 'adRecallAd7',
    8: 'adRecallAd8',
    9: 'adRecallAd9',
    10: 'adRecallAd10',
    11: 'adRecallAd11',
    12: 'adRecallAd12',
    13: 'adRecallAd13',
    14: 'adRecallAd14',
    15: 'adRecallAd15',
    16: 'adRecallAd16',
    17: 'adRecallAd17',
    18: 'adRecallAd18',
    19: 'adRecallAd19',
    20: 'adRecallAd20'
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
  adDetailsTrendsPptData: Array<any> = new Array<any>();

  getId(adname) {
    for (let index = 0; index < 20; index++) {
      if (this.Ad[index + 1] === adname) {
        this.variableINdex = index + 1;
      }
    }
  }

  adDiagnosticTrends(TopBreak, title, adname): Chart {
    this.getId(adname);
    const config = new Chart({
      SideBreak: [this.adDiagnosticBrandmaaping[this.variableINdex]],
      TopBreak: [TopBreak],
      Type: ChartTypes.Line,
      Measure: Measure.ColumnPercent
    }, 'Ad Diagnostic Trends', ChartProvider.ECharts);
    config.addChartConfigChange((output, chartConfig) => {
      chartConfig.height = '400px';
      chartConfig.width = '600px';
      chartConfig.title.text = title + ' - ' + this.Ad[this.variableINdex] + ' (' + TopBreak + ')';
      chartConfig.title.show = false;
      chartConfig.xAxis.show = true;
      chartConfig.xAxis.splitLine = false;
      chartConfig.grid.containLabel = true;
      chartConfig.grid.width = '70%';
      chartConfig.grid.height = '55%';
      chartConfig.grid.y = '3%';
      chartConfig.series = [];
      chartConfig.legend.data = [];
      let counter = 0;
      chartConfig.xAxis.data = [];
      chartConfig.legend.textStyle = {
        fontSize: 9,
        padding: [0, 25, 0, 0]
      };
      chartConfig.legend.selectorLabel = {
        distance: 10
      };
      chartConfig.tooltip = {
        trigger: 'axis',
        textStyle: {fontSize: 11},
        align: 'center'
      };
      chartConfig.legend.bottom = '1%';
      output.forEach((ele, i) => {
        if (ele.SeriesName !== 'Not answered any top2box') {
          const Score = isNaN(ele.Score) ? 0 : ele.Score;
          const obj = {
            data: [Score],
            name: ele.SeriesName,
            type: 'line'
          };
          if (!chartConfig.legend.data.includes(ele.SeriesName)) {
            chartConfig.legend.data.push(ele.SeriesName);
            chartConfig.series[chartConfig.legend.data.indexOf(ele.SeriesName)] = obj;
          } else {
            chartConfig.series[chartConfig.legend.data.indexOf(ele.SeriesName)].data.push(Score);
          }
          if (chartConfig.xAxis.data.indexOf(ele.CategoryName) <= -1) {
            chartConfig.xAxis.data[counter] = ele.CategoryName;
            counter++;
          }
        }
      });
      this.adDetailsTrendsPptData.push(chartConfig);
      return chartConfig;
    });
    return config;
  }

  callToActionTrends(TopBreak, title, adname): Chart {
    this.getId(adname);
    const config = new Chart({
      SideBreak: [this.calltoActionBrandmaaping[this.variableINdex]],
      TopBreak: [TopBreak],
      Type: ChartTypes.Line,
      Measure: Measure.ColumnPercent
    }, 'Call To Action Trends', ChartProvider.ECharts);
    config.addChartConfigChange((output, chartConfig) => {
      chartConfig.height = '400px';
      chartConfig.width = '600px';
      chartConfig.title.text = title + ' - ' + this.Ad[this.variableINdex] + ' (' + TopBreak + ')';
      chartConfig.title.show = false;
      chartConfig.xAxis.show = true;
      chartConfig.xAxis.splitLine = false;
      chartConfig.grid.containLabel = true;
      chartConfig.grid.width = '70%';
      chartConfig.grid.height = '65%';
      chartConfig.grid.y = '3%';
      chartConfig.series = [];
      chartConfig.legend.data = [];
      let counter = 0;
      chartConfig.xAxis.data = [];
      chartConfig.legend.textStyle = {
        fontSize: 9,
        padding: [0, 25, 0, 0]
      };
      chartConfig.legend.selectorLabel = {
        distance: 10
      };
      chartConfig.tooltip = {
        trigger: 'axis',
        textStyle: {fontSize: 11},
        align: 'center'
      };
      chartConfig.legend.bottom = '1%';
      output.forEach((ele, i) => {
        const Score = isNaN(ele.Score) ? 0 : ele.Score;
        const obj = {
          data: [Score],
          name: ele.SeriesName,
          type: 'line'
        };
        if (!chartConfig.legend.data.includes(ele.SeriesName)) {
          chartConfig.legend.data.push(ele.SeriesName);
          chartConfig.series[chartConfig.legend.data.indexOf(ele.SeriesName)] = obj;
        } else {
          chartConfig.series[chartConfig.legend.data.indexOf(ele.SeriesName)].data.push(Score);
        }
        if (chartConfig.xAxis.data.indexOf(ele.CategoryName) <= -1) {
          chartConfig.xAxis.data[counter] = ele.CategoryName;
          counter++;
        }
      });
      this.adDetailsTrendsPptData.push(chartConfig);
      return chartConfig;
    });
    return config;
  }

  adRecallTrends(TopBreak, title, adname): Chart {
    this.getId(adname);
    const config = new Chart({
      SideBreak: [this.adRecallBrandmaaping[this.variableINdex]],
      TopBreak: [TopBreak],
      Type: ChartTypes.Line,
      Measure: Measure.ColumnPercent
    }, 'Ad Recall Trends', ChartProvider.ECharts);
    config.showSideBreakOptions(0, [1]);
    config.addChartConfigChange((output, chartConfig) => {
      chartConfig.height = '400px';
      chartConfig.width = '600px';
      chartConfig.title.text = title + ' - ' + this.Ad[this.variableINdex] + ' (' + TopBreak + ')';
      chartConfig.title.show = false;
      chartConfig.xAxis.show = true;
      chartConfig.xAxis.splitLine = false;
      chartConfig.grid.containLabel = true;
      chartConfig.grid.width = '70%';
      chartConfig.grid.height = '65%';
      chartConfig.grid.y = '3%';
      chartConfig.series = [];
      chartConfig.legend.data = [];
      let counter = 0;
      chartConfig.xAxis.data = [];
      chartConfig.legend.textStyle = {
        fontSize: 9,
        padding: [0, 25, 0, 0]
      };
      chartConfig.legend.selectorLabel = {
        distance: 10
      };
      chartConfig.tooltip = {
        trigger: 'axis',
        textStyle: {fontSize: 11},
        align: 'center'
      };
      chartConfig.legend.bottom = '20%';
      output.forEach((ele, i) => {
        const Score = isNaN(ele.Score) ? 0 : ele.Score;
        const obj = {
          data: [Score],
          name: ele.SeriesName,
          type: 'line'
        };
        if (!chartConfig.legend.data.includes(ele.SeriesName)) {
          chartConfig.legend.data.push(ele.SeriesName);
          chartConfig.series[chartConfig.legend.data.indexOf(ele.SeriesName)] = obj;
        } else {
          chartConfig.series[chartConfig.legend.data.indexOf(ele.SeriesName)].data.push(Score);
        }
        if (chartConfig.xAxis.data.indexOf(ele.CategoryName) <= -1) {
          chartConfig.xAxis.data[counter] = ele.CategoryName;
          counter++;
        }
      });
      this.adDetailsTrendsPptData.push(chartConfig);
      return chartConfig;
    });
    return config;
  }

  brandLinkageTrends(TopBreak, title, adname): Chart {
    this.getId(adname);
    const config = new Chart({
      SideBreak: [this.brandRecallQuesMap[this.variableINdex]],
      TopBreak: [TopBreak],
      Type: ChartTypes.Line,
      Measure: Measure.ColumnPercent
    }, 'Brand Linkage Trends', ChartProvider.ECharts);
    config.addChartConfigChange((output, chartConfig) => {
      chartConfig.height = '400px';
      chartConfig.width = '600px';
      chartConfig.title.text = title + ' - ' + this.Ad[this.variableINdex] + ' (' + TopBreak + ')';
      chartConfig.title.show = false;
      chartConfig.xAxis.show = true;
      chartConfig.xAxis.splitLine = false;
      chartConfig.grid.containLabel = true;
      chartConfig.grid.width = '70%';
      chartConfig.grid.height = '65%';
      chartConfig.grid.y = '3%';
      chartConfig.series = [];
      chartConfig.legend.data = [];
      let counter = 0;
      chartConfig.xAxis.data = [];
      chartConfig.legend.textStyle = {
        fontSize: 9,
        padding: [0, 25, 0, 0]
      };
      chartConfig.legend.selectorLabel = {
        distance: 10
      };
      chartConfig.tooltip = {
        trigger: 'axis',
        textStyle: {fontSize: 11},
        align: 'center'
      };
      chartConfig.legend.bottom = '10%';
      output.forEach((ele, i) => {
        const Score = isNaN(ele.Score) ? 0 : ele.Score;
        const obj = {
          data: [Score],
          name: ele.SeriesName,
          type: 'line'
        };
        if (!chartConfig.legend.data.includes(ele.SeriesName)) {
          chartConfig.legend.data.push(ele.SeriesName);
          chartConfig.series[chartConfig.legend.data.indexOf(ele.SeriesName)] = obj;
        } else {
          chartConfig.series[chartConfig.legend.data.indexOf(ele.SeriesName)].data.push(Score);
        }
        if (chartConfig.xAxis.data.indexOf(ele.CategoryName) <= -1) {
          chartConfig.xAxis.data[counter] = ele.CategoryName;
          counter++;
        }
      });
      this.adDetailsTrendsPptData.push(chartConfig);
      return chartConfig;
    });
    return config;
  }

  brandLinkageAdRecalledTrends(TopBreak, title, adname): Chart {
    this.getId(adname);
    const config = new Chart({
      SideBreak: [this.brandRecallQuesMap[this.variableINdex]],
      TopBreak: [TopBreak],
      Type: ChartTypes.Line,
      Measure: Measure.ColumnPercent
    }, 'Brand Linkage AdRecalled Trends', ChartProvider.ECharts);
    config.setSideBreakFilter(this.brandRecallQuesMap[this.variableINdex], this.adRecallBrandmaaping[this.variableINdex],
      [1], FilterCondition.AnyItemSelected);
    config.addChartConfigChange((output, chartConfig) => {
      chartConfig.height = '400px';
      chartConfig.width = '600px';
      chartConfig.title.text = title + ' - ' + this.Ad[this.variableINdex] + ' (' + TopBreak + ')';
      chartConfig.title.show = false;
      chartConfig.xAxis.show = true;
      chartConfig.xAxis.splitLine = false;
      chartConfig.grid.containLabel = true;
      chartConfig.grid.width = '70%';
      chartConfig.grid.height = '65%';
      chartConfig.grid.y = '3%';
      chartConfig.series = [];
      chartConfig.legend.data = [];
      let counter = 0;
      chartConfig.xAxis.data = [];
      chartConfig.legend.textStyle = {
        fontSize: 9,
        padding: [0, 25, 0, 0]
      };
      chartConfig.legend.selectorLabel = {
        distance: 10
      };
      chartConfig.tooltip = {
        trigger: 'axis',
        textStyle: {fontSize: 11},
        align: 'center'
      };
      chartConfig.legend.bottom = '10%';
      output.forEach((ele, i) => {
        const Score = isNaN(ele.Score) ? 0 : ele.Score;
        const obj = {
          data: [Score],
          name: ele.SeriesName,
          type: 'line'
        };
        if (!chartConfig.legend.data.includes(ele.SeriesName)) {
          chartConfig.legend.data.push(ele.SeriesName);
          chartConfig.series[chartConfig.legend.data.indexOf(ele.SeriesName)] = obj;
        } else {
          chartConfig.series[chartConfig.legend.data.indexOf(ele.SeriesName)].data.push(Score);
        }
        if (chartConfig.xAxis.data.indexOf(ele.CategoryName) <= -1) {
          chartConfig.xAxis.data[counter] = ele.CategoryName;
          counter++;
        }
      });
      this.adDetailsTrendsPptData.push(chartConfig);
      return chartConfig;
    });
    return config;
  }

}
