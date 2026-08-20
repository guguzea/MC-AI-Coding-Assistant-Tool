# Easy Method

Go to https://minecraft.curseforge.com/projects/rift and follow the instructions for **Installing in MultiMC**.

# Alternate Method

1. Make a new instance in MultiMC with with the wanted version of Minecraft—in our case, Minecraft 1.13.
1. Click `Edit Instance`—it should open the `Version` page of the instance.
1. Click `Add Empty`.
1. Set uid to `org.dimdev.rift` and name to `Rift`.
1. Select the newly created component and click `Edit`—this should open the file in a text editor.
1. Edit the JSON to look like one of the [examples](#examples) below, then save the file.
1. Launch the instance from MultiMC.

If the example doesn't fit the Rift version exactly, change the version. For example, replace all occurrences of `1.0.2-33` with `1.0.2-35`.

You can use the version page to check the file for errors—obvious mistakes will show up in the `Version` page as soon as you click the `Refresh` button.

If the JSON file doesn't open in a text editor, make sure your operating system is set up to open `.json` files in one first.

## Examples

### Rift 1.0.4-66 (Minecraft 1.13)

```json
{
    "+tweakers": [
        "org.dimdev.riftloader.launch.RiftLoaderClientTweaker"
    ],
    "formatVersion": 1,
    "+libraries": [
        {
            "name": "org.dimdev:rift:1.0.4-66",
            "url": "https://www.dimdev.org/maven/"
        },
        {
            "name": "org.dimdev:mixin:0.7.11-SNAPSHOT",
            "url": "https://www.dimdev.org/maven/"
        },
        {
            "name": "org.ow2.asm:asm:6.2",
            "url": "http://repo1.maven.org/maven2/"
        },
        {
            "name": "org.ow2.asm:asm-commons:6.2",
            "url": "http://repo1.maven.org/maven2/"
        },
        {
            "name": "org.ow2.asm:asm-tree:6.2",
            "url": "http://repo1.maven.org/maven2/"
        },
        {
            "name": "net.minecraft:launchwrapper:1.12"
        }
    ],
    "mainClass": "net.minecraft.launchwrapper.Launch",
    "name": "Rift",
    "releaseTime": "2018-07-18T15:11:46+00:00",
    "requires": [
        {
            "equals": "1.13",
            "uid": "net.minecraft"
        }
    ],
    "uid": "org.dimdev.rift",
    "version": "1.0.4-66"
}
```

### Rift 1.0.3-45 (Minecraft 1.13)

```json
{
    "+tweakers": [
        "org.dimdev.riftloader.launch.RiftLoaderClientTweaker"
    ],
    "formatVersion": 1,
    "+libraries": [
        {
            "name": "org.dimdev:rift:1.0.3-45",
            "url": "https://www.dimdev.org/maven/"
        },
        {
            "name": "org.dimdev:mixin:0.7.11-SNAPSHOT",
            "url": "https://www.dimdev.org/maven/"
        },
        {
            "name": "org.ow2.asm:asm:6.2",
            "url": "http://repo1.maven.org/maven2/"
        },
        {
            "name": "org.ow2.asm:asm-commons:6.2",
            "url": "http://repo1.maven.org/maven2/"
        },
        {
            "name": "org.ow2.asm:asm-tree:6.2",
            "url": "http://repo1.maven.org/maven2/"
        },
        {
            "name": "net.minecraft:launchwrapper:1.12"
        }
    ],
    "mainClass": "net.minecraft.launchwrapper.Launch",
    "name": "Rift",
    "releaseTime": "2018-07-18T15:11:46+00:00",
    "requires": [
        {
            "equals": "1.13",
            "uid": "net.minecraft"
        }
    ],
    "uid": "org.dimdev.rift",
    "version": "1.0.3-45"
}
```

### Rift 1.0.2-33 (Minecraft 1.13)

```json
{
    "+tweakers": [
        "org.dimdev.riftloader.launch.RiftLoaderTweaker"
    ],
    "formatVersion": 1,
    "+libraries": [
        {
            "name": "org.dimdev:rift:1.0.2-33",
            "url": "https://www.dimdev.org/maven/"
        },
        {
            "name": "org.dimdev:mixin:0.7.11-SNAPSHOT",
            "url": "https://www.dimdev.org/maven/"
        },
        {
            "name": "org.ow2.asm:asm:6.2",
            "url": "http://repo1.maven.org/maven2/"
        },
        {
            "name": "org.ow2.asm:asm-commons:6.2",
            "url": "http://repo1.maven.org/maven2/"
        },
        {
            "name": "org.ow2.asm:asm-tree:6.2",
            "url": "http://repo1.maven.org/maven2/"
        },
        {
            "name": "net.minecraft:launchwrapper:1.12"
        }
    ],
    "mainClass": "net.minecraft.launchwrapper.Launch",
    "name": "Rift",
    "releaseTime": "2018-07-18T15:11:46+00:00",
    "requires": [
        {
            "equals": "1.13",
            "uid": "net.minecraft"
        }
    ],
    "uid": "org.dimdev.rift",
    "version": "1.0.2-33"
}
```

### Rift 1.0.1 (Minecraft 1.13)

```json
{
    "+tweakers": [
        "org.dimdev.riftloader.launch.RiftLoaderTweaker"
    ],
    "formatVersion": 1,
    "+libraries": [
        {
            "name": "org.dimdev.rift:Rift:1.0.1",
            "url": "https://www.dimdev.org/maven/"
        },
        {
            "name": "org.dimdev:mixin:0.7.11-SNAPSHOT",
            "url": "https://www.dimdev.org/maven/"
        },
        {
            "name": "org.ow2.asm:asm:6.2",
            "url": "http://repo1.maven.org/maven2/"
        },
        {
            "name": "org.ow2.asm:asm-commons:6.2",
            "url": "http://repo1.maven.org/maven2/"
        },
        {
            "name": "org.ow2.asm:asm-tree:6.2",
            "url": "http://repo1.maven.org/maven2/"
        },
        {
            "name": "net.minecraft:launchwrapper:1.12"
        }
    ],
    "mainClass": "net.minecraft.launchwrapper.Launch",
    "name": "Rift",
    "releaseTime": "2018-07-18T15:11:46+00:00",
    "requires": [
        {
            "equals": "1.13",
            "uid": "net.minecraft"
        }
    ],
    "uid": "org.dimdev.rift",
    "version": "1.0.1"
}
```

## Acknowledgements

This page is based on the MultiMC5 wiki page [MultiMC and Optifine](https://github.com/MultiMC/MultiMC5/wiki/MultiMC-and-OptiFine).