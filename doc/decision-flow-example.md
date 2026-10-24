# 决策树用法与示例（`01-registry.mdc`）

> 本文件是根 [`AGENTS.md`](../AGENTS.md)「第四步：决策树使用方式」的**示例落点**。
> 根纲保留「遇到模糊需求先看 Decision Flow」这条规则；这里放 `01-registry.mdc` 的决策树原文示例。

每个规则文件中的 **Decision Flow** 章节告诉你在不同场景下如何选择正确的方案。

遇到模糊需求时，先看 Decision Flow，再结合上下文判断。

示例（`01-registry.mdc` 中的决策树）：

```
Decision: 选择注册方式
→ IF 平台 = Forge → 使用该档 01-registry（DeferredRegister 或 RegistryEvent，禁止套用邻版）
→ ELSE IF 平台 = Fabric → 使用 Registry.register() in onInitialize
→ ELSE IF 平台 = Quilt → 优先 QSL / org.quiltmc（见 quilt/<ver>/.cursor/rules/01-registry.mdc），不要生成 FAPI Registry 当 QSL
→ ELSE → 询问用户
```
