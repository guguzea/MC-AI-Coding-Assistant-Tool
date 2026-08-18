---
description: 07 — 数据生成器
---

# 07 — 数据生成器

> 适用版本：Fabric 1.14.4

---

## 约束

### 核心原则

- Fabric 1.14.4 **没有** `fabric-datagen` / `DataGeneratorEntrypoint`（那是 1.17+）
- 配方、战利品表、标签、模型、语言都靠 **手写 JSON** 放到 `src/main/resources/`
- 手动 JSON 遵循当时的数据包 / 资源包格式
- **禁止**编造 `DataGeneratorInitializer`、`init_data`、`ExistingFileHelper`
- **禁止**手动编辑 Loom 管理的生成目录（如果工程里有）

---

## Decision Flow

### Decision: 选择生成数据类型

```
IF 生成物品/方块模型 JSON
  → 手动编写 JSON 在 src/main/resources/assets/{modid}/models/

IF 生成语言文件
  → 手动编写 JSON 在 src/main/resources/assets/{modid}/lang/

IF 生成配方/战利品表/进度
  → 手动编写 JSON 在 src/main/resources/data/{modid}/

IF 生成标签（tags）
  → 手动编写 JSON 在 src/main/resources/data/{modid}/tags/
```

---

## 手动资源文件（推荐方式）

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

### 语言文件

```json
// src/main/resources/assets/examplemod/lang/en_us.json
{
  "item.examplemod.my_item": "My Item",
  "block.examplemod.my_block": "My Block",
  "entity.examplemod.my_entity": "My Entity"
}
```

### 方块状态 JSON

```json
// src/main/resources/assets/examplemod/blockstates/my_block.json
{
  "variants": {
    "": { "model": "examplemod:block/my_block" }
  }
}
```

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
    "AAA"
  ],
  "key": {
    "A": { "item": "minecraft:diamond" }
  },
  "result": {
    "item": "examplemod:my_item",
    "count": 1
  }
}
```


## 运行

```bash
./gradlew build
```

手写资源随 jar 打包，没有 `runDatagen` 这一步。

## 常见错误

- ❌ 去写 `DataGeneratorInitializer` / `init_data` — 1.14.4 没有 fabric-datagen
- ❌ 引用未注册的资源 — 游戏找不到模型或配方
- ❌ 语言文件放错目录 — 应在 `assets/{modid}/lang/`

## 扩展点

| 配合 Skill | 协作说明 |
|-----------|---------|
| `mc-item` | 手写物品模型 JSON |
| `mc-block` | 手写方块模型和掉落表 JSON |
| `mc-registry` | 配方引用已注册的物品 |
