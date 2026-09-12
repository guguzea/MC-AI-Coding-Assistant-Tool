# mods.toml 解析回归夹具（S1 · F90/F98）

这些 `mods.toml` 从公开模组 jar 的 `META-INF/mods.toml` 原样取出，只用作 TOML 解析器的回归夹具（元数据文本，非代码、非文档正文）。
来源与 sha512 逐条登记如下；jar 取自 `mcp-server/data/lib-manifests/all.json` 的条目，下载落 `D:/mc-skill-temp/jars/`，取证见 `temp/PLAN-2026-09-08-销账-S1-jar取证.md`。

| 夹具 | 夹具 sha256(12) | 来源 jar | slug | MC | loader | 期望 modId | versionType | 字节 | jar sha512 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `jei-1.18.2-9.7.1.255.toml` | 4b6f58fbdccc | jei-1.18.2-9.7.1.255.jar | jei | 1.18.2 | forge | `jei` | release | 2611 | 18836ca5fe64fa015fb699e3b7e663abcfeea0ca5c0a1eaad436515fc1bff76e36e53e90a1f305e4871c256676afe7c6193049c8b8d9ecc1ecc7e7fd4ae54d9d |
| `jei-1.20.1-forge-15.49.0.188.supp.toml` | 1ffb7fe8cff5 | jei-1.20.1-forge-15.49.0.188.jar | jei | 1.20.1 | forge | `jei` | beta | 2662 | 7e7b26379f43a76c091697be92ba4ebd059be4c5fc8a60f1e93a2092002097ce47ad5245ef35fb37b123bb61a0e6d3a96ba4aac9ef3b013fc7a6954577d9a2e5 |
| `Placebo-1.20.1-8.6.3.toml` | 8e522edad20d | Placebo-1.20.1-8.6.3.jar | placebo | 1.20.1 | forge | `placebo` | release | 417 | c23990465e26336f476c3b05a897bcf0c8660ae7338756b325f6bf81d0dee34b609474c62293f394acac818637ab03f92c776d104c8b8e86f3786395f5c4d623 |
| `caelus-forge-3.2.0+1.20.1.toml` | b7c6edc03215 | caelus-forge-3.2.0+1.20.1.jar | caelus | 1.20.1 | forge | `caelus` | release | 691 | 906baad404c33288d8daf8937bc6a85d3bcc03db67a4a68395b8f01eea57f773420ff97919aadb08a7618b62b0c6c3db72270f9c3af836b822385464f509cf78 |
| `sophisticatedcore-1.20.1-1.3.79.2250.toml` | 440cba3f7595 | sophisticatedcore-1.20.1-1.3.79.2250.jar | sophisticated-core | 1.20.1 | forge | `sophisticatedcore` | release | 2250 | 87c08942d260ac697beb241609b95362035fbbc5d18baf4721fe21555f62a84dee3176da5c2098b0a9a57a04b1b8d0fbcfc07dde273893f67b5b6ac9448bb147 |

原始 URL（Modrinth CDN）：

- `jei-1.18.2-9.7.1.255.toml` → https://cdn.modrinth.com/data/u6dRKJwZ/versions/qgZFDrtm/jei-1.18.2-9.7.1.255.jar
- `jei-1.20.1-forge-15.49.0.188.supp.toml` → https://cdn.modrinth.com/data/u6dRKJwZ/versions/hVXQAD0D/jei-1.20.1-forge-15.49.0.188.jar
- `Placebo-1.20.1-8.6.3.toml` → https://cdn.modrinth.com/data/tCkE8p2N/versions/6SkuAGoz/Placebo-1.20.1-8.6.3.jar
- `caelus-forge-3.2.0+1.20.1.toml` → https://cdn.modrinth.com/data/40FYwb4z/versions/mRry0DgY/caelus-forge-3.2.0%2B1.20.1.jar
- `sophisticatedcore-1.20.1-1.3.79.2250.toml` → https://cdn.modrinth.com/data/nmoqTijg/versions/kmtAlbq7/sophisticatedcore-1.20.1-1.3.79.2250.jar

## 形态覆盖

- `'''` 跨行未同行闭合：jei ×2 / caelus / sophisticatedcore（各 1 行正文，2 处三引号）
- `'''…'''` 同行闭合：Placebo
- `"""` 跨行：真实样本 0 例 → 由 `mcp-server/test-decompile.mjs` 的合成用例覆盖
- 正文多行 + 空行 + 行内 `=` + 双引号 + 单引号 + 依赖段写在多行块之后：`synth-multiline-body.toml`（对抗样本，非第三方文件）

## 注意

- 6 个 Fabric jar 结构上没有 `mods.toml`，不计入 TOML 夹具面。
- `kotlinforforge-4.12.0-all.jar` 内无任何 `.toml`（fat jar 只带 MANIFEST.MF 与 jarjar 元数据），它的 `modId:null` 是 jar 事实，不是解析缺陷。
- 夹具文本一律逐字保留，不做规范化；改动本目录必须同步改 `test-decompile.mjs` 的期望表。
