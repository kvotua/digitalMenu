interface IPoint {
  product_id: string;
  x: number;
  y: number;
}

export interface IComposition {
  id: string;
  tags: string[];
  points: IPoint[];
}
