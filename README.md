<p align="right">
<img src="docs/logo.svg" alt="Jenyx Logo" width="120">
</p>

# Speech to Text

**Speech to Text** is an application developed using the [Jenyx](https://github.com/jenyxjs/jenyx) library. It provides a user-friendly interface to convert speech into text using modern web technologies.

The screenshot below demonstrates the main interface of the Speech to Text application, showcasing its layout and core functionality:

![Screenshot](docs/screenshot.png)

## Code Overview

Here’s a brief overview of the main components and their roles in the application:

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

To see the application in action, visit the live demo [live demo](https://jenyxjs.github.io/speech-to-text/www/app.html).


## Library Repository

For more information about the project, documentation, and contribution guidelines, please visit the [Jenyx library repository](https://github.com/jenyxjs/jenyx).

## License

This project is licensed under the MIT License.
