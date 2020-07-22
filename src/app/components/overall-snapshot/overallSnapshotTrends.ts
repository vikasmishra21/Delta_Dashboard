import { Chart } from 'src/app/shell/models/chart';
import { ChartTypes } from 'src/app/shell/enums/chart.types';
import { Measure } from 'src/app/shell/enums/measure';
import { ChartProvider } from 'src/app/shell/enums/chart.provider';
import { FilterCondition } from 'src/app/shell/enums/filter-condition.enum';

export class OverAllSnapshotTrends {

  brandCodes = {
    1: '1',
    2: '2',
    3: '3',
    4: '4',
    5: '5',
    6: '6',
    23: '7',
  };
  variableLegendMapping = {
    unaided: 'Unaided Brand Awareness',
    Allbrands: 'Total Brand (Aided + Unaided) Awareness',
    v468: 'Advertising'
  };
  BrandMapping = {
    1: "Delta",
    2: "American Standard",
    3: "Kohler",
    4: "Moen",
    5: "Peerless",
    6: "Pfister",
    23: "Waterpik"
  };
  private readonly touchpointLegendsMapping = {
    v482: 'TV ad',
    v485: 'Magazine or newspaper ad',
    v486: 'Online banner or video ad',
    v487: 'Social networking site (e.g., Twitter, Facebook)',
    v488: 'Brand' + 's website',
    v491: 'News story on TV, online, or in print',
    v492: 'Online review, article or blog',
    v493: 'Talk with friends, family or co-workers',
    v494: 'Talk with a contractor',
    v495: 'Talk with a worker in a retail store (e.g., Lowes, Home Depot)',
    v496: 'Retail store (e.g., Lowes, Home Depot)',
    v497: 'While online shopping',
    // v483: 'Product was on a TV show [SKIPPED]',
    // v484: 'Brand at a sporting event [SKIPPED]',
    // v489: 'Billboard or outdoor ad [SKIPPED]',
    // v490: 'Radio ad [SKIPPED]'
  };
  private readonly imageryLegendMapping = {
    v558: 'Is a brand I trust',
    v559: 'Has products that are a good value for the money    ',
    v560: 'Is a leader',
    v561: 'Is innovative',
    v562: 'Is creative',
    v563: 'Is a brand you can be proud to own',
    v564: 'Is a brand that plays it safe     ',
    // v565: 'Has a variety of styles and finishes [REMOVED 2017.Q2] [SKIPPED]',
    v566: 'Offers products designed to be practical and functional',
    v567: 'Is a high quality brand',
    v568: 'Is a brand worth paying more for',
    v569: 'Is a reliable, dependable brand    ',
    v570: 'Meets a true need',
    v571: 'Is a respectable brand',
    v572: 'Provides products that are well thought out        ',
    v573: 'Makes a bit of a statement about you',
    v574: 'Tends to have more higher-price products than lower-price products',
    v575: 'Has products you would see in a high-end home     ',
    v576: 'Has designs that are new/up-to-date',
    v1323: 'Provides well designed products at affordable price points',
    v1324: 'Helps my space look good within my budget',
    v1325: 'Is for the budget conscious buyer'
  };

