/** @jsx jsx */
import { useMemo } from "react";
import { jsx, css, keyframes } from "@emotion/react";

export function GlowingText({ value }) {
  const charWrappers = useMemo(
    () =>
      Array.from(value).map((x, i) => (
        <span key={i} css={charStyle()}>
          {x}
        </span>
      )),
    [value]
  );

  return (
    <div>
      <h1 css={glowStyle}>{charWrappers}</h1>
    </div>
  );
}

// This exaple is take from https://codepen.io/ganceab/pen/YZvKLQ
const glowKeyframes = keyframes`
  0%{opacity:0}10%{opacity:0;text-shadow:none}10.1%{opacity:1;text-shadow:none}10.2%{opacity:0;text-shadow:none}20%{opacity:0;text-shadow:none}20.1%{opacity:1;text-shadow:0 0 30px rgba(255,255,255,.25)}20.6%{opacity:0;text-shadow:none}30%{opacity:0;text-shadow:none}30.1%{opacity:1;text-shadow:0 0 30px rgba(255,255,255,.45),0 0 60px rgba(255,255,255,.25)}30.5%{opacity:1;text-shadow:0 0 30px rgba(255,255,255,.45),0 0 60px rgba(255,255,255,.25)}30.6%{opacity:0;text-shadow:none}45%{opacity:0;text-shadow:none}45.1%{opacity:1;text-shadow:0 0 30px rgba(255,255,255,.45),0 0 60px rgba(255,255,255,.25)}50%{opacity:1;text-shadow:0 0 30px rgba(255,255,255,.45),0 0 60px rgba(255,255,255,.25)}55%{opacity:1;text-shadow:0 0 30px rgba(255,255,255,.45),0 0 60px rgba(255,255,255,.25)}55.1%{opacity:0;text-shadow:none}57%{opacity:0;text-shadow:none}57.1%{opacity:1;text-shadow:0 0 30px rgba(255,255,255,.55),0 0 60px rgba(255,255,255,.35)}60%{opacity:1;text-shadow:0 0 30px rgba(255,255,255,.55),0 0 60px rgba(255,255,255,.35)}60.1%{opacity:0;text-shadow:none}65%{opacity:0;text-shadow:none}65.1%{opacity:1;text-shadow:0 0 30px rgba(255,255,255,.55),0 0 60px rgba(255,255,255,.35),0 0 100px rgba(255,255,255,.1)}75%{opacity:1;text-shadow:0 0 30px rgba(255,255,255,.55),0 0 60px rgba(255,255,255,.35),0 0 100px rgba(255,255,255,.1)}75.1%{opacity:0;text-shadow:none}77%{opacity:0;text-shadow:none}77.1%{opacity:1;text-shadow:0 0 30px rgba(255,255,255,.55),0 0 60px rgba(255,255,255,.4),0 0 110px rgba(255,255,255,.2),0 0 100px rgba(255,255,255,.1)}85%{opacity:1;text-shadow:0 0 30px rgba(255,255,255,.55),0 0 60px rgba(255,255,255,.4),0 0 110px rgba(255,255,255,.2),0 0 100px rgba(255,255,255,.1)}85.1%{opacity:0;text-shadow:none}86%{opacity:0;text-shadow:none}86.1%{opacity:1;text-shadow:0 0 30px rgba(255,255,255,.6),0 0 60px rgba(255,255,255,.45),0 0 110px rgba(255,255,255,.25),0 0 100px rgba(255,255,255,.1)}100%{opacity:1;text-shadow:0 0 30px rgba(255,255,255,.6),0 0 60px rgba(255,255,255,.45),0 0 110px rgba(255,255,255,.25),0 0 100px rgba(255,255,255,.1)}}@keyframes text-flicker-in-glow{0%{opacity:0}10%{opacity:0;text-shadow:none}10.1%{opacity:1;text-shadow:none}10.2%{opacity:0;text-shadow:none}20%{opacity:0;text-shadow:none}20.1%{opacity:1;text-shadow:0 0 30px rgba(255,255,255,.25)}20.6%{opacity:0;text-shadow:none}30%{opacity:0;text-shadow:none}30.1%{opacity:1;text-shadow:0 0 30px rgba(255,255,255,.45),0 0 60px rgba(255,255,255,.25)}30.5%{opacity:1;text-shadow:0 0 30px rgba(255,255,255,.45),0 0 60px rgba(255,255,255,.25)}30.6%{opacity:0;text-shadow:none}45%{opacity:0;text-shadow:none}45.1%{opacity:1;text-shadow:0 0 30px rgba(255,255,255,.45),0 0 60px rgba(255,255,255,.25)}50%{opacity:1;text-shadow:0 0 30px rgba(255,255,255,.45),0 0 60px rgba(255,255,255,.25)}55%{opacity:1;text-shadow:0 0 30px rgba(255,255,255,.45),0 0 60px rgba(255,255,255,.25)}55.1%{opacity:0;text-shadow:none}57%{opacity:0;text-shadow:none}57.1%{opacity:1;text-shadow:0 0 30px rgba(255,255,255,.55),0 0 60px rgba(255,255,255,.35)}60%{opacity:1;text-shadow:0 0 30px rgba(255,255,255,.55),0 0 60px rgba(255,255,255,.35)}60.1%{opacity:0;text-shadow:none}65%{opacity:0;text-shadow:none}65.1%{opacity:1;text-shadow:0 0 30px rgba(255,255,255,.55),0 0 60px rgba(255,255,255,.35),0 0 100px rgba(255,255,255,.1)}75%{opacity:1;text-shadow:0 0 30px rgba(255,255,255,.55),0 0 60px rgba(255,255,255,.35),0 0 100px rgba(255,255,255,.1)}75.1%{opacity:0;text-shadow:none}77%{opacity:0;text-shadow:none}77.1%{opacity:1;text-shadow:0 0 30px rgba(255,255,255,.55),0 0 60px rgba(255,255,255,.4),0 0 110px rgba(255,255,255,.2),0 0 100px rgba(255,255,255,.1)}85%{opacity:1;text-shadow:0 0 30px rgba(255,255,255,.55),0 0 60px rgba(255,255,255,.4),0 0 110px rgba(255,255,255,.2),0 0 100px rgba(255,255,255,.1)}85.1%{opacity:0;text-shadow:none}86%{opacity:0;text-shadow:none}86.1%{opacity:1;text-shadow:0 0 30px rgba(255,255,255,.6),0 0 60px rgba(255,255,255,.45),0 0 110px rgba(255,255,255,.25),0 0 100px rgba(255,255,255,.1)}100%{opacity:1;text-shadow:0 0 30px rgba(255,255,255,.6),0 0 60px rgba(255,255,255,.45),0 0 110px rgba(255,255,255,.25),0 0 100px rgba(255,255,255,.1)}
`;

const charStyle = () => css`
  animation: ${glowKeyframes} ${Math.random() * 4}s linear both;
  color: hsla(${Math.random() * 360}, 100%, 80%, 1);
`;

const glowStyle = css`
  font-size: 100px;
  font-family: "Monoton", cursive;
  text-transform: uppercase;
`;
