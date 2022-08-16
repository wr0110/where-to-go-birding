import * as React from "react";
import useEventListener from "hooks/useEventListener";

export default function useHoverMap() {
  const [activeTooltip, setActiveTooltip] = React.useState<string | null>(null);
  const [tooltip, setTooltip] = React.useState<string | null>(null);
  const [mousePosition, setMousePosition] = React.useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const svgRef = React.useRef(null);

  const onMouseMove = (e: MouseEvent) => {
    setMousePosition({ x: e.clientX, y: e.clientY });
  };

  useEventListener("mousemove", onMouseMove, svgRef);

  const onMouseEnter = (e: React.MouseEvent<SVGPathElement, MouseEvent>) => {
    const text = e.currentTarget.parentElement?.querySelector("text")?.textContent || "";
    setTooltip(text);
    setTimeout(() => {
      setActiveTooltip(text);
    }, 200);
  };

  const onMouseLeave = (e: React.MouseEvent<SVGPathElement, MouseEvent>) => {
    setTooltip(null);
  };

  const onClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const text = e.currentTarget.querySelector("text")?.textContent || "";
    if (activeTooltip !== text) {
      e.preventDefault();
    }
  };

  return {
    linkProps: { onClick },
    pathProps: { onMouseEnter, onMouseLeave },
    tooltipProps: { x: mousePosition.x, y: mousePosition.y, text: tooltip },
    svgRef,
  };
}
