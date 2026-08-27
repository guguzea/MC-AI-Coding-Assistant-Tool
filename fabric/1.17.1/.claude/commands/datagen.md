---
name: mc-datagen
description: Fabric 1.17.1 数据生成。优先手写 JSON；可选 DataGeneratorEntrypoint + FabricRecipesProvider。触发词：DataGen、DataGenerator、RecipeProvider
platform: fabric
version: "1.17.1"
dependencies: []
mappings: yarn
---

# 数据生成器（Fabric 1.17.1）

## 快速开始

**推荐**手写 JSON（见 `07-datagen.mdc`）。若走 DataGen：

```groovy
// build.gradle — 用完整 fabric-api，不要单独钉死 fabric-datagen-api-v0 的假版本号
dependencies {
    modImplementation "net.fabricmc.fabric-api:fabric-api:${project.fabric_api_version}"
}
```

```java
public class ExampleModDataGenerator implements DataGeneratorEntrypoint {
    @Override
    public void onInitializeDataGenerator(FabricDataGenerator generator) {
        generator.addProvider(MyRecipeProvider::new);
    }
}
```

```json
{
  "entrypoints": {
    "fabric-datagen": [
      "com.example.examplemod.ExampleModDataGenerator"
    ]
  }
}
```

## Decision: 选择生成内容

```
IF 只要稳定资源
  → 手写 JSON

IF 代码驱动配方
  → FabricRecipesProvider.generateRecipes
  → 不要 DataGeneratorInitializer / init_data
```

## 常见错误

- ❌ 注册 `init_data` — 应用 `fabric-datagen`
- ❌ 使用 `createPack()` — 1.17.1 是 `generator.addProvider`
- ❌ 手动编辑生成目录

## 扩展点

| 配合 Skill | 协作说明 |
|-----------|---------|
| `mc-item` | 手写物品模型 JSON |
| `mc-block` | 手写方块模型和掉落表 JSON |
| `mc-registry` | 配方引用已注册的物品 |
