---
name: mc-mixin
description: Minecraft Forge Mixin 注入。安全使用 @Mixin、@Inject、@At、@ModifyVariable。触发词：Mixin、@Inject、@At、mixins.json、AccessTransformer、ASM
platform: forge
version: "1.19.4"
dependencies: []
mappings: parchment
---

# Mixin 注入（Forge 1.19.4）

Mixin 通过修改已编译的字节码实现运行时注入。Forge 使用 Mixin 框架。

## 快速开始

### 1. 构建（不要抄未核插件坐标）

官方 Forge 文档检索**没有**独立 Mixin 教程页。官方 1.20.1 MDK（`MinecraftForge/1.20.1` 的 `mdk/build.gradle` / `mods.toml`）**没有** `id 'org.spongepowered.mixin'`，也**没有** `[[mixins]]`。Mixin 运行时随 Forge 提供；`mixins.json` 形态见 [Sponge Mixin wiki](https://github.com/SpongePowered/Mixin/wiki)。核不到本档 Gradle 插件坐标就停，不要写 `0.7.+`。

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

### 3. mods.toml

`[[mixins]]` **不是** 1.20.1 官方 MDK 原文（该 MDK 的 `mods.toml` 无此段）。NeoForge 1.21.1 文档 `gettingstarted/modfiles` 才核到 `[[mixins]]` + `config`。本档不要把邻加载器 TOML 当 Forge MDK。

## Decision: 选择注入目标

```
IF 注入到类方法（最常见）
  → @Inject + CallbackInfo

IF 修改方法参数值
  → @ModifyVariable

IF 修改方法返回值
  → @Inject RETURN + CallbackInfoReturnable；@ModifyReturnValue 仅 MixinExtras

IF 调用原方法前/后执行代码
  → @Inject + HEAD / At.TAIL
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

## Access Transformer（替代 Mixin 的轻量可见性方案，与 Mixin 是不同技术）

Access Transformer 开放 `private`/`protected` 成员为 `public`，无需字节码注入。当 Mixin 过于复杂时使用此方案。

### 与 Mixin 的区别

| | Mixin | Access Transformer |
|--|-------|----------------|
| 作用 | 在方法/字段中注入新逻辑 | 直接改变成员可见性 |
| 配置位置 | `mixin {}` 块 + `mixins.json` | `minecraft { accessTransformers }` |
| 运行时机 | 运行时字节码注入 | 编译时重映射 |

### 配置 Access Transformer

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

plugins 中**不需要** `org.spongepowered.mixin` 插件。Access Transformer 由 ForgeGradle 读取 accesstransformer.cfg。

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
|-------------|-----------|
| `mc-registry` | Access Transformer 开放注册类的 private 成员供 Mixin 访问 |
