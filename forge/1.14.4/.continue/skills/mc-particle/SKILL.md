---
name: mc-particle
description: Minecraft Forge 粒子效果开发。ParticleType 注册、ParticleFactory、particles.json、渲染。触发词：Particle、ParticleType、ParticleFactory、RenderingRegistry、ParticleRenderType
platform: forge
version: "1.14.4"
---

# 粒子开发（Forge 1.14.4）

粒子分为两部分：**通用端**（引用/注册粒子类型）和**客户端**（渲染逻辑）。

## 快速开始

### 1. 注册 ParticleType（通用端）

```java
// 注意：Forge 1.14.4 的粒子注册方式与 1.20.1 不同
// 1.14.4 使用 RegistryEvent
public static final ParticleType<NoDataParticleType> MY_PARTICLE =
    new ParticleType<NoDataParticleType>(false, NoDataParticleType.DESERIALIZER);

@SubscribeEvent
public static void onParticlesRegistry(final RegistryEvent.Register<ParticleType> event) {
    event.getRegistry().register(
        MY_PARTICLE.setRegistryName(new ResourceLocation(MOD_ID, "my_particle"))
    );
}
```

### 2. 创建粒子渲染类（客户端）

```java
public class MyParticle extends SpriteTexturedParticle {
    public MyParticle(World world, double x, double y, double z,
                     double vx, double vy, double vz) {
        super(world, x, y, z, vx, vy, vz);
        this.particleScale *= 0.5f;  // 粒子大小
        this.maxAge = 20;            // 存活 tick 数
    }

    @Override
    public void tick() {
        super.tick();
        // 粒子动画逻辑
    }
}
```

### 3. 注册 ParticleFactory（客户端）

```java
@Mod.EventBusSubscriber(modid = MOD_ID, value = Dist.CLIENT, bus = Mod.EventBusSubscriber.Bus.MOD)
public class ParticleProviders {
    @SubscribeEvent
    public static void registerParticles(final RenderingRegistry.RegisterRenderersEvent event) {
        event.register(
            ModParticles.MY_PARTICLE,
            MyParticle.Factory::new
        );
    }
}
```

### 4. particles/*.json（多纹理粒子）

放在 `assets/<modid>/particles/<particlename>.json`：

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

## 生成粒子

### 客户端生成（本地效果）

```java
World world = ...;
world.spawnParticle(
    ModParticles.MY_PARTICLE,  // ParticleType
    x, y, z,                  // 位置
    (int) count,              // 粒子数量
    dx, dy, dz,               // 散布范围
    speed                    // 速度倍率
);
```

### 服务端生成（广播给所有附近客户端）

```java
// ServerWorld
world.getServer().getWorld(WorldType.DEFAULT).spawnParticle(
    player,                    // 来源玩家（可传 null）
    ModParticles.MY_PARTICLE,
    true,                     // 是否始终可见
    x, y, z,
    count,
    dx, dy, dz,
    speed
);
```

> 服务端调用 `world.spawnParticle` 不会产生任何效果（服务端没有粒子系统）。

## Decision: 选择粒子注册方式

```
IF 粒子有多个纹理
  → particles/*.json + SpriteTexturedParticle

IF 粒子只有单一纹理
  → 直接使用 ParticleType（无需 JSON）
```

## Decision: 选择生成方式

```
IF 客户端本地效果（客户端事件、GUI）
  → world.spawnParticle(...)（客户端 World）

IF 服务端触发、所有附近客户端看到
  → world.getServer().getWorld(...).spawnParticle(player, ...)
```

## 常见错误

- ❌ 在服务端调用客户端的 `world.spawnParticle` → 服务端没有粒子系统
- ❌ 使用 `ParticleRenderType` → 1.14.4 没有这个枚举
- ❌ `world.isRemote` vs `world.isRemote`：注意逻辑端判断

## 参考资料

- 官方文档：https://docs.minecraftforge.net/en/1.14.4/

## 扩展点

| 配合 Skill | 协作说明 |
|-----------|---------|
| `mc-blockentity` | 方块工作时在 tick 中生成粒子 |
| `mc-entity` | 生物死亡/攻击时生成粒子 |
| `mc-networking` | 服务端广播粒子到指定玩家 |
