---
name: mc-mixin
description: Fabric Mixin 注入。Loom 一流支持，fabric.mixins.json，@Mixin、@Inject、@At。触发词：Mixin、@Inject、@At、fabric.mixins.json、AccessWidener
platform: fabric
version: "1.17.1"
dependencies: []
mappings: yarn
---
<!-- external-apis: sponge-mixin, mixin-extras, jdk, fabric-loom-gradle-dsl -->


# Mixin 注入（Fabric 1.17.1）

## 快速开始

Fabric 使用 Loom 编译器，Mixin 支持是一等的。只需在 `fabric.mixins.json` 中配置即可。

### 1. 配置 fabric.mixins.json

```json
{
  "required": true,
  "minVersion": "0.8",
  "package": "com.example.examplemod.mixin",
  "compatibilityLevel": "JAVA_16",
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
    public abstract float getHealth();

    @Inject(at = @At("HEAD"), method = "method_5857")  // Yarn 方法名
    private void onTick(CallbackInfo ci) {
        // 在 tick 方法开头执行
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
  → @Inject RETURN + CallbackInfoReturnable；@ModifyReturnValue 仅 MixinExtras

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
        method = "method_5857")  // 使用 Yarn 映射的方法名
    private void onJump(CallbackInfo ci) {
        // 在 jump 方法开头执行
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

## Access Widener（轻量替代 Mixin）

### 1. 创建 .accesswidener 文件

```
# examplemod.accesswidener
accessWidener v2 named
accessible method net/minecraft/entity/LivingEntity getHealth ()F
```

### 2. 在 build.gradle 中配置 Loom

```groovy
loom {
    accessWidenerPath = file("src/main/resources/examplemod.accesswidener")
}
```


### 条目行的名字层必须与工程 mappings 一致：让工具成行

上面按 `named` 头写的那行，成员名用的就是**工程当前映射层**的名字（Yarn 工程 ⇒ Yarn 名）。
换层时整行的名字与描述符都要跟着换，不能只改文件头。
条目的名字与描述符要跟工程层一致，跨层转换走 `convert_mapping`：

```bash
node mcp-server/dist/cli.js convert_mapping --from=yarn --to=intermediary --platform=fabric \
  --version=1.17.1 --ownerClass=net/minecraft/entity/LivingEntity \
  --memberName=getHealth --memberKind=method --accessLines=true
```

该工具产出的行与 `validate_aw` 用的是同一套解析器自检（`selfCheckOk`），
取不到成员名或描述符时行内留 `<TODO…>` 且 `complete:false`，不要手写凑一行。
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
