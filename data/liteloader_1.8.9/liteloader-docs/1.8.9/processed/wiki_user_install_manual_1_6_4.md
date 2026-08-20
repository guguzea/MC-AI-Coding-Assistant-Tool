# manual install for 1.6.4

> 来源：https://www.liteloader.com/explore/docs/user:install:manual:1.6.4
> 版本：1.8.9
> 页面 ID：user:install:manual:1.6.4
> 抓取源：liteloader-wiki
> 警告：LiteLoader 官方 DokuWiki 是未按 MC 版本切分的现行站（开发停在 1.12.2）。本页挂在该 version 索引下仅供 search_docs 检索，禁止当成该版本专属官方树。API 以本档 verified-api 核实表为准。

*These instructions are for third-party launcher, for instructions for the real launcher [click here](.:1.6.4:vanilla)*.

To install LiteLoader with a third-party launcher, you will need to locate the **version JSON file** which the launcher uses to configure your game environment, consult the launcher documentation to determine the location of this file for the launcher you are using.

Once you have located the **version JSON file**, make the following alterations:

* Locate the **`libraries`** array and add the following entries to the **top** of the array:

```php
{
    "name": "com.mumfrey:liteloader:1.6.4",
    "url": "http://dl.liteloader.com/versions/"
},
{
    "name": "net.minecraft:launchwrapper:1.8"
}
```

* Locate the **`minecraftArguments`** field and add the following text to the end of the field

```php
--tweakClass com.mumfrey.liteloader.launch.LiteLoaderTweaker
```

* Locate the **`mainClass`** field and change it to

```php
net.minecraft.launchwrapper.Launch
```

That's it! The next time you launch the game the launcher should automatically download the required files.
