import { type envType } from "../data";
import { printRawHTML } from "../terminal";

export default async function fetchMusic(_env: envType) {
	printRawHTML(
		`<music-display
			nowPlayingApi="https://music-display.mck.is/now-playing"
			websocketUrl="wss://music-display.mck.is/now-playing-ws">
		</music-display>`,
	);

	return 0;
}
