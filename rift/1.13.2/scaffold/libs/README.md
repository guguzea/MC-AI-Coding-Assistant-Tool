# 把 Rift jar 放到此目录

## ⚠️ 用**非 dev** jar（2026-10-05 真机更正）

**要下的是没有 `-dev` 后缀的那只**：

```bash
curl -L -o libs/rift-1.0.4-106.jar \
  "https://jitpack.io/com/github/DimensionalDevelopment/Rift/1.0.4-106/Rift-1.0.4-106.jar"
```

| 件 | 大小 | `mixins.rift.refmap.json` | 结论 |
|---|---|---|---|
| `Rift-1.0.4-106.jar`（**用这只**） | 140 331 B | ✅ 14 225 B | ✅ 客户端能起来 |
| `Rift-1.0.4-106-dev.jar`（**别用**） | 135 503 B | ❌ **不在包内** | ❌ 运行期崩溃 |

dev jar 的 `mixins.rift.core.json` 明明写着 `"refmap": "mixins.rift.refmap.json"`，但那个文件没被打进去 ⇒

```
InvalidMixinException: Shadow field field_199754_a was not located in the target class
net.minecraft.resources.VanillaPack. No refMap loaded.
```

⚠️ `field_199754_a` **本身没错**（1.13.2 映射里存在 = `basePath`，见 `data/forge_1.13.2/mappings/fields.csv`），
是 refmap 缺失，不是版本不兼容。

## 还需要第二只：mcp_snapshot

上游 `mcp_snapshot` **只发了 `-1.13` 后缀**（Forge maven 上 `20180921-1.13` = HTTP 200，`-1.13.2` = 404），
而本档 scaffold 钉 `mappings = 'snapshot_20180921'` ⇒ 必须手动把 zip 放成 Gradle flatDir 认的那个名字：

```bash
cp <repo>/data/forge_1.13.2/mappings/mcp_snapshot-20180921-1.13.zip \
   libs/mcp_snapshot-20180921-1.13.2.zip
```

（或者改用真正的 1.13.2 snapshot，最早 `20190311-1.13.2`。）

## 来源与许可

| 项 | 值（2026-10-05 实测） |
|---|---|
| 坐标 | `com.github.DimensionalDevelopment:Rift:1.0.4-106`（**无 classifier**） |
| 上游 maven | `https://www.dimdev.org/maven/` = **DNS ENOTFOUND**，已死 |
| 替代源 | **JitPack**（MIT，可取可用） |
| sha256（非 dev） | `D6A60EBC77CDFEF821F01647E733A865953C10418CB76249C2EA26EC9C20C474` |
| sha256（dev，仅留档） | `5B5E333D7DD77E89321C72802A68DBCF3F7736139EDD3AA777894A58096D5463` |
| 上游仓 | `DimensionalDevelopment/Rift`（**archived**，最后提交 2019-01-01） |
| JitPack 构建结果 | `1.0.4-106` / `1.0.4-87` / `v1.0.4-52` = ok；`1.0.2-33` / `1.0.4-66` = Error |

⚠️ **JitPack 不提供目录列表**：`…/Rift/1.0.4-106/` 直接访问 = 404，但该版本下的
`.pom` / `.jar` / `-dev.jar` / `-sources.jar` 全是 200 ⇒ **「目录 404」不能当「没有构件」的证据**。

**jar 不入本仓**（保持树内无二进制、避免漂移），按上面两行自取即可。

## ⚠️ `libs/` 里只能有一份 rift jar

Rift 扫 `libs/` 下所有 jar，同一 id 出现两次即 `DuplicateModException: Duplicate mod rift`。
换 jar 时把旧的**移出本目录**（改名留在原地也算重复）。

## 已知边界（别外推）

- jar 内 `profile.json` 写 `"inheritsFrom": "1.13"`、`releaseTime 2018-07-18` ⇒ **官方标称 MC 1.13**。
  **2026-10-05 真机更新**：在 MC **1.13.2** 上客户端**能起来**（LWJGL / OpenAL / 纹理图集 / Narrator 全绿），
  但 **`mixins.rift.hooks.json` 的 21 个 hook mixin 全部 target not found**（notch 名 `cfi`/`cfl`/`bna`/`bjl`
  属于 1.13）⇒ **`ClientTickable` / `MinecraftStartListener` 都不会被回调**。
  ⇒ **1.13.2 属「能启动但功能不完整」**；要真用请把 `minecraft.version` 改成 `'1.13'`。
- jar 自带的 `riftmod.json` schema = `{id, name, authors[], listeners[]}`，与本仓桥模板生成的 `riftmod.json` 同形（已逐字对照）。
- jar 内 `profile.json` 的 `libraries` 逐字列了 **`org.dimdev:mixin:0.7.11-SNAPSHOT`** 与
  **`asm` / `asm-commons` / `asm-tree` 三件 6.2** ⇒ 依赖照它写，别猜版本。