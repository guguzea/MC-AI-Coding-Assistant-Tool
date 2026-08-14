---
description: 07 — 数据（无 DataGen）
---

# 07 — 数据（无 DataGen）

1.12 **没有** Forge 1.20 DataGen。禁止调用 `generate_datagen`。

手写：

- `assets/<modid>/` 纹理、lang、sounds.json
- 纯客户端通常无 `data/` 配方；混合工程配方走 Forge 1.12 的 json/`GameRegistry.addRecipe`，读 `forge/1.12.2`
