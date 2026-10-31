# Developer Guides

> 来源：https://raw.githubusercontent.com/FabricMC/fabric-docs/238533d819fcb5ec9405acb58fb0ac7655df63b1/develop/index.md
> 版本：26.2
> GitHub 路径：develop/index.md
> 抓取源：github_latest_pinned
> 抓取时间：2026-10-30T17:15:12.606Z
> SHA256：162b3105ba042747b012fe85b5d39fe5e51895d633a9373e2f8fd172aa11b27c
> 分支：main@238533d819fcb5ec9405acb58fb0ac7655df63b1

---
title: Developer Guides
description: Our community-written developer guides cover many topics, from creating a mod and setting up your environment, all the way to rendering, networking, data generation and more.
authors:
  - IMB11
  - its-miroma
  - itsmiir
authors-nogithub:
  - basil4088
resources:
  https://github.com/FabricMC: FabricMC Organization on GitHub
  https://github.com/FabricMC/fabric-docs/tree/main/reference/latest: ExampleMod referenced by these docs
  https://java-programming.mooc.fi/: "University of Helsinki: Java Programming MOOC"
  https://dev.java/learn/: "Java Platform Group at Oracle: Learn Java"
  https://www.codecademy.com/learn/learn-java: "Codecademy: Learn Java"
  https://www.coursera.org/specializations/java-programming: "Duke University (via Coursera): Java Programming and Software Engineering Fundamentals"
  https://www.youtube.com/watch?v=A74TOX803D0: "freeCodeCamp (YouTube): Java Programming for Beginners"
  https://javabook.mccue.dev/: "Modern Java (Online textbook)"
---

<!-- markdownlint-configure-file { MD033: { allowed_elements: [script, ul, li, a ] } } -->

<script setup lang="ts">
import { useData } from "vitepress";

const javaResources = Object.entries(useData().frontmatter.value.resources).slice(2);
</script>

Fabric is a lightweight modding toolchain for Minecraft: Java Edition, designed to be simple and easy-to-use. It allows developers to apply modifications ("mods") to the vanilla game, to add new features or change existing mechanics.

This documentation will walk you through modding with Fabric, from [creating your first mod](./getting-started/creating-a-project) and [setting up your environment](./getting-started/setting-up), to advanced topics like [rendering](./rendering/basic-concepts), [networking](./networking), [data generation](./data-generation/setup) and much more.

Check out the sidebar for a list of the available pages.

::: tip

In case you need it at any time, a fully-working mod with all the source code of this documentation is available in the [`/reference` folder on GitHub](https://github.com/FabricMC/fabric-docs/tree/main/reference/latest).

:::

## Prerequisites {#prerequisites}

Before you start modding with Fabric, you need to have some understanding of developing with Java, and of Object-Oriented Programming in general.

Here are some resources that might help you familiarize with Java and OOP:

<ul>
  <li v-for="[url, title] in javaResources" :key="url">
    <a :href="url" target="_blank" rel="noreferrer">{{ title }}</a>
  </li>
</ul>

## What Does Fabric Offer? {#what-does-fabric-offer}

The Fabric Project is centered around three main components:

- **Fabric Loader**: a flexible, platform-independent loader of mods, primarily designed for Minecraft: Java Edition
- **Fabric API**: a complementary set of APIs and tools mod developers can use when creating mods
- **Fabric Loom**: a [Gradle](https://gradle.org/) plugin, enabling developers to easily develop and debug mods

### What Does Fabric API Offer? {#what-does-fabric-api-offer}

Fabric API provides a wide set of APIs that build on top of the vanilla functionality to allow advanced or simpler development.

For example, it provides new hooks, events, utilities such as transitive access wideners, access to internal registries such as the compostable items registry, and more.
