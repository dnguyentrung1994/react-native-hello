export interface IItem {
  orderCode: string;
  productCode: string;
  quantity: number;
  location?: string[];
  identify?: string;
}
