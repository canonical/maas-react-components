# Project philosophy and guidelines

## Guiding principles

The primary goal of this library is to address the issue of duplicated React components across MAAS UI projects and encourage better component design and separation of concerns.

It is not meant to be a replacement for @canonical/react-components.

This library contains either components that are specific to, or only used in MAAS, such as components not yet approved by the design team for wide use across all web team sites and applications. General purpose components should be added to @canonical/react-components and not @canonical/maas-react-components.

We encourage separation of concerns by creating container and presentational components (only presentational components can be easily added to the library and application-specific logic should live within the application). For more details, refer to the [Compound components](#compound-components) section.

## Guidelines

### React Components

#### Categories

Components in this library are grouped into 3 categories characterized by different levels of component complexity. This idea is borrowed from atomic design, but we decided not to use its terminology and use something that’s closer to vanilla framework for consistency.

- Elements
- Components
- Sections
- Layout

#### MAAS - specific Components

Each component added to the library needs must meet the following criteria:

- Contains characteristics that are unique to MAAS
- Used in multiple MAAS UI projects
- Cannot be easily generalized for use across all Canonical web projects

#### Components planned for wider use

It is acceptable to initially add a component to the MAAS React Component Library, even if it is known or planned for wider use. However, this should be clearly documented and communicated to the relevant team members.

Every such component should be labeled as "candidate"  in the live documentation indicating that they're a candidate for wider use. This is to ensure that those components are revisited regularly and eventually either migrated to @canonical/react-component or have the label removed.

#### Recommended patterns

##### Compound components

Involves breaking components into smaller, complementary parts that work together. The parent component serves as a container that provides shared state and logic. Child components get this information through context or props.

Follow this pattern for more complex components, such that require customisation of all of their sub-components. Combine it with “as” prop to allow easy replacement of the underlying element or component type.

Every component should meet the following requirements:

- Each component maps directly to the vanilla component equivalent allowing to customize its styles further.

- It should be possible to pass custom classes to each of the underlying BEM elements directly via className prop.
