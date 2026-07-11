---
name: particle
description: Minecraft Forge 粒子效果（Forge 1.13.2）。Particle 注册、生成。触发词：Particle、ParticleType
---

# 粒子开发（Forge 1.13.2）

## 快速开始

```java
public class MyParticle extends Particle {
    public MyParticle(World world, double x, double y, double z, ...) {
        super(world, x, y, z, ...);
    }
}
```

## 参考资料

- Forge 官方文档：https://docs.minecraftforge.net/en/1.13.2/
