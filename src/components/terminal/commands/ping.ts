import { type envType } from "../data";
import { printTermLine } from "../terminal";
import { checkOptionsFromArgs, type optionType } from "./jsh";

export default async function ping(_env: envType, ...args: string[]) {
	const availableOptions = [
		{ name: "help", long: "", short: "-h", takesArg: false },
		{ name: "version", long: "", short: "-V", takesArg: false },
		{ name: "count", long: "", short: "-c", takesArg: true },
	] as optionType[];

	const parsedParts = await checkOptionsFromArgs(args, availableOptions, "ping");

	if (!parsedParts) return 2;

	const options = parsedParts.options;
	args = parsedParts.nonOptionArgs;

	if (options.help) {
		printTermLine(`Usage
  ping [options] <destination>

Options:
  <destination>  DNS name
  -c <count>     stop after <count> replies
  -h             print help and exit
  -V             print version and exit`);
		return 0;
	}

	if (options.version) {
		printTermLine(`ping (jsh) 0.1.1`);
		return 0;
	}

	const address = args[0];
	if (!address) {
		printTermLine("ping: missing address");
		return 1;
	}

	const count = options.count ? parseInt(options.count as string) : 5;

	printTermLine(`PING ${address} 56 data bytes`);
	let failed = false;

	for (let i = 0; i < count; i++) {
		if (failed) return 1;

		const start = performance.now();
		await fetch(`https://${address}`, { mode: "no-cors" })
			.then(() => {
				const end = performance.now();
				printTermLine(`64 bytes from ${address}: icmp_seq=${i + 1} time=${end - start} ms`);
			})
			.catch((e) => {
				console.error(e);
				printTermLine(`ping: ${address}: Address not reachable`);
				failed = true;
			});

		if (!failed) await new Promise((resolve) => setTimeout(resolve, 1000));
	}

	return 0;
}
