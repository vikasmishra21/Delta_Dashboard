import { Chart } from 'src/app/shell/models/chart';
import { ChartTypes } from 'src/app/shell/enums/chart.types';
import { Measure } from 'src/app/shell/enums/measure';
import { ChartProvider } from 'src/app/shell/enums/chart.provider';


export class OverallBrandHealthTrends {

  relationshipBrand = {
    'RelationshipDelta': 'Delta',
    'RelationshipMoen': 'Moen',
    'RelationshipKohler': 'Kohler',
    'RelationshipPeerless': 'Peerless',
    'RelationshipAmerican': 'American Standard',
    'RelationshipPfister': 'Pfister',
    'RelationshipWaterpik': 'Waterpik',
    'RelationshipAqua': 'Aqua',
    'RelationshipGlaicer': 'Glaicer'
  };

  private readonly consumerBrandVariableMapping = {
    1: 'RelationshipDelta',
    2: 'RelationshipAmerican',
    3: 'RelationshipKohler',
    4: 'RelationshipMoen',
    5: 'RelationshipPeerless',
    6: 'RelationshipPfister',
    23: 'RelationshipWaterpik',
    7: 'RelationshipAqua',
    8: 'RelationshipGlaicer'
  };

  sideBrake: Array<any> = new Array<any>();
  overallBrandHealthTrendsPPTData: Array<any> = new Array<any>();
  constructor() {}

