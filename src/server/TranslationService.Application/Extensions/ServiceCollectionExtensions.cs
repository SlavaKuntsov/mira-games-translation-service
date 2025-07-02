using FluentValidation;
using Microsoft.Extensions.DependencyInjection;
using TranslationService.Application.Abstractions.Services;
using TranslationService.Application.Services;
using TranslationService.Application.Validators;

namespace TranslationService.Application.Extensions;

public static class ServiceCollectionExtensions
{
	public static IServiceCollection AddApplication(this IServiceCollection services)
	{
		services.AddScoped<ILanguageService, LanguageService>();
		services.AddScoped<ILocalizationKeyService, LocalizationKeyService>();
		services.AddScoped<ITranslationService, Services.TranslationService>();

		services.AddValidatorsFromAssemblyContaining<LanguageValidator>();
		services.AddValidatorsFromAssemblyContaining<LocalizationKeyValidator>();
		services.AddValidatorsFromAssemblyContaining<TranslationValidator>();

		return services;
	}
}