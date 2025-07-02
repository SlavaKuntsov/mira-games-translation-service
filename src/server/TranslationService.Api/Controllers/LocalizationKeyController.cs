using Asp.Versioning;
using Common.Results;
using Microsoft.AspNetCore.Mvc;
using TranslationService.Application.Abstractions.Services;
using TranslationService.Application.Dtos;

namespace TranslationService.Api.Controllers;

[ApiController]
[Route("api/v{version:apiVersion}/keys")]
[ApiVersion("1.0")]
public class LocalizationKeyController(ILocalizationKeyService service) : ControllerBase
{
	[HttpGet]
	public async Task<IActionResult> GetAll(CancellationToken ct = default)
	{
		var result = await service.GetAsync(ct);

		return result.ToActionResult();
	}

	[HttpPost]
	public async Task<IActionResult> Add(
		[FromBody] LocalizationKeyCreateDto dto,
		CancellationToken ct = default)
	{
		var result = await service.AddAsync(dto.Key, ct);

		return result.ToActionResult();
	}

	[HttpPut]
	public async Task<IActionResult> Update(
		[FromBody] LocalizationKeyDto entity,
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