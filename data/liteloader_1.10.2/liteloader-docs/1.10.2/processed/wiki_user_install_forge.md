# loading with fml

> 来源：https://www.liteloader.com/explore/docs/user:install:forge
> 版本：1.10.2
> 页面 ID：user:install:forge
> 抓取源：liteloader-wiki
> 警告：LiteLoader 官方 DokuWiki 是未按 MC 版本切分的现行站（开发停在 1.12.2）。本页挂在该 version 索引下仅供 search_docs 检索，禁止当成该版本专属官方树。API 以本档 verified-api 核实表为准。

# Installing LiteLoader with Forge or FML
If you already have [Minecraft Forge](http://www.minecraftforge.net/) or FML installed, you have two options for installing LiteLoader:

* **Option 1**
 
Install LiteLoader and [extend from](.:trail:forge) the Forge/FML version.
* **Option 2**
 
Install LiteLoader [as a mod](#mod) (see below).

<html><a name="mod"></a></html>
# Installing LiteLoader as a mod
LiteLoader supports being loaded as a mod by other [Mod Systems](info:modsystem) which recognise the **TweakClass** metadata entry in the jar file. Currently only LiteLoader and FML support this entry, but other Mod Systems may do so in the future.

To load LiteLoader with another ModSystem, take the following steps:

* Download the LiteLoader installer from the [Download Page](https://www.liteloader.com/download)
* Ensure that the *Minecraft Launcher* is **closed**
* Run the LiteLoader installer, you will be see the following screen
 {{:user:install:installer.jpg?500|}}
* Choose the **Extract LiteLoader jar** action
* Click the **...** button and navigate to your [versioned "mods" folder](info:versionedmods) (eg. **`.minecraft/mods/1.7.10`** for Minecraft 1.7.10)
* Click **OK** to extract the LiteLoader jar

LiteLoader will now be loaded by the other ModSystem when the game starts up.
