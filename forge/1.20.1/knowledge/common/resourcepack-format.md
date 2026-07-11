# 资源包格式速查（1.20.1）

## pack.mcmeta

```json
{
  "pack": {
    "pack_format": 15,
    "description": "My Resource Pack"
  }
}
```

> 1.20–1.20.1 的 pack_format = **15**，与数据包相同。

## 目录结构

```
assets/<namespace>/
├── blockstates/     # 方块状态 JSON
├── fonts/           # 自定义字体
├── gui/             # 按钮、进度条等 GUI 元素
├── lang/            # 国际化语言文件
│   ├── en_us.json
│   └── zh_cn.json
├── models/
│   ├── block/      # 方块模型（.json）
│   └── item/      # 物品模型（.json）
├── particles/      # 粒子效果 JSON
├── shaders/        # 着色器
└── textures/
    ├── block/     # 方块纹理（.png）
    ├── entity/    # 实体纹理
    ├── item/      # 物品纹理
    └── misc/      # 其他纹理
```

## 方块状态 JSON

```json
// assets/examplemod/blockstates/my_block.json
{
  "variants": {
    "": { "model": "examplemod:block/my_block" }
  }
}
```

```json
// 带属性变体
{
  "variants": {
    "facing=north,powered=false": { "model": "examplemod:block/my_block" },
    "facing=south,powered=false": { "model": "examplemod:block/my_block", "y": 180 },
    "facing=east,powered=false":  { "model": "examplemod:block/my_block", "y": 90 },
    "facing=west,powered=false":  { "model": "examplemod:block/my_block", "y": 270 },
    "facing=north,powered=true":  { "model": "examplemod:block/my_block_on" },
    "facing=south,powered=true":  { "model": "examplemod:block/my_block_on", "y": 180 },
    "facing=east,powered=true":   { "model": "examplemod:block/my_block_on", "y": 90 },
    "facing=west,powered=true":   { "model": "examplemod:block/my_block_on", "y": 270 }
  }
}
```

## 方块模型 JSON

```json
// assets/examplemod/models/block/my_block.json
{
  "parent": "minecraft:block/cube_all",
  "textures": {
    "all": "examplemod:block/my_block"
  }
}
```

```json
// 物品使用方块模型（生成 items/generated 时用 item/generated）
{
  "parent": "examplemod:block/my_block",
  "display": {
    "gui": {
      "rotation": [30, 225, 0],
      "translation": [0, 0, 0],
      "scale": [0.625, 0.625, 0.625]
    }
  }
}
```

## 物品模型 JSON

```json
// 手持物品（从方块继承）
{
  "parent": "examplemod:block/my_block"
}

// 物品独立模型（叠加显示）
{
  "parent": "minecraft:item/generated",
  "textures": {
    "layer0": "examplemod:item/my_item"
  }
}
```

## lang 文件

```json
// assets/examplemod/lang/en_us.json
{
  "item.examplemod.my_item": "My Item",
  "block.examplemod.my_block": "My Block",
  "entity.examplemod.my_entity": "My Entity"
}
```

## 常见错误

- ❌ 纹理路径包含大写字母（`block/MyBlock.png` → 改为 `block/myblock.png`）
- ❌ blockstates 引用不存在的模型路径
- ❌ lang 文件中 namespace 和路径分隔符用 `.` 而非 `:`（应为 `item.examplemod.my_item`，`block.examplemod.my_block` 是正确的）
- ❌ 模型 JSON 缺少必要的 `parent` 字段
- ❌ 物品模型使用 `minecraft:block/my_block` 但没有定义 `blockstates`

## Forge 模型层叠

在 Forge 资源包中，可以在 `assets/<modid>/models/item/` 中覆盖原版模型。

## 参考

- Minecraft Wiki：https://minecraft.wiki/w/Tutorials/Resource_pack
- pack_format 完整列表：https://minecraft.wiki/w/Tutorials/Creating_a_data_pack#pack_format
