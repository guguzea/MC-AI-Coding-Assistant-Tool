# Fabric 粒子系统命令参考

本文件描述 Fabric 1.20.1 平台上进行粒子（Particle）系统开发时所需掌握的核心 API 和常用命令。

## 核心概念

粒子是 Minecraft 中用于视觉效果的微小元素，如烟雾、火焰、尘埃、泡沫等。Fabric 中粒子系统包括三个主要组件：`ParticleType`（粒子类型定义）、`ParticleEffect`（粒子效果参数）、`ParticleRenderType`（粒子渲染方式）。粒子是纯客户端效果，不会同步到服务端，因此所有粒子代码都在客户端执行或通过 Mixin 注入。

## 粒子类型注册命令

### BasicParticleType 创建命令

创建基础粒子类型是最简单的方式：

```java
private static final RegistrySupplier<ParticleType<BasicParticleEffect>> MY_PARTICLE = 
    Registry.register(
        Registries.PARTICLE_TYPE,
        new Identifier(MOD_ID, "my_particle"),
        new BasicParticleEffect(
            new Identifier(MOD_ID, "particle_texture"),  // 粒子纹理
            false  // alwaysShow：是否始终显示（不受粒子设置影响）
        )
    );
```

`BasicParticleEffect` 需要粒子纹理参数和显示设置。如果不需要特殊参数，可以使用 `BasicParticleType` 的简化版本。

### 自定义 ParticleEffect 命令

对于需要额外参数的粒子，创建自定义 `ParticleEffect` 实现类：

```java
public class MyParticleEffect implements ParticleEffect {
    private final Identifier texture;
    private final float red, green, blue;
    private final float scale;
    
    public MyParticleEffect(Identifier texture, float red, float green, float blue, float scale) {
        this.texture = texture;
        this.red = red;
        this.green = green;
        this.blue = blue;
        this.scale = scale;
    }
    
    @Override
    public ParticleType<?> getType() {
        return MY_PARTICLE.get();
    }
    
    @Override
    public void write(ParticleWriter writer) {
        writer.writeFloat(red);
        writer.writeFloat(green);
        writer.writeFloat(blue);
        writer.writeFloat(scale);
    }
    
    // 工厂方法
    public static Factory factory() {
        return (texture, buf, id) -> new MyParticleEffect(
            texture,
            buf.readFloat(),
            buf.readFloat(),
            buf.readFloat(),
            buf.readFloat()
        );
    }
}
```

### 自定义 ParticleType 命令

注册带参数的自定义粒子类型：

```java
private static final RegistrySupplier<ParticleType<MyParticleEffect>> MY_PARTICLE = 
    Registry.register(
        Registries.PARTICLE_TYPE,
        new Identifier(MOD_ID, "my_particle"),
        new ParticleType<MyParticleEffect>(false) {  // false = 不用 alwaysShow
            @Override
            public Factory getParametersFactory() {
                return MyParticleEffect.factory();
            }
        }
    );
```

构造函数参数 `false` 表示粒子受客户端粒子设置控制（玩家可以关闭）。

## 粒子发射命令

### World.addParticle() 命令

在世界中发射粒子的基本命令：

```java
// 无参数粒子
world.addParticle(
    MY_PARTICLE.get(),  // 粒子类型
    x, y, z,            // 位置
    dx, dy, dz           // 速度偏移
);

// 带参数的粒子
world.addParticle(
    new MyParticleEffect(myTexture, 1.0f, 0.0f, 0.0f, 1.0f),
    x, y, z,
    velocityX, velocityY, velocityZ
);
```

`addParticle()` 默认只在客户端执行，服务端调用不会显示任何效果。需要在 Mixin 或事件中根据 `world.isClient` 判断。

### spawnParticles 便捷方法命令

某些实体类提供了更便捷的粒子发射方法：

```java
// 在玩家位置发射粒子
player.playSound(SoundEvents.ENTITY_GENERIC_EXPLODE, 1.0f, 1.0f);
// 对应的事件会自动生成爆炸粒子

// 使用 WorldModificationEvents 服务端触发客户端效果
// 需要通过网络同步
```

## 粒子参数命令

### ParticleEffect 参数命令

`ParticleEffect` 接口提供读写粒子参数的方法。常见参数包括：

```java
// 位置参数（传递给 addParticle）
x, y, z        // 粒子出现位置
velocityX/Y/Z  // 初始速度

// 自定义参数（在 write/read 中序列化）
// 通常包括颜色、大小、生命值、旋转等
```

### ParticleTexture 命令

粒子纹理是 PNG 图片，通常 16x16 或 32x32 像素。放在 `src/main/resources/assets/{modid}/textures/particle/` 目录。纹理会自动注册为 `Identifier`，只需传入纹理路径即可。

### ParticleGroup 命令

粒子组用于控制一群粒子的共同行为，如爆炸效果。创建 `DefaultParticleType` 并配置为同一组：

```java
// 爆炸效果通常由多个粒子组成
// 使用 WorldRenderer 添加粒子效果组
```

## 粒子渲染命令

### ParticleRenderType 创建命令

粒子渲染类型定义粒子的渲染方式。常用类型包括：

