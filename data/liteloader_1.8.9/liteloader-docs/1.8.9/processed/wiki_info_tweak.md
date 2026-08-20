# about tweaks

> 来源：https://www.liteloader.com/explore/docs/info:tweak
> 版本：1.8.9
> 页面 ID：info:tweak
> 抓取源：liteloader-wiki
> 警告：LiteLoader 官方 DokuWiki 是未按 MC 版本切分的现行站（开发停在 1.12.2）。本页挂在该 version 索引下仅供 search_docs 检索，禁止当成该版本专属官方树。API 以本档 verified-api 核实表为准。

# What are 'Tweaks'?
A **Tweak** is a special type of [mod](mod) which is able to make changes to the game environment before and during the game load. This type of mod is typically used to make very low-level changes to the game code either because implementing the mod via a [ModSystem](ModSystem) would be cumbersome/impossible, because using a [ModSystem](ModSystem) is not desired, or because the mod is a [ModSystem](ModSystem) itself.

A **Tweak** can do several things that a regular mod cannot do:

* Alter or add to the **command-line arguments** which launched the game
* Specify an alternative **main class** for the game
* Make changes to the **game environment** before the game is launched (such as injecting extra `.jar` files into the game or altering system properties)
* Inject into the [ClassLoader](ClassLoader) and provide [Class Transformers](transformers).

It is the last capability which makes **Tweakers** so powerful, since hooking into the game's [ClassLoader](ClassLoader) allows almost unlimited control over the game's internal code.

# Differences to "Core Mods"
**Forge ModLoader (FML)** has a capability for a mod to elect to become a *"core mod"* which sounds very similar to the features just described for Tweakers above, and this is no coincidence. This is because **FML** is a **Tweak** itself and chooses to delegate its power to "core mods" which require it, any **Tweak** can do this and LiteLoader does so as well, although it doesn't make a distinction between "core mods" and "regular mods" and simply lets any mod supply [Class Transformers](transformers) if it wants to.

In a nutshell, a "core mod" accepts delegated power from a **Tweaker** without becoming a **Tweak** itself, this makes it dependent on the first **Tweaker** and not on the Tweak System directly.

# How do they work?
Whilst it is incredibly powerful, the Tweak System itself is actually incredibly simple. It leverages a library called [LaunchWrapper](https://github.com/Mojang/LegacyLauncher) originally written by [people:cpw](people:cpw) for Mojang in order to allow them to run old versions of Minecraft inside the new launcher. To use **Tweak**s, **LaunchWrapper** is simply added to the game environment and the game's **main class** is replaced with **LaunchWrapper's main class**. Tweak classes can then simply be specified on the command line using `--tweakClass` arguments.

# Multiple Tweaks and CascadedTweakers
Since the original aim of *LaunchWrapper* was to allow old versions of the game to be run in the new launcher, there was no provision made to allow more than one **Tweak** to be specified at a time. In version 1.7 of *LaunchWrapper*, [people:cpw](people:cpw) added the ability to specify multiple tweaks, but prior to that a contract of '*cascading*' tweakers was agreed between [people:cpw](people:cpw) and [myself](people:mumfrey) to allow whichever tweaker was loaded first to load the other.

This is why in newer versions of Minecraft you can simply specify multiple `--tweakClass` arguments but before that it was necessary to specify the first tweak using `--tweakClass` and additional tweaks using `--cascadedTweaks`
