---
name: mc-particle
description: Fabric 粒子系统。ParticleType、ParticleHandler、DefaultParticleType。触发词：粒子、Particle、ParticleType
platform: fabric
version: "1.19.4"
dependencies: []
mappings: yarn
---

# 粒子系统（Fabric 1.19.4）

## 快速开始

```java
// 1. 创建粒子类型
public class MyParticleType extends DefaultParticleType {
    public MyParticleType() {
        super(true);  // alwaysShow = true
    }
}

// 2. 注册粒子
private static final ParticleType<?> MY_PARTICLE =
    Registry.register(
        Registries.PARTICLE_TYPE,
        new Identifier(MOD_ID, "my_particle"),
        new MyParticleType()
    );

// 3. 注册粒子工厂（客户端）
public class ExampleModClient implements ClientModInitializer {
    @Override
    public void onInitializeClient() {
        // TODO(未核实)：本包 data/fabric_1.19.4/mappings/
        //   yarn-mappings.json 的 net/minecraft/particle/ 只有 ParticleType / ParticleEffect /
        //   ParticleEffect$Factory / ParticleTypes / DefaultParticleType 等，
        //   不存在 MyParticle，也不存在 MyParticle.Factory（上面定义的类是 MyParticleType）。
        //   ParticleFactoryRegistry 属 Fabric API，未经 ingest_loader_api 入库前签名一律未核实。
        //   核实前不要照抄下面这行：
        // ParticleFactoryRegistry.INSTANCE.register(MY_PARTICLE, /* 工厂实现待核实 */);
    }
}
```

## 常见错误

- ❌忘记在客户端注册粒子工厂 — 粒子不显示
- ❌粒子工厂在服务端执行 — 粒子是客户端的

## 扩展点

| 配合 Skill | 协作说明 |
|-----------|---------|
| `mc-registry` | 粒子类型通过 Registry.register() 注册 |
| `mc-entity` | 实体可以生成粒子 |
