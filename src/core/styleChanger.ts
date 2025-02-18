import { TagColorMappingDataType } from "ui/components/TagColorMapping";
import BASE_SELECTORS from "./selectors";

export default function styleChanger(
  dom: Document | HTMLElement,
  conditions: Array<TagColorMappingDataType>
) {
  const tags = dom.querySelectorAll<HTMLElement>(BASE_SELECTORS.join(", "));
  tags.forEach((tag) => {
    conditions.map((condition) => {
      const tagArray = condition.text.split(",").map((text) => text.trim());
      tagArray.forEach((_tag) => {
        if (_tag === tag.textContent?.replace(/#/g, "")) {
          tag.style.color = condition.fontColor;
          tag.style.backgroundColor = condition.backColor;
        }
      });
    });
  });
}
