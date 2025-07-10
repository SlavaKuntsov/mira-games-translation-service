'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
	SheetClose,
	Sheet as SheetComponent,
	SheetContent,
	SheetDescription,
	SheetFooter,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from '@/components/ui/sheet';
import { getSelectedLanguagesSync } from '@/lib/language-store';
import { TranslationSchema } from '@/types/table-types';
import { IconPlus } from '@tabler/icons-react';
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

interface SheetProps {
	// Теперь translations может содержать undefined, чтобы совпадать с Zod-схемой
	onAddRow: (row: {
		id: string;
		key: string;
		translations: Record<string, string | undefined>;
	}) => void;
}

export function Sheet({ onAddRow }: SheetProps) {
	const [key, setKey] = useState('');
	const [translations, setTranslations] = useState<
		Record<string, string | undefined>
	>({});
	const [error, setError] = useState<string | null>(null);
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

	const handleSave = () => {
		// Проверяем, что есть хотя бы один непустой перевод
		const valid = langs.some(code => translations[code]?.trim());
		if (!valid) {
			setError('Fill in at least one translation');
			return;
		}

		const candidate = {
			id: uuidv4(),
			key: key.trim(),
			translations: langs.reduce<Record<string, string | undefined>>(
				(acc, code) => {
					acc[code] = translations[code]?.trim();
					return acc;
				},
				{}
			),
		};

		const parsed = TranslationSchema.safeParse(candidate);
		if (!parsed.success) {
			setError('Please check that fields are filled in correctly');
			return;
		}

		setError(null);
		onAddRow(parsed.data);
	};

	return (
		<SheetComponent>
			<SheetTrigger asChild>
				<Button variant='outline' size='sm' onClick={openSheet}>
					<IconPlus />
					<span className='hidden lg:inline'>Add Key</span>
				</Button>
			</SheetTrigger>
			<SheetContent>
				<SheetHeader>
					<SheetTitle>Add row</SheetTitle>
					<SheetDescription>Add a new translation row.</SheetDescription>
				</SheetHeader>
				<div className='grid gap-4 px-4'>
					<div className='grid gap-1'>
						<Label htmlFor='new-key'>Key</Label>
						<Input
							id='new-key'
							placeholder='Key'
							value={key}
							onChange={e => setKey(e.target.value)}
						/>
					</div>
					{langs.map(code => (
						<div key={code} className='grid gap-1'>
							<Label>{code}</Label>
							<Input
								placeholder={`Translation (${code})`}
								value={translations[code] ?? ''}
								onChange={e => handleChange(code, e.target.value)}
							/>
						</div>
					))}
					{error && <div className='text-red-500 text-sm'>{error}</div>}
				</div>
				<SheetFooter>
					<Button type='button' onClick={handleSave}>
						Save changes
					</Button>
					<SheetClose asChild>
						<Button variant='outline'>Close</Button>
					</SheetClose>
				</SheetFooter>
			</SheetContent>
		</SheetComponent>
	);
}
