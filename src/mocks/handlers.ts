import { http, HttpHandler, HttpResponse } from 'msw';

export type NoneType = Record<string, never>;

//You can add HTTP handler by msw DOCS
//https://mswjs.io/docs/network-behavior/rest

export const handlers: HttpHandler[] = [
  //   Example code
  http.get('/post', () => {
    return HttpResponse.json();
  }),
];
