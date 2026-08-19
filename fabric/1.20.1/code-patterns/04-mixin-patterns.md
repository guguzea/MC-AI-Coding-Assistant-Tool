# Mixin 模式（Fabric 1.20.1）

> Fabric 独有：Mixin 是 Fabric 开发的核心部分，Loom 提供原生支持。

## 模式 1：基础 Mixin 类

```yaml
模式: Basic Mixin
平台: Fabric
分类: mixin
依赖: []
扩展点: [fabric.mixins.json]
---
// fabric.mixins.json
{
  "package": "com.example.examplemod.mixin",
  "client": ["client.MyMixin"],
  "mixins": ["common.CommonMixin"]
}

// CommonMixin.java
@Mixin(PlayerEntity.class)
public class CommonMixin {
    @Inject(at = @At("HEAD"), method = "tick")
    private void onTick(CallbackInfo ci) {
        // 每 tick 执行
    }
}
```

## 模式 2：访问目标类成员（@Shadow）

```yaml
模式: Shadow Field Access
平台: Fabric
分类: mixin
依赖: []
扩展点: [@Shadow]
---
@Mixin(PlayerEntity.class)
public abstract class MixinPlayerEntity {
    @Shadow
    public abstract Vec3d getPos();

    @Shadow
    @Final
    private int score;

    @Inject(at = @At("HEAD"), method = "getName")
    private void onGetName(CallbackInfoReturnable<Text> cir) {
        System.out.println("Player name: " + this.score);
    }
}
```

## 模式 3：修改返回值（@ModifyReturnValue）

```yaml
模式: Modify Return Value
平台: Fabric
分类: mixin
依赖: []
扩展点: [@ModifyReturnValue]
---
@Mixin(PlayerEntity.class)
public class MixinPlayerHealth {
    @ModifyReturnValue(
        method = "getMaxHealth()F",
        at = @At("RETURN")
    )
    private float onGetMaxHealth(float original) {
        // 基础生命值 +10
        return original + 10.0f;
    }
}
```

## 模式 4：Access Widener

```yaml
模式: Access Widener
平台: Fabric
分类: mixin
依赖: []
扩展点: [loom configuration]
---
// examplemod.accesswidener
accessWidener v2
# 开放 private 方法为 public
accessWidener method net/minecraft/entity/LivingEntity getHealth()F public
# 开放 protected 字段为 public
accessWidener field net/minecraft/entity/LivingEntity health F public
```

```groovy
// build.gradle
loom {
    accessWidenerPath = file("src/main/resources/examplemod.accesswidener")
}
```

## 模式 5：客户端 Mixin

```yaml
模式: Client Mixin
平台: Fabric
分类: mixin
依赖: []
扩展点: [ClientModInitializer]
---
// fabric.mixins.json
{
  "client": ["client.MixinMinecraftClient"]
}

// MixinMinecraftClient.java
@Mixin(MinecraftClient.class)
public class MixinMinecraftClient {
    @Inject(at = @At("HEAD"), method = "tick")
    private void onTick(CallbackInfo ci) {
        // 每客户端 tick 执行
    }
}
```

## 模式 6：取消方法执行

```yaml
模式: Cancel Method Execution
平台: Fabric
分类: mixin
依赖: []
扩展点: [CallbackInfo]
---
@Mixin(PlayerEntity.class)
public class MixinPlayerJump {
    @Inject(at = @At("HEAD"), method = "jump", cancellable = true)
    private void onJump(CallbackInfo ci) {
        // 条件性取消跳跃
        if (hasJumpDisabledEffect()) {
            ci.cancel();  // 取消原方法执行
        }
    }
}
```
