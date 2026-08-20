# Generating Sources in IntelliJ IDEA

> 来源：https://raw.githubusercontent.com/FabricMC/fabric-docs/main/versions/1.21.8/develop/getting-started/intellij-idea/generating-sources.md
> 版本：1.21.8
> GitHub 路径：develop/getting-started/intellij-idea/generating-sources.md
> 抓取源：github_raw_versioned
> 抓取时间：2026-08-20T09:47:25.252Z
> SHA256：5d4804b104ea90b22797c0ee3610823c0688d3a3a45a621b3490f83d9e81471c
> 分支：main

---
title: Generating Sources in IntelliJ IDEA
description: A guide to generating Minecraft sources in IntelliJ IDEA.
authors:
  - dicedpixels
prev:
  text: Launching the Game in IntelliJ IDEA
  link: ./launching-the-game
next:
  text: Tips and Tricks for IntelliJ IDEA
  link: ./tips-and-tricks
---

The Fabric toolchain lets you access the Minecraft source code by generating it locally, and you can use IntelliJ IDEA to conveniently navigate through it. To generate sources, you need to run the `genSources` Gradle task.

This can be done from the Gradle View like above, by running the `genSources` task in **Tasks** > **`fabric`**:
![`genSources` Task in Gradle Panel](/assets/develop/getting-started/intellij/gradle-gensources.png)

Or you can also run the command from the terminal:

```sh:no-line-numbers
./gradlew genSources
```

![`genSources` Task in Terminal](/assets/develop/getting-started/intellij/terminal-gensources.png)

## Attaching Sources {#attaching-sources}

IntelliJ requires one additional step of attaching generated sources to the project.

To do this, open any Minecraft class. You can <kbd>Ctrl</kbd> + Click to go to the definition, which opens the class or use "Search everywhere" to open a class.

Lets open `MinecraftServer.class` as an example. You should now see a blue banner on the top with a "**Choose Sources...**" link.

![Choose Sources](/assets/develop/getting-started/intellij/choose-sources.png)

Click on "**Choose Sources...**" to open a file selector dialog. This dialog will open at the correct location of generated sources by default.

Select the file that ends with **`-sources`** and press **Open** to confirm the selection.

![Choose Sources Dialog](/assets/develop/getting-started/intellij/choose-sources-dialog.png)

If the correct file is open, you should now be able to see Javadoc comments as well as have the ability to search for references.

![Javadoc Comments in Sources](/assets/develop/getting-started/intellij/javadoc.png)
