# cube_all 资源三元组（示范）

平台：Forge/Fabric 通用资源 · 依赖：mc-model、`authored/multi-face-block-models`

注册名 `example_block` 时，三文件路径与 id 对齐。

**blockstates/example_block.json**

```json
{
  "variants": {
    "": { "model": "modid:block/example_block" }
  }
}
```

**models/block/example_block.json**

```json
{
  "parent": "minecraft:block/cube_all",
  "textures": {
    "all": "modid:block/example_block"
  }
}
```

**models/item/example_block.json**

```json
{
  "parent": "modid:block/example_block"
}
```

贴图：`assets/modid/textures/block/example_block.png`。

常见坑：模型里写了 `modid:block/foo` 但注册名是 `bar` → 紫黑块；复杂机器多面贴图勿硬套 `cube_all` → 见 `authored/multi-face-block-models`。
