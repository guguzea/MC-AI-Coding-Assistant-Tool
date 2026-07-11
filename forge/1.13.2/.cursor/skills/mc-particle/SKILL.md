---
name: mc-particle
description: Minecraft Forge 粒子效果开发。ParticleType 注册、ParticleHandler。触发词：Particle、ParticleType、Particle
platform: forge
version: "1.13.2"
dependencies: []
mappings: mcp
---

# 粒子开发（Forge 1.13.2）

## 快速开始

### 1. 创建粒子类

```java
public class MyParticle extends Particle {
    public MyParticle(World world, double x, double y, double z,
                      double vx, double vy, double vz) {
        super(world, x, y, z, vx, vy, vz);
        this.particleRed = 1.0f;
        this.particleGreen = 1.0f;
        this.particleBlue = 1.0f;
        this.particleGravity = 1.0F;
        this.particleMaxAge = 40;
    }

    @Override
    public void onUpdate() {
        super.onUpdate();
        this.motionX *= 0.95;
        this.motionY *= 0.95;
        this.motionZ *= 0.95;
    }
}
```

### 2. 注册粒子工厂

```java
public static void register() {
    ParticleRegistry.MY_PARTICLE = new ParticleType(false);
    ParticleRegistry.MY_PARTICLE.setRegistryName(new ResourceLocation(MOD_ID, "my_particle"));
}
```

## 常见错误

- ❌ 粒子在服务端生成 → 使用 `world.spawnParticle()` 在客户端生成

## 参考资料

- Forge 官方文档：https://docs.minecraftforge.net/en/1.13.2/
