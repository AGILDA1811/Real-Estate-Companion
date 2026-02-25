export type EstimateRequest = {
  id?: string;
  price?: number;
  size: number;
  rooms?: number;
  location?: string;
  lat?: number;
  lng?: number;
};

export type EstimateResponse = {
  estimatedPrice: number;
  confidence: number;
  explanation: string;
};
