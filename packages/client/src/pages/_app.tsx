import 'tiptap/fix-match-nodes';
import 'viewerjs/dist/viewer.css';
import 'styles/globals.scss';
import 'tiptap/core/styles/index.scss';

import { isMobile } from 'helpers/env';
import { IsOnMobile } from 'hooks/use-on-mobile';
import { Theme } from 'hooks/use-theme';
import App from 'next/app';
import Head from 'next/head';
import React from 'react';
import { Hydrate, QueryClient, QueryClientProvider } from 'react-query';

class MyApp extends App<{ isMobile: boolean }> {
  state = {
    queryClient: new QueryClient({
      defaultOptions: {
        queries: {
          refetchOnMount: true,
          refetchOnWindowFocus: true,
          retry: false,
          staleTime: 10 * 1000, // 默认 10s 数据过期
        },
      },
    }),
  };

  static getInitialProps = async ({ Component, ctx }) => {
    const request = ctx?.req;
    const getPagePropsPromise = Component.getInitialProps ? Component.getInitialProps(ctx) : Promise.resolve({});
    const [pageProps] = await Promise.all([getPagePropsPromise]);

    return {
      pageProps,
      isMobile: isMobile(request?.headers['user-agent']),
    };
  };

  render() {
    const { Component, pageProps, isMobile } = this.props;
    const { queryClient } = this.state;

    return (
      <>
        <Head>
          <meta
            name="viewport"
            content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, user-scalable=no, viewport-fit=cover"
          />
          <meta charSet="utf-8" />
          <meta name="description" content={process.env.SEO_DESCRIPTION} />
          <meta name="keywords" content={process.env.SEO_KEYWORDS}></meta>
          <meta name="application-name" content={process.env.SEO_APPNAME} />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-status-bar-style" content="default" />
          <meta name="apple-mobile-web-app-title" content={process.env.SEO_APPNAME} />
          <meta name="description" content={process.env.SEO_DESCRIPTION} />
          <meta name="format-detection" content="telephone=no" />
          <meta name="mobile-web-app-capable" content="yes" />
          <meta name="msapplication-TileColor" content="#ffffff" />
          <meta name="msapplication-tap-highlight" content="no" />
          <meta name="theme-color" content="#ffffff" />
          <meta property="og:type" content="website" />
          <meta property="og:title" content={process.env.SEO_APPNAME} />
          <meta property="og:description" content={process.env.SEO_DESCRIPTION} />
          <meta property="og:site_name" content={process.env.SEO_APPNAME} />
          <link rel="manifest" href="/manifest.json" />
          <link rel="apple-touch-icon" href="/icon192.png" />
          {((process.env.DNS_PREFETCH || []) as string[]).map((url) => (
            <link key={url} rel="dns-prefetch" href={url} />
          ))}
        </Head>
        <QueryClientProvider client={queryClient}>
          <Hydrate state={pageProps.dehydratedState}>
            <Theme.Provider>
              <IsOnMobile.Provider initialState={isMobile}>
                <Component {...pageProps} />
              </IsOnMobile.Provider>
            </Theme.Provider>
          </Hydrate>
        </QueryClientProvider>
      </>
    );
  }
}

export default MyApp;
