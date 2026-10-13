/*
 * This file is part of LiteLoader.
 * Copyright (C) 2012-16 Adam Mummery-Smith
 * All Rights Reserved.
 */
package com.mumfrey.liteloader.api.exceptions;

public class InvalidAPIException extends APIException
{
    private static final long serialVersionUID = 1L;

    public InvalidAPIException(String message, Throwable cause)
    {
        super(message, cause);
    }

    public InvalidAPIException(String message)
    {
        super(message);
    }
}
