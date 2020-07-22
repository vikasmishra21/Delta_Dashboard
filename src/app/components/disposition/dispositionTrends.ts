import { Chart } from 'src/app/shell/models/chart';
import { ChartTypes } from 'src/app/shell/enums/chart.types';
import { Measure } from 'src/app/shell/enums/measure';
import { ChartProvider } from 'src/app/shell/enums/chart.provider';
import { BreakType, show } from 'src/app/shell/operators/chart.operators';

export class DispositionTrends {

  private readonly variableMappingForCharts = {
    topBreakVariable: { Faucet: 'v595', Showerhead: 'v695', Toilet: 'v632', TubShowerUnit: '' },
    influenceSideCode: { Faucet: 'v627', Showerhead: 'v752', Toilet: 'v690', TubShowerUnit: '' },
    installedSideCode: { Faucet: 'v621', Showerhead: 'v744', Toilet: 'v684', TubShowerUnit: '' },
    purchasePrice: { Faucet: 'fau_Price', Showerhead: 'shd_Price', Toilet: 'toi_Price', TubShowerUnit: '' },
    purchaseAverage: { Faucet: 'v624', Showerhead: 'v748', Toilet: 'v687', TubShowerUnit: '' },

    whereBought: { Faucet: 'v822', Showerhead: 'v1059', Toilet: 'v852', TubShowerUnit: '' },
    whereBoughtOption: {
      Faucet: ['v823', 'v824', 'v825', 'v826', 'v827', 'v828', 'v829', 'v830', 'v831', 'v832', 'v833', 'v834'],
      Showerhead: ['v1060', 'v1061', 'v1062', 'v1063', 'v1064', 'v1065', 'v1066', 'v1067', 'v1068', 'v1069', 'v1070', 'v1071'],
      Toilet: ['v924', 'v925', 'v926', 'v927', 'v928', 'v929', 'v930', 'v931', 'v932', 'v933', 'v934', 'v935']
    },
    whereShopped: { Faucet: 'v786', Showerhead: 'v1214', Toilet: 'v870', TubShowerUnit: '' },
    whereShoppedOption: {
      Faucet: ['v787', 'v788', 'v789', 'v790', 'v791', 'v792', 'v793', 'v794', 'v795', 'v796', 'v797', 'v798', 'v799', 'v800', 'v801', 'v802', 'v803'],
      Showerhead: ['v1024', 'v1025', 'v1026', 'v1027', 'v1028', 'v1029', 'v1030', 'v1031', 'v1032', 'v1033', 'v1034', 'v1035', 'v1036', 'v1037', 'v1038', 'v1039', 'v1040'],
      Toilet: ['v871', 'v872', 'v873', 'v874', 'v875', 'v876', 'v877', 'v878', 'v879', 'v880', 'v881', 'v882', 'v883', 'v884', 'v885', 'v886', 'v887']
    },
    totalShopped: { Faucet: 'RECENT_FAU13b_NEW_CAT_total1', Showerhead: 'RECENT_SHD13b_NEW_CAT_total1', Toilet: 'RECENT_TOI13b_NEW_CAT_total1', TubShowerUnit: '' },
    totalBought: { Faucet: 'RECENT_FAU13d_NEW_CAT_total1', Showerhead: 'RECENT_SHD13d_NEW_CAT_total1', Toilet: 'RECENT_TOI13d_NEW_CAT_total1', TubShowerUnit: '' },

    reasonForCategoryChoice: { Faucet: 'v622', Showerhead: 'v745', Toilet: 'v685', TubShowerUnit: '' }
  };

  whoInfluencedTrendsPptData: Array<any> = new Array<any>();
  whoInstalledTrendsPptData: Array<any> = new Array<any>();
  purchasePriceTrendsPptData: Array<any> = new Array<any>();
  reasonBrandChoiceTrendsPptData: Array<any> = new Array<any>();
  constructor() { }

