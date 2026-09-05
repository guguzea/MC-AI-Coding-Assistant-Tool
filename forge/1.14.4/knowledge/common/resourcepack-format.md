# 资源包格式速查（1.14.4）

## pack.mcmeta

```json
{
  "pack": {
    "pack_format": 4,
    "description": "My Resource Pack"
  }
}
```

> 1.14.4 的资源包 pack_format = **4**：官方 1.14.4-28.2.26 MDK `src/main/resources/pack.mcmeta` = `"pack_format": 4`（sha256 见 `mcp-server/data/mdk-checksums.json`，`source=official`），本包 `scaffold/src/main/resources/pack.mcmeta` 同为 4；同文件 `knowledge/common/datapack-format.md` 也是 4。原写 5 是 1.15.x 的号。
> 1.18 之前数据包与资源包共用同一个 `pack_format`；**1.18 起分家**（1.18.2 = 资源 8 / 数据 9），不要把「相同格式」外推到 1.18+。

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
    "facing=west,powered=false":  { "model": "examplemod:block/my_block", "y": 270 }
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
  "block.examplemod.my_block": "My Block"
}
```

## 常见错误

- ❌ 纹理路径包含大写字母（`block/MyBlock.png` → 改为 `block/myblock.png`）
- ❌ blockstates 引用不存在的模型路径
- ❌ lang 文件中 namespace 和路径分隔符用 `.` 而非 `:`（应为 `item.examplemod.my_item`）
- ❌ 模型 JSON 缺少必要的 `parent` 字段

## 参考

- Minecraft Wiki：https://minecraft.wiki/w/Tutorials/Resource_pack
- pack_format 完整列表：https://minecraft.wiki/w/Tutorials/Creating_a_data_pack#pack_format
