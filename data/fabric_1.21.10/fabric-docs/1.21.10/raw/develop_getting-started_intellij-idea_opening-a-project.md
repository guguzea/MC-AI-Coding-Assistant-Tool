# Opening a Project in IntelliJ IDEA

> 来源：https://raw.githubusercontent.com/FabricMC/fabric-docs/main/versions/1.21.10/develop/getting-started/intellij-idea/opening-a-project.md
> 版本：1.21.10
> GitHub 路径：develop/getting-started/intellij-idea/opening-a-project.md
> 抓取源：github_raw_versioned
> 抓取时间：2026-08-20T09:48:50.674Z
> SHA256：b89e03fc84bafeea10f94d201277ab4c67af78469c6f271679fe1fac6d0902e0
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

## Importing the Project {#importing-the-project}

Once you've opened the project in IntelliJ IDEA, the IDE should automatically load the project's Gradle configuration and perform the necessary setup tasks.

If you receive a notification talking about a Gradle build script, you should click the `Load` button:

![Gradle Build Script Found](/assets/develop/getting-started/intellij/gradle-build-script.png)

Once the project has been imported, you should see the project's files in the project explorer, and you should be able to start developing your mod.
