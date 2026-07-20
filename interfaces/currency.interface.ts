export interface ICurrencyInfo {
  code: string;
  name: string;
}

export interface IConvertQuery {
  from: string;
  to: string;
  amount: number;
}

export interface IConvertInfo {
  rate: number;
  timestamp: number;
}

export interface IConvertResult {
  success: boolean;
  query: IConvertQuery;
  info: IConvertInfo;
  result: number;
  date: string;
}

export interface IApiError {
  error: string;
}

export interface IConverterWidgetProps {
  defaultAmount?: string;
  defaultFrom?: string;
  defaultTo?: string;
  className?: string;
}