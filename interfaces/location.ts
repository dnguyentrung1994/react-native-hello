export interface ILocation {
  id: number | string;
  Pro_No: string;
  Building_No?: number;
  Floor_No?: number;
  Row_Locate?: string;
  No_Locate?: string;
  Shelf?: number;
  Note?: string;
  Qty?: number | string;
  identify?: string;
}

export interface IOrder {
  Pro_No: string;
  Order_Code: string;
  identify?: string;
}
export interface ILocationStore {
  locate: IOrder;
  listLocation: string[];
  barcodeData: string;
}
