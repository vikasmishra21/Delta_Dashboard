import { Chart } from 'src/app/shell/models/chart';
import { ChartTypes } from 'src/app/shell/enums/chart.types';
import { Measure } from 'src/app/shell/enums/measure';
import { ChartProvider } from 'src/app/shell/enums/chart.provider';
import { FilterCondition } from 'src/app/shell/enums/filter-condition.enum';

export class TouchPointRecallTrends {

  private readonly MAPPING = {
    v482: "TV ad",
    v485: "Magazine or newspaper ad",
    v486: "Online banner or video ad",
    v487: "Social networking site ",
    v488: "Brand's website",
    v491: "News story on TV, online, or in print",
    v492: "Online review, article or blog",
    v493: "Talk with friends, family or co-workers",
    v494: "Talk with a contractor",
    v495: "Talk with a worker in a retail store",
    v496: "Retail store",
    v497: "While online shopping",
  };
  private readonly MAPPINGNO = {
    v482: 0,
    v485: 1,
    v486: 2,
    v487: 3,
    v488: 4,
    v491: 5,
    v492: 6,
    v493: 7,
    v494: 8,
    v495: 9,
    v496: 10,
    v497: 11,
  };
  brandCodes = {
    1: '1',
    3: '2',
    4: '3'
  };
  brandName = {
    1: 'Delta',
    3: 'Kohler',
    4: 'Moen'
  };
  touchPointRecallTrendsPptData: Array<any> = new Array<any>();
  constructor() { }

  getTouchPointRecallData(TopBreak, title, brandCode,filter): Chart {
    const config = new Chart({
      SideBreak: ['v482', 'v485', 'v486', 'v487', 'v488', 'v491', 'v492', 'v493', 'v494', 'v495', 'v496', 'v497'],
      TopBreak: [TopBreak],
      Type: ChartTypes.Line,
      Measure: Measure.ColumnPercent
    }, 'Touchpoint Recall Trends', ChartProvider.ECharts);
    config.transposeTable(true);
    config.includeNotAnswered(true);
    config.addRowColumnFields('SeriesName', 'CategoryName');
    config.SideBreak.forEach((value, index) => {
      config.showSideBreakOptions(index, [this.brandCodes[brandCode]]);
      config.setSideBreakFilter(value, 'v467', [brandCode], FilterCondition.AnyItemSelected);
    });
    config.addChartConfigChange((output, chartConfig) => {
      chartConfig.height = '550px';
      chartConfig.width = '600px';
      chartConfig.title.text = title + ' - ' + this.brandName[brandCode] + ' (' + TopBreak + ')'+ '$' +filter;
      chartConfig.title.show = false;
      chartConfig.xAxis.show = true;
      chartConfig.xAxis.splitLine = false;
      chartConfig.grid.containLabel = true;
      chartConfig.grid.width = '70%';
      chartConfig.grid.height = '65%';
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
      chartConfig.legend.bottom = '-1%';
      output.forEach((ele, i) => {
        const Score = isNaN(ele.Score) ? 0 : ele.Score;
        const obj = {
          data: [Score],
          name: this.MAPPING[ele.SeriesVariableID],
          type: 'line'
        };
        if (ele.SeriesName !== 'No Answer') {
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
        }
      });
      this.touchPointRecallTrendsPptData.push(chartConfig);
      return chartConfig;
    });
    return config;
  }
}
