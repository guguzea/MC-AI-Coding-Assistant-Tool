# 世界相关模式（Forge 1.20.1）

## 自定义生物群系

```java
// 注册（使用 Vanilla Registry）
public static final DeferredRegister<Biome> BIOMES =
    DeferredRegister.create(Registries.BIOME, MOD_ID);

public static final RegistryObject<Biome> MY_BIOME = BIOMES.register("my_biome",
    () -> new Biome.BiomeBuilder()
        .temperature(0.8f)
        .downfall(0.4f)
        .specialEffects(new BiomeSpecialEffects.Builder()
            .waterColor(0x3f76e4)
            .waterFogColor(0x50533)
            .skyColor(0x78a9ff)
            .grassColorOverride(0x7ed957)
            .foliageColorOverride(0x60bd3f)
            .ambientMoodSound(AmbientMoodSettings.LEGACY_CAVE_SETTINGS)   // 1.20.1 构件 javap：LEGACY_CAVE 无此常量，实名 LEGACY_CAVE_SETTINGS
            .build())
        .generationSettings(...)
        .mobSpawnSettings(...)
        .build()
);
```

## 自定义结构

```java
// 本档构件核实（javap @ forge-1.20.1-47.4.0_mapped_official_1.20.1）：
//   Structure$StructureSettings 是 `public final class … extends java.lang.Record` —— final，不能继承。
//   Structure 自身是 abstract，且带**两个** abstract 方法：
//     protected abstract Optional<GenerationStub> findGenerationPoint(GenerationContext ctx);
//     public abstract StructureType<?> type();
//   ⇒ 自定义结构必须把这两个都实现；只写构造函数的裸子类编不过
//      （`MyStructure is not abstract and does not override abstract method type() in Structure`）。
//   下面给最小可编译形态：先声明 abstract，把这两个方法交给具体子类实现。
public abstract class MyStructure extends Structure {
    protected MyStructure(StructureSettings settings) {
        super(settings);
    }

    // 具体子类必须实现：
    //   @Override protected Optional<GenerationStub> findGenerationPoint(GenerationContext ctx) { ... }
    //   @Override public StructureType<?> type() { return MY_STRUCTURE_TYPE.get(); }
}
```
