import React from "react";

export default function TextArea({ text, onChange }: TextAreaProps) {
  return (
    <textarea
      style={styles.textarea}
      value={text}
      onChange={(e) => onChange(e.target.value)}
      placeholder="请输入内容..."
      rows={2}
    />
  );
}

interface TextAreaProps {
  text: string;
  onChange: (text: string) => void;
}

const styles: Record<string, React.CSSProperties> = {
  textarea: {
    resize: "none",
    padding: "10px",
    boxSizing: "border-box",
    flexGrow: 1,
  },
};
