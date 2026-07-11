# 数据生成代码模式

适用版本：Fabric 1.21.1

## 依赖

```groovy
dependencies {
    modApi "net.fabricmc.fabric-api:fabric-datagen-api-v0:4.2.1+1.21"
}
```

## DataGeneratorInitializer

```java
public class MyDatagen implements DataGeneratorInitializer {
    @Override
    public void initialize(RegistryWrapper.WrapperLookup registries,
                           DataGenerator generator,
                           Pack.Output output,
                           ExistingFileHelper existingFileHelper) {
        generator.addProvider(true, new MyRecipeProvider(output, registries));
        generator.addProvider(true, new MyLootTableProvider(output));
        generator.addProvider(true, new MyLanguageProvider(output, "en_us"));
        generator.addProvider(true, new MyTagProvider(output, registries, existingFileHelper));
    }
}
```

## 注册 DataGen

```json
{
  "entrypoints": {
    "init_data": ["com.example.examplemod.datagen.MyDatagen"]
  }
}
```

## 配方生成

```java
public class MyRecipeProvider implements DataStreamOutputSupplier.Writer {
    private final Pack.Output output;
    private final RegistryWrapper.WrapperLookup registries;
    private final CompletableFuture<RegistryWrapper.WrapperLookup> registriesLookup;

    public MyRecipeProvider(Pack.Output output, RegistryWrapper.WrapperLookup registries) {
        this.output = output;
        this.registries = registries;
        this.registriesLookup = CompletableFuture.completedFuture(registries);
    }

    @Override
    public void generate(RegistryWrapper.WrapperLookup registries,
                        Pack.GeneratorOutput output, ExistingFileHelper existingFileHelper) {
        // Shaped 配方
        createShapedRecipe()
            .pattern("AAA")
            .pattern("BBB")
            .pattern("CCC")
            .input('A', Items.DIAMOND)
            .input('B', Items.GOLD_INGOT)
            .input('C', Items.IRON_INGOT)
            .criterion(hasItem(Items.DIAMOND), conditionsFromItem(Items.DIAMOND))
            .offerTo(output);

        // Shapeless 配方
        createShapelessRecipe()
            .input(Items.DIAMOND)
            .input(Items.EMERALD)
            .criterion(hasItem(Items.DIAMOND), conditionsFromItem(Items.DIAMOND))
            .offerTo(output, new Identifier(MOD_ID, "diamond_emerald"));
    }
}
```

## Loot Table 生成

```java
public class MyLootTableProvider implements DataStreamOutputSupplier.Writer {
    private final Pack.Output output;

    public MyLootTableProvider(Pack.Output output) {
        this.output = output;
    }

    @Override
    public void generate(RegistryWrapper.WrapperLookup registries,
                        Pack.GeneratorOutput output, ExistingFileHelper existingFileHelper) {
        // 方块掉落
        output.add(LootTables.BLOCK_DROP_SET,
            BlockLootTableGenerator.dropsWithShears(ModBlocks.MY_BLOCK.get())
        );

        // 简单掉落
        output.add(LootTables.BLOCK_DROP_SET,
            BlockLootTableGenerator.drops(ModBlocks.MY_ORE.get())
        );

        // 自定义掉落
        output.add(LootTables.BLOCK_DROP_SET,
            BlockLootTableGenerator.builder()
                .pool(builder -> builder
                    .rolls(ConstantLootNumberProvider.create(1))
                    .with(ItemEntry.builder(ModItems.MY_ITEM.get())
                        .weight(1)
                        .quality(0)
                    )
                    .with(ItemEntry.builder(Items.DIAMOND)
                        .weight(5)
                        .conditionally(SurvivesExplosionLootCondition.builder())
                    )
                )
        );
    }
}
```

## 语言文件生成

```java
public class MyLanguageProvider implements DataStreamOutputSupplier.Writer {
    private final Pack.Output output;
    private final String languageId;

    public MyLanguageProvider(Pack.Output output, String languageId) {
        this.output = output;
        this.languageId = languageId;
    }

    @Override
    public void generate(RegistryWrapper.WrapperLookup registries,
                        Pack.GeneratorOutput output, ExistingFileHelper existingFileHelper) {
        RegistryEntryLookup<Item> itemLookup = registries.getWrapperOrThrow(Registries.ITEM_KEY);

        output.add(languageId, "item." + MOD_ID + ".my_item", "My Item");
        output.add(languageId, "block." + MOD_ID + ".my_block", "My Block");
        output.add(languageId, "entity." + MOD_ID + ".my_entity", "My Entity");
        output.add(languageId, "itemGroup." + MOD_ID, "Example Mod Items");
    }
}
```

## 标签生成

```java
public class MyTagProvider implements DataStreamOutputSupplier.Writer {
    private final Pack.Output output;
    private final RegistryWrapper.WrapperLookup registries;
    private final ExistingFileHelper existingFileHelper;

    public MyTagProvider(Pack.Output output, RegistryWrapper.WrapperLookup registries,
                         ExistingFileHelper existingFileHelper) {
        this.output = output;
        this.registries = registries;
        this.existingFileHelper = existingFileHelper;
    }

    @Override
    public void generate(RegistryWrapper.WrapperLookup registries,
                        Pack.GeneratorOutput output, ExistingFileHelper existingFileHelper) {
        // 方块标签
        this.output.add(Registries.BLOCK,
            FabricTagBuilder.create(
                    Optional.of(new Identifier("fabric", "needs_tool_level_4")),
                    List.of(ModBlocks.MY_BLOCK.get()),
                    Set.of()
            )
        );

        // 物品标签
        this.output.add(Registries.ITEM,
            FabricTagBuilder.create(
                    Optional.of(new Identifier("fabric", "piglin_loved")),
                    List.of(Items.GOLD_INGOT),
                    Set.of()
            )
        );
    }
}
```

## 运行 DataGen

```bash
./gradlew runDatagen
```

生成的文件将输出到 `src/generated/resources/`。
