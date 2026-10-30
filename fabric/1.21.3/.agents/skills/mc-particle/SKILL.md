---
name: mc-particle
description: Fabric 粒子系统。ParticleType、ParticleManager、SimpleParticleType。触发词：粒子、Particle、ParticleType
platform: fabric
version: "1.21.3"
dependencies: []
mappings: yarn
mappings_alt: mojmap
---

# 粒子系统（Fabric 1.21.3）

## 快速开始

```java
// 1. 粒子类型：1.21.1 起 Yarn 没有 DefaultParticleType，简单粒子直接走 Fabric API
public static final SimpleParticleType MY_PARTICLE = FabricParticleTypes.simple();

// 2. 注册粒子类型（ModInitializer.onInitialize 里）
Registry.register(Registries.PARTICLE_TYPE, Identifier.of(MOD_ID, "my_particle"), MY_PARTICLE);

// 3. 注册粒子工厂（客户端）；要自定义外观就换成自己 Particle 子类的 Provider
public class ExampleModClient implements ClientModInitializer {
    @Override
    public void onInitializeClient() {
        ParticleFactoryRegistry.getInstance().register(MY_PARTICLE, EndRodParticle.Factory::new);
    }
}
```
### ⚠️ 映射口径：本档无参考代码，正文按 Yarn 落笔

本档 frontmatter 钉 `mappings: yarn`，但本档**没有**可引用的参考代码：`data/fabric_1.21.3/` 既无 `reference/` 树，`fabric-docs` 树也为空（`knowledge/common/verified-api-1.21.3.md:4-8` 记明上游无该版 `versions/` 快照；入库的 `fabric-wiki` 只有 7 页 start / tutorial_*，无粒子页）。
上一段代码按本档映射库（`data/fabric_1.21.3/mappings/yarn-mappings.sqlite`）的 Yarn 名落笔，**不是**抄来的参考实现；上游示例写的是 Mojmap 名（`BuiltInRegistries` / `ResourceLocation.fromNamespaceAndPath` / `ParticleEngine`），换名靠下表。

**改名点**：Yarn 从 1.21.1 起把粒子父类 `DefaultParticleType`（≤1.20.4 合法）换成
`SimpleParticleType`；工厂嵌套类两侧从来不同名（Yarn `EndRodParticle$Factory` ↔ mojmap
`EndRodParticle$Provider`）——上面第 3 步的 `.Factory` 就是照本档映射写的，不是照抄语料。

| mojmap 名 | Yarn 名 | 适用版本（15 档 join 实测） | 依据 |
| --- | --- | --- | --- |
| `SimpleParticleType` | `SimpleParticleType` | 1.20.6–1.21.11（8/15 档） 两侧同名 | join（`net/minecraft/particle/SimpleParticleType`） |
| `EndRodParticle$Provider` | `EndRodParticle$Factory` | 1.14.4–1.21.11（15/15 档） | join（`net/minecraft/client/particle/EndRodParticle$Factory`） |
| `BuiltInRegistries` | `Registries` | 1.19.4–1.21.11（11/15 档） | join（`net/minecraft/registry/Registries`） |
| `ResourceLocation` | `Identifier` | 1.14.4–1.21.10（14/15 档） | join（`net/minecraft/util/Identifier`） |
| `Identifier` | `Identifier` | 仅 1.21.11（1/15 档） 两侧同名 | join（`net/minecraft/util/Identifier`） |
| `ParticleEngine` | `ParticleManager` | 1.14.4–1.21.11（15/15 档） | join（`net/minecraft/client/particle/ParticleManager`） |
| —（mojmap 从未有此名） | `DefaultParticleType` | 仅 Yarn 1.14.4–1.20.4（1.21.1 起为 `SimpleParticleType`） | 13 档 yarn sqlite `classes.named`：7 有 / 6 无 |
| —（Fabric API，不在两代映射内） | `FabricParticleTypes`、`ParticleFactoryRegistry` | 全档 | **本档未核实**：`loader-api-summaries/1.21.3-fabric-api.json` 的 1192 类里 Particle 命中 0，本档也无 `reference/` 树。邻档实命中（跨档参考，不作本档出处）：FQCN `net.fabricmc.fabric.api.particle.v1.FabricParticleTypes` 见 `data/fabric_1.21.10/reference/1.21.10/src/main/java/com/example/docs/ExampleMod.java:14`。落地前先 `query_loader_api(platform=fabric, minecraftVersion=1.21.3)` 或对自备 jar `ingest_loader_api` |

- 本表只证实**类名存在与包路径**，不证实方法名/参数/返回值；逐签名以 `get_minecraft_source`（需 JDK 17+）或 `./gradlew genSources` 为准。

## 常见错误

- ❌忘记在客户端注册粒子工厂 — 粒子不显示
- ❌粒子工厂在服务端执行 — 粒子是客户端的

## 扩展点

| 配合 Skill | 协作说明 |
|-----------|---------|
| `mc-registry` | 粒子类型通过 Registry.register() 注册 |
| `mc-entity` | 实体可以生成粒子 |
