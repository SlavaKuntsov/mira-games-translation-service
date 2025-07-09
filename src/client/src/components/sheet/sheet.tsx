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
import { TranslationSchema, type Language } from '@/types/table-types';
import { IconPlus } from '@tabler/icons-react';
import { useEffect, useState } from 'react';

interface SheetProps {
	onAddRow: (row: any) => void;
}

export function Sheet({ onAddRow }: SheetProps) {
	const [key, setKey] = useState('');
	const [translations, setTranslations] = useState<Record<string, string>>({});
	const [error, setError] = useState<string | null>(null);
	const [nextId, setNextId] = useState(1);
	const [langs, setLangs] = useState<Language[]>(getSelectedLanguagesSync())

	const handleChange = (lang: string, value: string) => {
		setTranslations(prev => ({ ...prev, [lang]: value }));
	};

	const handleSave = () => {
		const atLeastOne = langs.some(
			lang => translations[lang] && translations[lang].trim() !== ''
		);
		if (!atLeastOne) {
			setError('Fill in at least one transfer');
			return;
		}
		const result = TranslationSchema.safeParse({
			id: nextId,
			key,
			translations: Object.fromEntries(
				langs.map(l => [l, translations[l] || ''])
			),
		});
		if (!result.success) {
			setError('Check that the fields are filled in correctly');
			return;
		}
		setError(null);
		onAddRow(result.data);
		setKey('');
		setTranslations({});
		setNextId(id => id + 1);
	};

	// useEffect(() => {
	// 	setla
	// })

	return (
		<SheetComponent>
			<SheetTrigger asChild>
				<Button variant='outline' size='sm' onClick={() => setLangs(getSelectedLanguagesSync())}>
					<IconPlus />
					<span className='hidden lg:inline'>Add Key</span>
				</Button>
			</SheetTrigger>
			<SheetContent>
				<SheetHeader>
					<SheetTitle className='text-xl'>Add row</SheetTitle>
					<SheetDescription>Add a new translation row.</SheetDescription>
				</SheetHeader>
				<div className='grid flex-1 auto-rows-min gap-3 px-4'>
					<div className='grid gap-3'>
						<Label htmlFor='sheet-demo-name'>Key</Label>
						<Input
							placeholder='Key'
							value={key}
							onChange={e => setKey(e.target.value)}
						/>
					</div>
					<div className='grid gap-3'>
						{langs.map(lang => (
							<>
								<Label htmlFor='sheet-demo-name'>{lang.toUpperCase()}</Label>
								<Input
									key={lang}
									placeholder={`Перевод (${lang})`}
									value={translations[lang] || ''}
									onChange={e => handleChange(lang, e.target.value)}
								/>
							</>
						))}
						{error && <div className='text-red-500 text-sm'>{error}</div>}
					</div>
				</div>
				{/* <div className="py-4 flex flex-col gap-2">
					
					<Input className='!text-lg' placeholder="Key" value={key} onChange={e => setKey(e.target.value)} />
					{langs}
					{langs.map(lang => (
						<Input
							key={lang}
							placeholder={`Перевод (${lang})`}
							value={translations[lang] || ''}
							onChange={e => handleChange(lang, e.target.value)}
						/>
					))}
					{error && <div className="text-red-500 text-sm">{error}</div>}
				</div> */}
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
