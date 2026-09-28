---
name: mc-mixin
description: Minecraft Forge Mixin 注入。安全使用 @Mixin、@Inject、@At、@ModifyVariable。触发词：Mixin、@Inject、@At、mixins.json、AccessTransformer、ASM
platform: forge
version: "1.15.2"
dependencies: []
mappings: mcp
---

# Mixin 注入（Forge 1.15.2）

## 快速开始

Mixin 通过修改已编译的字节码实现运行时注入。Forge 使用 Mixin 框架。

### 1. 构建（不要抄未核插件坐标）

官方 Forge 文档检索**没有**独立 Mixin 教程页。不要写 `org.spongepowered:mixin:0.8+` 这种未核坐标。Mixin 运行时随 Forge 提供；`mixins.json` 见 Sponge Mixin wiki。

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

Access Transformer 开放 `private`/`protected` 成员为 `public`，无需字节码注入。

### 配置 Access Transformer

文件：`src/main/resources/META-INF/accesstransformer.cfg`
```
# 开放 private 方法为 public
public net.minecraft.entity.LivingEntity <TODO:SRG名><TODO:描述符> #getHealth
# 开放 protected 字段为 public
public net.minecraft.entity.LivingEntity <TODO:SRG名> #deathTime
```


### 成员行必须用 SRG 名：让工具成行，不要手写

上游原文（本档语料 `data/forge_1.15.2/forge-docs/1.15.2/processed/advanced_accesstransformers.md`）逐字：
「When using Access Transformers on Minecraft classes, the SRG name must be used for fields and methods.」
⇒ 类名写可读名，**方法名 / 字段名必须换成该档的 SRG 名**。上面示例里的可读成员名照抄进
`accesstransformer.cfg` 不会生效；同一个可读名在多个 owner 下对应不同 SRG 名，凭记忆拼必错。

用 `convert_mapping` 直接产出可粘贴的条目行：

```bash
node mcp-server/dist/cli.js convert_mapping --from=mojang --to=mcp --platform=forge \
  --version=1.15.2 --ownerClass=net.minecraft.entity.Entity \
  --memberName=getHealth --memberKind=method --accessLines=true
```

返回的 `accessLines.entries[].line` 就是可粘贴行；取不到 SRG 名时行内留 `<TODO…>` 且
`complete:false` —— **禁止**拿可读名顶替 SRG 名。
成员库覆盖只有 Forge **1.16.5 / 1.17.1 / 1.18.2 / 1.19.4 / 1.20.1 / 1.20.4** 六档（`mappingEra=mcp-config-srg`）；本档**不在**其中 ⇒ 该档成员行只会得到 `<TODO…>`，须自备映射逐名核过再落笔。
写完可用 `validate_at` 复核（它读的是字节码，不是文件名）。
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
| `mc-registry` | Access Transformer 开放注册类的 private 成员供 Mixin 访问 |
