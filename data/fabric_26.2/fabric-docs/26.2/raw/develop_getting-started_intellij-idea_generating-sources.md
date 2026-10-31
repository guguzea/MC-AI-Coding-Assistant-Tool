# Generating Sources in IntelliJ IDEA

> 来源：https://raw.githubusercontent.com/FabricMC/fabric-docs/238533d819fcb5ec9405acb58fb0ac7655df63b1/develop/getting-started/intellij-idea/generating-sources.md
> 版本：26.2
> GitHub 路径：develop/getting-started/intellij-idea/generating-sources.md
> 抓取源：github_latest_pinned
> 抓取时间：2026-10-30T17:15:12.606Z
> SHA256：32d212afa2fbc1898516eeb587bbc099aa5c84b51cd2a56bf594bf395615e73a
> 分支：main@238533d819fcb5ec9405acb58fb0ac7655df63b1

---
title: Generating Sources in IntelliJ IDEA
description: A guide to generating Minecraft sources in IntelliJ IDEA.
authors:
  - dicedpixels
prev:
  text: Launching the Game in IntelliJ IDEA
  link: ./launching-the-game
next:
  text: Building a Mod in IntelliJ IDEA
  link: ./building-a-mod
---

The Fabric toolchain lets you access the Minecraft source code by generating it locally, and you can use IntelliJ IDEA to conveniently navigate through it. To generate sources, you need to run the `genSources` Gradle task.

This can be done from the Gradle panel, by running the `genSources` task in **Tasks** > **`fabric`**:
![`genSources` Task in Gradle Panel](/assets/develop/getting-started/intellij/gradle-gensources.png)

Or you can also run the command from the terminal:

```sh:no-line-numbers
./gradlew genSources
```

![`genSources` Task in Terminal](/assets/develop/getting-started/intellij/terminal-gensources.png)

## Attaching Sources {#attaching-sources}

IntelliJ requires one additional step of attaching generated sources to the project.

To do this, open any Minecraft class. You can <kbd>Ctrl</kbd> + Click to go to the definition, which opens the class or use "Search everywhere" to open a class.

Let's open `MinecraftServer.class` as an example. You should now see a blue banner on the top with a "**Choose Sources...**" link.

![Choose Sources](/assets/develop/getting-started/intellij/choose-sources.png)

Click on "**Choose Sources...**" to open a file selector dialog. This dialog will open at the correct location of generated sources by default.

Select the file that ends with **`-sources`** and press **Open** to confirm the selection.

![Choose Sources Dialog](/assets/develop/getting-started/intellij/choose-sources-dialog.png)

You should now have the ability to search for references. If you are using a mapping set that contains Javadocs, like [Parchment](https://parchmentmc.org/) (for Mojang Mappings) or Yarn, you should now also see Javadocs.

![Javadoc Comments in Sources](/assets/develop/getting-started/intellij/javadoc.png)
