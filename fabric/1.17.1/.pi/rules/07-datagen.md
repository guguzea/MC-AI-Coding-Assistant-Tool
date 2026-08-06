---
description: 07 — 数据生成器
---

# 07 — 数据生成器

> 适用版本：Fabric 1.17.1

---

## 约束

### 核心原则

- Fabric 1.17.1 的数据生成器 API 与 1.20.x 有显著差异
- 建议手动编写 JSON 文件而非依赖 DataGen（1.17.1 DataGen API 较繁琐）
- 如使用 DataGen，需引入 `fabric-datagen-api-v0` 模块

---

## Decision Flow

### Decision: 选择数据生成方式

```
IF 生成 配方 / 战利品表 / 进度 / 语言文件
  → 推荐直接手写 JSON 到 src/main/resources/data/{modid}/
  → 避免复杂的 DataGen 配置

IF 生成 物品/方块模型 JSON
  → 手写 JSON 到 src/main/resources/assets/{modid}/
  → 参考 Minecraft 原版模型的 JSON 格式

IF 必须使用 DataGen（保持代码驱动）
  → 引入 fabric-datagen-api-v0
  → 1.17.1 的入口点和工作方式与 1.20.x 不同
```

---

## 手动生成资源 JSON（推荐）

### 物品模型 JSON

```json
// src/main/resources/assets/examplemod/models/item/my_item.json
{
  "parent": "minecraft:item/generated",
  "textures": {
    "layer0": "examplemod:item/my_item"
  }
}
```

### 方块模型 JSON

```json
// src/main/resources/assets/examplemod/models/block/my_block.json
{
  "parent": "minecraft:block/cube_all",
  "textures": {
    "all": "examplemod:block/my_block"
  }
}
```

### 配方 JSON

```json
// src/main/resources/data/examplemod/recipes/my_recipe.json
{
  "type": "minecraft:crafting_shaped",
  "pattern": [
    "AAA",
    "A A",
    " AAA"
  ],
  "key": {
    "A": {
      "item": "minecraft:diamond"
    }
  },
  "result": {
    "item": "examplemod:my_item",
    "count": 1
  }
}
```

### 语言文件

```json
// src/main/resources/assets/examplemod/lang/en_us.json
{
  "item.examplemod.my_item": "My Item",
  "block.examplemod.my_block": "My Block"
}
```

---

## DataGen（可选，复杂度较高）

### 添加 DataGen 依赖

```groovy
// build.gradle
dependencies {
    modImplementation "net.fabricmc.fabric-api:fabric-datagen-api-v0:0.7.3+1.17.1"
}
```

### 注册 DataGeneratorInitializer

```json
// fabric.mod.json
{
  "entrypoints": {
    "init": ["com.example.examplemod.MyDatagen"]
  }
}
```

> ⚠️ **1.17.1 DataGen 限制**：DataGen 在 1.17.1 中是实验性功能，API 经常变化。推荐使用手动 JSON 以确保稳定性。

---

## 常见错误

- ❌ 忘记在 `fabric.mod.json` 中注册 `init` entrypoint — DataGen 不执行
- ❌ 引用未注册的资源 — 游戏找不到资源文件
- ❌ DataGen 使用 1.20.x API — 1.17.1 DataGen API 完全不同

## 扩展点

| 配合 Skill | 协作说明 |
|-----------|---------|
| `mc-item` | 手写物品模型 JSON |
| `mc-block` | 手写方块模型和掉落表 JSON |
| `mc-registry` | 配方引用已注册的物品 |
