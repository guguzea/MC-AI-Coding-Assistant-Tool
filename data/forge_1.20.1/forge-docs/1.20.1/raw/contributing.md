# Contributing to Docs

> 来源：https://docs.minecraftforge.net/en/1.20.1/contributing
> 版本：1.20.1

# Contributing to This Documentation

You can make a contribution via a PR on [GitHub](https://github.com/MinecraftForge/Documentation).

This documentation is meant to be explanatory. Please explain how to do things, and break it down into reasonable chunks. We have a wiki elsewhere that can capture more comprehensive code examples.

Our audience is anyone who wants to understand how to build a mod using Forge.

Please don&rsquo;t try to turn this documentation into a tutorial on Java Development - it is intended for people who understand how a Java class works, and other fundamental structures of Java.

## Style Guide

> **Important**: Important Please use two spaces to indent, not tabs.

Titles should be capitalized in the standard titling format. For example,

- Guide For Contributing to This Documentation
- Building and Testing Your Mod

Essentially, capitalize everything but unimportant words.

Spelling, grammar, and syntax should follow those of American English. Also, prefer using separate words over contractions (e.g. &ldquo;are not&rdquo; instead of &ldquo;aren&rsquo;t&rdquo;).

Please use equals and dash underlines, instead of `#` and `##`. For h3 and lower, `###` etc. is fine. The source of this file contains an example for equals and dash underlining. Equals underlines create h1 text, and dash underlines create h2 text.

When referencing fields and methods outside of code block snippets, they should use a `#` separator (e.g. `ClassName#methodName`). Inner classes should use a `$` separator (e.g. `ClassName$InnerClassName`).

JSON code block snippets should use `js` syntax highlighting.

All links should have their location specified at the bottom of the page. Any internal links should reference the page via their relative path.

Admonitions (represented by `!!! <type>`) must be formatted as [documented](https://python-markdown.github.io/extensions/admonition/); otherwise they may end up rendering incorrectly.