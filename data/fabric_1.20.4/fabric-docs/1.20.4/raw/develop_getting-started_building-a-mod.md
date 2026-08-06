# Building a Mod

> 来源：https://raw.githubusercontent.com/FabricMC/fabric-docs/main/develop/getting-started/building-a-mod.md
> 版本：1.20.4
> GitHub 路径：develop/getting-started/building-a-mod.md
> 抓取源：github_raw
> 抓取时间：2026-08-06T04:40:37.176Z
> SHA256：6426a2804ac4dcda6ef325a4433b9604ed918cdc377406f09c2762b64f6414ec
> 分支：main

---
title: Building a Mod
description: Learn how to build a Minecraft mod that can be shared or tested in a production environment.
authors:
  - cassiancc
  - cputnam-a11y
  - gdude2002
  - Scotsguy
---

Once your mod is ready for testing, you're able to export it into a JAR file which can be shared on mod hosting websites, or used to test your mod in production alongside other mods.

## Choose Your IDE {#choose-your-ide}

<ChoiceComponent :choices="[
  {
    name: 'IntelliJ IDEA',
    href: './intellij-idea/building-a-mod',
    icon: 'simple-icons:intellijidea',
    color: '#FE2857',
  },
  {
    name: 'Visual Studio Code',
    icon: 'codicon:vscode',
    color: '#007ACC',
  },
]" />

## Building in the Terminal {#terminal}

::: warning

Using the terminal to build a mod rather than an IDE may cause issues if your default Java installation does not match what the project is expecting. For more reliable builds, consider using an IDE that allows you to easily specify the correct version of Java.

:::

Open a terminal from the same directory as the mod project directory, and run the following command:

::: code-group

```powershell:no-line-numbers [Windows]
./gradlew.bat build
```

```sh:no-line-numbers [macOS/Linux]
./gradlew build
```

:::

The JARs should appear in the `build/libs` folder in your project. Use the JAR file with the shortest name outside development.

## Installing and Sharing {#installing-and-sharing}

From there, the mod can be [installed as normal](../../players/installing-mods), or uploaded to trustworthy mod hosting sites like [CurseForge](https://www.curseforge.com/minecraft) and [Modrinth](https://modrinth.com/discover/mods).
