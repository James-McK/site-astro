import { type envType } from "../data";
import { printTermLine } from "../terminal";
import { commands } from "../commands";

export default async function help(_env: envType) {
	let helpText = "Available commands:\n";
	for (const [command, { desc }] of Object.entries(commands)) {
		helpText += `${command} - ${desc}\n`;
	}

	printTermLine(helpText);

	return 0;
}
