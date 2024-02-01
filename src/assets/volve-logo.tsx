import type { SVGProps } from "react";

interface CustomSVGProps extends SVGProps<SVGSVGElement> {
  borderColor?: string;
}
export const VolveLogo = (props: CustomSVGProps) => {
  const { borderColor, ...svgProps } = props;
  return (
    <svg
      fill="#ffff"
      viewBox="-10.8 -10.8 45.60 45.60"
      role="img"
      xmlns="http://www.w3.org/2000/svg"
      stroke="#ffff"
      transform="rotate(0)"
      height="100"
      width="100"
    >
      <g id="SVGRepo_bgCarrier" strokeWidth="0">
        <rect
          x="-10.8"
          y="-10.8"
          width="20"
          height="20"
          rx="22.8"
          fill="#858585"
        ></rect>
      </g>
      <g
        id="SVGRepo_tracerCarrier"
        strokeLinecap="round"
        strokeLinejoin="round"
      ></g>
      <g id="SVGRepo_iconCarrier">
        <title>V icon</title>
        <path d="M23.474,0.159L17.08,0.775c-0.406,0.039-0.844,0.383-0.978,0.768l-4.092,11.749L7.898,1.542 C7.764,1.158,7.325,0.814,6.92,0.775L0.526,0.159C0.121,0.12-0.096,0.399,0.041,0.783L8.085,23.15 c0.138,0.383,0.581,0.695,0.988,0.695h6.223h0.039c0.073,0,0.134-0.02,0.179-0.055c0.124-0.062,0.231-0.169,0.275-0.292 l0.039-0.108l8.13-22.607C24.096,0.399,23.879,0.12,23.474,0.159z"></path>
      </g>
    </svg>
  );
};
