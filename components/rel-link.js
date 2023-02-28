import { useRouter } from 'next/router';
import { relative } from '../src/path';

export default function RelLink(props) {
  const router = useRouter();
  const target = relative(router.pathname, props.href);

  function navigate(event) {
    event.preventDefault();
    // NextJS uses domain-relative URLs internally to look up
    // resources. If `window.history` is given a domain-relative URL
    // when running off the file:// protocol, that's interpreted as
    // being relative to the root of the filesystem - probably not
    // the intended behavior. Use the `as` argument to ensure
    // `window.history` gets set with the full path, even when
    // running off the filesystem, so that subsequent URLs are
    // resolved from the right base path.
    const a = document.createElement('a');
    a.href = target;
    router.push(target, a.href);
  }

  return (
    <a {...props} href={target} onClick={navigate}>
      {props.children}
    </a>
  );
}
