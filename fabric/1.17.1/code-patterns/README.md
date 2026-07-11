# Fabric 1.17.1 代码模式库

> 本目录为 AI 提供可直接引用的代码模式，按「功能」分类。
> 参见 `../.cursor/rules/` 中的决策流文档以了解何时使用哪种模式。

```
code-patterns/
├── 01-block-patterns.md       # 方块相关模式
├── 02-item-patterns.md        # 物品/工具模式
├── 03-entity-patterns.md      # 实体相关模式
├── 04-mixin-patterns.md       # Mixin 最佳实践（Fabric 独有）
├── 05-fabric-api-patterns.md  # Fabric API 模块使用模式（Fabric 独有）
├── 06-datagen-patterns.md     # DataGen 快速参考（推荐手写 JSON）
└── README.md                  # 本文件
```

## ⚠️ 1.17.x 关键差异

1. **没有 `Registries` 类！** 使用 `Registry.BLOCK`、`Registry.ITEM` 等静态字段
2. **没有 `RegistrySupplier`！** 直接用静态字段持有注册后的对象
3. **Loom 版本必须是 `0.11-SNAPSHOT`**
4. **Fabric API maven 是 `net.fabricmc.fabric-api`**

## 模式元数据格式

```yaml
模式: Basic Stone Block
版本: Fabric 1.17.1
平台: Fabric
分类: block
依赖: []
扩展点: [方块实体, 特殊渲染]
---
# 代码模式内容...
```

所有模式文件均可直接引用，无需全部读入。
