// 标签集合与颜色的映射条目

import React from "react";
import TextArea from "./TextArea";
import ColorPicker from "./ColorPicker";
import Button from "./Button";
import { FaRegTrashAlt } from "react-icons/fa";

export default function TagColorMapping({
  id,
  style,
  fontColor,
  backColor,
  text,
  onFontColorChange,
  onBackColorChange,
  onTextChange,
  onDelete,
}: TagColorMappingProps) {
  return (
    <div data-id={id} style={{ ...styles.container, ...style }}>
      <TextArea text={text} onChange={onTextChange} />
      <ColorPicker color={fontColor} onChange={onFontColorChange} />
      <ColorPicker color={backColor} onChange={onBackColorChange} />
      <Button icon={<FaRegTrashAlt />} onClick={onDelete} />
    </div>
  );
}

interface TagColorMappingDataType {
  id: string;
  fontColor: string;
  backColor: string;
  text: string;
}

interface TagColorMappingProps extends TagColorMappingDataType {
  style: React.CSSProperties;
  onFontColorChange: (color: string) => void;
  onBackColorChange: (color: string) => void;
  onTextChange: (text: string) => void;
  onDelete: () => void;
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: "flex",
    width: "100%",
    gap: "0.5rem",
    alignItems: "center",
  },
};

export type { TagColorMappingDataType };
