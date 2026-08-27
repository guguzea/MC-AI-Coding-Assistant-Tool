---
name: mc-particle
description: Minecraft Forge 粒子效果开发。ParticleType 注册、ParticleProvider、particles.json、SpriteSet、渲染。触发词：Particle、ParticleType、ParticleProvider、RegisterParticleProvidersEvent、ParticleRenderType
platform: forge
version: "1.20.1"
dependencies: []
mappings: mcp
---

# 粒子开发（Forge 1.20.1）

粒子分为两部分：**通用端**（引用/注册粒子类型）和**客户端**（渲染逻辑）。

## 快速开始

### 1. 注册 ParticleType（通用端）

```java
private static final DeferredRegister<ParticleType<?>> PARTICLES =
    DeferredRegister.create(ForgeRegistries.PARTICLE_TYPES, MOD_ID);

public static final RegistryObject<SimpleParticleType> MY_PARTICLE =
    PARTICLES.register("my_particle",
        () -> new SimpleParticleType(false) {}
    );

// 在 mod 构造函数中
PARTICLES.register(modEventBus);
```

- `SimpleParticleType`：无需额外数据（如爆炸粒子）
- 若需要额外数据，扩展 `ParticleType<T>` 并实现 `codec` / `Deserializer`

### 2. 创建粒子渲染类（客户端）

```java
public class MyParticle extends TextureSheetParticle {
    public MyParticle(ClientLevel level, double x, double y, double z,
                       double vx, double vy, double vz, SpriteSet sprites) {
        super(level, x, y, z, vx, vy, vz);
        this.pickSprite(sprites);          // 随机选择一个纹理
        this.quadSize *= 0.5f;             // 粒子大小
        this.lifetime = 20;                // 存活 tick 数
    }

    @Override
    public ParticleRenderType getRenderType() {
        return ParticleRenderType.PARTICLE_SHEET_OPAQUE;
    }
}
```

### 3. 注册 ParticleProvider（客户端）

```java
@Mod.EventBusSubscriber(modid = MOD_ID, bus = Mod.EventBusSubscriber.Bus.MOD, value = Dist.CLIENT)
public class ParticleProviders {
    @SubscribeEvent
    public static void registerParticles(RegisterParticleProvidersEvent event) {
        // 配合 particles/*.json 的多纹理粒子
        event.registerSpriteSet(
            ModParticles.MY_PARTICLE.get(),
            MyParticle::new
        );

        // 单纹理粒子，无需 JSON
        event.registerSprite(
            ModParticles.MY_SIMPLE_PARTICLE.get(),
            MySingleTextureParticle::new
        );

        // 完全自定义（无 sprite）
        event.registerSpecial(
            ModParticles.MY_CUSTOM_PARTICLE.get(),
            new MyCustomParticleProvider()
        );
    }
}
```

> `RegisterParticleProvidersEvent` 只在客户端触发，不需要额外 `@OnlyIn` 隔离。

### 4. particles/*.json（多纹理粒子）

放在 `assets/<modid>/particles/<particlename>.json`，文件名对应粒子注册名：

```json
{
  "textures": [
    "mymod:particle/sparkle_1",
    "mymod:particle/sparkle_2",
    "mymod:particle/sparkle_3"
  ]
}
```

- `mymod:particle/sparkle_1` → `assets/mymod/textures/particle/sparkle_1.png`
- `TextureSheetParticle.setSpriteFromAge(sprites)` 可让粒子在生命周期内逐渐切换纹理

## 生成粒子

### 客户端生成（本地效果）

```java
ClientLevel level = ...;
level.addParticle(
    ModParticles.MY_PARTICLE.get(),  // ParticleOptions
    x, y, z,                         // 位置
    vx, vy, vz                        // 速度偏移
);
```

### 服务端生成（广播给所有附近客户端）

```java
// ServerLevel
level.sendParticles(
    player,                              // 来源玩家（可传 null）
    new SimpleParticleType(false),        // ParticleOptions
    true,                                // alwaysVisible（任意距离可见）
    x, y, z,                             // 位置
    count,                               // 粒子数量
    dx, dy, dz,                          // 散布范围
    speed                                // 速度倍率
);
```

> 服务端调用 `addParticle` 不会产生任何效果。

## ParticleRenderType

| 值 | 说明 |
|----|------|
| `TERRAIN_SHEET` | 使用方块纹理（方块破碎粒子等） |
| `PARTICLE_SHEET_OPAQUE` | 不透明粒子纹理（常规粒子） |
| `PARTICLE_SHEET_TRANSLUCENT` | 半透明粒子纹理（需要深度排序） |
| `PARTICLE_SHEET_LIT` | 无粒子着色器的 opaque 粒子 |
| `CUSTOM` | 自定义混合/深度遮罩（在 `Particle#render` 中自行实现） |
| `NO_RENDER` | 不渲染（逻辑粒子） |

## Decision: 选择粒子注册方式

```
IF 粒子有多个纹理、需要随时间切换
  → registerSpriteSet + particles/*.json + setSpriteFromAge

IF 粒子只有单一纹理
  → registerSprite（无需 JSON）

IF 粒子无纹理（纯数学渲染）
  → registerSpecial
```

## Decision: 选择生成方式

```
IF 客户端本地效果（客户端事件、GUI、渲染回调）
  → clientLevel.addParticle(...)

IF 服务端触发、所有附近客户端看到
  → serverLevel.sendParticles(player, ...)

IF 服务端触发、仅特定玩家看到
  → 通过 mc-networking Skill 发自定义包，客户端收到后 addParticle
```

## 常见错误

- ❌ 在服务端调用 `clientLevel.addParticle` → 服务端没有 ClientLevel，调用会失败
- ❌ 使用 `registerSpriteSet` 但没有 `particles/*.json` → 加载时报 "missing particle textures"
- ❌ 粒子不继承 `TextureSheetParticle` 但使用 `pickSprite` → 会抛 NPE
- ❌ `level.sendParticles` 在客户端调用 → 无效果（客户端没有 ServerLevel）
- ❌ 粒子 `lifetime` 设为 0 → 粒子立即消失

## 参考资料

- 官方文档：https://docs.minecraftforge.net/en/1.20.1/gameeffects/particles/
- DataGen 生成：https://docs.minecraftforge.net/en/1.20.1/datagen/client/particles/

## 扩展点

| 配合 Skill | 协作说明 |
|-----------|---------|
| `mc-blockentity` | 方块工作时在 tick 中生成粒子 |
| `mc-entity` | 生物死亡/攻击时生成粒子 |
| `mc-networking` | 服务端广播粒子到指定玩家 |
