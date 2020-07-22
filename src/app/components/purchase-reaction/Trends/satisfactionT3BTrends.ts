import { Chart } from 'src/app/shell/models/chart';
import { AssetMappings } from 'src/app/model/asset.mappings';
import { ChartTypes } from 'src/app/shell/enums/chart.types';
import { Measure } from 'src/app/shell/enums/measure';
import { ChartProvider } from 'src/app/shell/enums/chart.provider';

export class SatisfactionT3Btrends {

  Category: string;
  Brandlist: string[];
  BrandMapping = AssetMappings.brandNameAndCodes;
  sideBreakOptions: Array<any> = new Array<any>();

  SatisfactionT3BSideBreakMapping = {
    'Faucet': { 'Delta': 'v597', 'American Standard': 'v598', 'Kohler': 'v599', 'Moen': 'v600', 'Peerless': 'v601', 'Pfister': 'v602', 'Aqua Source': 'v603', 'Glacier Bay': 'v604', 'Brizo': 'v605', 'Grohe': 'v606', 'Hansgrohe': 'v607', 'Toto': 'v608' },
    'Showerhead': { 'Delta': 'v697', 'American Standard': 'v698', 'Kohler': 'v699', 'Moen': 'v700', 'Peerless': 'v701', 'Pfister': 'v702', 'Aqua Source': 'v703', 'Glacier Bay': 'v704', 'Grohe': 'v705', 'Hansgrohe': 'v706', 'Speakman': 'v707', 'Waterpik': 'v708', 'Symmons': 'v709', 'Proflo': 'v710', 'Oxygenics': 'v711' },
    'Toilet': { 'Delta': 'v635', 'American Standard': 'v636', 'Kohler': 'v637', 'Moen': 'v638', 'Peerless': 'v639', 'Pfister': 'v640', 'AquaSource': 'v641', 'GlacierBay': 'v642', 'Briggs': 'v643', 'Eljer': 'v644', 'Gerber': 'v645', 'Jacuzzi': 'v646', 'Mansfield': 'v647', 'Sterling': 'v648', 'Toto': 'v649', 'Penguin': 'v650' }
  };

  satisfactionT3BTrendsPPTData: Array<any> = new Array<any>();
  constructor(category) {
    this.Category = category;
    this.Brandlist = [];
  }

  SatisfactionT3B(TopBreak, title, codes): Chart {
    this.Brandlist = [];
    codes.forEach(element => {
      this.Brandlist.push(this.BrandMapping[parseInt(element)]);
    });
    this.Brandlist.forEach(element => {
      this.sideBreakOptions.push(this.SatisfactionT3BSideBreakMapping[this.Category][element]);
    });

    const config = new Chart({
      SideBreak: this.sideBreakOptions,
      TopBreak: [TopBreak],
      Type: ChartTypes.Line,
      Measure: Measure.ColumnPercent
    }, 'SatisfactionT3B Trends', ChartProvider.ECharts);
    this.sideBreakOptions.forEach((val, i) => {
      config.combineSideBreakOptions(val, [8, 9, 10], 'combineSatisfactionT3B');
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
        textStyle: { fontSize: 11 },
        align: 'center'
      };
      let counter = 0;
      chartConfig.xAxis.data = [];
      chartConfig.legend.bottom = '20%';
      output.forEach((ele, i) => {
        this.Brandlist.forEach(element => {
          if (ele.SeriesName === 'combineSatisfactionT3B' && ele.SeriesTree.split('>')[0] === element) {
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
      this.satisfactionT3BTrendsPPTData.push(chartConfig);
      return chartConfig;
    });
    return config;
  }
}
