using FluentValidation;
using TranslationService.Persistence.Entities;
using Utilities.Validators;

namespace TranslationService.Application.Validators;

public class LanguageValidator : BaseCommandValidator<Language>
{
	public LanguageValidator()
	{
		RuleFor(x => x.Id)
			.NotEmpty().WithMessage("Id is required");

		RuleFor(x => x.Name)
			.NotEmpty().WithMessage("Name is required")
			.MaximumLength(100);

		RuleFor(x => x.Code)
			.NotEmpty().WithMessage("Code is required")
			.MaximumLength(10);
	}
}