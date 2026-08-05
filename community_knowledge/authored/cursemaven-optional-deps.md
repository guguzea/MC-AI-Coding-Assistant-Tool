---
id: authored/cursemaven-optional-deps
title: CurseMaven 与 compileOnly 可选依赖
tags: [cursemaven, gradle, jei, interop, optional, maven]
summary: 三种引入他模方式；CurseMaven 坐标；compileOnly vs runtimeOnly vs implementation；fg.deobf；含 Mixin 的依赖注意。
sourceKind: authored
---

# CurseMaven 与 compileOnly 可选依赖

自写短文。运行时软依赖探测见 `authored/soft-deps-modlist`；发布 Maven 见 `authored/publishing`。

## 三种引入「别人的模组」

| 方式 | 适用 |
|------|------|
| 作者自建 Maven | 对方提供了 raw/Maven URL |
| 本地 `libs/` + `flatDir` / files | 临时、无公开 Maven |
| **CurseMaven** | 对方发在 CurseForge，用 projectId/fileId |

## CurseMaven（要点）

1. 仓库：`https://cursemaven.com`（Gradle 6+ 建议 `exclusiveContent` + `includeGroup "curse.maven"`，避免污染其它解析）。  
2. 依赖坐标形态：`curse.maven:<descriptor>-<projectId>:<fileId>`  
   - projectId / fileId 在 CurseForge 项目页与**具体文件**页查看。  
3. ForgeGradle 开发依赖常用：

```gradle
dependencies {
    implementation fg.deobf('curse.maven:example-mod-123456:7890123')
}
```

`fg.deobf`：把玩家向混淆包转成开发可读映射，便于编译。

## compileOnly / runtimeOnly / implementation

| 配置 | 编译可见 | 运行进 classpath | 典型用途 |
|------|----------|------------------|----------|
| `implementation` | 是 | 是 | 硬依赖或开发必装 |
| `compileOnly` | 是 | **否** | 只调 API、发布时不强制打进包 |
| `runtimeOnly` | 否 | 是 | 运行要完整模组、编译不引用其类型 |

可选 JEI 一类常见组合：

- `compileOnly`（或 `compileOnly fg.deobf`）JEI API  
- 开发时再用 `runtimeOnly` 完整 JEI 方便自测  

发布给玩家时：JEI 标为**可选**；代码用 `ModList.isLoaded` + 隔离类。

## 含 Mixin 的依赖

仅靠 CurseMaven 拉「带 Mixin 的模组」时，你的工程可能还要：

- Sponge/Mixin 相关 Maven 与 Gradle 插件  
- 正确的 mixin config / refmap  

否则运行期注入失败或 `MixinTransformerError`。对方若提供专用 dev jar / Maven，优先用官方说明。

## mods.toml 对齐

Gradle 里写了硬依赖，toml 也要 `mandatory=true` 与版本范围一致；可选依赖则 `mandatory=false`。  
两边不一致会导致「IDE 能跑、玩家缺前置」或相反。

## 自检

- 去掉 optional 模组仍能启动。  
- 干净环境按 README 只装硬依赖可玩。  
- CurseMaven fileId 是否指向**正确 MC 版本**的文件。

## 不清楚时

- 运行时探测：`authored/soft-deps-modlist`  
- CurseMaven 站点说明 / 对方模组文件页（projectId、fileId）  
- Mixin：对方 README + `search_forge_docs`
