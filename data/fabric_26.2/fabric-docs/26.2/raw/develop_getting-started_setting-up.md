# Setting Up Your Development Environment

> 来源：https://raw.githubusercontent.com/FabricMC/fabric-docs/238533d819fcb5ec9405acb58fb0ac7655df63b1/develop/getting-started/setting-up.md
> 版本：26.2
> GitHub 路径：develop/getting-started/setting-up.md
> 抓取源：github_latest_pinned
> 抓取时间：2026-10-30T17:15:12.606Z
> SHA256：63a687ca404b46f640f24bbd6ea3ab1183d8749c9ed0b1c4d16e91a8bbf3fbf4
> 分支：main@238533d819fcb5ec9405acb58fb0ac7655df63b1

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
---

## Install JDK 25 {#install-jdk-21}

To develop mods for Minecraft 26.1, you will need JDK 25.

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
