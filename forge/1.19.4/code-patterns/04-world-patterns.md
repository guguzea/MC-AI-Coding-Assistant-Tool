# 世界相关模式（Forge 1.19.4）

```yaml
模式: 世界生成/地形
分类: world
```

> **1.19.4 关键差异**：生物群系已是 **datapack 注册表**内容，注册用
> `DeferredRegister.create(Registries.BIOME, MOD_ID)`（`Registries` = `net.minecraft.core.registries.Registries`，
> 本档 `knowledge/common/glossary.md:40`）。1.18.2 档写的 `ForgeRegistries.BIOMES` 在本档无证据，**不要照抄**。

## 自定义生物群系

```java
// 注册（datapack 注册表：Registries.BIOME）
public static final DeferredRegister<Biome> BIOMES =
    DeferredRegister.create(Registries.BIOME, MOD_ID);

public static final RegistryObject<Biome> MY_BIOME = BIOMES.register("my_biome",
    () -> new Biome.BiomeBuilder()
        .temperature(0.8f)
        .downfall(0.4f)
        .hasPrecipitation(true)
        .specialEffects(new BiomeSpecialEffects.Builder()
            .waterColor(0x3f76e4)
            .waterFogColor(0x50533)
            .skyColor(0x78a9ff)
            // ⚠️ 1.19.4 索引里只有 grassColorOverride / foliageColorOverride；
            //    邻档（1.18.2:23-24、1.20.1:18-19）用的 .grassColor(int)/.foliageColor(int) 在 1.19.4 不存在
            .grassColorOverride(0x7ed957)
            .foliageColorOverride(0x60bd3f)
            // TODO(未核实)：.ambientMoodSound(AmbientMoodSettings.LEGACY_CAVE)
            //   —— 方法 ambientMoodSound(AmbientMoodSettings) 已核实存在，
            //   但常量 LEGACY_CAVE 属字段，query_api 不返回字段、本档规则亦未使用 → 用 IDE 补全核实后再写。
            .build())
        .mobSpawnSettings(...)   // 1.19.4 方法名是 mobSpawnSettings，不是邻档的 mobSettings
        .generationSettings(...)
        .build()
);

// 在 mod 构造函数中
BIOMES.register(modEventBus);
```

`Biome.BiomeBuilder` 在 1.19.4 的**完整**方法集（索引 n=9）：
`temperature(float)`、`downfall(float)`、`hasPrecipitation(boolean)`、`specialEffects(BiomeSpecialEffects)`、
`generationSettings(BiomeGenerationSettings)`、`mobSpawnSettings(MobSpawnSettings)`、
`temperatureAdjustment(Biome.TemperatureModifier)`、`build()`、`toString()`。

`BiomeSpecialEffects.Builder` 完整方法集（索引 n=13）：
`fogColor(int)`、`skyColor(int)`、`waterColor(int)`、`waterFogColor(int)`、
`grassColorOverride(int)`、`foliageColorOverride(int)`、`grassColorModifier(BiomeSpecialEffects.GrassColorModifier)`、
`ambientMoodSound(AmbientMoodSettings)`、`ambientAdditionsSound(AmbientAdditionsSettings)`、
`ambientLoopSound(Holder<SoundEvent>)`、`ambientParticle(AmbientParticleSettings)`、`backgroundMusic(Music)`、`build()`。

## 世界高度（-64 ~ 320）

```java
// Caves & Cliffs（1.18 起）的高度模型，1.19.4 未变
int minY   = level.getMinBuildHeight();  // -64
int maxY   = level.getMaxBuildHeight();  // 320
int height = level.getHeight();          // 384
int section = level.getSectionIndex(y);
boolean outside = level.isOutsideBuildHeight(pos);

// LevelHeightAccessor（Level 实现它）在 1.19.4 已核实：
//   create(int,int) / getHeight() / getMinBuildHeight() / getMaxBuildHeight()
//   getSectionsCount() / getMinSection() / getMaxSection()
//   getSectionIndex(int) / getSectionIndexFromSectionY(int) / getSectionYFromSectionIndex(int)
//   isOutsideBuildHeight(int) / isOutsideBuildHeight(BlockPos)
```

## 自定义结构

```java
// 1.19.4 索引：Structure.<init>(Structure.StructureSettings) —— 嵌套类型 StructureSettings 存在
// （与 1.18.2:51 / 1.20.1:31 一致，但下面这行只是「类型可用」的示例，不是完整结构实现）
public class MyStructure extends Structure {
    public MyStructure(StructureSettings settings) {
        super(settings);
    }
}
// TODO(未核实)：StructureSettings 的构造参数（step / spawnOverrides / biomeLocators 等）与
//   structures/{type}.json 的 JSON 键，本档规则、1.19.4 文档语料（search_forge_docs --query=structure）均未覆盖，
//   需要结构实现时请走 get_minecraft_source / decompile_mod_jar 核实，勿凭记忆填写。
```

## 放置修饰器（Java 工厂速查）

```java
// 以下工厂方法已在 1.19.4 索引核实：
CountPlacement.of(int)                              // 另有 of(IntProvider)
HeightRangePlacement.uniform(VerticalAnchor, VerticalAnchor)
HeightRangePlacement.triangle(VerticalAnchor, VerticalAnchor)
// TODO(未核实)：VerticalAnchor.aboveBottom(...) / belowTop(...) 等 IntProvider 工厂、
//   InSquarePlacement.spread()、BiomeFilter.biome()，以及 OreConfiguration / OreConfiguration$Target
//   （query_api --class=OreConfiguration$Target --version=1.19.4 → 未命中）
```

> **本文件刻意不写 configured_feature / placed_feature / biome_modifier 的 JSON**：
> `search_forge_docs --query=BiomeModifiers|placed_feature --version=1.19.4` 在本档语料里没有世界生成专页，
> `grep` 整个 `forge/1.19.4/` 也找不到 `minecraft:count` / `height_range_placement` / `forge:add_features` 等键的用例。
> 需要这些 JSON 时：走 MCP `generate_worldgen`（`platform=forge`、`version=1.19.4`，只吐文本），
> 或 `get_minecraft_source` 按需反编译 1.19.4 后核对；**禁止**用邻版（1.18.2 / 1.20.1）的 worldgen JSON 顶上。
