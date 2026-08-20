Rift is a very lightweight mod loader designed to provide an easy system to extend any aspect Minecraft while injecting the least amount of code in the game. Currently, it supports adding blocks, items, dispenser behaviors, fluids, entities, tile entities, biomes, features, structures, spawnable creatures, chunk generators, packets, mod channel messages.

Although the Rift API doesn't support modifying existing functionality of the game (except in some cases such as adding creatures and structures to vanilla biomes, and allowing custom biomes to spawn), it supports, and includes, the Mixin library, which you can use to modify any aspect of the game.

An example mod can be found here ([GitHub](https://github.com/DimensionalDevelopment/HalfLogs), [CurseForge](https://minecraft.curseforge.com/projects/half-logs)). You are encouraged to copy it and change what you need, if you want to quickly get started with Rift. Note that the `build.gradle` in HalfLogs may not always be up to date. You should always use the one provided below.

If you need any help with developing Rift mods, feel free to join [the discord server](https://discord.gg/f27hdrM).

## Mod structure

To make a Rift mod, you will need to create a Gradle project, with the following `build.gradle`:

```groovy
buildscript {
    repositories {
        jcenter()
        maven { url 'https://www.dimdev.org/maven/' }
    }
    dependencies {
        classpath 'org.dimdev:ForgeGradle:2.3-SNAPSHOT'
    }
}

apply plugin: 'net.minecraftforge.gradle.tweaker-client'
apply plugin: 'java'

group 'org.dimdev'
version '1.0.0'
archivesBaseName = 'halflogs'

sourceCompatibility = 1.8
targetCompatibility = 1.8

repositories {
    mavenCentral()
    maven { url 'https://www.dimdev.org/maven/' }
}

dependencies {
    implementation 'org.dimdev:rift:1.0.3-45:dev'
}

minecraft {
    version = '1.13'
    mappings = 'snapshot_5'
    runDir = 'run'
    tweakClass = 'org.dimdev.riftloader.launch.RiftLoaderClientTweaker'
}
```

Of course, change `group` and `archivesBaseName` to your own mod's name. You can change the buildscript and add on to it. This is just the minimal build script for building a single obfuscated jar of your mod.

<p name="riftmod.json"></p>
Rift mods are simply jar files that contain a `riftmod.json` at the root level. You will need to add one to your `src/main/resources` directory:

```json
{
  "id": "halflogs",
  "name": "Half logs",
  "authors": [
    "Runemoro"
  ],
  "listeners": [
    "org.dimdev.halflogs.HalfLogs"
  ]
}
```

The purpose of this file is to know which resource domain (in this case `halflogs`) rift should enable for your mod, and to know where the listener classes are.

## Listeners

A listener is a class that implements a listener interfaces. You can find the full list of available interfaces [here](https://github.com/DimensionalDevelopment/Rift/tree/master/src/main/java/org/dimdev/rift/listener).

To get started, simply create a class, and implement the interfaces you need depending on what you want to do in your mod. You will need to implement the interface's methods, which have documentation comments describing when they are called and how they should be used. You can keep the mod in a single class, or split it into as many classes as you want. All listener classes must be registered in the "listeners" section of build.gradle and have a public no-args constructor. Rift will create a single instance of each listener per class.

Here's an example of a listener class that adds blocks and items: https://github.com/DimensionalDevelopment/HalfLogs/blob/master/src/main/java/org/dimdev/halflogs/HalfLogs.java

## Resources

All resources need to be added to the `resources/assets/modid` and `resources/data/modid` folders, where `modid` is the mod id you specified in your `riftmod.json`. The `assets` folder is for storing client-side only resources such as textures, models, and sounds, while the `data` folder is used for storing shared data such as crafting recipes and structures.

More information about how blockstate definitions, models, and recipes work in 1.13 will be added, but until then, you can look at the vanilla resources in the `minecraftBin.jar` (under "External Dependencies"). Helpful information about 1.13 resource packs can also be found by searching on Google.

## Access transformers

Access transformers can be used to transform access levels of inaccessible methods. Rift provides several access transformers, but it is possible to add more by creating an `access_transformations.at` file in your `src/main/resources` folder. You can re-run `setupDevWorkspace` to have those applied in your development environment.

Each line in the `access_transformations.at` file is an entry, with one of the following structures:

 - `<visibility> class <name>`
 - `<visibility> field <owner> <name> <desc>`
 - `<visibility> method <owner> <name> <desc>`

Visibility is one of `public`, `protected`, `default`, `private`, possibly suffixed with a `-f` (ex. `public-f`) to remove a `final` modifier. An access transformer can never decrease the visibility of a class element, and if several access transformers target the same element, the least restrictive visibility is chosen.

Anything to the right of a `#` sign will be ignored. Blank lines and lines containing only comments are also ignored.

At the moment, `owner`, `name`, and `desc` must be notch names, but implementing compile-time reobfuscation of `at` files such that you can use MCP names is a planned feature.

## Using Mixin or registering custom class transformers

Modifying existing game functionality can be done by using the Mixin library. You may also register custom `ClassFileTransformer`s if you prefer. Both of these can be done by creating a listener implementing the `InitializationListener` interface. To avoid possible class loading problems, it is recommended to make this a separate class than your other listener classes.

More information about how to set up and use Mixin will be coming soon. Until then, feel free to join [the discord server](https://discord.gg/f27hdrM) to ask questions.