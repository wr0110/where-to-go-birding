import Document, { Html, Head, Main, NextScript } from "next/document";

class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" />
          <link
            href="https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,400;0,700;1,400;1,700;1,500&display=swap"
            rel="stylesheet"
          ></link>
          <link rel="icon" href="/favicon-32.jpg" sizes="32x32" />
          <link rel="icon" href="favicon-192.jpg" sizes="192x192" />
          <link rel="apple-touch-icon" href="favicon-180x180.jpg" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
