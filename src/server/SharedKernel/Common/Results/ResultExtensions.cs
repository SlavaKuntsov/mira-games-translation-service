using FluentResults;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Common.Results
{
    public static class FluentResultsProblemDetailsExtensions
    {
        private static readonly Dictionary<string, (int StatusCode, string Title)> ErrorTypeMappings = new()
        {
            { "AlreadyExists", (StatusCodes.Status400BadRequest, "Resource Already Exists") },
            { "BadRequest", (StatusCodes.Status400BadRequest, "Bad Request") },
            { "NotFound", (StatusCodes.Status404NotFound, "Resource Not Found") },
            { "Validation", (StatusCodes.Status400BadRequest, "Validation Error") },
            { "Unauthorized", (StatusCodes.Status401Unauthorized, "Unauthorized") },
            { "InvalidToken", (StatusCodes.Status400BadRequest, "Invalid Token") },
            { "UnprocessableContent", (StatusCodes.Status422UnprocessableEntity, "Unprocessable Content") },
        };

        public static IActionResult ToActionResult<T>(this Result<T> result)
        {
            if (result.IsSuccess)
                return new OkObjectResult(result.Value);

            return result.ToResult().ToActionResult();
        }

        public static IActionResult ToActionResult(this Result result)
        {
            if (result.IsSuccess)
                return new OkResult();

            var firstError = result.Errors[0];

            var typeKey = firstError.Metadata.TryGetValue("Type", out var typeObj) ? typeObj?.ToString() : null;

            var (statusCode, title) = typeKey != null && ErrorTypeMappings.TryGetValue(typeKey, out var mapping)
                ? mapping
                : (StatusCodes.Status400BadRequest, "Bad Request");

            var problemDetails = new ProblemDetails
            {
                Status = statusCode,
                Title = title,
                Detail = firstError.Message,
                Instance = null // при желании можно сюда передать HttpContext.Request.Path
            };

            return new ObjectResult(problemDetails) { StatusCode = statusCode };
        }
    }
}