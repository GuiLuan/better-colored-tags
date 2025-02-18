import type { TagColorMappingDataType } from "ui/components/TagColorMapping";
import BASE_SELECTORS from "./selectors";

type StyleMapping = {
  fontColor: string;
  backColor: string;
};

const REMOVE_BUTTON_CLASS = "multi-select-pill-remove-button";
const HOVER_OPACITY = 0.05; // 悬停高亮透明度

// 动态注入全局样式
const createHoverStyle = () => {
  const styleId = "tag-hover-effect";
  if (!document.getElementById(styleId)) {
    const style = document.createElement("style");
    style.id = styleId;
    style.textContent = `
      .multi-select-pill {
        position: relative;
        transition: background-color 0.2s;
        overflow: hidden;
      }
      .multi-select-pill::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: currentColor;
        opacity: 0;
        transition: opacity 0.2s;
        pointer-events: none;
      }
      .multi-select-pill:hover::after {
        opacity: ${HOVER_OPACITY};
      }
    `;
    document.head.appendChild(style);
  }
};

// 初始化样式注入
createHoverStyle();

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

    // 使用反向查找保留最后一个匹配项
    for (let i = conditionMatchers.length - 1; i >= 0; i--) {
      if (conditionMatchers[i].match(elementPath)) {
        targetStyle = conditionMatchers[i].style;
        break;
      }
    }

    if (targetStyle) {
      // 设置基础样式
      element.style.color = targetStyle.fontColor;
      element.style.backgroundColor = targetStyle.backColor;

      // 设置 CSS 变量供伪元素使用
      element.style.setProperty("--hover-color", targetStyle.fontColor);

      // 同步删除按钮颜色
      const removeBtn = element.querySelector<HTMLElement>(
        `.${REMOVE_BUTTON_CLASS}`
      );
      removeBtn && (removeBtn.style.color = targetStyle.fontColor);
    }
  });
}
