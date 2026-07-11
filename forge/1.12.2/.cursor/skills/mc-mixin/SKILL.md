---
name: mc-mixin
description: Minecraft Forge Mixin 注入。安全使用 @Mixin、@Inject、@At。触发词：Mixin、@Inject、@At、mixins.json
platform: forge
version: "1.12.2"
dependencies: []
mappings: mcp
---

# Mixin 注入（Forge 1.12.2）

## 快速开始

### 1. 添加依赖（build.gradle）

```groovy
dependencies {
    compile('org.spongepowered:mixin:0.7.11-SNAPSHOT') {
        transitive = false
    }
}
```

### 2. 配置 mixins.json

文件：`src/main/resources/mixins.{modid}.json`

```json
{
  "required": true,
  "minVersion": "0.7.11",
  "package": "com.example.examplemod.mixin",
  "compatibilityLevel": "JAVA_8",
  "mixins": ["MixinExample"],
  "client": ["MixinClientExample"],
  "server": []
}
```

### 3. 在 mcmod.info 中声明

```json
"mixins": ["examplemod.mixins.json"]
```

## Decision: 选择注入目标

```
IF 注入到类方法（最常见）
  → @Inject + CallbackInfo

IF 修改方法返回值
  → @Redirect

IF 调用原方法前/后执行代码
  → @Inject + At.HEAD / At.TAIL
```

## @Inject 用法

```java
@Mixin(Entity.class)
public class MixinEntity {
    @Inject(
        at = @At(value = "HEAD"),
        method = "attack(Lnet/minecraft/entity/Entity;)V"
    )
    private void onAttack(CallbackInfo ci) {
        System.out.println("Entity attacks!");
    }
}
```

## @At 位置选项

| `value` | 含义 |
|----------|------|
| HEAD | 方法第一条指令 |
| RETURN | 方法 return 之前 |
| TAIL | 方法最后一条指令 |
| INVOKE | 特定指令调用 |

## @Shadow（引用目标类字段/方法）

```java
@Mixin(Player.class)
public abstract class MixinPlayer {
    @Shadow
    public abstract int getScore();

    @Shadow
    @Final
    private GameProfile profile;
}
```

## 常见错误

- ❌ Mixin 注入到构造函数
- ❌ 错误的 `@At` 参数
- ❌ mixin 类不在 `mixins.json` 中声明

## 参考资料

- Mixin 文档：https://github.com/SpongePowered/Mixin
