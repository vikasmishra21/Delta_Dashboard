import { Chart } from 'src/app/shell/models/chart';
import { AssetMappings } from 'src/app/model/asset.mappings';
import { ChartTypes } from 'src/app/shell/enums/chart.types';
import { Measure } from 'src/app/shell/enums/measure';
import { ChartProvider } from 'src/app/shell/enums/chart.provider';
import { BreakType } from 'src/app/shell/operators/chart.operators';

export class SocialMediaTrends {

  Category: string;
  Brandlist: string[];
  BrandMapping = AssetMappings.brandNameAndCodes;
  Topbreakoption: Array<any> = new Array<any>();
  deltaScore: Array<any> = Array<any>();
  chartConfigPositiveCounter = 0;
  chartConfigNegativeCounter = 0;
  chartConfigNeutralCounter = 0;
  chartConfigNoPostCounter = 0;

  SocialMediaSidebreak = {
    Faucet: 'v620',
    Showerhead: 'v743',
    Toilet: 'v683'
  };

  SocialMediaTopbreak = {
    Faucet: 'v595',
    Showerhead: 'v695',
    Toilet: 'v632'
  };

  SocialMediaTopbreakOptionMapping = {
    Faucet: { 'Delta': 1, 'American Standard': 2, 'Kohler': 3, 'Moen': 4, 'Peerless': 5, 'Pfister': 6, 'Aqua Source': 7, 'Glacier Bay': 8, 'Brizo': 9, 'Grohe': 10, 'Hansgrohe': 11, 'Briggs': 12, 'Crane [HIDDEN AS OF 2019.Q1]': 13, 'Eljer': 14, 'Gerber': 15, 'Jacuzzi': 16, 'Mansfield': 17, 'Sterling': 18, 'Toto': 19, 'Penguin': 20, 'Danze [HIDDEN AS OF 2019.Q1]': 21, 'Speakman': 22, 'Waterpik': 23, 'Symmons': 24, 'Aquatic': 25, 'Maax': 26, 'ASB': 27, 'Style Selections [HIDDEN AS OF 2019.Q1]': 28, 'Allen & Roth [HIDDEN AS OF 2019.Q1]': 29, 'Swanstone': 30, 'Aqua Glass': 31, 'Proflo': 32, 'Duravit': 33, 'Mirabelle': 34, 'Villeroy & Boch': 35, 'DecoLav': 36, 'Rohl': 37, 'Victoria & Albert': 38, 'Ronbow': 39, 'Vortens': 40, 'Oxygenics': 41, 'MTI': 42, 'Other': 43, 'Dont know': 44 },
    Showerhead: { 'Delta': 1, 'American Standard': 2, 'Kohler': 3, 'Moen': 4, 'Peerless': 5, 'Pfister': 6, 'Aqua Source': 7, 'Glacier Bay': 8, 'Brizo': 9, 'Grohe': 10, 'Hansgrohe': 11, 'Briggs': 12, 'Crane [HIDDEN AS OF 2019.Q1]': 13, 'Eljer': 14, 'Gerber': 15, 'Jacuzzi': 16, 'Mansfield': 17, 'Sterling': 18, 'Toto': 19, 'Penguin': 20, 'Danze [HIDDEN AS OF 2019.Q1]': 21, 'Speakman': 22, 'Waterpik': 23, 'Symmons': 24, 'Aquatic': 25, 'Maax': 26, 'ASB': 27, 'Style Selections [HIDDEN AS OF 2019.Q1]': 28, 'Allen & Roth [HIDDEN AS OF 2019.Q1]': 29, 'Swanstone': 30, 'Aqua Glass': 31, 'Proflo': 32, 'Duravit': 33, 'Mirabelle': 34, 'Villeroy & Boch': 35, 'DecoLav': 36, 'Rohl': 37, 'Victoria & Albert': 38, 'Ronbow': 39, 'Vortens': 40, 'Oxygenics': 41, 'MTI': 42, 'Other': 43, 'Dont know': 44 },
    Toilet: { 'Delta': 1, 'American Standard': 2, 'Kohler': 3, 'Moen': 4, 'Peerless': 5, 'Pfister': 6, 'Aqua Source': 7, 'Glacier Bay': 8, 'Brizo': 9, 'Grohe': 10, 'Hansgrohe': 11, 'Briggs': 12, 'Crane [HIDDEN AS OF 2019.Q1]': 13, 'Eljer': 14, 'Gerber': 15, 'Jacuzzi': 16, 'Mansfield': 17, 'Sterling': 18, 'Toto': 19, 'Penguin': 20, 'Danze [HIDDEN AS OF 2019.Q1]': 21, 'Speakman': 22, 'Waterpik': 23, 'Symmons': 24, 'Aquatic': 25, 'Maax': 26, 'ASB': 27, 'Style Selections [HIDDEN AS OF 2019.Q1]': 28, 'Allen & Roth [HIDDEN AS OF 2019.Q1]': 29, 'Swanstone': 30, 'Aqua Glass': 31, 'Proflo': 32, 'Duravit': 33, 'Mirabelle': 34, 'Villeroy & Boch': 35, 'DecoLav': 36, 'Rohl': 37, 'Victoria & Albert': 38, 'Ronbow': 39, 'Vortens': 40, 'Oxygenics': 41, 'MTI': 42, 'Other': 43, 'Dont know': 44 }
  };

