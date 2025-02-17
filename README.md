<p align="right">
<img src="docs/logo.svg" alt="Jenyx Logo" width="120">
</p>

# Speech to Text

The Jenyx library provides universal components for creating various applications in JavaScript.

This screenshot demonstrates the main interface of the Speech to Text application, showcasing its layout and core functionality.

![Screenshot](docs/screenshot.png)

```js
export class App extends AbstractApp {
    constructor(root) {
        super({
            initCssTheme: {
                class: InitCssTheme,
            },
            pwa: {
                class: Pwa,
                serviceWorkerFileName: './serviceWorker.js',
            },
            speechRecognition: {
                class: SpeechRecognition,
            },
            layout: {
                class: Layout,
            }
        });
    }
}
```

Visit the [live demo](https://jenyxjs.github.io/speech-to-text/www/app.html) to see it in action.


## Library Repository

Visit the [library repository](https://github.com/jenyxjs/jenyx) to learn more about the project, its documentation

## License

This project is licensed under the MIT License.
