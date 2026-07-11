---
name: mc-mixin
description: Minecraft Forge Mixin 注入。安全使用 @Mixin、@Inject、@At、@ModifyVariable。触发词：Mixin、@Inject、@At、mixins.json、AccessWidener、ASM
platform: forge
version: "1.15.2"
dependencies: []
mappings: mcp
---

# Mixin 注入（Forge 1.15.2）

## 快速开始

Mixin 通过修改已编译的字节码实现运行时注入。Forge 使用 Mixin 框架。

### 1. 添加依赖（build.gradle）

```groovy
dependencies {
    implementation 'org.spongepowered:mixin:0.8+: Shade mixin'
}
```

### 2. 配置 mixins.json

文件：`src/main/resources/<modid>.mixins.json`

```json
{
  "required": true,
  "minVersion": "0.8",
  "package": "com.example.examplemod.mixin",
  "compatibilityLevel": "JAVA_8",
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
  → @Inject + At.HEAD / At.RETURN
```

## @Inject 用法

```java
@Mixin(PlayerEntity.class)
public class MixinPlayer {
    @Inject(
        at = @At(value = "HEAD"),
        method = "attack(Lnet/minecraft/entity/LivingEntity;)V"
    )
    private void onAttack(LivingEntity target, CallbackInfo ci) {
        // 在原方法执行前运行
    }
}
```

## @At 位置选项

| `value` | 含义 |
|----------|------|
| `HEAD` | 方法第一条指令 |
| `RETURN` | 方法 return 之前 |
| `TAIL` | 方法最后一条指令 |
| `INVOKE` | 特定指令调用 |
| `NEW` | new 指令 |

## Access Widener

Access Widener 开放 `private`/`protected` 成员为 `public`，无需字节码注入。

### 配置 Access Widener

文件：`src/main/resources/META-INF/accesstransformer.cfg`
```
# 开放 private 方法为 public
public net.minecraft.entity.Entity getHealth()V
# 开放 protected 字段为 public
public net.minecraft.entity.Entity health F
```

## 常见错误

- ❌ Mixin 注入到构造函数：`@Inject` 不能用于构造函数
- ❌ 错误的 `@At` 参数
- ❌ 在 Mixin 中 `new` 实例：Mixin 是在运行时字节码层面注入
- ❌ 混淆冲突：`refmap` 必须与 mixin 配置一致

## 参考资料

- Mixin 文档：https://github.com/SpongePowered/Mixin

## 扩展点

| 配合 Skill | 协作说明 |
|-----------|---------|
| `mc-registry` | Access Widener 开放注册类的 private 成员供 Mixin 访问 |
