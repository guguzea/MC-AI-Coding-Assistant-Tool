---
name: mc-mixin
description: Fabric Mixin 注入。Loom 一流支持，fabric.mixins.json，@Mixin、@Inject、@At。触发词：Mixin、@Inject、@At、fabric.mixins.json、AccessWidener
platform: fabric
version: "1.14.4"
dependencies: []
mappings: yarn
---

# Mixin 注入（Fabric 1.14.4）

## 快速开始

Fabric 使用 Loom 编译器，Mixin 支持是一等的。只需在 `fabric.mixins.json` 中配置即可。

### 1. 配置 fabric.mixins.json

```json
{
  "required": true,
  "minVersion": "0.8",
  "package": "com.example.examplemod.mixin",
  "compatibilityLevel": "JAVA_17",
  "client": ["client.MyClientMixin"],
  "server": [],
  "mixins": ["common.MyCommonMixin"]
}
```

### 2. 创建 Mixin 类

```java
@Mixin(PlayerEntity.class)
public class MixinPlayerEntity {
    @Shadow
    public abstract int getHealth();

    @Inject(at = @At("HEAD"), method = "tick")
    private void onTick(CallbackInfoReturnable ci) {
        // 在 tick 方法开头执行
    }

    @Inject(at = @At("RETURN"), method = "getHealth")
    private void onGetHealth(CallbackInfoReturnable<Integer> cir) {
        // 在 getHealth 返回后执行
        System.out.println("Health: " + cir.getReturnValue());
    }
}
```

### 3. 在 fabric.mod.json 中声明

```json
{
  "mixins": ["examplemod.mixins.json"]
}
```

## Decision: 选择注入目标

```
IF 注入到类方法
  → @Inject + CallbackInfo

IF 修改方法返回值
  → @ModifyReturnValue

IF 修改方法参数
  → @ModifyVariable

IF 在方法特定位置注入
  → @At(value = "INVOKE", target = "...")
```

## @Inject 用法

```java
@Mixin(PlayerEntity.class)
public class MixinPlayerEntity {
    @Inject(
        at = @At(value = "HEAD"),
        method = "jump")
    private void onJump(CallbackInfo ci) {
        // 在 jump 方法开头执行
    }

    @Inject(
        at = @At(value = "TAIL"),
        method = "jump")
    private void afterJump(CallbackInfo ci) {
        // 在 jump 方法末尾执行
    }
}
```

## @At 位置选项

| value | 含义 |
|-------|------|
| `HEAD` | 方法第一条指令 |
| `RETURN` | return 之前 |
| `TAIL` | 方法最后一条指令 |
| `INVOKE` | 调用特定方法时 |
| `NEW` | new 指令时 |

## @Shadow 用法

```java
@Mixin(PlayerEntity.class)
public abstract class MixinPlayerEntity {
    @Shadow
    public abstract Vec3d getRotationVector();

    @Shadow
    @Final
    private int score;

    @Shadow
    public abstract boolean isSneaking();
}
```

## @ModifyReturnValue

```java
@Mixin(PlayerEntity.class)
public class MixinPlayerEntity {
    @ModifyReturnValue(
        method = "getHealth()I",
        at = @At("RETURN")
    )
    private int addHealthBonus(int original) {
        return original + 10;  // 生命值 +10
    }
}
```

## Access Widener（轻量替代 Mixin）

Access Widener 可以将 `private` / `protected` 成员开放为 `public`，无需字节码注入。

### 1. 创建 .accesswidener 文件

```
# examplemod.accesswidener
accessWidener v2
accessWidener class net/minecraft/entity/LivingEntity health # 开放 health 字段
accessWidener method net/minecraft/entity/LivingEntity getHealth()I public # 开放 getHealth 方法
```

### 2. 在 build.gradle 中配置 Loom

```groovy
loom {
    accessWidenerPath = file("src/main/resources/examplemod.accesswidener")
}
```

## 与 Forge Mixin 的区别

| 维度 | Forge | Fabric |
|------|-------|--------|
| 配置方式 | `mixin {}` 块 + `mixins.json` | `fabric.mixins.json` |
| 编译器 | 需配置 `org.spongepowered.mixin` 插件 | **Loom 原生支持** |
| 注入时机 | mods.toml 中声明 | `fabric.mod.json` 中 `mixins` 字段 |
| Access Widener | `META-INF/accesstransformer.cfg` | `.accesswidener` + Loom 配置 |

## 常见错误

- ❌ 忘记在 `fabric.mixins.json` 中声明 mixin — 注入不生效
- ❌ mixin 包名与 `fabric.mixins.json` 中的 `package` 不一致 — 注入失败
- ❌ 在 `fabric.mixins.json` 的 `mixins` 中声明客户端 mixin — 应该在 `client` 中
- ❌ 在 Mixin 中 `new` 实例 — 禁止

## 扩展点

| 配合 Skill | 协作说明 |
|-----------|---------|
| `mc-registry` | Mixin 访问已注册对象的 private 成员 |
| `mc-entity` | Mixin 用于修改实体行为 |
