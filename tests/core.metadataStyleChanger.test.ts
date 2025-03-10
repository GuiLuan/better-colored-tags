import metadataStyleChanger from "../src/core/metadataStyleChanger";

describe("metadataStyleChanger in metadata", () => {
  const MOCK_STYLES = [
    { id: "mock1", text: "tag1", fontColor: "#000", backColor: "#fff" },
    { id: "mock2", text: "tag2", fontColor: "#fff", backColor: "#000" },
  ];

  let metadataContainer: HTMLElement | null = null;

  beforeEach(() => {
    metadataContainer = setupDOM();
    metadataStyleChanger(document, MOCK_STYLES);
  });

  afterEach(() => {
    metadataContainer?.parentNode?.removeChild(metadataContainer);
  });

  const createPill = (tag: string) => `
    <div class="multi-select-pill">
      <div class="multi-select-pill-content">
        <span>${tag}</span>
      </div>
      <div class="multi-select-pill-remove-button">
        <svg></svg>
      </div>
    </div>
  `;

  const setupDOM = (): HTMLElement => {
    const container = document.createElement("div");
    container.innerHTML = `
      <div class="metadata-container">
        <div class="metadata-content">
          <div class="metadata-properties">
            <div class="metadata-property" data-property-key="tags">
              <div class="metadata-property-value">
                <div class="multi-select-container">
                  ${MOCK_STYLES.map((style) => createPill(style.text)).join("")}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    const element = container.querySelector<HTMLElement>(".metadata-container");
    if (!element) {
      throw new Error("测试环境初始化失败：无法找到 metadata 容器");
    }

    document.body.appendChild(element);
    return element;
  };

  const getPillElements = () => {
    const pills = document.querySelectorAll<HTMLElement>(".multi-select-pill");
    if (pills.length !== MOCK_STYLES.length) {
      throw new Error(
        `检测到 ${pills.length} 个标签，但应有 ${MOCK_STYLES.length} 个`
      );
    }
    return pills;
  };

  test("tag.color = fontColor, tag.bgc = backgroundColor", () => {
    const pills = getPillElements();

    MOCK_STYLES.forEach((style, index) => {
      const tag = pills[index].querySelector<HTMLElement>(
        ".multi-select-pill-content"
      );
      expect(tag).toHaveStyle({
        color: style.fontColor,
        backgroundColor: style.backColor,
      });
    });
  });

  test("removeButton.color = fontColor", () => {
    const pills = getPillElements();

    MOCK_STYLES.forEach((style, index) => {
      const btn = pills[index].querySelector<HTMLElement>(
        ".multi-select-pill-remove-button"
      );
      expect(btn).toHaveStyle({
        color: style.fontColor,
      });
    });
  });
});
