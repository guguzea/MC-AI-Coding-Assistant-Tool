---
name: mc-particle
description: Minecraft Forge 粒子效果开发。ParticleType 注册、ParticleManager、粒子渲染。触发词：Particle、ParticleType、ParticleManager
platform: forge
version: "1.15.2"
dependencies: []
mappings: mcp
---

# 粒子开发（Forge 1.15.2）

粒子分为两部分：**通用端**（引用/注册粒子类型）和**客户端**（渲染逻辑）。

## 快速开始

### 1. 注册 ParticleType（通用端）

```java
private static final DeferredRegister<ParticleType<?>> PARTICLES =
    DeferredRegister.create(ForgeRegistries.PARTICLE_TYPES, MOD_ID);

public static final RegistryObject<ParticleType<?>> MY_PARTICLE =
    PARTICLES.register("my_particle",
        () -> new ParticleType(false) {}
    );

// 在 mod 构造函数中
PARTICLES.register(modEventBus);
```

### 2. 创建粒子渲染类（客户端）

```java
public class MyParticle extends SpriteTexturedParticle {
    public MyParticle(World world, double x, double y, double z,
                      double vx, double vy, double vz) {
        super(world, x, y, z, vx, vy, vz);
        this.particleScale *= 0.5f;             // 粒子大小
        this.maxAge = 20;                        // 存活 tick 数
    }

    @Override
    public void tick() {
        super.tick();
        // 粒子行为
    }

    @Override
    protected int getBrightnessForRender(float partialTick) {
        return 15728880;
    }
}
```

### 3. 注册粒子工厂（客户端）

```java
@Mod.EventBusSubscriber(modid = MOD_ID, value = Dist.CLIENT)
public class ParticleRenderers {
    @SubscribeEvent
    public static void registerParticleFactories(RegistryEvent.Register<ParticleType<?>> event) {
        MinecraftForge.EVENT_BUS.register(new IParticleFactory<MyParticle>() {
            @Override
            public Particle makeParticle(ParticleType type, World world, double x, double y, double z,
                                        double vx, double vy, double vz) {
                return new MyParticle(world, x, y, z, vx, vy, vz);
            }
        });
    }
}
```

## 生成粒子

### 客户端生成（本地效果）

```java
World world = ...;
world.addParticle(
    ModParticles.MY_PARTICLE.get(),  // ParticleType
    x, y, z,                         // 位置
    vx, vy, vz                        // 速度偏移
);
```

### 服务端生成（广播给所有附近客户端）

```java
// ServerWorld
world.playSound(...);  // 不能直接生成粒子，需用网络包
```

## Decision: 选择生成方式

```
IF 客户端本地效果（客户端事件、GUI、渲染回调）
  → world.addParticle(...)

IF 服务端触发、所有附近客户端看到
  → 通过 mc-networking Skill 发自定义包，客户端收到后 addParticle
```

## 常见错误

- ❌ 在服务端调用 `world.addParticle` → 无效果
- ❌ 粒子 `maxAge` 设为 0 → 粒子立即消失

## 扩展点

| 配合 Skill | 协作说明 |
|-----------|---------|
| `mc-blockentity` | 方块工作时在 tick 中生成粒子 |
| `mc-entity` | 生物死亡/攻击时生成粒子 |
| `mc-networking` | 服务端广播粒子到指定玩家 |
