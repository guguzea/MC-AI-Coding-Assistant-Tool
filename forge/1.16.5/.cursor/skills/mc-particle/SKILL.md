---
name: mc-particle
description: Minecraft Forge 粒子效果开发。ParticleType 注册、ParticleProvider、particles.json、SpriteSet、渲染。触发词：Particle、ParticleType、ParticleProvider、RegisterParticlesEvent、ParticleRenderLayer
platform: forge
version: "1.16.5"
dependencies: []
mappings: parchment
---

# 粒子开发（Forge 1.16.5）

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
- 若需要额外数据，扩展 `ParticleType<T>` 并实现 codec

### 2. 创建粒子渲染类（客户端）

```java
public class MyParticle extends SpriteTexturedParticle {
    public MyParticle(ClientWorld world, double x, double y, double z,
                       double vx, double vy, double vz, IParticleData data) {
        super(world, x, y, z, vx, vy, vz);
        this.setSprite(...);              // 设置纹理
        this.particleScale *= 0.5f;       // 粒子大小
        this.maxAge = 20;                // 存活 tick 数
    }

    @Override
    public IParticleData getRenderType() {
        return IParticleRenderType.PARTICLE_SHEET_OPAQUE;
    }
}
```

### 3. 注册 ParticleProvider（客户端）

```java
@Mod.EventBusSubscriber(modid = MOD_ID, bus = Mod.EventBusSubscriber.Bus.MOD, value = Dist.CLIENT)
public class ParticleProviders {
    @SubscribeEvent
    public static void registerParticles(RegisterParticlesEvent event) {
        event.register(
            ModParticles.MY_PARTICLE.get(),
            MyParticle::new
        );
    }
}
```

## 生成粒子

### 客户端生成（本地效果）

```java
WorldClient world = ...;
world.addParticle(
    ModParticles.MY_PARTICLE.get(),  // IParticleData
    x, y, z,                         // 位置
    vx, vy, vz                         // 速度偏移
);
```

### 服务端生成（广播给所有附近客户端）

```java
// ServerWorld
world.playSound(
    player,                              // 来源玩家（可传 null）
    ModSounds.MY_SOUND.get(),           // SoundEvent
    SoundCategory.BLOCKS,
    1.0f,                              // volume
    1.0f                               // pitch
);
```

> 服务端调用 `world.addParticle` 不会产生任何效果。

## Decision: 选择粒子注册方式

```
IF 粒子有多个纹理
  → 使用 particles/*.json

IF 粒子只有单一纹理
  → 直接注册 Particle 类

IF 粒子无纹理（纯数学渲染）
  → 自定义 IParticleRenderType
```

## 常见错误

- ❌ 在服务端调用 `clientWorld.addParticle` → 服务端没有 ClientWorld，调用会失败
- ❌ 粒子不继承正确基类但使用 sprite 相关方法 → 会抛 NPE
- ❌ `world.playSound` 在客户端调用 → 无效果（客户端没有 ServerWorld）
- ❌ 粒子 `maxAge` 设为 0 → 粒子立即消失

## 参考资料

- 官方文档：https://docs.minecraftforge.net/en/1.16.5/

## 扩展点

| 配合 Skill | 协作说明 |
|-----------|---------|
| `mc-blockentity` | 方块工作时在 tick 中生成粒子 |
| `mc-entity` | 生物死亡/攻击时生成粒子 |
| `mc-networking` | 服务端广播粒子到指定玩家 |
