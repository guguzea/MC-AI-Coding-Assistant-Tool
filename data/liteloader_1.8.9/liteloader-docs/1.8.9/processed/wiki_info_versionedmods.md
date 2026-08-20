# versioned "mods" folder

> 来源：https://www.liteloader.com/explore/docs/info:versionedmods
> 版本：1.8.9
> 页面 ID：info:versionedmods
> 抓取源：liteloader-wiki
> 警告：LiteLoader 官方 DokuWiki 是未按 MC 版本切分的现行站（开发停在 1.12.2）。本页挂在该 version 索引下仅供 search_docs 检索，禁止当成该版本专属官方树。API 以本档 verified-api 核实表为准。

# About the versioned "mods" folder
Since Minecraft 1.6, [ModSystems](modsystem) have supported two mod folders, these are:

* The **'mods'** folder: usually located at **`.minecraft/mods/`**
* The **versioned 'mods'** folder: usually located at **`.minecraft/mods/<version>/`**
 
(where <version> is the version of minecraft in question, eg. `1.7.10`)

ModSystems treat these two folders differently when it comes to loading mods. In general, all files in the **'mods'** folder will be inspected when starting the game, regardless of the version of the game being launched. Files in the **versioned 'mods'** folder will only be inspected for the specific version of the game being launched.

*Forge Mod Loader (FML)* will indiscriminately load `.jar` files in the **'mods'** folder, this can be a problem if a specific mod is not compatible with the current version of the game, the **versioned 'mods'** folder allows this behaviour to be controlled, and allow mods which only support a particular version of Minecraft to be separated out.

### LiteLoader's handling of the versioned folder
A key feature of LiteLoader is that it will not load mods for different versions of Minecraft because it explicitly *requires* that mod authors specify the version of their mod in the metadata, thus allowing it to ignore invalid mods. You may therefore think that the **versioned 'mods' folder** is irrelevant from LiteLoader's point of view. This is not quite true however because LiteLoader provides some special handling of files in the versioned folder:

LiteLoader mod jars use a special extension **`.litemod`** in order to prevent FML from loading them and in general liteloader ignores `.jar` files. However there are other types of mod which LiteLoader can load which do not contain liteloader metadata, namely [Tweaks](tweak). In order to allow the loading of tweak mods (for example [Optifine](http://www.minecraftforum.net/forums/mapping-and-modding/minecraft-mods/1272953-optifine)), LiteLoader must inspect jar metadata. However since Tweak mods are not required to specify supported versions in their metadata, LiteLoader will only load tweaks from the **versioned 'mods' folder**.
