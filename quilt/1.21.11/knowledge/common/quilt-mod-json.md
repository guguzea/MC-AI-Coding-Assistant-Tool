# quilt.mod.json（摘要）

`schema_version` + `quilt_loader`：`id`, `version`, `group`, `entrypoints`, `depends`, `metadata`。

可与 `fabric.mod.json` 共存；**检测时 Quilt 优先**。

不要把 Fabric `schemaVersion` 顶层字段当成 Quilt 官方结构。