  brandName = {
    1: 'Delta',
    3: 'Kohler',
    4: 'Moen'
  };
  getOverallSnapshotTrendsPptData: Array<any> = new Array<any>();
  constructor() {
    this.getOverallSnapshotTrendsPptData = [];
  }
  /**
   * all pages of snapshot config
   */
  getAwarenessMatrixTrends(TopBreak, SideBreak, title, brandCode,filter): Chart {
    const config = new Chart({
      SideBreak,
      TopBreak: [TopBreak],
      Type: ChartTypes.Line,
      Measure: Measure.ColumnPercent
    }, 'Awareness Matrix Trends', ChartProvider.ECharts);

    config.includeNotAnswered(true);
    config.SideBreak.forEach((value, index) => {
      config.showSideBreakOptions(index, [brandCode]);
    });
    config.addChartConfigChange((output, chartConfig) => {
      chartConfig.height = '400px';
      chartConfig.width = '750px';
      chartConfig.title.text = title + '-' + this.BrandMapping[brandCode] + '-' + TopBreak + '$' +filter;
      chartConfig.title.show = false;
      chartConfig.xAxis.show = true;
      chartConfig.xAxis.splitLine = false;
      chartConfig.grid.containLabel = true;
      chartConfig.grid.width = '70%';
      chartConfig.grid.height = '65%';
      chartConfig.grid.y = '3%';
      chartConfig.series = [];
      chartConfig.legend.data = [];
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
      let counter = 0;
      chartConfig.xAxis.data = [];
      chartConfig.legend.bottom = '2%';
      output.forEach((ele, i) => {
        const Score = isNaN(ele.Score) ? 0 : ele.Score;
        const obj = {
          data: [Score],
          name: this.variableLegendMapping[ele.SeriesVariableID],
          type: 'line'
        };
        if (ele.SeriesName === this.BrandMapping[brandCode]) {
          if (!chartConfig.legend.data.includes(this.variableLegendMapping[ele.SeriesVariableID])) {
            chartConfig.legend.data.push(this.variableLegendMapping[ele.SeriesVariableID]);
            chartConfig.series[chartConfig.legend.data.indexOf(this.variableLegendMapping[ele.SeriesVariableID])] = obj;
          } else {
            chartConfig.series[chartConfig.legend.data.indexOf(this.variableLegendMapping[ele.SeriesVariableID])].data.push(Score);
          }
          if (chartConfig.xAxis.data.indexOf(ele.CategoryName) <= -1) {
            chartConfig.xAxis.data[counter] = ele.CategoryName;
            counter++;
          }
        }
      });
      this.getOverallSnapshotTrendsPptData.push(chartConfig);
      return chartConfig;
    });
    return config;
  }

  getCBRTrends(TopBreak, SideBreak, title, brandCode,filter): Chart {
    const config = new Chart({
      SideBreak,
      TopBreak: [TopBreak],
      Type: ChartTypes.Line,
      Measure: Measure.ColumnPercent
    }, 'CBR Trends', ChartProvider.ECharts);


    config.showSideBreakOptions(0, [1, 2, 3]);
    config.addChartConfigChange((output, chartConfig) => {
      chartConfig.height = '400px';
      chartConfig.width = '750px';
      chartConfig.title.text = title + '-' + this.BrandMapping[brandCode] + '-' + TopBreak + '$' +filter;;
      chartConfig.title.show = false;
      chartConfig.xAxis.show = true;
      chartConfig.xAxis.splitLine = false;
      chartConfig.grid.containLabel = true;
      chartConfig.grid.width = '70%';
      chartConfig.grid.height = '65%';
      chartConfig.grid.y = '3%';
      chartConfig.series = [];
      chartConfig.legend.data = [];
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
      let counter = 0;
      chartConfig.xAxis.data = [];
      chartConfig.legend.bottom = '2%';
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

      this.getOverallSnapshotTrendsPptData.push(chartConfig);
      return chartConfig;
    });
    return config;
  }

