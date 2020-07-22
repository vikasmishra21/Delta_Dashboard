import { Chart } from 'src/app/shell/models/chart';
import { ChartTypes } from 'src/app/shell/enums/chart.types';
import { Measure } from 'src/app/shell/enums/measure';
import { ChartProvider } from 'src/app/shell/enums/chart.provider';
import { BreakType } from 'src/app/shell/operators/chart.operators';
import { AssetMappings } from 'src/app/model/asset.mappings';

export class ReasonForRecentPurchaseTrends {

  Category: string;

  reasonForRecentPurchaseTrendsPPTData: Array<any> = new Array<any>();
  constructor(category) {
    this.Category = category;
  }

  BrandNameMapping: any;

  showDataMappingForCategory = {
    Faucet: 'v591', Showerhead: 'v692', Toilet: 'v629'
  };
  topBreakOptionMapping = {
    Faucet: {
      'Delta': 1, 'American Standard': 2, 'Kohler': 3, 'Moen': 4, 'Peerless': 5, 'Pfister': 6, 'Aqua Source': 7, 'Glacier Bay': 8, 'Brizo': 9,
      'Grohe': 10, 'Hansgrohe': 11, 'Toto': 12,
    },

    Toilet: {
      'Delta': 13, 'American Standard': 14, 'Kohler': 15, 'Moen': 16, 'Peerless': 17, 'Pfister': 18, 'Aqua Source': 19, 'Glacier Bay': 20,
      'Briggs': 21, 'Eljer': 22, 'Gerber': 23, 'Jacuzzi': 24, 'Mansfield': 25, 'Sterling': 26, 'Toto': 27, 'Penguin': 28
    },

    Showerhead: {
      'Delta': 29, 'American Standard': 30, 'Kohler': 31, 'Moen': 32, 'Peerless': 33, 'Pfister': 34, 'Aqua Source': 35, 'Glacier Bay': 36,
      'Grohe': 37, 'Hansgrohe': 38, 'Speakman': 39, 'Waterpik': 40, 'Symmons': 41, 'Proflo': 42, 'Oxygenics': 43
    }
  };

  reasonForRPTable(TopBreak, title, codes,filter): Chart {
    let topBreakOption = [];
    this.BrandNameMapping = AssetMappings.brandNameAndCodes;
    if (codes.length > 0) {
      codes.forEach(element => {
        topBreakOption.push(this.topBreakOptionMapping[this.Category][this.BrandNameMapping[element]]);
      });
    }
    const config = new Chart({
      SideBreak: [this.showDataMappingForCategory[this.Category]],
      TopBreak: ['RecentPurchaser'],
      Type: ChartTypes.Line,
      Measure: Measure.ColumnPercent
    }, 'Reason For Recent Purchase Trends', ChartProvider.ECharts);
    if (codes.length > 0 && topBreakOption.length > 0) {
      config.showTopBreakOptions(0, topBreakOption);
    } else {
      config.showTopBreakOptions(0, codes);
    }
    config.for(BreakType.TopBreak).nest(0, [TopBreak]);
    config.addChartConfigChange((output, chartConfig) => {
      chartConfig.height = '500px';
      chartConfig.width = '600px';
      chartConfig.title.text = title + ' (' + TopBreak + ')'+ '$' +filter;
      chartConfig.title.show = false;
      chartConfig.xAxis.show = true;
      chartConfig.xAxis.splitLine = false;
      chartConfig.grid.containLabel = true;
      chartConfig.grid.width = '70%';
      chartConfig.grid.height = '55%';
      chartConfig.grid.y = '4%';
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
        textStyle: {fontSize: 9.5},
        align: 'center'
      };
      let counter = 0;
      chartConfig.xAxis.data = [];
      chartConfig.legend.bottom = '28%';
      output.forEach((ele, i) => {
        const Score = isNaN(ele.Score) ? 0 : ele.Score;
        const brandNameTrends = ele.CategoryTree.split('>')[1].split(' - ')[1];
        if (ele.SeriesName === title) {
          const obj = {
            data: [Score],
            name: brandNameTrends,
            type: 'line'
          };
          if (!chartConfig.legend.data.includes(brandNameTrends)) {
            if (brandNameTrends === 'Pfister') {
              chartConfig.legend.data.push(brandNameTrends);
              chartConfig.series[chartConfig.legend.data.indexOf(brandNameTrends)] = obj;
              chartConfig.series[chartConfig.legend.data.indexOf(brandNameTrends)].data.push(null);
            } else {
              chartConfig.legend.data.push(brandNameTrends);
              chartConfig.series[chartConfig.legend.data.indexOf(brandNameTrends)] = obj;
            }
          } else {
            chartConfig.series[chartConfig.legend.data.indexOf(brandNameTrends)].data.push(Score);
          }
          if (chartConfig.xAxis.data.indexOf(ele.CategoryName) <= -1) {
            chartConfig.xAxis.data[counter] = ele.CategoryName;
            counter++;
          }
        }
      });
      this.reasonForRecentPurchaseTrendsPPTData.push(chartConfig);
      return chartConfig;
    });
    return config;
  }
}
