import { Chart } from 'src/app/shell/models/chart';

import { ChartTypes } from 'src/app/shell/enums/chart.types';
import { Measure } from 'src/app/shell/enums/measure';
import { ChartProvider } from 'src/app/shell/enums/chart.provider';
import { RoundOffStrategy } from 'src/app/shell/enums/round.off.strategy';
import { BreakType } from 'src/app/shell/operators/chart.operators';
import { AssetMappings } from 'src/app/model/asset.mappings';

export class ReasonForRetailerTrends {

  Category: string;

  private readonly variableMappingForCharts = {
    retailersData: { Faucet: 'v628', Showerhead: 'v753', Toilet: 'v691', TubShowerUnit: '' },
    topBreakVariable: { Faucet: 'v822', Showerhead: 'v1059', Toilet: 'v852', TubShowerUnit: '' }
  };

  retailersTrendsPPTData: Array<any> = new Array<any>();
  constructor(category) {
    this.Category = category;
  }

  retailersTable(TopBreak, title, code,filter): Chart {
    const sideBreakvariable = this.variableMappingForCharts['retailersData'][this.Category];
    const topBreakVariable = this.variableMappingForCharts['topBreakVariable'][this.Category];
    const config = new Chart({
      SideBreak: [sideBreakvariable],
      TopBreak: [topBreakVariable],
      Type: ChartTypes.Line,
      Measure: Measure.ColumnPercent
    }, 'Reason For Retailer Trends', ChartProvider.ECharts);
    config.showTopBreakOptions(0, [parseInt(code)]);
    config.for(BreakType.TopBreak).nest(0, [TopBreak]);
    config.addChartConfigChange((output, chartConfig) => {
      chartConfig.height = '400px';
      chartConfig.width = '600px';
      chartConfig.title.text = title + ' (' + TopBreak + ')'+ '$' +filter;
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
      chartConfig.legend.bottom = '-1%';
      output.forEach((ele, i) => {
        const retailerId = ele.NestedCategoryMap.split('>')[0].split(':')[1];
        if (retailerId === code && (ele.SeriesName !== 'Other reason' && ele.SeriesName !== "Don't know")) {
          const Score = isNaN(ele.Score) ? 0 : ele.Score;
          const legendName = AssetMappings.retailersList[ele.NestedCategoryMap.split('>')[0].split(':')[1]];
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
      this.retailersTrendsPPTData.push(chartConfig);
      return chartConfig;
    });
    return config;
  }
}
