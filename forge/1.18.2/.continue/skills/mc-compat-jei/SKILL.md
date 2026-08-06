---
name: mc-compat-jei
description: Minecraft Forge JEI/EMI 兼容层，让 JEI/EMI 自动读取 DataGen 配方，或使用现代 API 添加自定义显示。触发词：JEI、EMI、RecipeCategory、jei_plugins、emi
---

# JEI/EMI 兼容（Forge 1.18.2）

## Decision: 选择兼容方案

```
IF 配方已通过 DataGen 生成
  → JEI/EMI 自动读取 DataPack JSON，无需额外代码（推荐）

IF 需要自定义配方 UI（如 2x2 合成网格、多输入槽）
  → 使用 EMI 或 JEI 内置的 CategoryExtension

IF 需要显示子类（sub-categories）
  → EMI.recipeTree() / JEI hideOf() 等插件 API
```

## 方案 A：JEI/EMI 自动读取（DataGen，无代码，最佳）

只要配方通过 `RecipeProvider` 生成到 `src/generated/resources/data/{modid}/recipes/`，JEI 和 EMI 都会在游戏加载时自动发现并显示，**无需任何 JEI/EMI 代码**。

## 方案 B：使用 EMI（现代推荐）

### 添加 EMI 依赖

在 `build.gradle` 中：
```groovy
dependencies {
    minecraft "net.minecraftforge:forge:${minecraft_version}-${forge_version}"
    deobf "dev.emi:EMI:0.9.3+1.18.2"
}
```

## 常见错误

- ❌ 在服务端（`Dist.DEDICATED_SERVER`）注册 JEI/EMI（必须 `Dist.CLIENT`）
- ❌ 配方 JSON 放在错误路径（应在 `data/{modid}/recipes/`）
- ❌ DataGen 运行后未刷新 IDE 资源（`./gradlew runData` 后刷新项目）

## 参考资料

- EMI 文档：https://emi.pau101.com/

## 扩展点

| 配合 Skill | 协作说明 |
|-----------|---------|
| `mc-datagen` | DataGen 生成的配方 JSON 自动被 JEI/EMI 读取，无需额外代码 |
| `mc-registry` | 自定义配方类需要注册表引用配方物品/方块 |
