using FluentValidation;
using TranslationService.Persistence.Entities;
using Utilities.Validators;

namespace TranslationService.Application.Validators;

public class LocalizationKeyValidator : BaseCommandValidator<LocalizationKey>
{
	public LocalizationKeyValidator()
	{
		RuleFor(x => x.Id)
			.NotEmpty()
			.WithMessage("Id is required");

		RuleFor(x => x.Key)
			.NotEmpty()
			.WithMessage("Name is required");
	}
}