  getTouchpointRecall(TopBreak, SideBreak, title, brandCode,filter) {
    let touchpointvar = 1;
    const config = new Chart({
      SideBreak,
      TopBreak: [TopBreak],
      Type: ChartTypes.Line,
      Measure: Measure.ColumnPercent
    },
      'Touchpoint Recall Trends', ChartProvider.ECharts);
    config.SideBreak.forEach((value, index) => {
      if (brandCode === 3) {
        touchpointvar = 2;
      }
      if (brandCode === 4) {
        touchpointvar = 3;
      }
      config.showSideBreakOptions(index, [touchpointvar]);
      config.setSideBreakFilter(value, 'v467', [brandCode], FilterCondition.AnyItemSelected);
    });
    config.includeNotAnswered(true);
    config.addChartConfigChange((output, chartConfig) => {
      chartConfig.height = '510px';
      chartConfig.width = '700px';
      chartConfig.title.text = title + '-' + this.BrandMapping[brandCode] + '-' + TopBreak+ '$' +filter;
      chartConfig.title.show = false;
      chartConfig.xAxis.show = true;
      chartConfig.xAxis.splitLine = false;
      chartConfig.grid.containLabel = true;
      chartConfig.grid.width = '70%';
      chartConfig.grid.height = '55%';
      chartConfig.grid.y = '10%';
      // chartConfig.grid.y2 = '4%';
      chartConfig.series = [];
      chartConfig.legend.data = [];
      chartConfig.legend.bottom = '0%';
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
      let counter = 0;
      chartConfig.xAxis.data = [];
      output.forEach((ele, i) => {
        const Score = isNaN(ele.Score) ? 0 : ele.Score;
        const obj = {
          data: [Score],
          name: this.touchpointLegendsMapping[ele.SeriesVariableID],
          type: 'line'
        };
        if (ele.SeriesName === this.BrandMapping[brandCode]) {
          if (!chartConfig.legend.data.includes(this.touchpointLegendsMapping[ele.SeriesVariableID])) {
            chartConfig.legend.data.push(this.touchpointLegendsMapping[ele.SeriesVariableID]);
            chartConfig.series[chartConfig.legend.data.indexOf(this.touchpointLegendsMapping[ele.SeriesVariableID])] = obj;
          } else {
            chartConfig.series[chartConfig.legend.data.indexOf(this.touchpointLegendsMapping[ele.SeriesVariableID])].data.push(Score);
          }
          if (chartConfig.xAxis.data.indexOf(ele.CategoryName) <= -1) {
            chartConfig.xAxis.data[counter] = ele.CategoryName;
            counter++;
          }
        }
      });
      this.getOverallSnapshotTrendsPptData.push(chartConfig);
      return chartConfig;
    });
    return config;
  }


  getBrandImagery(TopBreak, SideBreak, title, brandCode,filter) {
    const config = new Chart({
      SideBreak,
      TopBreak: [TopBreak],
      Type: ChartTypes.Line,
      Measure: Measure.ColumnPercent
    },
      'Brand Imagery Trends', ChartProvider.ECharts);
    config.SideBreak.forEach((value, index) => {
      config.showSideBreakBase(index, true);
      config.showSideBreakOptions(index, [this.brandCodes[brandCode]]);
      config.setSideBreakFilter(value, 'v467', [brandCode], FilterCondition.AnyItemSelected);
    });
    config.includeNotAnswered(true);
    config.addChartConfigChange((output, chartConfig) => {
      chartConfig.height = '600px';
      chartConfig.width = '600px';
      chartConfig.title.text = title + '-' + this.BrandMapping[brandCode] + '-' + TopBreak+ '$' +filter;
      chartConfig.title.show = false;
      chartConfig.xAxis.show = true;
      chartConfig.xAxis.splitLine = false;
      chartConfig.grid.containLabel = true;
      chartConfig.grid.width = '70%';
      chartConfig.grid.height = '55%';
      chartConfig.grid.y = '5%';
      // chartConfig.grid.y2 = '4%';
      chartConfig.series = [];
      chartConfig.legend.data = [];
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
      let counter = 0;
      chartConfig.xAxis.data = [];
      chartConfig.legend.bottom = '0%';
      output.forEach((ele, i) => {
        const Score = isNaN(ele.Score) ? 0 : ele.Score;
        const obj = {
          data: [Score],
          name: this.imageryLegendMapping[ele.SeriesVariableID],
          type: 'line'
        };
        if (ele.SeriesName !== 'No Answer') {
          if (ele.SeriesName === this.BrandMapping[brandCode]) {
            if (!chartConfig.legend.data.includes(this.imageryLegendMapping[ele.SeriesVariableID])) {
              chartConfig.legend.data.push(this.imageryLegendMapping[ele.SeriesVariableID]);
              chartConfig.series[chartConfig.legend.data.indexOf(this.imageryLegendMapping[ele.SeriesVariableID])] = obj;
            } else {
              chartConfig.series[chartConfig.legend.data.indexOf(this.imageryLegendMapping[ele.SeriesVariableID])].data.push(Score);
            }
            if (chartConfig.xAxis.data.indexOf(ele.CategoryName) <= -1) {
              chartConfig.xAxis.data[counter] = ele.CategoryName;
              counter++;
            }
          }
        }
      });
      this.getOverallSnapshotTrendsPptData.push(chartConfig);
      return chartConfig;
    });
    return config;
  }

}
