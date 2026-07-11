---
name: mc-datagen
description: Minecraft Forge 数据生成器。手动编写配方、战利品表、标签等 JSON 文件。触发词：DataGen、DataGenerator、LootTables、Recipes、BlockStates、TagProvider
platform: forge
version: "1.14.4"
---

# 数据生成器（Forge 1.14.4）

## 重要提示

> **Forge 1.14.4 的 DataGen 功能非常有限**。大部分资源文件需要**手动编写 JSON**。仅在 DataGen 明确支持的功能上使用 DataGen。

## 手动编写资源文件

### 配方 JSON

文件位置：`data/{modid}/recipes/my_recipe.json`

```json
{
  "type": "minecraft:crafting_shaped",
  "pattern": [
    " X ",
    " X ",
    " Y "
  ],
  "key": {
    "X": { "item": "minecraft:diamond" },
    "Y": { "item": "minecraft:stick" }
  },
  "result": { "item": "mymod:my_item", "count": 1 }
}
```

### 战利品表

文件位置：`data/{modid}/loot_tables/blocks/my_block.json`

```json
{
  "type": "minecraft:block",
  "pools": [
    {
      "rolls": 1,
      "entries": [
        {
          "type": "minecraft:item",
          "name": "mymod:my_item"
        }
      ],
      "conditions": [
        {
          "condition": "minecraft:survives_explosion"
        }
      ]
    }
  ]
}
```

### 方块标签

文件位置：`data/{modid}/tags/blocks/my_tag.json`

```json
{
  "replace": false,
  "values": [
    "mymod:my_block",
    "minecraft:stone"
  ]
}
```

### 方块状态 JSON

文件位置：`assets/{modid}/blockstates/my_block.json`

```json
{
  "variants": {
    "": { "model": "mymod:block/my_block" }
  }
}
```

### 物品模型 JSON

文件位置：`assets/{modid}/models/item/my_item.json`

```json
{
  "parent": "mymod:block/my_block"
}
```

## DataGenerators 入口类（有限支持）

```java
@Mod.EventBusSubscriber(modid = MOD_ID, bus = Mod.EventBusSubscriber.Bus.MOD)
public class DataGenerators {
    @SubscribeEvent
    public static void gatherData(GatherDataEvent event) {
        DataGenerator generator = event.getGenerator();
        PackOutput output = generator.getPackOutput();

        if (event.includeServer()) {
            // 配方
            generator.addProvider(true, new ModRecipeProvider(output));
            // 战利品表
            generator.addProvider(true, new ModLootTableProvider(output));
        }
    }
}
```

## 常见错误

- ❌ 期望 DataGen 生成所有资源 → 1.14.4 大部分需要手动编写
- ❌ 标签 JSON 格式错误 → 必须是 `{ "values": [...] }` 格式
- ❌ 方块状态 JSON 路径错误 → `blockstates/` 不是 `block_states/`

## 参考资料

- 详细示例：参见 `07-datagen.mdc`

## 扩展点

| 配合 Skill | 协作说明 |
|-----------|---------|
| `mc-registry` | 注册完成后方可生成对应标签和配方 |
| `mc-compat-jei` | 手动编写的配方 JSON 自动被 JEI 读取 |
