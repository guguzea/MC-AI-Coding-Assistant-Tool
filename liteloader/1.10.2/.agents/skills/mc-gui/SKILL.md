---
name: mc-gui
description: LiteLoader 1.10.2 GUI / HUD 钩子（HUDRenderListener / Tickable / PluginChannelListener，签名已核）。
platform: liteloader
version: "1.10.2"
docsTool: search_docs
---

# mc-gui（LiteLoader 1.10.2）

核实表：knowledge/common/verified-api.md。
必须 search_docs({platform:"liteloader"}) version=1.10.2。

本档可用（名字以 knowledge/common/verified-api.md 核实表为准）：HUDRenderListener#onPreRenderHUD(int,int) / onPostRenderHUD(int,int)、
Tickable#onTick(...)、PluginChannelListener#onCustomPayload(String, ...)。
⚠️ 本档发布件 vanilla 参数类型为混淆名 ⇒ 类型名不得写出。
仍禁止把 1.12.2 整表抄来；未列进本档核实表的名字不得输出。禁止 ModInitializer。
