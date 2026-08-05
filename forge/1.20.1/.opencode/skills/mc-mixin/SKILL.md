---
name: mc-mixin
description: Minecraft Forge Mixin 注入。安全使用 @Mixin、@Inject、@At、@ModifyVariable。触发词：Mixin、@Inject、@At、mixins.json、AccessWidener、ASM
platform: forge
version: "1.20.1"
dependencies: []
mappings: mcp
---

# Mixin 注入（Forge 1.20.1）

## 快速开始

Mixin 通过修改已编译的字节码实现运行时注入。Forge 使用 Mixin 框架。

### 1. 添加依赖（build.gradle）

```gradle
plugins {
    id 'org.spongepowered.mixin' version '0.7.+'
}

mixin {
    add sourceSets.main, "${mod_id}.refmap.json"
}
```

### 2. 配置 mixins.json

文件：`src/main/resources/{modid}.mixins.json`

```json
{
  "required": true,
  "minVersion": "0.8",
  "package": "com.example.examplemod.mixin",
  "compatibilityLevel": "JAVA_17",
  "refmap": "${mod_id}.refmap.json",
  "client": ["client.SomeMixin"],
  "server": [],
  "mixins": ["common.SomeMixin"]
}
```

### 3. mods.toml 中声明

```toml
[[mixins]]
config = "${mod_id}.mixins.json"
```

## Decision: 选择注入目标

```
IF 注入到类方法（最常见）
  → @Inject + CallbackInfo

IF 修改方法参数值
  → @ModifyVariable

IF 修改方法返回值
  → @ModifyReturnValue

IF 调用原方法前/后执行代码
  → @Inject + At.SHEAD / At.TAIL
```

## @Inject 用法

```java
@Mixin(Player.class)
public class MixinPlayer {
    @Inject(
        at = @At(value = "HEAD"),  // 在方法开头注入
        method = "attack(Lnet/minecraft/world/entity/LivingEntity;)V"
    )
    private void onAttack(LivingEntity target, CallbackInfo ci) {
        // 在原方法执行前运行
        System.out.println("Player attacks!");
    }

    @Inject(
        at = @At(value = "RETURN"),  // 在方法返回前注入
        method = "attack(Lnet/minecraft/world/entity/LivingEntity;)V"
    )
    private void afterAttack(LivingEntity target, CallbackInfo ci) {
        // 在原方法执行完毕后运行
    }
}
```

## @At 位置选项

| `value` | 含义 |
|----------|------|
| `HEAD` | 方法第一条指令 |
| `RETURN` | 方法 return 之前 |
| `TAIL` | 方法最后一条指令（return 之后不存在） |
| `INVOKE` | 特定指令调用 |
| `NEW` | new 指令 |

## @ModifyVariable 用法

```java
@Mixin(Entity.class)
public class MixinEntity {
    @ModifyVariable(
        at = @At(value = "INVOKE", target = "Lnet/minecraft/world/entity/Entity;isGlowing()Z", ordinal = 0),
        method = "isCurrentlyGlowing()Z"
    )
    private boolean modifyGlowing(boolean original) {
        return original || MyMod.hasGlowingEffect(this);
    }
}
```

## @Inject 取消注入

```java
@Inject(
    at = @At("HEAD"),
    method = "someMethod()V",
    cancellable = true    // 允许通过 CallbackInfo.cancel() 取消原方法执行
)
public void someMethod(CallbackInfo ci) {
    if (someCondition) {
        ci.cancel();  // 取消原方法
    }
}
```

## @ModifyArg（修改参数）

```java
@ModifyArg(
    at = @At(value = "INVOKE", target = "Lnet/minecraft/world/item/ItemStack;damage(III)V"),
    index = 0
)
private int modifyDamageAmount(int amount) {
    return Math.min(amount, 10);
}
```

## @Shadow（引用目标类字段/方法）

```java
@Mixin(Player.class)
public abstract class MixinPlayer {
    @Shadow
    public abstract int getScore();

    @Shadow
    @Final
    private int score;
}
```

## Access Widener（替代 Mixin 的轻量方案，与 Mixin 是完全不同的独立技术）

Access Widener 开放 `private`/`protected` 成员为 `public`，无需字节码注入。当 Mixin 过于复杂时使用此方案。

### 与 Mixin 的区别

| | Mixin | Access Widener |
|--|-------|----------------|
| 作用 | 在方法/字段中注入新逻辑 | 直接改变成员可见性 |
| 配置位置 | `mixin {}` 块 + `mixins.json` | `minecraft { accessTransformer }` |
| 运行时机 | 运行时字节码注入 | 编译时重映射 |

### 配置 Access Widener

文件：`src/main/resources/META-INF/accesstransformer.cfg`
```
# 开放 private 方法为 public
public net.minecraft.world.entity.Entity getHealth()V
# 开放 protected 字段为 public
public net.minecraft.world.entity.Entity health F
```

build.gradle 中启用（**不是 `mixin {}` 块，而是 `minecraft {}` 块**）：
```gradle
minecraft {
    accessTransformer = file('src/main/resources/META-INF/accesstransformer.cfg')
}
```

plugins 中**不需要** `org.spongepowered.mixin` 插件。Access Widener 只需要 ForgeGradle 内置支持。

## 常见错误

- ❌ Mixin 注入到构造函数：`@Inject` 不能用于构造函数
- ❌ 错误的 `@At` 参数：`"HEAD"` vs `"RETURN"`（大小写敏感）
- ❌ 在 Mixin 中 `new` 实例：Mixin 是在运行时字节码层面注入，禁止直接实例化
- ❌ 混淆冲突：`refmap` 必须与 mixin 配置一致
- ❌ mixin 类不在 `mixins.json` 中声明：不生效

## 参考资料

- Mixin 文档：https://github.com/SpongePowered/Mixin
- Forge Access Transformer：https://docs.minecraftforge.net/en/latest/advanced/accesstransformers/

## 扩展点

| 配合 Skill | 协作说明 |
|-----------|---------|
| `mc-registry` | Access Widener 开放注册类的 private 成员供 Mixin 访问 |