  getWhoInfluenced(TopBreak, title, category, selectedCode,filter): Chart {
    const sideBreakVariable = this.variableMappingForCharts['influenceSideCode'][category];
    const topBreakVariable = this.variableMappingForCharts['topBreakVariable'][category];
    const config = new Chart({
      SideBreak: [sideBreakVariable],
      TopBreak: [topBreakVariable],
      Type: ChartTypes.Line,
      Measure: Measure.ColumnPercent
    }, 'Who Influenced Trends', ChartProvider.ECharts);
    config.showTopBreakOptions(0, [parseInt(selectedCode)]);
    config.showSideBreakBase(0, true);
    // config.addShowAllSeries(true);
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
      chartConfig.legend.bottom = '15%';
      output.forEach((ele, i) => {
        const Score = isNaN(ele.Score) ? 0 : ele.Score;
        if (ele.SeriesName !== "Don't know" && ele.NestedCategoryMap.split('>')[0].split(':')[1] === selectedCode) {
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
      this.whoInfluencedTrendsPptData.push(chartConfig);
      return chartConfig;
    });
    return config;
  }

  getWhoInstalled(TopBreak, title, category, selectedCode,filter): Chart {
    const sideBreakVariable = this.variableMappingForCharts['installedSideCode'][category];
    const topBreakVariable = this.variableMappingForCharts['topBreakVariable'][category];
    const config = new Chart({
      SideBreak: [sideBreakVariable],
      TopBreak: [topBreakVariable],
      Type: ChartTypes.Line,
      Measure: Measure.ColumnPercent
    }, 'Who Installed Trends', ChartProvider.ECharts);
    config.showTopBreakOptions(0, [parseInt(selectedCode)]);
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
      chartConfig.legend.bottom = '15%';
      output.forEach((ele, i) => {
        const Score = isNaN(ele.Score) ? 0 : ele.Score;
        if (ele.SeriesName !== 'Other' && ele.NestedCategoryMap.split('>')[0].split(':')[1] === selectedCode) {
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
      this.whoInstalledTrendsPptData.push(chartConfig);
      return chartConfig;
    });
    return config;
  }

  getPurchasePrice(TopBreak, title, category, selectedCode,filter): Chart {
    const sideBreakVariable = this.variableMappingForCharts['purchasePrice'][category];
    const topBreakVariable = this.variableMappingForCharts['topBreakVariable'][category];
    const config = new Chart({
      SideBreak: [sideBreakVariable],
      TopBreak: [topBreakVariable],
      Type: ChartTypes.Line,
      Measure: Measure.ColumnPercent
    }, 'Who Installed Trends', ChartProvider.ECharts);
    config.showTopBreakOptions(0, [parseInt(selectedCode)]);
    config.showSideBreakOptions(0, [1, 2, 3, 4, 5, 6, 7, 8, 9]);
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
      chartConfig.legend.bottom = '10%';
      output.forEach((ele, i) => {
        const Score = isNaN(ele.Score) ? 0 : ele.Score;
        if (ele.NestedCategoryMap.split('>')[0].split(':')[1] === selectedCode) {
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
      this.purchasePriceTrendsPptData.push(chartConfig);
      return chartConfig;
    });
    return config;
  }

  getReasonBrandChoice(TopBreak, title, category, selectedCode,filter): Chart {
    const sideBreakVariable = this.variableMappingForCharts['reasonForCategoryChoice'][category];
    const topBreakVariable = this.variableMappingForCharts['topBreakVariable'][category];
    const config = new Chart({
      SideBreak: [sideBreakVariable],
      TopBreak: [topBreakVariable],
      Type: ChartTypes.Line,
      Measure: Measure.ColumnPercent
    }, 'Who Installed Trends', ChartProvider.ECharts);
    config.showTopBreakOptions(0, [parseInt(selectedCode)]);
    config.for(BreakType.TopBreak).nest(0, [TopBreak]);
    config.addChartConfigChange((output, chartConfig) => {
      chartConfig.height = '400px';
      chartConfig.width = '630px';
      chartConfig.title.text = title + ' (' + TopBreak + ')'+ '$' +filter;
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
      chartConfig.legend.bottom = '5%';
      output.forEach((ele, i) => {
        const Score = isNaN(ele.Score) ? 0 : ele.Score;
        if ((ele.SeriesName !== 'Other reason [O]' && ele.SeriesName !== "No reason / don’t know") && ele.NestedCategoryMap.split('>')[0].split(':')[1] === selectedCode) {
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
      this.reasonBrandChoiceTrendsPptData.push(chartConfig);
      return chartConfig;
    });
    return config;
  }
}
