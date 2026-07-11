# Mixin 代码模式

适用版本：Fabric 1.21.1

## 基本 Mixin 配置

### fabric.mixins.json

```json
{
  "required": true,
  "package": "com.example.examplemod.mixin",
  "compatibilityLevel": "JAVA_21",
  "injectors": {
    "defaultRequire": 1
  },
  "client": ["client.ClientMixin"],
  "server": [],
  "mixins": ["CommonMixin"]
}
```

## @Inject 使用

```java
@Mixin(ServerWorld.class)
public class CommonMixin {
    @Inject(at = @At("HEAD"), method = "tick")
    private void onTick(CallbackInfo ci) {
        // 在方法开头注入
    }

    @Inject(at = @At("RETURN"), method = "tick")
    private void afterTick(CallbackInfo ci) {
        // 在方法返回前注入
    }

    @Inject(at = @At("TAIL"), method = "tick")
    private void onTickTail(CallbackInfo ci) {
        // 在方法末尾注入
    }

    @Inject(at = @At(value = "INVOKE",
        target = "Lnet/minecraft/world/World;updatePlayers()V"),
        method = "tick")
    private void onUpdatePlayers(CallbackInfo ci) {
        // 在特定方法调用处注入
    }
}
```

## @Redirect 使用

```java
@Mixin(PlayerEntity.class)
public class PlayerMixin {
    @Redirect(method = "tick",
        at = @At(value = "INVOKE",
            target = "Lnet/minecraft/entity/player/PlayerEntity;incrementStat(Lnet/minecraft/util/Identifier;)V"))
    private void onIncrementStat(PlayerEntity player, Identifier id) {
        // 替换原有方法调用
        // 例如：跳过某些统计
        if (!id.equals(new Identifier("minecraft:jump"))) {
            player.incrementStat(id);
        }
    }
}
```

## @ModifyArg / @ModifyArgs 使用

```java
@Mixin(ClientPlayerEntity.class)
public class ClientPlayerMixin {
    @ModifyArg(at = @At(value = "INVOKE",
        target = "Lnet/minecraft/client/MinecraftClient;setScreen(Lnet/minecraft/client/gui/screen/Screen;)V"),
        index = 0,
        method = "openTextChat")
    private Screen modifyOpenChatScreen(Screen screen) {
        // 修改方法参数
        // 例如：返回自定义 Screen
        return screen;
    }
}
```

## @ModifyVariable 使用

```java
@Mixin(Explosion.class)
public class ExplosionMixin {
    @ModifyVariable(method = "affectWorld",
        at = @At("HEAD"),
        ordinal = 0)
    private boolean modifyRandom(boolean random) {
        // 修改变量值
        return false;  // 禁用随机性
    }
}
```

## @ModifyConstant 使用

```java
@Mixin(Items.class)
public class ItemsMixin {
    @ModifyConstant(method = "<clinit>",
        constant = @Constant(intValue = 64),
        slice = @Slice(
            from = @At(value = "INVOKE",
                target = "Lnet/minecraft/item/Item;<init>(Lnet/minecraft/item/Item$Settings;)V")))
    private int modifyStackSize(int original) {
        // 修改常量值
        return 128;  // 将最大堆叠数改为 128
    }
}
```

## @Shadow 使用

```java
@Mixin(PlayerInventory.class)
public class PlayerInventoryMixin {
    @Shadow
    public NonNullList<ItemStack> main;

    @Inject(at = @At("HEAD"), method = "updateItems")
    private void onUpdateItems(CallbackInfo ci) {
        // 访问被 Shadow 的字段
        for (ItemStack stack : main) {
            if (!stack.isEmpty()) {
                // 处理每个物品
            }
        }
    }
}
```

## 访问器 Mixin

```java
@Mixin(PlayerEntity.class)
public interface PlayerEntityAccessor {
    @Accessor
    int getScore();

    @Accessor("score")
    void setScore(int score);

    @Mutator("score")
    void addScore(int amount);
}
```

## 条件注入

```java
@Mixin(PlayerEntity.class)
public class ConditionalMixin {
    @Inject(at = @At("HEAD"), method = "tick")
    private void onTick(CallbackInfo ci,
                        @Local(ordinal = 0) ItemStack stack) {
        // @Local 用于访问局部变量
        if (!stack.isEmpty() && stack.isOf(Items.DIAMOND)) {
            // 当主手持有钻石时
        }
    }
}
```

## 使用 Access Widener

### .accesswidener 文件

```
accessWidener v2

# 访问被 private 的类成员
accessible class net/minecraft/item/ItemStack
accessible field net/minecraft/item/ItemStack *


# 访问被 protected 的成员
accessible class net/minecraft/entity/Entity

# 添加可变成员
mutable field net/minecraft/entity/Entity pos
```

### build.gradle 配置

```groovy
loom {
    accessWidenerPath = file("src/main/resources/${mod_id}.accesswidener")
}
```

### 引用 Access Widener

```java
// 通过 Access Widener 可以直接访问私有成员
@Mixin(PlayerEntity.class)
public class PlayerMixin {
    @Shadow
    private float stepHeight;  // 即使是 private 字段也可以访问

    @Inject(at = @At("HEAD"), method = "jump")
    private void onJump(CallbackInfo ci) {
        stepHeight = 1.5f;  // 修改私有字段
    }
}
```