```java
ParticleRenderTypes.getCutout()           // 透明裁剪渲染
ParticleRenderTypes.getTranslucent()      // 半透明渲染
ParticleRenderTypes.getWeather()         // 天气粒子
ParticleRenderTypes.getEntitySolid()      // 实体固体渲染
```

### 自定义粒子渲染器命令

对于特殊效果的粒子，需要自定义渲染器：

```java
// 在客户端入口点
public class ExampleModClient implements ClientModInitializer {
    @Override
    public void onInitializeClient() {
        // 注册自定义粒子渲染器
        BuiltParticleRenderer.register(
            MY_PARTICLE.get(),
            MyParticleRenderer::new
        );
    }
}
```

## 常用粒子效果命令

### DustParticleEffect 命令

创建彩色尘埃粒子效果：

```java
DustParticleEffect effect = new DustParticleEffect(
    new ParticleTextureSheets.SheetParticleSprite(particleTexture),  // 纹理
    1.0f, 0.0f, 0.0f,  // RGB 颜色
    1.0f                // 缩放
);
world.addParticle(effect, x, y, z, velocityX, velocityY, velocityZ);
```

### SculkChargeParticleEffect 命令

幽匿感电粒子效果：

```java
SculkChargeParticleEffect effect = new SculkChargeParticleEffect(
    particleTexture,
    0.5f  // 电荷因子
);
```

### ShridewaveParticleEffect 命令

尖叫虫波浪粒子效果。

### DustPlumeParticleEffect 命令

尘埃羽流粒子效果（Fabric 1.20+ 新增）。

## Mixin 注入命令

### 实体粒子注入命令

通过 Mixin 在实体中注入粒子：

```java
@Mixin(LivingEntity.class)
public class LivingEntityParticleMixin {
    @Inject(method = "tick", at = @At("TAIL"))
    private void onTick(CallbackInfo ci) {
        LivingEntity entity = (LivingEntity)(Object)this;
        if (entity.world.isClient && entity.age % 10 == 0) {
            // 每10tick发射一次粒子
            entity.world.addParticle(
                MY_PARTICLE.get(),
                entity.getX() + randomOffset(),
                entity.getY() + randomOffset(),
                entity.getZ() + randomOffset(),
                0, 0.1, 0
            );
        }
    }
}
```

### 方块粒子注入命令

方块破坏时发射粒子：

```java
@Mixin(Block.class)
public class BlockParticleMixin {
    @Inject(method = "onBreak", at = @At("HEAD"))
    private void onBreak(World world, BlockPos pos, BlockState state, CallbackInfo ci) {
        if (world.isClient) {
            // 破坏方块时发射自定义粒子
            for (int i = 0; i < 8; i++) {
                world.addParticle(
                    MY_PARTICLE.get(),
                    pos.getX() + 0.5 + randomOffset(),
                    pos.getY() + 0.5 + randomOffset(),
                    pos.getZ() + 0.5 + randomOffset(),
                    randomVelocity(),
                    randomVelocity(),
                    randomVelocity()
                );
            }
        }
    }
}
```

## 网络同步命令

### 服务端触发粒子命令

粒子是纯客户端效果。如果需要服务端触发，需要通过网络包同步：

```java
// 服务端发送网络包
ServerPlayNetworking.send(player, PARTICLE_PACKET_ID,
    PacketByteBuf.createUnpooled()
        .writeInt(pos.getX())
        .writeInt(pos.getY())
        .writeInt(pos.getZ())
        .writeInt(particleTypeId));

// 客户端接收并显示
ClientSidePacketRegistry.INSTANCE.register(PARTICLE_PACKET_ID, (context, buf) -> {
    BlockPos pos = new BlockPos(buf.readInt(), buf.readInt(), buf.readInt());
    int typeId = buf.readInt();
    context.queue(() -> {
        MinecraftClient client = MinecraftClient.getInstance();
        World world = client.world;
        if (world != null) {
            world.addParticle(
                Registries.PARTICLE_TYPE.get(typeId),
                pos.getX() + 0.5, pos.getY() + 0.5, pos.getZ() + 0.5,
                0, 0.1, 0
            );
        }
    });
});
```

## 粒子工厂命令

### SpriteParticleTexture Sheet 命令

粒子通常使用精灵图集，多个粒子共享一张纹理：

```java
// 在客户端初始化粒子工厂
@Environment(EnvType.CLIENT)
public class MyParticleFactory implements ParticleFactory<MyParticleEffect> {
    private final SpriteProvider spriteProvider;
    
    public MyParticleFactory(SpriteProvider spriteProvider) {
        this.spriteProvider = spriteProvider;
    }
    
    @Override
    public Particle createSprite(MyParticleEffect parameters, 
                                  SpriteProvider sprites,
                                  double x, double y, double z,
                                  double velocityX, double velocityY, double velocityZ) {
        return new MySpriteParticle(
            sprites.getSprite(0),  // 选择精灵图中的哪一帧
            parameters
        );
    }
}
```

注册工厂：`ParticleRegistry.register(MY_PARTICLE.get(), MyParticleFactory::new)`
