package g42

// G42 Jais model list — OpenAI-compatible API
// https://api.g42.ai
var ModelList = []string{
	// Jais language models
	"jais-30b-chat",
	"jais-30b",
	"jais-13b-chat",
	"jais-13b",
	"jais-70b-chat",
	"jais-70b",

	// Jais evolved / adapted variants
	"jais-adapted-7b",
	"jais-adapted-13b",
	"jais-adapted-30b",

	// Multilingual models
	"jais-family-30b-8k",
	"jais-family-30b-16k",

	// Embedding models
	"jais-embedding-v1",
}

var ChannelName = "g42"
