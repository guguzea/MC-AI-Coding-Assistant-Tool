---
name: mc-particle
description: Minecraft Forge 粒子效果开发。粒子注册、粒子渲染。触发词：Particle、ParticleType、EntityFX、RenderingRegistry
platform: forge
version: "1.12.2"
dependencies: []
mappings: mcp
---

# 粒子开发（Forge 1.12.2）

1.12 无 `ParticleType` 注册表。客户端自定义 `Particle` + `effectRenderer.addEffect`；服务端用 `EnumParticleTypes`。

## 快速开始

### 1. 创建粒子类（客户端）

```java
@SideOnly(Side.CLIENT)
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
        this.motionY -= 0.01; // 重力
    }

    @Override
    public int getBrightnessForRender(float partialTick) {
        return 0xF000F0;
    }
}
```

### 2. 生成粒子（客户端）

```java
@SideOnly(Side.CLIENT)
public static void spawnParticleClient(World world, double x, double y, double z) {
    Minecraft.getMinecraft().effectRenderer.addEffect(
        new MyParticle(world, x, y, z, 0, 0.1, 0)
    );
}
```

### 3. 生成粒子（服务端）

```java
if (!world.isRemote) {
    ((WorldServer) world).spawnParticle(
        EnumParticleTypes.EXPLOSION_NORMAL,
        x, y, z, 1, 0, 0.1, 0, 0.05
    );
}
```

## 常见错误

- ❌ 把粒子注册成 `SoundEvent` 或 `RegistryEvent` — 1.12 无粒子注册表
- ❌ 使用 `EntityFX` — MCP 类名是 `Particle`
- ❌ 在服务端调用 `effectRenderer.addEffect()` → 仅客户端有效

## 参考资料

- 详细示例：参见 `05-events.mdc`

## 扩展点

| 配合 Skill | 协作说明 |
|------------|---------|
| `mc-block` | 方块工作时在 tick 中生成粒子 |
| `mc-entity` | 生物死亡/攻击时生成粒子 |
