---
description: 06 — 网络（逐步）
---

# 06 — 网络（逐步）

优先 **`MessageAdder.registerMessages(RegistryNamespaced<ResourceLocation, Class> registry)`**。
`CustomPayloadHandler` 源码标 **@Deprecated**，新代码不要用。

## 逐步

1. 实现 `MessageAdder`，在 `registerMessages` 里把 Message 类挂到 registry（打开 `org.dimdev.rift.network.Message` 源码再写子类，缺方法则停）。
2. 需要原版 Packet 槽位时才用 `PacketAdder` 的 `registerPlayPackets` 等。
3. 禁止 `ServerPlayNetworking` / SimpleChannel。

命令：`CommandAdder.registerCommands(CommandDispatcher)`。
