export interface MomoEndpoints {
  create: string;
  confirm: string;
  query: string;
  // refund: string;
}

export interface MomoConfig {
  partnerCode: string;
  accessKey: string;
  secretKey: string;
  apiUrl: string;
  returnUrl: string;
  notifyUrl: string;
  isSandbox: boolean;
  endpoints: MomoEndpoints;
}

export interface MomoPayload {
  partnerCode: string;
  accessKey: string;
  requestId: string;
  amount: number;
  orderId: string;
  orderInfo: string;
  redirectUrl: string;
  notifyUrl: string;
  ipnUrl: string;
  extraData: string;
  requestType: string;
  signature: string;
  lang?: string;
}

export interface MomoCallbackResponse {
  partnerCode: string;
  orderId: string;
  requestId: string;
  amount: number;
  responseTime: number;
  message: string;
  resultCode: number;
  payUrl?: string;
  deeplink?: string;
  qrCodeUrl?: string;
  deeplinkMiniApp?: string;
}

export interface MomoReturnResponse {
  partnerCode: string;
  orderId: string;
  requestId: string;
  amount: number | string;
  orderInfo: string;
  orderType: string;
  transId: string;
  resultCode: number | string;
  message: string;
  payType: string;
  responseTime: number | string;
  extraData: string;
  signature: string;
} 