import type { TagColorMappingDataType } from "ui/components/TagColorMapping";
import BASE_SELECTORS from "./selectors";

type StyleMapping = {
  fontColor: string;
  backColor: string;
};

const REMOVE_BUTTON_CLASS = "multi-select-pill-remove-button";

function createPathMatcher(conditionPath: string[]) {
  return (elementPath: string[]) => {
    if (conditionPath.length > elementPath.length) return false;
    for (let i = 0; i < conditionPath.length; i++) {
      if (conditionPath[i] !== elementPath[i]) return false;
    }
    return true;
  };
}

export default function styleChanger(
  dom: Document | HTMLElement,
  conditions: TagColorMappingDataType[]
): void {
  // 预处理条件为路径匹配器 + 样式对
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

  // 处理所有目标元素
  const elements = dom.querySelectorAll<HTMLElement>(BASE_SELECTORS.join(", "));

  elements.forEach((element) => {
    const rawText = element.textContent?.replace(/#/g, "").trim();
    if (!rawText) return;

    // 生成元素的层级路径
    const elementPath = rawText.split("/").map((s) => s.trim());
    let targetStyle: StyleMapping | null = null;

    // 使用反向查找保留最后一个匹配项（与原始实现行为一致）
    for (let i = conditionMatchers.length - 1; i >= 0; i--) {
      if (conditionMatchers[i].match(elementPath)) {
        targetStyle = conditionMatchers[i].style;
        break;
      }
    }

    if (targetStyle) {
      // 应用父元素样式
      element.style.color = targetStyle.fontColor;
      element.style.backgroundColor = targetStyle.backColor;

      // 同步删除按钮颜色
      const removeBtn = element.querySelector<HTMLElement>(
        `.${REMOVE_BUTTON_CLASS}`
      );
      removeBtn && (removeBtn.style.color = targetStyle.fontColor);
    }
  });
}
