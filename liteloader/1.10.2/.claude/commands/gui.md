---
name: mc-gui
description: LiteLoader 1.10.2 仅 HUDRenderListener 已核实。
platform: liteloader
version: "1.10.2"
docsTool: search_docs
---

# mc-gui（LiteLoader 1.10.2）

核实表：knowledge/common/verified-api.md。
必须 search_docs({platform:"liteloader"}) version=1.10.2。

表内仅 HUDRenderListener#onPreRenderHUD(int,int) / onPostRenderHUD(int,int)。
Tickable / PluginChannelListener **不在本档核实表内，禁止输出**。禁止把 1.12.2 整表抄来。禁止 ModInitializer。
