# 粒子效果开发（Forge 1.12.2）

## 快速开始

### 粒子渲染类（客户端）

```java
@SideOnly(Side.CLIENT)
public class MyParticle extends EntityFX {
    public MyParticle(World world, double x, double y, double z,
                     double vx, double vy, double vz) {
        super(world, x, y, z, vx, vy, vz);
        this.particleScale = 0.5f;
    }

    @Override
    public void onUpdate() {
        super.onUpdate();
        this.motionY -= 0.01;  // 重力
    }
}
```

### 生成粒子（客户端）

```java
@SideOnly(Side.CLIENT)
public static void spawnParticle(World world, double x, double y, double z) {
    world.spawnParticle(new MyParticle(world, x, y, z, 0, 0.1, 0));
}
```

## 常见错误

- ❌ 在服务端调用 `world.spawnParticle()` → 服务端没有粒子系统
- ❌ 粒子 lifetime 设为 0

## 参考资料

- 详细示例：参见 `05-events.mdc`
