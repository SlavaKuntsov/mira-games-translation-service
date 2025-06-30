﻿namespace TranslationService.Persistence.Entities;

public class Language
{
	public Guid Id { get; set; }
	public string Name { get; set; } = string.Empty;
	public string Code { get; set; } = string.Empty;
	public bool IsSelected { get; set; } = false;
}