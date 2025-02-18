import { App, Plugin, PluginSettingTab } from "obsidian";
import { StrictMode } from "react";
import { Root, createRoot } from "react-dom/client";

import { AppContext } from "ctx";
import SettingPage, { SettingDataType } from "ui/pages/SettingPage";
import styleChanger from "core/styleChanger";

const DEFAULT_SETTINGS: SettingDataType = {
  maps: [],
};

export default class BCT extends Plugin {
  async onload() {
    this.app.workspace.on("quick-preview", async () => {
      const { maps } = await this.loadSettings();
      styleChanger(this.app.workspace.containerEl, maps);
    });

    this.app.workspace.on("file-open", async () => {
      const { maps } = await this.loadSettings();
      styleChanger(this.app.workspace.containerEl, maps);
    });

    this.addSettingTab(new BCTSettingTab(this.app, this));
  }

  async onunload() {}

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
        <AppContext.Provider value={this.app}>
          <SettingPage
            readSetting={this.plugin.loadSettings}
            writeSetting={this.plugin.saveSettings}
          />
        </AppContext.Provider>
      </StrictMode>
    );
  }

  hide(): void {
    this.root?.unmount();
  }
}
