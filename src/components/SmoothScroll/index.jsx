import { useSmoothScroll } from '../../lib/hooks/useSmoothScroll';

export default function SmoothScroll({ children }) {
  useSmoothScroll({
    smooth: 1.5,
    effects: true,
    smoothTouch: 0.1
  });

  return (
    <div id="smooth-wrapper" style={{ overflow: 'hidden' }}>
      <div id="smooth-content">
        {children}
      </div>
    </div>
  );
}