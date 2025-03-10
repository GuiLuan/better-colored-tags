import { useEffect, useReducer } from "react";
import { IoAddCircleOutline } from "react-icons/io5";

import { Button, TagColorMapping } from "ui/components";
import type { TagColorMappingData } from "ui/components/TagColorMapping";

export default function SettingPage({
  readSetting,
  writeSetting,
}: SettingPageProps) {
  const [setting, dispatchSetting] = useReducer(settingReducer, {
    maps: [],
  });

  useEffect(() => {
    const loadLocalSetting = async () => {
      const localSetting = await readSetting();

      dispatchSetting({
        type: "read",
        writeSetting: writeSetting,
        payload: { settings: { ...setting, ...localSetting } },
      });
    };

    loadLocalSetting();
  }, []);

  return (
    <div>
      <div style={styles.head}>
        <span>添加颜色标签组</span>
        <Button
          icon={<IoAddCircleOutline />}
          onClick={() =>
            dispatchSetting({
              type: "add",
              writeSetting: writeSetting,
              payload: {
                addMap: {
                  id: Array(12)
                    .fill(undefined)
                    .map(() => Math.random().toString(36).slice(2))
                    .join("")
                    .slice(0, 12),
                  fontColor: "#000",
                  backColor: "#fff",
                  text: "",
                },
              },
            })
          }
        />
      </div>
      <div>
        {setting.maps.map((map) =>
          Object.keys(map).length > 0 ? (
            <TagColorMapping
              key={map.id}
              style={styles.listItem}
              {...(map as TagColorMappingData)}
              onFontColorChange={(color: string) => {
                dispatchSetting({
                  type: "update",
                  writeSetting: writeSetting,
                  payload: {
                    updateMap: {
                      ...(map as TagColorMappingData),
                      fontColor: color,
                    },
                  },
                });
              }}
              onBackColorChange={(color: string) =>
                dispatchSetting({
                  type: "update",
                  writeSetting: writeSetting,
                  payload: {
                    updateMap: {
                      ...(map as TagColorMappingData),
                      backColor: color,
                    },
                  },
                })
              }
              onTextChange={(text: string) =>
                dispatchSetting({
                  type: "update",
                  writeSetting: writeSetting,
                  payload: {
                    updateMap: {
                      ...(map as TagColorMappingData),
                      text: text,
                    },
                  },
                })
              }
              onDelete={() => {
                dispatchSetting({
                  type: "delete",
                  writeSetting: writeSetting,
                  payload: {
                    delMapId: map.id,
                  },
                });
              }}
            />
          ) : null
        )}
      </div>
    </div>
  );
}

interface SettingPageProps {
  readSetting: () => Promise<SettingDataType>;
  writeSetting: (data: SettingDataType) => Promise<void>;
}

export interface SettingDataType {
  maps: Array<TagColorMappingData | Record<string, never>>;
}

const styles: Record<string, React.CSSProperties> = {
  head: {
    display: "flex",
    alignItems: "center",
    justifyItems: "center",
    gap: "5px",
    marginBottom: "10px",
  },
  listItem: {
    marginTop: "5px",
    marginBottom: "5px",
  },
};

const settingReducer = (
  state: SettingDataType,
  action: SettingAction
): SettingDataType => {
  switch (action.type) {
    case "add": {
      const result = {
        maps: [...state.maps, action.payload.addMap],
      };
      action.writeSetting(result);
      return result;
    }
    case "delete": {
      const result = {
        maps: state.maps.filter((map) => map.id !== action.payload.delMapId),
      };
      action.writeSetting(result);
      return result;
    }
    case "update": {
      const result = {
        maps: state.maps.map((map) =>
          map.id === action.payload.updateMap.id
            ? action.payload.updateMap
            : map
        ),
      };
      action.writeSetting(result);
      return result;
    }
    case "read": {
      const result = action.payload.settings;
      action.writeSetting(result);
      return result;
    }
  }
};

type SettingAction = AddAction | DelAction | UpdateAction | ReadAction;

interface BaseAction {
  type: string;
  writeSetting: (setting: SettingDataType) => Promise<void>;
}

interface ReadAction extends BaseAction {
  type: "read";
  payload: {
    settings: SettingDataType;
  };
}

interface AddAction extends BaseAction {
  type: "add";
  payload: {
    addMap: TagColorMappingData;
  };
}

interface DelAction extends BaseAction {
  type: "delete";
  payload: {
    delMapId: TagColorMappingData["id"];
  };
}

interface UpdateAction extends BaseAction {
  type: "update";
  payload: {
    updateMap: TagColorMappingData;
  };
}
