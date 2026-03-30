import type { Config } from "tailwindcss";

const config: Config = {
	theme: {
		extend: {
			animation: {
				bounce: "bounce 0.6s infinite",
				"float-anim": "float 6s ease-in-out infinite",
				"float-anim-slow": "float 8s ease-in-out infinite",
				twinkle: "twinkle 5s ease-in-out infinite",
				aurora: "aurora 15s ease infinite",
			},
			keyframes: {
				bounce: {
					"0%, 100%": { transform: "translateY(0)" },
					"50%": { transform: "translateY(-4px)" },
				},
				float: {
					"0%, 100%": { transform: "translateY(0px)" },
					"50%": { transform: "translateY(-10px)" },
				},
				twinkle: {
					"0%, 100%": { opacity: "0.5" },
					"50%": { opacity: "1" },
				},
				aurora: {
					"0%": { backgroundPosition: "0% 50%" },
					"50%": { backgroundPosition: "100% 50%" },
					"100%": { backgroundPosition: "0% 50%" },
				},
			},
		},
	},
	plugins: [],
};

export default config;
