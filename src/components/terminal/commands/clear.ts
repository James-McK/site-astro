import { type envType } from "../data";
import { terminal } from "../terminal";

export default async function clear(_env: envType) {
	terminal.replaceChildren();
	return 0;
}