  socialMediaTrendsPPTData: Array<any> = new Array<any>();
  constructor(category) {
    this.Category = category;
    this.Brandlist = [];
  }

  SocialMediaPositive(TopBreak, title, codes): Chart {
    this.Brandlist = [];
    codes.forEach(element => {
      this.Brandlist.push(this.BrandMapping[parseInt(element)]);
    });
    this.Brandlist.forEach(element => {
      this.Topbreakoption.push(this.SocialMediaTopbreakOptionMapping[this.Category][element]);
    });

    const config = new Chart({
      SideBreak: [this.SocialMediaSidebreak[this.Category]],
      TopBreak: [this.SocialMediaTopbreak[this.Category]],
      Type: ChartTypes.Line,
      Measure: Measure.ColumnPercent
    }, 'Social Media Trends', ChartProvider.ECharts);
    config.showTopBreakOptions(0, this.Topbreakoption);
    config.for(BreakType.TopBreak).nest(0, [TopBreak]);
    config.addShowAllSeries(true);
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
      chartConfig.tooltip = {
        trigger: 'axis'
      };
      chartConfig.xAxis.data = [];
      chartConfig.legend.bottom = '20%';
      output.forEach((ele, i) => {
        const Score = isNaN(ele.Score) ? 0 : ele.Score;
        const legendName = this.BrandMapping[parseInt(ele.NestedCategoryMap.split(':')[1].split('>')[0])];
        if (ele.SeriesName === 'Yes, and it was positive' && (ele.CategoryName === 'Q1_2019' || ele.CategoryName === 'Q2_2019'
          || ele.CategoryName === 'Q3_2019' || ele.CategoryName === 'Q4_2019')) {
          this.TrendsConfigPositive(Score, legendName, ele, chartConfig);
          // tslint:disable-next-line: max-line-length
        } else if (ele.SeriesName === 'Yes, and it was positive' && (ele.CategoryName === 'Q1/Q2_2019' || ele.CategoryName === 'Q3/Q4_2019')) {
          this.TrendsConfigPositive(Score, legendName, ele, chartConfig);
        } else if (ele.SeriesName === 'Yes, and it was positive' && (ele.CategoryName === '2019')) {
          this.TrendsConfigPositive(Score, legendName, ele, chartConfig);
        }
      });
      this.socialMediaTrendsPPTData.push(chartConfig);
      return chartConfig;
    });
    return config;
  }

  SocialMediaNegative(TopBreak, title, codes): Chart {
    this.Brandlist = [];
    codes.forEach(element => {
      this.Brandlist.push(this.BrandMapping[parseInt(element)]);
    });
    this.Brandlist.forEach(element => {
      this.Topbreakoption.push(this.SocialMediaTopbreakOptionMapping[this.Category][element]);
    });

    const config = new Chart({
      SideBreak: [this.SocialMediaSidebreak[this.Category]],
      TopBreak: [this.SocialMediaTopbreak[this.Category]],
      Type: ChartTypes.Line,
      Measure: Measure.ColumnPercent
    }, 'Social Media Trends', ChartProvider.ECharts);
    config.showTopBreakOptions(0, this.Topbreakoption);
    config.for(BreakType.TopBreak).nest(0, [TopBreak]);
    config.addShowAllSeries(true);
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
      chartConfig.tooltip = {
        trigger: 'axis'
      };
      chartConfig.xAxis.data = [];
      chartConfig.legend.bottom = '20%';
      output.forEach((ele, i) => {
        const Score = isNaN(ele.Score) ? 0 : ele.Score;
        const legendName = this.BrandMapping[parseInt(ele.NestedCategoryMap.split(':')[1].split('>')[0])];
        if (ele.SeriesName === 'Yes, and it was negative' && (ele.CategoryName === 'Q1_2019' || ele.CategoryName === 'Q2_2019'
          || ele.CategoryName === 'Q3_2019' || ele.CategoryName === 'Q4_2019')) {
          this.TrendsConfigNegative(Score, legendName, ele, chartConfig);
          // tslint:disable-next-line: max-line-length
        } else if (ele.SeriesName === 'Yes, and it was negative' && (ele.CategoryName === 'Q1/Q2_2019' || ele.CategoryName === 'Q3/Q4_2019')) {
          this.TrendsConfigNegative(Score, legendName, ele, chartConfig);
        } else if (ele.SeriesName === 'Yes, and it was negative' && (ele.CategoryName === '2019')) {
          this.TrendsConfigNegative(Score, legendName, ele, chartConfig);
        }
      });
      this.socialMediaTrendsPPTData.push(chartConfig);
      return chartConfig;
    });
    return config;
  }

  SocialMediaNeutral(TopBreak, title, codes): Chart {
    this.Brandlist = [];
    codes.forEach(element => {
      this.Brandlist.push(this.BrandMapping[parseInt(element)]);
    });
    this.Brandlist.forEach(element => {
      this.Topbreakoption.push(this.SocialMediaTopbreakOptionMapping[this.Category][element]);
    });

    const config = new Chart({
      SideBreak: [this.SocialMediaSidebreak[this.Category]],
      TopBreak: [this.SocialMediaTopbreak[this.Category]],
      Type: ChartTypes.Line,
      Measure: Measure.ColumnPercent
    }, 'Social Media Trends', ChartProvider.ECharts);
    config.showTopBreakOptions(0, this.Topbreakoption);
    config.for(BreakType.TopBreak).nest(0, [TopBreak]);
    config.addShowAllSeries(true);
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
      chartConfig.tooltip = {
        trigger: 'axis'
      };
      chartConfig.xAxis.data = [];
      chartConfig.legend.bottom = '20%';
      output.forEach((ele, i) => {
        const Score = isNaN(ele.Score) ? 0 : ele.Score;
        const legendName = this.BrandMapping[parseInt(ele.NestedCategoryMap.split(':')[1].split('>')[0])];
        if (ele.SeriesName === 'Yes, and it was neutral' && (ele.CategoryName === 'Q1_2019' || ele.CategoryName === 'Q2_2019'
          || ele.CategoryName === 'Q3_2019' || ele.CategoryName === 'Q4_2019')) {
          this.TrendsConfigNeutral(Score, legendName, ele, chartConfig);
          // tslint:disable-next-line: max-line-length
        } else if (ele.SeriesName === 'Yes, and it was neutral' && (ele.CategoryName === 'Q1/Q2_2019' || ele.CategoryName === 'Q3/Q4_2019')) {
          this.TrendsConfigNeutral(Score, legendName, ele, chartConfig);
        } else if (ele.SeriesName === 'Yes, and it was neutral' && (ele.CategoryName === '2019')) {
          this.TrendsConfigNeutral(Score, legendName, ele, chartConfig);
        }
      });
      this.socialMediaTrendsPPTData.push(chartConfig);
      return chartConfig;
    });
    return config;
  }

  SocialMediaNoPost(TopBreak, title, codes): Chart {
    this.Brandlist = [];
    codes.forEach(element => {
      this.Brandlist.push(this.BrandMapping[parseInt(element)]);
    });
    this.Brandlist.forEach(element => {
      this.Topbreakoption.push(this.SocialMediaTopbreakOptionMapping[this.Category][element]);
    });

    const config = new Chart({
      SideBreak: [this.SocialMediaSidebreak[this.Category]],
      TopBreak: [this.SocialMediaTopbreak[this.Category]],
      Type: ChartTypes.Line,
      Measure: Measure.ColumnPercent
    }, 'Social Media Trends', ChartProvider.ECharts);
    config.showTopBreakOptions(0, this.Topbreakoption);
    config.for(BreakType.TopBreak).nest(0, [TopBreak]);
    config.addShowAllSeries(true);
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
      chartConfig.xAxis.data = [];
      chartConfig.legend.bottom = '20%';
      output.forEach((ele, i) => {
        const Score = isNaN(ele.Score) ? 0 : ele.Score;
        const legendName = this.BrandMapping[parseInt(ele.NestedCategoryMap.split(':')[1].split('>')[0])];
        if (ele.SeriesName === 'No, I did not post anything' && (ele.CategoryName === 'Q1_2019' || ele.CategoryName === 'Q2_2019'
          || ele.CategoryName === 'Q3_2019' || ele.CategoryName === 'Q4_2019')) {
          this.TrendsConfigNoPost(Score, legendName, ele, chartConfig);
          // tslint:disable-next-line: max-line-length
        } else if (ele.SeriesName === 'No, I did not post anything' && (ele.CategoryName === 'Q1/Q2_2019' || ele.CategoryName === 'Q3/Q4_2019')) {
          this.TrendsConfigNoPost(Score, legendName, ele, chartConfig);
        } else if (ele.SeriesName === 'No, I did not post anything' && (ele.CategoryName === '2019')) {
          this.TrendsConfigNoPost(Score, legendName, ele, chartConfig);
        }
      });
      this.socialMediaTrendsPPTData.push(chartConfig);
      return chartConfig;
    });
    return config;
  }

  TrendsConfigPositive(Score, legendName, ele, chartConfig) {
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
      chartConfig.xAxis.data[this.chartConfigPositiveCounter] = ele.CategoryName;
      this.chartConfigPositiveCounter++;
    }
  }

  TrendsConfigNegative(Score, legendName, ele, chartConfig) {
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
      chartConfig.xAxis.data[this.chartConfigNegativeCounter] = ele.CategoryName;
      this.chartConfigNegativeCounter++;
    }
  }

  TrendsConfigNeutral(Score, legendName, ele, chartConfig) {
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
      chartConfig.xAxis.data[this.chartConfigNeutralCounter] = ele.CategoryName;
      this.chartConfigNeutralCounter++;
    }
  }

  TrendsConfigNoPost(Score, legendName, ele, chartConfig) {
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
      chartConfig.xAxis.data[this.chartConfigNoPostCounter] = ele.CategoryName;
      this.chartConfigNoPostCounter++;
    }
  }
}
