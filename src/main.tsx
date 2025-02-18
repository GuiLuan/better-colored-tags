import { App, Plugin, PluginSettingTab } from "obsidian";
import { StrictMode } from "react";
import { Root, createRoot } from "react-dom/client";

import SettingPage, { SettingDataType } from "ui/pages/SettingPage";
import styleChanger from "core/styleChanger";

const DEFAULT_SETTINGS: SettingDataType = {
  maps: [],
};

export default class BCT extends Plugin {
  async onload() {
    this.app.workspace.on("quick-preview", () =>
      this.handleStyleChange(this.app.workspace.containerEl)
    );
    this.app.workspace.on("file-open", () =>
      this.handleStyleChange(this.app.workspace.containerEl)
    );

    this.addSettingTab(new BCTSettingTab(this.app, this));
  }

  async onunload() {}

  private handleStyleChange = async (container: HTMLElement) => {
    const { maps } = await this.loadSettings();
    styleChanger(container, maps);
  };

  loadSettings = async () => {
    return Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  };
  saveSettings = async (setting: SettingDataType) => {
    await this.saveData(setting);
  };
}

class BCTSettingTab extends PluginSettingTab {
  plugin: BCT;
  root: Root | null = null;

  constructor(app: App, plugin: BCT) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    const { containerEl } = this;
    containerEl.empty();

    this.root = createRoot(containerEl);

    this.root.render(
      <StrictMode>
        <SettingPage
          readSetting={this.plugin.loadSettings}
          writeSetting={this.plugin.saveSettings}
        />
      </StrictMode>
    );
  }

  hide(): void {
    this.root?.unmount();
    this.root = null; // 显式置空防止内存泄漏
  }
}
