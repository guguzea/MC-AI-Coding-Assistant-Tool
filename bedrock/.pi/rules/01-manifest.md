---
description: 01 — manifest.json
---

# 01 — manifest.json

- `format_version`、`header`（name/description/uuid/version/min_engine_version）、`modules`
- module.type：`resources` | `data` | `script` | `world_template`
- **禁止** `"experimentalGameplay": true`
- `capabilities` 仅 chemistry / script_eval / raytraced / pbr（现行 Learn）。这 **不是** 世界 Beta APIs 开关
- 校验：`validate_addon_manifest`（不是 `validate_project`）
