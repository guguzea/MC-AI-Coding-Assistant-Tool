# cube_all 资源三元组

- **平台**：通用（资源包）
- **Skill**：`mc-block` / `mc-resourcepack`
- **MCP**：`generate_model`、`audit_resources`

路径（`assets/<modid>/`）：

1. `blockstates/<name>.json` → `variants: { "": { "model": "<modid>:block/<name>" } }`
2. `models/block/<name>.json` → `parent: "minecraft:block/cube_all"`, `textures.all`
3. `models/item/<name>.json` → `parent: "<modid>:block/<name>"`

## 坑

- 纹理缺文件会导致紫黑块；用 `audit_resources` 扫引用
- modId 必须全小写
