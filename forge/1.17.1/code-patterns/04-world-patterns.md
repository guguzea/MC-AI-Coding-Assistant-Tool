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
        .specialEffects(new BiomeSpecialEffects.Builder()
            .waterColor(0x3f76e4)
            .waterFogColor(0x50533)
            .skyColor(0x78a9ff)
            .grassColorOverride(0x7ed957)
            .foliageColorOverride(0x60bd3f)
            .ambientMoodSound(AmbientMoodSettings.LEGACY_CAVE)
            .build())
        .generationSettings(...)
        .mobSpawnSettings(...)
        .build()
);
```

## 自定义结构

> **TODO(未核实)**：1.17.1 自定义结构的骨架样例缺一手出处——`GenerationStub` / `GenerationContext` / `NoFeatureConfiguration` 在本档 `client.txt` 顶层**零命中**（疑为 1.18+/1.19+ 名下渗），本仓语料亦无 1.17.1 结构注册逐字样例。待 `get_minecraft_source` 反编译逐签名核后重写；在此之前**不要**把旧样例当 1.17.1 写法抄用。

> **注意：** Forge 1.17.1 的世界生成 API 与 1.18+ 有较大差异。1.17.1 使用 `StructureFeature` 类配合 `ConfiguredStructureFeature` 注册，1.19+ 重构为 `Structure` + `StructureType` + `GenerationStep.Decoration` 模式。
