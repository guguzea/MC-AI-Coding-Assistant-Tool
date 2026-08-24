---
id: authored/custom-dimension-and-biomes
title: 自定义维度与生物群系（DimensionType / LevelStem / TerraBlender）
tags: [worldgen, dimension, dimension-type, level-stem, biome, terrablender, multi-noise, datagen, neoforge]
summary: 维度两层：dimension_type（天空/光照/怪物刷怪规则，26.x 起环境属性+timelines）+ LevelStem（噪声生成器 + Fixed/MultiNoise 生物源）；datagen bootstrap 写法；主世界/下界加群系用 TerraBlender Region 气候参数叠加；末地用 EndBiomeRegistry；传送门需自写 teleporter。
mcHint: 26.X 课程分支 75/76 核对；1.20.x 同构但 dimension_type 无 attributes/timelines 新字段
sourceKind: authored
---

# 自定义维度与生物群系

自写短文。代码依据 Kaupenjoe NeoForge 26.X 课程分支 `75-dimensions`、`76-biomes`（MIT），Java 与生成 JSON 均核对。库侧 TerraBlender 集成要点另见 `lib-terrablender`。

## 维度 = dimension_type + LevelStem

| 文件 | 注册键 | 内容 |
|------|--------|------|
| `data/<ns>/dimension_type/<name>.json` | `Registries.DIMENSION_TYPE` | 世界"物理规则" |
| `data/<ns>/dimension/<name>.json` | `Registries.LEVEL_STEM` | 用哪个 type + 什么生成器 |

### dimension_type（26.x 新格式已核实）

```json
{ "ambient_light": 1.0,
  "attributes": {                                  // 26.x：环境属性改颜色系
    "minecraft:visual/sky_color": "#6ab7ff",
    "minecraft:visual/fog_color": "#a1e035",
    "minecraft:visual/cloud_color": "#9bc81f19",
    "minecraft:visual/ambient_light_color": "#bfb995" },
  "has_ceiling": false, "has_skylight": true,
  "height": 256, "min_y": 0, "logical_height": 256,
  "infiniburn": "#minecraft:infiniburn_overworld",
  "monster_spawn_light_level": 0, "monster_spawn_block_light_limit": 0,
  "coordinate_scale": 1.0,
  "default_clock": "minecraft:overworld",
  "timelines": "#minecraft:in_overworld",          // 26.x：昼夜/时间线归属
  "has_ender_dragon_fight": false }
```

- 1.20.x 版没有 `attributes`/`timelines`/`default_clock`，是 `sky_color`/`fog_color` 等平铺字段——**跨版本别互抄**。
- 怪物生成限制：`monster_spawn_light_level` + block light limit（下界式全暗生成 vs 主世界式黑暗生成）。

### LevelStem：生成器两种生物源（datagen 已核实）

```java
// 单一群系维度
new NoiseBasedChunkGenerator(
    new FixedBiomeSource(biomes.getOrThrow(Biomes.CHERRY_GROVE)),
    noiseGenSettings.getOrThrow(NoiseGeneratorSettings.AMPLIFIED));

// 多群系维度：multi_noise 气候参数映射
new NoiseBasedChunkGenerator(
    MultiNoiseBiomeSource.createFromList(new Climate.ParameterList<>(List.of(
        Pair.of(Climate.parameters(0f,0f,0f,0f,0f,0f,0f), biomes.getOrThrow(Biomes.FOREST)),
        Pair.of(Climate.parameters(0f,0.1f,0f,0f,0f,0f,0f), biomes.getOrThrow(Biomes.BIRCH_FOREST)),
        // temperature, humidity, continentalness, erosion, depth, weirdness, offset
    ))),
    noiseGenSettings.getOrThrow(NoiseGeneratorSettings.AMPLIFIED));

context.register(KAUPENDIM_KEY, new LevelStem(dimTypeHolder, generator));
```

- `settings` 选原版噪声预设（`minecraft:overworld/amplified` 等）或自定义 noise_settings JSON——自定义地形属于进阶，先拿原版预设起步。
- 进维度方式教程未含传送门方块：需要自建 portal block + `Teleporter` 实现（或临时用 `/execute in <dim> run tp`）。Fabric Wiki 的 custom portals 页可作参考。

## 生物群系

### 自定义维度里：直接 JSON/datagen 定义 Biome

`BootstrapContext<Biome>` 里组 `BiomeGenerationSettings`（features/carvers）、特效、刷怪列表——教程的 `ModOverworldBiomes.kaupenValley(...)` 即此套路。

### 往主世界/下界加群系：TerraBlender（事实标准）

直接把新群系塞进原版 multi_noise 会与其他 mod 打架；TerraBlender 用「区域加权」协调：

```java
public class OverworldRegion extends Region {
    public OverworldRegion(Identifier name, int weight) { super(name, RegionType.OVERWORLD, weight); }

    @Override
    public void addBiomes(Registry<Biome> registry, Consumer<Pair<Climate.ParameterPoint, ResourceKey<Biome>>> mapper) {
        VanillaParameterOverlayBuilder builder = new VanillaParameterOverlayBuilder();  // 只覆盖选中的气候点
        new ParameterUtils.ParameterPointListBuilder()
            .temperature(Temperature.span(Temperature.COOL, Temperature.FROZEN))
            .humidity(Humidity.span(Humidity.ARID, Humidity.DRY))
            .continentalness(Continentalness.INLAND)
            .erosion(Erosion.EROSION_0, Erosion.EROSION_1)
            .depth(Depth.SURFACE, Depth.FLOOR)
            .weirdness(Weirdness.MID_SLICE_NORMAL_ASCENDING, Weirdness.MID_SLICE_NORMAL_DESCENDING)
            .build().forEach(point -> builder.add(point, ModBiomes.KAUPEN_VALLEY));
        builder.build().forEach(mapper);
    }
}
```

```java
public static void registerBiomes() {   // FMLCommonSetupEvent.enqueueWork 里调
    Regions.register(new OverworldRegion(id("mccourse_overworld"), 20));   // weight=抢占强度
    Regions.register(new NetherRegion(id("mccourse_nether"), 20));
    EndBiomeRegistry.registerHighlandsBiome(END_ROT, 20);                  // 末地单独 API
}
```

- **weight 是与其他 mod 群系的竞争权重**，20–200 常见；越大越容易挤掉别人的。
- ParameterUtils builder 按「温度×湿度×大陆性…」区间声明生态位；span=连续段。
- 依赖声明：TerraBlender 为 jar-in-jar 或常规依赖（见 `lib-terrablender`）。

## 排查清单

- 进不去维度：先 `/execute in <ns>:<dim> run tp ~ ~ ~` 验证维度本身注册成功，再查传送器。
- 群系不出现（主世界）：weight 太低被压 / 气候区间太窄 / 忘了在 common setup 注册 Region。
- 天空黑块/光照异常：dimension_type 的 has_skylight、ambient_light、min_y/height 与生成器 settings 不匹配。
- 旧区块不回填新群系——测试用全新存档。

## 不清楚时

- 教程源码（分支 `75-dimensions`、`76-biomes`，MIT）：https://github.com/Tutorials-By-Kaupenjoe/NeoForge-Course-26.X
- Fabric 侧维度概念/传送门：https://wiki.fabricmc.net/tutorial:dimensionconcepts 、`:custom_portals`
- API：`search_neoforge_docs`（关键词 dimension, biome）
