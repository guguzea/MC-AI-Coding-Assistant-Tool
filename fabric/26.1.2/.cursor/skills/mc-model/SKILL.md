---
name: mc-model
description: Fabric 26.1.2 方块模型 JSON。触发词：block model、parent、textures、elements
platform: fabric
version: "26.1.2"
dependencies: []
mappings: official
---

# 方块模型（Fabric 26.1.2）

文档：`26.1.2/develop_blocks_block-models`。模型是 JSON：贴图、平移、旋转、缩放。文件从空的 root object `{}` 开始按官方结构填。

不要在 Java 里 `new BlockModel()`。DataGen 生成模型见 `mc-datagen`。细节元素表以该页 File Structure 为准；核不到的键不要编。

## Decision Flow

```
IF 普通方块外观
  → assets/<modid>/models/block/*.json（文档 block-models）
IF 程序生成
  → mc-datagen
IF 实体模型
  → mc-entity（LayerDefinition），不是本页 JSON
```

## 常见错误

- ❌ Yarn 路径当本档必写名
- ❌ 把实体 Cuboid 模型当方块 JSON
