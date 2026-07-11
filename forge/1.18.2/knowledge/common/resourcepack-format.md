# 资源包格式速查（1.18.2）

## pack.mcmeta

```json
{
  "pack": {
    "pack_format": 8,
    "description": "My Resource Pack"
  }
}
```

> 1.18.x 的 pack_format = **8**，与数据包相同。

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
- ❌ lang 文件中 namespace 和路径分隔符用 `.` 而非 `:`（应为 `item.examplemod.my_item`）
- ❌ 模型 JSON 缺少必要的 `parent` 字段
- ❌ pack_format 错误（1.18.2 用 **8**，不是 15）

## 参考

- Minecraft Wiki：https://minecraft.wiki/w/Tutorials/Resource_pack
- pack_format 完整列表：https://minecraft.wiki/w/Tutorials/Creating_a_data_pack#pack_format
