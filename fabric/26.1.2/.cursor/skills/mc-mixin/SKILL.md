---
name: mc-mixin
description: Fabric 26.1.2 Mixin。fabric.mod.json mixins 字段、mixins.json、Loom official AW。触发词：Mixin、@Inject、access widener
platform: fabric
version: "26.1.2"
dependencies: []
mappings: official
---

# Mixin（Fabric 26.1.2）

文档：`26.1.2/develop_loader_fabric-mod-json`（mixins 字段）、`26.1.2/develop_mixins_bytecode`（字节码）、`26.1.2/develop_loom_index`（插件 id `net.fabricmc.fabric-loom`）。本档 Java **25**、AW header **`official`**。不要 Yarn / JAVA_17 模板。

## 快速开始

`fabric.mod.json`：

```json
"mixins": [
  "example-mod.mixins.json",
  { "config": "example-mod.client.mixins.json", "environment": "client" }
]
```

`example-mod.mixins.json`（包名必须对上类）：

```json
{
  "required": true,
  "minVersion": "0.8",
  "package": "com.example.examplemod.mixin",
  "compatibilityLevel": "JAVA_21",
  "mixins": ["PlayerMixin"],
  "client": ["client.ClientMixin"]
}
```

`compatibilityLevel` 按 Mixin 支持的等级写；不要抄邻版 `JAVA_17`。void 方法用 `CallbackInfo`，有返回值才用 `CallbackInfoReturnable`。

```java
@Mixin(Player.class)
public class PlayerMixin {
    @Inject(method = "tick", at = @At("HEAD"))
    private void examplemod$onTick(CallbackInfo ci) {
    }
}
```

目标类用 **Mojmap** `Player`，不要 `PlayerEntity`。

## Access Widener

26.1.2 porting：AW 第一行 namespace 是 `official`，不是 `named`。格式是 `accessible` / `extendable` / `mutable`，不要编造 `accessWidener class` 行。

```
accessWidener v2 official
accessible method net/minecraft/world/entity/player/Player getName ()Lnet/minecraft/network/chat/Component;
```

Loom：`loom { accessWidenerPath = file("src/main/resources/examplemod.accesswidener") }`（以本版 loom 页为准）。


### 条目行的名字层必须与工程 mappings 一致：让工具成行

上面按 `named` 头写的那行，成员名用的就是**工程当前映射层**的名字（26.1+ 已去混淆 ⇒ 该层就是 Mojang 可读名）。
换层时整行的名字与描述符都要跟着换，不能只改文件头。
26.1+ 不再需要 Yarn / intermediary 转换，`convert_mapping` 对 `to=yarn` 直接拒绝（`UNOBFUSCATED_NO_YARN`）。

该工具产出的行与 `validate_aw` 用的是同一套解析器自检（`selfCheckOk`），
取不到成员名或描述符时行内留 `<TODO…>` 且 `complete:false`，不要手写凑一行。
## Decision Flow

```
IF 改原版方法行为
  → @Inject / @At；先看 bytecode 页，找不到注入点就停
IF 只要放宽可见性
  → Access Widener（official），不必上 Mixin
IF 只在客户端
  → fabric.mod.json 里 environment=client 的 mixin json
IF 自定义游戏事件
  → 文档 events 页：Mixin 里触发自己的 Event
```

## 常见错误

- ❌ `tick` 注入写成 `CallbackInfoReturnable`（void 必须 `CallbackInfo`）
- ❌ AW `named`（去混淆后是 `official`）
- ❌ 客户端 mixin 写进通用 `mixins` 数组导致专用服崩
- ❌ 在 Mixin 里 `new` 被注入类的实例当游戏对象

## 扩展点

| 配合 Skill | 协作说明 |
|-----------|---------|
| `mc-registry` | Mixin 读已注册对象 |
| `mc-entity` | 改实体 tick / 目标 |
