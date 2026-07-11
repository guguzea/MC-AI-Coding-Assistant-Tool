# 粒子开发（Forge 1.18.2）

## 注册 ParticleType

```java
private static final DeferredRegister<ParticleType<?>> PARTICLES =
    DeferredRegister.create(ForgeRegistries.PARTICLETYPES, MOD_ID);
```

## 生成粒子

```java
// 客户端
level.addParticle(MY_PARTICLE.get(), x, y, z, vx, vy, vz);

// 服务端
level.sendParticles(player, MY_PARTICLE.get(), x, y, z, count, dx, dy, dz, speed);
```

## 常见错误

- ❌ 在服务端调用 `addParticle`
- ❌ 粒子 `lifetime` 设为 0

## 参考资料

参见 `02-block.mdc`
