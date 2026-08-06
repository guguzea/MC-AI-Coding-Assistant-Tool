---
description: 07 — 数据生成器
---

# 07 — 数据生成器

> 适用版本：Fabric 1.19.4

---

## 约束

### 核心原则

- Fabric 使用 **fabric-datagen-api** 进行数据生成
- DataGenerator 在 `runData` Gradle 任务中执行
- 数据生成器入口点：`DataGeneratorInitializer`
- 生成的 JSON 文件输出到 `src/generated/resources/`（由 Loom 管理）
- **禁止**手动编辑 `src/generated/resources/` 目录

---

## Decision Flow

### Decision: 选择生成数据类型

```
IF 生成物品/方块模型 JSON
  → ModelProvider（如 ItemModelProvider, BlockModelProvider）

IF 生成语言文件
  → LanguageGenerator

IF 生成配方/战利品表/进度
  → DatapackBuiltinEntriesProvider + Registries

IF 生成标签（tags）
  → FabricTagBuilder + RegistryWrapper.WrapperLookup

IF 生成自定义数据包
  → CustomTradesProvider / LootTableProvider
```

---

## 添加 DataGen 依赖

```groovy
// build.gradle
dependencies {
    modApi "net.fabric.sdk:fabric-datagen-api-v0:4.2.1+1.19.4"
}
```

## 创建 DataGeneratorInitializer

```java
public class MyDatagen implements DataGeneratorInitializer {
    @Override
    public void initialize(RegistryWrapper.WrapperLookup registries,
                           DataGenerator generator,
                           Pack.Output output,
                           ExistingFileHelper existingFileHelper) {
        // 注册各类型生成器
    }
}
```

## 注册 DataGeneratorInitializer

```java
// src/main/resources/fabric.mod.json
{
  "entrypoints": {
    "init_data": ["com.example.examplemod.MyDatagen"]
  }
}
```

## 生成物品模型

```java
public class MyItemModelProvider implements DataStreamOutputSupplier.Writer {
    @Override
    public void generate(RegistryWrapper.WrapperLookup registries,
                         DataGenerator.GeneratorOutput output,
                         ExistingFileHelper existingFileHelper) {

        // 生成手持物品模型
        ExistingFileHelper核查物品模型文件
        output.add(Registries.ITEM.getId(MY_ITEM.get()),
            Models.HANDheld_ITEM_MODEL 生成);
    }
}
```

## 生成配方

```java
public class MyRecipeProvider implements DataStreamOutputSupplier.Writer {
    @Override
    public void generate(RegistryWrapper.WrapperLookup registries,
                         DataGenerator.GeneratorOutput output,
                         ExistingFileHelper existingFileHelper) {
        // 生成 shapeless 配方
        ShapedRecipeJsonBuilder.create(
                RecipeProvider.getItemConvertible(MY_ITEM.get()), 1)
            .pattern("AAA")
            .pattern("A A")
            .pattern(" A ")
            .input('A', Items.DIAMOND)
            .criterion(hasItem(Items.DIAMOND),
                conditionsFromItem(Items.DIAMOND))
            .offerTo(exporter);
    }
}
```

## 生成 Loot Table

```java
public class MyLootTableProvider implements DataStreamOutputSupplier.Writer {
    @Override
    public void generate(RegistryWrapper.WrapperLookup registries,
                         DataGenerator.GeneratorOutput output,
                         ExistingFileHelper existingFileHelper) {
        // 生成方块掉落表
        output.add(
            Registries.BLOCK.getId(MY_BLOCK.get()),
            BlockLootTableGenerator.dropsWithShears(MY_BLOCK.get())
        );
    }
}
```

## 生成语言文件

```java
public class MyLangProvider implements DataStreamOutputSupplier.Writer {
    @Override
    public void generate(RegistryWrapper.WrapperLookup registries,
                         DataGenerator.GeneratorOutput output,
                         ExistingFileHelper existingFileHelper) {
        // 生成英文语言文件
        output.add(
            Locale.ENGLISH,
            "item.examplemod.my_item", "My Item",
            "block.examplemod.my_block", "My Block",
            "entity.examplemod.my_entity", "My Entity"
        );
    }
}
```

## 运行 DataGen

```bash
# 生成所有数据
./gradlew runData

# 清理生成的数据
./gradlew cleanDatagen
```

## 常见错误

- ❌忘记在 `fabric.mod.json` 中注册 `init_data` entrypoint — DataGen 不执行
- ❌ 手动编辑 `src/generated/resources/` — 文件会被重新生成覆盖
- ❌ 引用未注册的资源 — DataGen 找不到现有文件
- ❌ 在 DataGen 中使用动态路径 — 必须使用确定的 `Identifier`
- ❌忘记添加 `fabric-datagen-api` 依赖 — DataGenerator 接口不存在

## 扩展点

| 配合 Skill | 协作说明 |
|-----------|---------|
| `mc-item` | DataGen 生成物品模型 JSON |
| `mc-block` | DataGen 生成方块模型和掉落表 |
| `mc-entity` | DataGen 生成实体语言名和 loot table |
| `mc-registry` | DataGen 引用已注册的方块/物品/实体 |
