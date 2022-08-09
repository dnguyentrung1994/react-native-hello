export interface IShipment {
  id: number;
  orderCode: string;
  productCode: string;
  quantity: string;
  identify: string;
  preparedBy: string;
  preparedTime: string;
  checkedBy?: string;
}

export interface IShipmentList {
  myShipments: IShipment[];
  otherShipments: IShipment[];
  checking?: IShipment;
}
