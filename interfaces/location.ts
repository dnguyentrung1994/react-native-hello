export interface ILocation {
  id: number | string;
  Pro_No: string;
  Building_No?: number | string;
  Floor_No?: number | string;
  Row_Locate?: string | number;
  No_Locate?: string | number;
  Shelf?: string | number;
  Note?: string;
  Qty?: number | string;
  identify?: string;
}

export interface ILocationStore {
  locate: ILocation;
  listLocation: ILocation[];
}
