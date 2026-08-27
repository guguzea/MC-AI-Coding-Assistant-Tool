# 资源包格式速查（1.12.2）

## pack.mcmeta

```json
{
  "pack": {
    "description": "My Resource Pack",
    "pack_format": 4
  }
}
```

> 1.12.2 的 pack_format = **4**。

## 目录结构

```
assets/{modid}/
├── blockstates/     # 方块状态 JSON
├── lang/          # 语言文件（.lang 格式，不是 .json）
│   └── en_us.lang
├── models/
│   ├── block/   # 方块模型（.json）
│   └── item/    # 物品模型（.json）
└── textures/
    ├── block/   # 方块纹理（.png）
    ├── entity/   # 实体纹理
    └── item/     # 物品纹理
```

## 方块状态 JSON

```json
// blockstates/my_block.json
{
  "variants": {
    "": { "model": "examplemod:block/my_block" }
  }
}
```

## 方块模型 JSON

```json
// models/block/my_block.json
{
  "parent": "block/cube_all",
  "textures": {
    "all": "examplemod:block/my_block"
  }
}
```

## 语言文件（.lang 格式）

> 重要：1.12.2 使用 **.lang 格式**，不是 .json！

```
# en_us.lang
item.examplemod.my_item.name=My Item
tile.examplemod.my_block.name=My Block
entity.examplemod.my_entity.name=My Entity
```

## 常见错误

- ❌ 语言文件使用 .json 格式（1.12.2 必须用 .lang）
- ❌ 纹理路径包含大写字母
- ❌ blockstates 引用不存在的模型路径
- ❌ pack_format 版本错误（1.12.2 = 4）
