import { createHash } from 'crypto';

export default function generateToken(keys: any) {
	const { Receipt, Shops, DATA, ...data } = keys;
	let payload = Object.entries(data).sort().map(function (value, index) { return value[1]; }).join("");
	return createHash('sha256').update(payload).digest('hex');
}