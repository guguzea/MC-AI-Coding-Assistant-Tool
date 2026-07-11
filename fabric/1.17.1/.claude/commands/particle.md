# Fabric 粒子系统命令参考

本文件描述 Fabric 1.17.1 平台上进行粒子（Particle）系统开发时所需掌握的核心 API 和常用命令。

## 核心概念

粒子是 Minecraft 中用于视觉效果的微小元素，如烟雾、火焰、尘埃等。粒子是纯客户端效果，不会同步到服务端。

## 粒子类型注册命令

### DefaultParticleType 创建命令

```java
// ✅ 1.17.x 使用 Registry.PARTICLE_TYPE
private static final ParticleType<?> MY_PARTICLE = 
    Registry.register(
        Registry.PARTICLE_TYPE,
        new Identifier(MOD_ID, "my_particle"),
        new DefaultParticleType(true) {}  // alwaysShow = true
    );
```

### 粒子工厂注册（客户端）

```java
// 在 ClientModInitializer 中
public class ExampleModClient implements ClientModInitializer {
    @Override
    public void onInitializeClient() {
        // ✅ 1.17.x 使用 ParticleFactoryManager
        ParticleFactoryManager.INSTANCE.register(
            (DefaultParticleType) MY_PARTICLE,
            new SpriteParticleEffect.Factory(spriteSet)
        );
    }
}
```

## 粒子发射命令

### World.addParticle() 命令

```java
world.addParticle(
    MY_PARTICLE,  // 粒子类型
    x, y, z,      // 位置
    dx, dy, dz    // 速度偏移
);
```

> ⚠️ `addParticle()` 默认只在客户端执行。需要在服务端触发时需通过网络包同步。

## 注意事项

1.17.1 的粒子 API 与 1.20.x 差异较大：
- 使用 `DefaultParticleType` 代替 `BasicParticleType`
- 使用 `ParticleFactoryManager` 代替 `ParticleFactoryRegistry`
- 使用 `SpriteParticleEffect` 代替某些其他类型

建议参考 Minecraft 1.17.1 原版源码。
