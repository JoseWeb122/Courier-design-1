export type ServiceKind = 'ride' | 'courier';

export type BookingRequest = {
  kind: ServiceKind;
  prefill?: Record<string, string>;
  vehicle?: string;
  estimate?: number;
};
