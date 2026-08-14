---
description: 06 — 网络（逐步）
---

# 06 — 网络（逐步）

LiteLoader 偏客户端。禁止 1.20 `CustomPacketPayload` / Fabric PlayNetworking。

## 逐步（插件通道，已打开）

1. 实现 `PluginChannelListener`（不要直接实现 `CommonPluginChannelListener`）。
2. `getChannels()` 返回要注册的通道名列表。
3. `onCustomPayload(String channel, PacketBuffer data)` 收包。
4. 发包用 1.12 原版/Forge 通道 API（混合时读 `forge/1.12.2` 06）；表外禁止编 SimpleChannel。

聊天命令：混合工程用 `OutboundChatListener.onSendChatMessage(CPacketChatMessage, String)`。
