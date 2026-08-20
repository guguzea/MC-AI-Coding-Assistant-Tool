# Metadata and litemod.json

> 来源：https://www.liteloader.com/explore/docs/dev:litemod.json
> 版本：1.12.2
> 页面 ID：dev:litemod.json
> 抓取源：liteloader-wiki
> 警告：LiteLoader 官方 DokuWiki 是未按 MC 版本切分的现行站（开发停在 1.12.2）。本页挂在该 version 索引下仅供 search_docs 检索，禁止当成该版本专属官方树。API 以本档 verified-api 核实表为准。

# Metadata and litemod.json
From 1.6 onwards, LiteLoader now supports much more comprehensive metadata to be packaged with the mod, some of which are required and other metadata are optional. The metadata are packaged in a file called `litemod.json` in the root of the litemod file, and this file replaces the legacy [version.txt](version.txt) used for versioning in previous releases.

### Required values
* **mcversion**
 
this is the target loader version for this mod. If this version number does not match a supported version number value in the current loader then the mod will not be loaded.
* **name**
 
this is the internal mod name that uniquely identifies this mod and must remain the same between mod versions in order to ensure that the revision value remains meaningful.

* **revision**
 
revision is the internal progression number of your mod (see version vs. revision for more info) and must be a valid float or int value

### Optional values
These values are not required but are used to provide additional information to the loader about your mod:

* **tweakClass**
 
used to specify a [info:tweak](info:tweak) class within your mod's container. This allows your mod to take full advantage of [Tweaker](info:tweak) functionality by hooking into the tweak system directly.

* **classTransformerClasses**
 
An array or comma-separated list of [ClassTransformer](ClassTransformer) class names which will be injected into the ClassLoader.

* **dependsOn**
 
An array or comma-spearated list of mod **names** (as per the metadata "name" entry above) which must also be present to allow your mod to load. If a dependency is missing then the mod will not be loaded but it will be shown in the mods list and will indicate the missing dependencies which caused it to fail to load.

* **requiredAPIs**
 
An array or comma-separated list of [API](API) ids. Used to declare that your mod requires one or more additional APIs in order to run. If a required API is missing then the mod will not be loaded but it will be shown in the mods list and will indicate the missing API which caused it to fail to load.

* **injectAt**
 
Alters the position in the classpath at which the mod will be injected. **Not currently working as at Minecraft 1.7.**

### Extra values
Additionally, there are some extra metadata which are standardised for the purposes of providing information to the in-game mod list provided by third party add-ons such as VoxelMenu and the Minecraft Forge "mods" list. These additional keys are:

* **author**
 
your name!
* **version**
 
the version string for your mod

* **description**
 
a plain-text description to be displayed with your mod

* **url**
 
the url for the home page or other relevant page for your mod

* **tweakClass**
 
the fully qualified class name of an ITweaker class to load

* **classTransformerClasses**
 
the fully qualified class name of any [IClassTransformer](IClassTransformer) classes to inject into the LaunchClassLoader, can be a comma-separated list or an array of strings

In addition to these required and standard values, you can also include and other string key/value pairs that you wish, these can then be retrieved by calling the getModMetadata() function on the LiteLoader instance.
