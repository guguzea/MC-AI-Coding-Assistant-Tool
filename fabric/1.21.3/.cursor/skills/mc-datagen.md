---
name: mc-datagen
description: Fabric 数据生成器。DataGeneratorInitializer、fabric-datagen-api。触发词：DataGen、DataGenerator、ModelProvider、RecipeProvider
platform: fabric
version: "1.20.1"
dependencies: []
mappings: yarn
---

# 数据生成器（Fabric 1.20.1）

## 快速开始

```groovy
// build.gradle 添加依赖
dependencies {
    modApi "net.fabricmc.fabric-api:fabric-datagen-api-v0:4.2.1+1.21"
}
```

```java
// 创建 DataGeneratorInitializer
public class MyDatagen implements DataGeneratorInitializer {
    @Override
    public void initialize(RegistryWrapper.WrapperLookup registries,
                           DataGenerator generator,
                           Pack.Output output,
                           ExistingFileHelper existingFileHelper) {
        // 注册各生成器
    }
}
```

```json
// fabric.mod.json 中注册
{
  "entrypoints": {
    "init_data": ["com.example.examplemod.MyDatagen"]
  }
}
```

## Decision: 选择生成内容

```
IF 生成模型 JSON
  → ItemModelProvider / BlockModelProvider

IF 生成配方
  → RecipeProvider

IF 生成战利品表
  → BlockLootTableGenerator

IF 生成语言文件
  → LanguageProvider
```

## 常见错误

- ❌忘记在 `fabric.mod.json` 中注册 `init_data` — DataGen 不执行
- ❌手动编辑 `src/generated/resources/` — 文件会被重新生成覆盖
- ❌忘记添加 datagen 依赖 — DataGenerator 接口不存在

## 扩展点

| 配合 Skill | 协作说明 |
|-----------|---------|
| `mc-item` | DataGen 生成物品模型 |
| `mc-block` | DataGen 生成方块模型和掉落表 |
| `mc-registry` | DataGen 引用已注册的对象 |
