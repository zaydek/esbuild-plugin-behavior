// Command: node esbuild.js

// https://esbuild.github.io/plugins/#using-plugins
const envPlugin = {
	// Intentionally uses names instead of name to break esbuild; the intent is to
	// make sure esbuild emits errors whether or not plugins are being used.
	names: "env",
	setup(build) {
		build.onResolve({ filter: /^env$/ }, args => ({
			path: args.path,
			namespace: "env-ns",
		}))
		build.onLoad({ filter: /.*/, namespace: "env-ns" }, () => ({
			contents: JSON.stringify(process.env),
			loader: "json",
		}))
	},
}

require("esbuild")
	.build({
		bundle: true,
		entryPoints: ["in/app.js"],
		logLevel: "silent",
		outfile: "out/out.js",
		// plugins: [envPlugin],
	})
	.catch(err => {
		console.log({ err })
	})

// I get expected output when plugins are disabled (commented out). This is
// what I expect; the error is an object that has properties .errors and
// .warnings which I can use.
//
// {
//   err: Error: Build failed with 1 error:
//   in/app.js:1:7: error: Expected ";" but found "{"
//       at failureErrorWithLog (/Users/zaydek/github/retro-plugin-arch/node_modules/esbuild/lib/main.js:1124:15)
//       at buildResponseToResult (/Users/zaydek/github/retro-plugin-arch/node_modules/esbuild/lib/main.js:879:32)
//       at /Users/zaydek/github/retro-plugin-arch/node_modules/esbuild/lib/main.js:974:20
//       at /Users/zaydek/github/retro-plugin-arch/node_modules/esbuild/lib/main.js:541:9
//       at handleIncomingPacket (/Users/zaydek/github/retro-plugin-arch/node_modules/esbuild/lib/main.js:624:9)
//       at Socket.readFromStdout (/Users/zaydek/github/retro-plugin-arch/node_modules/esbuild/lib/main.js:508:7)
//       at Socket.emit (node:events:329:20)
//       at addChunk (node:internal/streams/readable:304:12)
//       at readableAddChunk (node:internal/streams/readable:279:9)
//       at Socket.Readable.push (node:internal/streams/readable:218:10) {
//     errors: [ [Object] ],
//     warnings: []
//   }
// }
//
// I get unexpected output when plugins are enabled. This is undesirable because
// I want to be able to introspect on .errors and .warnings.
//
// {
//   err: Error: Plugin at index 0 is missing a name
//       at handlePlugins (/Users/zaydek/github/retro-plugin-arch/node_modules/esbuild/lib/main.js:642:15)
//       at Object.buildOrServe (/Users/zaydek/github/retro-plugin-arch/node_modules/esbuild/lib/main.js:872:26)
//       at /Users/zaydek/github/retro-plugin-arch/node_modules/esbuild/lib/main.js:1344:17
//       at new Promise (<anonymous>)
//       at Object.build (/Users/zaydek/github/retro-plugin-arch/node_modules/esbuild/lib/main.js:1343:14)
//       at Object.build (/Users/zaydek/github/retro-plugin-arch/node_modules/esbuild/lib/main.js:1204:26)
//       at /Users/zaydek/github/retro-plugin-arch/node_modules/esbuild/lib/main.js:1252:67
//       at processTicksAndRejections (node:internal/process/task_queues:93:5)
// }
//
