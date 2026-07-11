# Overview

There are two primary goals in network communication:

1. <li>Making sure the client view is &ldquo;in sync&rdquo; with the server view- <li>The flower at coordinates X,Y,Z just grew
2. <li>Giving the client a way to tell the server that something has changed about the player- <li>the player pressed a key

The most common way to accomplish these goals is to pass messages between the client and the server. These messages will usually be structured, containing data in a particular arrangement, for easy sending and receiving.