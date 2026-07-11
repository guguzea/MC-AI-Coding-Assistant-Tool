# DataGen 模式（Fabric 1.17.1）

> ⚠️ **强烈推荐：对于 Fabric 1.17.1，直接手写 JSON 文件！**
>
> 1.17.1 的 DataGen API 仍处于实验阶段，且与 1.20.x 差异很大。手动创建 JSON 文件更可靠、更易维护。

## ⚠️ 1.17.x 关键差异

- **DataGen API 不稳定**：建议手写 JSON
- **数据包格式**：1.17.x 使用 `pack_format: 6`

## 模式 1：手写语言文件 JSON

```yaml
模式: Language JSON
平台: Fabric 1.17.1
分类: datagen
依赖: []
---
# assets/{modid}/lang/en_us.json
{
    "item.{modid}.my_item": "My Item",
    "block.{modid}.my_block": "My Block",
    "entity.{modid}.my_entity": "My Entity"
}

# assets/{modid}/lang/zh_cn.json
{
    "item.{modid}.my_item": "我的物品",
    "block.{modid}.my_block": "我的方块",
    "entity.{modid}.my_entity": "我的实体"
}
```

## 模式 2：手写配方 JSON

```yaml
模式: Recipe JSON
平台: Fabric 1.17.1
分类: datagen
依赖: []
---
# data/{modid}/recipes/my_item.json (Shaped)
{
    "type": "minecraft:crafting_shaped",
    "pattern": [
        "AAA",
        " A ",
        " A "
    ],
    "key": {
        "A": {
            "item": "minecraft:diamond"
        }
    },
    "result": {
        "item": "{modid}:my_item"
    }
}

# data/{modid}/recipes/my_tool.json (Shapeless)
{
    "type": "minecraft:crafting_shapeless",
    "ingredients": [
        {"item": "minecraft:diamond"},
        {"item": "minecraft:stick"}
    ],
    "result": {
        "item": "{modid}:my_tool",
        "count": 1
    }
}

# data/{modid}/recipes/my_smelting.json (Smelting)
{
    "type": "minecraft:smelting",
    "ingredient": {
        "item": "minecraft:cobblestone"
    },
    "result": "minecraft:stone",
    "experience": 0.1,
    "cookingtime": 200
}
```

## 模式 3：手写战利品表 JSON

```yaml
模式: Loot Table JSON
平台: Fabric 1.17.1
分类: datagen
依赖: []
---
# data/{modid}/loot_tables/blocks/my_block.json
{
    "type": "minecraft:block",
    "pools": [
        {
            "rolls": 1,
            "entries": [
                {
                    "type": "minecraft:item",
                    "name": "{modid}:my_block"
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

## 模式 4：手写标签 JSON

```yaml
模式: Tag JSON
平台: Fabric 1.17.1
分类: datagen
依赖: []
---
# data/{modid}/tags/blocks/my_tag.json
{
    "replace": false,
    "values": [
        "minecraft:diamond_block",
        "{modid}:my_block"
    ]
}

# data/{modid}/tags/items/my_tag.json
{
    "replace": false,
    "values": [
        "minecraft:diamond",
        "{modid}:my_item"
    ]
}
```

## 模式 5：手写方块状态/模型 JSON

```yaml
模式: Block Model JSON
平台: Fabric 1.17.1
分类: datagen
依赖: []
---
# blockstates/{modid}_my_block.json
{
    "variants": {
        "": {"model": "{modid}:block/my_block"}
    }
}

# models/block/my_block.json
{
    "parent": "minecraft:block/cube_all",
    "textures": {
        "all": "{modid}:block/my_block"
    }
}

# models/item/my_block.json
{
    "parent": "{modid}:block/my_block"
}
```

---

## DataGen（如果必须使用，实验性）

```yaml
模式: DataGen (Experimental)
平台: Fabric 1.17.1
分类: datagen
依赖: [fabric-datagen-api-v0]
入口点: init (不是 init_data)
---
public class MyDataGen implements DataGeneratorInitializer {
    @Override
    public void onInitializeDataGenerator(FabricDataGenerator fabricDataGenerator) {
        FabricDataGenerator.Pack pack = fabricDataGenerator.createPack();
        // 添加 Provider...
    }
}
```
