---
description: 05 — LiteMod 生命周期（混合也不能省）
---

# 05 — LiteMod 生命周期（混合也不能省）

已核实：

| 接口 | 方法 |
|------|------|
| LiteMod | getVersion(); init(File); upgradeSettings(...) |
| Listener | getName() |
| Tickable | onTick(Minecraft, float, boolean, boolean) |
| ChatFilter / ChatListener | onChat(...) |
| OutboundChatListener | onSendChatMessage(CPacketChatMessage, String) |

HUD/Render 等客户端接口目录还有其它类型；**方法未打开源码则禁止臆造**。
