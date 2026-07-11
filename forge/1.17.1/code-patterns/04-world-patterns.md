# 世界相关模式（Forge 1.17.1）

## 自定义生物群系

```java
// 注册（使用 Vanilla Registry）
public static final DeferredRegister<Biome> BIOMES =
    DeferredRegister.create(ForgeRegistries.BIOMES, MOD_ID);

public static final RegistryObject<Biome> MY_BIOME = BIOMES.register("my_biome",
    () -> new Biome.Builder()
        .temperature(0.8f)
        .downfall(0.4f)
        .specialEffects(new BiomeAmbience.Builder()
            .waterColor(0x3f76e4)
            .waterFogColor(0x50533)
            .skyColor(0x78a9ff)
            .grassColorOverride(0x7ed957)
            .foliageColorOverride(0x60bd3f)
            .ambientMoodSound(AmbientMoodSettings.LEGACY_CAVE)
            .build())
        .generationSettings(...)
        .mobSettings(...)
        .build()
);
```

## 自定义结构

```java
public class MyStructure extends Structure {
    // 继承 Structure 配置生成参数
    public MyStructure() {
        super(NoFeatureConfiguration.CODEC);
    }

    @Override
    public GenerationStub buildStructure(GenerationContext context) {
        // 自定义结构生成逻辑
        return start(
            ResourceLocationUtils.fromNamespaceAndPath(MOD_ID, "my_structure"),
            context
        ).type(StructureFeature.TEMPLATES);
    }
}
```

> **注意：** Forge 1.17.1 的世界生成 API 与 1.18+ 有较大差异。1.17.1 使用 `Structure` 类配合 `ConfiguredStructureFeature` 注册，1.18+ 重构为 `Structure` + `StructureType` + `GenerationStep.Decoration` 模式。
