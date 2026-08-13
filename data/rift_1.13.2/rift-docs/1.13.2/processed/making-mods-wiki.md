# Making mods with Rift（wiki 落盘）

- **抓取日**：2026-08-13
- **URL**：https://github.com/DimensionalDevelopment/Rift/wiki/Making-mods-with-Rift
- **编辑**：Runemoro，2018-08-26
- **仓库**：已归档只读

## 已核实事实

- Gradle 插件：`apply plugin: 'net.minecraftforge.gradle.tweaker-client'`
- Java 8；`tweakClass = 'org.dimdev.riftloader.launch.RiftLoaderClientTweaker'`
- 依赖示例（wiki 原文）：`implementation 'org.dimdev:rift:1.0.3-45:dev'`
- Maven：`https://www.dimdev.org/maven/`（实施时可能已失效；scaffold 须提供 `libs/` 备用，禁止写死失效仓库当唯一源）
- 元数据文件官方拼写：**`riftmod.json`**（jar 根 / `src/main/resources`）
- `riftmod.json` 字段：`id`, `name`, `authors`, `listeners`（类名字符串数组）
- Listener 类须有 **public 无参构造**；Rift 每类只建一个实例
- Mixin / 自定义 ClassFileTransformer：实现 `org.dimdev.riftloader.listener.InitializationListener`（`onInitialization()`），建议单独一类
- Access transformer 文件：`src/main/resources/access_transformations.at`（notch 名）
- 资源：`resources/assets/<modid>` 与 `resources/data/<modid>`
- 示例模组：HalfLogs

## riftmod.json 示例（wiki）

```json
{
  "id": "halflogs",
  "name": "Half logs",
  "authors": ["Runemoro"],
  "listeners": ["org.dimdev.halflogs.HalfLogs"]
}
```

Rift-MDK 另支持 listener 对象形式：`{"class":"...","side":"client","priority":10}`。
