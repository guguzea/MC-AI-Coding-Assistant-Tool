---
description: 01 — BaseMod（仅安全表）
---

# 01 — BaseMod（仅安全表）

见 `knowledge/common/safe-api.md`。禁止 `DeferredRegister`、禁止 `func_*`。

## 逐步

1. 类名 `mod_<Name> extends BaseMod`。
2. `getVersion()` 返回字符串。
3. `load()` 里 `ModLoader.registerBlock` / 构造 `Item`。
4. `modsLoaded()` 做依赖后初始化。
5. 合成 `ModLoader.addRecipe`；显示名 `addName` / `addLocalization`。
