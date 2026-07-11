# getting started building a mod

> 来源：https://docs.fabricmc.net/develop/getting-started/building-a-mod
> 版本：1.21.1
> GitHub 路径：develop/getting-started/building-a-mod.md
> 抓取源：vitepress
> 抓取时间：2026-07-11T14:05:15.725Z
> SHA256：7dae32539ddb2c4cc90c7cf213c64f307673dba76dbb80f28e2eab759b51a4b8
> 分支：main

# Building a Mod 26.1.2 ​
Learn how to build a Minecraft mod that can be shared or tested in a production environment.Once your mod is ready for testing, you're able to export it into a JAR file which can be shared on mod hosting websites, or used to test your mod in production alongside other mods.

## Choose Your IDE ​
[IntelliJ IDEA](./intellij-idea/building-a-mod) Visual Studio Code
## Building in the Terminal ​
WARNINGUsing the terminal to build a mod rather than an IDE may cause issues if your default Java installation does not match what the project is expecting. For more reliable builds, consider using an IDE that allows you to easily specify the correct version of Java.

Open a terminal from the same directory as the mod project directory, and run the following command:

WindowsmacOS/Linuxpowershell./gradlew.bat buildsh./gradlew buildThe JARs should appear in the build/libs folder in your project. Use the JAR file with the shortest name outside development.

## Installing and Sharing ​
From there, the mod can be installed as normal, or uploaded to trustworthy mod hosting sites like CurseForge and Modrinth.

Copied