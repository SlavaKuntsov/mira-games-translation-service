'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Sheet as SheetComponent,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose,
} from '@/components/ui/sheet';
import { getSelectedLanguagesSync } from '@/lib/language-store';
import { TranslationSchema } from '@/types/table-types';
import { IconPlus } from '@tabler/icons-react';
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { createTranslation } from '@/utils/api';

interface SheetProps {
  onAddRow: (row: { id: string; key: string; translations: Record<string,string|undefined> }) => void;
}

export function Sheet({ onAddRow }: SheetProps) {
  const [key, setKey] = useState('');
  const [translations, setTranslations] = useState<Record<string,string|undefined>>({});
  const [error, setError] = useState<string|null>(null);
  const [langs, setLangs] = useState<string[]>([]);

  const openSheet = () => {
    setLangs(getSelectedLanguagesSync().map(l => l.code));
    setKey('');
    setTranslations({});
    setError(null);
  };

  const handleChange = (lang: string, value: string) => {
    setTranslations(prev => ({ ...prev, [lang]: value }));
  };

  const handleSave = async () => {
    const hasSome = langs.some(code => translations[code]?.trim());
    if (!hasSome) {
      setError('Fill in at least one translation');
      return;
    }

    // Создаём базовый объект и валидация
    const candidate = {
      id: uuidv4(),
      key: key.trim(),
      translations: langs.reduce<Record<string,string|undefined>>((acc, code) => {
        acc[code] = translations[code]?.trim();
        return acc;
      }, {}),
    };
    const parsed = TranslationSchema.safeParse(candidate);
    if (!parsed.success) {
      setError('Please check fields');
      return;
    }

    setError(null);

    // Отправляем в API каждый непустой перевод
    try {
      for (const [languageCode, text] of Object.entries(parsed.data.translations)) {
        if (text) {
          const newId = await createTranslation(parsed.data.key, languageCode, text);
          // для первого перевода заменяем временный id на серверный
          if (languageCode === Object.keys(parsed.data.translations)[0]) {
            parsed.data.id = newId;
          }
        }
      }
      onAddRow(parsed.data);
    } catch (e: any) {
      setError(`Error saving: ${e.message}`);
    }
  };

  return (
    <SheetComponent>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" onClick={openSheet}>
          <IconPlus /><span className="hidden lg:inline">Add Key</span>
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Add row</SheetTitle>
          <SheetDescription>Добавьте новый перевод.</SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 px-4">
          <div className="grid gap-1">
            <Label htmlFor="new-key">Key</Label>
            <Input id="new-key" placeholder="Key" value={key} onChange={e => setKey(e.target.value)} />
          </div>
          {langs.map(code => (
            <div key={code} className="grid gap-1">
              <Label>{code.toUpperCase()}</Label>
              <Input
                placeholder={`Translation (${code})`}
                value={translations[code] ?? ''}
                onChange={e => handleChange(code, e.target.value)}
              />
            </div>
          ))}
          {error && <div className="text-red-500 text-sm">{error}</div>}
        </div>
        <SheetFooter>
          <Button onClick={handleSave}>Save changes</Button>
          <SheetClose asChild><Button variant="outline">Close</Button></SheetClose>
        </SheetFooter>
      </SheetContent>
    </SheetComponent>
  );
}
