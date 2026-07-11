---
version: "1.21.1"
platform: fabric
description: |
  Fabric 1.21.1 数据生成器（DataGen）速查卡。

## 核心概念

### DataGeneratorInitializer 入口点

所有 DataGen 代码通过 `DataGeneratorInitializer` 实现类触发：

```java
public class MyDatagen implements DataGeneratorInitializer {
    @Override
    public void initialize(RegistryWrapper.WrapperLookup registries,
                           DataGenerator generator,
                           Pack.Output output,
                           ExistingFileHelper existingFileHelper) {
        // 注册生成器
    }
}
```

### 在 fabric.mod.json 中注册

```json
{
  "entrypoints": {
    "init_data": ["com.example.examplemod.MyDatagen"]
  }
}
```

### 依赖

```groovy
modApi "net.fabricmc.fabric-api:fabric-datagen-api-v0:4.2.1+1.21"
```

## 常用生成器类型

| 类型 | 接口/类 | 说明 |
|------|---------|------|
| 配方 | `RecipeProvider` | 生成 crafting recipe JSON |
| Loot Table | `BlockLootTableGenerator` | 生成方块掉落表 |
| 标签 | `FabricTagBuilder` | 生成方块/物品/实体标签 |
| 语言 | `LangProvider` | 生成语言文件 |

## 示例：生成配方

```java
ShapedRecipeJsonBuilder.create(
        RecipeProvider.getItemConvertible(ModItems.MY_ITEM.get()), 1)
    .pattern("AAA")
    .pattern("BBB")
    .pattern("CCC")
    .input('A', Items.DIAMOND)
    .input('B', Items.GOLD_INGOT)
    .input('C', Items.IRON_INGOT)
    .criterion(hasItem(Items.DIAMOND), conditionsFromItem(Items.DIAMOND))
    .offerTo(exporter);
```

## 示例：生成方块掉落表

```java
BlockLootTableGenerator.dropsWithShears(ModBlocks.MY_BLOCK.get());
```

## 运行 DataGen

```bash
./gradlew runDatagen
```

生成的 JSON 输出到 `src/generated/resources/`（由 Loom 管理，不要手动编辑）

## 常见错误

- ❌忘记在 fabric.mod.json 中注册 `init_data` — DataGen 不执行
- ❌手动编辑 `src/generated/resources/` — 文件会被重新生成覆盖
- ❌引用未注册的资源 — DataGen 找不到现有文件
