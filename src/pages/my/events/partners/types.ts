import type { MyActivityPartnersResponse } from '@/api/types';

export type MyActivityPartner = MyActivityPartnersResponse['items'][number];
export type MyActivityPartnerEvent = MyActivityPartner['events'][number];
