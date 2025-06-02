export function isNonEmptyString(value: string | null | undefined): boolean {
	return value?.trim().length > 0 ?? false;
}

export function isEmail(value: string): boolean {
	return /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value);
}

export function isPhoneNumber(value: string): boolean {
	return /^(?:\+7|8)[\s-]?\(?\d{3}\)?[\s-]?\d{3}[\s-]?\d{2}[\s-]?\d{2}$/.test(
		value
	);
}
