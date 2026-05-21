import { type envType, getCurrentDir } from "../data";
import { printTermLine } from "../terminal";

export default async function pwd(_env: envType) {
	printTermLine(getCurrentDir());
	return 0;
}
