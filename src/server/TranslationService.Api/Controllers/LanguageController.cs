using Asp.Versioning;
using Microsoft.AspNetCore.Mvc;

namespace TranslationService.Api.Controllers;

[ApiController]
[Route("api/v{version:apiVersion}/auth")]
[ApiVersion("1.0")]
public class LanguageController : ControllerBase
{
}