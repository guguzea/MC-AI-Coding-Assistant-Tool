---
name: mc-mixin
description: NeoForge 1.21.1 Mixin。[[mixins]] 来自官方 modfiles 页。触发词：Mixin、@Inject、mixins.json、neoforge.mods.toml
platform: neoforge
version: "1.21.1"
dependencies: []
mappings: mojmap
---

# mc-mixin（NeoForge 1.21.1）

文档：`gettingstarted/modfiles`「Mixin Configuration Properties」。Java 21。mojmap。禁止从扁平 `neoforge/.agents/skills` 或 Forge 邻档复制 `org.spongepowered.mixin` `0.7.+`。

## neoforge.mods.toml

官方表：`[[mixins]]` 数组；指定时 `config` 必填，值为 mixin 配置文件路径。

```toml
[[mixins]]
config = "examplemod.mixins.json"
```

`mixins.json` 字段（`package` / `mixins` / `client` / `compatibilityLevel`）见 [Sponge Mixin wiki](https://github.com/SpongePowered/Mixin/wiki/Introduction-to-Mixins---The-Mixin-Environment#mixin-configuration-files)（官方文档外链，不是 NeoForge 专页全文）。

先 mixin_analyze；deep 需缓存 jar。网络不要用 SimpleChannel。payload：`RegisterPayloadHandlersEvent`。核不到方法名则 `search_neoforge_docs version=1.21.1`，禁止输出。
