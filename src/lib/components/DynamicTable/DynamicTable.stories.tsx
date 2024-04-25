import { Button, Icon } from "@canonical/react-components";
import { Meta, StoryObj } from "@storybook/react";

import { DynamicTable } from "@/lib/components/DynamicTable/DynamicTable";

const data = Array.from({ length: 25 }, (_, index) => ({
  fqdn: `machine-${index}`,
  ipAddress: `192.168.1.${index}`,
  zone: `zone-${index}`,
  owner: `owner-${index}`,
}));

const meta: Meta<typeof DynamicTable> = {
  title: "components/DynamicTable",
  component: DynamicTable,
  tags: ["autodocs"],
};

export default meta;

export const Example: StoryObj<typeof DynamicTable> = {
  args: {
    className: "machines-table",
    variant: "full-height",
    children: (
      <>
        <thead>
          <tr>
            <th>FQDN</th>
            <th>IP address</th>
            <th>Zone</th>
            <th>Owner</th>
            <th>Actions</th>
          </tr>
        </thead>
        <DynamicTable.Body>
          {data.map((item) => (
            <tr key={item.fqdn}>
              <td>{item.fqdn}</td>
              <td>{item.fqdn}</td>
              <td>{item.fqdn}</td>
              <td>{item.fqdn}</td>
              <td>
                <Button
                  appearance="base"
                  style={{ marginBottom: 0, padding: 0 }}
                >
                  <Icon name="delete" />
                </Button>
              </td>
            </tr>
          ))}
        </DynamicTable.Body>
      </>
    ),
  },
};

export const TwoTablesExample: StoryObj<typeof DynamicTable> = {
  render: (args) => <div>{args.children}</div>,
  args: {
    children: (
      <>
        <DynamicTable className="first-table" variant="regular">
          <thead>
            <tr>
              <th>FQDN</th>
              <th>IP address</th>
              <th>Zone</th>
              <th>Owner</th>
              <th>Actions</th>
            </tr>
          </thead>
          <DynamicTable.Body>
            {data.slice(0, 10).map((item) => (
              <tr key={item.fqdn}>
                <td>{item.fqdn}</td>
                <td>{item.ipAddress}</td>
                <td>{item.zone}</td>
                <td>{item.owner}</td>
                <td>
                  <Button
                    appearance="base"
                    style={{ marginBottom: 0, padding: 0 }}
                  >
                    <Icon name="delete" />
                  </Button>
                </td>
              </tr>
            ))}
          </DynamicTable.Body>
        </DynamicTable>
        <DynamicTable className="second-table" variant="regular">
          <thead>
            <tr>
              <th>FQDN</th>
              <th>IP address</th>
              <th>Zone</th>
              <th>Owner</th>
              <th>Actions</th>
            </tr>
          </thead>
          <DynamicTable.Body>
            {data.slice(10, 20).map((item) => (
              <tr key={item.fqdn}>
                <td>{item.fqdn}</td>
                <td>{item.ipAddress}</td>
                <td>{item.zone}</td>
                <td>{item.owner}</td>
                <td>
                  <Button
                    appearance="base"
                    style={{ marginBottom: 0, padding: 0 }}
                  >
                    <Icon name="delete" />
                  </Button>
                </td>
              </tr>
            ))}
          </DynamicTable.Body>
        </DynamicTable>
      </>
    ),
  },
};
