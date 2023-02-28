import { useRouter } from '../components/vlink';
import { useDNav } from '../components/dnav';
import Layout from '../components/layout';

export default function Index() {
  const router = useRouter();
  const { Component, pageProps } = router.state;

  useDNav();

  // Use a component-specific layout if one is specified or default to
  // Layout
  const getLayout =
    Component.getLayout ||
    ((page) => {
      return <Layout>{page}</Layout>;
    });

  return getLayout(<Component {...pageProps} />);
}
