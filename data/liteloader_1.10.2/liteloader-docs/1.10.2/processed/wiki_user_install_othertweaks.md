# tweak mod installation

> 来源：https://www.liteloader.com/explore/docs/user:install:othertweaks
> 版本：1.10.2
> 页面 ID：user:install:othertweaks
> 抓取源：liteloader-wiki
> 警告：LiteLoader 官方 DokuWiki 是未按 MC 版本切分的现行站（开发停在 1.12.2）。本页挂在该 version 索引下仅供 search_docs 检索，禁止当成该版本专属官方树。API 以本档 verified-api 核实表为准。

# Installing other Tweak Mods with LiteLoader
Current [ModSystems](info:ModSystem) are [Tweaks](info:Tweak) themselves, but can also load *other* Tweak-based mods as part of their startup process. What this means is that once you have one [info:ModSystem](info:ModSystem) installed, installing other tweaks becomes incredibly simple.

To install any other Tweak-based mod, simply drop the Tweak jar into your [versioned mods folder](info:versionedmods), this is simply a subfolder inside the regular "mods" folder named for the version of minecraft, eg. for Minecraft **1.8** this would be `.minecraft/mods/**1.8**/`

### Installing Optifine
**Optifine** doesn't require any additional steps, simply download it and drop the jar into the [versioned mods folder](info:versionedmods).

### Installing ShadersModCore
**ShaderModCore** is a little more complex, but not much. How you install it depends on whether you are also using *Minecraft Forge* or not. Click one of the options below for details:

* [Installing ShadersModCore with LiteLoader](.:othertweaks:shaders)
* [Installing ShadersModCore with LiteLoader and Forge](.:othertweaks:shadersforge)
