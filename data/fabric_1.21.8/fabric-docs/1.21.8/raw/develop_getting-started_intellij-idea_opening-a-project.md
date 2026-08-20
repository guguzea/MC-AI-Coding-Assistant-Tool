# Opening a Project in IntelliJ IDEA

> 来源：https://raw.githubusercontent.com/FabricMC/fabric-docs/main/versions/1.21.8/develop/getting-started/intellij-idea/opening-a-project.md
> 版本：1.21.8
> GitHub 路径：develop/getting-started/intellij-idea/opening-a-project.md
> 抓取源：github_raw_versioned
> 抓取时间：2026-08-20T09:47:26.993Z
> SHA256：0f607d01ce4cd40cf00e8747928ff15443d29ff0c189ea0c78d94ea1023dc250
> 分支：main

---
title: Opening a Project in IntelliJ IDEA
description: How to open a Minecraft mod project in IntelliJ IDEA.
authors:
  - Cactooz
  - dicedpixels
  - IMB11
  - radstevee
  - Thomas1034
prev:
  text: Setting Up IntelliJ IDEA
  link: ./setting-up
next:
  text: Launching the Game in IntelliJ IDEA
  link: ./launching-the-game
---

Select your project in the startup dialog.

![Open Project Prompt](/assets/develop/getting-started/intellij/welcome.png)

If you're already in the IDE, from **File** > **Open**.

![File Open](/assets/develop/getting-started/intellij/file-open.png)

::: warning
You should follow these rules when choosing the path to your project:

- Avoid cloud storage directories (for example Microsoft OneDrive)
- Avoid non-ASCII characters (for example emoji, accented letters)
- Avoid spaces

An example of a "good" path may be: `C:\Projects\YourProjectName`
:::

## Importing the Project {#importing-the-project}

Once you've opened the project in IntelliJ IDEA, the IDE should automatically load the project's Gradle configuration and perform the necessary setup tasks.

If you receive a notification talking about a Gradle build script, you should click the `Load` button:

![Gradle Build Script Found](/assets/develop/getting-started/intellij/gradle-build-script.png)

Once the project has been imported, you should see the project's files in the project explorer, and you should be able to start developing your mod.
