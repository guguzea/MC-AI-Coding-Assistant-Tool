---
name: mc-mixin
description: Minecraft NeoForge Mixin 注入。安全使用 @Mixin、@Inject、@At、@ModifyVariable。触发词：Mixin、@Inject、@At、mixins.json、AccessWidener、ASM
platform: neoforge
version: "1.20.4"
dependencies: []
mappings: mcp
---

# Mixin 注入（NeoForge 1.20.4）

Mixin 通过修改已编译的字节码实现运行时注入。NeoForge 使用 Mixin 框架。

## 快速开始

### 1. 构建

扁平 `neoforge/.cursor` 不是 1.21.x 规则树。NeoForge 1.21.1 文档 `gettingstarted/modfiles` 用 `[[mixins]]` + `config`，**不是** `org.spongepowered.mixin` `0.7.+`。按精确版本读 `neoforge/<ver>/`。

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

### 3. neoforge.mods.toml 中声明

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
  → @Inject RETURN + CallbackInfoReturnable；@ModifyReturnValue 仅 MixinExtras

IF 调用原方法前/后执行代码
  → @Inject + At.HEAD / At.TAIL
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

## NeoForge 1.20.4 Mixin 配置

NeoForge 1.20.4 使用 NeoGradle，Mixin 配置略有不同：

```toml
# neoforge.mods.toml
[[mixins]]
config = "${mod_id}.mixins.json"
```

## 常见错误

- ❌ Mixin 注入到构造函数：`@Inject` 不能用于构造函数
- ❌ 错误的 `@At` 参数：`"HEAD"` vs `"RETURN"`（大小写敏感）
- ❌ 在 Mixin 中 `new` 实例：Mixin 是在运行时字节码层面注入，禁止直接实例化
- ❌ 混淆冲突：`refmap` 必须与 mixin 配置一致
- ❌ mixin 类不在 `mixins.json` 中声明：不生效

## 参考资料

- Mixin 文档：https://github.com/SpongePowered/Mixin
- NeoForge Mixin 配置：https://docs.neoforged.net/

## 扩展点

| 配合 Skill | 协作说明 |
|-----------|---------|
| `mc-registry` | Mixin 可访问注册类的 private 成员 |
