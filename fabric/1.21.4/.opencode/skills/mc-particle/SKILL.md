[DONOR_SKILL 禁止直接抄写]
本 Skill 正文为本地维护的结构/流程草稿，未经官方 API 核验（无外部捐入源版本：fabric/1.21.3 无同名技能；fabric/1.21.8 与 fabric/1.21.10 的同名 Skill 均由本档派生）。不得直接使用正文里的类名/方法。先 search_fabric_docs(version=1.21.4) 核对类名/方法签名（不要用 version=1.21.3），对不上就改口官方文档、禁止照抄。Yarn 档互捐，禁止把 26.1.2 mojmap 当本档。

---

---
name: mc-particle
description: Fabric 粒子系统。ParticleType、ParticleHandler、DefaultParticleType。触发词：粒子、Particle、ParticleType
platform: fabric
version: "1.21.4"
dependencies: []
mappings: yarn
---

# 粒子系统（Fabric 1.21.4）

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
        Identifier.of(MOD_ID, "my_particle"),
        new MyParticleType()
    );

// 3. 注册粒子工厂（客户端）
public class ExampleModClient implements ClientModInitializer {
    @Override
    public void onInitializeClient() {
        ParticleFactoryRegistry.INSTANCE.register(
            (ParticleType<MyParticle>) MY_PARTICLE,
            MyParticle.Factory::new
        );
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
