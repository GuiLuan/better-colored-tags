/* 创建匹配器，匹配器会检查传入串是否为匹配串的子集 */
function createPathMatcher(conditionPath: string[]) {
  return (elementPath: string[]) => {
    if (conditionPath.length > elementPath.length) return false;
    for (let i = 0; i < conditionPath.length; i++) {
      if (conditionPath[i] !== elementPath[i]) return false;
    }
    return true;
  };
}

export { createPathMatcher };
