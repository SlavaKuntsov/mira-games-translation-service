﻿using FluentValidation;
using TranslationService.Application.Dtos;
using Utilities.Validators;

namespace TranslationService.Application.Validators;

public class TranslationValidator : BaseCommandValidator<TranslationCreateDto>
{
	public TranslationValidator()
	{
		RuleFor(x => x.Key)
			.NotEmpty()
			.WithMessage("Key is required");

		RuleFor(x => x.LanguageCode)
			.NotEmpty()
			.WithMessage("LanguageCode is required")
			.MaximumLength(3);

		RuleFor(x => x.Text)
			.NotEmpty()
			.WithMessage("Text is required");
	}
}