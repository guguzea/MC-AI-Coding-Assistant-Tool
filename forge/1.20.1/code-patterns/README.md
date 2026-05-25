# Forge 1.20.1 代码模式库

> 本目录为 AI 提供可直接引用的代码模式，按「功能」分类。
> 参见 `../.cursor/rules/` 中的决策流文档以了解何时使用哪种模式。

```
code-patterns/
├── 01-block-patterns.md   # 方块相关模式
├── 02-item-patterns.md    # 物品/工具模式
├── 03-entity-patterns.md  # 实体相关模式
├── 04-world-patterns.md   # 世界生成/地形
├── 05-datagen-patterns.md # DataGen 快速参考
└── README.md              # 本文件
```

## 模式元数据格式

```yaml
模式: Basic Stone Block
版本: Forge 1.20.1
平台: Forge
分类: block
依赖: []
扩展点: [方块实体, 特殊渲染]
---
# 代码模式内容...
```

所有模式文件均可直接引用，无需全部读入。
