import { Chart } from 'src/app/shell/models/chart';
import { ChartTypes } from 'src/app/shell/enums/chart.types';
import { Measure } from 'src/app/shell/enums/measure';
import { ChartProvider } from 'src/app/shell/enums/chart.provider';
import { AssetMappings } from 'src/app/model/asset.mappings';

export class RecommandationT3BTrends {

  Category: string;
  Brandlist: string[];
  BrandMapping = AssetMappings.brandNameAndCodes;
  sideBreakOptions: Array<any> = new Array<any>();

  RecommandationT3BSideBreakMapping = {
    Faucet: { 'Delta': 'v587', 'American Standard': 'v609', 'Kohler': 'v610', 'Moen': 'v611', 'Peerless': 'v612', 'Pfister': 'v613', 'Aqua Source': 'v614', 'Glacier Bay': 'v615', 'Brizo': 'v616', 'Grohe': 'v617', 'Hansgrohe': 'v618', 'Toto': 'v619' },
    Showerhead: { 'Delta': 'v727', 'American Standard': 'v728', 'Kohler': 'v729', 'Moen': 'v730', 'Peerless': 'v731', 'Pfister': 'v732', 'Aqua Source': 'v733', 'Glacier Bay': 'v734', 'Grohe': 'v735', 'Hansgrohe': 'v736', 'Speakman': 'v737', 'Waterpik': 'v738', 'Symmons': 'v739', 'Proflo': 'v740', 'Oxygenics': 'v741' },
    Toilet: { 'Delta': 'v667', 'American Standard': 'v668', 'Kohler': 'v669', 'Moen': 'v670', 'Peerless': 'v671', 'Pfister': 'v672', 'Aqua Source': 'v673', 'Glacier Bay': 'v674', 'Briggs': 'v675', 'Eljer': 'v676', 'Gerber': 'v677', 'Jacuzzi': 'v678', 'Mansfield': 'v679', 'Sterling': 'v680', 'Toto': 'v681', 'Penguin': 'v682' }
  };

  recommandationT3BTrendsPPTData: Array<any> = new Array<any>();
  constructor(category) {
    this.Category = category;
    this.Brandlist = [];
  }

  RecommandationT3B(TopBreak, title, codes): Chart {
    this.Brandlist = [];
    codes.forEach(element => {
      this.Brandlist.push(this.BrandMapping[parseInt(element)]);
    });
    this.Brandlist.forEach(element => {
      this.sideBreakOptions.push(this.RecommandationT3BSideBreakMapping[this.Category][element]);
    });

    const config = new Chart({
      SideBreak: this.sideBreakOptions,
      TopBreak: [TopBreak],
      Type: ChartTypes.Line,
      Measure: Measure.ColumnPercent
    }, 'RecommandationT3B Trends', ChartProvider.ECharts);
    this.sideBreakOptions.forEach((val, i) => {
      config.combineSideBreakOptions(val, [8, 9, 10], 'combineRecommandationT3B');
      config.showSideBreakOptions(i, [100001]);
    });
    config.addChartConfigChange((output, chartConfig) => {
      chartConfig.height = '550px';
      chartConfig.width = '600px';
      chartConfig.title.text = title + ' (' + TopBreak + ')';
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
      chartConfig.legend.bottom = '20%';
      output.forEach((ele, i) => {
        this.Brandlist.forEach(element => {
          if (ele.SeriesName === 'combineRecommandationT3B' && ele.SeriesTree.split('>')[0] === element) {
            const Score = isNaN(ele.Score) ? 0 : ele.Score;
            const legendName = ele.SeriesTree.split('>')[0];
            const obj = {
              data: [Score],
              name: legendName,
              type: 'line'
            };
            if (!chartConfig.legend.data.includes(legendName)) {
              chartConfig.legend.data.push(legendName);
              chartConfig.series[chartConfig.legend.data.indexOf(legendName)] = obj;
            } else {
              chartConfig.series[chartConfig.legend.data.indexOf(legendName)].data.push(Score);
            }
            if (chartConfig.xAxis.data.indexOf(ele.CategoryName) <= -1) {
              chartConfig.xAxis.data[counter] = ele.CategoryName;
              counter++;
            }
          }
        });
      });
      this.recommandationT3BTrendsPPTData.push(chartConfig);
      return chartConfig;
    });
    return config;
  }
}
