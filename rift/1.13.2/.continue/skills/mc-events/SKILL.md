---
name: mc-events
description: Rift 1.13.2 InitializationListener / tick。禁止把 Fabric 加载器入口当 Listener。
platform: rift
version: "1.13.2"
docsTool: search_docs
---

# mc-events（Rift 1.13.2）

核实表：knowledge/common/listeners.md。
必须 search_docs({platform:"rift"}) version=1.13.2。

表内：org.dimdev.riftloader.listener.InitializationListener#onInitialization()。
ServerTickable#serverTick；client.ClientTickable#clientTick。
Listener 须 public 无参构造，在 riftmod.json listeners 列出。禁止 DeferredRegister / net.fabricmc。禁止把 Fabric 加载器入口接口当 Rift Listener。
