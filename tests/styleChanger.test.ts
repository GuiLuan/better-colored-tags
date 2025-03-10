import styleChanger from "../src/core/styleChanger";

describe("styleChanger 标签样式修改", () => {
  const MOCK_STYLES = [
    { id: "mock1", text: "tag1", fontColor: "#000", backColor: "#fff" },
    { id: "mock2", text: "tag2", fontColor: "#fff", backColor: "#000" },
  ];

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

  let metadataContainer: HTMLElement | null = null;

  beforeEach(() => {
    metadataContainer = setupDOM();
    styleChanger(document, MOCK_STYLES);
  });

  afterEach(() => {
    metadataContainer?.parentNode?.removeChild(metadataContainer);
  });

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
    const pills = document.querySelectorAll<HTMLElement>(
      ".multi-select-pill-content"
    );
    if (pills.length !== MOCK_STYLES.length) {
      throw new Error(
        `检测到 ${pills.length} 个标签，但应有 ${MOCK_STYLES.length} 个`
      );
    }
    return pills;
  };

  test("应为每个标签应用对应的颜色样式", () => {
    const pills = getPillElements();

    MOCK_STYLES.forEach((style, index) => {
      expect(pills[index]).toHaveStyle({
        color: style.fontColor,
        backgroundColor: style.backColor,
      });
    });
  });
});
