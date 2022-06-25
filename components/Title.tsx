import Head from "next/head";

type TitleProps = {
  isOhio?: boolean;
  children?: string;
};

export default function Title({ children, isOhio }: TitleProps) {
  const suffix = isOhio ? "Birding in Ohio" : "Birding Hotspots";
  return (
    <Head>
      <title>{children ? `${children} - ${suffix}` : suffix}</title>
    </Head>
  );
}
