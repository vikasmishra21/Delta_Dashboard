export interface TableOutput {
  SeriesName: string;
  SeriesCode: string;
  SeriesVariableID: string;
  SeriesMap: string;
  SeriesTree: string;
  CategoryName: string;
  CategoryCode: string;
  CategoryVariableID: string;
  CategoryMap: string;
  CategoryTree: string;
  Score: number;
  Difference: number;
  previousScore: number;
  NestedCategoryMap: string;
  SigKey: string;
  SignificanceSign: number;
  base: any;
  PreviousBase: any;
}
