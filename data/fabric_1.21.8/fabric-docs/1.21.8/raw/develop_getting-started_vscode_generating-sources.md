# Generating Sources in VS Code

> 来源：https://raw.githubusercontent.com/FabricMC/fabric-docs/main/versions/1.21.8/develop/getting-started/vscode/generating-sources.md
> 版本：1.21.8
> GitHub 路径：develop/getting-started/vscode/generating-sources.md
> 抓取源：github_raw_versioned
> 抓取时间：2026-08-20T09:47:34.235Z
> SHA256：7517d97ef0e98c75d4cf9f921e218185ee5da6021055fc444735656a62b13a9a
> 分支：main

---
title: Generating Sources in VS Code
description: A guide to generating Minecraft sources in Visual Studio Code.
authors:
  - dicedpixels
prev:
  text: Launching the Game in VS Code
  link: ./launching-the-game
next:
  text: Tips and Tricks for VS Code
  link: ./tips-and-tricks
---

The Fabric toolchain lets you access the Minecraft source code by generating it locally, and you can use Visual Studio Code to conveniently navigate through it. To generate sources, you need to run the `genSources` Gradle task.

This can be done from the Gradle View like above, by running the `genSources` task in **Tasks** > **`fabric`**:
![`genSources` Task in Gradle View](/assets/develop/getting-started/vscode/gradle-gensources.png)

Or you can also run the command from the terminal:

```sh:no-line-numbers
./gradlew genSources
```

![`genSources` Task in Terminal](/assets/develop/getting-started/vscode/terminal-gensources.png)
