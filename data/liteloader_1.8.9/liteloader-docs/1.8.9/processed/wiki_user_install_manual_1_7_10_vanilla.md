# manual install for 1.7.10

> 来源：https://www.liteloader.com/explore/docs/user:install:manual:1.7.10:vanilla
> 版本：1.8.9
> 页面 ID：user:install:manual:1.7.10:vanilla
> 抓取源：liteloader-wiki
> 警告：LiteLoader 官方 DokuWiki 是未按 MC 版本切分的现行站（开发停在 1.12.2）。本页挂在该 version 索引下仅供 search_docs 检索，禁止当成该版本专属官方树。API 以本档 verified-api 核实表为准。

The most important thing to understand when installing manually is that the version you create must have a consistent **id**. You must use the same **id** for every part of the installation process. In the example below we will use the id `**1.7.10-LiteLoader1.7.10**`, if you choose a different **id** then you *must* alter this *everywhere* that the ID appears in order for the version to work.

#### installation steps
* First navigate to the `versions` folder inside your `.minecraft` folder
* Create a folder in `versions` with the **id** of your new version, eg. `**1.7.10-LiteLoader1.7.10**`
* Inside the new folder create an empty text file with the **id** of your new version and the extension `**.json**`, eg `**1.7.10-LiteLoader1.7.10.json**`
* Open the new file with a text editor and paste in the following JSON code:

```php
{
    "id": "1.7.10-LiteLoader1.7.10",
    "time": "2014-05-14T18:29:23+01:00",
    "releaseTime": "2014-05-14T18:29:23+01:00",
    "type": "release",
    "minecraftArguments": "--username ${auth_player_name} --version ${version_name} --gameDir ${game_directory} --assetsDir ${assets_root} --assetIndex ${assets_index_name} --uuid ${auth_uuid} --accessToken ${auth_access_token} --userProperties ${user_properties} --userType ${user_type} --tweakClass com.mumfrey.liteloader.launch.LiteLoaderTweaker",
    "libraries": [
        {
            "name": "com.mumfrey:liteloader:1.7.10",
            "url": "http://dl.liteloader.com/versions/"
        },
        {
            "name": "net.minecraft:launchwrapper:1.11"
        },
        {
            "name": "org.ow2.asm:asm-all:5.0.3"
        },
        {
            "name": "com.google.guava:guava:16.0"
        }
    ],
    "mainClass": "net.minecraft.launchwrapper.Launch",
    "minimumLauncherVersion": 16,
    "inheritsFrom": "1.7.10",
    "jar": "1.7.10"
}
```

* If you are using a different **id**, then you *must* change the value of `id` at the top of the file to match
* If you wish to inherit from a different *version*, for example a version of *Minecraft Forge*, then change the `inheritsFrom` value to indicate the version to inherit from
 * If you inherit from a different version, **you must copy the `minecraftArguments` value from the other version and append:** `--tweakClass com.mumfrey.liteloader.launch.LiteLoaderTweaker`
* Save the file and run the launcher
* Create a new **Profile** and select the **version** you just created.
* Launch the game and liteloader will be downloaded and installed automatically.
