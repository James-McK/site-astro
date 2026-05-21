import { type envType } from "../data";
import { printTermLine } from "../terminal";

export default async function echo(_env: envType, ...args: string[]) {
	let text = args.join(" ");
	printTermLine(text);
	return 0;
}
