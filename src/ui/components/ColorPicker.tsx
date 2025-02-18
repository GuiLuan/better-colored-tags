// 颜色选择器

import React, { useReducer } from "react";
import { SketchPicker } from "react-color";
import tinycolor from "tinycolor2";

// 受控组件，需要父组件提供响应值和更新函数
export default function ColorPicker({ color, onChange }: ColorPickerProps) {
  const [state, dispatch] = useReducer(stateReducer, {
    displayColorPicker: false,
  });

  return (
    <div>
      <div style={styles.swatch} onClick={() => dispatch({ type: "toggle" })}>
        <div style={{ ...styles.color, background: color }} />
      </div>
      {state.displayColorPicker ? (
        <div style={styles.popover}>
          <div
            style={styles.cover}
            onClick={() => dispatch({ type: "hidden" })}
          />
          <SketchPicker color={color} onChange={({ hex }) => onChange(hex)} />
        </div>
      ) : null}
    </div>
  );
}

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
}

const styles: Record<string, React.CSSProperties> = {
  color: {
    width: "1.5rem",
    height: "1.5rem",
    borderRadius: "50%",
  },
  swatch: {
    padding: "3px",
    background: tinycolor("#fff").darken(30).toHex8String(),
    borderRadius: "50%",
    boxShadow: "0 0 0 1px rgba(0,0,0,.1)",
    display: "inline-block",
    cursor: "pointer",
  },
  popover: {
    position: "absolute",
    right: "1rem",
    zIndex: "2",
  },
  cover: {
    position: "fixed",
    top: "0px",
    right: "0px",
    bottom: "0px",
    left: "0px",
  },
};

interface state {
  displayColorPicker: boolean;
}

interface stateAction {
  type: "popover" | "hidden" | "toggle";
  color?: string;
  onChange?: (color: string) => void;
}

const stateReducer = (state: state, action: stateAction): state => {
  switch (action.type) {
    // 弹出选色器
    case "popover": {
      return {
        ...state,
        displayColorPicker: true,
      };
    }
    // 隐藏选色器
    case "hidden": {
      return {
        ...state,
        displayColorPicker: false,
      };
    }
    // 弹出|隐藏选色器
    case "toggle": {
      return {
        ...state,
        displayColorPicker: !state.displayColorPicker,
      };
    }
  }
};
