package com.mumfrey.webprefs.exceptions;

import com.mumfrey.webprefs.framework.RequestFailureReason;

public class InvalidRequestException extends RuntimeException
{
    private static final long serialVersionUID = 1L;

    private final RequestFailureReason reason;
    
    public InvalidRequestException(RequestFailureReason reason)
    {
        this.reason = reason;
    }

    public InvalidRequestException(RequestFailureReason reason, String message)
    {
        super(message);
        this.reason = reason;
    }

    public InvalidRequestException(RequestFailureReason reason, Throwable cause)
    {
        super(cause);
        this.reason = reason;
    }

    public InvalidRequestException(RequestFailureReason reason, String message, Throwable cause)
    {
        super(message, cause);
        this.reason = reason;
    }

    public RequestFailureReason getReason()
    {
        return this.reason;
    }
}
