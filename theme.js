import { yellow as theme } from "mdx-deck/themes";

export default {
	...theme,
	pre: {
		textAlign: "left",
		color: "white",
		padding: "1em",
		backgroundColor: "#333",
		borderRadius: "10px",
		boxShadow: "5px 10px 20px rgba(0, 0, 0, 0.5)"
	},
	css: {
		...theme.css,
		canvas: {
			borderRadius: "10px",
			boxShadow: "5px 10px 20px rgba(0, 0, 0, 0.5)"
		},
	},
	colors: {
		background: "white"
	}
};
