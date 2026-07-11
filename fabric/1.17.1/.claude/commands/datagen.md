# Fabric 数据生成命令参考

本文件描述 Fabric 1.17.1 平台上进行数据生成时所需掌握的核心 API 和常用命令。

## 基础配置命令

> ⚠️ **推荐**：1.17.1 的 DataGen API 较繁琐且实验性强，**推荐直接手写 JSON 文件**而非使用 DataGen。

### 手动生成资源 JSON（推荐）

对于方块模型、物品模型、配方、语言文件等，推荐直接在 `src/main/resources/` 目录下创建 JSON 文件。文件路径示例：
- `assets/{modid}/models/item/my_item.json` — 物品模型
- `assets/{modid}/models/block/my_block.json` — 方块模型
- `data/{modid}/recipes/my_recipe.json` — 配方
- `assets/{modid}/lang/en_us.json` — 语言文件

### 物品模型 JSON 示例

```json
{
  "parent": "minecraft:item/generated",
  "textures": {
    "layer0": "examplemod:item/my_item"
  }
}
```

### 方块模型 JSON 示例

```json
{
  "parent": "minecraft:block/cube_all",
  "textures": {
    "all": "examplemod:block/my_block"
  }
}
```

### 配方 JSON 示例

```json
{
  "type": "minecraft:crafting_shaped",
  "pattern": ["AAA", "A A", " AAA"],
  "key": { "A": { "item": "minecraft:diamond" } },
  "result": { "item": "examplemod:my_item", "count": 1 }
}
```

### 语言文件 JSON 示例

```json
{
  "item.examplemod.my_item": "My Item",
  "block.examplemod.my_block": "My Block"
}
```

### DataGen 依赖（如必须使用）

```groovy
dependencies {
    modImplementation "net.fabricmc.fabric-api:fabric-datagen-api-v0:0.7.3+1.17.1"
}
```

### fabric.mod.json 配置

```json
{
  "entrypoints": {
    "main": ["com.example.ExampleMod"],
    "init": ["com.example.MyDatagen"]  // 1.17.x 用 "init"
  }
}
```

## 注意事项

1.17.1 的 DataGen API 文档较少，与 1.20.x 差异很大。**推荐直接手写 JSON 文件**以确保稳定性和可维护性。
