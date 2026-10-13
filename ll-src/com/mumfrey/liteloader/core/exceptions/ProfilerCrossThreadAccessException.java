/*
 * This file is part of LiteLoader.
 * Copyright (C) 2012-16 Adam Mummery-Smith
 * All Rights Reserved.
 */
package com.mumfrey.liteloader.core.exceptions;

/**
 * Exception to throw if startSection or endSection are called from a thread
 * other than the Minecraft main thread. This should NEVER happen and is an
 * attempt to identify the culprit of some profiler stack corruption causes.
 *
 * @author Adam Mummery-Smith
 */
public class ProfilerCrossThreadAccessException extends RuntimeException
{
    private static final long serialVersionUID = 3225047722943528251L;

    public ProfilerCrossThreadAccessException(String message)
    {
        super("Calling thread name \"" + message + "\"");
    }
}
