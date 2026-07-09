import { type envType } from "./data";

import cat from "./commands/cat";
import cd from "./commands/cd";
import clear from "./commands/clear";
import echo from "./commands/echo";
import env from "./commands/env";
import fetchMusic from "./commands/fetch-music";
import help from "./commands/help";
import ls from "./commands/ls";
import ping from "./commands/ping";
import pwd from "./commands/pwd";
import tree from "./commands/tree";
import which from "./commands/which";
import whoAmI from "./commands/whoami";

export const commands = {
	ls: { fn: ls, desc: "list available directories" },
	echo: { fn: echo, desc: "print text" },
	cat: { fn: cat, desc: "print file contents" },
	cd: { fn: cd, desc: "change directory" },
	pwd: { fn: pwd, desc: "print working directory" },
	help: { fn: help, desc: "display this message" },
	clear: { fn: clear, desc: "clear the terminal" },
	ping: { fn: ping, desc: "ping a server" },
	whoami: { fn: whoAmI, desc: "about me" },
	tree: { fn: tree, desc: "list directory tree" },
	env: { fn: env, desc: "print environment variables" },
	which: { fn: which, desc: "locate a command" },
	"fetch-music": { fn: fetchMusic, desc: "what I'm listening to" },
} as Record<
	string,
	{
		fn: (env: envType, ...args: string[]) => Promise<number>;
		desc: string;
	}
>;

export { ls, echo, cat, cd, pwd, help, clear, ping, whoAmI, tree, env, fetchMusic, which };
