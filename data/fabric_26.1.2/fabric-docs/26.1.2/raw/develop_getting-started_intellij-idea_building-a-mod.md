# Building a Mod in IntelliJ IDEA

> 来源：https://raw.githubusercontent.com/FabricMC/fabric-docs/main/versions/26.1.2/develop/getting-started/intellij-idea/building-a-mod.md
> 版本：26.1.2
> GitHub 路径：develop/getting-started/intellij-idea/building-a-mod.md
> 抓取源：github_raw_versioned
> 抓取时间：2026-08-20T09:52:15.852Z
> SHA256：096aae6c08d77dc4b29bba837ef48ebbab9500c8579ee19a55b64f9b94b8a979
> 分支：main

---
title: Building a Mod in IntelliJ IDEA
description: Learn how to use IntelliJ IDEA to build a Minecraft mod that can be shared or tested in a production environment.
authors:
  - cassiancc
  - cputnam-a11y
  - gdude2002
  - Scotsguy
prev:
  text: Generating Sources in IntelliJ IDEA
  link: ./generating-sources
next:
  text: Tips and Tricks for IntelliJ IDEA
  link: ./tips-and-tricks
---

In IntelliJ IDEA, open the Gradle tab on the right and execute `build` under tasks. The JARs should appear in the `build/libs` folder in your project directory. Use the JAR file with the shortest name outside development.

![The sidebar of IntelliJ IDEA showing a highlighted build task](/assets/develop/getting-started/build-idea.png)

![The build/libs folder with the corrected file highlighted](/assets/develop/getting-started/build-libs.png)

## Installing and Sharing {#installing-and-sharing}

From there, the mod can be [installed as normal](../../../players/installing-mods), or uploaded to trustworthy mod hosting sites like [CurseForge](https://www.curseforge.com/minecraft) and [Modrinth](https://modrinth.com/discover/mods).
