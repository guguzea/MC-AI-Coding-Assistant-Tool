/*
 * This file is part of LiteLoader.
 * Copyright (C) 2012-16 Adam Mummery-Smith
 * All Rights Reserved.
 */
package com.mumfrey.liteloader.transformers;

public class InjectedCallbackCollisionError extends Error
{
    private static final long serialVersionUID = 1L;

    public InjectedCallbackCollisionError()
    {
    }

    public InjectedCallbackCollisionError(String message)
    {
        super(message);
    }

    public InjectedCallbackCollisionError(Throwable cause)
    {
        super(cause);
    }

    public InjectedCallbackCollisionError(String message, Throwable cause)
    {
        super(message, cause);
    }

}
