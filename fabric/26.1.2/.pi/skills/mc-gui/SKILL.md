---
name: mc-gui
description: Fabric 26.1.2 mc-gui。核不到则 search_fabric_docs version=26.1.2，禁止输出。
platform: fabric
version: "26.1.2"
dependencies: []
mappings: official
---

# GUI（Fabric 26.1.2）

文档：`26.1.2/develop_rendering_gui_custom-screens`。

- extends `Screen`，override `init`
- 打开：`Minecraft.getInstance().setScreen(...)`
- 关闭：`setScreen(null)`
- **禁止**把 26.2 博客的 `gui.setScreen` 当本版 API
