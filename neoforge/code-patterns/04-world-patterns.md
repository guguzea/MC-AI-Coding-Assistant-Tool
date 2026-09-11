# 世界相关模式（NeoForge 1.20.4）

## 自定义生物群系

```java
// 注册（使用 Vanilla Registry）
public static final DeferredRegister<Biome> BIOMES =
    DeferredRegister.create(Registries.BIOME, MOD_ID);

public static final DeferredHolder<Biome, Biome> MY_BIOME = BIOMES.register("my_biome",
    () -> new Biome.BiomeBuilder()
        .temperature(0.8f)
        .downfall(0.4f)
        .specialEffects(new BiomeSpecialEffects.Builder()
            .waterColor(0x3f76e4)
            .waterFogColor(0x50533)
            .skyColor(0x78a9ff)
            .grassColorOverride(0x7ed957)   // 1.20.4 实名 grassColorOverride / foliageColorOverride，不是 grassColor / foliageColor
            .foliageColorOverride(0x60bd3f)
            .ambientMoodSound(AmbientMoodSettings.LEGACY_CAVE) // 方法签名已核实收 AmbientMoodSettings；LEGACY_CAVE 这个常量名本档无出处 → TODO(未核实)
            .build())
        .generationSettings(...)
        .mobSpawnSettings(...)   // 1.20.4 实名 mobSpawnSettings(MobSpawnSettings)，不是 mobSettings
        .build()
);
```

## 自定义结构

```java
// ⚠️ 旧文本 `public class MyStructure extends Structure.StructureSettings` 是错的：
//    1.20.4 实测 Structure 的构造是 <init>(Structure$StructureSettings) —— StructureSettings 是入参，不是父类。
public class MyStructure extends Structure {
    public MyStructure(StructureSettings settings) {
        super(settings);
    }

    // 覆写点在 Structure#findGenerationPoint(Structure.GenerationContext)，返回 java.util.Optional（均已核实）；
    // Optional 里的具体类型与生成逻辑本档 1.20.4 语料无 structures 专页 → TODO(未核实)，禁止凭记忆补
}
```
