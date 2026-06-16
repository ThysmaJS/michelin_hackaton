import { useState } from 'react';

/**
 * Renders an element whose inline style is merged with optional `hoverStyle`
 * and `focusStyle` on the matching pointer/focus state. Replaces the original
 * design's `style-hover` / `style-focus` attributes which CSS-in-JS can't
 * express on inline styles alone.
 */
export default function Hoverable({
  as: Tag = 'div',
  style,
  hoverStyle,
  focusStyle,
  onMouseEnter,
  onMouseLeave,
  onFocus,
  onBlur,
  children,
  ...rest
}) {
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);

  const merged = {
    ...style,
    ...(hovered && hoverStyle ? hoverStyle : null),
    ...(focused && focusStyle ? focusStyle : null),
  };

  return (
    <Tag
      {...rest}
      style={merged}
      onMouseEnter={(e) => { setHovered(true); onMouseEnter?.(e); }}
      onMouseLeave={(e) => { setHovered(false); onMouseLeave?.(e); }}
      onFocus={(e) => { setFocused(true); onFocus?.(e); }}
      onBlur={(e) => { setFocused(false); onBlur?.(e); }}
    >
      {children}
    </Tag>
  );
}
