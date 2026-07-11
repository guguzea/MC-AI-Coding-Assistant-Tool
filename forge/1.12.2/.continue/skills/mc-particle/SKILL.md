---
name: mc-particle
description: Forge 1.12.2 Particle skill (EntityFX, @SideOnly)
platform: forge
version: "1.12.2"
dependencies: []
mappings: mcp
---

# 粒子开发（Forge 1.12.2）

粒子在 Forge 1.12.2 中使用 `EntityFX` 和 `RenderingRegistry`。

## 快速开始

### 1. 注册粒子类型（声音事件）

```java
@Mod.EventBusSubscriber(modid = MOD_ID)
public class ModParticles {
    @SubscribeEvent
    public static void register(RegistryEvent.Register<SoundEvent> event) {
        event.getRegistry().register(
            new SoundEvent(new ResourceLocation(MOD_ID, "my_particle"))
                .setRegistryName(MOD_ID, "my_particle")
        );
    }
}
```

### 2. 创建粒子渲染类（客户端）

```java
@SideOnly(Side.CLIENT)
public class MyParticle extends EntityFX {
    public MyParticle(World world, double x, double y, double z,
                     double vx, double vy, double vz) {
        super(world, x, y, z, vx, vy, vz);
        this.motionX = vx;
        this.motionY = vy;
        this.motionZ = vz;
        this.particleScale = 0.5f;
        this.particleMaxScale = 1.0f;
        this.noClip = false;
    }

    @Override
    public void onUpdate() {
        super.onUpdate();
        this.motionY -= 0.01;  // 重力
        this.setParticleTextureAge(particleTexture);
    }

    @Override
    public int getBrightnessForRender(float partialTick) {
        return 0xF000F0;
    }
}
```

### 3. 生成粒子（客户端）

```java
@SideOnly(Side.CLIENT)
public static void spawnParticle(World world, double x, double y, double z) {
    world.spawnParticle(
        new MyParticle(world, x, y, z, 0, 0.1, 0)
    );
}
```

## 常见错误

- ❌ 在服务端调用 `world.spawnParticle()` → 服务端没有客户端粒子系统
- ❌ 粒子 lifetime 设为 0 → 粒子立即消失

## Key Forge 1.12.2 Specs

- EntityFX (not Particle)
- @SideOnly(Side.CLIENT) (not @OnlyIn(Dist.CLIENT))
- world.spawnParticle() (not level.addParticle())
- RenderingRegistry (for advanced particle registration)
