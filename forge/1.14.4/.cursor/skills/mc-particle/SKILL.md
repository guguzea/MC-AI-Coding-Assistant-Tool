---
name: mc-particle
description: Minecraft Forge 粒子效果开发。ParticleType 注册、ParticleProvider、particles.json、SpriteSet、渲染。触发词：Particle、ParticleType、ParticleProvider、RegisterParticleProvidersEvent、ParticleRenderType
platform: forge
version: "1.14.4"
dependencies: []
mappings: mcp
---

# 粒子开发（Forge 1.14.4）

## 快速开始

### 1. 注册 ParticleType（通用端）

```java
private static final DeferredRegister<ParticleType<?>> PARTICLES =
    new DeferredRegister<>(ForgeRegistries.PARTICLE_TYPES, MOD_ID);

public static final RegistryObject<BasicParticleType> MY_PARTICLE =
    PARTICLES.register("my_particle", () -> new BasicParticleType(false));

PARTICLES.register(modEventBus);
```

### 2. 创建粒子类（客户端）

```java
public class MyParticle extends Particle {
    public MyParticle(World world, double x, double y, double z,
                      double vx, double vy, double vz) {
        super(world, x, y, z, vx, vy, vz);
        this.particleRed = 1.0f;
        this.particleGreen = 1.0f;
        this.particleBlue = 1.0f;
        this.particleGravity = 0.04F;
        this.particleMaxAge = 20;
    }

    @Override
    public void onUpdate() {
        super.onUpdate();
        this.motionY -= 0.01;
    }
}
```

### 3. 注册粒子工厂（客户端）

```java
@Mod.EventBusSubscriber(modid = MOD_ID, bus = Mod.EventBusSubscriber.Bus.MOD, value = Dist.CLIENT)
public class ParticleFactories {
    @SubscribeEvent
    public static void registerFactories(ParticleFactoryRegisterEvent event) {
        Minecraft.getInstance().particles.registerFactory(
            ModParticles.MY_PARTICLE.get(),
            new IParticleFactory<BasicParticleType>() {
                @Override
                public Particle makeParticle(BasicParticleType type, World world,
                    double x, double y, double z, double vx, double vy, double vz) {
                    return new MyParticle(world, x, y, z, vx, vy, vz);
                }
            }
        );
    }
}
```

## 生成粒子

### 客户端

```java
world.addParticle(ModParticles.MY_PARTICLE.get(), x, y, z, vx, vy, vz);
```

### 服务端

```java
((ServerWorld) world).spawnParticle(
    player, ModParticles.MY_PARTICLE.get(), true,
    x, y, z, count, dx, dy, dz, speed
);
```

## 常见错误

- ❌ `RegisterParticleProvidersEvent` / `TextureSheetParticle` — 1.16+ API
- ❌ 在服务端调用 `addParticle` → 无效果
- ❌ 粒子 `particleMaxAge` 设为 0 → 立即消失

## 参考资料

- Forge 官方文档：https://docs.minecraftforge.net/en/1.14.4/gameeffects/particles/

## 扩展点

| 配合 Skill | 协作说明 |
|-------------|-----------|
| `mc-blockentity` | 方块工作时在 tick 中生成粒子 |
| `mc-entity` | 生物死亡/攻击时生成粒子 |
