---
description: 05 — 生命周期
---

# 05 — 生命周期

| 接口 | 方法 |
|------|------|
| InitializationListener | `onInitialization()`（Mixin / 自定义 transformer） |
| BootstrapListener | `afterVanillaBootstrap()` |
| MinecraftStartListener | `onMinecraftStart()` |
| ServerTickable | `serverTick(MinecraftServer)` |
| client.ClientTickable | `clientTick()` |

不要用 Fabric `ClientTickEvents`。
