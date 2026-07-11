---
name: mc-particle
description: Minecraft Forge 粒子效果开发。ParticleType 注册、粒子生成。触发词：Particle、ParticleType、ParticleProvider
platform: forge
version: "1.18.2"
---

# 粒子开发（Forge 1.18.2）

## 生成粒子

```java
// 客户端
level.addParticle(MY_PARTICLE.get(), x, y, z, vx, vy, vz);

// 服务端
level.sendParticles(player, MY_PARTICLE.get(), x, y, z, count, dx, dy, dz, speed);
```

## 参考资料

参见 `02-block.mdc`
