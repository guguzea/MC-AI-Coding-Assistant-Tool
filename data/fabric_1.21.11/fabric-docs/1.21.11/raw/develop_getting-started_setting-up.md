# Setting Up Your Development Environment

> 来源：https://raw.githubusercontent.com/FabricMC/fabric-docs/main/versions/1.21.11/develop/getting-started/setting-up.md
> 版本：1.21.11
> GitHub 路径：develop/getting-started/setting-up.md
> 抓取源：github_raw_versioned
> 抓取时间：2026-08-20T09:50:48.570Z
> SHA256：42e5ef38f85062bfaa7653f5d0cdbbbb7f4a8408587804d9ce5f8bdb9f964a50
> 分支：main

---
title: Setting Up Your Development Environment
description: A step-by-step guide on how to set up a development environment to create mods using Fabric.
authors:
  - 2xsaiko
  - Andrew6rant
  - asiekierka
  - Daomephsta
  - dicedpixels
  - falseresync
  - IMB11
  - its-miroma
  - liach
  - mkpoli
  - modmuss50
  - natanfudge
  - SolidBlock-cn
  - TelepathicGrunt
authors-nogithub:
  - siglong
outline: false
---

## Install JDK 21 {#install-jdk-21}

To develop mods for Minecraft 1.21.11, you will need JDK 21.

If you need help installing Java, you can refer to the [Java installation guides](../../players/installing-java/).

## Set Up Your IDE {#set-up-your-ide}

To start developing mods with Fabric, you will need to set up a development environment using IntelliJ IDEA (recommended), or alternatively Visual Studio Code.

<ChoiceComponent :choices="[
  {
    name: 'IntelliJ IDEA',
    href: './intellij-idea/setting-up',
    icon: 'simple-icons:intellijidea',
    color: '#FE2857',
  },
  {
    name: 'Visual Studio Code',
    href: './vscode/setting-up',
    icon: 'codicon:vscode',
    color: '#007ACC',
  },
]" />
