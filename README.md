<div align="center">

# MAAS React Components

<br />
<img src="https://assets.ubuntu.com/v1/142ae045-Canonical%20MAAS.png" alt="Canonical MAAS" width="180" />

<br />
<br />

Library of React components for use in MAAS UI projects.

It contains components that are either specific to, or only used in MAAS. <br /> General purpose components should be added to
[@canonical/react-components](https://github.com/canonical/react-components) instead.

 **[Storybook](https://canonical.github.io/maas-react-components/)** | **[Philosophy and guidelines](GUIDELINES.md)**

<hr />

</div>

## Getting started

### Installation

```bash
npm install @canonical/maas-react-components
```

or using yarn:
  
```bash
yarn add @canonical/maas-react-components
```

Add styles import to your app:

```css
@import "@canonical/maas-react-components/dist/style.css";
```

## Development with `maas-react-components`

To see the changes you make to `maas-react-components` reflected in a consuming app immediately, follow these steps:

1. In the `maas-react-components` directory, run the following command to create a symlink:

   ```bash
   yarn link
   ```

2. In the consuming repository (e.g., `maas-ui`), run the following command to use the local version of `maas-react-components`:

   ```bash
   yarn link "@canonical/maas-react-components"
   ```

3. Go back to `maas-react-components` directory and run the following command to start the build process with the watch flag:

   ```bash
   npm run build:watch
   ```

4. As you make changes to `maas-react-components` they will be automatically built and reflected in the consuming app.

### Creating a new component

Make sure to read our **[React Components Guidelines](GUIDELINES.md)** before you proceed.

Run the following command from the root of the project:

`npm run create-component`

The script will prompt you to enter details of the new component.

It will create a new directory and files based on the details you provided. New files will contain a basic setup for your new component, including a basic test and a storybook story.
