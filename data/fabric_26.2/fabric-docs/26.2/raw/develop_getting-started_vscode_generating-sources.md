# Generating Sources in VS Code

> 来源：https://raw.githubusercontent.com/FabricMC/fabric-docs/238533d819fcb5ec9405acb58fb0ac7655df63b1/develop/getting-started/vscode/generating-sources.md
> 版本：26.2
> GitHub 路径：develop/getting-started/vscode/generating-sources.md
> 抓取源：github_latest_pinned
> 抓取时间：2026-10-30T17:15:12.606Z
> SHA256：cc309f4b31c725c5d435aaaa5ad9e30c78d1f63ca7f89664d3f0933869a0bec6
> 分支：main@238533d819fcb5ec9405acb58fb0ac7655df63b1

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

This can be done from the Gradle view, by running the `genSources` task in **Tasks** > **`fabric`**:
![`genSources` Task in Gradle View](/assets/develop/getting-started/vscode/gradle-gensources.png)

Or you can also run the command from the terminal:

```sh:no-line-numbers
./gradlew genSources
```

![`genSources` Task in Terminal](/assets/develop/getting-started/vscode/terminal-gensources.png)
