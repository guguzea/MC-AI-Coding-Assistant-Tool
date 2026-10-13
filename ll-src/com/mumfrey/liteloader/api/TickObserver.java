/*
 * This file is part of LiteLoader.
 * Copyright (C) 2012-16 Adam Mummery-Smith
 * All Rights Reserved.
 */
package com.mumfrey.liteloader.api;

/**
 * LiteLoader Extensible API - TickObserver
 * 
 * Received a callback every tick (duh) PRIOR to the mod tick event
 * 
 * @author Adam Mummery-Smith
 */
public interface TickObserver extends Observer
{
    public abstract void onTick(boolean clock, float partialTicks, boolean inGame);
}
