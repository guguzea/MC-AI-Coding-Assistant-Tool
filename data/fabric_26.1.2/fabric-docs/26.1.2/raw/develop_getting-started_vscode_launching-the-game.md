# Launching the Game in VS Code

> 来源：https://raw.githubusercontent.com/FabricMC/fabric-docs/main/versions/26.1.2/develop/getting-started/vscode/launching-the-game.md
> 版本：26.1.2
> GitHub 路径：develop/getting-started/vscode/launching-the-game.md
> 抓取源：github_raw_versioned
> 抓取时间：2026-08-20T09:52:27.045Z
> SHA256：b8a8cd0209adec5adfa54aa15d3a14b531573d13b8219b522ad40d4577cc50e6
> 分支：main

---
title: Launching the Game in VS Code
description: Learn how to launch a Minecraft instance from Visual Studio Code.
authors:
  - dicedpixels
prev:
  text: Opening a Project in VS Code
  link: ./opening-a-project
next:
  text: Generating Sources in VS Code
  link: ./generating-sources
---

The Fabric toolchain integrates with Visual Studio Code to provide a convenient way to run a game instance to test and debug your mod.

## Generating Launch Targets {#generating-launch-targets}

To run the game with debugging support enabled, you will need to generate launch targets by running the `vscode` Gradle task.

This can be done from the Gradle View from within Visual Studio Code: open it and navigate to the `vscode` task in **Tasks** > **`ide`**. Double click or use the **Run Task** button to execute the task.

![`vscode` Task in Gradle View](/assets/develop/getting-started/vscode/gradle-vscode.png)

Alternatively you can use the terminal directly: open a new terminal through **Terminal** > **New Terminal** and run:

```sh:no-line-numbers
./gradlew vscode
```

![`vscode` Task in Terminal](/assets/develop/getting-started/vscode/terminal-vscode.png)

### Using Launch Targets {#using-launch-targets}

Once launch targets are generated, you can use them by opening the **Run and Debug** view, selecting the desired target and pressing the **Start Debugging** button (<kbd>F5</kbd>).

![Launch Targets](/assets/develop/getting-started/vscode/launch-targets.png)
