import { ChartTypes } from 'src/app/shell/enums/chart.types';
import { Measure } from 'src/app/shell/enums/measure';
import { ChartProvider } from 'src/app/shell/enums/chart.provider';
import { Chart } from 'src/app/shell/models/chart';
import { FilterCondition } from 'src/app/shell/enums/filter-condition.enum';

export class BrandPerceptionTrends {

  private readonly MAPPING = {
    v558: 'Is a brand I trust',
    v559: 'Has products that are a good value for the money',
    v560: 'Is a leader',
    v561: 'Is innovative',
    v562: 'Is creative',
    v563: 'Is a brand you can be proud to own',
    v564: 'Is a brand that plays it safe',
    // v565: 'Has a variety of styles and finishes [REMOVED 2017.Q2] [SKIPPED]',
    v566: 'Offers products designed to be practical and functional',
    v567: 'Is a high quality brand',
    v568: 'Is a brand worth paying more for',
    v569: 'Is a reliable, dependable brand',
    v570: 'Meets a true need',
    v571: 'Is a respectable brand',
    v572: 'Provides products that are well thought out',
    v573: 'Makes a bit of a statement about you',
    v574: 'Tends to have more higher-price products than lower-price products',
    v575: 'Has products you would see in a high-end home',
    v576: 'Has designs that are new / up-to-date',
    v1323: 'Provides well designed products at affordable price points',
    v1324: 'Helps my space look good within my budget',
    v1325: 'Is for the budget conscious buyer'
  };

  brandCodes = {
    1: '1',
    2: '2',
    3: '3',
    4: '4',
    5: '5',
    6: '6',
    23: '7',
  };
  brandName = {
    1: 'Delta',
    2: 'American Stand',
    3: 'Kohler',
    4: 'Moen',
    5: 'Peerless',
    6: 'Pfister',
    23: 'Waterpik',
  };
  brandPerceptionTrendsPptData: Array<any> = new Array<any>();
  constructor() {
  }

  getbrandPerceptionData(TopBreak, title, brandCode,filter): Chart {
    const config = new Chart({
      SideBreak: ['v558', 'v559', 'v560', 'v561', 'v562', 'v563', 'v564', 'v566', 'v567', 'v568', 'v569', 'v570',
        'v571', 'v572', 'v573', 'v574', 'v575', 'v576', 'v1323', 'v1324', 'v1325'],
      TopBreak: [TopBreak],
      Type: ChartTypes.Line,
      Measure: Measure.ColumnPercent
    }, 'Brand Perception', ChartProvider.ECharts);
    config.transposeTable(true);
    config.includeNotAnswered(false);
    config.addRowColumnFields('SeriesName', 'CategoryName');
    config.SideBreak.forEach((value, index) => {
      config.showSideBreakOptions(index, [this.brandCodes[brandCode]]);
      config.setSideBreakFilter(value, 'v467', [brandCode], FilterCondition.AnyItemSelected);
    });
    config.addChartConfigChange((output, chartConfig) => {
      chartConfig.height = '550px';
      chartConfig.width = '650px';
      chartConfig.title.text = title + ' - ' + this.brandName[brandCode] + ' (' + TopBreak + ')'+ '$' +filter;
      chartConfig.title.show = false;
      chartConfig.xAxis.show = true;
      chartConfig.xAxis.splitLine = false;
      chartConfig.grid.containLabel = true;
      chartConfig.grid.width = '70%';
      chartConfig.grid.height = '55%';
      chartConfig.grid.y = '5%';
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
          name: this.MAPPING[ele.SeriesVariableID],
          type: 'line'
        };
        if (!chartConfig.legend.data.includes(this.MAPPING[ele.SeriesVariableID])) {
          chartConfig.legend.data.push(this.MAPPING[ele.SeriesVariableID]);
          chartConfig.series[chartConfig.legend.data.indexOf(this.MAPPING[ele.SeriesVariableID])] = obj;
        } else {
          chartConfig.series[chartConfig.legend.data.indexOf(this.MAPPING[ele.SeriesVariableID])].data.push(Score);
        }
        if (chartConfig.xAxis.data.indexOf(ele.CategoryName) <= -1) {
          chartConfig.xAxis.data[counter] = ele.CategoryName;
          counter++;
        }
      });
      this.brandPerceptionTrendsPptData.push(chartConfig);
      return chartConfig;
    });
    return config;
  }
}
