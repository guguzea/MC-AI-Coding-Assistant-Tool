---
name: mc-events
description: Rift 1.13.2 InitializationListener / tick。禁止 Fabric ModInitializer。
platform: rift
version: "1.13.2"
docsTool: search_docs
---

# mc-events（Rift 1.13.2）

核实表：knowledge/common/listeners.md。
必须 search_docs({platform:"rift"}) version=1.13.2。

表内：org.dimdev.riftloader.listener.InitializationListener#onInitialization()（注意是 onInitialization，不是 ModInitializer）。
ServerTickable#serverTick；client.ClientTickable#clientTick。
Listener 须 public 无参构造，在 riftmod.json listeners 列出。禁止 ModInitializer / DeferredRegister / net.fabricmc。
