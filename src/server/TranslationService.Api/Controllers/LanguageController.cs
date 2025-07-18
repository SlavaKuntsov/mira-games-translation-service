using System.ComponentModel.DataAnnotations;
using Asp.Versioning;
using Common.Results;
using Microsoft.AspNetCore.Mvc;
using TranslationService.Application.Abstractions.Services;
using TranslationService.Application.Dtos;
using TranslationService.Persistence.Entities;

namespace TranslationService.Api.Controllers;

[ApiController]
[Route("api/v{version:apiVersion}/languages")]
[ApiVersion("1.0")]
public class LanguageController(ILanguageService service) : ControllerBase
{
	[HttpGet]
	public async Task<IActionResult> GetAll(
		[FromQuery] [Required] bool isSelected = false,
		CancellationToken ct = default)
	{
		var result = await service.GetAsync(isSelected, ct);

		return result.ToActionResult();
	}

	[HttpPost]
	public async Task<IActionResult> Add([FromBody] LanguageCreateDto dto, CancellationToken ct = default)
	{
		var result = await service.AddAsync(dto.Name, dto.Code, ct);

		return result.ToActionResult();
	}

	[HttpPut]
	public async Task<IActionResult> Update(
		[FromBody] Language entity,
		CancellationToken ct = default)
	{
		var result = await service.UpdateAsync(entity, ct);

		return result.ToActionResult();
	}

	[HttpDelete("{id:guid}")]
	public async Task<IActionResult> Delete(Guid id, CancellationToken ct = default)
	{
		await service.DeleteAsync(id, ct);

		return NoContent();
	}
}