  getUnaided(TopBreak, title, codes,filter): Chart {
    const config = new Chart({
      SideBreak: ['unaided'],
      TopBreak: [TopBreak],
      Type: ChartTypes.Line,
      Measure: Measure.ColumnPercent
    }, 'Unaided Brand Trends', ChartProvider.ECharts);
    config.showSideBreakOptions(0, codes);
    config.includeNotAnswered(true);
    // config.addShowAllSeries(true);
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
      chartConfig.legend.bottom = '2%';
      let counter = 0;
      chartConfig.xAxis.data = [];
      output.forEach((ele, i) => {
        const Score = isNaN(ele.Score) ? 0 : ele.Score;
        const obj = {
          data: [Score],
          name: ele.SeriesName,
          type: 'line'
        };
        if (ele.SeriesName !== 'No Answer') {
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
      this.overallBrandHealthTrendsPPTData.push(chartConfig);
      return chartConfig;
    });
    return config;
  }

  getTotalBrand(TopBreak, title, codes,filter): Chart {
    //Allbrands
    const config = new Chart({
      SideBreak: ['TotalAwarenessAllbrands'],
      TopBreak: [TopBreak],
      Type: ChartTypes.Line,
      Measure: Measure.ColumnPercent
    }, 'Total Brand(Aided + Unaided) Trends', ChartProvider.ECharts);
    config.showSideBreakOptions(0, codes);
    config.includeNotAnswered(true);
    // config.addShowAllSeries(true);
    config.addChartConfigChange((output, chartConfig) => {
      chartConfig.height = '400px';
      chartConfig.width = '650px';
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
      chartConfig.legend.bottom = '2%';
      let counter = 0;
      chartConfig.xAxis.data = [];
      output.forEach((ele, i) => {
        const Score = isNaN(ele.Score) ? 0 : ele.Score;
        const obj = {
          data: [Score],
          name: ele.SeriesName,
          type: 'line'
        };
        if (ele.SeriesName !== 'No Answer') {
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
      this.overallBrandHealthTrendsPPTData.push(chartConfig);
      return chartConfig;
    });
    return config;
  }

  getAdvertising(TopBreak, title, codes,filter): Chart {
    const config = new Chart({
      SideBreak: ['v468'],
      TopBreak: [TopBreak],
      Type: ChartTypes.Line,
      Measure: Measure.ColumnPercent
    }, 'Advertising Trends', ChartProvider.ECharts);
    config.showSideBreakOptions(0, codes);
    config.includeNotAnswered(true);
    // config.addShowAllSeries(true);
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
      chartConfig.legend.bottom = '2%';
      let counter = 0;
      chartConfig.xAxis.data = [];
      output.forEach((ele, i) => {
        const Score = isNaN(ele.Score) ? 0 : ele.Score;
        const obj = {
          data: [Score],
          name: ele.SeriesName,
          type: 'line'
        };
        if (ele.SeriesName !== 'No Answer') {
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
      this.overallBrandHealthTrendsPPTData.push(chartConfig);
      return chartConfig;
    });
    return config;
  }

  getStrongCustomerBrandRelationship(TopBreak, title, codes,filter): Chart {
    this.sideBrake = [];
    for (let index = 0; index < codes.length; index++) {
      if (this.consumerBrandVariableMapping[codes[index]] !== undefined) {
        this.sideBrake.push(this.consumerBrandVariableMapping[codes[index]]);
      }
    }
    const config = new Chart({
      SideBreak: this.sideBrake,
      TopBreak: [TopBreak],
      Type: ChartTypes.Line,
      Measure: Measure.ColumnPercent
    }, 'StrongRelationShip Trends', ChartProvider.ECharts);
    config.showSideBreakOptions(0, [1, 2, 3]);
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
      chartConfig.legend.bottom = '2%';
      let counter = 0;
      chartConfig.xAxis.data = [];
      output.forEach((ele, i) => {
        const Score = isNaN(ele.Score) ? 0 : ele.Score;
        const obj = {
          data: [Score],
          name: this.relationshipBrand[ele.SeriesVariableID],
          type: 'line'
        };
        if (ele.SeriesName === 'STRONG (NET)') {
          if (!chartConfig.legend.data.includes(this.relationshipBrand[ele.SeriesVariableID])) {
            chartConfig.legend.data.push(this.relationshipBrand[ele.SeriesVariableID]);
            chartConfig.series[chartConfig.legend.data.indexOf(this.relationshipBrand[ele.SeriesVariableID])] = obj;
          } else {
            chartConfig.series[chartConfig.legend.data.indexOf(this.relationshipBrand[ele.SeriesVariableID])].data.push(Score);
          }
          if (chartConfig.xAxis.data.indexOf(ele.CategoryName) <= -1) {
            chartConfig.xAxis.data[counter] = ele.CategoryName;
            counter++;
          }
        }
      });
      this.overallBrandHealthTrendsPPTData.push(chartConfig);
      return chartConfig;
    });
    return config;
  }

  getWeakCustomerBrandRelationship(TopBreak, title, codes,filter): Chart {
    this.sideBrake = [];
    for (let index = 0; index < codes.length; index++) {
      if (this.consumerBrandVariableMapping[codes[index]] !== undefined) {
        this.sideBrake.push(this.consumerBrandVariableMapping[codes[index]]);
      }
    }
    const config = new Chart({
      SideBreak: this.sideBrake,
      TopBreak: [TopBreak],
      Type: ChartTypes.Line,
      Measure: Measure.ColumnPercent
    }, 'WeakRelationShip Trends', ChartProvider.ECharts);
    config.showSideBreakOptions(0, [1, 2, 3]);
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
      chartConfig.legend.bottom = '2%';
      let counter = 0;
      chartConfig.xAxis.data = [];
      output.forEach((ele, i) => {
        const Score = isNaN(ele.Score) ? 0 : ele.Score;
        const obj = {
          data: [Score],
          name: this.relationshipBrand[ele.SeriesVariableID],
          type: 'line'
        };
        if (ele.SeriesName === 'Weak (NET)') {
          if (!chartConfig.legend.data.includes(this.relationshipBrand[ele.SeriesVariableID])) {
            chartConfig.legend.data.push(this.relationshipBrand[ele.SeriesVariableID]);
            chartConfig.series[chartConfig.legend.data.indexOf(this.relationshipBrand[ele.SeriesVariableID])] = obj;
          } else {
            chartConfig.series[chartConfig.legend.data.indexOf(this.relationshipBrand[ele.SeriesVariableID])].data.push(Score);
          }
          if (chartConfig.xAxis.data.indexOf(ele.CategoryName) <= -1) {
            chartConfig.xAxis.data[counter] = ele.CategoryName;
            counter++;
          }
        }
      });
      this.overallBrandHealthTrendsPPTData.push(chartConfig);
      return chartConfig;
    });
    return config;
  }

  getRiskCustomerBrandRelationship(TopBreak, title, codes,filter): Chart {
    this.sideBrake = [];
    for (let index = 0; index < codes.length; index++) {
      if (this.consumerBrandVariableMapping[codes[index]] !== undefined) {
        this.sideBrake.push(this.consumerBrandVariableMapping[codes[index]]);
      }
    }
    const config = new Chart({
      SideBreak: this.sideBrake,
      TopBreak: [TopBreak],
      Type: ChartTypes.Line,
      Measure: Measure.ColumnPercent
    }, 'RiskRelationShip Trends', ChartProvider.ECharts);
    config.showSideBreakOptions(0, [1, 2, 3]);
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
      chartConfig.legend.bottom = '2%';
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
      output.forEach((ele, i) => {
        const Score = isNaN(ele.Score) ? 0 : ele.Score;
        const obj = {
          data: [Score],
          name: this.relationshipBrand[ele.SeriesVariableID],
          type: 'line'
        };
        if (ele.SeriesName === 'At Risk (NET)') {
          if (!chartConfig.legend.data.includes(this.relationshipBrand[ele.SeriesVariableID])) {
            chartConfig.legend.data.push(this.relationshipBrand[ele.SeriesVariableID]);
            chartConfig.series[chartConfig.legend.data.indexOf(this.relationshipBrand[ele.SeriesVariableID])] = obj;
          } else {
            chartConfig.series[chartConfig.legend.data.indexOf(this.relationshipBrand[ele.SeriesVariableID])].data.push(Score);
          }
          if (chartConfig.xAxis.data.indexOf(ele.CategoryName) <= -1) {
            chartConfig.xAxis.data[counter] = ele.CategoryName;
            counter++;
          }
        }
      });
      this.overallBrandHealthTrendsPPTData.push(chartConfig);
      return chartConfig;
    });
    return config;
  }
}
