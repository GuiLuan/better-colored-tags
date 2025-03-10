// 处理 metadata 栏 tags 的渲染

import { TagColorMappingData } from "ui/components/TagColorMapping";
import { createPathMatcher } from "./common";

type TagStyle = {
  fontColor: string; // 字体颜色
  backColor: string; // 背景颜色
};

export default function metadataStyleChanger(
  dom: Document | HTMLElement,
  conditions: TagColorMappingData[]
): void {
  // 创建前缀匹配器
  const conditionMatchers = conditions.flatMap((condition) => {
    const style = {
      fontColor: condition.fontColor,
      backColor: condition.backColor,
    };

    return condition.text
      .split(",")
      .map((t) => t.trim())
      .map((text) => ({
        match: createPathMatcher(
          text.split("/").map((segment) => segment.replace(/#/g, "").trim())
        ),
        style,
      }));
  });

  const handlePillContent = (
    pillContent: HTMLElement
  ): TagStyle | undefined => {
    const tagText = pillContent?.textContent?.replace(/#/g, "").trim();
    if (!tagText) return;

    // 'tag1/tag2' -> ['tag1','tag2']
    const tagPath = tagText.split("/").map((s) => s.trim());
    let targetStyle: TagStyle | null = null;
    // 使用反向查找保留最后一个匹配项
    for (let i = conditionMatchers.length - 1; i >= 0; i--) {
      if (conditionMatchers[i].match(tagPath)) {
        targetStyle = conditionMatchers[i].style;
        break;
      }
    }
    if (targetStyle) {
      pillContent.style.color = targetStyle.fontColor;
      pillContent.style.backgroundColor = targetStyle.backColor;

      return targetStyle;
    }
    return;
  };

  const handlePillRmBtn = (
    pillRmBtn: HTMLElement,
    targetStyle: TagStyle
  ): void => {
    pillRmBtn.style.color = targetStyle.fontColor;
  };

  const pills = dom.querySelectorAll<HTMLElement>(
    "[data-property-key='tags'] .multi-select-pill"
  );

  pills.forEach((pill) => {
    const pillContent = pill.querySelector<HTMLElement>(
      ".multi-select-pill-content"
    );
    if (pillContent === undefined || pillContent === null) return;
    const targetStyle = handlePillContent(pillContent);
    if (targetStyle === undefined) return;

    const pillRmBtn = pill.querySelector<HTMLElement>(
      ".multi-select-pill-remove-button"
    );
    if (pillRmBtn === undefined || pillRmBtn === null) return;
    handlePillRmBtn(pillRmBtn, targetStyle);
  });
}
